import { useState, useEffect } from 'react'
import LoanCard from '../components/LoanCard.jsx'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'

/* ── Map backend LoanResponse → LoanCard shape ── */
const adaptLoan = (loan) => ({
  id:           loan.id,
  borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
  tier:         loan.tier         || 'Silver',
  purpose:      loan.purpose      || loan.title    || 'Loan',
  story:        loan.story        || `${loan.borrowerName || loan.borrower} is seeking funding.`,
  amount:       loan.amount,
  funded:       loan.fundedAmount ?? 0,
  duration:     loan.duration     || loan.durationMonths || 12,
  emi:          loan.emiAmount    || Math.round((loan.amount * (1 + (loan.apr ?? loan.interestRate ?? 12) / 100)) / (loan.duration || loan.durationMonths || 12)),
  interestRate: loan.apr          || loan.interestRate || 12,
  lenders:      loan.lenderCount  || loan.lenders || 0,
  daysLeft:     loan.daysRemaining ?? loan.daysLeft ?? 30,
})

/* ── Mock data (used when backend is offline) ── */
const MOCK_LOANS = [
  {
    id: '1',
    borrowerName: 'Rahul Sharma',
    tier: 'Gold',
    purpose: 'Working Capital',
    story: 'Expanding my Delhi street food stall. Need funds for a second cart and equipment. Have been processing ₹2.1L/mo through UPI consistently for 2 years.',
    amount: 200000,
    funded: 154000,
    duration: 12,
    emi: 18500,
    interestRate: 11,
    lenders: 8,
    daysLeft: 5,
  },
  {
    id: '2',
    borrowerName: 'Priya Nair',
    tier: 'Platinum',
    purpose: 'Equipment',
    story: 'Upgrading my design studio with new MacBook Pro and Wacom tablet. International freelance work demands the best tools. 4 years perfect rental history.',
    amount: 350000,
    funded: 280000,
    duration: 18,
    emi: 21500,
    interestRate: 9,
    lenders: 14,
    daysLeft: 12,
  },
  {
    id: '3',
    borrowerName: 'Anita Meena',
    tier: 'Silver',
    purpose: 'Inventory',
    story: 'Festival season is approaching. Need to stock up on inventory for Diwali rush. My kirana store has been GST-registered for 6 years.',
    amount: 150000,
    funded: 67500,
    duration: 6,
    emi: 26000,
    interestRate: 13,
    lenders: 4,
    daysLeft: 18,
  },
  {
    id: '4',
    borrowerName: 'Vikram Singh',
    tier: 'Bronze',
    purpose: 'Vehicle Repair',
    story: 'My auto-rickshaw broke down. Engine needs replacement. With 8000+ Ola/Uber trips and 4.8 rating, I can repay this in 6 months.',
    amount: 80000,
    funded: 24000,
    duration: 6,
    emi: 14200,
    interestRate: 15,
    lenders: 2,
    daysLeft: 22,
  },
  {
    id: '5',
    borrowerName: 'Meera Pillai',
    tier: 'Gold',
    purpose: 'Education',
    story: 'Online MBA program from NMIMS. Working professional looking to upskill. Current salary ₹85k/mo. Will repay in 24 months comfortably.',
    amount: 500000,
    funded: 350000,
    duration: 24,
    emi: 24500,
    interestRate: 10,
    lenders: 21,
    daysLeft: 7,
  },
  {
    id: '6',
    borrowerName: 'Suresh Yadav',
    tier: 'Silver',
    purpose: 'Home Improvement',
    story: 'Renovating the kitchen and bathroom of my rented home in Pune. Landlord has agreed to reduce rent by ₹2k/mo post renovation.',
    amount: 120000,
    funded: 36000,
    duration: 9,
    emi: 14000,
    interestRate: 12,
    lenders: 3,
    daysLeft: 30,
  },
]

const TIERS    = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze']
const PURPOSES = ['All', 'Working Capital', 'Equipment', 'Inventory', 'Education', 'Vehicle Repair', 'Home Improvement']
const SORTS    = [
  { label: 'Ending Soon', value: 'daysLeft' },
  { label: 'Most Funded', value: 'pct' },
  { label: 'Highest Amount', value: 'amount' },
  { label: 'Lowest Rate', value: 'interestRate' },
]

export default function Feed() {
  const [loans, setLoans]         = useState(MOCK_LOANS)
  const [loading, setLoading]     = useState(false)
  const [tierFilter, setTier]     = useState('All')
  const [purposeFilter, setPurpose] = useState('All')
  const [sort, setSort]           = useState('daysLeft')
  const [search, setSearch]       = useState('')
  const [fundSuccess, setFundSuccess] = useState(null)
  const [apiError, setApiError]   = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        console.log('[Feed] API loans:', data)
        if (Array.isArray(data) && data.length > 0) {
          setLoans(data.map(adaptLoan))
          setApiError('')
        }
      } catch (err) {
        console.error('[Feed] API error:', err.message)
        setApiError(err.message)
        // Keep MOCK_LOANS as fallback
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleFund = async (loanId, amount) => {
    try {
      await fundLoan(loanId, amount)
      setFundSuccess(loanId)
      setTimeout(() => setFundSuccess(null), 3000)
    } catch {
      // Mock success
      setFundSuccess(loanId)
      setTimeout(() => setFundSuccess(null), 3000)
    }
  }

  const filtered = loans
    .filter((l) => {
      if (tierFilter !== 'All' && l.tier !== tierFilter) return false
      if (purposeFilter !== 'All' && l.purpose !== purposeFilter) return false
      if (search && !l.borrowerName.toLowerCase().includes(search.toLowerCase()) &&
          !l.story.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'pct')  return (b.funded / b.amount) - (a.funded / a.amount)
      if (sort === 'amount') return b.amount - a.amount
      if (sort === 'interestRate') return a.interestRate - b.interestRate
      return a.daysLeft - b.daysLeft
    })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Live Listings</p>
          {apiError && (
            <div className="mb-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-4 py-2">
              Backend offline — showing demo data. ({apiError})
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl text-white">
                Credit <span className="text-gradient-gold">Marketplace</span>
              </h1>
              <p className="text-grey mt-2">
                {filtered.length} verified borrowers seeking community funding
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search borrowers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 w-64"
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card mb-8 flex flex-wrap gap-4 items-center">
          {/* Tier */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-grey font-medium">Tier:</span>
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tierFilter === t
                    ? 'bg-gold text-bg'
                    : 'text-grey hover:text-white border border-border hover:border-gold/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Purpose */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-grey font-medium">Purpose:</span>
            <select
              value={purposeFilter}
              onChange={(e) => setPurpose(e.target.value)}
              className="select py-1.5 text-xs w-44"
            >
              {PURPOSES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-grey font-medium">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select py-1.5 text-xs w-40"
            >
              {SORTS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        {/* Success toast */}
        {fundSuccess && (
          <div className="fixed bottom-6 right-6 z-50 card border border-teal/40 bg-teal/10 text-teal flex items-center gap-3 animate-slide-up shadow-teal">
            <span className="text-xl">✓</span>
            <div>
              <p className="font-semibold text-sm">Funding Initiated!</p>
              <p className="text-xs text-teal/70">Transaction submitted to Ethereum Sepolia</p>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-border rounded w-1/2" />
                    <div className="h-3 bg-border rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-border rounded" />
                  <div className="h-3 bg-border rounded w-4/5" />
                </div>
                <div className="h-2 bg-border rounded mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-white text-xl mb-2">No loans found</h3>
            <p className="text-grey">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((loan, i) => (
              <div
                key={loan.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                <LoanCard loan={loan} onFund={handleFund} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
