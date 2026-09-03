const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const OTP_EXPIRY_MINUTES = 5;

async function sendOtp(phone) {
  const otp = crypto.randomInt(100000, 1000000).toString();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await pool.query(
    `
    INSERT INTO users (phone)
    VALUES ($1)
    ON CONFLICT (phone)
    DO UPDATE SET updated_at = CURRENT_TIMESTAMP
    `,
    [phone]
  );

  // Demo/mock SMS sender
  console.log(`GigCash OTP for ${phone}: ${otp}`);

  return {
    phone,
    otp,
    expiresAt,
  };
}

function createTokens(userId) {
  const accessToken = jwt.sign(
    { userId, type: "access" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  sendOtp,
  createTokens,
};