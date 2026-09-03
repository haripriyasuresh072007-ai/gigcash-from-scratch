const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./auth/routes");
const incomeRoutes = require("./income/routes");
const scoreRoutes = require("./score/routes");
const loanRoutes = require("./loan/routes");
const bridgeRoutes = require("./bridge/routes");
const adminRoutes = require("./admin/routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GigCash backend is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Income routes
app.use("/api/income", incomeRoutes);

// Score routes
app.use("/api/score", scoreRoutes);

// Loan routes
app.use("/api/loan", loanRoutes);

// Payday Bridge routes
app.use("/api/bridge", bridgeRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

console.log("BRIDGE ROUTES LOADED");
console.log("ADMIN ROUTES LOADED");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `GigCash backend running on http://localhost:${PORT}`
  );
});