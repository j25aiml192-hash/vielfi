import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import WalletButton from './WalletButton.jsx'
import { useWallet } from '../context/WalletContext.jsx'


/* ΓöÇΓöÇ Nav items for the slide-in drawer ΓöÇΓöÇ */
const NAV_ITEMS = [
  {
    to: '/feed', label: 'Markets', description: 'Browse live loan listings',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  },
  {
    to: '/verify', label: 'Lending', description: 'Verify identity & get credit score',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
  },
  {
    to: '/circles', label: 'Borrowing', description: 'Create loan requests & join circles',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>,
  },
  {
    to: '/dashboard', label: 'Governance', description: 'Portfolio & repayment dashboard',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  },
  {
    to: '/profile', label: 'Profile', description: 'Your account & settings',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
  },
  {
    to: '/settings', label: 'Settings', description: 'Notifications, AI features & privacy',
    icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
]

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   GLOBAL NAV DRAWER
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
function NavDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const go = (to) => { onClose(); navigate(to) }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:40,background:'rgba(0,0,0,0.22)',backdropFilter:'blur(3px)',opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity 0.28s ease' }} />
      <div style={{ position:'fixed',top:0,left:0,bottom:0,zIndex:50,width:290,background:'#fff',boxShadow:'6px 0 40px rgba(0,0,0,0.11)',transform:open?'translateX(0)':'translateX(-100%)',transition:'transform 0.32s cubic-bezier(0.22,1,0.36,1)',display:'flex',flexDirection:'column',fontFamily:'Inter,sans-serif' }}>
        <div style={{ height:56,padding:'0 20px',borderBottom:'1px solid #f0ede8',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
          <button onClick={()=>go('/')} style={{ display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer',padding:0 }}>
            <div style={{ width:26,height:26,borderRadius:6,background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:'#fff',fontWeight:800,fontSize:'0.8rem' }}>V</span>
            </div>
            <span style={{ fontWeight:800,fontSize:'1.1rem',letterSpacing:'-0.02em',background:'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)',backgroundSize:'200% 100%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'goldShine 3s ease-in-out infinite' }}>VeilFi</span>
          </button>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:'50%',border:'1px solid #ececec',background:'#faf8f5',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ flex:1,padding:'12px 10px',overflowY:'auto' }}>
          {NAV_ITEMS.map(({ to, label, description, icon }) => (
            <button key={to} onClick={()=>go(to)} style={{ width:'100%',display:'flex',alignItems:'center',gap:14,padding:'12px 14px',borderRadius:12,background:'transparent',border:'none',cursor:'pointer',textAlign:'left',marginBottom:2,transition:'background 0.16s,transform 0.16s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#fdf9f3';e.currentTarget.style.transform='translateX(3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.transform='none'}}
            >
              <div style={{ width:38,height:38,borderRadius:10,flexShrink:0,background:'linear-gradient(145deg,#fdf8ec,#faf0d8)',border:'1px solid rgba(212,175,55,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#c9952a' }}>{icon}</div>
              <div>
                <div style={{ fontWeight:700,fontSize:'0.9rem',color:'#0a0a0a',marginBottom:1 }}>{label}</div>
                <div style={{ fontSize:'0.7rem',color:'#999',lineHeight:1.4 }}>{description}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ padding:'14px 20px',borderTop:'1px solid #f0ede8',flexShrink:0 }}>
          <p style={{ fontFamily:'JetBrains Mono,monospace',fontSize:'0.58rem',color:'#ccc',letterSpacing:'0.14em',textTransform:'uppercase',textAlign:'center' }}>
            Secure &middot; Transparent &middot; Decentralized
          </p>
        </div>
      </div>
      <style>{`@keyframes goldShine{0%{background-position:100% 0}50%{background-position:0% 0}100%{background-position:100% 0}}`}</style>
    </>
  )
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   NOTIFICATION BELL
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const NOTIFS = [
  { id:1, icon:'≡ƒÆ░', title:'New lender funded your loan', sub:'Rahul Sharma received \u20b95,000',   time:'2m ago', unread:true  },
  { id:2, icon:'Γ£à', title:'KYC Verification complete',   sub:'Your SBT has been minted',           time:'1h ago', unread:true  },
  { id:3, icon:'ΓÜí', title:'Loan closing soon',           sub:'Farida Shaikh \u2014 3 days left',   time:'3h ago', unread:true  },
  { id:4, icon:'≡ƒôê', title:'Repayment received',          sub:'+\u20b918,500 credited to wallet',   time:'1d ago', unread:false },
  { id:5, icon:'≡ƒæÑ', title:'Circle invite',               sub:'You were added to Circle #12',       time:'2d ago', unread:false },
]

function NotificationBell() {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState(NOTIFS)
  const unread = notifs.filter(n => n.unread).length

  return (
    <div style={{ position:'relative' }}>
      <button onClick={()=>setOpen(o=>!o)} aria-label="Notifications" style={{ width:36,height:36,borderRadius:9,border:'1px solid #e8e4df',background:open?'#faf0d8':'#faf8f5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',transition:'background 0.18s' }}
        onMouseEnter={e=>e.currentTarget.style.background='#fdf5e0'}
        onMouseLeave={e=>e.currentTarget.style.background=open?'#faf0d8':'#faf8f5'}
      >
        <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke={unread>0?'#c9952a':'#888'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {unread>0 && (
          <span style={{ position:'absolute',top:-4,right:-4,width:16,height:16,borderRadius:'50%',background:'#dc2626',color:'#fff',fontSize:9,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff',animation:'bellPulse 2s ease-in-out infinite' }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={()=>setOpen(false)} style={{ position:'fixed',inset:0,zIndex:45 }} />
          <div style={{ position:'absolute',top:44,right:0,width:320,background:'#fff',border:'1px solid #e8e4df',borderRadius:14,boxShadow:'0 12px 40px rgba(0,0,0,0.14)',zIndex:50,overflow:'hidden',animation:'dropIn 0.2s cubic-bezier(0.16,1,0.3,1)',fontFamily:'Inter,sans-serif' }}>
            <div style={{ padding:'14px 16px',borderBottom:'1px solid #f0ede8',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <span style={{ fontWeight:700,fontSize:14,color:'#0a0a0a' }}>Notifications</span>
              {unread>0 && <button onClick={()=>setNotifs(n=>n.map(x=>({...x,unread:false})))} style={{ fontSize:11,color:'#c9952a',fontWeight:600,background:'none',border:'none',cursor:'pointer' }}>Mark all read</button>}
            </div>
            <div style={{ maxHeight:320,overflowY:'auto' }}>
              {notifs.map(n=>(
                <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))}
                  style={{ display:'flex',gap:12,padding:'12px 16px',background:n.unread?'#fffdf8':'#fff',borderBottom:'1px solid #f5f3ef',cursor:'pointer',transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#faf8f5'}
                  onMouseLeave={e=>e.currentTarget.style.background=n.unread?'#fffdf8':'#fff'}
                >
                  <div style={{ width:36,height:36,borderRadius:10,background:'#faf8f5',border:'1px solid #eeece8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{n.icon}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:12,fontWeight:n.unread?700:400,color:'#0a0a0a',marginBottom:2,lineHeight:1.4 }}>{n.title}</div>
                    <div style={{ fontSize:11,color:'#888',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{n.sub}</div>
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0 }}>
                    <span style={{ fontSize:10,color:'#bbb' }}>{n.time}</span>
                    {n.unread && <span style={{ width:7,height:7,borderRadius:'50%',background:'#c9952a' }}/>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'10px 16px',borderTop:'1px solid #f0ede8',textAlign:'center' }}>
              <span style={{ fontSize:12,color:'#c9952a',fontWeight:600,cursor:'pointer' }}>View all notifications</span>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes bellPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes dropIn    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  )
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   NAVBAR (sticky, every page)
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const NO_SIDEBAR_PAGES = ['/', '/onboarding']

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isConnected } = useWallet()
  // Hide logo when the sidebar is already showing it
  const hasSidebar = !NO_SIDEBAR_PAGES.includes(location.pathname)

  return (
    <>

      <nav style={{
        position:'sticky', top:0, zIndex:30,
        background:'#fff', borderBottom:'1px solid #f0ede8',
        fontFamily:'Inter,sans-serif',
      }}>
        <div style={{ height:56,maxWidth:1440,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16 }}>

          {/* Left: Logo — only shown on pages without sidebar */}
          {!hasSidebar && (
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <NavLink to="/" style={{ display:'flex',alignItems:'center',gap:8,textDecoration:'none' }}>
                <div style={{ width:26,height:26,borderRadius:6,background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <span style={{ color:'#fff',fontWeight:800,fontSize:'0.8rem' }}>V</span>
                </div>
                <span style={{ fontWeight:800,fontSize:'1.1rem',letterSpacing:'-0.02em',background:'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)',backgroundSize:'200% 100%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'goldShine 3s ease-in-out infinite' }}>VeilFi</span>
              </NavLink>
            </div>
          )}

          {/* Right: List a Loan + Notifications + Profile + Wallet */}
          <div style={{ display:'flex',alignItems:'center',gap:14 }}>

            {/* + List a Loan — visible when wallet connected */}
            {isConnected && (
              <button
                id="navbar-list-loan-btn"
                onClick={() => navigate('/loans/create')}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'7px 16px', borderRadius:999,
                  background:'linear-gradient(135deg,#c9952a,#e8c05a)',
                  border:'none', color:'#fff', fontSize:13, fontWeight:700,
                  cursor:'pointer', transition:'opacity 0.18s',
                  whiteSpace:'nowrap',
                }}
                onMouseEnter={e=>e.currentTarget.style.opacity='0.88'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}
              >
                <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                List a Loan
              </button>
            )}

            {/* 🔔 Notification bell */}
            <NotificationBell />

            <NavLink to="/profile"
              style={{ fontSize:'0.88rem',fontWeight:500,color:'#666',textDecoration:'none',transition:'color 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#0a0a0a'}
              onMouseLeave={e=>e.currentTarget.style.color='#666'}
            >
              Profile
            </NavLink>
            <WalletButton />
          </div>
        </div>
      </nav>

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