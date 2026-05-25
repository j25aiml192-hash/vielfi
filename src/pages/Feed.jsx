import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoanCard from '../components/LoanCard.jsx'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'

/* ── Sidebar nav items (formerly in Navbar) ── */
const NAV_ITEMS = [
  {
    to: '/feed',
    label: 'Markets',
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
    description: 'Browse all live loan listings',
  },
  {
    to: '/verify',
    label: 'Lending',
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Verify identity & get your credit score',
  },
  {
    to: '/circles',
    label: 'Borrowing',
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    description: 'Create loan requests & join circles',
  },
  {
    to: '/dashboard',
    label: 'Governance',
    icon: (
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: 'Your portfolio & repayment dashboard',
  },
]

/* ── Map backend shape → LoanCard shape ── */
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

/* ── Mock data ── */
const MOCK_LOANS = [
  { id:'1', borrowerName:'Rahul Sharma',  tier:'Gold',     purpose:'Working Capital',  story:'Expanding my Delhi street food stall. Need funds for a second cart and equipment. Have been processing ₹2.1L/mo through UPI consistently for 2 years.', amount:200000, funded:154000, duration:12, emi:18500,  interestRate:11, lenders:8,  daysLeft:5  },
  { id:'2', borrowerName:'Priya Nair',    tier:'Platinum', purpose:'Equipment',        story:'Upgrading my design studio with new MacBook Pro and Wacom tablet. International freelance work demands the best tools. 4 years perfect rental history.', amount:350000, funded:280000, duration:18, emi:21500, interestRate:9,  lenders:14, daysLeft:12 },
  { id:'3', borrowerName:'Anita Meena',   tier:'Silver',   purpose:'Inventory',        story:'Festival season is approaching. Need to stock up on inventory for Diwali rush. My kirana store has been GST-registered for 6 years.',                    amount:150000, funded:67500,  duration:6,  emi:26000, interestRate:13, lenders:4,  daysLeft:18 },
  { id:'4', borrowerName:'Vikram Singh',  tier:'Bronze',   purpose:'Vehicle Repair',   story:'My auto-rickshaw broke down. Engine needs replacement. With 8000+ Ola/Uber trips and 4.8 rating, I can repay this in 6 months.',                       amount:80000,  funded:24000,  duration:6,  emi:14200, interestRate:15, lenders:2,  daysLeft:22 },
  { id:'5', borrowerName:'Meera Pillai',  tier:'Gold',     purpose:'Education',        story:'Online MBA program from NMIMS. Working professional looking to upskill. Current salary ₹85k/mo. Will repay in 24 months comfortably.',                  amount:500000, funded:350000, duration:24, emi:24500, interestRate:10, lenders:21, daysLeft:7  },
  { id:'6', borrowerName:'Suresh Yadav', tier:'Silver',   purpose:'Home Improvement', story:'Renovating the kitchen and bathroom of my rented home in Pune. Landlord has agreed to reduce rent by ₹2k/mo post renovation.',                          amount:120000, funded:36000,  duration:9,  emi:14000, interestRate:12, lenders:3,  daysLeft:30 },
]

const TIERS    = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze']
const PURPOSES = ['All', 'Working Capital', 'Equipment', 'Inventory', 'Education', 'Vehicle Repair', 'Home Improvement']
const SORTS    = [
  { label: 'Ending Soon',    value: 'daysLeft' },
  { label: 'Most Funded',    value: 'pct' },
  { label: 'Highest Amount', value: 'amount' },
  { label: 'Lowest Rate',    value: 'interestRate' },
]

/* ════════════════════════════════════
   SLIDE-IN SIDEBAR DRAWER
════════════════════════════════════ */
function NavDrawer({ open, onClose }) {
  const navigate = useNavigate()

  const go = (to) => {
    onClose()
    navigate(to)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 300,
        background: '#fff',
        boxShadow: '4px 0 40px rgba(0,0,0,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #7a5000, #c9952a, #e8c05a, #c9952a, #7a5000)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'goldShine 3s ease-in-out infinite',
            }}>VeilFi</span>
            <p style={{ fontSize: '0.65rem', color: '#999', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Navigation</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e8e4df', background: '#faf8f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}
          >
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <div style={{ padding: '16px 12px', flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, icon, description }) => (
            <button
              key={to}
              onClick={() => go(to)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 14,
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left', marginBottom: 4,
                transition: 'background 0.18s, transform 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fdf9f3'; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
            >
              {/* Icon box */}
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(145deg, #fdf8ec, #faf0d8)',
                border: '1px solid rgba(212,175,55,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#c9952a',
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: '#888', lineHeight: 1.4 }}>{description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0ede8' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
            Secure · Transparent · Decentralized
          </p>
        </div>
      </div>

      <style>{`
        @keyframes goldShine {
          0%   { background-position: 100% 0; }
          50%  { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </>
  )
}

/* ════════════════════════════════════
   FEED PAGE
════════════════════════════════════ */
export default function Feed() {
  const location = useLocation()

  /* Open drawer automatically if navigated here from "Start Borrowing" */
  const [drawerOpen, setDrawerOpen] = useState(location.state?.openDrawer === true)

  const [loans, setLoans]           = useState(MOCK_LOANS)
  const [loading, setLoading]       = useState(false)
  const [tierFilter, setTier]       = useState('All')
  const [purposeFilter, setPurpose] = useState('All')
  const [sort, setSort]             = useState('daysLeft')
  const [search, setSearch]         = useState('')
  const [fundSuccess, setFundSuccess] = useState(null)
  const [apiError, setApiError]     = useState('')

  /* Clear drawer state from history so refresh doesn't re-open */
  useEffect(() => {
    if (location.state?.openDrawer) {
      window.history.replaceState({}, document.title)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        if (Array.isArray(data) && data.length > 0) {
          setLoans(data.map(adaptLoan))
          setApiError('')
        }
      } catch (err) {
        setApiError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleFund = async (loanId, amount) => {
    try { await fundLoan(loanId, amount) } catch {}
    setFundSuccess(loanId)
    setTimeout(() => setFundSuccess(null), 3000)
  }

  const filtered = loans
    .filter(l => {
      if (tierFilter !== 'All' && l.tier !== tierFilter) return false
      if (purposeFilter !== 'All' && l.purpose !== purposeFilter) return false
      if (search && !l.borrowerName.toLowerCase().includes(search.toLowerCase()) &&
          !l.story.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'pct')          return (b.funded / b.amount) - (a.funded / a.amount)
      if (sort === 'amount')       return b.amount - a.amount
      if (sort === 'interestRate') return a.interestRate - b.interestRate
      return a.daysLeft - b.daysLeft
    })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Slide-in nav drawer */}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Hamburger to re-open drawer */}
                <button
                  id="feed-nav-drawer-btn"
                  onClick={() => setDrawerOpen(true)}
                  title="Open navigation"
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    border: '1px solid #e8e4df', background: '#faf8f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fdf5e0'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(200,160,40,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#faf8f5'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#c9952a" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <p className="section-label">Live Listings</p>
              </div>
              {apiError && (
                <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2">
                  Backend offline — showing demo data. ({apiError})
                </div>
              )}
              <h1 className="font-display font-black text-4xl text-primary">
                Credit <span className="text-gradient-gold">Marketplace</span>
              </h1>
              <p className="text-secondary mt-2">
                {filtered.length} verified borrowers seeking community funding
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search borrowers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-64"
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-secondary font-medium">Tier:</span>
            {TIERS.map(t => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tierFilter === t
                    ? 'bg-primary text-on-primary'
                    : 'text-secondary hover:text-primary border border-hairline hover:border-primary/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-hairline hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-medium">Purpose:</span>
            <select value={purposeFilter} onChange={e => setPurpose(e.target.value)} className="select py-1.5 text-xs w-44">
              {PURPOSES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="h-6 w-px bg-hairline hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-medium">Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} className="select py-1.5 text-xs w-40">
              {SORTS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        {/* Success toast */}
        {fundSuccess && (
          <div className="fixed bottom-6 right-6 z-50 card border border-semantic-success/40 bg-semantic-success/10 text-semantic-success flex items-center gap-3 animate-slide-up shadow-card">
            <span className="text-xl">✓</span>
            <div>
              <p className="font-semibold text-sm">Funding Initiated!</p>
              <p className="text-xs text-semantic-success/70">Transaction submitted to Ethereum Sepolia</p>
            </div>
          </div>
        )}

        {/* Loan grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-hairline" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-hairline rounded w-1/2" />
                    <div className="h-3 bg-hairline rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-hairline rounded" />
                  <div className="h-3 bg-hairline rounded w-4/5" />
                </div>
                <div className="h-2 bg-hairline rounded mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-primary text-xl mb-2">No loans found</h3>
            <p className="text-secondary">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((loan, i) => (
              <div key={loan.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                <LoanCard loan={loan} onFund={handleFund} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
