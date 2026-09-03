const express = require("express");
const { z } = require("zod");
const pool = require("../db");

const router = express.Router();

const bridgeRequestSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().int().min(500).max(1500),
});

// POST /api/bridge/request
router.post("/request", async (req, res) => {
  try {
    const validation = bridgeRequestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Amount must be between ₹500 and ₹1,500.",
      });
    }

    const { userId, amount } = validation.data;

    // Check user exists
    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Bridge loan is always a fixed 5-day lump-sum loan.
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);

    const result = await pool.query(
      `
      INSERT INTO bridge_loans
        (user_id, amount_paise, term_days, status, due_date)
      VALUES
        ($1, $2, 5, 'active', $3)
      RETURNING
        id,
        user_id,
        amount_paise,
        term_days,
        status,
        due_date,
        created_at
      `,
      [userId, amount * 100, dueDate]
    );

    const bridge = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Payday Bridge created successfully",
      bridgeLoan: {
        id: bridge.id,
        userId: bridge.user_id,
        amount: bridge.amount_paise / 100,
        termDays: bridge.term_days,
        status: bridge.status,
        dueDate: bridge.due_date,
        createdAt: bridge.created_at,
      },
    });
  } catch (error) {
    console.error("Bridge request error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create Payday Bridge",
    });
  }
});

// GET /api/bridge/:bridgeId/status
router.get("/:bridgeId/status", async (req, res) => {
  try {
    const bridgeId = Number(req.params.bridgeId);

    if (!Number.isInteger(bridgeId) || bridgeId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid bridge loan ID",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        amount_paise,
        term_days,
        status,
        due_date,
        created_at,
        repaid_at
      FROM bridge_loans
      WHERE id = $1
      `,
      [bridgeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Bridge loan not found",
      });
    }

    const bridge = result.rows[0];

    return res.json({
      success: true,
      bridgeLoan: {
        id: bridge.id,
        userId: bridge.user_id,
        amount: bridge.amount_paise / 100,
        termDays: bridge.term_days,
        status: bridge.status,
        dueDate: bridge.due_date,
        createdAt: bridge.created_at,
        repaidAt: bridge.repaid_at,
      },
    });
  } catch (error) {
    console.error("Bridge status error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch bridge loan status",
    });
  }
});

// POST /api/bridge/:bridgeId/repay
router.post("/:bridgeId/repay", async (req, res) => {
  try {
    const bridgeId = Number(req.params.bridgeId);

    if (!Number.isInteger(bridgeId) || bridgeId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid bridge loan ID",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        amount_paise,
        term_days,
        status,
        due_date
      FROM bridge_loans
      WHERE id = $1
      `,
      [bridgeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Bridge loan not found",
      });
    }

    const bridge = result.rows[0];

    if (bridge.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Bridge loan is not active",
      });
    }

    const updated = await pool.query(
      `
      UPDATE bridge_loans
      SET
        status = 'repaid',
        repaid_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        user_id,
        amount_paise,
        term_days,
        status,
        due_date,
        repaid_at
      `,
      [bridgeId]
    );

    const repaidBridge = updated.rows[0];

    return res.json({
      success: true,
      message: "Payday Bridge repaid successfully",
      bridgeLoan: {
        id: repaidBridge.id,
        userId: repaidBridge.user_id,
        amount: repaidBridge.amount_paise / 100,
        termDays: repaidBridge.term_days,
        status: repaidBridge.status,
        dueDate: repaidBridge.due_date,
        repaidAt: repaidBridge.repaid_at,
      },
    });
  } catch (error) {
    console.error("Bridge repayment error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to repay Payday Bridge",
    });
  }
});

module.exports = router;