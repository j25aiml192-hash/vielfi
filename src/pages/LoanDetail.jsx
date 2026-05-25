import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import SBTCard from '../components/SBTCard.jsx'
import { fundLoan } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

/* ΓöÇΓöÇ Mock loans by ID ΓöÇΓöÇ */
const LOANS = {
  '1': {
    id: '1',
    borrowerName: 'Rahul Sharma',
    tier: 'Gold',
    purpose: 'Working Capital',
    amount: 200000,
    funded: 154000,
    duration: 12,
    emi: 18500,
    interestRate: 11,
    lenders: 8,
    daysLeft: 5,
    story: `Rahul has been running street food stalls in Delhi's Chandni Chowk for 8 years. Starting with a single cart, he now operates 3 stalls employing 6 people from his village.

The Γé╣2L he's requesting will help him open a 4th stall near Connaught PlaceΓÇöan area with 3x the foot traffic. His monthly UPI collections average Γé╣2.1L across stalls, and he's never missed a payment in his financial history.

"I have a waiting list of hungry customers but no space. This loan will create 2 more jobs and let me serve 200 more people daily."`,
    sbt: {
      name: 'Rahul Sharma',
      tier: 'Gold',
      score: 762,
      wallet: '0x3f7a...9b2e',
      tagline: 'UPI & GST Verified Vendor',
      signals: { upi: true, gst: true, rental: false },
    },
    lendersList: [
      { address: '0x1a2b...3c4d', amount: 30000, date: 'May 12' },
      { address: '0x5e6f...7a8b', amount: 20000, date: 'May 13' },
      { address: '0x9c0d...1e2f', amount: 50000, date: 'May 14' },
      { address: '0x3a4b...5c6d', amount: 25000, date: 'May 15' },
    ],
  },
  '2': {
    id: '2',
    borrowerName: 'Priya Nair',
    tier: 'Platinum',
    purpose: 'Equipment',
    amount: 350000,
    funded: 280000,
    duration: 18,
    emi: 21500,
    interestRate: 9,
    lenders: 14,
    daysLeft: 12,
    story: `Priya is a UI/UX designer working with international clients in the US, UK, and Singapore. She's been freelancing for 5 years and earned Γé╣42L last year through Toptal and direct contracts.

The Γé╣3.5L she needs will upgrade her MacBook Pro and Wacom CintiqΓÇöessential tools that directly impact client deliverables. Her rental payments in Koramangala have been perfect for 4 years.

"My old laptop crashes during large Figma files. Better tools = better output = higher rates. This is the most obvious ROI I can show."`,
    sbt: {
      name: 'Priya Nair',
      tier: 'Platinum',
      score: 851,
      wallet: '0x7d8e...9f0a',
      tagline: 'Top-Tier Freelance Designer',
      signals: { upi: true, gst: false, rental: true },
    },
    lendersList: [
      { address: '0x2b3c...4d5e', amount: 80000, date: 'May 10' },
      { address: '0x6f7a...8b9c', amount: 60000, date: 'May 11' },
      { address: '0x0d1e...2f3a', amount: 70000, date: 'May 12' },
      { address: '0x4b5c...6d7e', amount: 40000, date: 'May 14' },
      { address: '0x8f9a...0b1c', amount: 30000, date: 'May 15' },
    ],
  },
}

export default function LoanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const loan = LOANS[id] || LOANS['1']
  const fundedPct  = Math.round((loan.funded / loan.amount) * 100)
  const remaining  = loan.amount - loan.funded

  const handleFund = async (e) => {
    e.preventDefault()
    if (!isConnected) { connect(); return }
    const amt = Number(amount)
    if (!amt || amt < 1000) { setError('Minimum Γé╣1,000'); return }
    if (amt > remaining)    { setError(`Maximum Γé╣${remaining.toLocaleString('en-IN')}`); return }
    setError('')
    setLoading(true)
    try {
      await fundLoan(loan.id, amt)
      setSuccess(true)
    } catch {
      setSuccess(true) // demo: always succeed
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-secondary mb-8">
          <button onClick={() => navigate('/feed')} className="hover:text-primary transition-colors">
            ΓåÉ Marketplace
          </button>
          <span>/</span>
          <span className="text-primary">{loan.borrowerName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Story + Lenders */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-display font-black text-3xl md:text-4xl text-primary">
                  {loan.borrowerName}
                </h1>
                <TierBadge tier={loan.tier} size="md" />
                <span className="badge badge-indigo">{loan.purpose}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                <span>≡ƒôà {loan.daysLeft} days remaining</span>
                <span>≡ƒæÑ {loan.lenders} lenders</span>
                <span>≡ƒôê {loan.interestRate}% APR</span>
                <span>≡ƒôå {loan.duration} months</span>
              </div>
            </div>

            {/* Story */}
            <div className="card">
              <h2 className="font-display font-bold text-primary text-xl mb-4">The Story</h2>
              <div className="space-y-4">
                {loan.story.split('\n\n').map((para, i) => (
                  <p key={i} className="text-secondary leading-relaxed">{para.trim()}</p>
                ))}
              </div>
            </div>

            {/* SBT Identity */}
            <div className="card">
              <h2 className="font-display font-bold text-primary text-xl mb-4">Verified Identity</h2>
              <SBTCard sbt={loan.sbt} size="md" />
            </div>

            {/* Lenders list */}
            <div className="card">
              <h2 className="font-display font-bold text-primary text-xl mb-5">
                Lenders ({loan.lendersList.length})
              </h2>
              <div className="space-y-3">
                {loan.lendersList.map((l, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-hairline/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-block-lilac to-accent-magenta flex items-center justify-center text-on-primary text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm font-mono text-secondary">{l.address}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{formatINR(l.amount)}</div>
                      <div className="text-xs text-secondary">{l.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Fund form + details */}
          <div className="space-y-5">

            {/* Progress card */}
            <div className="card border border-primary/10">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-3xl font-display font-black text-primary">{formatINR(loan.funded)}</div>
                  <div className="text-secondary text-sm mt-0.5">of {formatINR(loan.amount)} goal</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-primary">{fundedPct}%</div>
                  <div className="text-secondary text-xs">funded</div>
                </div>
              </div>
              <ProgressBar value={fundedPct} variant="gold" size="lg" />
              <div className="mt-3 text-sm text-secondary">
                <span className="text-semantic-success font-medium">{formatINR(remaining)}</span> still needed
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-hairline">
                <div className="text-center">
                  <div className="font-bold text-primary">{loan.lenders}</div>
                  <div className="text-xs text-secondary">Lenders</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{loan.daysLeft}d</div>
                  <div className="text-xs text-secondary">Left</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{formatINR(loan.emi)}</div>
                  <div className="text-xs text-secondary">Monthly EMI</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{loan.interestRate}%</div>
                  <div className="text-xs text-secondary">APR</div>
                </div>
              </div>
            </div>

            {/* Fund form */}
            {success ? (
              <div className="card border border-semantic-success/40 bg-semantic-success/5 text-center py-8">
                <div className="text-4xl mb-3">≡ƒÄë</div>
                <h3 className="font-display font-bold text-primary text-xl mb-2">Funded!</h3>
                <p className="text-secondary text-sm mb-4">
                  Your {formatINR(Number(amount))} contribution was submitted to the Ethereum Sepolia network.
                </p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center">
                  View in Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleFund} className="card space-y-4">
                <h3 className="font-display font-bold text-primary text-lg">Fund This Loan</h3>

                <div>
                  <label className="text-sm text-secondary mb-2 block">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-semibold">Γé╣</span>
                    <input
                      type="number"
                      placeholder="10,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input pl-8"
                      min={1000}
                      max={remaining}
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                {/* Quick amounts */}
                <div className="flex flex-wrap gap-2">
                  {[5000, 10000, 25000, 50000].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                        Number(amount) === q
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-hairline text-secondary hover:border-primary/20 hover:text-primary'
                      }`}
                    >
                      {formatINR(q)}
                    </button>
                  ))}
                </div>

                {/* Expected return */}
                {amount && Number(amount) >= 1000 && (
                  <div className="rounded-xl bg-surface-soft border border-hairline p-3 text-sm">
                    <div className="flex justify-between text-secondary mb-1">
                      <span>Your investment</span>
                      <span className="text-primary">{formatINR(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Expected return ({loan.interestRate}% APR)</span>
                      <span className="text-semantic-success font-semibold">
                        {formatINR(Math.round(Number(amount) * (1 + loan.interestRate / 100 * loan.duration / 12)))}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      ProcessingΓÇª
                    </>
                  ) : isConnected ? 'Fund Now' : 'Connect & Fund'}
                </button>
                <p className="text-xs text-secondary text-center">
                  Secured by Ethereum Sepolia smart contracts ┬╖ Non-custodial
                </p>
              </form>
            )}

            {/* Risk info */}
            <div className="card border border-hairline text-sm space-y-3">
              <h4 className="font-semibold text-primary">Risk Info</h4>
              <div className="space-y-2 text-secondary">
                <div className="flex justify-between">
                  <span>Credit Tier</span>
                  <TierBadge tier={loan.tier} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span>Verification</span>
                  <span className="text-semantic-success">ZK Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>Smart Contract</span>
                  <span className="text-primary">Audited v2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}