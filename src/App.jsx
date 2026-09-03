import { useState, useEffect } from "react"
import {
  Lock,
  BarChart3,
  ShieldCheck,
  CloudRain,
  CreditCard,
  User,
  Check,
  AlertTriangle,
  PartyPopper,
  Wallet,
  Lightbulb,
  Target,
  HeartPulse,
  Home,
  UtensilsCrossed,
  Bike,
  Search,
  Pause,
  Zap,
  ArrowRight,
} from "lucide-react"

function App() {
  const [started, setStarted] = useState(false)
  const [phone, setPhone] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [verified, setVerified] = useState(false)

  const [consented, setConsented] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [loanApplication, setLoanApplication] = useState(false)
  const [eligibility, setEligibility] = useState(false)
  const [repayment, setRepayment] = useState(false)
  const [activeLoan, setActiveLoan] = useState(false)
  const [finalStatus, setFinalStatus] = useState(false)
  const [adminDashboard, setAdminDashboard] = useState(false)

  // Payday Bridge — a separate, short-term product from the main credit line
  const [bridgeScreen, setBridgeScreen] = useState(false)
  const [bridgeConfirmed, setBridgeConfirmed] = useState(false)
  const [bridgeAmount, setBridgeAmount] = useState(1000)

  const [loanAmount, setLoanAmount] = useState(2000)
  const [loanPurpose, setLoanPurpose] = useState("")
  const [repaymentPeriod, setRepaymentPeriod] = useState(4)

  const [paused, setPaused] = useState(false)
  const [repaidWeeks, setRepaidWeeks] = useState(1)
  const [flexibleRepayment, setFlexibleRepayment] = useState(false)
  const [reducedPayment, setReducedPayment] = useState(false)
  const [autoPauseTriggered, setAutoPauseTriggered] = useState(false)

  // ---- Income and responsible-borrowing calculations ----
  const averageWeeklyIncome = 6800
  const essentialExpenses = 4500
  const safeToUseAmount = Math.max(0, averageWeeklyIncome - essentialExpenses)
  const safeToSave = Math.floor(safeToUseAmount * 0.2)
  const recommendedCreditLimit = Math.min(5000, Math.max(500, Math.floor(safeToUseAmount * 0.65)))
  const adaptiveCreditAmount = Math.min(
    recommendedCreditLimit,
    Math.max(500, Math.floor(safeToUseAmount * 0.5))
  )
  const adaptiveWeeklyRepayment = Math.ceil(adaptiveCreditAmount / repaymentPeriod)

  // ---- Rainy-Day Pause: automatic, triggers below 50% of average income ----
  const currentWeekIncome = 3200
  const rainyDayThreshold = Math.floor(averageWeeklyIncome * 0.5)
  const isRainyDay = currentWeekIncome < rainyDayThreshold
  const shortfallBelowThreshold = Math.max(0, rainyDayThreshold - currentWeekIncome)

  // ---- Cap-Protected Auto-Pay: weekly repayment can never exceed 20% of average weekly income ----
  const maxWeeklyRepayment = Math.floor(averageWeeklyIncome * 0.2)
  const isPeriodValid = (period) => Math.ceil(loanAmount / period) <= maxWeeklyRepayment
  const periodOptions = [2, 4, 6, 8]
  const minValidPeriod = periodOptions.find(isPeriodValid) || 8

  useEffect(() => {
    if (repayment && !isPeriodValid(repaymentPeriod)) {
      setRepaymentPeriod(minValidPeriod)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repayment, loanAmount])

  // ---- Gig-Behavior Score: explainable, capped 300-850 ----
  const incomeStabilityPoints = 130
  const expenseCoveragePoints = 110
  const repaymentCapacityPoints = 105
  const bufferProtectionPoints = 90
  const responsibleBorrowingPoints = 80
  const gigCashScore = Math.min(
    850,
    300 +
      incomeStabilityPoints +
      expenseCoveragePoints +
      repaymentCapacityPoints +
      bufferProtectionPoints +
      responsibleBorrowingPoints
  )

  const weeklyRepayment = Math.ceil(loanAmount / repaymentPeriod)

  const amountRepaid = Math.min(
    loanAmount,
    paused ? weeklyRepayment : weeklyRepayment * repaidWeeks
  )

  const remainingBalance = Math.max(0, loanAmount - amountRepaid)

  // Auto-pause: fires the moment the active loan screen is entered, no user action needed
  useEffect(() => {
    if (
      activeLoan &&
      isRainyDay &&
      !autoPauseTriggered &&
      remainingBalance > 0 &&
      repaidWeeks < repaymentPeriod
    ) {
      setPaused(true)
      setAutoPauseTriggered(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLoan])

  // ================= PAYDAY BRIDGE CONFIRMED =================
  if (bridgeConfirmed) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6ea3d8]/10 border border-[#6ea3d8]/30 mb-5">
              <Zap className="w-8 h-8 text-[#6ea3d8]" />
            </div>
            <h1 className="text-4xl font-semibold mb-3" style={{fontFamily: '"Fraunces", serif'}}>
              Bridge on the way
            </h1>
            <p className="text-[#98a2b8] text-lg">
              ₹{bridgeAmount} is being sent to your account now.
            </p>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Bridge amount</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{bridgeAmount}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Due in</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>5 days</p>
              </div>
            </div>

            <div className="bg-[#6ea3d8]/10 border border-[#6ea3d8]/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                <span className="text-[#6ea3d8] font-semibold">Separate from your credit line: </span>
                Payday Bridge is tracked independently, so this doesn't count against your
                main GigCash credit limit or affect your repayment schedule there.
              </p>
            </div>

            <button
              onClick={() => {
                setBridgeConfirmed(false)
                setBridgeScreen(false)
                setDashboard(true)
              }}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl hover:bg-[#c08a2e] transition"
            >
              Back to dashboard
            </button>
          </div>

          <p className="text-center text-[#98a2b8]/70 text-sm mt-6">
            Demo simulation — no real money is transferred.
          </p>
        </div>
      </div>
    )
  }

  // ================= PAYDAY BRIDGE REQUEST =================
  if (bridgeScreen) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>
            GigCash
          </p>

          <div className="flex items-center gap-2 mt-3">
            <Zap className="w-6 h-6 text-[#6ea3d8]" />
            <h1 className="text-3xl font-semibold" style={{fontFamily: '"Fraunces", serif'}}>
              Payday Bridge
            </h1>
          </div>

          <p className="text-[#98a2b8] mt-2 mb-8">
            Ultra-short-term cash flow support to cover the gap until your next gig payout.
          </p>

          <div className="bg-[#6ea3d8]/10 border border-[#6ea3d8]/30 rounded-2xl p-5 mb-6">
            <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
              <span className="text-[#6ea3d8] font-semibold">How this is different: </span>
              Payday Bridge is separate from your main GigCash credit line — smaller amounts,
              a fixed 5-day term, and it never touches your main repayment schedule or credit limit.
            </p>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7">
            <label className="block text-sm text-[#f5f3ef]/80 mb-2">
              Bridge amount
            </label>

            <p className="text-3xl font-semibold mb-4" style={{fontFamily: '"Fraunces", serif'}}>
              ₹{bridgeAmount}
            </p>

            <input
              type="range"
              min="500"
              max="1500"
              step="100"
              value={bridgeAmount}
              onChange={(e) => setBridgeAmount(Number(e.target.value))}
              className="w-full accent-[#6ea3d8]"
            />

            <div className="flex justify-between text-xs text-[#98a2b8] mt-2">
              <span>₹500</span>
              <span>₹1,500</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-7">
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Fixed term</p>
                <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>5 days</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Repayment</p>
                <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>Single payment</p>
              </div>
            </div>

            <button
              onClick={() => {
                setBridgeScreen(false)
                setBridgeConfirmed(true)
              }}
              className="w-full bg-[#6ea3d8] text-[#0f1420] font-semibold py-3 rounded-xl mt-7 hover:brightness-110 transition"
            >
              Request bridge
            </button>

            <button
              onClick={() => {
                setBridgeScreen(false)
                setDashboard(true)
              }}
              className="w-full bg-transparent text-[#98a2b8] font-semibold py-3 rounded-xl mt-2 hover:text-[#f5f3ef] transition"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= ADMIN DASHBOARD =================
  if (adminDashboard) {
    const applications = [
      {
        worker: "Worker A",
        amount: 1500,
        score: 742,
        anomaly: "Clear",
        income: "Stable",
        decision: "Eligible",
        reason: "Income covers essential expenses and repayment capacity is healthy.",
      },
      {
        worker: "Worker B",
        amount: 4000,
        score: 618,
        anomaly: "Review",
        income: "Rainy Week",
        decision: "Under Review",
        reason: "Requested weekly repayment exceeds the 20% income cap at short tenures.",
      },
      {
        worker: "Worker C",
        amount: 2500,
        score: 701,
        anomaly: "Clear",
        income: "Stable",
        decision: "Eligible",
        reason: "Good income stability with sufficient repayment capacity.",
      },
    ]

    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
              <h1 className="text-3xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
                Admin dashboard
              </h1>
              <p className="text-[#98a2b8] mt-2">
                Review applications using transparent, explainable signals.
              </p>
            </div>

            <button
              onClick={() => setAdminDashboard(false)}
              className="bg-[#1e2740] text-[#f5f3ef] font-semibold px-5 py-3 rounded-xl border border-[#2a3552] hover:border-[#d9a441]/50 transition"
            >
              Back to app
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Applications</p>
              <p className="text-3xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>3</p>
            </div>

            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Eligible</p>
              <p className="text-3xl font-semibold text-[#5fae8c] mt-2" style={{fontFamily: '"Fraunces", serif'}}>2</p>
            </div>

            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Under review</p>
              <p className="text-3xl font-semibold text-[#e0913c] mt-2" style={{fontFamily: '"Fraunces", serif'}}>1</p>
            </div>

            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Average score</p>
              <p className="text-3xl font-semibold text-[#6ea3d8] mt-2" style={{fontFamily: '"Fraunces", serif'}}>687</p>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold" style={{fontFamily: '"Fraunces", serif'}}>
                  Application review
                </h2>
                <p className="text-sm text-[#98a2b8] mt-1">
                  Decisions are based on transparent simulated signals.
                </p>
              </div>

              <span className="text-xs text-[#5fae8c] font-semibold border border-[#5fae8c]/30 rounded-full px-3 py-1">
                Explainable
              </span>
            </div>

            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.worker} className="bg-[#1e2740] rounded-xl p-5">
                  <div className="grid lg:grid-cols-7 gap-4 items-center">
                    <div>
                      <p className="text-xs text-[#98a2b8]">Worker</p>
                      <p className="font-semibold mt-1 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#98a2b8]" /> {application.worker}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">Loan amount</p>
                      <p className="font-semibold mt-1">₹{application.amount}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">GigCash Score</p>
                      <p className="font-semibold mt-1">{application.score}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">Anomaly</p>
                      <p className={`font-semibold mt-1 flex items-center gap-1.5 ${
                        application.anomaly === "Clear" ? "text-[#5fae8c]" : "text-[#e0913c]"
                      }`}>
                        {application.anomaly === "Clear" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {application.anomaly}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">Income</p>
                      <p className="font-semibold mt-1">{application.income}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">Decision</p>
                      <p className={`font-semibold mt-1 ${
                        application.decision === "Eligible" ? "text-[#5fae8c]" : "text-[#e0913c]"
                      }`}>
                        {application.decision}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#98a2b8]">Reason</p>
                      <p className="text-xs text-[#f5f3ef]/70 mt-1 leading-relaxed">{application.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#6ea3d8]/10 border border-[#6ea3d8]/20 rounded-xl p-5 mt-6">
              <p className="text-sm text-[#f5f3ef]/80 leading-relaxed flex items-start gap-2">
                <Search className="w-4 h-4 text-[#6ea3d8] mt-0.5 shrink-0" />
                <span>
                  <span className="text-[#6ea3d8] font-semibold">Reviewer guidance: </span>
                  An anomaly flag does not automatically mean fraud or rejection.
                  It means the simulated application may need additional human review.
                </span>
              </p>
            </div>
          </div>

          <p className="text-center text-[#98a2b8]/70 text-sm mt-6">
            Demo admin dashboard — simulated applications only.
          </p>
        </div>
      </div>
    )
  }

  // ================= FINAL STATUS =================
  if (finalStatus) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5fae8c]/10 border border-[#5fae8c]/30 mb-5">
              <PartyPopper className="w-8 h-8 text-[#5fae8c]" />
            </div>
            <h1 className="text-4xl font-semibold mb-3" style={{fontFamily: '"Fraunces", serif'}}>
              You're all paid up
            </h1>
            <p className="text-[#98a2b8] text-lg">
              Every payment came through. Your GigCash credit line is clear.
            </p>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8">
            <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-2xl p-6 text-center mb-6">
              <div className="text-[#5fae8c] text-lg font-semibold flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Repayment complete
              </div>
              <div className="text-4xl font-semibold mt-3" style={{fontFamily: '"Fraunces", serif'}}>₹0</div>
              <div className="text-[#98a2b8] mt-2">Remaining balance</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Original loan</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{loanAmount}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Total repaid</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{loanAmount}</p>
              </div>
            </div>

            <div className="bg-[#1e2740] rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-lg mb-2">Your repayment journey</h2>
              <p className="text-[#98a2b8] leading-relaxed">
                You completed your simulated repayment plan. GigCash is built
                to give people fair, flexible credit when income changes from week to week.
              </p>
            </div>

            <div className="border border-[#2a3552] rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#5fae8c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Responsible credit</h3>
                  <p className="text-sm text-[#98a2b8] mt-1">
                    GigCash looks at income patterns and essential expenses
                    instead of relying only on a traditional credit history.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setFinalStatus(false); setDashboard(true) }}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl hover:bg-[#c08a2e] transition"
            >
              Back to dashboard
            </button>
          </div>

          <p className="text-center text-[#98a2b8]/70 text-sm mt-6">
            Demo prototype — no real financial transaction is performed.
          </p>
        </div>
      </div>
    )
  }

  // ================= ACTIVE LOAN =================
  if (activeLoan) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
            <h1 className="text-3xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>Active loan</h1>
            <p className="text-[#98a2b8] mt-2">Track your repayment and stay protected during weaker weeks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Original loan</p>
              <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{loanAmount}</p>
            </div>
            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Amount repaid</p>
              <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{amountRepaid}</p>
            </div>
            <div className="bg-[#161d2e] border-2 border-[#d9a441]/40 rounded-xl p-5">
              <p className="text-[#98a2b8] text-sm">Remaining</p>
              <p className="text-2xl font-semibold text-[#d9a441] mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{remainingBalance}</p>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Repayment progress</h2>
              <span className="text-[#98a2b8]">{Math.round((amountRepaid / loanAmount) * 100)}%</span>
            </div>
            <div className="w-full bg-[#1e2740] rounded-full h-3">
              <div
                className="bg-[#5fae8c] h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, (amountRepaid / loanAmount) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7 mb-6">
            <h2 className="text-xl font-semibold mb-5" style={{fontFamily: '"Fraunces", serif'}}>Repayment schedule</h2>
            <div className="space-y-3">
              {Array.from({ length: repaymentPeriod }, (_, index) => {
                const week = index + 1
                const completed = week <= repaidWeeks
                return (
                  <div key={week} className="flex items-center justify-between bg-[#1e2740] rounded-xl px-5 py-4">
                    <div>
                      <p className="font-medium">Week {week}</p>
                      <p className="text-sm text-[#98a2b8]">₹{weeklyRepayment}</p>
                    </div>
                    <div>
                      {completed ? (
                        <span className="text-[#5fae8c] text-sm font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Paid
                        </span>
                      ) : week === repaidWeeks + 1 && paused ? (
                        <span className="text-[#e0913c] text-sm font-semibold flex items-center gap-1">
                          <Pause className="w-4 h-4" /> Auto-paused
                        </span>
                      ) : week === repaidWeeks + 1 ? (
                        <span className="text-[#6ea3d8] text-sm font-semibold">Current</span>
                      ) : (
                        <span className="text-[#98a2b8]/70 text-sm">Upcoming</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{fontFamily: '"Fraunces", serif'}}>
              <CloudRain className="w-5 h-5 text-[#e0913c]" /> Rainy-Day Pause
            </h2>

            <p className="text-[#98a2b8] leading-relaxed mb-5">
              GigCash watches your income automatically. If a week's earnings fall below 50% of
              your average, the next repayment is paused for you — no action required.
            </p>

            {paused && autoPauseTriggered && remainingBalance > 0 && (
              <div className="bg-[#e0913c]/10 border border-[#e0913c]/30 rounded-2xl p-5 mb-4">
                <p className="text-[#e0913c] font-semibold text-lg flex items-center gap-2">
                  <Pause className="w-5 h-5" /> Repayment auto-paused
                </p>
                <p className="text-[#f5f3ef]/80 mt-2">
                  This week's simulated income of ₹{currentWeekIncome} is below 50% of your
                  ₹{averageWeeklyIncome} average (₹{rainyDayThreshold}). GigCash paused this week's
                  payment automatically — you didn't need to do anything.
                </p>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#161d2e]/60 rounded-xl p-4">
                    <p className="text-[#98a2b8] text-xs">This week's income</p>
                    <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{currentWeekIncome}</p>
                  </div>
                  <div className="bg-[#161d2e]/60 rounded-xl p-4">
                    <p className="text-[#98a2b8] text-xs">50% threshold</p>
                    <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{rainyDayThreshold}</p>
                  </div>
                  <div className="bg-[#161d2e]/60 rounded-xl p-4">
                    <p className="text-[#98a2b8] text-xs">Shortfall</p>
                    <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{shortfallBelowThreshold}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPaused(false)
                    const nextWeeks = Math.min(repaymentPeriod, repaidWeeks + 1)
                    setRepaidWeeks(nextWeeks)
                    if (nextWeeks >= repaymentPeriod) {
                      setActiveLoan(false)
                      setFinalStatus(true)
                    }
                  }}
                  className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-4 hover:bg-[#c08a2e] transition"
                >
                  Resume & pay this week
                </button>
              </div>
            )}

            {!paused && remainingBalance > 0 && (
              <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-xl p-4 mb-4">
                <p className="text-[#5fae8c] font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> No pause needed this week
                </p>
                <p className="text-sm text-[#f5f3ef]/80 mt-1">
                  This week's simulated income is at or above 50% of your average, so repayment continues as scheduled.
                </p>
              </div>
            )}

            {!paused && remainingBalance > 0 && (
              <button
                onClick={() => {
                  const nextWeeks = Math.min(repaymentPeriod, repaidWeeks + 1)
                  setRepaidWeeks(nextWeeks)
                  if (nextWeeks >= repaymentPeriod) {
                    setActiveLoan(false)
                    setFinalStatus(true)
                  }
                }}
                className="w-full bg-[#5fae8c] text-[#0f1420] font-semibold py-3 rounded-xl hover:brightness-110 transition"
              >
                Pay this week
              </button>
            )}
          </div>

          <div className="bg-[#161d2e] border border-[#9b86d9]/30 rounded-2xl p-7 mt-6">
            <p className="text-[#9b86d9] text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Smart repayment flexibility
            </p>
            <h2 className="text-xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
              Choose a payment that fits this week
            </h2>
            <p className="text-[#98a2b8] mt-2 leading-relaxed">
              GigCash can adjust your repayment when income is weaker. You stay on track
              without being forced into the same payment every week.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => { setFlexibleRepayment(false); setReducedPayment(false) }}
                className={`text-left rounded-xl p-5 border transition ${
                  !flexibleRepayment && !reducedPayment
                    ? "border-[#5fae8c]/50 bg-[#5fae8c]/10"
                    : "border-[#2a3552] bg-[#1e2740] hover:border-[#98a2b8]"
                }`}
              >
                <p className="font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#5fae8c]" /> Normal payment
                </p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{weeklyRepayment}</p>
                <p className="text-sm text-[#98a2b8] mt-2">Best when this week's income is stable.</p>
              </button>

              <button
                onClick={() => { setFlexibleRepayment(true); setReducedPayment(true) }}
                className={`text-left rounded-xl p-5 border transition ${
                  reducedPayment ? "border-[#6ea3d8]/50 bg-[#6ea3d8]/10" : "border-[#2a3552] bg-[#1e2740] hover:border-[#98a2b8]"
                }`}
              >
                <p className="font-semibold">Reduced payment</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
                  ₹{Math.ceil(weeklyRepayment * 0.5)}
                </p>
                <p className="text-sm text-[#98a2b8] mt-2">Pay 50% this week and carry the rest forward.</p>
              </button>
            </div>

            <div className="bg-[#9b86d9]/10 border border-[#9b86d9]/20 rounded-xl p-4 mt-5">
              <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                <span className="text-[#9b86d9] font-semibold">Why flexible repayment? </span>
                When income is unpredictable, a fixed payment can add extra pressure. GigCash
                allows a reduced payment during a weaker week and moves the remaining amount to
                a later payment instead of forcing a new loan.
              </p>
            </div>

            {reducedPayment && (
              <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-xl p-4 mt-4">
                <p className="text-[#5fae8c] font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Reduced repayment selected
                </p>
                <p className="text-sm text-[#f5f3ef]/80 mt-1">
                  This week's simulated payment is ₹{Math.ceil(weeklyRepayment * 0.5)}. The remaining
                  ₹{weeklyRepayment - Math.ceil(weeklyRepayment * 0.5)} will be carried forward.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-[#98a2b8]/70 text-sm mt-6">
            Demo simulation — no real money is transferred.
          </p>
        </div>
      </div>
    )
  }

  // ================= REPAYMENT SETUP =================
  if (repayment) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-2xl mx-auto">

          <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
          <h1 className="text-3xl font-semibold mt-3" style={{fontFamily: '"Fraunces", serif'}}>Repayment setup</h1>
          <p className="text-[#98a2b8] mt-2 mb-8">Choose a repayment plan that fits your income.</p>

          <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-2xl p-5 mb-6">
            <p className="text-[#5fae8c] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Cap-Protected Auto-Pay
            </p>
            <p className="text-sm text-[#f5f3ef]/80 mt-2 leading-relaxed">
              Your weekly repayment can never exceed 20% of your average weekly income
              (₹{maxWeeklyRepayment}). Periods that would break this cap are disabled below.
            </p>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7">
            <div className="mb-6">
              <p className="text-[#98a2b8] text-sm">Loan amount</p>
              <p className="text-3xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{loanAmount}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-[#f5f3ef]/80 mb-2">Repayment period</label>
              <select
                value={repaymentPeriod}
                onChange={(e) => setRepaymentPeriod(Number(e.target.value))}
                className="w-full bg-[#1e2740] border border-[#2a3552] rounded-xl px-4 py-3"
              >
                {periodOptions.map((period) => (
                  <option key={period} value={period} disabled={!isPeriodValid(period)}>
                    {period} weeks{!isPeriodValid(period) ? " — exceeds 20% cap" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#1e2740] rounded-xl p-5 mb-6">
              <p className="text-[#98a2b8] text-sm">Weekly repayment</p>
              <p className="text-2xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{weeklyRepayment}</p>
              <p className="text-xs text-[#98a2b8] mt-2">
                Cap: ₹{maxWeeklyRepayment}/week (20% of ₹{averageWeeklyIncome} average income)
              </p>
            </div>

            <button
              onClick={() => { setRepayment(false); setActiveLoan(true) }}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl hover:bg-[#c08a2e] transition"
            >
              Confirm repayment plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= ELIGIBILITY =================
  if (eligibility) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#5fae8c]/10 border border-[#5fae8c]/30 mb-4">
              <Check className="w-7 h-7 text-[#5fae8c]" />
            </div>

            <h1 className="text-3xl font-semibold" style={{fontFamily: '"Fraunces", serif'}}>You're eligible</h1>
            <p className="text-[#98a2b8] mt-3">Based on your demo income and repayment profile.</p>

            <div className="bg-[#1e2740] rounded-2xl p-6 mt-7">
              <p className="text-[#98a2b8] text-sm">Gig-Behavior Score</p>
              <p className="text-5xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>{gigCashScore}</p>
              <p className="text-xs text-[#98a2b8] mt-1">Range: 300–850</p>
              <p className="text-[#5fae8c] mt-2">Good repayment capacity</p>
            </div>

            <div className="bg-[#161d2e] border border-[#5fae8c]/30 rounded-2xl p-6 mt-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{fontFamily: '"Fraunces", serif'}}>
                  <BarChart3 className="w-5 h-5 text-[#5fae8c]" /> Why this score?
                </h2>
                <span className="text-xs text-[#5fae8c] font-semibold border border-[#5fae8c]/30 rounded-full px-3 py-1">
                  Explainable
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-[#1e2740] rounded-xl p-4">
                  <div>
                    <p className="font-medium">Income stability</p>
                    <p className="text-xs text-[#98a2b8] mt-1">Consistent earning pattern</p>
                  </div>
                  <span className="text-[#5fae8c] font-semibold">+{incomeStabilityPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-[#1e2740] rounded-xl p-4">
                  <div>
                    <p className="font-medium">Essential expense coverage</p>
                    <p className="text-xs text-[#98a2b8] mt-1">Essentials are protected first</p>
                  </div>
                  <span className="text-[#5fae8c] font-semibold">+{expenseCoveragePoints}</span>
                </div>

                <div className="flex items-center justify-between bg-[#1e2740] rounded-xl p-4">
                  <div>
                    <p className="font-medium">Repayment capacity</p>
                    <p className="text-xs text-[#98a2b8] mt-1">Weekly repayment fits the income profile</p>
                  </div>
                  <span className="text-[#5fae8c] font-semibold">+{repaymentCapacityPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-[#1e2740] rounded-xl p-4">
                  <div>
                    <p className="font-medium">Buffer protection</p>
                    <p className="text-xs text-[#98a2b8] mt-1">Rainy-week support reduces repayment stress</p>
                  </div>
                  <span className="text-[#5fae8c] font-semibold">+{bufferProtectionPoints}</span>
                </div>

                <div className="flex items-center justify-between bg-[#1e2740] rounded-xl p-4">
                  <div>
                    <p className="font-medium">Responsible borrowing</p>
                    <p className="text-xs text-[#98a2b8] mt-1">Credit limit considers safe-to-use income</p>
                  </div>
                  <span className="text-[#5fae8c] font-semibold">+{responsibleBorrowingPoints}</span>
                </div>
              </div>

              <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/20 rounded-xl p-4 mt-4">
                <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                  <span className="text-[#5fae8c] font-semibold">How it works: </span>
                  GigCash starts at 300 and adds points for income stability, essential-expense
                  coverage, repayment capacity, buffer protection, and responsible borrowing
                  behavior — capped at 850.
                </p>
              </div>
            </div>

            <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-2xl p-5 mt-5 text-left">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#5fae8c] shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Essential expense protection</h3>
                  <p className="text-sm text-[#98a2b8] mt-2 leading-relaxed">
                    GigCash protects essential expenses such as rent, food, and basic work needs
                    before considering how much you can safely repay.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="bg-[#1e2740] rounded-xl p-3">
                      <p className="text-xs text-[#98a2b8]">Priority 1</p>
                      <p className="font-semibold mt-1 flex items-center gap-1.5">
                        <Home className="w-4 h-4" /> Rent
                      </p>
                    </div>
                    <div className="bg-[#1e2740] rounded-xl p-3">
                      <p className="text-xs text-[#98a2b8]">Priority 2</p>
                      <p className="font-semibold mt-1 flex items-center gap-1.5">
                        <UtensilsCrossed className="w-4 h-4" /> Food & essentials
                      </p>
                    </div>
                    <div className="bg-[#1e2740] rounded-xl p-3">
                      <p className="text-xs text-[#98a2b8]">Priority 3</p>
                      <p className="font-semibold mt-1 flex items-center gap-1.5">
                        <Bike className="w-4 h-4" /> Work expenses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setEligibility(false); setRepayment(true) }}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-7 hover:bg-[#c08a2e] transition"
            >
              Continue to repayment
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= LOAN APPLICATION =================
  if (loanApplication) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-2xl mx-auto">

          <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
          <h1 className="text-3xl font-semibold mt-3" style={{fontFamily: '"Fraunces", serif'}}>Apply for credit</h1>
          <p className="text-[#98a2b8] mt-2 mb-8">Request a small amount based on your current needs.</p>

          <div className="bg-[#9b86d9]/10 border border-[#9b86d9]/30 rounded-2xl p-5 mb-6">
            <p className="text-[#9b86d9] font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" /> Smart credit limit
            </p>
            <p className="text-sm text-[#f5f3ef]/80 mt-2 leading-relaxed">
              GigCash recommends up to <span className="font-semibold text-[#f5f3ef]">₹{recommendedCreditLimit}</span> based
              on your safe-to-use income. Requesting above this amount may increase repayment pressure.
            </p>
          </div>

          <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-2xl p-5 mb-6">
            <p className="text-[#5fae8c] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Cap-Protected Auto-Pay
            </p>
            <p className="text-sm text-[#f5f3ef]/80 mt-2 leading-relaxed">
              Whatever amount you choose, your weekly repayment will never be allowed to exceed
              ₹{maxWeeklyRepayment} — 20% of your average weekly income. We'll disable any
              repayment period that would break this on the next screen.
            </p>
          </div>

          <div className="bg-[#6ea3d8]/10 border border-[#6ea3d8]/30 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-[#6ea3d8] shrink-0" />
              <div className="flex-1">
                <p className="text-[#6ea3d8] text-sm font-semibold">Adaptive credit amount</p>
                <h2 className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>
                  Recommended for you: ₹{adaptiveCreditAmount}
                </h2>
                <p className="text-sm text-[#f5f3ef]/80 mt-2 leading-relaxed">
                  This amount keeps the simulated weekly repayment at about ₹{adaptiveWeeklyRepayment}
                  while protecting your essential expenses and staying within your safer credit range.
                </p>
                <button
                  type="button"
                  onClick={() => setLoanAmount(adaptiveCreditAmount)}
                  className="bg-[#d9a441] text-[#0f1420] font-semibold px-5 py-2.5 rounded-xl mt-4 hover:bg-[#c08a2e] transition"
                >
                  Use recommended amount
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7">
            <label className="block text-sm text-[#f5f3ef]/80 mb-2">Loan amount</label>
            <input
              type="number"
              min="500"
              max="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full bg-[#1e2740] border border-[#2a3552] rounded-xl px-4 py-3 mb-6"
            />

            <div className="mb-3">
              <label className="block text-sm text-[#f5f3ef]/80">Loan purpose</label>
              <p className="text-xs text-[#98a2b8] mt-1">Essential needs are prioritised to reduce financial stress.</p>
            </div>

            <select
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              className="w-full bg-[#1e2740] border border-[#2a3552] rounded-xl px-4 py-3 mb-6"
            >
              <option value="">Select purpose</option>
              <option value="rent">Rent</option>
              <option value="food">Food & essentials</option>
              <option value="vehicle">Vehicle / work expenses</option>
              <option value="emergency">Emergency</option>
            </select>

            {loanAmount > adaptiveCreditAmount && (
              <div className="bg-[#e0913c]/10 border border-[#e0913c]/30 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-[#e0913c] shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-[#e0913c]">Responsible borrowing guidance</h3>
                    <p className="text-sm text-[#f5f3ef]/80 mt-2 leading-relaxed">
                      Your requested amount of ₹{loanAmount} is above the recommended amount of
                      ₹{adaptiveCreditAmount}. A higher loan can increase weekly repayment pressure.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-[#1e2740] rounded-xl p-4">
                        <p className="text-xs text-[#98a2b8]">Requested</p>
                        <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{loanAmount}</p>
                      </div>
                      <div className="bg-[#1e2740] rounded-xl p-4">
                        <p className="text-xs text-[#98a2b8]">Recommended</p>
                        <p className="text-xl font-semibold text-[#5fae8c] mt-1" style={{fontFamily: '"Fraunces", serif'}}>
                          ₹{adaptiveCreditAmount}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLoanAmount(adaptiveCreditAmount)}
                      className="w-full bg-[#e0913c] text-[#0f1420] font-semibold py-3 rounded-xl mt-4 hover:brightness-110 transition"
                    >
                      Reduce to recommended amount
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => { setLoanApplication(false); setEligibility(true) }}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl hover:bg-[#c08a2e] transition"
            >
              Check eligibility
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= DASHBOARD =================
  if (dashboard) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] px-6 py-10 font-sans">
        <div className="max-w-5xl mx-auto">

          <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
          <h1 className="text-3xl font-semibold mt-3" style={{fontFamily: '"Fraunces", serif'}}>Earnings dashboard</h1>
          <p className="text-[#98a2b8] mt-2">Understand your income before taking credit.</p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-6">
              <p className="text-[#98a2b8] text-sm">Average weekly income</p>
              <p className="text-3xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{averageWeeklyIncome}</p>
            </div>
            <div className="bg-[#161d2e] border border-[#2a3552] rounded-xl p-6">
              <p className="text-[#98a2b8] text-sm">Essential expenses</p>
              <p className="text-3xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{essentialExpenses}</p>
            </div>
            <div className="bg-[#161d2e] border-2 border-[#d9a441]/40 rounded-xl p-6">
              <p className="text-[#98a2b8] text-sm">Safe-to-use amount</p>
              <p className="text-3xl font-semibold text-[#d9a441] mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{safeToUseAmount}</p>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#5fae8c]/30 rounded-2xl p-7 mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#5fae8c] text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Earnings-Backed, adaptive income buffer
                </p>
                <h2 className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
                  Safe-to-save recommendation
                </h2>
                <p className="text-[#98a2b8] mt-2 leading-relaxed">
                  No salary slips or bureau scores — GigCash protects your essential expenses
                  first and recommends only a safe portion of the remaining income for your buffer.
                </p>
              </div>
              <Wallet className="w-9 h-9 text-[#5fae8c] shrink-0" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Income after essentials</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{safeToUseAmount}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Recommended to save</p>
                <p className="text-2xl font-semibold text-[#5fae8c] mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{safeToSave}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="text-[#98a2b8] text-sm">Still flexible to use</p>
                <p className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{safeToUseAmount - safeToSave}</p>
              </div>
            </div>

            <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/20 rounded-xl p-4 mt-5">
              <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                <span className="text-[#5fae8c] font-semibold">Why ₹{safeToSave}? </span>
                Your ₹{essentialExpenses} essential expenses are protected first. From the remaining
                ₹{safeToUseAmount}, GigCash recommends only 20% as a safe buffer contribution.
              </p>
            </div>
          </div>

          <div className={`border rounded-2xl p-7 mt-6 ${isRainyDay ? "bg-[#e0913c]/10 border-[#e0913c]/30" : "bg-[#5fae8c]/10 border-[#5fae8c]/30"}`}>
            <p className={`text-sm font-semibold flex items-center gap-2 ${isRainyDay ? "text-[#e0913c]" : "text-[#5fae8c]"}`}>
              <CloudRain className="w-4 h-4" /> Rainy-Day Pause — fully automatic
            </p>
            <h2 className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
              {isRainyDay ? "This week's earnings dipped" : "Your income is on track"}
            </h2>
            <p className="text-[#f5f3ef]/80 mt-2 leading-relaxed">
              GigCash auto-pauses your next repayment whenever a week's income falls below 50% of
              your average — no slider to set, no button to press.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-sm">This week's income</p>
                <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{currentWeekIncome}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-sm">50% threshold</p>
                <p className="text-xl font-semibold mt-1" style={{fontFamily: '"Fraunces", serif'}}>₹{rainyDayThreshold}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-sm">Status</p>
                <p className={`text-lg font-semibold mt-1 ${isRainyDay ? "text-[#e0913c]" : "text-[#5fae8c]"}`} style={{fontFamily: '"Fraunces", serif'}}>
                  {isRainyDay ? "Will auto-pause" : "No pause needed"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#9b86d9]/30 rounded-2xl p-7 mt-6">
            <p className="text-[#9b86d9] text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" /> Smart credit limit
            </p>
            <h2 className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
              Borrow within a safer range
            </h2>
            <p className="text-[#98a2b8] mt-2 leading-relaxed">
              GigCash uses your safe-to-use income to recommend a responsible credit limit, and
              enforces a hard 20% weekly repayment cap on top of it.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-[#1e2740] rounded-xl p-6">
                <p className="text-[#98a2b8] text-sm">Recommended credit limit</p>
                <p className="text-4xl font-semibold text-[#9b86d9] mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{recommendedCreditLimit}</p>
                <p className="text-sm text-[#98a2b8] mt-2">Based on ₹{safeToUseAmount} of income remaining after essential expenses.</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-6">
                <p className="text-[#98a2b8] text-sm">Max weekly repayment (20% cap)</p>
                <p className="text-4xl font-semibold text-[#5fae8c] mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{maxWeeklyRepayment}</p>
                <p className="text-sm text-[#98a2b8] mt-2">Enforced automatically at repayment setup.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#6ea3d8]/30 rounded-2xl p-7 mt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[#6ea3d8] text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Payday Bridge
                </p>
                <h2 className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
                  Need cash between gigs?
                </h2>
                <p className="text-[#98a2b8] mt-2 leading-relaxed max-w-md">
                  A separate, ultra-short-term line — ₹500 to ₹1,500, 5-day fixed term — that never
                  touches your main credit line.
                </p>
              </div>
              <button
                onClick={() => setBridgeScreen(true)}
                className="bg-[#6ea3d8] text-[#0f1420] font-semibold px-5 py-3 rounded-xl hover:brightness-110 transition flex items-center gap-2 shrink-0"
              >
                Open Payday Bridge <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#5fae8c]/30 rounded-2xl p-7 mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#5fae8c] text-sm font-semibold flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> GigCash financial health
                </p>
                <h2 className="text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>
                  Your financial health is stable
                </h2>
                <p className="text-[#98a2b8] mt-2 leading-relaxed">
                  Your simulated income covers essential expenses and leaves room for
                  responsible repayment and buffer protection.
                </p>
              </div>
              <div className="bg-[#5fae8c]/10 border border-[#5fae8c]/30 rounded-full px-4 py-2 shrink-0">
                <span className="text-[#5fae8c] font-semibold">Stable</span>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mt-6">
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-xs">Income stability</p>
                <p className="text-lg font-semibold text-[#5fae8c] mt-2">Good</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-xs">Expense coverage</p>
                <p className="text-lg font-semibold text-[#5fae8c] mt-2">Covered</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-xs">Buffer protection</p>
                <p className="text-lg font-semibold text-[#6ea3d8] mt-2">Active</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4">
                <p className="text-[#98a2b8] text-xs">Repayment capacity</p>
                <p className="text-lg font-semibold text-[#5fae8c] mt-2">Good</p>
              </div>
            </div>

            <div className="bg-[#6ea3d8]/10 border border-[#6ea3d8]/20 rounded-xl p-4 mt-5">
              <p className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                <span className="text-[#6ea3d8] font-semibold">Recommended action: </span>
                Keep building your income buffer and borrow only within your safer credit range.
              </p>
            </div>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-7 mt-6">
            <h2 className="text-xl font-semibold mb-4" style={{fontFamily: '"Fraunces", serif'}}>Income scenarios</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="font-semibold">Stable week</p>
                <p className="text-[#5fae8c] text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹7,200</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="font-semibold">Rainy week</p>
                <p className="text-[#e0913c] text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹{currentWeekIncome}</p>
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5">
                <p className="font-semibold">High-income week</p>
                <p className="text-[#6ea3d8] text-2xl font-semibold mt-2" style={{fontFamily: '"Fraunces", serif'}}>₹9,300</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setLoanApplication(true)}
            className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-7 hover:bg-[#c08a2e] transition"
          >
            Apply for credit
          </button>

          <button
            onClick={() => setAdminDashboard(true)}
            className="w-full bg-[#1e2740] text-[#f5f3ef] font-semibold py-3 rounded-xl mt-3 border border-[#2a3552] hover:border-[#d9a441]/50 transition"
          >
            Open admin dashboard
          </button>
        </div>
      </div>
    )
  }

  // ================= CONSENT =================
  if (consented) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8">
            <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
            <h1 className="text-3xl font-semibold mt-4" style={{fontFamily: '"Fraunces", serif'}}>Data consent</h1>
            <p className="text-[#98a2b8] mt-3 leading-relaxed">
              GigCash uses your earnings information to understand repayment capacity and
              provide responsible credit decisions.
            </p>

            <div className="space-y-3 mt-7">
              <div className="bg-[#1e2740] rounded-xl p-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5fae8c] shrink-0" /> Income pattern analysis
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5fae8c] shrink-0" /> Essential expense protection
              </div>
              <div className="bg-[#1e2740] rounded-xl p-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5fae8c] shrink-0" /> Explainable eligibility decision
              </div>
            </div>

            <label className="flex items-start gap-3 mt-7 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#d9a441]"
              />
              <span className="text-sm text-[#f5f3ef]/80 leading-relaxed">
                I understand and agree to GigCash using my earnings information for responsible
                credit assessment.
              </span>
            </label>

            <button
              disabled={!consentChecked}
              onClick={() => { setConsented(false); setDashboard(true) }}
              className={`w-full font-semibold py-3 rounded-xl mt-5 transition ${
                consentChecked ? "bg-[#d9a441] text-[#0f1420] hover:bg-[#c08a2e]" : "bg-[#1e2740] text-[#98a2b8] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= OTP VERIFICATION =================
  if (verified) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full">
          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#d9a441]/10 border border-[#d9a441]/30 mb-4">
              <Lock className="w-7 h-7 text-[#d9a441]" />
            </div>
            <h1 className="text-3xl font-semibold" style={{fontFamily: '"Fraunces", serif'}}>Welcome to GigCash</h1>
            <p className="text-[#98a2b8] mt-3">Your phone number has been verified.</p>
            <button
              onClick={() => setConsented(true)}
              className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-7 hover:bg-[#c08a2e] transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= LOGIN =================
  if (started) {
    return (
      <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full">
          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8">
            <p className="text-[#d9a441] font-semibold text-lg" style={{fontFamily: '"Fraunces", serif'}}>GigCash</p>
            <h1 className="text-3xl font-semibold mt-4" style={{fontFamily: '"Fraunces", serif'}}>
              {otpSent ? "Enter OTP" : "Log in"}
            </h1>

            {!otpSent ? (
              <>
                <p className="text-[#98a2b8] mt-3">Enter your phone number to continue.</p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full bg-[#1e2740] border border-[#2a3552] rounded-xl px-4 py-3 mt-6"
                />
                <button
                  onClick={() => {
                    const cleanPhone = phone.trim()
                    if (!cleanPhone) { alert("Please enter your phone number"); return }
                    alert("OTP sent successfully. Demo OTP: 123456")
                    setOtpSent(true)
                  }}
                  className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-4 hover:bg-[#c08a2e] transition"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-[#98a2b8] mt-3">
                  Demo OTP: <span className="text-[#f5f3ef] font-semibold">123456</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-[#1e2740] border border-[#2a3552] rounded-xl px-4 py-3 mt-6"
                />
                <button
                  onClick={() => {
                    if (otp === "123456") setVerified(true)
                    else alert("Invalid OTP")
                  }}
                  className="w-full bg-[#d9a441] text-[#0f1420] font-semibold py-3 rounded-xl mt-4 hover:bg-[#c08a2e] transition"
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

  // ================= LANDING PAGE =================
  return (
    <div className="min-h-screen bg-[#0f1420] text-[#f5f3ef] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold text-[#d9a441]" style={{fontFamily: '"Fraunces", serif'}}>GigCash</div>
          <div className="text-sm text-[#98a2b8]">Fair credit for gig workers</div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div>
            <p className="text-[#d9a441] font-semibold mb-4 text-sm">Responsible income smoothing</p>
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight" style={{fontFamily: '"Fraunces", serif'}}>
              Fair, flexible credit for an unpredictable income.
            </h1>
            <p className="text-[#98a2b8] text-lg leading-relaxed mt-6">
              GigCash helps gig workers manage uneven income with explainable credit decisions
              and automatic rainy-day protection.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="bg-[#d9a441] text-[#0f1420] font-semibold px-7 py-3 rounded-xl mt-8 hover:bg-[#c08a2e] transition"
            >
              Get started
            </button>
          </div>

          <div className="bg-[#161d2e] border border-[#2a3552] rounded-2xl p-8">
            <h2 className="text-2xl font-semibold" style={{fontFamily: '"Fraunces", serif'}}>Five key innovations</h2>
            <div className="space-y-3 mt-6">
              <div className="bg-[#1e2740] rounded-xl p-5 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#5fae8c] shrink-0" />
                Earnings-Backed — zero reliance on salary slips or bureau scores
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#9b86d9] shrink-0" />
                Cap-Protected Auto-Pay — repayments never exceed 20% of weekly earnings
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#6ea3d8] shrink-0" />
                Gig-Behavior Score — proprietary score (300–850) rewards consistency
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5 flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#6ea3d8] shrink-0" />
                Payday Bridge — ultra-short-term cash flow support between gigs
              </div>
              <div className="bg-[#1e2740] rounded-xl p-5 flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-[#e0913c] shrink-0" />
                Rainy-Day Pause — auto-pauses if earnings drop below 50% average
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[#98a2b8]/60 text-sm pb-6">
          Demo prototype — no real financial or identity transactions.
        </p>
      </div>
    </div>
  )
}

export default App