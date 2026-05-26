import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

const ROLES = [
  {
    id:       'borrower',
    emoji:    '🏦',
    badge:    'BORROWER',
    title:    'I want to Borrow',
    desc:     'Get a credit identity from your UPI, GST, and rental history. List loan requests and get funded by the community.',
    benefits: ['No CIBIL required', 'UPI history is enough', '12–30% APR'],
    cta:      'Start as Borrower',
    redirect: '/verify',
    accent:   '#c9952a',
    btnBg:    '#0a0a0a',
    btnColor: '#fff',
  },
  {
    id:       'lender',
    emoji:    '💎',
    badge:    'LENDER',
    title:    'I want to Lend',
    desc:     'Browse verified borrowers and fund their loans directly. Earn returns of 12–30% APR. Track your portfolio.',
    benefits: ['All borrowers ZK verified', 'Direct wallet to wallet', 'Smart contract automated'],
    cta:      'Start as Lender',
    redirect: '/feed',
    accent:   '#10b981',
    btnBg:    'linear-gradient(135deg,#10b981,#059669)',
    btnColor: '#fff',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { setRole, isConnected, connect } = useWallet()

  const handleSelect = async (roleId, redirect) => {
    if (!isConnected) await connect()
    setRole(roleId)
    navigate(redirect)
  }

  const handleBoth = async () => {
    if (!isConnected) await connect()
    setRole('both')
    navigate('/feed')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fffaf0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '48px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes floatUp   { 0%,100%{transform:translateY(0) scale(1)}   50%{transform:translateY(-18px) scale(1.06)} }
        @keyframes floatDown { 0%,100%{transform:translateY(0) scale(1)}   50%{transform:translateY(14px)  scale(0.95)} }
        @keyframes sparkle   { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(201,149,42,0.4)} 50%{box-shadow:0 0 0 12px rgba(201,149,42,0)} }
        .ob-card { transition: transform 0.25s, box-shadow 0.25s; }
        .ob-card:hover { transform: translateY(-6px) !important; box-shadow: 0 28px 64px rgba(0,0,0,0.13), 0 0 0 1.5px rgba(201,149,42,0.35) !important; }
        .ob-btn { transition: opacity 0.15s, transform 0.15s; }
        .ob-btn:hover { opacity: 0.88; transform: scale(1.02); }
      `}</style>

      {/* Background orbs */}
      <div style={{ position:'absolute', top:'-80px', left:'-80px', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,149,42,0.10) 0%, transparent 70%)', animation:'floatUp 7s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', animation:'floatDown 6s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'40%', right:'5%', width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,149,42,0.06) 0%, transparent 70%)', animation:'floatUp 9s ease-in-out infinite 1s', pointerEvents:'none' }} />

      {/* Sparkle stars */}
      {[
        { top:'8%',  left:'18%', size:10, delay:'0s',   dur:'2.4s' },
        { top:'15%', left:'82%', size:7,  delay:'0.8s', dur:'2.0s' },
        { top:'72%', left:'9%',  size:8,  delay:'1.3s', dur:'2.7s' },
        { top:'80%', left:'88%', size:6,  delay:'0.4s', dur:'1.8s' },
        { top:'45%', left:'95%', size:9,  delay:'1.7s', dur:'2.2s' },
      ].map((s, i) => (
        <div key={i} style={{ position:'absolute', top:s.top, left:s.left, width:s.size, height:s.size, opacity:0, animation:`sparkle ${s.dur} ease-in-out ${s.delay} infinite`, pointerEvents:'none' }}>
          <svg viewBox="0 0 20 20" fill="none" style={{ width:'100%', height:'100%' }}>
            <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" fill="rgba(201,149,42,0.7)"/>
          </svg>
        </div>
      ))}

      <div style={{ position:'relative', maxWidth:860, width:'100%', animation:'fadeSlide 0.5s ease both' }}>

        {/* ── Header ── */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          {/* Logo */}
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:64, height:64, borderRadius:18,
            background:'#0a0a0a',
            border:'2.5px solid rgba(255,255,255,0.9)',
            boxShadow:'0 8px 32px rgba(0,0,0,0.22)',
            marginBottom:28,
            animation:'pulse 3s ease-in-out infinite',
          }}>
            <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:900, fontSize:26, color:'#fff', letterSpacing:'-0.04em', lineHeight:1 }}>V</span>
          </div>

          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'0.14em', color:'#c9952a', textTransform:'uppercase', marginBottom:14 }}>
            ✦ Welcome to VeilFi
          </div>

          <h1 style={{ fontSize:42, fontWeight:900, letterSpacing:'-0.04em', color:'#0a0a0a', margin:'0 0 12px', lineHeight:1.1 }}>
            How will you use{' '}
            <span style={{ background:'linear-gradient(135deg,#c9952a,#e8c05a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              VeilFi?
            </span>
          </h1>
          <p style={{ fontSize:15, color:'#7a6f5e', margin:0 }}>
            You can always change this later
          </p>
        </div>

        {/* ── Role Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:24, marginBottom:36 }}>
          {ROLES.map((role, i) => (
            <div
              key={role.id}
              className="ob-card"
              style={{
                position:'relative', overflow:'hidden',
                borderRadius:24,
                background:'rgba(255,255,255,0.75)',
                backdropFilter:'blur(20px)',
                WebkitBackdropFilter:'blur(20px)',
                border:`1px solid rgba(${role.id === 'borrower' ? '201,149,42' : '16,185,129'},0.22)`,
                boxShadow:'0 8px 40px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
                padding:'32px 28px 28px',
                display:'flex', flexDirection:'column', gap:0,
                animationDelay: `${i * 120}ms`,
              }}
            >
              {/* Corner glow */}
              <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${role.id === 'borrower' ? 'rgba(201,149,42,0.12)' : 'rgba(16,185,129,0.10)'} 0%, transparent 70%)`, pointerEvents:'none' }} />

              {/* Badge */}
              <div style={{ marginBottom:20 }}>
                <span style={{
                  display:'inline-block', padding:'4px 12px', borderRadius:999,
                  fontSize:10, fontWeight:800, letterSpacing:'0.12em',
                  background: role.id === 'borrower' ? 'rgba(201,149,42,0.12)' : 'rgba(16,185,129,0.12)',
                  color: role.id === 'borrower' ? '#a07020' : '#047857',
                  border: `1px solid ${role.id === 'borrower' ? 'rgba(201,149,42,0.3)' : 'rgba(16,185,129,0.3)'}`,
                }}>
                  {role.badge}
                </span>
              </div>

              {/* Icon + title */}
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{
                  width:56, height:56, borderRadius:16, flexShrink:0,
                  background:'#0a0a0a',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24,
                  boxShadow:'0 4px 16px rgba(0,0,0,0.18)',
                }}>
                  {role.emoji}
                </div>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0a0a0a', letterSpacing:'-0.02em', margin:0, lineHeight:1.2 }}>
                  {role.title}
                </h2>
              </div>

              {/* Description */}
              <p style={{ fontSize:13, color:'#7a6f5e', lineHeight:1.6, marginBottom:20 }}>
                {role.desc}
              </p>

              {/* Benefits */}
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:10 }}>
                {role.benefits.map(b => (
                  <li key={b} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'#0a0a0a', fontWeight:500 }}>
                    <span style={{
                      width:20, height:20, borderRadius:'50%', flexShrink:0,
                      background: role.id === 'borrower' ? 'rgba(201,149,42,0.15)' : 'rgba(16,185,129,0.15)',
                      border: `1px solid ${role.id === 'borrower' ? 'rgba(201,149,42,0.4)' : 'rgba(16,185,129,0.4)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10,
                      color: role.id === 'borrower' ? '#c9952a' : '#10b981',
                    }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                id={`onboarding-${role.id}-btn`}
                className="ob-btn"
                onClick={() => handleSelect(role.id, role.redirect)}
                style={{
                  width:'100%', padding:'14px 0', borderRadius:14,
                  background: role.btnBg, color: role.btnColor,
                  border:'none', fontSize:14, fontWeight:700,
                  letterSpacing:'0.01em', cursor:'pointer',
                  boxShadow: role.id === 'borrower'
                    ? '0 4px 20px rgba(0,0,0,0.18)'
                    : '0 4px 20px rgba(16,185,129,0.3)',
                }}
              >
                {role.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── Both Option ── */}
        <div style={{ textAlign:'center' }}>
          <button
            id="onboarding-both-btn"
            onClick={handleBoth}
            style={{
              background:'none', border:'none', cursor:'pointer',
              fontSize:14, color:'#7a6f5e', fontWeight:600,
              textDecoration:'underline', textDecorationColor:'rgba(122,111,94,0.4)',
              textUnderlineOffset:4, fontFamily:'inherit',
              transition:'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a6f5e'}
          >
            I want to do Both →
          </button>
          <p style={{ fontSize:11, color:'#b0a898', marginTop:16 }}>
            Your role is stored locally. No account creation needed.
          </p>
        </div>

      </div>
    </div>
  )
}