const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "GigCash backend is running!",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "GigCash API",
  })
})

// Send OTP
app.post("/api/auth/send-otp", (req, res) => {
  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    })
  }

  console.log(`OTP requested for ${phone}`)

  res.json({
    success: true,
    message: "OTP sent successfully",
    demoOtp: "123456",
  })
})

const PORT = 4000

app.listen(PORT, () => {
  console.log(`GigCash backend running on http://localhost:${PORT}`)
})