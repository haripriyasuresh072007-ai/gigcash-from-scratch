const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/score/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    // Get recent income
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
      return res.status(404).json({
        success: false,
        error: "No income data found for this user",
      });
    }

    const incomes = incomeResult.rows.map(
      (row) => Number(row.amount_paise) / 100
    );

    const averageIncome =
      incomes.reduce((sum, income) => sum + income, 0) /
      incomes.length;

    const essentialExpenses = 4500;

    // 1. Income Stability: 0–130
    const variance =
      incomes.reduce(
        (sum, income) => sum + Math.pow(income - averageIncome, 2),
        0
      ) / incomes.length;

    const standardDeviation = Math.sqrt(variance);

    const coefficientOfVariation =
      averageIncome > 0
        ? standardDeviation / averageIncome
        : 1;

    const incomeStabilityPoints = Math.max(
      0,
      Math.min(
        130,
        Math.round(130 * (1 - coefficientOfVariation))
      )
    );

    // 2. Expense Coverage: 0–110
    const coverageRatio =
      essentialExpenses > 0
        ? averageIncome / essentialExpenses
        : 0;

    const expenseCoveragePoints = Math.max(
      0,
      Math.min(
        110,
        Math.round((coverageRatio / 2) * 110)
      )
    );

    // 3. Repayment Capacity: 0–105
    const maxWeeklyRepayment = Math.floor(
      averageIncome * 0.2
    );

    const repaymentCapacityPoints =
      maxWeeklyRepayment >= 1000
        ? 105
        : Math.round(
            (maxWeeklyRepayment / 1000) * 105
          );

    // 4. Buffer Protection: 0–90
    const safeToUseAmount = Math.max(
      0,
      averageIncome - essentialExpenses
    );

    const safeToSaveAmount = Math.floor(
      safeToUseAmount * 0.2
    );

    const bufferProtectionPoints = Math.min(
      90,
      Math.round(
        (safeToSaveAmount / 500) * 90
      )
    );

    // 5. Responsible Borrowing: 0–80
    const loanResult = await pool.query(
      `
      SELECT COUNT(*) AS loan_count
      FROM loans
      WHERE user_id = $1
      `,
      [userId]
    );

    const loanCount = Number(
      loanResult.rows[0].loan_count
    );

    const responsibleBorrowingPoints =
      loanCount === 0
        ? 80
        : Math.max(
            40,
            80 - loanCount * 10
          );

    // Final score
    const rawScore =
      300 +
      incomeStabilityPoints +
      expenseCoveragePoints +
      repaymentCapacityPoints +
      bufferProtectionPoints +
      responsibleBorrowingPoints;

    const score = Math.max(
      300,
      Math.min(850, rawScore)
    );

    const breakdownTotal =
      incomeStabilityPoints +
      expenseCoveragePoints +
      repaymentCapacityPoints +
      bufferProtectionPoints +
      responsibleBorrowingPoints;

    // Save score history
    await pool.query(
      `
      INSERT INTO score_history
      (
        user_id,
        score,
        income_stability_points,
        expense_coverage_points,
        repayment_capacity_points,
        buffer_protection_points,
        responsible_borrowing_points
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        userId,
        score,
        incomeStabilityPoints,
        expenseCoveragePoints,
        repaymentCapacityPoints,
        bufferProtectionPoints,
        responsibleBorrowingPoints,
      ]
    );

    res.json({
      success: true,
      userId,
      score,
      scoreRange: "300-850",

      breakdown: {
        incomeStability: incomeStabilityPoints,
        expenseCoverage: expenseCoveragePoints,
        repaymentCapacity: repaymentCapacityPoints,
        bufferProtection: bufferProtectionPoints,
        responsibleBorrowing: responsibleBorrowingPoints,
      },

      breakdownPoints: breakdownTotal,

      explanation: {
        incomeStability:
          "Based on variation in recent weekly income.",
        expenseCoverage:
          "Measures how comfortably average income covers essential expenses.",
        repaymentCapacity:
          "Based on protected weekly repayment capacity of 20% of average income.",
        bufferProtection:
          "Rewards maintaining a safe amount available for emergencies.",
        responsibleBorrowing:
          "Rewards limited borrowing activity and responsible loan usage.",
      },

      financialSnapshot: {
        averageWeeklyIncome: Math.floor(
          averageIncome
        ),
        essentialExpenses,
        safeToUseAmount: Math.floor(
          safeToUseAmount
        ),
        safeToSaveAmount,
        maxWeeklyRepayment,
      },
    });
  } catch (error) {
    console.error(
      "Score calculation error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Unable to calculate GigCash score",
    });
  }
});

module.exports = router;