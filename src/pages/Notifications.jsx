import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const φ = 1.618
const base = 10
const sm = Math.round(base * φ)        // 16px
const md = Math.round(base * φ * φ)    // 26px
const gap = Math.round(base * φ)       // 16px
const radius = Math.round(base * φ)    // 16px

const ALL_NOTIFS = [
  { id:1,  icon:'💰', title:'New lender funded your loan',   sub:'Rahul Sharma received ₹5,000',          time:'2m ago',  unread:true,  category:'Funding'      },
  { id:2,  icon:'✅', title:'KYC Verification complete',     sub:'Your SBT has been minted',              time:'1h ago',  unread:true,  category:'Verification' },
  { id:3,  icon:'⚡', title:'Loan closing soon',             sub:'Farida Shaikh — 3 days left',           time:'3h ago',  unread:true,  category:'Alert'        },
  { id:4,  icon:'📊', title:'Repayment received',            sub:'+₹18,500 credited to wallet',           time:'1d ago',  unread:false, category:'Payment'      },
  { id:5,  icon:'👥', title:'Circle invite',                 sub:'You were added to Circle #12',          time:'2d ago',  unread:false, category:'Circles'      },
  { id:6,  icon:'🏦', title:'New loan listed',               sub:'Priya Mehta listed ₹2,00,000 loan',     time:'2d ago',  unread:false, category:'Marketplace'  },
  { id:7,  icon:'📈', title:'Portfolio milestone reached',   sub:'You have deployed ₹50,000 in capital',  time:'3d ago',  unread:false, category:'Portfolio'    },
  { id:8,  icon:'🔔', title:'Interest rate update',          sub:'APR for Business loans updated to 14%', time:'4d ago',  unread:false, category:'Alert'        },
  { id:9,  icon:'💎', title:'ZK proof generated',            sub:'Your credit proof is ready to share',   time:'5d ago',  unread:false, category:'Verification' },
  { id:10, icon:'🌾', title:'Agriculture fund distribution', sub:'₹3,200 distributed from Circle #8',     time:'6d ago',  unread:false, category:'Payment'      },
  { id:11, icon:'💳', title:'Wallet connected',              sub:'MetaMask linked successfully',           time:'1w ago',  unread:false, category:'Account'      },
  { id:12, icon:'📋', title:'Loan application approved',     sub:'Rahul Patil — ₹75,00,000 approved',     time:'1w ago',  unread:false, category:'Funding'      },
]

const CATEGORIES = ['All', 'Funding', 'Payment', 'Alert', 'Verification', 'Circles', 'Marketplace', 'Portfolio', 'Account']

const CAT_COLORS = {
  Funding:      { bg:'rgba(201,149,42,0.12)', border:'rgba(201,149,42,0.3)',  text:'#a07020' },
  Payment:      { bg:'rgba(16,185,129,0.10)', border:'rgba(16,185,129,0.3)', text:'#047857' },
  Alert:        { bg:'rgba(239,68,68,0.10)',  border:'rgba(239,68,68,0.3)',  text:'#dc2626' },
  Verification: { bg:'rgba(99,102,241,0.10)', border:'rgba(99,102,241,0.3)', text:'#4338ca' },
  Circles:      { bg:'rgba(236,72,153,0.10)', border:'rgba(236,72,153,0.3)', text:'#be185d' },
  Marketplace:  { bg:'rgba(8,145,178,0.10)',  border:'rgba(8,145,178,0.3)',  text:'#0369a1' },
  Portfolio:    { bg:'rgba(234,179,8,0.10)',  border:'rgba(234,179,8,0.3)',  text:'#a16207' },
  Account:      { bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.3)',text:'#374151' },
}

export default function Notifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [notifs, setNotifs] = useState(ALL_NOTIFS)

  const shown = filter === 'All' ? notifs : notifs.filter(n => n.category === filter)
  const unreadCount = notifs.filter(n => n.unread).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fffaf0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: `${md}px ${Math.round(md * φ)}px`,
    }}>
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .notif-row { transition: background 0.15s, transform 0.15s; }
        .notif-row:hover { background: rgba(255,255,255,0.95) !important; transform: translateX(3px); }
        .dismiss-btn { opacity: 0; transition: opacity 0.15s; }
        .notif-row:hover .dismiss-btn { opacity: 1; }
        .cat-btn { transition: background 0.15s, color 0.15s, border-color 0.15s; }
      `}</style>

      <div style={{ maxWidth: Math.round(360 * φ), margin: '0 auto', animation: 'fadeSlide 0.4s ease both' }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: Math.round(gap * φ) }}>
          <div>
            <button
              onClick={() => navigate(-1)}
              style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#7a6f5e', fontWeight:600, fontFamily:'inherit', padding:0, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}
            >
              ← Back
            </button>
            <h1 style={{ margin:0, fontSize: Math.round(base * φ * φ * 0.85), fontWeight:900, color:'#0a0a0a', letterSpacing:'-0.04em', lineHeight:1 }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <div style={{ fontSize:13, color:'#7a6f5e', marginTop:6, fontWeight:500 }}>
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button
            onClick={markAllRead}
            style={{
              background:'#0a0a0a', color:'#fff',
              border:'none', borderRadius: radius, padding:`${Math.round(gap/φ)}px ${gap}px`,
              fontSize:12, fontWeight:700, cursor:'pointer',
              opacity: unreadCount > 0 ? 1 : 0.4,
              transition:'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          >
            Mark all read
          </button>
        </div>

        {/* ── Category filter pills ── */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom: gap }}>
          {CATEGORIES.map(cat => {
            const active = filter === cat
            const clr = cat !== 'All' ? CAT_COLORS[cat] : null
            return (
              <button
                key={cat}
                className="cat-btn"
                onClick={() => setFilter(cat)}
                style={{
                  padding:`5px 14px`, borderRadius:999,
                  fontSize:12, fontWeight: active ? 700 : 500,
                  cursor:'pointer',
                  background: active ? (clr ? clr.bg : '#0a0a0a') : 'rgba(255,255,255,0.7)',
                  color: active ? (clr ? clr.text : '#fff') : '#7a6f5e',
                  border: `1px solid ${active ? (clr ? clr.border : '#0a0a0a') : 'rgba(201,149,42,0.18)'}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {cat}
                {cat !== 'All' && notifs.filter(n => n.category === cat && n.unread).length > 0 && (
                  <span style={{ marginLeft:5, background:'#c9952a', color:'#fff', borderRadius:999, padding:'1px 5px', fontSize:9, fontWeight:800 }}>
                    {notifs.filter(n => n.category === cat && n.unread).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Notification list ── */}
        <div style={{
          background:'rgba(255,255,255,0.72)',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          borderRadius: Math.round(radius * φ * 0.9),
          border:'1px solid rgba(201,149,42,0.15)',
          boxShadow:'0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          overflow:'hidden',
        }}>
          {shown.length === 0 ? (
            <div style={{ textAlign:'center', padding:`${Math.round(gap * φ * φ)}px`, color:'#9a8a70' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔔</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#0a0a0a', marginBottom:6 }}>No notifications</div>
              <div style={{ fontSize:13 }}>Nothing in this category yet</div>
            </div>
          ) : shown.map((n, i) => {
            const clr = CAT_COLORS[n.category] || CAT_COLORS.Account
            return (
              <div
                key={n.id}
                className="notif-row"
                onClick={() => markRead(n.id)}
                style={{
                  display:'flex', alignItems:'flex-start', gap: gap,
                  padding:`${Math.round(gap * 0.9)}px ${Math.round(gap * 1.1)}px`,
                  borderBottom: i < shown.length - 1 ? '1px solid rgba(201,149,42,0.08)' : 'none',
                  background: n.unread ? 'rgba(201,149,42,0.04)' : 'transparent',
                  cursor:'pointer', position:'relative',
                }}
              >
                {/* Unread bar */}
                {n.unread && (
                  <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:3, borderRadius:'0 2px 2px 0', background:'#c9952a' }} />
                )}

                {/* Icon */}
                <div style={{
                  width: Math.round(gap * φ * 1.1), height: Math.round(gap * φ * 1.1),
                  borderRadius: Math.round(radius * 0.7),
                  background: clr.bg, border:`1px solid ${clr.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: Math.round(base * 1.4), flexShrink:0,
                }}>
                  {n.icon}
                </div>

                {/* Text */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontSize: Math.round(base * 1.25), fontWeight: n.unread ? 700 : 500, color:'#0a0a0a', lineHeight:1.3 }}>
                      {n.title}
                    </span>
                    <span style={{
                      fontSize:9, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase',
                      background: clr.bg, color: clr.text, border:`1px solid ${clr.border}`,
                      borderRadius:999, padding:'2px 7px', flexShrink:0,
                    }}>
                      {n.category}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:'#9a8a70', lineHeight: φ, marginBottom:4 }}>{n.sub}</div>
                  <div style={{ fontSize:10, color:'#bbb', fontWeight:600 }}>{n.time}</div>
                </div>

                {/* Right: dot + dismiss */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                  {n.unread && <div style={{ width:8, height:8, borderRadius:'50%', background:'#c9952a' }} />}
                  <button
                    className="dismiss-btn"
                    onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                    style={{
                      background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                      borderRadius:999, width:22, height:22,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, color:'#dc2626', cursor:'pointer', fontWeight:700,
                    }}
                    title="Dismiss"
                  >×</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Footer summary ── */}
        <div style={{ textAlign:'center', marginTop: gap, fontSize:12, color:'#b0a898', fontWeight:500 }}>
          {shown.length} notification{shown.length !== 1 ? 's' : ''} · {unreadCount} unread
        </div>

      </div>
    </div>
  )
}
