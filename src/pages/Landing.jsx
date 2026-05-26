import { useNavigate } from 'react-router-dom'

/* ── Design tokens (from Stitch export) ── */
const C = {
  canvas:   '#fffaf0',
  ink:      '#0a0a0a',
  secondary:'#615e57',
  pink:     '#ff3399',
  teal:     '#008080',
  lavender: '#9966ff',
  peach:    '#ff9966',
  ochre:    '#cc9900',
  surface:  '#f5f5f0',
  border:   '#cac6c3',
  white:    '#ffffff',
}

function Stat({ value, label, color }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '32px 24px',
      display: 'flex', flexDirection: 'column', gap: 8,
      alignItems: 'center', justifyContent: 'center',
      transition: 'transform 0.2s', cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', color: color || C.ink, lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>{label}</span>
    </div>
  )
}

function Pillar({ bg, icon, title, desc }) {
  return (
    <div style={{
      background: bg, borderRadius: 24, padding: '40px 32px',
      display: 'flex', flexDirection: 'column', gap: 24,
      color: C.white, transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.9 }}>{desc}</div>
      </div>
    </div>
  )
}

/* Golden ratio: φ = 1.618 — used for spacing, sizing, font scales */
const PHI = 1.618
function Step({ num, icon, title, desc, accent }) {
  return (
    <div
      className="hiw-step"
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(201,149,42,0.18)',
        borderRadius: Math.round(16 * PHI) + 'px',  /* 26px */
        padding: `${Math.round(20 * PHI)}px ${Math.round(20 * PHI)}px`,  /* 32px */
        boxShadow: '0 4px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1), 0 0 0 1.5px rgba(201,149,42,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
    >
      {/* Corner glow */}
      <div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,149,42,0.10) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Step number — golden ratio sized */}
      <div style={{
        position: 'absolute', top: 18, right: 22,
        fontSize: Math.round(13 * PHI * PHI) + 'px',  /* ~34px */
        fontWeight: 900, lineHeight: 1,
        color: 'rgba(201,149,42,0.12)',
        letterSpacing: '-0.04em', userSelect: 'none',
        fontFamily: "'Inter', sans-serif",
      }}>{String(num).padStart(2,'0')}</div>

      {/* Icon badge */}
      <div style={{ display:'flex', alignItems:'center', gap: Math.round(8 * PHI) + 'px' }}>
        <div style={{
          width: Math.round(24 * PHI) + 'px',   /* ~39px */
          height: Math.round(24 * PHI) + 'px',
          borderRadius: Math.round(8 * PHI) + 'px',  /* ~13px */
          background: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
        }}>{icon}</div>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
          color: '#c9952a', textTransform: 'uppercase',
          background: 'rgba(201,149,42,0.10)',
          border: '1px solid rgba(201,149,42,0.25)',
          borderRadius: 999, padding: '3px 10px',
        }}>Step {num}</div>
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontSize: Math.round(10 * PHI) + 'px',  /* ~16px */
          fontWeight: 800, letterSpacing: '-0.02em',
          color: '#0a0a0a', marginBottom: Math.round(4 * PHI) + 'px',
          lineHeight: 1.25,
        }}>{title}</div>
        <div style={{
          fontSize: Math.round(8 * PHI) + 'px',  /* ~13px */
          color: '#7a6f5e', lineHeight: 1.618,  /* φ itself as line-height */
        }}>{desc}</div>
      </div>

      {/* Gold bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${(num / 4) * 100}%`,
        height: 3, borderRadius: '0 2px 0 0',
        background: 'linear-gradient(90deg,#c9952a,#e8c05a)',
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 64px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h1 style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0 }}>
            Your financial behavior should matter.<br />
            <span style={{ background: 'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VeilFi</span>
          </h1>
          <p style={{ fontSize: 18, color: C.secondary, lineHeight: 1.6, maxWidth: 440, margin: 0 }}>
            VeilFi converts everyday transactions into a decentralized credit passport, helping millions access fair loans without traditional credit scores.
          </p>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => navigate('/feed')}
              style={{
                background: C.ink, color: C.white,
                border: 'none', borderRadius: 12, padding: '16px 32px',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
                cursor: 'pointer', transition: 'transform 0.15s',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Get Started</button>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ borderRadius: 32, overflow: 'hidden', background: C.surface, aspectRatio: '4/3' }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC64bBua16-vlFInF5Lsi0Oz8oHWGWLq6jqjFLp16zo3DV3QTzsdLteyfRc_heYch4ZhFqXtdNx3Isyfh8iWGC4lTaIVBRwCHBRIJidvHVcqs0dSQLxKlu-tnQtzo3gurBJSTE_4BkRpdqL38Qx7LP9hTBPdeP-Vw3MG-hXJ39bIXk6lKiYRnbAiDu4kaqI-V202-BUW89w8CC4wXAGxkN5_n_In9x5ggWl3gSmfXpb1oAV5T_Jp0_B_Aucw7kqUPHsyKO2hjsuGmtq"
            alt="VeilFi — Institutional Credit"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 64px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        <Stat value="$24.5M"  label="Capital Deployed" />
        <Stat value="12.4%"   label="Avg. Return"       color={C.teal} />
        <Stat value="1,492"   label="Active Lenders"    color={C.lavender} />
      </section>

      {/* ── PILLARS ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 64px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        <Pillar bg={C.pink}    icon="🏦" title="Direct Access"       desc="Access diversified portfolios of credit that were previously inaccessible to most." />
        <Pillar bg={C.teal}    icon="🛡️" title="Rigorous Risk"       desc="Institutional-grade underwriting and real-time risk monitoring for every deal." />
        <Pillar bg={C.lavender} icon="⚡" title="Seamless Execution" desc="Manage your entire portfolio, from deployment to repayment, in one interface." />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 64px 0' }}>
        <style>{`
          .hiw-step { cursor: default; }
          @keyframes hiwLine { from{width:0} to{width:100%} }
        `}</style>

        {/* Header — golden ratio font scale */}
        <div style={{ textAlign:'center', marginBottom: Math.round(32 * PHI) + 'px' }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.16em', color:'#c9952a', textTransform:'uppercase', marginBottom:14 }}>✦ Process</div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, ' + Math.round(26 * PHI) + 'px)',  /* ~42px */
            fontWeight: 900, letterSpacing: '-0.04em',
            margin: '0 0 14px', color: '#0a0a0a', lineHeight: 1.1,
          }}>How it <span style={{ background:'linear-gradient(135deg,#c9952a,#e8c05a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Works</span></h2>
          <p style={{ fontSize: 15, color:'#7a6f5e', maxWidth:480, margin:'0 auto', lineHeight: PHI }}>A streamlined process designed for institutional efficiency and scale.</p>
        </div>

        {/* 2×2 golden-ratio grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `${PHI}fr 1fr`,   /* 1.618 : 1 ratio */
          gridTemplateRows: 'auto auto',
          gap: 20,
        }}>
          <Step num={1} icon="👤" title="Registration"  desc="Complete our institutional KYC/AML onboarding process swiftly through our secure portal." />
          <Step num={2} icon="✅" title="Verification"  desc="Our team reviews your profile to unlock access to appropriate credit facilities and deal rooms." />
          <Step num={3} icon="📊" title="Allocation"    desc="Deploy capital into carefully vetted opportunities that match your risk-return requirements." />
          <Step num={4} icon="📈" title="Monitoring"    desc="Track performance, receive distributions, and monitor covenant compliance in real-time." />
        </div>

        {/* Connecting progress bar */}
        <div style={{ marginTop:36, display:'flex', alignItems:'center', gap:0, position:'relative' }}>
          {[1,2,3,4].map((n,i) => (
            <>
              <div key={n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flex:'none' }}>
                <div style={{
                  width: 32, height: 32, borderRadius:'50%',
                  background: '#0a0a0a',
                  border: '2px solid rgba(201,149,42,0.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:800, color:'#fff',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                }}>{n}</div>
              </div>
              {i < 3 && (
                <div key={`line-${n}`} style={{ flex:1, height:2, background:'linear-gradient(90deg,rgba(201,149,42,0.6),rgba(201,149,42,0.15))' }} />
              )}
            </>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ maxWidth: 1280, margin: '80px auto 0', padding: '0 64px' }}>
        <div style={{
          background: C.peach, borderRadius: 24, padding: '80px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 32,
        }}>
          <h2 style={{ fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, letterSpacing: '-0.04em', maxWidth: 600, margin: 0 }}>
            Ready to scale your portfolio?
          </h2>
          <button
            onClick={() => navigate('/feed')}
            style={{
              background: C.ink, color: C.white,
              border: 'none', borderRadius: 12, padding: '18px 40px',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
              cursor: 'pointer', transition: 'transform 0.15s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >Get Started Today</button>
        </div>
      </section>

    </div>
  )
}