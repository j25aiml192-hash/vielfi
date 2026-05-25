import { useState } from 'react'
import { useWallet } from '../context/WalletContext.jsx'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  teal: '#008080', lavender: '#9966ff', peach: '#ff9966', ochre: '#cc9900',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', pink: '#ff3399', error: '#ba1a1a',
}

const SESSIONS = [
  { device: '💻', name: 'Mac OS • Chrome', location: 'Mumbai, IN • Current Session', revoke: false },
  { device: '📱', name: 'iOS • Safari',    location: 'Mumbai, IN • 2 hours ago',     revoke: true  },
]
const TEAM = [
  { initials: 'AR', bg: C.lavender, name: 'Alex Rivera', note: '(You)', role: 'Admin',  status: 'Active',   pending: false },
  { initials: 'SJ', bg: C.teal,     name: 'Sarah Jenkins',              role: 'Viewer', status: 'Active',   pending: false },
  { initials: 'MT', bg: '#e8e8e3',  name: 'Michael Tran',               role: 'Editor', status: 'Pending',  pending: true  },
]

function Input({ label, type = 'text', value, placeholder, mono }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>{label}</label>}
      <input
        type={type} defaultValue={value} placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px', boxSizing: 'border-box',
          background: C.canvas, border: `1px solid rgba(196,199,199,0.4)`,
          borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none',
          fontFamily: mono ? 'monospace' : 'Inter, sans-serif',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = C.ink}
        onBlur={e => e.target.style.borderColor = 'rgba(196,199,199,0.4)'}
      />
    </div>
  )
}

export default function Profile() {
  const { isConnected, address } = useWallet()
  const [saved, setSaved] = useState(false)

  const displayAddr = address ? `${address.slice(0,6)}...${address.slice(-4)}` : '0x...'

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh' }}>

      {/* Top header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 64px', height: 64, background: C.canvas,
        borderBottom: `1px solid rgba(196,199,199,0.25)`,
        position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Profile Settings</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.secondary, fontSize: 16 }}>🔍</span>
            <input placeholder="Search…" style={{
              paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
              background: C.surface, border: `1px solid rgba(196,199,199,0.3)`,
              borderRadius: 999, fontSize: 14, color: C.ink, outline: 'none', width: 220,
            }} />
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.secondary }}>🔔</button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.teal, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
            {isConnected ? displayAddr.slice(2,4).toUpperCase() : 'VF'}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 64px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Profile Card */}
            <div style={{
              background: C.surface0, border: `1px solid rgba(196,199,199,0.25)`,
              borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden',
              transition: 'transform 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: C.lavender }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', marginBottom: 16, marginTop: 12,
                  background: C.surface, border: `2px solid ${C.canvas}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                }}>
                  {isConnected ? displayAddr.slice(2,4).toUpperCase() : '👤'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                  {isConnected ? displayAddr : 'VeilFi User'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary, marginBottom: 24 }}>
                  Portfolio Manager
                </div>
                <button style={{
                  width: '100%', padding: '12px 0', background: C.surface, color: C.ink,
                  border: `1px solid rgba(196,199,199,0.35)`, borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}>
                  ✏️ Edit Photo
                </button>
              </div>
            </div>

            {/* Personal Information Form */}
            <div style={{ background: C.surface0, border: `1px solid rgba(196,199,199,0.25)`, borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.teal }}>👤</span> Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Input label="Full Name"          value={isConnected ? displayAddr : 'VeilFi User'} />
                <Input label="Professional Email"  type="email" placeholder="user@veilfi.io" />
                <Input label="Wallet Address"      value={address || ''} placeholder="0x..." mono />
                <button
                  onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
                  style={{
                    width: '100%', padding: '14px 0', background: C.ink, color: C.white,
                    border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >{saved ? '✅ Saved!' : 'Save Changes'}</button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Institutional Bento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Teal institution card */}
              <div style={{
                background: C.teal, borderRadius: 24, padding: 32, color: C.white,
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ position: 'absolute', width: 128, height: 128, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -32, right: -32 }} />
                <div style={{ fontSize: 28, marginBottom: 16 }}>🏢</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>Institutional Entity</div>
                <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px' }}>VeilFi Institutional</h3>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['Entity Type','LLC'],['Founded','2024'],['Network','Sepolia ETH']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ opacity: 0.75 }}>{k}</span>
                      <span style={{ fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Details */}
              <div style={{
                background: C.surface0, border: `1px solid rgba(196,199,199,0.25)`,
                borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: C.ochre }}>📋</span> Legal Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: C.secondary, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>Wallet Address</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.ink }}>{address || '**-***0000'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: C.secondary, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>Network</div>
                      <div style={{ fontSize: 14, color: C.ink }}>Ethereum Sepolia Testnet</div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid rgba(196,199,199,0.2)`, paddingTop: 16, marginTop: 16 }}>
                  <button style={{ color: C.teal, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Update Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Team Management */}
            <div style={{ background: C.surface0, border: `1px solid rgba(196,199,199,0.25)`, borderRadius: 16, padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: C.peach }}>👥</span> Team Management
                </h4>
                <button style={{
                  background: C.peach, color: C.ink, border: 'none', borderRadius: 10,
                  padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  👤+ Invite Member
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid rgba(196,199,199,0.2)` }}>
                    {['Member','Role','Status','Actions'].map((h,i) => (
                      <th key={h} style={{ paddingBottom: 14, textAlign: i === 3 ? 'right' : 'left', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEAM.map((m, i) => (
                    <tr key={m.name} style={{
                      borderBottom: i < TEAM.length - 1 ? `1px solid rgba(196,199,199,0.12)` : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,244,239,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.bg, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{m.initials}</div>
                          <span style={{ fontWeight: 500 }}>{m.name} {m.note && <span style={{ color: C.secondary, fontSize: 13, fontWeight: 400 }}>{m.note}</span>}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.secondary, fontSize: 14 }}>{m.role}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                          background: m.pending ? 'transparent' : '#e8e8e3', color: C.secondary,
                          border: m.pending ? `1px solid ${C.border}` : 'none',
                        }}>{m.status}</span>
                      </td>
                      <td style={{ padding: '14px 0', textAlign: 'right' }}>
                        <button style={{ color: C.secondary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>•••</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Security Section */}
            <div style={{ background: C.surface0, border: `1px solid rgba(196,199,199,0.25)`, borderRadius: 16, padding: 32 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                🛡️ Security
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 2FA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: C.surface, borderRadius: 12, gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: 12, color: C.secondary }}>Add an extra layer of security to your account.</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: C.teal, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>✅ Enabled</span>
                    <button style={{ padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: C.white }}>Manage</button>
                  </div>
                </div>
                {/* Password */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: C.canvas, border: `1px solid rgba(196,199,199,0.2)`, borderRadius: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Password</div>
                    <div style={{ fontSize: 12, color: C.secondary }}>Last changed 4 months ago.</div>
                  </div>
                  <button style={{ padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: C.white }}>Change Password</button>
                </div>
                {/* Sessions */}
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary, marginBottom: 16 }}>Active Sessions</div>
                  {SESSIONS.map((s, i) => (
                    <div key={s.name} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0',
                      borderBottom: i < SESSIONS.length - 1 ? `1px solid rgba(196,199,199,0.15)` : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20, color: C.secondary }}>{s.device}</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: C.secondary }}>{s.location}</div>
                        </div>
                      </div>
                      {s.revoke && (
                        <button style={{ color: C.error, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
