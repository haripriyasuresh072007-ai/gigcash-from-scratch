console.log("LOAN ROUTES LOADED");

const express = require("express");
const { z } = require("zod");
const pool = require("../db");

const router = express.Router();

const STANDARD_PERIODS = [2, 4, 6, 8];

const quoteSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().int().min(500).max(5000),
  repaymentPeriodWeeks: z.number().int().positive(),
});

const applySchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().int().min(500).max(5000),
  purpose: z.string().min(1).max(100),
  repaymentPeriodWeeks: z.number().int().positive(),
});

const repaySchema = z.object({
  weekNumber: z.number().int().positive(),
});

// -----------------------------------------
// POST /api/loan/quote
// -----------------------------------------
router.post("/quote", async (req, res) => {
  try {
    const result = quoteSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const {
      userId,
      amount,
      repaymentPeriodWeeks,
    } = result.data;

    const userResult = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const incomeResult = await pool.query(
      `
      SELECT amount_paise
      FROM income_snapshots
      WHERE user_id = $1
      ORDER BY week DESC
      LIMIT 8
      `,
      [userId]
    );

    if (incomeResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No income data found for this user",
      });
    }

    const incomes = incomeResult.rows.map(
      (row) => Number(row.amount_paise) / 100
    );

    const averageWeeklyIncome =
      incomes.reduce(
        (sum, income) => sum + income,
        0
      ) / incomes.length;

    const maxWeeklyRepayment = Math.floor(
      averageWeeklyIncome * 0.2
    );

    const weeklyRepayment = Math.ceil(
      amount / repaymentPeriodWeeks
    );

    const validPeriods = STANDARD_PERIODS.filter(
      (period) =>
        Math.ceil(amount / period) <=
        maxWeeklyRepayment
    );

    if (weeklyRepayment > maxWeeklyRepayment) {
      const minValidPeriod =
        validPeriods.length > 0
          ? Math.min(...validPeriods)
          : null;

      return res.status(400).json({
        success: false,
        error:
          "Weekly repayment exceeds GigCash's protected 20% income cap.",
        requestedAmount: amount,
        requestedPeriodWeeks:
          repaymentPeriodWeeks,
        requestedWeeklyRepayment:
          weeklyRepayment,
        maxWeeklyRepayment,
        validPeriods,
        minValidPeriod,
      });
    }

    res.json({
      success: true,
      quote: {
        userId,
        amount,
        repaymentPeriodWeeks,
        weeklyRepayment,
        maxWeeklyRepayment,
        validPeriods,
        protectedByIncomeCap: true,
      },
    });
  } catch (error) {
    console.error("Loan quote error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to generate loan quote",
    });
  }
});

// -----------------------------------------
// POST /api/loan/apply
// -----------------------------------------
router.post("/apply", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = applySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const {
      userId,
      amount,
      purpose,
      repaymentPeriodWeeks,
    } = result.data;

    if (!STANDARD_PERIODS.includes(repaymentPeriodWeeks)) {
      return res.status(400).json({
        success: false,
        error:
          "Repayment period must be 2, 4, 6, or 8 weeks.",
        validPeriods: STANDARD_PERIODS,
      });
    }

    const userResult = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const incomeResult = await client.query(
      `
      SELECT amount_paise
      FROM income_snapshots
      WHERE user_id = $1
      ORDER BY week DESC
      LIMIT 8
      `,
      [userId]
    );

    if (incomeResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No income data found for this user",
      });
    }

    const incomes = incomeResult.rows.map(
      (row) => Number(row.amount_paise) / 100
    );

    const averageWeeklyIncome =
      incomes.reduce(
        (sum, income) => sum + income,
        0
      ) / incomes.length;

    const maxWeeklyRepayment = Math.floor(
      averageWeeklyIncome * 0.2
    );

    const weeklyRepayment = Math.ceil(
      amount / repaymentPeriodWeeks
    );

    // HARD 20% CAP
    if (weeklyRepayment > maxWeeklyRepayment) {
      const validPeriods =
        STANDARD_PERIODS.filter(
          (period) =>
            Math.ceil(amount / period) <=
            maxWeeklyRepayment
        );

      return res.status(400).json({
        success: false,
        error:
          "Loan rejected because weekly repayment exceeds the protected 20% income cap.",
        requestedAmount: amount,
        requestedPeriodWeeks:
          repaymentPeriodWeeks,
        requestedWeeklyRepayment:
          weeklyRepayment,
        maxWeeklyRepayment,
        validPeriods,
      });
    }

    const amountPaise = amount * 100;

    const weeklyRepaymentPaise =
      weeklyRepayment * 100;

    const maxWeeklyRepaymentPaise =
      maxWeeklyRepayment * 100;

    await client.query("BEGIN");

    // Create loan
    const loanResult = await client.query(
      `
      INSERT INTO loans
      (
        user_id,
        amount_paise,
        purpose,
        repayment_period_weeks,
        weekly_repayment_paise,
        status,
        max_weekly_repayment_paise
      )
      VALUES ($1, $2, $3, $4, $5, 'active', $6)
      RETURNING
        id,
        user_id,
        amount_paise,
        purpose,
        repayment_period_weeks,
        weekly_repayment_paise,
        status,
        max_weekly_repayment_paise,
        auto_paused,
        pause_reason,
        created_at
      `,
      [
        userId,
        amountPaise,
        purpose,
        repaymentPeriodWeeks,
        weeklyRepaymentPaise,
        maxWeeklyRepaymentPaise,
      ]
    );

    const loan = loanResult.rows[0];

    // Create repayment schedule
    for (
      let weekNumber = 1;
      weekNumber <= repaymentPeriodWeeks;
      weekNumber++
    ) {
      await client.query(
        `
        INSERT INTO repayments
        (
          loan_id,
          week_number,
          amount_paise,
          status
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          loan.id,
          weekNumber,
          weeklyRepaymentPaise,
          weekNumber === 1
            ? "current"
            : "upcoming",
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Loan application approved",
      loan: {
        id: loan.id,
        userId: loan.user_id,
        amount:
          Number(loan.amount_paise) / 100,
        purpose: loan.purpose,
        repaymentPeriodWeeks:
          loan.repayment_period_weeks,
        weeklyRepayment:
          Number(
            loan.weekly_repayment_paise
          ) / 100,
        maxWeeklyRepayment:
          Number(
            loan.max_weekly_repayment_paise
          ) / 100,
        status: loan.status,
        autoPaused: loan.auto_paused,
        pauseReason: loan.pause_reason,
        protectedByIncomeCap: true,
        createdAt: loan.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Loan application error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Unable to apply for loan",
    });
  } finally {
    client.release();
  }
});

// -----------------------------------------
// GET /api/loan/:id/schedule
// -----------------------------------------
router.get("/:id/schedule", async (req, res) => {
  try {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid loan ID",
      });
    }

    const loanResult = await pool.query(
      `
      SELECT
        id,
        amount_paise,
        repayment_period_weeks,
        weekly_repayment_paise,
        status,
        auto_paused,
        pause_reason
      FROM loans
      WHERE id = $1
      `,
      [loanId]
    );

    if (loanResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Loan not found",
      });
    }

    const loan = loanResult.rows[0];

    const repaymentResult = await pool.query(
      `
      SELECT
        week_number,
        amount_paise,
        status,
        scheduled_date,
        paid_at
      FROM repayments
      WHERE loan_id = $1
      ORDER BY week_number ASC
      `,
      [loanId]
    );

    const schedule = repaymentResult.rows.map(
      (repayment) => ({
        weekNumber:
          repayment.week_number,
        amount:
          Number(repayment.amount_paise) / 100,
        status: repayment.status,
        scheduledDate:
          repayment.scheduled_date,
        paidAt: repayment.paid_at,
      })
    );

    res.json({
      success: true,
      loanId: loan.id,
      totalAmount:
        Number(loan.amount_paise) / 100,
      repaymentPeriodWeeks:
        loan.repayment_period_weeks,
      weeklyRepayment:
        Number(
          loan.weekly_repayment_paise
        ) / 100,
      status: loan.status,
      autoPaused: loan.auto_paused,
      pauseReason: loan.pause_reason,
      schedule,
    });
  } catch (error) {
    console.error(
      "Schedule error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        "Unable to generate repayment schedule",
    });
  }
});

// -----------------------------------------
// POST /api/loan/:id/repay
// -----------------------------------------
router.post("/:id/repay", async (req, res) => {
  const client = await pool.connect();

  try {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid loan ID",
      });
    }

    const result = repaySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const { weekNumber } = result.data;

    const loanResult = await client.query(
      `
      SELECT
        id,
        repayment_period_weeks,
        weekly_repayment_paise,
        status,
        auto_paused
      FROM loans
      WHERE id = $1
      `,
      [loanId]
    );

    if (loanResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Loan not found",
      });
    }

    const loan = loanResult.rows[0];

    if (
      weekNumber > loan.repayment_period_weeks
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid repayment week",
      });
    }

    if (loan.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Loan is not active",
      });
    }

    if (loan.auto_paused) {
      return res.status(400).json({
        success: false,
        error:
          "Repayment is currently paused. Resume the loan before making this payment.",
      });
    }

    const existingRepayment =
      await client.query(
        `
        SELECT id, status
        FROM repayments
        WHERE loan_id = $1
        AND week_number = $2
        `,
        [loanId, weekNumber]
      );

    if (existingRepayment.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          "Repayment schedule entry not found",
      });
    }

    if (
      existingRepayment.rows[0].status ===
      "paid"
    ) {
      return res.status(400).json({
        success: false,
        error:
          "This repayment week is already paid",
      });
    }

    await client.query("BEGIN");

    const repaymentResult = await client.query(
      `
      UPDATE repayments
      SET
        status = 'paid',
        paid_at = CURRENT_TIMESTAMP
      WHERE loan_id = $1
      AND week_number = $2
      RETURNING
        id,
        loan_id,
        week_number,
        amount_paise,
        status,
        paid_at
      `,
      [loanId, weekNumber]
    );

    // Mark the next unpaid week as current
    await client.query(
      `
      UPDATE repayments
      SET status = 'current'
      WHERE loan_id = $1
      AND week_number = (
        SELECT MIN(week_number)
        FROM repayments
        WHERE loan_id = $1
        AND status <> 'paid'
      )
      `,
      [loanId]
    );

    const countResult = await client.query(
      `
      SELECT COUNT(*) AS paid_count
      FROM repayments
      WHERE loan_id = $1
      AND status = 'paid'
      `,
      [loanId]
    );

    const paidCount = Number(
      countResult.rows[0].paid_count
    );

    let loanStatus = "active";

    if (
      paidCount >=
      loan.repayment_period_weeks
    ) {
      loanStatus = "completed";

      await client.query(
        `
        UPDATE loans
        SET status = 'completed'
        WHERE id = $1
        `,
        [loanId]
      );
    }

    await client.query("COMMIT");

    const repayment =
      repaymentResult.rows[0];

    res.json({
      success: true,
      message:
        "Repayment recorded successfully",
      repayment: {
        id: repayment.id,
        loanId: repayment.loan_id,
        weekNumber:
          repayment.week_number,
        amount:
          Number(repayment.amount_paise) /
          100,
        status: repayment.status,
        paidAt: repayment.paid_at,
      },
      loanStatus,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Repayment error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        "Unable to record repayment",
    });
  } finally {
    client.release();
  }
});

// -----------------------------------------
// GET /api/loan/:id/status
// -----------------------------------------
router.get("/:id/status", async (req, res) => {
  try {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid loan ID",
      });
    }

    const loanResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        status,
        auto_paused,
        pause_reason
      FROM loans
      WHERE id = $1
      `,
      [loanId]
    );

    if (loanResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Loan not found",
      });
    }

    const loan = loanResult.rows[0];

    const incomeResult = await pool.query(
      `
      SELECT amount_paise
      FROM income_snapshots
      WHERE user_id = $1
      ORDER BY week DESC
      LIMIT 1
      `,
      [loan.user_id]
    );

    const averageResult = await pool.query(
      `
      SELECT AVG(amount_paise) AS average_income
      FROM income_snapshots
      WHERE user_id = $1
      `,
      [loan.user_id]
    );

    const currentWeekIncome =
      incomeResult.rows.length > 0
        ? Math.floor(
            Number(
              incomeResult.rows[0].amount_paise
            ) / 100
          )
        : 0;

    const averageWeeklyIncome =
      averageResult.rows[0]?.average_income
        ? Math.floor(
            Number(
              averageResult.rows[0].average_income
            ) / 100
          )
        : 0;

    const threshold = Math.floor(
      averageWeeklyIncome * 0.5
    );

    const shortfall = Math.max(
      0,
      threshold - currentWeekIncome
    );

    res.json({
      success: true,
      loanId: loan.id,
      status: loan.status,
      paused: loan.auto_paused,
      autoPaused: loan.auto_paused,
      reason: loan.pause_reason,
      currentWeekIncome,
      averageWeeklyIncome,
      threshold,
      shortfall,
      resumeAvailable:
        loan.auto_paused &&
        loan.status === "active",
    });
  } catch (error) {
    console.error(
      "Loan status error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Unable to get loan status",
    });
  }
});

// -----------------------------------------
// POST /api/loan/:id/resume
// -----------------------------------------
router.post("/:id/resume", async (req, res) => {
  const client = await pool.connect();

  try {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid loan ID",
      });
    }

    const loanResult = await client.query(
      `
      SELECT
        id,
        status,
        auto_paused,
        pause_reason
      FROM loans
      WHERE id = $1
      `,
      [loanId]
    );

    if (loanResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Loan not found",
      });
    }

    const loan = loanResult.rows[0];

    if (loan.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Only active loans can be resumed",
      });
    }

    if (!loan.auto_paused) {
      return res.status(400).json({
        success: false,
        error: "Loan is not currently paused",
      });
    }

    const pausedRepaymentResult =
      await client.query(
        `
        SELECT id, week_number
        FROM repayments
        WHERE loan_id = $1
          AND status = 'auto-paused'
        ORDER BY week_number ASC
        LIMIT 1
        `,
        [loanId]
      );

    if (pausedRepaymentResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No paused repayment found",
      });
    }

    const pausedRepayment =
      pausedRepaymentResult.rows[0];

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE repayments
      SET status = 'current'
      WHERE id = $1
      `,
      [pausedRepayment.id]
    );

    await client.query(
      `
      UPDATE loans
      SET
        auto_paused = false,
        pause_reason = NULL
      WHERE id = $1
      `,
      [loanId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        "Loan repayment resumed successfully",
      loanId,
      resumedWeekNumber:
        pausedRepayment.week_number,
      loanStatus: "active",
      autoPaused: false,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Loan resume error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Unable to resume loan",
    });
  } finally {
    client.release();
  }
});

module.exports = router;