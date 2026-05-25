import { useState, useEffect } from 'react'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'
import { useNavigate, useLocation } from 'react-router-dom'

/* ─── Design Tokens ─── */
const C = {
  bg:         '#f9f9f9',
  surface:    '#ffffff',
  border:     '#e6e6e6',
  text:       '#1b1b1b',
  textMid:    '#444444',
  textMuted:  '#888888',
  textFaint:  '#aaaaaa',
  gold:       '#b58c2a',
  success:    '#1ea64a',
  danger:     '#dc2626',
  amber:      '#d97706',
  magenta:    '#ff3d8b',
}

/* ─── Category config ─── */
const PURPOSE_CFG = {
  Business:    { color: '#1a1a1a', label: 'BUSINESS'    },
  Education:   { color: '#4F46E5', label: 'EDUCATION'   },
  Medical:     { color: '#1ea64a', label: 'MEDICAL'     },
  Equipment:   { color: '#0369A1', label: 'EQUIPMENT'   },
  Agriculture: { color: '#65A30D', label: 'AGRICULTURE' },
  Personal:    { color: '#9333EA', label: 'PERSONAL'    },
}

/* ─── Tier config ─── */
const TIER_CFG = {
  Platinum: { color: '#4F46E5', bg: '#EEEEFF', label: 'Platinum' },
  Gold:     { color: '#9c781e', bg: '#fcf1d8', label: 'Gold'     },
  Silver:   { color: '#374151', bg: '#F3F4F6', label: 'Silver'   },
  Bronze:   { color: '#7C2D12', bg: '#FFF7ED', label: 'Bronze'   },
}

/* ─── Avatar colour pairs from initials ─── */
const AVATAR_COLORS = [
  { bg: '#e6f4ea', fg: '#1ea64a' },
  { bg: '#eeeeff', fg: '#5252ff' },
  { bg: '#f2f7e9', fg: '#83b728' },
  { bg: '#fef3c7', fg: '#d97706' },
  { bg: '#fce7f3', fg: '#db2777' },
  { bg: '#e0f2fe', fg: '#0369a1' },
  { bg: '#f3e8ff', fg: '#7c3aed' },
  { bg: '#fff1f2', fg: '#e11d48' },
]
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

/* ─── Data adapter ─── */
const adaptLoan = (loan) => ({
  id:           loan.id,
  borrowerName: loan.borrowerName || loan.borrower || 'Borrower',
  tier:         loan.tier         || 'Silver',
  purpose:      loan.purpose      || 'Loan',
  city:         loan.city         || 'India',
  story:        loan.story        || '',
  amount:       loan.amount,
  funded:       loan.fundedAmount ?? 0,
  duration:     loan.duration     || loan.durationMonths || 12,
  emi:          loan.emiAmount    || 0,
  interestRate: loan.apr          || loan.interestRate || 12,
  lenders:      loan.lenderCount  || loan.lenders || 0,
  daysLeft:     loan.daysRemaining ?? loan.daysLeft ?? 30,
  featured:     loan.featured     ?? false,
})

/* ─── Mock data ─── */
const MOCK_LOANS = [
  { id:'7', borrowerName:'Farida Shaikh',  tier:'Platinum', purpose:'Medical',     city:'Hyderabad', featured:true,
    story:'Bridge financing for elective surgery — insurance covers 70%, gap is \u20b984,000. 8-year employment at TCS, zero defaults, high repayment capacity.',
    amount:280000, funded:256000, duration:12, emi:25000, interestRate:9.5, lenders:18, daysLeft:3 },
  { id:'5', borrowerName:'Meera Pillai',   tier:'Gold',     purpose:'Education',   city:'Chennai',   featured:false,
    story:'Online MBA, NMIMS. Currently earning \u20b985,000/mo in a stable corporate role. 24-month repayment plan fully mapped to current surplus income.',
    amount:500000, funded:450000, duration:24, emi:24500, interestRate:10, lenders:21, daysLeft:7 },
  { id:'8', borrowerName:'Arun Kumar',     tier:'Gold',     purpose:'Agriculture', city:'Nashik',    featured:false,
    story:'Drip irrigation system for 5-acre grape vineyard. ROI expected within 2 harvests based on historical yield data. Verified land ownership.',
    amount:180000, funded:90000,  duration:12, emi:16500, interestRate:11, lenders:9,  daysLeft:20 },
  { id:'1', borrowerName:'Rahul Sharma',   tier:'Gold',     purpose:'Business',    city:'New Delhi', featured:false,
    story:'Expanding my street food operation with a second cart and industrial equipment. Consistent \u20b92.1L/mo UPI volume for 24 consecutive months.',
    amount:200000, funded:154000, duration:12, emi:18500, interestRate:11, lenders:8,  daysLeft:5 },
  { id:'2', borrowerName:'Priya Nair',     tier:'Platinum', purpose:'Equipment',   city:'Bengaluru', featured:false,
    story:'Upgrading a professional design studio — MacBook Pro M3 and Wacom Cintiq. International clientele, 4 years unblemished repayment record.',
    amount:350000, funded:318000, duration:18, emi:21500, interestRate:9,  lenders:14, daysLeft:12 },
  { id:'3', borrowerName:'Anita Meena',    tier:'Silver',   purpose:'Business',    city:'Jaipur',    featured:false,
    story:'Pre-Diwali inventory build for a GST-registered kirana store operating continuously for 6 years. Seasonal demand consistently 3x baseline.',
    amount:150000, funded:67500,  duration:6,  emi:26000, interestRate:13, lenders:4,  daysLeft:18 },
  { id:'4', borrowerName:'Vikram Singh',   tier:'Bronze',   purpose:'Personal',    city:'Mumbai',    featured:false,
    story:'Engine replacement for auto-rickshaw. 8,400+ verified trips on Ola and Uber with 4.8 average rating. 6-month repayment horizon.',
    amount:80000,  funded:24000,  duration:6,  emi:14200, interestRate:15, lenders:2,  daysLeft:22 },
  { id:'6', borrowerName:'Suresh Yadav',   tier:'Silver',   purpose:'Personal',    city:'Pune',      featured:false,
    story:'Kitchen and bathroom renovation. Landlord contractually agreed to \u20b92,000/mo rent reduction post-completion, effectively self-financing.',
    amount:120000, funded:36000,  duration:9,  emi:14000, interestRate:12, lenders:3,  daysLeft:30 },
]

const ALL_PURPOSES = ['All','Business','Education','Medical','Equipment','Agriculture','Personal']
const ALL_TIERS    = ['All','Platinum','Gold','Silver','Bronze']
const SORTS = [
  { label:'Closing Soon',   value:'daysLeft' },
  { label:'Most Funded',    value:'pct' },
  { label:'Highest Amount', value:'amount' },
  { label:'Lowest Rate',    value:'interestRate' },
]

const initials = (n) => n?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'NA'
const formatINR = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
const formatShort = (n) => n >= 100000 ? `\u20b9${(n/100000).toFixed(1)}L` : n >= 1000 ? `\u20b9${(n/1000).toFixed(0)}k` : `\u20b9${n}`

/* ════════════════════════════════════════
   LOAN CARD  — LinkedIn-style article
════════════════════════════════════════ */
function LoanCard({ loan, onFund, fundedId }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 18))

  const {
    id, borrowerName, tier='Silver', purpose='Personal',
    city='India', story='', amount=0, funded:fundedAmt=0,
    interestRate=12, lenders=0, daysLeft=30, featured=false, duration=12,
  } = loan

  const pct      = Math.round((fundedAmt / amount) * 100)
  const tierCfg  = TIER_CFG[tier]   || TIER_CFG.Silver
  const purCfg   = PURPOSE_CFG[purpose] || PURPOSE_CFG.Personal
  const av       = avatarColor(borrowerName)
  const ini      = initials(borrowerName)
  const isUrgent = daysLeft <= 7
  const justFunded = fundedId === id
  const barColor = pct >= 70 ? C.success : pct >= 30 ? C.amber : C.danger

  return (
    <article style={{
      background: C.surface, border:`1px solid ${C.border}`,
      borderRadius: 12, overflow:'hidden',
      transition:'box-shadow 0.2s',
      fontFamily:'Inter, sans-serif',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.08)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
    >
      {/* Card header — borrower + category */}
      <div style={{ padding:'20px 20px 0', display:'flex', alignItems:'flex-start', gap:12, justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Avatar */}
          <div style={{
            width:44, height:44, borderRadius:'50%', flexShrink:0,
            background:av.bg, color:av.fg,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:15, border:`1px solid ${C.border}`,
          }}>{ini}</div>
          {/* Name + location */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontWeight:700, fontSize:'0.95rem', color:C.text }}>{borrowerName}</span>
              {/* Tier badge */}
              <span style={{ fontSize:10, fontWeight:700, color:tierCfg.color, background:tierCfg.bg, padding:'2px 8px', borderRadius:4, letterSpacing:'0.04em', textTransform:'uppercase' }}>
                {tierCfg.label}
              </span>
              {featured && (
                <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:C.text, padding:'2px 8px', borderRadius:4, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  FEATURED
                </span>
              )}
            </div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{city} &bull; {duration}M tenure</div>
          </div>
        </div>
        {/* Category label top-right */}
        <span style={{ fontSize:10, fontWeight:700, color:purCfg.color, letterSpacing:'0.14em', textTransform:'uppercase', flexShrink:0 }}>
          {purCfg.label}
        </span>
      </div>

      {/* Story */}
      <p style={{ margin:'14px 20px', fontSize:14, color:C.text, lineHeight:1.65, fontWeight:400 }}>
        {story}
      </p>

      {/* Loan details box */}
      <div style={{ margin:'0 20px 16px', background:'#f5f5f3', border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 24px', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:9, color:C.textFaint, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>LOAN AMOUNT</div>
            <div style={{ fontWeight:800, fontSize:'1.3rem', color:C.text, letterSpacing:'-0.03em', lineHeight:1 }}>{formatINR(amount)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:C.textFaint, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>INTEREST RATE</div>
            <div style={{ fontWeight:800, fontSize:'1.3rem', color:C.gold, letterSpacing:'-0.03em', lineHeight:1 }}>{interestRate}% <span style={{ fontSize:11, fontWeight:500, color:C.textMuted }}>p.a.</span></div>
          </div>
        </div>
        {/* Progress bar */}
        <div>
          <div style={{ height:8, width:'100%', background:'#e0deda', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
            <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:barColor, borderRadius:4, transition:'width 1s ease' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12 }}>
              <span style={{ fontWeight:700, color:barColor }}>{pct}% funded</span>
              <span style={{ color:C.textMuted }}> &bull; {formatShort(fundedAmt)} raised</span>
            </span>
            <span style={{ fontSize:12, fontWeight:600, color:isUrgent ? C.danger : C.textMuted }}>
              {isUrgent ? '\u23f1 ' : ''}{daysLeft}d left
            </span>
          </div>
        </div>
      </div>

      {/* Footer — like/comment/share + Fund */}
      <div style={{
        borderTop:`1px solid ${C.border}`, padding:'12px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:20, color:C.textMuted }}>
          {/* Like */}
          <button
            onClick={() => { setLiked(l => !l); setLikes(n => liked ? n-1 : n+1) }}
            style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color: liked ? '#e11d48' : C.textMuted, fontSize:13, transition:'color 0.15s' }}
          >
            <svg width={16} height={16} fill={liked?'#e11d48':'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Like{likes > 0 && <span style={{ fontSize:11 }}>{likes}</span>}
          </button>
          {/* Comment */}
          <button style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13 }}
            onClick={() => navigate(`/loan/${id}`)}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            {lenders}
          </button>
          {/* Share */}
          <button style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13 }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
        </div>

        {/* Fund button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFund?.(id, 5000) }}
          style={{
            background: justFunded ? C.success : C.text,
            color:'#fff', border:'none', borderRadius:999,
            padding:'9px 24px', fontSize:13, fontWeight:700,
            cursor:'pointer', letterSpacing:'0.01em',
            transition:'all 0.18s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          {justFunded ? 'Funded \u2713' : 'Fund'}
        </button>
      </div>
    </article>
  )
}

/* ════════════════════════════════════════
   LEFT SIDEBAR — LinkedIn-style profile
════════════════════════════════════════ */
function LeftSidebar() {
  const navigate = useNavigate()
  return (
    <aside style={{
      width:260, flexShrink:0,
      position:'sticky', top:72,
      height:'calc(100vh - 80px)', overflowY:'auto',
      display:'flex', flexDirection:'column', gap:12,
      fontFamily:'Inter, sans-serif',
      scrollbarWidth:'none',
    }}>
      {/* Profile card */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
        {/* Gradient banner */}
        <div style={{ height:52, background:'linear-gradient(135deg,#dceeb1,#c8e6cd)' }} />
        <div style={{ padding:'0 20px 20px', marginTop:-24 }}>
          {/* Avatar */}
          <div style={{
            width:48, height:48, borderRadius:'50%',
            background:'#e2e2e2', border:`3px solid ${C.surface}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:16, color:C.text, marginBottom:10,
          }}>KT</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontWeight:700, fontSize:'0.95rem', color:C.text }}>Kartik Thakur</span>
            <svg width={14} height={14} fill="#1ea64a" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p style={{ fontSize:11, color:C.textMuted, lineHeight:1.5, marginBottom:12 }}>
            CSE (AIML) '29 @ JSS Noida | Hackathon Winner \ud83c\udfc6 X1 | Building...
          </p>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
            {[
              { label:'PROFILE VIEWERS', value:'108' },
              { label:'POST IMPRESSIONS', value:'30' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0' }}>
                <span style={{ fontSize:10, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'JetBrains Mono, monospace' }}>{label}</span>
                <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Nav links */}
        <div style={{ borderTop:`1px solid ${C.border}`, padding:'10px 12px', background:'#fafafa' }}>
          {[
            { icon:'🔖', label:'Saved items' },
            { icon:'\ud83d\udc65', label:'Groups' },
            { icon:'\ud83d\udcf0', label:'Newsletters' },
            { icon:'\ud83d\udcc5', label:'Events' },
          ].map(({ icon, label }) => (
            <button key={label} style={{
              display:'flex', alignItems:'center', gap:10,
              width:'100%', padding:'9px 10px', borderRadius:8,
              background:'none', border:'none', cursor:'pointer',
              fontSize:13, color:C.textMid, textAlign:'left',
              transition:'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#f0ede8'; e.currentTarget.style.color=C.text }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=C.textMid }}
            >
              <span style={{ fontSize:15 }}>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ════════════════════════════════════════
   SKELETON
════════════════════════════════════════ */
const Skeleton = () => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
    {[80,60,100,40,60].map((w,i) => (
      <div key={i} style={{ height:14, background:'#eeece8', borderRadius:4, width:`${w}%`, animation:'pulse 1.6s ease-in-out infinite', animationDelay:`${i*100}ms` }} />
    ))}
  </div>
)

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export default function Feed() {
  const location = useLocation()
  const [loans,         setLoans]         = useState(MOCK_LOANS)
  const [loading,       setLoading]       = useState(false)
  const [tierFilter,    setTier]          = useState('All')
  const [purposeFilter, setPurpose]       = useState('All')
  const [sort,          setSort]          = useState('daysLeft')
  const [search,        setSearch]        = useState('')
  const [fundedId,      setFundedId]      = useState(null)
  const [apiError,      setApiError]      = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const prev = document.body.style.background
    document.body.style.background = C.bg
    return () => { document.body.style.background = prev }
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        if (Array.isArray(data) && data.length > 0) { setLoans(data.map(adaptLoan)); setApiError('') }
      } catch (err) { setApiError(err.message) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleFund = async (loanId, amount) => {
    try { await fundLoan(loanId, amount) } catch {}
    setFundedId(loanId)
    setTimeout(() => setFundedId(null), 3000)
  }

  const filtered = loans
    .filter(l => {
      if (tierFilter !== 'All'    && l.tier    !== tierFilter)    return false
      if (purposeFilter !== 'All' && l.purpose !== purposeFilter) return false
      if (search && !l.borrowerName.toLowerCase().includes(search.toLowerCase()) &&
          !l.story.toLowerCase().includes(search.toLowerCase()))  return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'pct')          return (b.funded/b.amount) - (a.funded/a.amount)
      if (sort === 'amount')       return b.amount - a.amount
      if (sort === 'interestRate') return a.interestRate - b.interestRate
      return a.daysLeft - b.daysLeft
    })

  const totalDeployed = loans.reduce((s,l) => s + l.funded, 0)
  const avgReturn     = (loans.reduce((s,l) => s + l.interestRate, 0) / loans.length).toFixed(1)
  const activeLenders = loans.reduce((s,l) => s + l.lenders, 0)

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
        @keyframes cardIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:none;} }
        .feed-filter-btn { transition: background 0.15s, color 0.15s; }
        .feed-filter-btn:hover { background:#eeeeee !important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:C.bg, fontFamily:'Inter, sans-serif' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:1080, margin:'0 auto', padding:'28px 24px 0' }}>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:20, paddingBottom:28 }}>
              {/* Left: breadcrumb + title */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:C.textFaint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>
                  <span>VEILFI</span><span>/</span><span style={{ color:C.text }}>MARKETPLACE</span>
                </div>
                <h1 style={{ fontWeight:700, fontSize:'clamp(1.6rem,3vw,2rem)', color:C.text, letterSpacing:'-0.03em', marginBottom:6, lineHeight:1.1 }}>
                  Credit <span style={{ fontWeight:400, color:C.textMuted }}>Marketplace</span>
                </h1>
                <p style={{ fontSize:13, color:C.textMid, maxWidth:380, lineHeight:1.6, margin:0 }}>
                  Peer-to-peer lending for verified borrowers. Deploy capital, earn transparent returns.
                </p>
                {apiError && (
                  <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6, fontSize:10, color:'#b86000', background:'#fff8f0', border:'1px solid #ffd0a0', borderRadius:20, padding:'4px 12px', fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.08em', fontStyle:'italic' }}>
                    DEMO NODE — BACKEND OFFLINE
                  </div>
                )}
              </div>
              {/* Right: stats panel */}
              <div style={{ display:'flex', border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                {[
                  { label:'CAPITAL DEPLOYED',  value:formatShort(totalDeployed),    color:C.text    },
                  { label:'AVG. RETURN',        value:`${avgReturn}%`,               color:C.success },
                  { label:'ACTIVE LENDERS',     value:`${activeLenders}`,            color:C.text    },
                  { label:'OPEN LISTINGS',      value:`${loans.length}`,             color:C.magenta },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ padding:'14px 20px', textAlign:'center', borderLeft: i>0 ? `1px solid ${C.border}` : 'none', minWidth:90 }}>
                    <div style={{ fontWeight:800, fontSize:'1.05rem', color:stat.color, letterSpacing:'-0.03em', lineHeight:1 }}>{stat.value}</div>
                    <div style={{ fontSize:9, color:C.textFaint, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', marginTop:5, fontFamily:'JetBrains Mono, monospace' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FILTER TOOLBAR ── */}
            <div style={{ borderTop:`1px solid ${C.border}`, padding:'10px 0', display:'flex', flexWrap:'wrap', alignItems:'center', gap:12 }}>
              {/* Search */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke={C.textFaint} strokeWidth={2} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text" placeholder="Search borrowers..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                  style={{ width:180, padding:'7px 12px 7px 30px', border:`1px solid ${searchFocused ? '#aaa' : C.border}`, borderRadius:8, background:C.surface, fontSize:13, color:C.text, outline:'none', fontFamily:'inherit' }}
                />
              </div>

              {/* Purpose pills */}
              <div style={{ display:'flex', gap:4, overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
                {ALL_PURPOSES.map(p => (
                  <button key={p} onClick={() => setPurpose(p)}
                    style={{ padding:'5px 14px', border:'none', borderRadius:999, background: purposeFilter===p ? C.text : 'transparent', color: purposeFilter===p ? '#fff' : C.textMuted, fontSize:13, fontWeight: purposeFilter===p ? 700 : 400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all 0.15s' }}
                    className="feed-filter-btn"
                  >{p}</button>
                ))}
              </div>

              <div style={{ width:1, height:20, background:C.border, flexShrink:0 }} />

              {/* Tier pills */}
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                {ALL_TIERS.map(t => (
                  <button key={t} onClick={() => setTier(t)}
                    style={{ padding:'5px 14px', border:'none', borderRadius:999, background: tierFilter===t ? C.text : 'transparent', color: tierFilter===t ? '#fff' : C.textMuted, fontSize:13, fontWeight: tierFilter===t ? 700 : 400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all 0.15s', display:'flex', alignItems:'center', gap:5 }}
                    className="feed-filter-btn"
                  >
                    {tierFilter===t && <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <span style={{ fontSize:11, color:C.textFaint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.08em', textTransform:'uppercase' }}>{filtered.length} RESULTS</span>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ border:'none', background:'transparent', fontSize:13, color:C.textMid, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                  {SORTS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT: sidebar + feed ── */}
        <div style={{ maxWidth:1080, margin:'0 auto', padding:'24px 24px 80px', display:'flex', gap:20, alignItems:'flex-start' }}>

          {/* Left sidebar — only on wide screens */}
          <div style={{ display:'block' }} className="sidebar-wrap">
            <LeftSidebar />
          </div>

          {/* Center feed */}
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:16 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'60px 24px', textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>No results</div>
                <div style={{ fontSize:13, color:C.textMuted }}>Adjust filters to find matching loans</div>
              </div>
            ) : (
              filtered.map((loan, i) => (
                <div key={loan.id} style={{ opacity:0, animation:`cardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${i*60}ms both` }}>
                  <LoanCard loan={loan} onFund={handleFund} fundedId={fundedId} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fund success toast */}
      {fundedId && (
        <div style={{ position:'fixed', bottom:28, right:28, zIndex:9999, background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.success}`, borderRadius:10, padding:'14px 20px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:12, maxWidth:280, fontFamily:'inherit' }}>
          <div style={{ width:28, height:28, borderRadius:6, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:C.success, fontWeight:700 }}>\u2713</div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Funding submitted</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Sent to Ethereum Sepolia</div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:800px) { .sidebar-wrap { display:none !important; } }
      `}</style>
    </>
  )
}
