/* ─────────────────────────────────────────────────────────────
   Feed — Marketplace page (Linear-inspired)
   - Header with search
   - Filter chips (purpose + tier + sort)
   - LoanCard grid
   - NavDrawer (Kartik's feature) preserved
───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, ShieldCheck, Users, TrendingUp, X, Menu, Search } from 'lucide-react'
import LoanCard from '../components/LoanCard.jsx'
import { LoanCardSkeleton } from '../components/LoadingSkeleton.jsx'

/* ─────────────────────────────────────────────────────────────
   DATA ADAPTER
───────────────────────────────────────────────────────────── */
const adaptLoan = (loan) => ({
  id:           loan.id,
  borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
  role:         loan.role || 'Small Business Owner',
  city:         loan.city || 'India',
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
  featured:     loan.featured     ?? false,
})

/* ─────────────────────────────────────────────────────────────
   MOCK DATA (fallback when backend is offline)
───────────────────────────────────────────────────────────── */
const MOCK_LOANS = [
  {
    id: '1', borrowerName: 'Rahul Sharma', role: 'Street Food Vendor', tier: 'Gold', purpose: 'Business', city: 'New Delhi', featured: true,
    story: 'Expanding my street food operation with a second cart and industrial equipment. Consistent ₹2.1L/mo UPI volume for 24 consecutive months.',
    amount: 200000, funded: 154000, duration: 12, emi: 18500, interestRate: 11, lenders: 8, daysLeft: 5,
  },
  {
    id: '2', borrowerName: 'Priya Nair', role: 'Freelance Designer', tier: 'Platinum', purpose: 'Equipment', city: 'Bengaluru', featured: false,
    story: 'Upgrading a professional design studio — MacBook Pro M3 and Wacom Cintiq. International clientele, 4 years unblemished repayment record.',
    amount: 350000, funded: 318000, duration: 18, emi: 21500, interestRate: 9, lenders: 14, daysLeft: 12,
  },
  {
    id: '3', borrowerName: 'Anita Meena', role: 'Kirana Store Owner', tier: 'Silver', purpose: 'Business', city: 'Jaipur', featured: false,
    story: 'Pre-Diwali inventory build for a GST-registered kirana store operating continuously for 6 years. Seasonal demand consistently 3× baseline.',
    amount: 150000, funded: 67500, duration: 6, emi: 26000, interestRate: 13, lenders: 4, daysLeft: 18,
  },
  {
    id: '4', borrowerName: 'Vikram Singh', role: 'Auto Driver', tier: 'Bronze', purpose: 'Personal', city: 'Mumbai', featured: false,
    story: 'Engine replacement for auto-rickshaw. 8,400+ verified trips on Ola and Uber with 4.8 average rating.',
    amount: 80000, funded: 24000, duration: 6, emi: 14200, interestRate: 15, lenders: 2, daysLeft: 22,
  },
  {
    id: '5', borrowerName: 'Meera Pillai', role: 'HR Manager', tier: 'Gold', purpose: 'Education', city: 'Chennai', featured: false,
    story: 'Online MBA, NMIMS. Currently earning ₹85,000/mo in a stable corporate role. 24-month repayment plan fully mapped to salary progression.',
    amount: 500000, funded: 450000, duration: 24, emi: 24500, interestRate: 10, lenders: 21, daysLeft: 7,
  },
  {
    id: '6', borrowerName: 'Suresh Yadav', role: 'Sales Executive', tier: 'Silver', purpose: 'Personal', city: 'Pune', featured: false,
    story: 'Kitchen and bathroom renovation. Landlord contractually agreed to ₹2,000/mo rent reduction post-completion.',
    amount: 120000, funded: 36000, duration: 9, emi: 14000, interestRate: 12, lenders: 3, daysLeft: 30,
  },
  {
    id: '7', borrowerName: 'Farida Shaikh', role: 'Software Engineer', tier: 'Platinum', purpose: 'Medical', city: 'Hyderabad', featured: true,
    story: 'Bridge financing for elective surgery — insurance covers 70%, gap is ₹84,000. 8-year employment at TCS, zero defaults.',
    amount: 280000, funded: 256000, duration: 12, emi: 25000, interestRate: 9.5, lenders: 18, daysLeft: 3,
  },
  {
    id: '8', borrowerName: 'Arun Kumar', role: 'Grape Farmer', tier: 'Gold', purpose: 'Agriculture', city: 'Nashik', featured: false,
    story: 'Drip irrigation system for 5-acre grape vineyard. ROI expected within 2 harvests based on historical yield data.',
    amount: 180000, funded: 90000, duration: 12, emi: 16500, interestRate: 11, lenders: 9, daysLeft: 20,
  },
]

const ALL_PURPOSES = ['All', 'Business', 'Education', 'Medical', 'Equipment', 'Agriculture', 'Personal']
const ALL_TIERS    = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze']
const SORTS        = [
  { label: 'Closing Soon',   value: 'daysLeft'      },
  { label: 'Most Funded',    value: 'pct'            },
  { label: 'Highest Amount', value: 'amount'         },
  { label: 'Lowest Rate',    value: 'interestRate'   },
]

/* ─────────────────────────────────────────────────────────────
   NAV DRAWER — Kartik's feature (preserved exactly)
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: '/feed',      label: 'Markets',    desc: 'Browse all live loan listings',           Icon: BarChart3       },
  { to: '/verify',    label: 'Lending',    desc: 'Verify identity & get your credit score', Icon: ShieldCheck     },
  { to: '/circles',   label: 'Borrowing',  desc: 'Create loan requests & join circles',     Icon: Users           },
  { to: '/dashboard', label: 'Governance', desc: 'Your portfolio & repayment dashboard',    Icon: TrendingUp      },
]

function NavDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const go = (to) => { onClose(); navigate(to) }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          40,
          background:      'rgba(0,0,0,0.20)',
          backdropFilter:  'blur(4px)',
          opacity:         open ? 1 : 0,
          pointerEvents:   open ? 'auto' : 'none',
          transition:      'opacity 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      {/* Panel */}
      <div style={{
        position:        'fixed',
        top:             0,
        left:            0,
        bottom:          0,
        zIndex:          50,
        width:           288,
        background:      '#FFFFFF',
        borderRight:     '1px solid #E5E7EB',
        boxShadow:       '4px 0 24px rgba(0,0,0,0.08)',
        transform:       open ? 'translateX(0)' : 'translateX(-100%)',
        transition:      'transform 350ms cubic-bezier(0.16,1,0.3,1)',
        display:         'flex',
        flexDirection:   'column',
        overflowY:       'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, color: '#111827', letterSpacing: '-0.02em' }}>VeilFi</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#9CA3AF', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: 2 }}>Navigation</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width:          30,
              height:         30,
              borderRadius:   6,
              border:         '1px solid #E5E7EB',
              background:     '#F9FAFB',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#6B7280',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ padding: '12px 10px', flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, desc, Icon: NavIcon }) => (
            <button
              key={to}
              onClick={() => go(to)}
              style={{
                width:        '100%',
                display:      'flex',
                alignItems:   'center',
                gap:          12,
                padding:      '12px 14px',
                borderRadius: 8,
                background:   'transparent',
                border:       'none',
                cursor:       'pointer',
                textAlign:    'left',
                marginBottom: 2,
                transition:   'background 150ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width:          40,
                height:         40,
                borderRadius:   10,
                background:     '#F9FAFB',
                border:         '1px solid #E5E7EB',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
                color:          '#D4AF37',
              }}>
                <NavIcon size={18} />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#9CA3AF', lineHeight: 1.4 }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#9CA3AF', letterSpacing: '0.10em', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>
            Secure · Transparent · Decentralized
          </p>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   SEARCH + FILTER BAR
───────────────────────────────────────────────────────────── */
function SearchInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative', minWidth: 240 }}>
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth={2}
        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search borrower, city, purpose…"
        style={{
          width:        '100%',
          height:       36,
          paddingLeft:  34,
          paddingRight: 12,
          fontFamily:   "'Inter',sans-serif",
          fontSize:     13,
          color:        '#111827',
          background:   '#FFFFFF',
          border:       '1px solid #E5E7EB',
          borderRadius: 6,
          outline:      'none',
          transition:   'border-color 150ms',
        }}
        onFocus={e  => { e.target.style.borderColor = '#D4AF37' }}
        onBlur={e   => { e.target.style.borderColor = '#E5E7EB' }}
      />
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '5px 13px',
        borderRadius: 9999,
        border:       `1px solid ${active ? '#D4AF37' : '#E5E7EB'}`,
        background:   active ? '#D4AF37' : '#FFFFFF',
        color:        active ? '#111827' : '#6B7280',
        fontFamily:   "'Inter',sans-serif",
        fontSize:     13,
        fontWeight:   active ? 600 : 400,
        cursor:       'pointer',
        whiteSpace:   'nowrap',
        transition:   'all 150ms cubic-bezier(0.16,1,0.3,1)',
        flexShrink:   0,
      }}
    >
      {label}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────────────────────── */
function StatsBar({ loans }) {
  const totalAmount  = loans.reduce((s, l) => s + (l.amount  || 0), 0)
  const totalFunded  = loans.reduce((s, l) => s + (l.funded  || 0), 0)
  const avgAPR       = loans.length ? (loans.reduce((s, l) => s + l.interestRate, 0) / loans.length).toFixed(1) : 0
  const fmtINR       = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0, notation: 'compact' }).format(n)

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
      {[
        { label: 'Live Loans',    value: loans.length },
        { label: 'Total Requested', value: fmtINR(totalAmount) },
        { label: 'Total Funded',  value: fmtINR(totalFunded) },
        { label: 'Avg APR',       value: `${avgAPR}%` },
      ].map(({ label, value }) => (
        <div key={label}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            {value}
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Feed() {
  const location = useLocation()
  const navigate = useNavigate()

  /* NavDrawer state — auto-opens when navigated from Landing */
  const [drawerOpen, setDrawerOpen] = useState(location.state?.openDrawer === true)

  /* Data state */
  const [loans,    setLoans]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [backendOk, setBackendOk] = useState(false)
  const [toast,    setToast]    = useState(null)

  /* Filters */
  const [search,  setSearch]  = useState('')
  const [purpose, setPurpose] = useState('All')
  const [tier,    setTier]    = useState('All')
  const [sort,    setSort]    = useState('daysLeft')

  /* ── Load from API, fall back to mock ── */
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        if (cancelled) return
        const adapted = (data?.loans || data || []).map(adaptLoan)
        setLoans(adapted.length ? adapted : MOCK_LOANS)
        setBackendOk(true)
      } catch (err) {
        console.error('[Feed] API error:', err.message)
        if (!cancelled) setLoans(MOCK_LOANS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  /* ── Fund handler ── */
  const handleFund = async (loanId, amount) => {
    try {
      await fundLoan(loanId, amount)
      showToast(`Funded ₹${amount.toLocaleString('en-IN')} successfully!`, 'success')
    } catch (err) {
      showToast('Funding simulated — backend offline.', 'info')
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Filter + sort ── */
  const filtered = loans
    .filter(l => {
      const q = search.toLowerCase()
      const matchSearch = !q || l.borrowerName.toLowerCase().includes(q) || (l.city || '').toLowerCase().includes(q) || (l.purpose || '').toLowerCase().includes(q)
      const matchPurpose = purpose === 'All' || l.purpose === purpose
      const matchTier    = tier    === 'All' || l.tier    === tier
      return matchSearch && matchPurpose && matchTier
    })
    .sort((a, b) => {
      if (sort === 'daysLeft')     return a.daysLeft - b.daysLeft
      if (sort === 'pct')          return ((b.funded / b.amount) - (a.funded / a.amount))
      if (sort === 'amount')       return b.amount - a.amount
      if (sort === 'interestRate') return a.interestRate - b.interestRate
      return 0
    })

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: 64 }}>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── Page header ── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Live Market</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{
                  fontFamily:    "'Inter',sans-serif",
                  fontSize:      24,
                  fontWeight:    700,
                  color:         '#111827',
                  letterSpacing: '-0.03em',
                  marginTop:     0,
                  marginBottom:  0,
                }}>
                  Loan Marketplace
                </h1>
                <span style={{
                  background:   '#F3F4F6',
                  color:        '#6B7280',
                  fontFamily:   "'JetBrains Mono',monospace",
                  fontSize:     12,
                  fontWeight:   600,
                  padding:      '2px 8px',
                  borderRadius: 9999,
                }}>
                  {filtered.length}
                </span>
                {!backendOk && (
                  <span style={{
                    background:   '#FEF3C7',
                    color:        '#92400E',
                    fontFamily:   "'Inter',sans-serif",
                    fontSize:     11,
                    padding:      '2px 8px',
                    borderRadius: 9999,
                  }}>
                    Demo mode
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Nav drawer toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  height:       36,
                  padding:      '0 12px',
                  borderRadius: 6,
                  border:       '1px solid #E5E7EB',
                  background:   '#FFFFFF',
                  cursor:       'pointer',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          6,
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     13,
                  color:        '#374151',
                  transition:   'border-color 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
              >
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                Menu
              </button>
              <SearchInput value={search} onChange={setSearch} />
            </div>
          </div>

          {/* Stats bar */}
          {!loading && <StatsBar loans={filtered} />}

          {/* Filter chips — scrollable row */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
            {/* Purpose chips */}
            {ALL_PURPOSES.map(p => (
              <FilterChip key={p} label={p} active={purpose === p} onClick={() => setPurpose(p)} />
            ))}
            <div style={{ width: 1, background: '#E5E7EB', flexShrink: 0, margin: '0 4px' }} />
            {/* Tier chips */}
            {ALL_TIERS.map(t => (
              <FilterChip key={t} label={t} active={tier === t} onClick={() => setTier(t)} />
            ))}
            <div style={{ width: 1, background: '#E5E7EB', flexShrink: 0, margin: '0 4px' }} />
            {/* Sort chips */}
            {SORTS.map(s => (
              <FilterChip key={s.value} label={s.label} active={sort === s.value} onClick={() => setSort(s.value)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px' }}>

        {loading ? (
          /* Skeleton grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => <LoanCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Search size={40} color="#D4AF37" /></div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 8 }}>
              No loans match your filters
            </h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
              Try adjusting the purpose, tier, or search term.
            </p>
            <button
              onClick={() => { setPurpose('All'); setTier('All'); setSearch('') }}
              style={{
                height:       36,
                padding:      '0 16px',
                borderRadius: 6,
                background:   '#D4AF37',
                color:        '#111827',
                fontFamily:   "'Inter',sans-serif",
                fontSize:     13,
                fontWeight:   600,
                border:       'none',
                cursor:       'pointer',
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Loan grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map((loan, i) => (
              <div
                key={loan.id}
                style={{ animation: `slideUp 300ms ${Math.min(i * 40, 400)}ms cubic-bezier(0.16,1,0.3,1) both` }}
              >
                <LoanCard loan={loan} onFund={handleFund} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position:    'fixed',
          bottom:      24,
          right:       24,
          zIndex:      9999,
          background:  '#FFFFFF',
          border:      `1px solid ${toast.type === 'success' ? '#10B981' : '#D4AF37'}`,
          borderRadius: 8,
          padding:     '12px 16px',
          display:     'flex',
          alignItems:  'center',
          gap:         10,
          boxShadow:   '0 4px 12px rgba(0,0,0,0.10)',
          animation:   'slideUp 300ms cubic-bezier(0.16,1,0.3,1) both',
          minWidth:    260,
          maxWidth:    380,
        }}>
          <span style={{ fontSize: 16 }}>{toast.type === 'success' ? '✓' : 'ℹ'}</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#111827', flex: 1 }}>{toast.msg}</span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16, padding: 0 }}
          >
            ×
          </button>
        </div>
      )}

    </div>
  )
}
