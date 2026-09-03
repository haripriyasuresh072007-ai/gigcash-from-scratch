const express = require("express");
const { z } = require("zod");
const pool = require("../db");

const router = express.Router();

const incomeSyncSchema = z.object({
  userId: z.number().int().positive(),
  source: z.string().min(1),
  weeklyEarnings: z
    .array(
      z.object({
        week: z.string().min(1),
        amount: z.number().int().nonnegative(),
      })
    )
    .min(1),
});

// POST /api/income/sync
router.post("/sync", async (req, res) => {
  try {
    const result = incomeSyncSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const { userId, source, weeklyEarnings } = result.data;

    // Check user
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Save income snapshots
    for (const earning of weeklyEarnings) {
      await pool.query(
        `
        INSERT INTO income_snapshots
        (user_id, source, week, amount_paise)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, week)
        DO UPDATE SET
          source = EXCLUDED.source,
          amount_paise = EXCLUDED.amount_paise
        `,
        [userId, source, earning.week, earning.amount * 100]
      );
    }

    /*
      🌧️ AUTOMATIC RAINY-DAY DETECTION

      Rule:
      latest weekly income < 50% of average weekly income

      The backend automatically pauses the next repayment.
      No client-side pause request is required.
    */

    const incomeResult = await pool.query(
      `
      SELECT week, amount_paise
      FROM income_snapshots
      WHERE user_id = $1
      ORDER BY week DESC
      `,
      [userId]
    );

    const incomes = incomeResult.rows.map((row) => ({
      week: row.week,
      amount: Number(row.amount_paise) / 100,
    }));

    let rainyDay = {
      detected: false,
      currentWeekIncome: incomes[0]?.amount || 0,
      averageWeeklyIncome: 0,
      threshold: 0,
      shortfall: 0,
      loanId: null,
    };

    if (incomes.length > 0) {
      const averageWeeklyIncome =
        incomes.reduce((sum, item) => sum + item.amount, 0) /
        incomes.length;

      const currentWeekIncome = incomes[0].amount;

      const threshold = Math.floor(averageWeeklyIncome * 0.5);

      const rainyDayDetected = currentWeekIncome < threshold;

      rainyDay = {
        detected: rainyDayDetected,
        currentWeekIncome,
        averageWeeklyIncome: Math.floor(averageWeeklyIncome),
        threshold,
        shortfall: Math.max(0, threshold - currentWeekIncome),
        loanId: null,
      };

      // Automatically pause the next scheduled repayment
      if (rainyDayDetected) {
        const activeLoanResult = await pool.query(
          `
          SELECT id
          FROM loans
          WHERE user_id = $1
            AND status = 'active'
            AND auto_paused = false
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [userId]
        );

        if (activeLoanResult.rows.length > 0) {
          const loanId = activeLoanResult.rows[0].id;

          const nextRepaymentResult = await pool.query(
            `
            SELECT id, week_number
            FROM repayments
            WHERE loan_id = $1
              AND status IN ('current', 'upcoming')
            ORDER BY week_number ASC
            LIMIT 1
            `,
            [loanId]
          );

          if (nextRepaymentResult.rows.length > 0) {
            const repayment = nextRepaymentResult.rows[0];

            await pool.query(
              `
              UPDATE repayments
              SET status = 'auto-paused'
              WHERE id = $1
              `,
              [repayment.id]
            );

            await pool.query(
              `
              UPDATE loans
              SET
                auto_paused = true,
                pause_reason = 'income_below_50pct_average'
              WHERE id = $1
              `,
              [loanId]
            );

            rainyDay.loanId = loanId;
          }
        }
      }
    }

    res.json({
      success: true,
      message: "Income synced successfully",
      weeksSynced: weeklyEarnings.length,
      rainyDay,
    });
  } catch (error) {
    console.error("Income sync error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to sync income",
    });
  }
});

// GET /api/income/summary/:userId
router.get("/summary/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const incomeResult = await pool.query(
      `
      SELECT amount_paise
      FROM income_snapshots
      WHERE user_id = $1
      ORDER BY week DESC
      `,
      [userId]
    );

    if (incomeResult.rows.length === 0) {
      return res.json({
        success: true,
        averageWeeklyIncome: 0,
        essentialExpenses: 0,
        safeToUseAmount: 0,
        safeToSaveAmount: 0,
      });
    }

    const amounts = incomeResult.rows.map(
      (row) => Number(row.amount_paise) / 100
    );

    const averageWeeklyIncome =
      amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;

    const essentialExpenses = 4500;

    const safeToUseAmount = Math.max(
      0,
      Math.floor(averageWeeklyIncome - essentialExpenses)
    );

    const safeToSaveAmount = Math.floor(safeToUseAmount * 0.2);

    res.json({
      success: true,
      averageWeeklyIncome: Math.floor(averageWeeklyIncome),
      essentialExpenses,
      safeToUseAmount,
      safeToSaveAmount,
    });
  } catch (error) {
    console.error("Income summary error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to calculate income summary",
    });
  }
});

module.exports = router;