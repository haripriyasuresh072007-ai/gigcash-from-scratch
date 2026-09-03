const express = require("express");
console.log("AUTH ROUTES LOADED");

const { z } = require("zod");
const pool = require("../db");
const { sendOtp, createTokens } = require("./auth");

const router = express.Router();

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
});

const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

const otpStore = new Map();

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const result = phoneSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const { phone } = result.data;

    const otpResult = await sendOtp(phone);

    otpStore.set(phone, {
      otp: otpResult.otp,
      expiresAt: otpResult.expiresAt,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
      expiresInSeconds: 300,
      demoOtp: otpResult.otp,
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to send OTP",
    });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const result = verifyOtpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const { phone, otp } = result.data;

    const storedOtp = otpStore.get(phone);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        error: "OTP not found or already used",
      });
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(phone);

      return res.status(400).json({
        success: false,
        error: "OTP has expired",
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    otpStore.delete(phone);

    const userResult = await pool.query(
      "SELECT id, phone, name FROM users WHERE phone = $1",
      [phone]
    );

    const user = userResult.rows[0];

    const tokens = createTokens(user.id);

    res.json({
      success: true,
      message: "OTP verified successfully",
      user,
      ...tokens,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to verify OTP",
    });
  }
});

module.exports = router;