import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { getMarketplaceFeed } from '../api/index.js'

const RAHUL_SHOPKEEPER_DEMO_LOAN = {
  id: 'rahul_shopkeeper',
  borrowerName: 'Rahul Sharma',
  borrower: 'rahul_shopkeeper',
  profileId: 'rahul_shopkeeper',
  tier: 'Gold',
  cibilScore: 762,
  amount: 200000,
  fundedAmount: 154000,
  lenderCount: 8,
  apr: 11,
  interestRate: 11,
  purpose: 'Working Capital',
  duration: 12,
  durationMonths: 12,
  story: 'Electronics shop owner expanding inventory for seasonal demand.',
  daysRemaining: 5,
  emiAmount: 18500,
  status: 'active',
  title: 'Working Capital',
}

const DEMO_FUNDED_LOANS = [
  {
    id: 'demo_funded_001',
    borrowerName: 'Priya Nair',
    borrower: 'priya_freelancer',
    tier: 'Platinum',
    amount: 350000,
    fundedAmount: 350000,
    lenderCount: 14,
    apr: 9,
    interestRate: 9,
    purpose: 'Equipment',
    duration: 18,
    durationMonths: 18,
    emiAmount: 21500,
    status: 'funded',
  },
  {
    id: 'demo_funded_002',
    borrowerName: 'Anita Meena',
    borrower: 'anita_graduate',
    tier: 'Silver',
    amount: 150000,
    fundedAmount: 150000,
    lenderCount: 4,
    apr: 13,
    interestRate: 13,
    purpose: 'Inventory',
    duration: 6,
    durationMonths: 6,
    emiAmount: 26000,
    status: 'repaid',
  },
]

const formatINR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')

const normalizeAddress = (value) =>
  String(value || '').trim().toLowerCase()

const adaptLoan = (loan) => {
  const amount = Number(loan.amount || 0)
  const fundedAmount = Number(loan.fundedAmount ?? loan.funded ?? 0)
  const durationMonths = Number(loan.durationMonths || loan.duration || 12)
  const interestRate = Number(loan.apr ?? loan.interestRate ?? 12)

  return {
    ...loan,
    id: String(loan.id),
    borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
    borrower: loan.borrower || loan.borrowerName || '',
    borrowerWallet: loan.borrowerWallet || loan.borrowerAddress || loan.wallet || loan.address || '',
    profileId: loan.profileId || loan.profile || loan.borrowerProfile || '',
    tier: loan.tier || 'Silver',
    purpose: loan.purpose || loan.title || 'Loan',
    amount,
    fundedAmount,
    durationMonths,
    interestRate,
    emiAmount: Number(
      loan.emiAmount ||
      Math.round((amount * (1 + interestRate / 100)) / Math.max(durationMonths, 1))
    ),
    lenderCount: Number(loan.lenderCount || loan.lenders || 0),
    daysRemaining: Number(loan.daysRemaining ?? loan.daysLeft ?? 30),
    status: loan.status || 'active',
    lenders: Array.isArray(loan.lenders) ? loan.lenders : [],
  }
}

const loanMatchesBorrower = (loan, address) => {
  const wallet = normalizeAddress(address)
  if (!wallet) return false

  const possibleWallets = [
    loan.borrowerWallet,
    loan.borrowerAddress,
    loan.wallet,
    loan.address,
  ].map(normalizeAddress)

  if (possibleWallets.includes(wallet)) return true

  const connectedKey = normalizeKey(address)
  return [
    loan.borrower,
    loan.borrowerName,
    loan.profileId,
    loan.profile,
    loan.borrowerProfile,
  ].some((value) => normalizeKey(value) === connectedKey)
}

const loanMatchesLender = (loan, address) => {
  const wallet = normalizeAddress(address)
  if (!wallet) return false

  return [
    loan.lender,
    loan.lenderAddress,
    loan.fundedBy,
    ...(Array.isArray(loan.lenders) ? loan.lenders : []),
  ].some((value) => normalizeAddress(value?.address || value) === wallet)
}

const isFundedLoan = (loan) =>
  loan.status === 'funded' ||
  loan.status === 'repaid' ||
  (loan.amount > 0 && loan.fundedAmount >= loan.amount)

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-7 bg-border rounded w-2/3 mx-auto" />
            <div className="h-3 bg-border rounded w-1/2 mx-auto mt-3" />
            <div className="h-3 bg-border rounded w-1/3 mx-auto mt-2" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="h-5 bg-border rounded w-40 mb-5" />
        <div className="rounded-xl bg-bg border border-border p-5">
          <div className="flex justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-border rounded w-48" />
              <div className="h-3 bg-border rounded w-64 max-w-full" />
            </div>
            <div className="space-y-2 w-24">
              <div className="h-3 bg-border rounded" />
              <div className="h-5 bg-border rounded" />
            </div>
          </div>
          <div className="h-2 bg-border rounded mt-5" />
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm px-4 py-3">
      Marketplace API failed. Showing demo data. ({message})
    </div>
  )
}

function BorrowerDashboard({ loans, loading }) {
  const navigate = useNavigate()

  if (loading) return <LoadingSkeleton />

  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = loans.reduce((sum, loan) => sum + Math.min(loan.fundedAmount, loan.amount), 0)
  const totalPct = totalBorrowed > 0 ? Math.round((totalRepaid / totalBorrowed) * 100) : 0
  const strongestLoan = loans[0] || adaptLoan(RAHUL_SHOPKEEPER_DEMO_LOAN)
  const creditScore = strongestLoan.cibilScore || 762
  const tier = strongestLoan.tier || 'Gold'
  const onTimePayments = Math.max(1, loans.length * 4)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Credit Score', value: d.creditScore, sub: `+${d.scoreChange} this month`, color: 'text-primary' },
          { label: 'Total Borrowed', value: formatINR(d.totalBorrowed), sub: 'All loans', color: 'text-on-surface' },
          { label: 'Total Repaid', value: formatINR(d.totalRepaid), sub: `${totalPct}% complete`, color: 'text-semantic-success' },
          { label: 'On-Time Payments', value: `${d.onTimePayments}`, sub: '100% streak', color: 'text-block-lilac' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card text-center">
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-secondary mt-1">{label}</div>
            <div className="text-xs text-secondary/60 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="card border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-white">Need more funds?</h3>
          <p className="text-grey text-sm mt-0.5">List a new loan and get funded by the community.</p>
        </div>
        <button
          id="dashboard-list-loan-btn"
          onClick={() => navigate('/verify')}
          className="btn-primary flex-shrink-0"
        >
          List a Loan -&gt;
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-primary">Active Loans</h2>
          <button onClick={() => navigate('/feed')} className="btn-secondary text-xs px-4 py-2">
            View Marketplace
          </button>
        </div>
        {d.activeLoans.map((loan) => {
          const fundedPct = Math.round((loan.funded / loan.amount) * 100)
          return (
            <div key={loan.id} className="rounded-xl bg-surface-soft border border-hairline p-5 hover:border-primary/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-primary">{loan.purpose}</span>
                  <div className="flex items-center gap-3 mt-1 text-sm text-secondary">
                    <span>{formatINR(loan.amount)} total</span>
                    <span>·</span>
                    <span>{formatINR(loan.funded)} funded</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-secondary">Next EMI</div>
                  <div className="font-display font-bold text-primary">{formatINR(loan.nextEMI)}</div>
                  <div className="text-xs text-secondary">Due {loan.nextEMIDate}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-bold text-primary mb-4">Overall Repayment</h2>
        <ProgressBar value={totalPct} variant="gold" size="lg" showPct />
        <div className="flex justify-between text-xs text-secondary mt-2">
          <span>{formatINR(d.totalRepaid)} repaid</span>
          <span>{formatINR(d.totalBorrowed - d.totalRepaid)} remaining</span>
        </div>
      </div>
    </div>
  )
}

function LenderDashboard({ fundedLoans, loading }) {
  const navigate = useNavigate()

  if (loading) return <LoadingSkeleton />

  const totalDeployed = fundedLoans.reduce((sum, loan) => sum + loan.fundedAmount, 0)
  const activeLoans = fundedLoans.filter((loan) => loan.status !== 'repaid').length
  const totalReturns = fundedLoans.reduce((sum, loan) => sum + Math.round(loan.fundedAmount * (loan.interestRate / 100)), 0)
  const avgReturn = fundedLoans.length
    ? (fundedLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / fundedLoans.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Deployed', value: formatINR(d.totalDeployed), color: 'text-primary' },
          { label: 'Active Loans',   value: d.activeLoans, color: 'text-on-surface' },
          { label: 'Total Returns',  value: formatINR(d.totalReturns), color: 'text-semantic-success' },
          { label: 'Avg APR',        value: `${d.avgReturn}%`, color: 'text-block-lilac' },
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
          <div className="w-12 h-12 rounded-xl bg-teal/15 border border-teal/30 flex items-center justify-center text-teal font-display font-bold">
            {activeLoans}
          </div>
          <div>
            <h3 className="font-display font-bold text-primary text-lg">Your Social Impact</h3>
            <p className="text-secondary text-sm mt-1">
              You've helped <span className="text-semantic-success font-semibold">{d.impactStories} Indians</span> access fair credit —
              bypassing traditional gatekeepers.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-primary">Portfolio</h2>
          <button onClick={() => navigate('/feed')} className="btn-primary text-xs px-4 py-2">
            Fund More
          </button>
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
              {d.portfolio.map((item) => (
                <tr key={item.name} className="hover:bg-primary/5 transition-colors">
                  <td className="py-3 font-medium text-primary">{item.name}</td>
                  <td className="py-3"><TierBadge tier={item.tier} size="sm" /></td>
                  <td className="py-3 text-right text-secondary">{formatINR(item.invested)}</td>
                  <td className="py-3 text-right text-semantic-success font-semibold">+{formatINR(item.returns)}</td>
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

function TabSwitcher({ activeTab, setActiveTab, isBorrower, isLender }) {
  if (isBorrower && !isLender) return null
  if (isLender && !isBorrower) return null

  return (
    <div className="flex gap-2 p-1 bg-card rounded-xl border border-border w-fit mb-8">
      {isBorrower && (
        <button
          onClick={() => setActiveTab('borrower')}
          className={`tab-btn ${activeTab === 'borrower' ? 'active' : ''}`}
        >
          Borrower
        </button>
      )}
      {isLender && (
        <button
          onClick={() => setActiveTab('lender')}
          className={`tab-btn ${activeTab === 'lender' ? 'active' : ''}`}
        >
          Lender
        </button>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { address, isConnected, userRole, isBorrower, isLender } = useWallet()
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [usingDemo, setUsingDemo] = useState(false)
  const [activeTab, setActiveTab] = useState(isBorrower ? 'borrower' : 'lender')

  useEffect(() => {
    let isMounted = true

    const loadLoans = async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        if (!isMounted) return

        const liveLoans = Array.isArray(data) ? data.map(adaptLoan) : []
        setLoans(liveLoans)
        setApiError('')
        setUsingDemo(liveLoans.length === 0)
      } catch (err) {
        if (!isMounted) return
        setLoans([])
        setApiError(err.message || 'Network error')
        setUsingDemo(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadLoans()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isBorrower && isLender) setActiveTab('lender')
    if (isBorrower && !isLender) setActiveTab('borrower')
  }, [isBorrower, isLender, userRole])

  const borrowerLoans = useMemo(() => {
    const matches = loans.filter((loan) => loanMatchesBorrower(loan, address))
    if (matches.length > 0) return matches

    const rahulLoan = loans.find((loan) =>
      normalizeKey(loan.borrower) === 'rahulshopkeeper' ||
      normalizeKey(loan.profileId) === 'rahulshopkeeper' ||
      normalizeKey(loan.borrowerName).includes('rahul')
    )

    return [rahulLoan || adaptLoan(RAHUL_SHOPKEEPER_DEMO_LOAN)]
  }, [address, loans])

  const fundedLoans = useMemo(() => {
    const lenderMatches = loans.filter((loan) => loanMatchesLender(loan, address))
    const feedFundedLoans = loans.filter(isFundedLoan)
    const visibleFundedLoans = lenderMatches.length > 0 ? lenderMatches : feedFundedLoans

    if (visibleFundedLoans.length > 0) return visibleFundedLoans

    return DEMO_FUNDED_LOANS.map(adaptLoan)
  }, [address, loans])

  const noRole = !userRole
  const showBorrower = activeTab === 'borrower' || noRole || (isBorrower && !isLender)
  const showDemoNotice = !isConnected || usingDemo || (activeTab === 'borrower' && borrowerLoans[0]?.id === 'rahul_shopkeeper')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
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
            <div className="flex-1">
              <h3 className="font-display font-bold text-white">Welcome to VeilFi!</h3>
              <p className="text-grey text-sm mt-0.5">Tell us how you'll use VeilFi to personalise your experience.</p>
            </div>
            <button onClick={() => navigate('/onboarding')} className="btn-primary flex-shrink-0">
              Get Started -&gt;
            </button>
          </div>
        )}

        {/* Role switcher */}
        <div className="flex gap-2 p-1 bg-surface-container rounded-full border border-hairline w-fit mb-8">
          <button
            onClick={() => setRole('borrower')}
            className={`tab-btn ${role === 'borrower' ? 'active' : ''}`}
          >
            Borrower
          </button>
          <button
            onClick={() => setRole('lender')}
            className={`tab-btn ${role === 'lender' ? 'active' : ''}`}
          >
            Lender
          </button>
        </div>

        {showBorrower ? (
          <BorrowerDashboard loans={borrowerLoans} loading={loading} />
        ) : (
          <LenderDashboard fundedLoans={fundedLoans} loading={loading} />
        )}
      </div>
    </div>
  )
}
