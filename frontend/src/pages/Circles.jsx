import { useState } from 'react'
import { useWallet } from '../context/WalletContext.jsx'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  pink: '#ff3399', teal: '#008080', lavender: '#9966ff',
  peach: '#ff9966', ochre: '#cc9900',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff',
}

const CIRCLES = [
  { id: 1, color: C.teal,    tag: 'Emerging Market Credit', icon: '🌐', name: 'Global Alpha Circle',      members: 12, apy: '10-14', pct: 85, goal: '$5M'  },
  { id: 2, color: C.lavender, tag: 'Commercial Real Estate',  icon: '🏢', name: 'Apex Real Estate Pool',    members: 4,  apy: '8-11',  pct: 40, goal: '$10M' },
  { id: 3, color: C.peach,   tag: 'Mid-Market Receivables',  icon: '🏪', name: 'SME Growth Fund',          members: 8,  apy: '9-12',  pct: 60, goal: '$2M'  },
  { id: 4, color: C.pink,    tag: 'Sustainability-Linked',   icon: '🌿', name: 'GreenTech Debt Circle',    members: 2,  apy: '7-9',   pct: 25, goal: '$3M'  },
]

const MY_CIRCLES = [
  { id: 1, icon: '⚡', iconColor: C.ochre,   bg: '#fef9e7', name: 'Energy Infrastructure Fund', commitment: '$1,500,000', yield: '9.2%',  status: 'Active'  },
  { id: 2, icon: '🏦', iconColor: C.teal,    bg: '#e6f4f4', name: 'European FinTech Debt',     commitment: '$500,000',   yield: '11.5%', status: 'Funding' },
]

function CircleCard({ c }) {
  return (
    <div style={{
      background: c.color, borderRadius: 24, padding: 32, color: C.white,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 300, position: 'relative', overflow: 'hidden',
      transition: 'transform 0.25s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* ghost icon */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 24, opacity: 0.2, fontSize: 120, lineHeight: 1 }}>{c.icon}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 600,
          backdropFilter: 'blur(4px)', marginBottom: 16,
        }}>{c.tag}</div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{c.name}</div>
        <div style={{ display: 'flex', gap: 20, fontSize: 14, opacity: 0.9, marginBottom: 32 }}>
          <span>👥 {c.members} Members</span>
          <span>📈 {c.apy}% APY</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
          <span>{c.pct}% Funded</span>
          <span>Goal: {c.goal}</span>
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.25)', borderRadius: 999, height: 6 }}>
          <div style={{ width: `${c.pct}%`, background: C.white, height: 6, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  )
}

export default function Circles() {
  const { isConnected, address } = useWallet()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh' }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 64px 80px' }}>

        {/* ── Hero ── */}
        <section style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Investment Circles</h1>
          <p style={{ fontSize: 18, color: C.secondary, lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
            Join or create private lending groups to pool capital and diversify risk with trusted institutional partners.
          </p>
        </section>

        {/* ── Stats Row ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 64 }}>
          {[
            { label: 'Active Circles',       value: '14'       },
            { label: 'Total Pooled Capital',  value: '$42.5M'   },
            { label: 'Average Circle Yield',  value: '9.4% APY' },
          ].map(s => (
            <div key={s.label} style={{
              background: C.surface0, border: `1px solid rgba(196,199,199,0.35)`,
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
              transition: 'transform 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>{s.label}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink }}>{s.value}</span>
            </div>
          ))}
        </section>

        {/* ── Available Circles ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Available Circles</h2>
            <button style={{ fontSize: 13, color: C.secondary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View All →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {CIRCLES.map(c => <CircleCard key={c.id} c={c} />)}
          </div>
        </section>

        {/* ── My Circles ── */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>My Circles</h2>
          <div style={{ background: C.surface0, border: `1px solid rgba(196,199,199,0.35)`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid rgba(196,199,199,0.25)`, background: 'rgba(244,244,239,0.5)' }}>
                  {['Circle Name','My Commitment','Current Yield','Status','Actions'].map((h, i) => (
                    <th key={h} style={{
                      padding: '14px 24px', textAlign: i === 4 ? 'right' : 'left',
                      fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MY_CIRCLES.map((row, i) => (
                  <tr key={row.id} style={{
                    borderBottom: i < MY_CIRCLES.length - 1 ? `1px solid rgba(196,199,199,0.15)` : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,244,239,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: row.bg, color: row.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                          {row.icon}
                        </div>
                        <span style={{ fontWeight: 500 }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: C.ink }}>{row.commitment}</td>
                    <td style={{ padding: '16px 24px', color: C.ink }}>{row.yield}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 999,
                        background: '#e8e8e3', fontSize: 12, fontWeight: 600, color: C.secondary,
                      }}>{row.status}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button style={{ color: C.secondary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                        onMouseEnter={e => e.currentTarget.style.color = C.ink}
                        onMouseLeave={e => e.currentTarget.style.color = C.secondary}
                      >•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid rgba(196,199,199,0.15)`, padding: '24px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 13, color: C.secondary }}>© 2024 VielFi Institutional Credit Marketplace</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Terms of Service','Privacy Policy','Compliance','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.secondary, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = C.ink}
              onMouseLeave={e => e.currentTarget.style.color = C.secondary}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}