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

  const [loanAmount, setLoanAmount] = useState(2000)
  const [loanPurpose, setLoanPurpose] = useState("")
  const [repaymentPeriod, setRepaymentPeriod] = useState(4)

  const [paused, setPaused] = useState(false)
  const [repaidWeeks, setRepaidWeeks] = useState(1)

  const weeklyRepayment = Math.ceil(loanAmount / repaymentPeriod)
  const amountRepaid = paused ? weeklyRepayment : weeklyRepayment * repaidWeeks
  const remainingBalance = Math.max(0, loanAmount - amountRepaid)

  // --------------------------------
  // ACTIVE LOAN
  // --------------------------------

  if (activeLoan) {
    return (
      <main className="min-h-screen bg-slate-100">

        <header className="bg-slate-950 px-6 py-5 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-green-400">
                GigCash
              </h1>

              <p className="text-sm text-slate-400">
                Active Loan
              </p>
            </div>

            <div className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Active
            </div>

          </div>
        </header>

        <section className="mx-auto max-w-4xl px-6 py-10">

          <div>
            <p className="text-sm font-semibold text-green-600">
              YOUR LOAN
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Your GigCash loan is active
            </h2>

            <p className="mt-2 text-slate-600">
              Manage your repayment and protect yourself during
              unexpected income drops.
            </p>
          </div>

          {/* Loan Summary */}

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Original Loan
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                ₹{loanAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Amount Repaid
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                ₹{amountRepaid.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Remaining Balance
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                ₹{remainingBalance.toLocaleString("en-IN")}
              </p>
            </div>

          </div>

          {/* Progress */}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Repayment Progress
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {repaidWeeks} of {repaymentPeriod} weeks completed
                </p>
              </div>

              <p className="text-2xl font-bold text-green-600">
                {Math.round((amountRepaid / loanAmount) * 100)}%
              </p>

            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">

              <div
                style={{
                  width: `${Math.min(
                    100,
                    (amountRepaid / loanAmount) * 100
                  )}%`
                }}
                className="h-full rounded-full bg-green-500"
              />

            </div>

          </div>

          {/* Repayment Schedule */}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-slate-900">
              Repayment Schedule
            </h3>

            <div className="mt-5 space-y-3">

              {Array.from(
                { length: repaymentPeriod },
                (_, index) => {

                  const weekNumber = index + 1
                  const completed = weekNumber <= repaidWeeks
                  const isCurrent =
                    weekNumber === repaidWeeks + 1 && !paused

                  return (
                    <div
                      key={weekNumber}
                      className={`flex items-center justify-between rounded-xl p-4 ${
                        completed
                          ? "bg-green-50"
                          : isCurrent
                          ? "bg-blue-50"
                          : "bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                            completed
                              ? "bg-green-500 text-white"
                              : isCurrent
                              ? "bg-blue-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {completed ? "✓" : weekNumber}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            Week {weekNumber}
                          </p>

                          <p className="text-xs text-slate-500">
                            {completed
                              ? "Payment completed"
                              : isCurrent
                              ? paused
                                ? "Payment paused"
                                : "Current payment"
                              : "Upcoming payment"}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold text-slate-900">
                        ₹{weeklyRepayment.toLocaleString("en-IN")}
                      </p>

                    </div>
                  )
                }
              )}

            </div>

          </div>

          {/* Rainy Day Protection */}

          <div
            className={`mt-6 rounded-2xl border p-6 ${
              paused
                ? "border-yellow-300 bg-yellow-50"
                : "border-green-200 bg-green-50"
            }`}
          >

            <div className="flex gap-4">

              <div className="text-3xl">
                🌧️
              </div>

              <div className="flex-1">

                <h3 className="text-xl font-bold text-slate-900">
                  Rainy-Day Protection
                </h3>

                {paused ? (
                  <>
                    <p className="mt-2 text-sm leading-6 text-yellow-800">
                      A temporary income drop has been detected.
                      Your repayment is currently paused to reduce
                      financial pressure.
                    </p>

                    <div className="mt-4 rounded-xl bg-white p-4">

                      <p className="text-sm font-semibold text-slate-900">
                        🛡️ Repayment Pause Active
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        No payment is required during the simulated
                        rainy week.
                      </p>

                    </div>

                    <button
                      onClick={() => {
                        setPaused(false)
                        setRepaidWeeks(
                          Math.min(
                            repaymentPeriod,
                            repaidWeeks + 1
                          )
                        )
                      }}
                      className="mt-4 rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950"
                    >
                      Resume Repayment
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      If your income falls significantly, GigCash can
                      detect a potential rainy week and recommend
                      temporary repayment flexibility.
                    </p>

                    <button
                      onClick={() => setPaused(true)}
                      className="mt-4 rounded-lg border border-yellow-400 bg-yellow-100 px-5 py-3 font-bold text-yellow-900 hover:bg-yellow-200"
                    >
                      Simulate Rainy-Day Pause
                    </button>

                    <p className="mt-2 text-xs text-slate-500">
                      Demo feature: simulates a sudden income drop.
                    </p>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* Innovation Explanation */}

          <div className="mt-6 rounded-2xl bg-slate-950 p-6 text-white">

            <p className="text-sm font-semibold text-green-400">
              GIGCASH INNOVATION
            </p>

            <h3 className="mt-2 text-xl font-bold">
              Credit that adapts to income
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Traditional repayment plans assume income stays
              predictable. GigCash is designed around the opposite
              reality: gig workers can have strong and weak earning
              weeks. Rainy-Day Protection gives the repayment plan
              flexibility when income temporarily falls.
            </p>

          </div>

          <button
            onClick={() => setActiveLoan(false)}
            className="mt-8 w-full rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
          >
            Back
          </button>

          <p className="mt-5 pb-8 text-center text-xs text-slate-500">
            This is a simulated active loan for the GigCash prototype.
            No real loan, payment, or financial transaction occurs.
          </p>

        </section>

      </main>
    )
  }

  // --------------------------------
  // REPAYMENT SETUP
  // --------------------------------

  if (repayment) {
    return (
      <main className="min-h-screen bg-slate-100">

        <header className="bg-slate-950 px-6 py-5 text-white">

          <div className="mx-auto flex max-w-6xl items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-green-400">
                GigCash
              </h1>

              <p className="text-sm text-slate-400">
                Repayment Setup
              </p>
            </div>

            <div className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Step 3 of 3
            </div>

          </div>

        </header>

        <section className="mx-auto max-w-3xl px-6 py-10">

          <p className="text-sm font-semibold text-green-600">
            REPAYMENT PLAN
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Your repayment plan
          </h2>

          <p className="mt-2 text-slate-600">
            Here's a simple view of how your simulated repayment works.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <div className="grid gap-6 sm:grid-cols-3">

              <div>
                <p className="text-sm text-slate-500">
                  Loan Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ₹{loanAmount.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Repayment Period
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {repaymentPeriod} Weeks
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Weekly Repayment
                </p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  ₹{weeklyRepayment.toLocaleString("en-IN")}
                </p>
              </div>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-slate-900">
              Repayment Schedule
            </h3>

            <div className="mt-5 space-y-3">

              {Array.from(
                { length: repaymentPeriod },
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                        {index + 1}
                      </div>

                      <p className="font-semibold text-slate-900">
                        Week {index + 1}
                      </p>

                    </div>

                    <p className="font-bold">
                      ₹{weeklyRepayment.toLocaleString("en-IN")}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

            <div className="flex gap-4">

              <div className="text-3xl">
                🌧️
              </div>

              <div>

                <h3 className="text-lg font-bold text-yellow-900">
                  Rainy-Day Protection
                </h3>

                <p className="mt-2 text-sm leading-6 text-yellow-800">
                  If your income drops significantly during a repayment
                  period, GigCash can identify a potential rainy week
                  and recommend temporary repayment flexibility.
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={() => {
              setRepayment(false)
              setActiveLoan(true)
            }}
            className="mt-8 w-full rounded-xl bg-green-500 px-6 py-4 text-lg font-bold text-slate-950 hover:bg-green-400"
          >
            Confirm Repayment Plan
          </button>

          <button
            onClick={() => setRepayment(false)}
            className="mt-3 w-full rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
          >
            Go Back
          </button>

          <p className="mt-5 pb-8 text-center text-xs text-slate-500">
            This is a simulated repayment plan for the GigCash prototype.
          </p>

        </section>

      </main>
    )
  }

  // --------------------------------
  // ELIGIBILITY
  // --------------------------------

  if (eligibility) {

    let score = 700
    const reasons = []

    if (loanAmount <= 2000) {
      score += 50
      reasons.push({
        icon: "✓",
        title: "Manageable loan amount",
        text: "The requested amount is relatively small."
      })
    } else if (loanAmount <= 3500) {
      score += 20
      reasons.push({
        icon: "✓",
        title: "Moderate loan amount",
        text: "The requested amount is within a moderate range."
      })
    } else {
      score -= 30
      reasons.push({
        icon: "⚠️",
        title: "Higher requested amount",
        text: "A larger request increases repayment pressure."
      })
    }

    if (repaymentPeriod === 2) {
      score -= 10
    } else if (repaymentPeriod === 4) {
      score += 30
    } else {
      score += 10
    }

    if (
      loanPurpose === "Rent / Housing" ||
      loanPurpose === "Food & Essentials"
    ) {
      score += 20
      reasons.push({
        icon: "✓",
        title: "Essential expense",
        text: "Essential needs are prioritized."
      })
    } else if (loanPurpose === "Work Expenses") {
      score += 15
      reasons.push({
        icon: "✓",
        title: "Income-supporting expense",
        text: "Work expenses can help maintain earning capacity."
      })
    } else {
      score += 5
      reasons.push({
        icon: "✓",
        title: "Short-term need",
        text: "The request is evaluated as temporary support."
      })
    }

    score = Math.max(300, Math.min(850, score))

    let status = ""

    if (score >= 700) {
      status = "Eligible"
    } else if (score >= 600) {
      status = "Needs Review"
    } else {
      status = "Not Eligible"
    }

    return (
      <main className="min-h-screen bg-slate-100">

        <header className="bg-slate-950 px-6 py-5 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-green-400">
                GigCash
              </h1>

              <p className="text-sm text-slate-400">
                Eligibility Decision
              </p>
            </div>

          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-10">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl text-green-600">
                ✓
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              {status === "Eligible"
                ? "You may be eligible"
                : status}
            </h2>

            <p className="mt-3 text-slate-600">
              Your request was evaluated using simple,
              explainable factors.
            </p>

          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Requested Amount
                </p>

                <p className="mt-1 text-3xl font-bold">
                  ₹{loanAmount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 px-4 py-3 text-center">

                <p className="text-xs">
                  STATUS
                </p>

                <p className="font-bold text-green-700">
                  {status}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                GigCash Support Score
              </p>

              <p className="mt-1 text-4xl font-bold">
                {score}
              </p>

              <div className="mt-4 h-3 rounded-full bg-slate-200">

                <div
                  style={{
                    width: `${((score - 300) / 550) * 100}%`
                  }}
                  className="h-full rounded-full bg-green-500"
                />

              </div>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Why this decision?
            </h3>

            <div className="mt-5 space-y-3">

              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl bg-green-50 p-4"
                >

                  <span className="text-xl">
                    {reason.icon}
                  </span>

                  <div>
                    <p className="font-semibold">
                      {reason.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {reason.text}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {status === "Eligible" && (
            <button
              onClick={() => setRepayment(true)}
              className="mt-8 w-full rounded-xl bg-green-500 px-6 py-4 text-lg font-bold text-slate-950"
            >
              Continue to Repayment
            </button>
          )}

          <button
            onClick={() => setEligibility(false)}
            className="mt-3 w-full rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
          >
            Go Back
          </button>

        </section>

      </main>
    )
  }

  // --------------------------------
  // LOAN APPLICATION
  // --------------------------------

  if (loanApplication) {
    return (
      <main className="min-h-screen bg-slate-100">

        <header className="bg-slate-950 px-6 py-5 text-white">

          <div className="mx-auto max-w-6xl">

            <h1 className="text-2xl font-bold text-green-400">
              GigCash
            </h1>

            <p className="text-sm text-slate-400">
              Loan Application
            </p>

          </div>

        </header>

        <section className="mx-auto max-w-3xl px-6 py-8">

          <p className="text-sm font-semibold text-green-600">
            RESPONSIBLE CREDIT
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            How much do you need?
          </h2>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="font-bold">
              Loan Amount
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {[500, 1000, 2000, 3000, 4000, 5000].map(
                (amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className={`rounded-xl border px-4 py-4 font-bold ${
                      loanAmount === amount
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-slate-300"
                    }`}
                  >
                    ₹{amount.toLocaleString("en-IN")}
                  </button>
                )
              )}

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="font-bold">
              What is this for?
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              {[
                "Rent / Housing",
                "Food & Essentials",
                "Work Expenses",
                "Other"
              ].map((purpose) => (

                <button
                  key={purpose}
                  onClick={() => setLoanPurpose(purpose)}
                  className={`rounded-xl border p-4 text-left font-semibold ${
                    loanPurpose === purpose
                      ? "border-green-500 bg-green-50"
                      : "border-slate-300"
                  }`}
                >
                  {purpose}
                </button>

              ))}

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="font-bold">
              Repayment Period
            </h3>

            <div className="mt-5 grid grid-cols-3 gap-3">

              {[2, 4, 6].map((weeks) => (

                <button
                  key={weeks}
                  onClick={() => setRepaymentPeriod(weeks)}
                  className={`rounded-xl border p-4 font-bold ${
                    repaymentPeriod === weeks
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-slate-300"
                  }`}
                >
                  {weeks} Weeks
                </button>

              ))}

            </div>

          </div>

          <button
            onClick={() => {

              if (!loanPurpose) {
                alert("Please select the purpose of the loan.")
                return
              }

              setEligibility(true)

            }}
            className="mt-8 w-full rounded-xl bg-green-500 px-6 py-4 text-lg font-bold text-slate-950"
          >
            Continue to Eligibility
          </button>

        </section>

      </main>
    )
  }

  // --------------------------------
  // DASHBOARD
  // --------------------------------

  if (dashboard) {
    return (
      <main className="min-h-screen bg-slate-100">

        <header className="bg-slate-950 px-6 py-5 text-white">

          <div className="mx-auto max-w-6xl">

            <h1 className="text-2xl font-bold text-green-400">
              GigCash
            </h1>

            <p className="text-sm text-slate-400">
              Earnings Dashboard
            </p>

          </div>

        </header>

        <section className="mx-auto max-w-6xl px-6 py-8">

          <h2 className="text-3xl font-bold">
            Your earnings at a glance
          </h2>

          <p className="mt-2 text-slate-600">
            Here's a simple view of your recent income pattern.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Last 30 Days
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₹24,600
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Average Weekly Income
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₹6,150
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Income Stability
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                Good
              </p>
            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              30-Day Earnings Pattern
            </h3>

            <div className="mt-8 flex h-56 items-end gap-2">

              {[
                45, 62, 55, 70, 48, 75, 60,
                52, 68, 80, 58, 72, 65, 50,
                76, 64, 82, 58, 70, 88, 60,
                55, 74, 68, 80, 62, 72, 58,
                78, 85
              ].map((height, index) => (

                <div
                  key={index}
                  className="flex flex-1 items-end"
                >

                  <div
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-md bg-green-400"
                  />

                </div>

              ))}

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">

            <h3 className="text-2xl font-bold">
              Need support during a low-income week?
            </h3>

            <p className="mt-2 text-slate-300">
              Check how much credit you may be eligible for.
            </p>

            <button
              onClick={() => setLoanApplication(true)}
              className="mt-5 rounded-lg bg-green-500 px-6 py-3 font-bold text-slate-950"
            >
              Check Eligibility
            </button>

          </div>

        </section>

      </main>
    )
  }

  // --------------------------------
  // CONSENT
  // --------------------------------

  if (consented) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              🔐
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Your data, your choice
            </h1>

            <p className="mt-3 text-slate-600">
              We need your permission to use your earnings information
              for personalized financial support.
            </p>

          </div>

          <div className="mt-8 space-y-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <h2 className="font-semibold">
                What we use
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Earnings patterns and repayment-related information.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h2 className="font-semibold">
                Why we use it
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                To understand income stability and make an explainable
                eligibility decision.
              </p>
            </div>

          </div>

          <button
            onClick={() => {
              setConsented(false)
              setDashboard(true)
            }}
            className="mt-8 w-full rounded-lg bg-green-500 px-5 py-3 font-bold"
          >
            I Agree & Continue
          </button>

        </div>

      </main>
    )
  }

  // --------------------------------
  // VERIFIED
  // --------------------------------

  if (verified) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            OTP Verified
          </h1>

          <p className="mt-3 text-slate-600">
            Your mobile number has been verified successfully.
          </p>

          <button
            onClick={() => setConsented(true)}
            className="mt-8 w-full rounded-lg bg-green-500 px-5 py-3 font-bold"
          >
            Continue
          </button>

        </div>

      </main>
    )
  }

  // --------------------------------
  // OTP
  // --------------------------------

  if (otpSent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              📱
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Enter OTP
            </h1>

            <p className="mt-3 text-slate-600">
              We sent a 6-digit OTP to
            </p>

            <p className="mt-1 font-semibold">
              +91 {phone}
            </p>

          </div>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter 123456"
            className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-lg tracking-widest"
          />

          <button
            onClick={() => {

              if (otp === "123456") {
                setVerified(true)
              } else {
                alert("Invalid OTP. Please try again.")
              }

            }}
            className="mt-4 w-full rounded-lg bg-green-500 px-5 py-3 font-bold"
          >
            Verify OTP
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Demo OTP: 123456
          </p>

        </div>

      </main>
    )
  }

  // --------------------------------
  // LOGIN
  // --------------------------------

  if (started) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              📱
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Welcome to GigCash
            </h1>

            <p className="mt-3 text-slate-600">
              Enter your mobile number to get started.
            </p>

          </div>

          <label className="mt-8 block text-sm font-semibold">
            Mobile Number
          </label>

          <div className="mt-2 flex">

            <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-4">
              +91
            </span>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              placeholder="Enter mobile number"
              className="w-full rounded-r-lg border border-slate-300 px-4 py-3"
            />

          </div>

          <button
            onClick={() => {

              if (phone.length === 10) {
                setOtpSent(true)
              } else {
                alert("Please enter a valid 10-digit mobile number.")
              }

            }}
            className="mt-6 w-full rounded-lg bg-green-500 px-5 py-3 font-bold"
          >
            Send OTP
          </button>

        </div>

      </main>
    )
  }

  // --------------------------------
  // LANDING PAGE
  // --------------------------------

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <nav className="flex items-center justify-between px-6 py-5 md:px-12">

        <div className="text-2xl font-bold text-green-400">
          GigCash
        </div>

        <button
          onClick={() => setStarted(true)}
          className="rounded-lg bg-green-500 px-5 py-2 font-bold text-slate-950"
        >
          Get Started
        </button>

      </nav>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-4xl text-slate-950">
          ₹
        </div>

        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Fair, flexible credit
          <span className="block text-green-400">
            for an unpredictable income.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          GigCash helps gig workers manage income ups and downs
          with responsible, explainable financial support.
        </p>

        <button
          onClick={() => setStarted(true)}
          className="mt-8 rounded-lg bg-green-500 px-8 py-4 text-lg font-bold text-slate-950"
        >
          Get Started
        </button>

      </section>

      <section className="bg-slate-900 px-6 py-16">

        <div className="mx-auto max-w-5xl">

          <h2 className="text-center text-3xl font-bold">
            How It Works
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-slate-800 p-6">
              <div className="text-3xl">📊</div>

              <h3 className="mt-4 text-xl font-bold">
                Understand Your Income
              </h3>

              <p className="mt-2 text-slate-300">
                See your earnings patterns and understand how stable
                your income is.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6">
              <div className="text-3xl">💰</div>

              <h3 className="mt-4 text-xl font-bold">
                Get Fair Credit
              </h3>

              <p className="mt-2 text-slate-300">
                Apply for small, responsible financial support.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6">
              <div className="text-3xl">🛡️</div>

              <h3 className="mt-4 text-xl font-bold">
                Stay Protected
              </h3>

              <p className="mt-2 text-slate-300">
                Rainy-Day Protection helps manage repayments during
                difficult income periods.
              </p>
            </div>

          </div>

        </div>

      </section>

      <footer className="px-6 py-8 text-center text-sm text-slate-500">
        GigCash is a prototype for demonstration purposes only.
        <br />
        No real financial or identity services are connected.
      </footer>

    </main>
  )
}

export default App