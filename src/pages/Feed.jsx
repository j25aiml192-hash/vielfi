import { useState, useEffect, useRef } from 'react'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ─── Design Tokens ─── */
const C = {
  bg:'#f5f5f3', surface:'#ffffff', border:'#e6e6e6',
  text:'#1b1b1b', textMid:'#444', textMuted:'#777', textFaint:'#aaa',
  gold:'#b58c2a', success:'#1ea64a', danger:'#dc2626', amber:'#d97706', magenta:'#ff3d8b',
}

/* ─── Avatar colour palette ─── */
const AV_COLORS = [
  { bg:'#e6f4ea', fg:'#1ea64a' }, { bg:'#eeeeff', fg:'#5252ff' },
  { bg:'#f2f7e9', fg:'#65A30D' }, { bg:'#fef3c7', fg:'#d97706' },
  { bg:'#fce7f3', fg:'#db2777' }, { bg:'#e0f2fe', fg:'#0369a1' },
  { bg:'#f3e8ff', fg:'#7c3aed' }, { bg:'#fff1f2', fg:'#e11d48' },
  { bg:'#ecfdf5', fg:'#047857' }, { bg:'#fff7ed', fg:'#c2410c' },
]
const avatarColor = (name) => AV_COLORS[(name?.charCodeAt(0)||0) % AV_COLORS.length]

/* ─── Borrower emoji avatars (deterministic) ─── */
const BORROWER_EMOJIS = {
  'Farida Shaikh':'\ud83d\udc69\u200d\u2695\ufe0f', 'Meera Pillai':'\ud83d\udc69\u200d\ud83d\udcbb',
  'Arun Kumar':'\ud83d\udc68\u200d\ud83c\udf3e',    'Rahul Sharma':'\ud83d\udc68\u200d\ud83c\udf73',
  'Priya Nair':'\ud83d\udc69\u200d\ud83c\udfa8',    'Anita Meena':'\ud83d\udc69\u200d\ud83d\udecd\ufe0f',
  'Vikram Singh':'\ud83d\udc68\u200d\ud83d\ude99',  'Suresh Yadav':'\ud83d\udc68\u200d\ud83d\udd27',
}

/* ─── Category config ─── */
const PURPOSE_CFG = {
  Business:    { color:'#1a1a1a', bg:'#f5f5f5', label:'BUSINESS'    },
  Education:   { color:'#4F46E5', bg:'#EEEEFF', label:'EDUCATION'   },
  Medical:     { color:'#1ea64a', bg:'#e6f4ea', label:'MEDICAL'     },
  Equipment:   { color:'#0369A1', bg:'#e0f2fe', label:'EQUIPMENT'   },
  Agriculture: { color:'#65A30D', bg:'#f2f7e9', label:'AGRICULTURE' },
  Personal:    { color:'#9333EA', bg:'#f3e8ff', label:'PERSONAL'    },
}
const TIER_CFG = {
  Platinum:{ color:'#4F46E5', bg:'#EEEEFF', label:'PLATINUM' },
  Gold:    { color:'#9c781e', bg:'#fcf1d8', label:'GOLD'     },
  Silver:  { color:'#374151', bg:'#F3F4F6', label:'SILVER'   },
  Bronze:  { color:'#7C2D12', bg:'#FFF7ED', label:'BRONZE'   },
}

/* ─── Mock data ─── */
const MOCK_LOANS = [
  { id:'7', borrowerName:'Farida Shaikh',  tier:'Platinum', purpose:'Medical',    city:'Hyderabad', featured:true,
    story:'Bridge financing for elective surgery \u2014 insurance covers 70%, gap is \u20b984,000. 8-year employment at TCS, zero defaults, high repayment capacity.',
    amount:280000, funded:256000, duration:12, interestRate:9.5, lenders:18, daysLeft:3,
    tags:['ZK-Verified','Low Risk'], creditScore:851, monthlyIncome:120000 },
  { id:'5', borrowerName:'Meera Pillai',   tier:'Gold',     purpose:'Education',  city:'Chennai', featured:false,
    story:'Online MBA, NMIMS. Currently earning \u20b985,000/mo in a stable corporate role. 24-month repayment plan fully mapped to current surplus income.',
    amount:500000, funded:450000, duration:24, interestRate:10, lenders:21, daysLeft:7,
    tags:['Salaried','GST-Filed'], creditScore:762, monthlyIncome:85000 },
  { id:'8', borrowerName:'Arun Kumar',     tier:'Gold',     purpose:'Agriculture',city:'Nashik', featured:false,
    story:'Drip irrigation system for 5-acre grape vineyard. ROI expected within 2 harvests based on historical yield data. Verified land ownership.',
    amount:180000, funded:90000, duration:12, interestRate:11, lenders:9, daysLeft:20,
    tags:['Land-Verified','Agri-Loan'], creditScore:681, monthlyIncome:55000 },
  { id:'1', borrowerName:'Rahul Sharma',   tier:'Gold',     purpose:'Business',   city:'New Delhi', featured:false,
    story:'Expanding my street food operation with a second cart and industrial equipment. Consistent \u20b92.1L/mo UPI volume for 24 consecutive months.',
    amount:200000, funded:154000, duration:12, interestRate:11, lenders:8, daysLeft:5,
    tags:['UPI-Verified','GST-Filed'], creditScore:734, monthlyIncome:210000 },
  { id:'2', borrowerName:'Priya Nair',     tier:'Platinum', purpose:'Equipment',  city:'Bengaluru', featured:false,
    story:'Upgrading a professional design studio \u2014 MacBook Pro M3 and Wacom Cintiq. International clientele, 4 years unblemished repayment record.',
    amount:350000, funded:318000, duration:18, interestRate:9, lenders:14, daysLeft:12,
    tags:['ZK-Verified','Freelancer'], creditScore:851, monthlyIncome:350000 },
  { id:'3', borrowerName:'Anita Meena',    tier:'Silver',   purpose:'Business',   city:'Jaipur', featured:false,
    story:'Pre-Diwali inventory build for a GST-registered kirana store operating continuously for 6 years. Seasonal demand consistently 3x baseline.',
    amount:150000, funded:67500, duration:6, interestRate:13, lenders:4, daysLeft:18,
    tags:['GST-Registered','SME'], creditScore:628, monthlyIncome:65000 },
  { id:'4', borrowerName:'Vikram Singh',   tier:'Bronze',   purpose:'Personal',   city:'Mumbai', featured:false,
    story:'Engine replacement for auto-rickshaw. 8,400+ verified trips on Ola and Uber with 4.8 average rating. 6-month repayment horizon.',
    amount:80000, funded:24000, duration:6, interestRate:15, lenders:2, daysLeft:22,
    tags:['Gig-Worker','UPI-Verified'], creditScore:558, monthlyIncome:42000 },
  { id:'6', borrowerName:'Suresh Yadav',   tier:'Silver',   purpose:'Personal',   city:'Pune', featured:false,
    story:'Kitchen and bathroom renovation. Landlord contractually agreed to \u20b92,000/mo rent reduction post-completion, effectively self-financing.',
    amount:120000, funded:36000, duration:9, interestRate:12, lenders:3, daysLeft:30,
    tags:['Salaried','Rental-History'], creditScore:645, monthlyIncome:78000 },
]

const ALL_PURPOSES = ['All','Business','Education','Medical','Equipment','Agriculture','Personal']
const ALL_TIERS    = ['All','Platinum','Gold','Silver','Bronze']
const SORTS = [
  { label:'Closing Soon',   value:'daysLeft' },
  { label:'Most Funded',    value:'pct' },
  { label:'Highest Amount', value:'amount' },
  { label:'Lowest Rate',    value:'interestRate' },
]

const initials  = (n) => n?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'NA'
const formatINR = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
const formatShort = (n) => n>=100000?`\u20b9${(n/100000).toFixed(1)}L`:n>=1000?`\u20b9${(n/1000).toFixed(0)}k`:`\u20b9${n}`
const adaptLoan = (l) => ({
  id:l.id, borrowerName:l.borrowerName||l.borrower||'Borrower', tier:l.tier||'Silver',
  purpose:l.purpose||'Loan', city:l.city||'India', story:l.story||'',
  amount:l.amount, funded:l.fundedAmount??0, duration:l.duration||12,
  interestRate:l.apr||l.interestRate||12, lenders:l.lenderCount||l.lenders||0,
  daysLeft:l.daysRemaining??l.daysLeft??30, featured:l.featured??false,
  tags:l.tags||[], creditScore:l.creditScore||700, monthlyIncome:l.monthlyIncome||50000,
})

/* ════════════════════════
   LEFT SIDEBAR
════════════════════════ */
function LeftSidebar() {
  const navigate = useNavigate()
  const { isConnected, address, shortAddress, connect, connecting, userRole } = useWallet()

  const ini = address ? initials(shortAddress || 'WL') : 'KT'
  const displayName = isConnected ? shortAddress : 'Kartik Thakur'
  const bio = isConnected
    ? `Wallet: ${shortAddress}\nRole: ${userRole || 'Not set'} \u00b7 Ethereum`
    : 'CSE (AIML) \u201929 @ JSS Noida | Hackathon Winner \ud83c\udfc6 | Building on-chain credit'
  const verified = isConnected
  const viewers = isConnected ? 142 : 108
  const impressions = isConnected ? 47 : 30

  return (
    <aside style={{
      width:260, flexShrink:0,
      position:'sticky', top:72, maxHeight:'calc(100vh-80px)',
      display:'flex', flexDirection:'column', gap:12,
      fontFamily:'Inter, sans-serif',
    }}>
      {/* Profile card */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        {/* Banner */}
        <div style={{
          height:58,
          background: isConnected
            ? 'linear-gradient(135deg,#1f1d3d 0%,#4F46E5 60%,#c5b0f4 100%)'
            : 'linear-gradient(135deg,#dceeb1,#c8e6cd)',
        }} />
        <div style={{ padding:'0 18px 18px', marginTop:-28 }}>
          {/* Avatar circle */}
          <div style={{
            width:52, height:52, borderRadius:'50%',
            background: isConnected ? '#4F46E5' : '#e2e2e2',
            border:`3px solid ${C.surface}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:16, color: isConnected ? '#fff' : C.text,
            marginBottom:10, letterSpacing:'-0.02em',
          }}>{ini}</div>

          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontWeight:700, fontSize:'0.92rem', color:C.text }}>
              {isConnected ? 'Wallet Connected' : displayName}
            </span>
            {verified && (
              <svg width={14} height={14} fill="#1ea64a" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            )}
          </div>

          {isConnected ? (
            <>
              <p style={{ fontSize:11, color:C.textMuted, lineHeight:1.55, marginBottom:10, fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all' }}>
                {shortAddress}
              </p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#eeeeff', borderRadius:20, padding:'3px 10px', marginBottom:12 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#4F46E5' }} />
                <span style={{ fontSize:10, color:'#4F46E5', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  {userRole || 'Lender'}
                </span>
              </div>
            </>
          ) : null}

          {/* Stats */}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginBottom:4 }}>
            {[
              { label:'PROFILE VIEWERS',  value: viewers },
              { label:'POST IMPRESSIONS', value: impressions },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}>
                <span style={{ fontSize:9, color:C.textFaint, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'JetBrains Mono, monospace' }}>{label}</span>
                <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav links OR Login CTA */}
        {isConnected ? (
          <div style={{ borderTop:`1px solid ${C.border}`, padding:'10px 10px' }}>
            {[
              { emoji:'\ud83d\udcbc', label:'My Portfolio',   path:'/dashboard' },
              { emoji:'\ud83d\udcb0', label:'My Investments', path:'/dashboard' },
              { emoji:'\ud83d\udd12', label:'Verify Identity', path:'/verify'   },
              { emoji:'\ud83d\udc65', label:'My Circles',     path:'/circles'  },
            ].map(({ emoji, label, path }) => (
              <button key={label} onClick={() => navigate(path)} style={{
                display:'flex', alignItems:'center', gap:10, width:'100%',
                padding:'8px 10px', borderRadius:8, background:'none', border:'none',
                cursor:'pointer', fontSize:13, color:C.textMid, textAlign:'left',
                transition:'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#f0ede8';e.currentTarget.style.color=C.text}}
              onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=C.textMid}}
              >
                <span style={{fontSize:15}}>{emoji}</span> {label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 18px' }}>
            <p style={{ fontSize:11, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
              Connect your wallet to track investments, verify identity, and join credit circles.
            </p>
            <button
              onClick={connect}
              disabled={connecting}
              style={{
                width:'100%', padding:'10px', borderRadius:999,
                background: connecting ? '#888' : C.text, color:'#fff',
                fontWeight:700, fontSize:13, border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'opacity 0.2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
            {/* Quick nav even when not connected */}

          </div>
        )}
      </div>
    </aside>
  )
}

/* ════════════════════════
   LOAN CARD
════════════════════════ */
function LoanCard({ loan, onFund, fundedId }) {
  const navigate = useNavigate()
  const [liked,   setLiked]   = useState(false)
  const [likes,   setLikes]   = useState(Math.floor(Math.random() * 20) + 3)
  const [expanded, setExpanded] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const {
    id, borrowerName, tier='Silver', purpose='Personal',
    city='India', story='', amount=0, funded:fundedAmt=0,
    interestRate=12, lenders=0, daysLeft=30, featured=false,
    duration=12, tags=[], creditScore=700, monthlyIncome=50000,
  } = loan

  const pct       = Math.round((fundedAmt/amount)*100)
  const tierCfg   = TIER_CFG[tier]    || TIER_CFG.Silver
  const purCfg    = PURPOSE_CFG[purpose] || PURPOSE_CFG.Personal
  const av        = avatarColor(borrowerName)
  const ini       = initials(borrowerName)
  const emoji     = BORROWER_EMOJIS[borrowerName]
  const isUrgent  = daysLeft <= 7
  const justFunded = fundedId === id
  const barColor  = pct >= 75 ? C.success : pct >= 40 ? C.amber : C.danger
  const emi       = Math.round(amount * (1 + interestRate/100) / duration)
  const comments  = lenders + Math.floor(Math.random()*8) + 2

  return (
    <article style={{
      background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
      overflow:'hidden', fontFamily:'Inter, sans-serif',
      transition:'box-shadow 0.2s, border-color 0.2s',
    }}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor='#ccc'}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=C.border}}
    >

      {/* ─ Card header: avatar + name + badges ─ */}
      <div style={{ padding:'18px 20px 0', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Avatar — emoji if available, else styled initials */}
          <div style={{
            width:48, height:48, borderRadius:'50%', flexShrink:0,
            background:av.bg, border:`2px solid ${C.border}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: emoji ? '1.6rem' : '1rem', fontWeight:800, color:av.fg,
            boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden',
          }}>
            {emoji || ini}
          </div>

          <div>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:6, marginBottom:3 }}>
              <span style={{ fontWeight:700, fontSize:'0.98rem', color:C.text }}>{borrowerName}</span>
              {/* Tier badge */}
              <span style={{ fontSize:9, fontWeight:800, color:tierCfg.color, background:tierCfg.bg, padding:'2px 8px', borderRadius:4, letterSpacing:'0.06em' }}>
                {tierCfg.label}
              </span>
              {featured && (
                <span style={{ fontSize:9, fontWeight:800, color:'#fff', background:C.text, padding:'2px 8px', borderRadius:4, letterSpacing:'0.1em' }}>
                  FEATURED
                </span>
              )}
            </div>
            <div style={{ fontSize:12, color:C.textMuted }}>
              {city} &bull; {duration}M tenure
            </div>
          </div>
        </div>

        {/* Category label + save */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:800, color:purCfg.color, letterSpacing:'0.14em', textTransform:'uppercase' }}>
            {purCfg.label}
          </span>
          <button
            onClick={()=>{setSaved(s=>!s);setSaving(true);setTimeout(()=>setSaving(false),600)}}
            title="Save"
            style={{ background:'none', border:'none', cursor:'pointer', color: saved ? C.gold : C.textFaint, transition:'color 0.2s', padding:0 }}
          >
            <svg width={15} height={15} fill={saved?C.gold:'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ─ Story ─ */}
      <p style={{ margin:'14px 20px 0', fontSize:14, color:C.text, lineHeight:1.7, fontWeight:400 }}>
        {story}
      </p>

      {/* ─ Tags ─ */}
      {tags.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, margin:'10px 20px 0' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize:10, fontWeight:600, color:purCfg.color, background:purCfg.bg,
              padding:'3px 9px', borderRadius:20, letterSpacing:'0.04em',
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* ─ Loan details box ─ */}
      <div style={{ margin:'14px 20px', background:'#f7f6f4', border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px' }}>
        {/* Amount + Rate */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>LOAN AMOUNT</div>
            <div style={{ fontWeight:800, fontSize:'1.35rem', color:C.text, letterSpacing:'-0.03em', lineHeight:1 }}>{formatINR(amount)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>INTEREST RATE</div>
            <div style={{ fontWeight:800, fontSize:'1.35rem', color:C.gold, letterSpacing:'-0.03em', lineHeight:1 }}>{interestRate}% <span style={{ fontSize:11, fontWeight:400, color:C.textMuted }}>p.a.</span></div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:8, width:'100%', background:'#e0deda', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
          <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:barColor, borderRadius:4, transition:'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12 }}>
            <span style={{ fontWeight:700, color:barColor }}>{pct}% funded</span>
            <span style={{ color:C.textMuted }}> &bull; {formatShort(fundedAmt)} raised</span>
          </span>
          <span style={{ fontSize:12, fontWeight:600, color: isUrgent ? C.danger : C.textMuted, display:'flex', alignItems:'center', gap:3 }}>
            {isUrgent && <span>\u23f1</span>}{daysLeft}d left
          </span>
        </div>
      </div>

      {/* ─ Expanded details (toggle) ─ */}
      {expanded && (
        <div style={{ margin:'0 20px 14px', background:'#fafaf8', border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, animation:'fadeIn 0.25s ease' }}>
          {[
            { label:'CREDIT SCORE', value:creditScore, color: creditScore>=750?C.success:creditScore>=650?C.amber:C.danger },
            { label:'MONTHLY INCOME', value:formatShort(monthlyIncome), color:C.text },
            { label:'EMI / MONTH', value:formatShort(Math.round(amount*(1+interestRate/100)/duration)), color:C.text },
            { label:'LENDERS', value:lenders, color:C.text },
            { label:'TENURE', value:`${duration}M`, color:C.text },
            { label:'REMAINING', value:formatShort(amount-fundedAmt), color:C.amber },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:8, color:C.textFaint, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4, fontFamily:'JetBrains Mono, monospace' }}>{label}</div>
              <div style={{ fontWeight:800, fontSize:'1rem', color, letterSpacing:'-0.02em' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ─ Footer: social + fund ─ */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'11px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Social actions */}
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          {/* Like */}
          <button onClick={()=>{setLiked(l=>!l);setLikes(n=>liked?n-1:n+1)}}
            style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:liked?'#e11d48':C.textMuted, fontSize:13, transition:'color 0.15s', padding:0 }}>
            <svg width={16} height={16} fill={liked?'#e11d48':'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Like {likes > 0 && likes}</span>
          </button>

          {/* Comments = lenders */}
          <button onClick={()=>navigate(`/loan/${id}`)}
            style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13, padding:0 }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>{comments}</span>
          </button>

          {/* Share */}
          <button style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13, padding:0 }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>

          {/* Show more details toggle */}
          <button onClick={()=>setExpanded(e=>!e)}
            style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color: expanded ? C.text : C.textMuted, fontSize:12, padding:0, fontWeight: expanded ? 600 : 400 }}>
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>

        {/* Fund button */}
        <button onClick={(e)=>{e.stopPropagation();onFund?.(id,5000)}}
          style={{
            background: justFunded ? C.success : C.text,
            color:'#fff', border:'none', borderRadius:999,
            padding:'10px 28px', fontSize:14, fontWeight:700,
            cursor:'pointer', transition:'all 0.18s', letterSpacing:'0.01em',
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >
          {justFunded ? '\u2713 Funded' : 'Fund'}
        </button>
      </div>
    </article>
  )
}

/* ════════════════════════
   SKELETON
════════════════════════ */
const Skeleton = () => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, display:'flex', flexDirection:'column', gap:14 }}>
    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
      <div style={{ width:48, height:48, borderRadius:'50%', background:'#eeece8', animation:'pulse 1.6s ease-in-out infinite' }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ height:13, background:'#eeece8', borderRadius:4, width:'55%', animation:'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height:11, background:'#eeece8', borderRadius:4, width:'35%', animation:'pulse 1.6s ease-in-out infinite', animationDelay:'100ms' }} />
      </div>
    </div>
    {[100,80,60].map((w,i) => (
      <div key={i} style={{ height:12, background:'#eeece8', borderRadius:4, width:`${w}%`, animation:'pulse 1.6s ease-in-out infinite', animationDelay:`${i*80}ms` }} />
    ))}
    <div style={{ height:72, background:'#f5f4f1', borderRadius:10, animation:'pulse 1.6s ease-in-out infinite', animationDelay:'200ms' }} />
  </div>
)

/* ════════════════════════
   MAIN EXPORT
════════════════════════ */
export default function Feed() {
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
    ;(async () => {
      setLoading(true)
      try {
        const data = await getMarketplaceFeed()
        if (Array.isArray(data) && data.length > 0) { setLoans(data.map(adaptLoan)); setApiError('') }
      } catch (err) { setApiError(err.message) }
      finally { setLoading(false) }
    })()
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
      if (sort === 'pct')          return (b.funded/b.amount)-(a.funded/a.amount)
      if (sort === 'amount')       return b.amount-a.amount
      if (sort === 'interestRate') return a.interestRate-b.interestRate
      return a.daysLeft-b.daysLeft
    })

  const totalDeployed  = loans.reduce((s,l)=>s+(l.funded||0),0)
  const avgReturn      = (loans.reduce((s,l)=>s+l.interestRate,0)/loans.length).toFixed(1)
  const activeLenders  = loans.reduce((s,l)=>s+l.lenders,0)

  return (
    <>
      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:none;} }
        @keyframes fadeIn  { from{opacity:0;} to{opacity:1;} }
        .pill-btn { transition:background 0.14s,color 0.14s; }
        .pill-btn:hover { background:#eeeeee !important; }
        @media(max-width:820px){ .feed-sidebar{display:none!important} }
      `}</style>

      <div style={{ minHeight:'100vh', background:C.bg, fontFamily:'Inter, sans-serif' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 0' }}>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:16, paddingBottom:24 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, color:C.textFaint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
                  <span>VEILFI</span><span>/</span><span style={{ color:C.text, fontWeight:600 }}>MARKETPLACE</span>
                </div>
                <h1 style={{ fontWeight:700, fontSize:'clamp(1.5rem,3vw,1.9rem)', color:C.text, letterSpacing:'-0.03em', margin:'0 0 6px', lineHeight:1.1 }}>
                  Credit <span style={{ fontWeight:400, color:C.textMuted }}>Marketplace</span>
                </h1>
                <p style={{ fontSize:13, color:C.textMid, maxWidth:380, lineHeight:1.6, margin:0 }}>
                  Peer-to-peer lending for verified borrowers. Deploy capital, earn transparent returns.
                </p>
                {apiError && (
                  <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, fontSize:10, color:'#b86000', background:'#fff8f0', border:'1px solid rgba(255,180,80,0.4)', borderRadius:20, padding:'3px 10px', fontFamily:'JetBrains Mono, monospace', fontStyle:'italic', letterSpacing:'0.06em' }}>
                    DEMO NODE \u2014 BACKEND OFFLINE
                  </div>
                )}
              </div>
              {/* Stats panel */}
              <div style={{ display:'flex', border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                {[
                  { label:'CAPITAL DEPLOYED', value:formatShort(totalDeployed), color:C.text    },
                  { label:'AVG. RETURN',       value:`${avgReturn}%`,           color:C.success },
                  { label:'ACTIVE LENDERS',    value:`${activeLenders}`,        color:C.text    },
                  { label:'OPEN LISTINGS',     value:`${loans.length}`,         color:C.magenta },
                ].map((s,i) => (
                  <div key={s.label} style={{ padding:'12px 18px', textAlign:'center', borderLeft:i>0?`1px solid ${C.border}`:'none', minWidth:82 }}>
                    <div style={{ fontWeight:800, fontSize:'1rem', color:s.color, letterSpacing:'-0.03em', lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:8, color:C.textFaint, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', marginTop:5, fontFamily:'JetBrains Mono, monospace' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter bar */}
            <div style={{ borderTop:`1px solid ${C.border}`, padding:'8px 0', display:'flex', flexWrap:'wrap', alignItems:'center', gap:10 }}>
              {/* Search */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke={C.textFaint} strokeWidth={2} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search borrowers..." value={search}
                  onChange={e=>setSearch(e.target.value)}
                  onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)}
                  style={{ width:175, padding:'6px 10px 6px 26px', border:`1px solid ${searchFocused?'#aaa':C.border}`, borderRadius:8, background:C.surface, fontSize:12, color:C.text, outline:'none', fontFamily:'inherit' }}
                />
              </div>
              {ALL_PURPOSES.map(p => (
                <button key={p} onClick={()=>setPurpose(p)} className="pill-btn"
                  style={{ padding:'5px 13px', border:'none', borderRadius:999, background:purposeFilter===p?C.text:'transparent', color:purposeFilter===p?'#fff':C.textMuted, fontSize:12, fontWeight:purposeFilter===p?700:400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
                  {p}
                </button>
              ))}
              <div style={{ width:1, height:18, background:C.border, flexShrink:0 }} />
              {ALL_TIERS.map(t => (
                <button key={t} onClick={()=>setTier(t)} className="pill-btn"
                  style={{ padding:'5px 13px', border:'none', borderRadius:999, background:tierFilter===t?C.text:'transparent', color:tierFilter===t?'#fff':C.textMuted, fontSize:12, fontWeight:tierFilter===t?700:400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>
                  {tierFilter===t && <span style={{ width:5, height:5, borderRadius:'50%', background:'#fff' }}/>}{t}
                </button>
              ))}
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <span style={{ fontSize:10, color:C.textFaint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.1em', textTransform:'uppercase' }}>{filtered.length} RESULTS</span>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{ border:'none', background:'transparent', fontSize:12, color:C.textMid, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                  {SORTS.map(({ label,value }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'20px 24px 80px', display:'flex', gap:20, alignItems:'flex-start' }}>
          {/* Sidebar */}
          <div className="feed-sidebar"><LeftSidebar /></div>

          {/* Feed */}
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:14 }}>
            {loading
              ? Array.from({length:3}).map((_,i) => <Skeleton key={i} />)
              : filtered.length === 0
              ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'60px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>\ud83d\udd0d</div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>No results found</div>
                  <div style={{ fontSize:13, color:C.textMuted }}>Adjust your filters to find matching loans</div>
                </div>
              )
              : filtered.map((loan,i) => (
                <div key={loan.id} style={{ opacity:0, animation:`cardIn 0.42s cubic-bezier(0.16,1,0.3,1) ${i*55}ms both` }}>
                  <LoanCard loan={loan} onFund={handleFund} fundedId={fundedId} />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Fund toast */}
      {fundedId && (
        <div style={{ position:'fixed', bottom:28, right:28, zIndex:9999, background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.success}`, borderRadius:12, padding:'14px 20px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:12, maxWidth:280, fontFamily:'inherit' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', color:C.success, fontWeight:700 }}>\u2713</div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Funding submitted</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Transaction sent to Ethereum Sepolia</div>
          </div>
        </div>
      )}
    </>
  )
}
