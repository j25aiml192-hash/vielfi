import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { getMarketplaceFeed } from '../api/index.js'

/* ── helpers ── */
const formatINR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const normalizeKey = (v) => String(v || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
const normalizeAddress = (v) => String(v || '').trim().toLowerCase()

const adaptLoan = (loan) => {
  const amount        = Number(loan.amount || 0)
  const fundedAmount  = Number(loan.fundedAmount ?? loan.funded ?? 0)
  const durationMonths = Number(loan.durationMonths || loan.duration || 12)
  const interestRate  = Number(loan.apr ?? loan.interestRate ?? 12)
  return {
    ...loan,
    id:           String(loan.id),
    borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
    borrower:     loan.borrower || loan.borrowerName || '',
    borrowerWallet: loan.borrowerWallet || loan.borrowerAddress || loan.wallet || loan.address || '',
    profileId:    loan.profileId || loan.profile || loan.borrowerProfile || '',
    tier:         loan.tier || 'Silver',
    purpose:      loan.purpose || loan.title || 'Loan',
    amount, fundedAmount, durationMonths, interestRate,
    emiAmount:    Number(loan.emiAmount || Math.round((amount * (1 + interestRate / 100)) / Math.max(durationMonths, 1))),
    lenderCount:  Number(loan.lenderCount || (Array.isArray(loan.lenders) ? loan.lenders.length : 0)),
    daysRemaining: Number(loan.daysRemaining ?? loan.daysLeft ?? 30),
    status:       loan.status || 'active',
    lenders:      Array.isArray(loan.lenders) ? loan.lenders : [],
  }
}

const DEMO_BORROWER_LOAN = adaptLoan({
  id: 'demo_borrow_001', borrowerName: 'Rahul Sharma', borrower: 'rahul_shopkeeper',
  tier: 'Gold', cibilScore: 762, amount: 200000, fundedAmount: 154000,
  lenderCount: 8, apr: 11, purpose: 'Working Capital', duration: 12,
  emiAmount: 18500, status: 'active',
})

const DEMO_FUNDED_LOANS = [
  adaptLoan({ id: 'demo_f1', borrowerName: 'Priya Nair',  tier: 'Platinum', amount: 350000, fundedAmount: 350000, lenderCount: 14, apr: 9,  purpose: 'Equipment', duration: 18, emiAmount: 21500, status: 'funded' }),
  adaptLoan({ id: 'demo_f2', borrowerName: 'Anita Meena', tier: 'Silver',   amount: 150000, fundedAmount: 150000, lenderCount: 4,  apr: 13, purpose: 'Inventory', duration: 6,  emiAmount: 26000, status: 'repaid' }),
]

const loanMatchesBorrower = (loan, address) => {
  if (!address) return false
  const wallet = normalizeAddress(address)
  const wallets = [loan.borrowerWallet, loan.borrowerAddress, loan.wallet, loan.address].map(normalizeAddress)
  if (wallets.includes(wallet)) return true
  const key = normalizeKey(address)
  return [loan.borrower, loan.borrowerName, loan.profileId].some(v => normalizeKey(v) === key)
}

const loanMatchesLender = (loan, address) => {
  if (!address) return false
  const wallet = normalizeAddress(address)
  return [loan.lender, loan.lenderAddress, loan.fundedBy, ...(Array.isArray(loan.lenders) ? loan.lenders : [])]
    .some(v => normalizeAddress(v?.address || v) === wallet)
}

const isFunded = (loan) =>
  loan.status === 'funded' || loan.status === 'repaid' || (loan.amount > 0 && loan.fundedAmount >= loan.amount)

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className="card">
            <div className="h-7 bg-hairline rounded w-2/3 mx-auto" />
            <div className="h-3 bg-hairline rounded w-1/2 mx-auto mt-3" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="h-5 bg-hairline rounded w-40 mb-4" />
        <div className="h-20 bg-hairline rounded-xl" />
      </div>
    </div>
  )
}

/* ── Borrower dashboard ── */
function BorrowerDashboard({ loans, loading }) {
  const navigate = useNavigate()
  if (loading) return <Skeleton />

  const loan        = loans[0] || DEMO_BORROWER_LOAN
  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0)
  const totalRepaid   = loans.reduce((s, l) => s + Math.min(l.fundedAmount, l.amount), 0)
  const totalPct      = totalBorrowed > 0 ? Math.round((totalRepaid / totalBorrowed) * 100) : 0
  const creditScore   = loan.cibilScore || 762

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Credit Score',     value: creditScore,           color: 'text-primary' },
          { label: 'Total Borrowed',   value: formatINR(totalBorrowed), color: 'text-on-surface' },
          { label: 'Total Repaid',     value: formatINR(totalRepaid),   color: 'text-semantic-success' },
          { label: 'On-Time Payments', value: `${Math.max(1, loans.length * 4)}`, color: 'text-block-lilac' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-secondary mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="card border border-hairline bg-surface-soft flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-primary">Need more funds?</h3>
          <p className="text-secondary text-sm mt-0.5">List a new loan and get funded by the community.</p>
        </div>
        <button onClick={() => navigate('/verify')} className="btn-primary flex-shrink-0">
          List a Loan →
        </button>
      </div>

      {/* Active loans */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-primary">Active Loans</h2>
          <button onClick={() => navigate('/feed')} className="btn-secondary text-xs px-4 py-2">
            View Marketplace
          </button>
        </div>
        <div className="space-y-3">
          {loans.map((l) => {
            const fundedPct = l.amount > 0 ? Math.round((l.fundedAmount / l.amount) * 100) : 0
            return (
              <div key={l.id} className="rounded-xl bg-surface-soft border border-hairline p-5 hover:border-primary/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold text-primary">{l.purpose}</span>
                    <div className="flex items-center gap-3 mt-1 text-sm text-secondary">
                      <span>{formatINR(l.amount)} total</span>
                      <span>·</span>
                      <span>{formatINR(l.fundedAmount)} funded</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-secondary">EMI</div>
                    <div className="font-display font-bold text-primary">{formatINR(l.emiAmount)}</div>
                    <div className="text-xs text-secondary">{l.daysRemaining}d remaining</div>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={fundedPct} variant="gold" size="sm" showPct />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overall repayment */}
      <div className="card">
        <h2 className="font-display font-bold text-primary mb-4">Overall Repayment</h2>
        <ProgressBar value={totalPct} variant="gold" size="lg" showPct />
        <div className="flex justify-between text-xs text-secondary mt-2">
          <span>{formatINR(totalRepaid)} repaid</span>
          <span>{formatINR(totalBorrowed - totalRepaid)} remaining</span>
        </div>
      </div>
    </div>
  )
}

/* ── Lender dashboard ── */
function LenderDashboard({ fundedLoans, loading }) {
  const navigate = useNavigate()
  if (loading) return <Skeleton />

  const totalDeployed = fundedLoans.reduce((s, l) => s + l.fundedAmount, 0)
  const activeCount   = fundedLoans.filter(l => l.status !== 'repaid').length
  const totalReturns  = fundedLoans.reduce((s, l) => s + Math.round(l.fundedAmount * (l.interestRate / 100)), 0)
  const avgReturn     = fundedLoans.length
    ? (fundedLoans.reduce((s, l) => s + l.interestRate, 0) / fundedLoans.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Deployed', value: formatINR(totalDeployed), color: 'text-primary' },
          { label: 'Active Loans',   value: activeCount,              color: 'text-on-surface' },
          { label: 'Total Returns',  value: formatINR(totalReturns),  color: 'text-semantic-success' },
          { label: 'Avg APR',        value: `${avgReturn}%`,          color: 'text-block-lilac' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-secondary mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Impact banner */}
      <div className="card border border-semantic-success/20 bg-block-mint/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-semantic-success/15 border border-semantic-success/30 flex items-center justify-center text-semantic-success font-display font-bold text-lg">
            {activeCount}
          </div>
          <div>
            <h3 className="font-display font-bold text-primary text-lg">Your Social Impact</h3>
            <p className="text-secondary text-sm mt-1">
              You've helped <span className="text-semantic-success font-semibold">{fundedLoans.length} Indians</span> access fair credit — bypassing traditional gatekeepers.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio table */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-primary">Portfolio</h2>
          <button onClick={() => navigate('/feed')} className="btn-primary text-xs px-4 py-2">Fund More</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs text-secondary text-left">
                <th className="pb-3 font-medium">Borrower</th>
                <th className="pb-3 font-medium">Tier</th>
                <th className="pb-3 font-medium text-right">Funded</th>
                <th className="pb-3 font-medium text-right">APR</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {fundedLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-primary/5 transition-colors">
                  <td className="py-3 font-medium text-primary">{loan.borrowerName}</td>
                  <td className="py-3"><TierBadge tier={loan.tier} size="sm" /></td>
                  <td className="py-3 text-right text-secondary">{formatINR(loan.fundedAmount)}</td>
                  <td className="py-3 text-right text-semantic-success font-semibold">{loan.interestRate}%</td>
                  <td className="py-3 text-right">
                    <span className={`badge text-xs ${loan.status === 'repaid' ? 'badge-grey' : 'badge-teal'}`}>
                      {loan.status === 'repaid' ? 'Repaid' : 'Funded'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════
   MAIN EXPORT
════════════════════════════ */
export default function Dashboard() {
  const { address, isConnected, isBorrower, isLender } = useWallet()
  const navigate  = useNavigate()
  const [loans,    setLoans]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [apiError, setApiError] = useState('')
  const [tab,      setTab]      = useState('borrower')

  /* Sync tab with wallet role */
  useEffect(() => {
    if (isBorrower && !isLender) setTab('borrower')
    if (!isBorrower && isLender)  setTab('lender')
  }, [isBorrower, isLender])

  /* Fetch loans */
  useEffect(() => {
    let alive = true
    setLoading(true)
    getMarketplaceFeed()
      .then(data => { if (alive) { setLoans(Array.isArray(data) ? data.map(adaptLoan) : []); setApiError('') } })
      .catch(err => { if (alive) { setLoans([]); setApiError(err.message || 'Network error') } })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const borrowerLoans = useMemo(() => {
    const matched = loans.filter(l => loanMatchesBorrower(l, address))
    if (matched.length > 0) return matched
    const rahul = loans.find(l =>
      normalizeKey(l.borrower).includes('rahul') || normalizeKey(l.borrowerName).includes('rahul')
    )
    return [rahul || DEMO_BORROWER_LOAN]
  }, [address, loans])

  const fundedLoans = useMemo(() => {
    const matched = loans.filter(l => loanMatchesLender(l, address))
    if (matched.length > 0) return matched
    const feedFunded = loans.filter(isFunded)
    if (feedFunded.length > 0) return feedFunded
    return DEMO_FUNDED_LOANS
  }, [address, loans])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-2">Overview</p>
            <h1 className="font-display font-black text-4xl text-primary">
              Your <span className="text-gradient-gold">Dashboard</span>
            </h1>
          </div>
          {!isConnected && (
            <div className="text-sm text-secondary border border-hairline rounded-xl px-4 py-3 bg-surface-soft">
              Showing demo data — connect wallet for live data
            </div>
          )}
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3">
            Marketplace API unavailable. Showing demo data. ({apiError})
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-surface-container rounded-full border border-hairline w-fit mb-8">
          <button
            onClick={() => setTab('borrower')}
            className={`tab-btn ${tab === 'borrower' ? 'active' : ''}`}
          >
            Borrower
          </button>
          <button
            onClick={() => setTab('lender')}
            className={`tab-btn ${tab === 'lender' ? 'active' : ''}`}
          >
            Lender
          </button>
        </div>

        {tab === 'borrower' ? (
          <BorrowerDashboard loans={borrowerLoans} loading={loading} />
        ) : (
          <LenderDashboard fundedLoans={fundedLoans} loading={loading} />
        )}
      </div>
    </div>
  )
}
