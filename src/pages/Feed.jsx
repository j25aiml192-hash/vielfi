import { useState, useEffect } from 'react'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'
import { useNavigate, useLocation } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────
   DESIGN SYSTEM — Premium Institutional Light
───────────────────────────────────────────────────────────── */
const C = {
  bg:        '#F5F4F1',
  surface:   '#FFFFFF',
  surfaceAlt:'#FAFAF8',
  border:    '#E8E6E1',
  borderHover:'#C8C4BC',
  text:      '#111111',
  textMid:   '#444444',
  textMuted: '#888888',
  textFaint: '#AAAAAA',
  gold:      '#C9A84C',
  goldLight: '#F5E9C8',
  goldDark:  '#8B6914',
  indigo:    '#4F46E5',
  success:   '#16A34A',
  danger:    '#DC2626',
  amber:     '#D97706',
}

/* ─────────────────────────────────────────────────────────────
   NAV DRAWER — Kartik's feature: slides in from left
   Auto-opens when navigated from Landing "Start Borrowing"
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: '/feed',      label: 'Markets',    desc: 'Browse all live loan listings',          icon: <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg> },
  { to: '/verify',    label: 'Lending',    desc: 'Verify identity & get your credit score', icon: <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { to: '/circles',   label: 'Borrowing',  desc: 'Create loan requests & join circles',    icon: <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg> },
  { to: '/dashboard', label: 'Governance', desc: 'Your portfolio & repayment dashboard',   icon: <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
]

function NavDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const go = (to) => { onClose(); navigate(to) }
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.22)', backdropFilter:'blur(4px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition:'opacity 0.3s ease' }} />
      {/* Panel */}
      <div style={{ position:'fixed', top:0, left:0, bottom:0, zIndex:50, width:300, background:'#fff', boxShadow:'4px 0 40px rgba(0,0,0,0.12)', transform: open ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.35s cubic-bezier(0.22,1,0.36,1)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {/* Header */}
        <div style={{ padding:'24px 24px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:800, fontSize:'1.3rem', background:'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)', backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'goldShine 3s ease-in-out infinite' }}>VielFi</span>
            <p style={{ fontSize:'0.62rem', color:C.textFaint, fontFamily:"'JetBrains Mono', monospace", letterSpacing:'0.14em', textTransform:'uppercase', marginTop:3 }}>Navigation</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${C.border}`, background:C.surfaceAlt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMuted }}>
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Nav items */}
        <div style={{ padding:'16px 12px', flex:1 }}>
          {NAV_ITEMS.map(({ to, label, desc, icon }) => (
            <button key={to} onClick={() => go(to)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, background:'transparent', border:'none', cursor:'pointer', textAlign:'left', marginBottom:4, transition:'background 0.18s, transform 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#fdf9f3'; e.currentTarget.style.transform='translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none' }}
            >
              <div style={{ width:42, height:42, borderRadius:12, flexShrink:0, background:'linear-gradient(145deg,#fdf8ec,#faf0d8)', border:'1px solid rgba(212,175,55,0.18)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9952a' }}>{icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.95rem', color:C.text, marginBottom:2 }}>{label}</div>
                <div style={{ fontSize:'0.72rem', color:C.textMuted, lineHeight:1.4 }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'0.6rem', color:C.textFaint, letterSpacing:'0.12em', textTransform:'uppercase', textAlign:'center', margin:0 }}>Secure · Transparent · Decentralized</p>
        </div>
      </div>
      <style>{`@keyframes goldShine { 0%{background-position:100% 0;} 50%{background-position:0% 0;} 100%{background-position:100% 0;} }`}</style>
    </>
  )
}

const PURPOSE_ACCENT = {
  Business:    { bar: '#1a1a1a', bg: '#F8F8F8', label: 'BUSINESS'    },
  Education:   { bar: '#4F46E5', bg: '#F5F5FF', label: 'EDUCATION'   },
  Medical:     { bar: '#16A34A', bg: '#F3FBF5', label: 'MEDICAL'     },
  Equipment:   { bar: '#0369A1', bg: '#F0F7FF', label: 'EQUIPMENT'   },
  Agriculture: { bar: '#65A30D', bg: '#F6FBF0', label: 'AGRICULTURE' },
  Personal:    { bar: '#9333EA', bg: '#FAF5FF', label: 'PERSONAL'    },
}

const TIER_STYLE = {
  Platinum: { color: '#4F46E5', bg: '#EEEEFF', label: 'Platinum' },
  Gold:     { color: '#92400E', bg: '#FEF3C7', label: 'Gold'     },
  Silver:   { color: '#374151', bg: '#F3F4F6', label: 'Silver'   },
  Bronze:   { color: '#7C2D12', bg: '#FFF7ED', label: 'Bronze'   },
}

/* ─────────────────────────────────────────────────────────────
   DATA ADAPTER
───────────────────────────────────────────────────────────── */
const adaptLoan = (loan) => ({
  id:           loan.id,
  borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
  tier:         loan.tier         || 'Silver',
  purpose:      loan.purpose      || loan.title    || 'Loan',
  city:         loan.city         || 'India',
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
   MOCK DATA
───────────────────────────────────────────────────────────── */
const MOCK_LOANS = [
  {
    id: '1', borrowerName: 'Rahul Sharma', tier: 'Gold', purpose: 'Business',
    city: 'New Delhi', featured: true,
    story: 'Expanding my street food operation with a second cart and industrial equipment. Consistent ₹2.1L/mo UPI volume for 24 consecutive months.',
    amount: 200000, funded: 154000, duration: 12, emi: 18500, interestRate: 11, lenders: 8, daysLeft: 5,
  },
  {
    id: '2', borrowerName: 'Priya Nair', tier: 'Platinum', purpose: 'Equipment',
    city: 'Bengaluru', featured: false,
    story: 'Upgrading a professional design studio — MacBook Pro M3 and Wacom Cintiq. International clientele, 4 years unblemished repayment record.',
    amount: 350000, funded: 318000, duration: 18, emi: 21500, interestRate: 9, lenders: 14, daysLeft: 12,
  },
  {
    id: '3', borrowerName: 'Anita Meena', tier: 'Silver', purpose: 'Business',
    city: 'Jaipur', featured: false,
    story: 'Pre-Diwali inventory build for a GST-registered kirana store operating continuously for 6 years. Seasonal demand consistently 3x baseline.',
    amount: 150000, funded: 67500, duration: 6, emi: 26000, interestRate: 13, lenders: 4, daysLeft: 18,
  },
  {
    id: '4', borrowerName: 'Vikram Singh', tier: 'Bronze', purpose: 'Personal',
    city: 'Mumbai', featured: false,
    story: 'Engine replacement for auto-rickshaw. 8,400+ verified trips on Ola and Uber with 4.8 average rating. 6-month repayment horizon.',
    amount: 80000, funded: 24000, duration: 6, emi: 14200, interestRate: 15, lenders: 2, daysLeft: 22,
  },
  {
    id: '5', borrowerName: 'Meera Pillai', tier: 'Gold', purpose: 'Education',
    city: 'Chennai', featured: false,
    story: 'Online MBA, NMIMS. Currently earning ₹85,000/mo in a stable corporate role. 24-month repayment plan fully mapped to salary progression.',
    amount: 500000, funded: 450000, duration: 24, emi: 24500, interestRate: 10, lenders: 21, daysLeft: 7,
  },
  {
    id: '6', borrowerName: 'Suresh Yadav', tier: 'Silver', purpose: 'Personal',
    city: 'Pune', featured: false,
    story: 'Kitchen and bathroom renovation. Landlord contractually agreed to ₹2,000/mo rent reduction post-completion, effectively self-financing.',
    amount: 120000, funded: 36000, duration: 9, emi: 14000, interestRate: 12, lenders: 3, daysLeft: 30,
  },
  {
    id: '7', borrowerName: 'Farida Shaikh', tier: 'Platinum', purpose: 'Medical',
    city: 'Hyderabad', featured: true,
    story: 'Bridge financing for elective surgery — insurance covers 70%, gap is ₹84,000. 8-year employment at TCS, zero defaults, high repayment capacity.',
    amount: 280000, funded: 256000, duration: 12, emi: 25000, interestRate: 9.5, lenders: 18, daysLeft: 3,
  },
  {
    id: '8', borrowerName: 'Arun Kumar', tier: 'Gold', purpose: 'Agriculture',
    city: 'Nashik', featured: false,
    story: 'Drip irrigation system for 5-acre grape vineyard. ROI expected within 2 harvests based on historical yield data. 15 years farming experience.',
    amount: 180000, funded: 90000, duration: 12, emi: 16500, interestRate: 11, lenders: 9, daysLeft: 20,
  },
]

const ALL_PURPOSES = ['All', 'Business', 'Education', 'Medical', 'Equipment', 'Agriculture', 'Personal']
const ALL_TIERS    = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze']
const SORTS = [
  { label: 'Closing Soon',   value: 'daysLeft' },
  { label: 'Most Funded',    value: 'pct' },
  { label: 'Highest Amount', value: 'amount' },
  { label: 'Lowest Rate',    value: 'interestRate' },
]

/* ─────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────── */
const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const initials = (name) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

/* ─────────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────────── */
const FundingBar = ({ pct }) => {
  const color = pct >= 70 ? C.success : pct >= 30 ? C.amber : C.danger
  return (
    <div style={{ width: '100%', height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.min(pct, 100)}%`,
        background: color,
        borderRadius: 2,
        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   LOAN CARD
───────────────────────────────────────────────────────────── */
const LoanCard = ({ loan, onFund, variant = 'default' }) => {
  const [hovered, setHovered] = useState(false)
  const [funded,  setFunded]  = useState(false)
  const navigate = useNavigate()

  const {
    id, borrowerName = 'Borrower', tier = 'Silver',
    purpose = 'Personal', city = 'India',
    story = '', amount = 0, funded: fundedAmt = 0,
    interestRate = 12, lenders = 0, daysLeft = 30,
    featured = false, duration = 12,
  } = loan

  const pct     = Math.round((fundedAmt / amount) * 100)
  const tierCfg = TIER_STYLE[tier] || TIER_STYLE.Silver
  const purCfg  = PURPOSE_ACCENT[purpose] || PURPOSE_ACCENT.Personal
  const ini     = initials(borrowerName)
  const isLarge = variant === 'large'
  const isUrgent = daysLeft <= 7

  const handleFund = (e) => {
    e.stopPropagation()
    onFund?.(id, 5000)
    setFunded(true)
    setTimeout(() => setFunded(false), 2500)
  }

  return (
    <div
      onClick={() => navigate(`/loan/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Purpose accent bar */}
      <div style={{ height: 3, background: purCfg.bar, width: '100%', flexShrink: 0 }} />

      {/* Featured badge */}
      {featured && (
        <div style={{
          position: 'absolute', top: 18, right: 18,
          background: C.text, color: C.surface,
          fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase',
        }}>
          Featured
        </div>
      )}

      <div style={{ padding: isLarge ? '22px 24px' : '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Category + Tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: purCfg.bar, textTransform: 'uppercase' }}>
            {purCfg.label}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: tierCfg.color, background: tierCfg.bg, padding: '2px 8px', borderRadius: 4 }}>
            {tierCfg.label}
          </span>
        </div>

        {/* Borrower */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: purCfg.bg, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 13,
            color: purCfg.bar, flexShrink: 0, letterSpacing: '-0.02em',
          }}>
            {ini}
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {borrowerName}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              {city} · {duration}M tenure
            </div>
          </div>
        </div>

        {/* Story */}
        <p style={{
          fontSize: 13, color: C.textMid, lineHeight: 1.7, margin: 0,
          display: '-webkit-box', WebkitLineClamp: isLarge ? 3 : 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 400,
        }}>
          {story}
        </p>

        <div style={{ height: 1, background: C.border }} />

        {/* Financials */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
          <div>
            <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
              Loan Amount
            </div>
            <div style={{ fontFamily: "'Outfit', monospace", fontWeight: 800, fontSize: isLarge ? 22 : 18, color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {formatINR(amount)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
              Interest Rate
            </div>
            <div style={{ fontFamily: "'Outfit', monospace", fontWeight: 800, fontSize: isLarge ? 22 : 18, color: C.gold, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {interestRate}% <span style={{ fontSize: 11, fontWeight: 500, color: C.textFaint }}>p.a.</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <FundingBar pct={pct} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              <span style={{ fontWeight: 700, color: pct >= 70 ? C.success : pct >= 30 ? C.amber : C.danger }}>
                {pct}% funded
              </span>
              {' '}· {formatINR(fundedAmt)} raised
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: isUrgent ? C.danger : C.textMuted }}>
              {isUrgent && '⏱ '}{daysLeft}d left
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            <span style={{ fontWeight: 700, color: C.text }}>{lenders}</span> lender{lenders !== 1 ? 's' : ''}
          </div>
          <button
            onClick={handleFund}
            style={{
              background: funded ? C.success : C.text,
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '9px 20px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.02em',
              transition: 'all 0.18s ease',
              boxShadow: hovered && !funded ? '0 4px 14px rgba(17,17,17,0.25)' : 'none',
              transform: hovered ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {funded ? 'Funded ✓' : 'Fund Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MASONRY GRID
───────────────────────────────────────────────────────────── */
const MasonryGrid = ({ loans, onFund }) => (
  <div style={{ columns: '3 320px', gap: 16 }}>
    {loans.map((loan, i) => (
      <div key={loan.id} style={{ breakInside: 'avoid', marginBottom: 16, opacity: 0, animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms both` }}>
        <LoanCard loan={loan} onFund={onFund} variant={(loan.featured || loan.tier === 'Platinum') ? 'large' : 'default'} />
      </div>
    ))}
  </div>
)

/* ─────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────── */
const SkeletonCard = ({ height = 280 }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, height, overflow: 'hidden' }}>
    <div style={{ height: 3, background: C.border }} />
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[60, 40, 100, 40, 50].map((w, i) => (
        <div key={i} style={{ height: i === 2 ? 12 : 14, background: '#EEECE8', borderRadius: 4, width: `${w}%`, animation: 'skeletonPulse 1.6s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  </div>
)

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Feed() {
  const location = useLocation()
  const [drawerOpen,    setDrawerOpen]    = useState(location.state?.openDrawer === true)
  const [loans,         setLoans]         = useState(MOCK_LOANS)
  const [loading,       setLoading]       = useState(false)
  const [tierFilter,    setTier]          = useState('All')
  const [purposeFilter, setPurpose]       = useState('All')
  const [sort,          setSort]          = useState('daysLeft')
  const [search,        setSearch]        = useState('')
  const [fundSuccess,   setFundSuccess]   = useState(null)
  const [apiError,      setApiError]      = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = C.bg
    if (location.state?.openDrawer) window.history.replaceState({}, document.title)
    return () => { document.body.style.backgroundColor = prev }
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

  const totalDeployed = loans.reduce((s, l) => s + l.funded, 0)
  const avgReturn     = (loans.reduce((s, l) => s + l.interestRate, 0) / loans.length).toFixed(1)
  const activeLenders = loans.reduce((s, l) => s + l.lenders, 0)

  return (
    <>
      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes skeletonPulse { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
        @keyframes toastSlide { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes goldShine { 0%{background-position:100% 0;} 50%{background-position:0% 0;} 100%{background-position:100% 0;} }
        *{box-sizing:border-box;}
      `}</style>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: C.text, paddingTop: 72 }}>

        {/* HEADER */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 32px 0' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              {/* Hamburger to re-open drawer */}
              <button
                onClick={() => setDrawerOpen(true)}
                title="Open navigation"
                style={{ width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`, background:C.surfaceAlt, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'background 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#fdf5e0'; e.currentTarget.style.boxShadow='0 2px 12px rgba(200,160,40,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background=C.surfaceAlt; e.currentTarget.style.boxShadow='none' }}
              >
                <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#c9952a" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div style={{ fontSize: 12, color: C.textFaint, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', display:'flex', alignItems:'center', gap:8 }}>
                <span>Vielfi</span><span style={{ opacity: 0.4 }}>/</span><span style={{ color: C.text }}>Marketplace</span>
              </div>
            </div>

            {/* Headline + stats */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', paddingBottom: 40 }}>
              <div style={{ flex: '1 1 400px' }}>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 4vw, 56px)', color: C.text, letterSpacing: '-0.04em', lineHeight: 1.0, margin: '0 0 14px' }}>
                  Credit{' '}
                  <span style={{ color: C.gold }}>Marketplace</span>
                </h1>
                <p style={{ fontSize: 15, color: C.textMid, margin: 0, lineHeight: 1.6, maxWidth: 480, fontWeight: 400 }}>
                  Peer-to-peer lending for verified borrowers.
                  Deploy capital, earn transparent returns.
                </p>
                {apiError && (
                  <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.amber, background: '#FFF8EC', border: `1px solid #F6DBA0`, borderRadius: 6, padding: '5px 12px', fontWeight: 500 }}>
                    Demo mode — backend offline
                  </div>
                )}
              </div>

              {/* Stats panel */}
              <div style={{ display: 'flex', gap: 0, flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.surfaceAlt }}>
                {[
                  { label: 'Capital Deployed',  value: `₹${(totalDeployed / 100000).toFixed(1)}L` },
                  { label: 'Avg. Return',        value: `${avgReturn}%` },
                  { label: 'Active Lenders',     value: `${activeLenders}` },
                  { label: 'Open Listings',      value: `${loans.length}` },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ padding: '16px 24px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none', textAlign: 'center', minWidth: 100 }}>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FILTER TOOLBAR */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 64, zIndex: 40 }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 0, height: 52, overflowX: 'auto' }}>

            {/* Search */}
            <div style={{ position: 'relative', marginRight: 24, flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search borrowers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{ width: 200, height: 34, paddingLeft: 32, paddingRight: 12, border: `1px solid ${searchFocused ? C.borderHover : C.border}`, borderRadius: 7, background: C.surfaceAlt, fontSize: 13, color: C.text, outline: 'none', transition: 'border-color 0.15s', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ width: 1, height: 24, background: C.border, marginRight: 24, flexShrink: 0 }} />

            {/* Purpose filters */}
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              {ALL_PURPOSES.map(p => (
                <button key={p} onClick={() => setPurpose(p)} style={{ padding: '5px 14px', border: 'none', borderRadius: 6, background: purposeFilter === p ? C.text : 'transparent', color: purposeFilter === p ? '#fff' : C.textMuted, fontSize: 12, fontWeight: purposeFilter === p ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  {p}
                </button>
              ))}
            </div>

            <div style={{ width: 1, height: 24, background: C.border, margin: '0 24px', flexShrink: 0 }} />

            {/* Tier filters */}
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              {ALL_TIERS.map(t => (
                <button key={t} onClick={() => setTier(t)} style={{ padding: '5px 12px', border: 'none', borderRadius: 6, background: tierFilter === t ? C.text : 'transparent', color: tierFilter === t ? '#fff' : C.textMuted, fontSize: 12, fontWeight: tierFilter === t ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Sort + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: C.textFaint, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {filtered.length} results
              </span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '5px 10px', border: `1px solid ${C.border}`, borderRadius: 7, background: C.surfaceAlt, fontSize: 12, color: C.text, fontWeight: 500, cursor: 'pointer', outline: 'none', fontFamily: 'inherit', height: 34 }}>
                {SORTS.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 32px 80px' }}>
          {loading ? (
            <div style={{ columns: '3 320px', gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ breakInside: 'avoid', marginBottom: 16 }}>
                  <SkeletonCard height={i % 3 === 0 ? 340 : 270} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 900, color: C.border, letterSpacing: '-0.04em', marginBottom: 12 }}>0</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>No results</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Adjust your filters to find matching loans</div>
            </div>
          ) : (
            <MasonryGrid loans={filtered} onFund={handleFund} />
          )}
        </div>
      </div>

      {/* TOAST */}
      {fundSuccess && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.success}`, borderRadius: 10, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 12, animation: 'toastSlide 0.35s cubic-bezier(0.16,1,0.3,1) both', fontFamily: 'inherit', maxWidth: 300 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Funding submitted</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Transaction sent to Ethereum Sepolia</div>
          </div>
        </div>
      )}
    </>
  )
}
