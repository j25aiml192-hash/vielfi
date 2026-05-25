import { useState, useEffect } from 'react'
import { getMarketplaceFeed, fundLoan } from '../api/index.js'
import { useNavigate } from 'react-router-dom'


/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   DESIGN TOKENS ΓÇö Mutual colour system
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const C = {
  bg:      '#f4f2ef',
  surface: '#ffffff',
  border:  '#e0ddd8',
  text:    '#1a1a1a',
  mid:     '#555555',
  muted:   '#888888',
  faint:   '#bbbbbb',
  gold:    '#b58c2a',
  green:   '#1ea64a',
  red:     '#dc2626',
  amber:   '#d97706',
  blue:    '#2563eb',
  purple:  '#7c3aed',
  pink:    '#db2777',
  magenta: '#ff3d8b',
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   BORROWER PROFILES ΓÇö real photos + data
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const PROFILES = {
  'Farida Shaikh':  { photo:'https://randomuser.me/api/portraits/women/44.jpg', gender:'F', job:'Senior Software Engineer, TCS', age:34, rating:4.9 },
  'Meera Pillai':   { photo:'https://randomuser.me/api/portraits/women/47.jpg', gender:'F', job:'HR Manager, Cognizant',          age:31, rating:4.7 },
  'Arun Kumar':     { photo:'https://randomuser.me/api/portraits/men/43.jpg',   gender:'M', job:'Grape Farmer, Nashik',           age:48, rating:4.6 },
  'Rahul Sharma':   { photo:'https://randomuser.me/api/portraits/men/41.jpg',   gender:'M', job:'Street Food Entrepreneur',       age:29, rating:4.8 },
  'Priya Nair':     { photo:'https://randomuser.me/api/portraits/women/48.jpg', gender:'F', job:'Freelance UX/UI Designer',       age:27, rating:5.0 },
  'Anita Meena':    { photo:'https://randomuser.me/api/portraits/women/45.jpg', gender:'F', job:'Kirana Store Owner',             age:38, rating:4.5 },
  'Vikram Singh':   { photo:'https://randomuser.me/api/portraits/men/32.jpg',   gender:'M', job:'Auto-Rickshaw Driver',           age:36, rating:4.3 },
  'Suresh Yadav':   { photo:'https://randomuser.me/api/portraits/men/33.jpg',   gender:'M', job:'Government Employee, MSEB',      age:41, rating:4.4 },
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   CATEGORY CONFIG
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const CAT = {
  Medical:     { color:'#059669', bg:'#ecfdf5', dark:'#047857', icon:'≡ƒÅÑ' },
  Education:   { color:'#4338ca', bg:'#eef2ff', dark:'#3730a3', icon:'≡ƒÄô' },
  Business:    { color:'#d97706', bg:'#fffbeb', dark:'#b45309', icon:'≡ƒÆ╝' },
  Agriculture: { color:'#65a30d', bg:'#f7fee7', dark:'#4d7c0f', icon:'≡ƒî╛' },
  Equipment:   { color:'#0284c7', bg:'#f0f9ff', dark:'#0369a1', icon:'ΓÜÖ∩╕Å' },
  Personal:    { color:'#7c3aed', bg:'#f5f3ff', dark:'#6d28d9', icon:'≡ƒæñ' },
}

const TIER = {
  Platinum: { color:'#4338ca', bg:'#eef2ff', border:'#c7d2fe', label:'PLATINUM' },
  Gold:     { color:'#92400e', bg:'#fef3c7', border:'#fcd34d', label:'GOLD'     },
  Silver:   { color:'#374151', bg:'#f3f4f6', border:'#d1d5db', label:'SILVER'   },
  Bronze:   { color:'#7c2d12', bg:'#fff7ed', border:'#fed7aa', label:'BRONZE'   },
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   MOCK DATA
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const MOCK_LOANS = [
  { id:'7',  borrowerName:'Farida Shaikh', tier:'Platinum', purpose:'Medical',
    city:'Hyderabad', featured:true, postedAgo:'2 hours ago',
    story:'Bridge financing for elective surgery ΓÇö insurance covers 70%, gap is \u20b984,000. 8-year employment at TCS, zero defaults, high repayment capacity.',
    amount:280000, funded:256000, duration:12, interestRate:9.5, lenders:18, daysLeft:3,
    tags:['ZK-Verified','Low Risk'], creditScore:851, monthlyIncome:120000, repaymentHistory:100 },
  { id:'5',  borrowerName:'Meera Pillai',  tier:'Gold', purpose:'Education',
    city:'Chennai', featured:false, postedAgo:'5 hours ago',
    story:'Online MBA, NMIMS. Currently earning \u20b985,000/mo in a stable corporate role. 24-month repayment plan fully mapped to current surplus income.',
    amount:500000, funded:450000, duration:24, interestRate:10, lenders:21, daysLeft:7,
    tags:['Salaried','GST-Filed'], creditScore:762, monthlyIncome:85000, repaymentHistory:98 },
  { id:'8',  borrowerName:'Arun Kumar',    tier:'Gold', purpose:'Agriculture',
    city:'Nashik', featured:false, postedAgo:'1 day ago',
    story:'Drip irrigation system for 5-acre grape vineyard. ROI expected within 2 harvests based on historical yield data. Verified land ownership.',
    amount:180000, funded:90000, duration:12, interestRate:11, lenders:9, daysLeft:20,
    tags:['Land-Verified','Agri-Loan'], creditScore:681, monthlyIncome:55000, repaymentHistory:94 },
  { id:'1',  borrowerName:'Rahul Sharma',  tier:'Gold', purpose:'Business',
    city:'New Delhi', featured:false, postedAgo:'3 hours ago',
    story:'Expanding street food operation with a second cart and industrial equipment. Consistent \u20b92.1L/mo UPI volume for 24 consecutive months.',
    amount:200000, funded:154000, duration:12, interestRate:11, lenders:8, daysLeft:5,
    tags:['UPI-Verified','GST-Filed'], creditScore:734, monthlyIncome:210000, repaymentHistory:100 },
  { id:'2',  borrowerName:'Priya Nair',    tier:'Platinum', purpose:'Equipment',
    city:'Bengaluru', featured:false, postedAgo:'6 hours ago',
    story:'Upgrading professional design studio ΓÇö MacBook Pro M3 and Wacom Cintiq. International clientele, 4 years unblemished repayment record.',
    amount:350000, funded:318000, duration:18, interestRate:9, lenders:14, daysLeft:12,
    tags:['ZK-Verified','Freelancer'], creditScore:851, monthlyIncome:350000, repaymentHistory:100 },
  { id:'3',  borrowerName:'Anita Meena',   tier:'Silver', purpose:'Business',
    city:'Jaipur', featured:false, postedAgo:'2 days ago',
    story:'Pre-Diwali inventory build for a GST-registered kirana store operating continuously for 6 years. Seasonal demand consistently 3x baseline.',
    amount:150000, funded:67500, duration:6, interestRate:13, lenders:4, daysLeft:18,
    tags:['GST-Registered','SME'], creditScore:628, monthlyIncome:65000, repaymentHistory:91 },
  { id:'4',  borrowerName:'Vikram Singh',  tier:'Bronze', purpose:'Personal',
    city:'Mumbai', featured:false, postedAgo:'4 days ago',
    story:'Engine replacement for auto-rickshaw. 8,400+ verified trips on Ola and Uber with 4.8 average rating. 6-month repayment horizon.',
    amount:80000, funded:24000, duration:6, interestRate:15, lenders:2, daysLeft:22,
    tags:['Gig-Worker','UPI-Verified'], creditScore:558, monthlyIncome:42000, repaymentHistory:85 },
  { id:'6',  borrowerName:'Suresh Yadav',  tier:'Silver', purpose:'Personal',
    city:'Pune', featured:false, postedAgo:'3 days ago',
    story:'Kitchen and bathroom renovation. Landlord agreed to \u20b92,000/mo rent reduction post-completion, effectively self-financing.',
    amount:120000, funded:36000, duration:9, interestRate:12, lenders:3, daysLeft:30,
    tags:['Salaried','Rental-History'], creditScore:645, monthlyIncome:78000, repaymentHistory:96 },
]

const ALL_PURPOSES = ['All','Business','Education','Medical','Equipment','Agriculture','Personal']
const ALL_TIERS    = ['All','Platinum','Gold','Silver','Bronze']
const SORTS = [
  { label:'Closing Soon',   value:'daysLeft' },
  { label:'Most Funded',    value:'pct'      },
  { label:'Highest Amount', value:'amount'   },
  { label:'Lowest Rate',    value:'interestRate' },
]

const fmtINR   = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
const fmtShort = (n) => n>=100000?`\u20b9${(n/100000).toFixed(1)}L`:n>=1000?`\u20b9${(n/1000).toFixed(0)}k`:`\u20b9${n}`
const adaptLoan = (l) => ({
  id:l.id, borrowerName:l.borrowerName||l.borrower||'Borrower',
  tier:l.tier||'Silver', purpose:l.purpose||'Loan',
  city:l.city||'India', story:l.story||'',
  amount:l.amount, funded:l.fundedAmount??0, duration:l.duration||12,
  interestRate:l.apr||l.interestRate||12, lenders:l.lenderCount||l.lenders||0,
  daysLeft:l.daysRemaining??l.daysLeft??30, featured:l.featured??false,
  tags:l.tags||[], creditScore:l.creditScore||700,
  monthlyIncome:l.monthlyIncome||50000, repaymentHistory:l.repaymentHistory||95,
  postedAgo:'Recently',
})

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   CREDIT SCORE METER
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
function ScoreMeter({ score }) {
  const pct = ((score - 300) / (900 - 300)) * 100
  const col = score >= 750 ? C.green : score >= 650 ? C.amber : C.red
  const label = score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 650 ? 'Fair' : score >= 600 ? 'Low' : 'Poor'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:5, background:'#e8e6e2', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:3 }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:col, minWidth:56, textAlign:'right' }}>
        {score} <span style={{ fontWeight:400, color:C.muted, fontSize:10 }}>{label}</span>
      </span>
    </div>
  )
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   LOAN CARD
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
function LoanCard({ loan, onFund, fundedId }) {
  const navigate = useNavigate()
  const [liked,    setLiked]    = useState(false)
  const [likes,    setLikes]    = useState(Math.floor(Math.random() * 20) + 4)
  const [saved,    setSaved]    = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [imgErr,   setImgErr]   = useState(false)

  const {
    id, borrowerName, tier='Silver', purpose='Personal',
    city='India', story='', amount=0, funded:fundedAmt=0,
    interestRate=12, lenders=0, daysLeft=30, featured=false,
    duration=12, tags=[], creditScore=700, monthlyIncome=50000,
    repaymentHistory=95, postedAgo='Recently',
  } = loan

  const profile   = PROFILES[borrowerName] || {}
  const cat       = CAT[purpose]  || CAT.Personal
  const tierCfg   = TIER[tier]    || TIER.Silver
  const pct       = Math.round((fundedAmt / amount) * 100)
  const barColor  = pct >= 75 ? C.green : pct >= 40 ? C.amber : C.red
  const isUrgent  = daysLeft <= 7
  const justFunded = fundedId === id
  const emi       = Math.round(amount * (1 + interestRate / 100) / duration)
  const comments  = lenders + Math.floor(Math.random() * 10) + 2
  const initials  = borrowerName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <article style={{
      background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
      overflow:'hidden', fontFamily:'Inter, sans-serif',
      transition:'box-shadow 0.2s, border-color 0.2s',
    }}
    onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.10)'; e.currentTarget.style.borderColor='#c8c5c0' }}
    onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=C.border }}
    >

      {/* ΓöÇΓöÇ Category accent stripe ΓöÇΓöÇ */}
      <div style={{ height:4, background:cat.color, width:'100%' }} />

      {/* ΓöÇΓöÇ Card header ΓöÇΓöÇ */}
      <div style={{ padding:'16px 20px 0', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        {/* Left: photo + name */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Real photo avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            {profile.photo && !imgErr ? (
              <img
                src={profile.photo} alt={borrowerName}
                onError={() => setImgErr(true)}
                style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:`2px solid ${cat.color}30`, display:'block' }}
              />
            ) : (
              <div style={{
                width:52, height:52, borderRadius:'50%',
                background:cat.bg, border:`2px solid ${cat.color}30`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:16, color:cat.color,
              }}>{initials}</div>
            )}
            {/* Online indicator */}
            <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:C.green, border:`2px solid ${C.surface}` }} />
          </div>

          <div>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:6, marginBottom:2 }}>
              <span style={{ fontWeight:700, fontSize:'0.97rem', color:C.text }}>{borrowerName}</span>
              <span style={{ fontSize:9, fontWeight:800, color:tierCfg.color, background:tierCfg.bg, border:`1px solid ${tierCfg.border}`, padding:'2px 7px', borderRadius:5, letterSpacing:'0.06em' }}>
                {tierCfg.label}
              </span>
              {featured && (
                <span style={{ fontSize:9, fontWeight:800, color:'#fff', background:C.text, padding:'2px 8px', borderRadius:5, letterSpacing:'0.1em' }}>
                  FEATURED
                </span>
              )}
            </div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:1 }}>
              {profile.job || `${city} Borrower`}
            </div>
            <div style={{ fontSize:11, color:C.faint, display:'flex', alignItems:'center', gap:6 }}>
              <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {city} &bull; {duration}M tenure &bull; {postedAgo}
            </div>
          </div>
        </div>

        {/* Right: category + save */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:cat.bg, borderRadius:20, padding:'4px 10px' }}>
            <span style={{ fontSize:12 }}>{cat.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, color:cat.color, letterSpacing:'0.1em', textTransform:'uppercase' }}>{purpose}</span>
          </div>
          <button
            onClick={()=>setSaved(s=>!s)}
            title={saved ? 'Unsave' : 'Save'}
            style={{ background:'none', border:'none', cursor:'pointer', color:saved?C.gold:C.faint, transition:'color 0.2s', padding:2 }}
          >
            <svg width={16} height={16} fill={saved?C.gold:'none'} viewBox="0 0 24 24" stroke={saved?C.gold:'currentColor'} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ΓöÇΓöÇ Rating + trust signals ΓöÇΓöÇ */}
      <div style={{ padding:'10px 20px 0', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        {/* Star rating */}
        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width={11} height={11} viewBox="0 0 24 24" fill={s <= Math.floor(profile.rating||4.5) ? '#f59e0b' : '#e5e7eb'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
          <span style={{ fontSize:11, color:C.muted, marginLeft:2 }}>{profile.rating || 4.5}</span>
        </div>
        {/* Repayment history */}
        <div style={{ display:'flex', alignItems:'center', gap:4, background:'#f0fdf4', borderRadius:20, padding:'2px 8px' }}>
          <svg width={10} height={10} fill={C.green} viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span style={{ fontSize:10, fontWeight:600, color:C.green }}>{repaymentHistory}% repayment</span>
        </div>
        {/* Viewers */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke={C.faint} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span style={{ fontSize:10, color:C.faint }}>{Math.floor(Math.random()*80)+20} viewing</span>
        </div>
      </div>

      {/* ΓöÇΓöÇ Story ΓöÇΓöÇ */}
      <p style={{ margin:'12px 20px 0', fontSize:14, color:C.text, lineHeight:1.7, fontWeight:400 }}>
        {story}
      </p>

      {/* ΓöÇΓöÇ Tags ΓöÇΓöÇ */}
      {tags.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, margin:'10px 20px 0' }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontSize:10, fontWeight:600, color:cat.dark, background:cat.bg, border:`1px solid ${cat.color}30`, padding:'3px 10px', borderRadius:20 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ΓöÇΓöÇ Loan details box ΓöÇΓöÇ */}
      <div style={{ margin:'14px 20px', background:'#f8f7f5', border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
        {/* Amount + Rate header */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
          <div style={{ padding:'14px 16px', borderRight:`1px solid ${C.border}` }}>
            <div style={{ fontSize:9, color:C.faint, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4, fontFamily:'JetBrains Mono, monospace' }}>LOAN AMOUNT</div>
            <div style={{ fontWeight:800, fontSize:'1.4rem', color:C.text, letterSpacing:'-0.03em', lineHeight:1 }}>{fmtINR(amount)}</div>
          </div>
          <div style={{ padding:'14px 16px', textAlign:'right' }}>
            <div style={{ fontSize:9, color:C.faint, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4, fontFamily:'JetBrains Mono, monospace' }}>INTEREST RATE</div>
            <div style={{ fontWeight:800, fontSize:'1.4rem', color:C.gold, letterSpacing:'-0.03em', lineHeight:1 }}>{interestRate}% <span style={{ fontSize:11, fontWeight:400, color:C.muted }}>p.a.</span></div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ padding:'10px 16px 14px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ height:8, width:'100%', background:'#e0ddd8', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
            <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:barColor, borderRadius:4, transition:'width 1.2s ease' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12 }}>
              <span style={{ fontWeight:700, color:barColor }}>{pct}% funded</span>
              <span style={{ color:C.muted }}> &bull; {fmtShort(fundedAmt)} raised</span>
            </span>
            <span style={{ fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:4, color: isUrgent ? C.red : C.muted }}>
              {isUrgent && (
                <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              )}
              {daysLeft}d left
            </span>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderTop:`1px solid ${C.border}` }}>
          {[
            { label:'EMI / MONTH', value:fmtShort(emi), color:C.text },
            { label:'FUNDED BY',   value:`${lenders} lenders`, color:C.blue },
            { label:'CLOSES IN',   value:`${daysLeft} days`,   color: isUrgent ? C.red : C.text },
          ].map((s,i) => (
            <div key={s.label} style={{ padding:'10px 12px', textAlign:'center', borderLeft: i>0?`1px solid ${C.border}`:'none' }}>
              <div style={{ fontSize:9, color:C.faint, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:3, fontFamily:'JetBrains Mono, monospace' }}>{s.label}</div>
              <div style={{ fontWeight:700, fontSize:13, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ΓöÇΓöÇ Expanded details ΓöÇΓöÇ */}
      {expanded && (
        <div style={{ margin:'0 20px 14px', background:'#faf9f7', border:`1px solid ${C.border}`, borderRadius:12, padding:'16px', animation:'fadeIn 0.22s ease' }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12, fontFamily:'JetBrains Mono, monospace' }}>
            BORROWER DETAILS
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              <div style={{ fontSize:10, color:C.faint, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, fontFamily:'JetBrains Mono, monospace' }}>CREDIT SCORE</div>
              <ScoreMeter score={creditScore} />
            </div>
            <div>
              <div style={{ fontSize:10, color:C.faint, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, fontFamily:'JetBrains Mono, monospace' }}>REPAYMENT HISTORY</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ flex:1, height:5, background:'#e8e6e2', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${repaymentHistory}%`, background:repaymentHistory>=95?C.green:repaymentHistory>=85?C.amber:C.red, borderRadius:3 }} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:repaymentHistory>=95?C.green:repaymentHistory>=85?C.amber:C.red }}>{repaymentHistory}%</span>
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginTop:14 }}>
            {[
              { label:'MONTHLY INCOME', value:fmtShort(monthlyIncome),  color:C.green },
              { label:'LOAN / INCOME',  value:`${Math.round(amount/monthlyIncome)}x`, color:C.amber },
              { label:'REMAINING',      value:fmtShort(amount-fundedAmt), color:C.blue  },
              { label:'TOTAL RETURN',   value:fmtShort(Math.round(amount*interestRate/100)), color:C.gold },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign:'center', background:C.surface, borderRadius:8, padding:'10px 6px', border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:8, color:C.faint, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:5, fontFamily:'JetBrains Mono, monospace' }}>{label}</div>
                <div style={{ fontWeight:800, fontSize:'1rem', color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ΓöÇΓöÇ Footer: social + fund ΓöÇΓöÇ */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>

          {/* Like */}
          <button onClick={()=>{ setLiked(l=>!l); setLikes(n=>liked?n-1:n+1) }}
            style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:liked?C.pink:C.muted, fontSize:13, transition:'color 0.15s', padding:0 }}>
            <svg width={17} height={17} fill={liked?C.pink:'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Like {likes}</span>
          </button>

          {/* Comment */}
          <button onClick={()=>navigate(`/loan/${id}`)}
            style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, padding:0 }}>
            <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>{comments}</span>
          </button>

          {/* Share */}
          <button style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, padding:0 }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>

          {/* Details toggle */}
          <button onClick={()=>setExpanded(e=>!e)}
            style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color: expanded ? C.text : C.muted, fontSize:12, padding:0, fontWeight: expanded ? 600 : 400, transition:'color 0.15s' }}>
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} style={{ transform: expanded?'rotate(180deg)':'none', transition:'transform 0.2s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>

        {/* Fund button */}
        <button
          onClick={(e)=>{ e.stopPropagation(); onFund?.(id, 5000) }}
          style={{
            background: justFunded ? C.green : C.text,
            color:'#fff', border:'none', borderRadius:999,
            padding:'10px 30px', fontSize:14, fontWeight:700,
            cursor:'pointer', transition:'all 0.18s',
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

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   LEFT SIDEBAR
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   SKELETON
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const Skeleton = () => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
    <div style={{ height:4, background:'#e8e6e2' }} />
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:12 }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:'#eeece8', animation:'pulse 1.6s ease-in-out infinite', flexShrink:0 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ height:13, background:'#eeece8', borderRadius:4, width:'55%', animation:'pulse 1.6s ease-in-out infinite' }} />
          <div style={{ height:10, background:'#eeece8', borderRadius:4, width:'40%', animation:'pulse 1.6s ease-in-out infinite', animationDelay:'80ms' }} />
        </div>
      </div>
      {[100,85,65].map((w,i)=>(
        <div key={i} style={{ height:12, background:'#eeece8', borderRadius:4, width:`${w}%`, animation:'pulse 1.6s ease-in-out infinite', animationDelay:`${i*80}ms` }} />
      ))}
      <div style={{ height:80, background:'#f5f4f1', borderRadius:10, animation:'pulse 1.6s ease-in-out infinite' }} />
    </div>
  </div>
)

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   MAIN
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
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

  useEffect(()=>{ const p=document.body.style.background; document.body.style.background=C.bg; return()=>{document.body.style.background=p} },[])

  useEffect(()=>{
    ;(async()=>{
      setLoading(true)
      try{ const d=await getMarketplaceFeed(); if(Array.isArray(d)&&d.length>0){setLoans(d.map(adaptLoan));setApiError('')} }
      catch(e){ setApiError(e.message) }
      finally{ setLoading(false) }
    })()
  },[])

  const handleFund = async(id,amt)=>{ try{await fundLoan(id,amt)}catch{} ; setFundedId(id); setTimeout(()=>setFundedId(null),3000) }

  const filtered = loans.filter(l=>{
    if(tierFilter!=='All'&&l.tier!==tierFilter) return false
    if(purposeFilter!=='All'&&l.purpose!==purposeFilter) return false
    if(search&&!l.borrowerName.toLowerCase().includes(search.toLowerCase())&&!l.story.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b)=>{
    if(sort==='pct')          return (b.funded/b.amount)-(a.funded/a.amount)
    if(sort==='amount')       return b.amount-a.amount
    if(sort==='interestRate') return a.interestRate-b.interestRate
    return a.daysLeft-b.daysLeft
  })

  const totalDeployed = loans.reduce((s,l)=>s+(l.funded||0),0)
  const avgReturn     = (loans.reduce((s,l)=>s+l.interestRate,0)/loans.length).toFixed(1)
  const activeLenders = loans.reduce((s,l)=>s+l.lenders,0)

  return (
    <>
      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1}50%{opacity:.4} }
        @keyframes cardIn { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        .pfil { transition:background .14s,color .14s; }
        .pfil:hover { background:#e8e6e2 !important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:C.bg, fontFamily:'Inter, sans-serif' }}>

        {/* PAGE HEADER */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 0' }}>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:16, paddingBottom:24 }}>
              <div>
                <div style={{ fontSize:10, color:C.faint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8, display:'flex', gap:6 }}>
                  <span>VEILFI</span><span>/</span><span style={{ color:C.text, fontWeight:600 }}>MARKETPLACE</span>
                </div>
                <h1 style={{ fontWeight:700, fontSize:'clamp(1.5rem,3vw,2rem)', color:C.text, letterSpacing:'-0.03em', margin:'0 0 6px', lineHeight:1.1 }}>
                  Credit <span style={{ fontWeight:400, color:C.muted }}>Marketplace</span>
                </h1>
                <p style={{ fontSize:13, color:C.mid, maxWidth:380, lineHeight:1.6, margin:0 }}>
                  Peer-to-peer lending for verified borrowers. Deploy capital, earn transparent returns.
                </p>
                {apiError && (
                  <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, fontSize:10, color:'#b45309', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:20, padding:'3px 10px', fontFamily:'JetBrains Mono, monospace', fontStyle:'italic' }}>
                    DEMO NODE \u2014 BACKEND OFFLINE
                  </div>
                )}
              </div>
              <div style={{ display:'flex', border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
                {[
                  { label:'CAPITAL DEPLOYED', value:fmtShort(totalDeployed),   color:C.text    },
                  { label:'AVG. RETURN',       value:`${avgReturn}%`,           color:C.green   },
                  { label:'ACTIVE LENDERS',    value:`${activeLenders}`,        color:C.text    },
                  { label:'OPEN LISTINGS',     value:`${loans.length}`,         color:C.magenta },
                ].map((s,i)=>(
                  <div key={s.label} style={{ padding:'12px 18px', textAlign:'center', borderLeft:i>0?`1px solid ${C.border}`:'none', minWidth:84 }}>
                    <div style={{ fontWeight:800, fontSize:'1rem', color:s.color, letterSpacing:'-0.02em' }}>{s.value}</div>
                    <div style={{ fontSize:8, color:C.faint, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginTop:4, fontFamily:'JetBrains Mono, monospace' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter bar */}
            <div style={{ borderTop:`1px solid ${C.border}`, padding:'8px 0', display:'flex', flexWrap:'wrap', alignItems:'center', gap:8 }}>
              <div style={{ position:'relative' }}>
                <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke={C.faint} strokeWidth={2} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search borrowers..." value={search}
                  onChange={e=>setSearch(e.target.value)}
                  onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)}
                  style={{ width:170, padding:'6px 10px 6px 26px', border:`1px solid ${searchFocused?'#999':C.border}`, borderRadius:8, background:C.surface, fontSize:12, color:C.text, outline:'none', fontFamily:'inherit' }}
                />
              </div>
              {ALL_PURPOSES.map(p=>(
                <button key={p} onClick={()=>setPurpose(p)} className="pfil"
                  style={{ padding:'5px 13px', border:'none', borderRadius:999, background:purposeFilter===p?C.text:'transparent', color:purposeFilter===p?'#fff':C.muted, fontSize:12, fontWeight:purposeFilter===p?700:400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
                  {p}
                </button>
              ))}
              <div style={{ width:1, height:18, background:C.border }} />
              {ALL_TIERS.map(t=>(
                <button key={t} onClick={()=>setTier(t)} className="pfil"
                  style={{ padding:'5px 13px', border:'none', borderRadius:999, background:tierFilter===t?C.text:'transparent', color:tierFilter===t?'#fff':C.muted, fontSize:12, fontWeight:tierFilter===t?700:400, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                  {tierFilter===t&&<span style={{ width:5, height:5, borderRadius:'50%', background:'#fff' }}/>}{t}
                </button>
              ))}
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:10, color:C.faint, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.1em', textTransform:'uppercase' }}>{filtered.length} RESULTS</span>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{ border:'none', background:'transparent', fontSize:12, color:C.mid, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                  {SORTS.map(({label,value})=><option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 24px 80px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {loading
              ? Array.from({length:3}).map((_,i)=><Skeleton key={i}/>)
              : filtered.length===0
              ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'60px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>≡ƒöì</div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>No results found</div>
                  <div style={{ fontSize:13, color:C.muted }}>Adjust your filters to find matching loans</div>
                </div>
              )
              : filtered.map((loan,i)=>(
                <div key={loan.id} style={{ opacity:0, animation:`cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i*50}ms both` }}>
                  <LoanCard loan={loan} onFund={handleFund} fundedId={fundedId} />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {fundedId && (
        <div style={{ position:'fixed', bottom:28, right:28, zIndex:9999, background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.green}`, borderRadius:12, padding:'14px 20px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:12, maxWidth:280 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', color:C.green, fontWeight:700, fontSize:14 }}>&#10003;</div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Funding submitted</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Transaction sent to Ethereum Sepolia</div>
          </div>
        </div>
      )}
    </>
  )
}