const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/admin/applications
router.get("/applications", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        l.id AS loan_id,
        l.user_id,
        u.phone,
        l.amount_paise,
        l.repayment_period_weeks,
        l.status AS loan_status,

        sh.score,
        sh.income_stability_points,
        sh.expense_coverage_points,
        sh.repayment_capacity_points,
        sh.buffer_protection_points,
        sh.responsible_borrowing_points

      FROM loans l

      JOIN users u
        ON u.id = l.user_id

      LEFT JOIN LATERAL (
        SELECT *
        FROM score_history
        WHERE user_id = l.user_id
        ORDER BY created_at DESC
        LIMIT 1
      ) sh
        ON true

      ORDER BY l.created_at DESC
    `);

    const applications = result.rows.map((row) => {
      const amount = row.amount_paise / 100;

      const score = row.score
        ? Number(row.score)
        : 300;

      const breakdownPoints =
        Number(row.income_stability_points || 0) +
        Number(row.expense_coverage_points || 0) +
        Number(row.repayment_capacity_points || 0) +
        Number(row.buffer_protection_points || 0) +
        Number(row.responsible_borrowing_points || 0);

      const incomeStability = Number(
        row.income_stability_points || 0
      );

      const repaymentCapacity = Number(
        row.repayment_capacity_points || 0
      );

      let decision = "Eligible";
      let anomaly = "Clear";
      let reason =
        "Income stability and repayment capacity are within the responsible borrowing range.";

      // Responsible decision rules
      if (score < 600) {
        decision = "Under Review";
        reason =
          "GigCash Score is below the preferred lending range, so the application requires review.";
      } else if (repaymentCapacity < 60) {
        decision = "Under Review";
        reason =
          "Repayment capacity is relatively low compared with the requested borrowing amount.";
      } else if (amount > 1500 && score < 700) {
        decision = "Under Review";
        reason =
          "The requested amount is high relative to the worker's current risk profile.";
      }

      // Simple explainable anomaly rule
      if (incomeStability < 50) {
        anomaly = "Review";

        if (decision === "Eligible") {
          decision = "Under Review";
        }

        reason =
          "Recent income stability is weaker than the preferred range, so the application requires review.";
      }

      return {
        loanId: row.loan_id,
        userId: row.user_id,
        worker: `Worker ${row.user_id}`,
        phone: row.phone,

        amount,

        repaymentPeriodWeeks:
          row.repayment_period_weeks,

        loanStatus: row.loan_status,

        score,

        breakdownPoints,

        breakdown: {
          incomeStability,
          expenseCoverage: Number(
            row.expense_coverage_points || 0
          ),
          repaymentCapacity,
          bufferProtection: Number(
            row.buffer_protection_points || 0
          ),
          responsibleBorrowing: Number(
            row.responsible_borrowing_points || 0
          ),
        },

        anomaly,
        decision,
        reason,
      };
    });

    res.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Admin applications error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch admin applications",
    });
  }
});

module.exports = router;