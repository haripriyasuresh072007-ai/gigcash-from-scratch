import { useState } from "react"

function App() {
  const [started, setStarted] = useState(false)
  const [phone, setPhone] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [verified, setVerified] = useState(false)

  const [consented, setConsented] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [loanApplication, setLoanApplication] = useState(false)
  const [eligibility, setEligibility] = useState(false)
  const [repayment, setRepayment] = useState(false)
  const [activeLoan, setActiveLoan] = useState(false)
  const [finalStatus, setFinalStatus] = useState(false)

  const [loanAmount, setLoanAmount] = useState(2000)
  const [loanPurpose, setLoanPurpose] = useState("")
  const [repaymentPeriod, setRepaymentPeriod] = useState(4)

  const [paused, setPaused] = useState(false)
  const [repaidWeeks, setRepaidWeeks] = useState(1)
  const [incomeFloor, setIncomeFloor] = useState(4500)
  const [bufferUsed, setBufferUsed] = useState(false)

  // Income and responsible borrowing calculations
  const averageWeeklyIncome = 6800
  const essentialExpenses = 4500
  const safeToUseAmount = Math.max(0, averageWeeklyIncome - essentialExpenses)
  const safeToSave = Math.floor(safeToUseAmount * 0.2)
  const rainyWeekIncome = 4100
  const bufferSupportNeeded = Math.max(0, incomeFloor - rainyWeekIncome)
  const rainyDayDetected = rainyWeekIncome < incomeFloor
  const bufferAmountUsed = Math.min(bufferSupportNeeded, safeToSave)
  const remainingAfterBuffer = Math.max(0, bufferSupportNeeded - safeToSave)
  const recommendedCreditLimit = Math.min(5000, Math.max(500, Math.floor(safeToUseAmount * 0.65)))

  // Explainable GigCash Score
  const incomeStabilityPoints = 180
  const expenseCoveragePoints = 160
  const repaymentCapacityPoints = 150
  const bufferProtectionPoints = 140
  const responsibleBorrowingPoints = 112
  const gigCashScore =
    300 +
    incomeStabilityPoints +
    expenseCoveragePoints +
    repaymentCapacityPoints +
    bufferProtectionPoints +
    responsibleBorrowingPoints

  const weeklyRepayment = Math.ceil(loanAmount / repaymentPeriod)

  const amountRepaid = Math.min(
    loanAmount,
    paused ? weeklyRepayment : weeklyRepayment * repaidWeeks
  )

  const remainingBalance = Math.max(
    0,
    loanAmount - amountRepaid
  )

  // FINAL STATUS
  if (finalStatus) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">

          <div className="text-center mb-8">
            <div className="text-6xl mb-5">🎉</div>

            <h1 className="text-4xl font-bold mb-3">
              Loan Fully Repaid
            </h1>

            <p className="text-slate-400 text-lg">
              Congratulations! Your GigCash loan has been successfully completed.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center mb-6">
              <div className="text-green-400 text-lg font-semibold">
                ✓ Repayment Completed
              </div>

              <div className="text-4xl font-bold mt-3">
                ₹0
              </div>

              <div className="text-slate-400 mt-2">
                Remaining balance
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">
                  Original Loan
                </p>

                <p className="text-2xl font-bold mt-2">
                  ₹{loanAmount}
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">
                  Total Repaid
                </p>

                <p className="text-2xl font-bold mt-2">
                  ₹{loanAmount}
                </p>
              </div>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-lg mb-2">
                Your repayment journey
              </h2>

              <p className="text-slate-400 leading-relaxed">
                You successfully completed your simulated repayment plan.
                GigCash is designed to provide fair and flexible credit
                for workers whose income can change from week to week.
              </p>
            </div>

            <div className="border border-slate-700 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-xl">🛡️</div>

                <div>
                  <h3 className="font-semibold">
                    Responsible Credit
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    GigCash considers income patterns and essential expenses
                    instead of relying only on a traditional credit profile.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFinalStatus(false)
                setDashboard(true)
              }}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Back to Dashboard
            </button>

          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Demo prototype — no real financial transaction is performed.
          </p>

        </div>
      </div>
    )
  }

  // ACTIVE LOAN
  if (activeLoan) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <p className="text-green-400 font-semibold">
              GigCash
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Active Loan
            </h1>

            <p className="text-slate-400 mt-2">
              Track your repayment and protect yourself during weak-income weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">
                Original Loan
              </p>

              <p className="text-2xl font-bold mt-2">
                ₹{loanAmount}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">
                Amount Repaid
              </p>

              <p className="text-2xl font-bold mt-2">
                ₹{amountRepaid}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">
                Remaining
              </p>

              <p className="text-2xl font-bold mt-2">
                ₹{remainingBalance}
              </p>
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 mb-6">

            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Repayment Progress
              </h2>

              <span className="text-slate-400">
                {Math.round((amountRepaid / loanAmount) * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (amountRepaid / loanAmount) * 100
                  )}%`,
                }}
              />
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 mb-6">

            <h2 className="text-xl font-semibold mb-5">
              Repayment Schedule
            </h2>

            <div className="space-y-3">

              {Array.from(
                { length: repaymentPeriod },
                (_, index) => {
                  const week = index + 1
                  const completed = week <= repaidWeeks

                  return (
                    <div
                      key={week}
                      className="flex items-center justify-between bg-slate-800 rounded-xl px-5 py-4"
                    >
                      <div>
                        <p className="font-medium">
                          Week {week}
                        </p>

                        <p className="text-sm text-slate-400">
                          ₹{weeklyRepayment}
                        </p>
                      </div>

                      <div>
                        {completed ? (
                          <span className="text-green-400 text-sm font-semibold">
                            ✓ Paid
                          </span>
                        ) : week === repaidWeeks + 1 && paused ? (
                          <span className="text-yellow-400 text-sm font-semibold">
                            ⏸ Paused
                          </span>
                        ) : week === repaidWeeks + 1 ? (
                          <span className="text-blue-400 text-sm font-semibold">
                            Current
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  )
                }
              )}

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <h2 className="text-xl font-semibold mb-3">
              🌧️ Rainy-Day Protection
            </h2>

            <p className="text-slate-400 leading-relaxed mb-5">
              If your income suddenly drops, GigCash can temporarily pause
              the next repayment instead of forcing you into a difficult week.
            </p>

            {!paused && remainingBalance > 0 && rainyDayDetected && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-4">
                <p className="text-yellow-400 font-semibold text-lg">
                  ⚠️ Rainy Day Detected
                </p>
                <p className="text-slate-300 mt-2">
                  Recent simulated income of ₹{rainyWeekIncome} is ₹{bufferSupportNeeded} below your
                  ₹{incomeFloor} weekly income floor. GigCash recommends using your buffer before taking
                  additional credit.
                </p>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <p className="text-slate-400 text-xs">Buffer support available</p>
                    <p className="text-xl font-bold mt-1">₹{safeToSave}</p>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <p className="text-slate-400 text-xs">Shortfall after buffer</p>
                    <p className="text-xl font-bold mt-1">₹{remainingAfterBuffer}</p>
                  </div>
                </div>
                {!bufferUsed ? (
                  <button
                    onClick={() => {
                      setBufferUsed(true)
                      setPaused(true)
                    }}
                    className="w-full bg-yellow-400 text-slate-950 font-semibold py-3 rounded-xl mt-4 hover:bg-yellow-300 transition"
                  >
                    Use Buffer & Pause Repayment
                  </button>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4">
                    <p className="text-emerald-400 font-semibold">🛡️ Buffer Used</p>
                    <p className="text-sm text-slate-300 mt-1">
                      ₹{bufferAmountUsed} of simulated buffer support is protecting this week's income floor.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!paused && remainingBalance > 0 && !rainyDayDetected && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                <p className="text-emerald-400 font-semibold">✓ Income Floor Covered</p>
                <p className="text-sm text-slate-300 mt-1">
                  Recent income is above your selected floor, so no rainy-day protection is needed.
                </p>
              </div>
            )}

            {paused && remainingBalance > 0 && (
              <div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                  <p className="text-yellow-400 font-semibold">
                    ⏸ Repayment Paused
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your next payment is temporarily protected.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPaused(false)

                    const nextWeeks = Math.min(
                      repaymentPeriod,
                      repaidWeeks + 1
                    )

                    setRepaidWeeks(nextWeeks)

                    if (nextWeeks >= repaymentPeriod) {
                      setActiveLoan(false)
                      setFinalStatus(true)
                    }
                  }}
                  className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Resume & Make Next Payment
                </button>
              </div>
            )}

            {!paused && remainingBalance > 0 && (
              <button
                onClick={() => {
                  const nextWeeks = Math.min(
                    repaymentPeriod,
                    repaidWeeks + 1
                  )

                  setRepaidWeeks(nextWeeks)

                  if (nextWeeks >= repaymentPeriod) {
                    setActiveLoan(false)
                    setFinalStatus(true)
                  }
                }}
                className="w-full bg-green-500 text-slate-950 font-semibold py-3 rounded-xl hover:bg-green-400 transition"
              >
                Make Next Simulated Payment
              </button>
            )}

          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Demo simulation — no real money is transferred.
          </p>

        </div>
      </div>
    )
  }

  // REPAYMENT SETUP
  if (repayment) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-2xl mx-auto">

          <p className="text-green-400 font-semibold">
            GigCash
          </p>

          <h1 className="text-3xl font-bold mt-3">
            Repayment Setup
          </h1>

          <p className="text-slate-400 mt-2 mb-8">
            Choose a repayment plan that fits your income.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <div className="mb-6">
              <p className="text-slate-400 text-sm">
                Loan Amount
              </p>

              <p className="text-3xl font-bold mt-1">
                ₹{loanAmount}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Repayment Period
              </label>

              <select
                value={repaymentPeriod}
                onChange={(e) =>
                  setRepaymentPeriod(Number(e.target.value))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
              >
                <option value={2}>2 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={6}>6 weeks</option>
                <option value={8}>8 weeks</option>
              </select>
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 mb-6">
              <p className="text-slate-400 text-sm">
                Weekly Repayment
              </p>

              <p className="text-2xl font-bold mt-1">
                ₹{weeklyRepayment}
              </p>
            </div>

            <button
              onClick={() => {
                setRepayment(false)
                setActiveLoan(true)
              }}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Confirm Repayment Plan
            </button>

          </div>

        </div>
      </div>
    )
  }

  // ELIGIBILITY
  if (eligibility) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">

            <div className="text-5xl mb-4">
              ✓
            </div>

            <h1 className="text-3xl font-bold">
              You are eligible
            </h1>

            <p className="text-slate-400 mt-3">
              Based on the demo income and repayment profile.
            </p>

            <div className="bg-slate-800 rounded-2xl p-6 mt-7">

              <p className="text-slate-400 text-sm">
                GigCash Score
              </p>

              <p className="text-5xl font-bold mt-2">
                {gigCashScore}
              </p>

              <p className="text-green-400 mt-2">
                Good repayment capacity
              </p>

            </div>

            <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6 mt-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  📊 Why this score?
                </h2>
                <span className="text-xs text-green-400 font-semibold border border-green-500/30 rounded-full px-3 py-1">
                  Explainable
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div>
                    <p className="font-medium">Income stability</p>
                    <p className="text-xs text-slate-400 mt-1">Consistent earning pattern</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{incomeStabilityPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div>
                    <p className="font-medium">Essential expense coverage</p>
                    <p className="text-xs text-slate-400 mt-1">Essentials are protected first</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{expenseCoveragePoints}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div>
                    <p className="font-medium">Repayment capacity</p>
                    <p className="text-xs text-slate-400 mt-1">Weekly repayment fits the income profile</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{repaymentCapacityPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div>
                    <p className="font-medium">Buffer protection</p>
                    <p className="text-xs text-slate-400 mt-1">Rainy-week support reduces repayment stress</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{bufferProtectionPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div>
                    <p className="font-medium">Responsible borrowing</p>
                    <p className="text-xs text-slate-400 mt-1">Credit limit considers safe-to-use income</p>
                  </div>
                  <span className="text-green-400 font-semibold">+{responsibleBorrowingPoints}</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-green-400 font-semibold">How it works:</span>{" "}
                  GigCash starts at 300 and adds points for income stability,
                  essential-expense coverage, repayment capacity, buffer protection,
                  and responsible borrowing behavior.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEligibility(false)
                setRepayment(true)
              }}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-7 hover:bg-slate-200 transition"
            >
              Continue to Repayment
            </button>

          </div>

        </div>
      </div>
    )
  }

  // LOAN APPLICATION
  if (loanApplication) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-2xl mx-auto">

          <p className="text-green-400 font-semibold">
            GigCash
          </p>

          <h1 className="text-3xl font-bold mt-3">
            Apply for Credit
          </h1>

          <p className="text-slate-400 mt-2 mb-8">
            Request a small amount based on your current needs.
          </p>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 mb-6">
            <p className="text-purple-400 font-semibold">🎯 Smart Credit Limit</p>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              GigCash recommends up to <span className="font-bold text-white">₹{recommendedCreditLimit}</span> based on your
              safe-to-use income. Requesting above this amount may increase repayment pressure.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <label className="block text-sm text-slate-300 mb-2">
              Loan Amount
            </label>

            <input
              type="number"
              min="500"
              max="5000"
              value={loanAmount}
              onChange={(e) =>
                setLoanAmount(Number(e.target.value))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-6"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Purpose
            </label>

            <select
              value={loanPurpose}
              onChange={(e) =>
                setLoanPurpose(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-6"
            >
              <option value="">
                Select purpose
              </option>

              <option value="rent">
                Rent
              </option>

              <option value="food">
                Food & Essentials
              </option>

              <option value="vehicle">
                Vehicle / Work Expenses
              </option>

              <option value="emergency">
                Emergency
              </option>
            </select>

            <button
              onClick={() => {
                setLoanApplication(false)
                setEligibility(true)
              }}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Check Eligibility
            </button>

          </div>

        </div>
      </div>
    )
  }

  // DASHBOARD
  if (dashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">

          <p className="text-green-400 font-semibold">
            GigCash
          </p>

          <h1 className="text-3xl font-bold mt-3">
            Earnings Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Understand your income before taking credit.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Average Weekly Income
              </p>

              <p className="text-3xl font-bold mt-2">
                ₹6,800
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Essential Expenses
              </p>

              <p className="text-3xl font-bold mt-2">
                ₹4,500
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Safe-to-Use Amount
              </p>

              <p className="text-3xl font-bold mt-2">
                ₹2,300
              </p>
            </div>

          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 rounded-3xl p-7 mt-6">

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-emerald-400 text-sm font-semibold tracking-wide">
                  🛡️ ADAPTIVE INCOME BUFFER
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  Safe-to-save recommendation
                </h2>

                <p className="text-slate-400 mt-2 leading-relaxed">
                  GigCash protects your essential expenses first and recommends
                  only a safe portion of the remaining income for your buffer.
                </p>
              </div>

              <div className="text-4xl">💰</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-800/80 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Income after essentials</p>
                <p className="text-2xl font-bold mt-2">₹{safeToUseAmount}</p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Recommended to save</p>
                <p className="text-2xl font-bold text-emerald-400 mt-2">₹{safeToSave}</p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Still flexible to use</p>
                <p className="text-2xl font-bold mt-2">₹{safeToUseAmount - safeToSave}</p>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mt-5">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Why ₹{safeToSave}?</span>{" "}
                Your ₹{essentialExpenses} essential expenses are protected first. From the
                remaining ₹{safeToUseAmount}, GigCash recommends only 20% as a safe buffer contribution.
              </p>
            </div>

          </div>

          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-7 mt-6">
            <p className="text-blue-400 text-sm font-semibold tracking-wide">
              🎯 INCOME FLOOR / SALARY MODE
            </p>

            <h2 className="text-2xl font-semibold mt-2">
              Protect your minimum weekly needs
            </h2>

            <p className="text-slate-400 mt-2 leading-relaxed">
              Choose the minimum amount you need each week. If income falls below this floor,
              GigCash can use the buffer to cover the shortfall before suggesting new credit.
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Your weekly income floor</span>
                <span className="font-semibold">₹{incomeFloor}</span>
              </div>

              <input
                type="range"
                min="3000"
                max="7000"
                step="500"
                value={incomeFloor}
                onChange={(e) => setIncomeFloor(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Rainy-week income</p>
                <p className="text-2xl font-bold mt-2">₹{rainyWeekIncome}</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Buffer support needed</p>
                <p className="text-2xl font-bold text-yellow-400 mt-2">₹{bufferSupportNeeded}</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Protection status</p>
                <p className={`text-lg font-bold mt-2 ${bufferSupportNeeded > 0 ? "text-yellow-400" : "text-green-400"}`}>
                  {bufferSupportNeeded > 0 ? "Buffer activated" : "Floor covered"}
                </p>
              </div>
            </div>

          </div>

          <div className={`border rounded-3xl p-7 mt-6 ${rainyDayDetected ? "bg-yellow-500/10 border-yellow-500/30" : "bg-emerald-500/10 border-emerald-500/30"}`}>
            <p className={`text-sm font-semibold tracking-wide ${rainyDayDetected ? "text-yellow-400" : "text-emerald-400"}`}>
              🌧️ SMART RAINY-DAY DETECTION
            </p>
            <h2 className="text-2xl font-semibold mt-2">
              {rainyDayDetected ? "Rainy Day Detected" : "Income Floor Is Safe"}
            </h2>
            <p className="text-slate-300 mt-2 leading-relaxed">
              {rainyDayDetected
                ? `Your simulated income is ₹${bufferSupportNeeded} below your ₹${incomeFloor} weekly floor. GigCash prioritises your buffer before additional borrowing.`
                : `Your simulated income of ₹${rainyWeekIncome} is meeting your ₹${incomeFloor} weekly floor.`}
            </p>
            {rainyDayDetected && (
              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <div className="bg-slate-900/60 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm">Income</p>
                  <p className="text-xl font-bold mt-1">₹{rainyWeekIncome}</p>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm">Your floor</p>
                  <p className="text-xl font-bold mt-1">₹{incomeFloor}</p>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm">Shortfall</p>
                  <p className="text-xl font-bold text-yellow-400 mt-1">₹{bufferSupportNeeded}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-5">
              Demo rule: a rainy day is detected whenever recent simulated income falls below your selected income floor.
            </p>
          </div>

          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-7 mt-6">
            <p className="text-purple-400 text-sm font-semibold tracking-wide">
              🎯 SMART CREDIT LIMIT
            </p>

            <h2 className="text-2xl font-semibold mt-2">
              Borrow within a safer range
            </h2>

            <p className="text-slate-400 mt-2 leading-relaxed">
              GigCash uses your safe-to-use income to recommend a responsible credit limit.
              You can still request more, but the app clearly explains the risk.
            </p>

            <div className="bg-slate-800 rounded-2xl p-6 mt-6">
              <p className="text-slate-400 text-sm">Recommended credit limit</p>
              <p className="text-4xl font-bold text-purple-400 mt-2">₹{recommendedCreditLimit}</p>
              <p className="text-sm text-slate-400 mt-2">
                Based on ₹{safeToUseAmount} of income remaining after essential expenses.
              </p>
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 mt-6">

            <h2 className="text-xl font-semibold mb-4">
              Income Scenarios
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="font-semibold">
                  Stable Week
                </p>

                <p className="text-green-400 text-2xl font-bold mt-2">
                  ₹7,200
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="font-semibold">
                  Rainy Week
                </p>

                <p className="text-yellow-400 text-2xl font-bold mt-2">
                  ₹4,100
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <p className="font-semibold">
                  High-Income Week
                </p>

                <p className="text-blue-400 text-2xl font-bold mt-2">
                  ₹9,300
                </p>
              </div>

            </div>

          </div>

          <button
            onClick={() => setLoanApplication(true)}
            className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-7 hover:bg-slate-200 transition"
          >
            Apply for Credit
          </button>

        </div>
      </div>
    )
  }

  // CONSENT
  if (consented) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <p className="text-green-400 font-semibold">
              GigCash
            </p>

            <h1 className="text-3xl font-bold mt-4">
              Data Consent
            </h1>

            <p className="text-slate-400 mt-3 leading-relaxed">
              GigCash uses your earnings information to understand
              repayment capacity and provide responsible credit decisions.
            </p>

            <div className="space-y-3 mt-7">

              <div className="bg-slate-800 rounded-xl p-4">
                ✓ Income pattern analysis
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                ✓ Essential expense protection
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                ✓ Explainable eligibility decision
              </div>

            </div>

            <button
              onClick={() => {
                setConsented(false)
                setDashboard(true)
              }}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-7 hover:bg-slate-200 transition"
            >
              I Agree & Continue
            </button>

          </div>

        </div>
      </div>
    )
  }

  // OTP VERIFICATION
  if (verified) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">

            <div className="text-5xl mb-4">
              🔐
            </div>

            <h1 className="text-3xl font-bold">
              Welcome to GigCash
            </h1>

            <p className="text-slate-400 mt-3">
              Your phone number has been verified.
            </p>

            <button
              onClick={() => setConsented(true)}
              className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-7 hover:bg-slate-200 transition"
            >
              Continue
            </button>

          </div>

        </div>
      </div>
    )
  }

  // LOGIN
  if (started) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <p className="text-green-400 font-semibold">
              GigCash
            </p>

            <h1 className="text-3xl font-bold mt-4">
              {otpSent ? "Enter OTP" : "Login"}
            </h1>

            {!otpSent ? (
              <>
                <p className="text-slate-400 mt-3">
                  Enter your phone number to continue.
                </p>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mt-6"
                />

                <button
                  onClick={async () => {
                    const cleanPhone = phone.trim()

                    if (!cleanPhone) {
                      alert("Please enter your phone number")
                      return
                    }

                    try {
                      console.log("Sending OTP request for:", cleanPhone)

                      const response = await fetch(
                        "http://localhost:4000/api/auth/send-otp",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            phone: cleanPhone,
                          }),
                        }
                      )

                      const data = await response.json()

                      console.log("Backend response:", data)

                      if (response.ok && data.success) {
                        alert("OTP sent successfully. Demo OTP: 123456")
                        setOtpSent(true)
                      } else {
                        alert(data.message || "Failed to send OTP")
                      }
                    } catch (error) {
                      console.error("OTP request failed:", error)
                      alert(
                        "Could not connect to GigCash backend. Make sure the backend is running on port 4000."
                      )
                    }
                  }}
                  className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-4 hover:bg-slate-200 transition"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-400 mt-3">
                  Demo OTP:{" "}
                  <span className="text-white font-semibold">
                    123456
                  </span>
                </p>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  placeholder="Enter OTP"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mt-6"
                />

                <button
                  onClick={() => {
                    if (otp === "123456") {
                      setVerified(true)
                    } else {
                      alert("Invalid OTP")
                    }
                  }}
                  className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl mt-4 hover:bg-slate-200 transition"
                >
                  Verify OTP
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    )
  }

  // LANDING PAGE
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-8">

        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">
            GigCash
          </div>

          <div className="text-sm text-slate-400">
            Fair credit for gig workers
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">

          <div>

            <p className="text-green-400 font-semibold mb-4">
              RESPONSIBLE INCOME SMOOTHING
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Fair, flexible credit for an unpredictable income.
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mt-6">
              GigCash helps gig workers manage uneven income with
              explainable credit decisions and rainy-day protection.
            </p>

            <button
              onClick={() => setStarted(true)}
              className="bg-white text-slate-950 font-semibold px-7 py-3 rounded-xl mt-8 hover:bg-slate-200 transition"
            >
              Get Started
            </button>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold">
              Built for unpredictable income
            </h2>

            <div className="space-y-4 mt-6">

              <div className="bg-slate-800 rounded-2xl p-5">
                📊 Income-aware eligibility
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                🛡️ Essential expenses protected
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                🌧️ Rainy-day repayment pause
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                💡 Explainable credit decisions
              </div>

            </div>

          </div>

        </div>

        <p className="text-center text-slate-600 text-sm pb-6">
          Demo prototype — no real financial or identity transactions.
        </p>

      </div>

    </div>
  )
}

export default App