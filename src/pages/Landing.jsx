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

function Step({ num, icon, title, desc }) {
  return (
    <div style={{
      display: 'flex', gap: 32, alignItems: 'flex-start',
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '28px 32px',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 64, height: 64, flexShrink: 0, borderRadius: 16,
        background: C.white, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>{icon}</div>
      <div style={{ paddingTop: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink, marginBottom: 6 }}>{num}. {title}</div>
        <div style={{ fontSize: 15, color: C.secondary, lineHeight: 1.6 }}>{desc}</div>
      </div>
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
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 64px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>How it Works</h2>
          <p style={{ fontSize: 15, color: C.secondary }}>A streamlined process designed for institutional efficiency.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
          {/* connector line */}
          <div style={{ position: 'absolute', left: 48, top: 60, bottom: 60, width: 2, background: C.border }} />
          <Step num={1} icon="👤" title="Registration"   desc="Complete our institutional KYC/AML onboarding process swiftly through our secure portal." />
          <Step num={2} icon="✅" title="Verification"   desc="Our team reviews your profile to unlock access to appropriate credit facilities and deal rooms." />
          <Step num={3} icon="📊" title="Allocation"     desc="Deploy capital into carefully vetted opportunities that match your risk-return requirements." />
          <Step num={4} icon="📈" title="Monitoring"     desc="Track performance, receive distributions, and monitor covenant compliance in real-time." />
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

      {/* ── FOOTER ── */}
      <footer style={{
        maxWidth: 1280, margin: '0 auto', padding: '40px 64px',
        borderTop: `1px solid ${C.border}`, marginTop: 80,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>VeilFi</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy','Terms of Service','Risk Disclosures','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.secondary, textDecoration: 'none', fontWeight: 600, letterSpacing: '0.02em' }}
              onMouseEnter={e => e.currentTarget.style.color = C.teal}
              onMouseLeave={e => e.currentTarget.style.color = C.secondary}
            >{l}</a>
          ))}
        </div>
        <div style={{ fontSize: 13, color: C.secondary, fontWeight: 600, letterSpacing: '0.02em' }}>© 2024 VeilFi Institutional. All rights reserved.</div>
      </footer>
    </div>
  )
}