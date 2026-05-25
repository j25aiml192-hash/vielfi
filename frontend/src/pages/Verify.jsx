import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  teal: '#008080', lavender: '#9966ff', peach: '#ff9966',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', pink: '#ff3399',
}

const STEPS = [
  { num: 1, label: 'Institutional Info' },
  { num: 2, label: 'Individual Identity' },
  { num: 3, label: 'Financial Verification' },
  { num: 4, label: 'Review & Submit' },
]

function StepCircle({ num, label, active, done }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: done || active ? C.ink : 'transparent',
        border: `2px solid ${done || active ? C.ink : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700,
        color: done || active ? C.white : C.secondary,
        transition: 'all 0.2s',
      }}>
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.ink : C.secondary, textAlign: 'center', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

function Field({ label, type = 'text', placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>{label}</label>
      <input
        type={type} placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px', boxSizing: 'border-box',
          background: C.surface0, border: `1px solid rgba(196,199,199,0.45)`,
          borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = C.ink}
        onBlur={e => e.target.style.borderColor = 'rgba(196,199,199,0.45)'}
      />
    </div>
  )
}

export default function Verify() {
  const navigate = useNavigate()
  const [step, setStep] = useState(2)  // land on step 2 (Individual Identity) like the design

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh' }}>

      {/* Sidebar */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{
          width: 240, background: C.surface, borderRight: `1px solid ${C.border}`,
          padding: '32px 20px', display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0,
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}>🏦 VielFi</div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: C.secondary, marginTop: 2 }}>Institutional</div>
            <div style={{ fontSize: 11, color: C.secondary }}>Credit Desk Alpha</div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {[
              { icon: '⬚', label: 'Overview',       path: '/dashboard' },
              { icon: '🏦', label: 'Credit Facility', path: '/feed'      },
              { icon: '👥', label: 'Lenders',         path: '/circles'   },
              { icon: '🤝', label: 'Borrowers',       path: '/feed'      },
              { icon: '📊', label: 'Reporting',       path: '/dashboard' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 10,
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: 14, fontWeight: 500, color: C.secondary,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eeeee9'; e.currentTarget.style.color = C.ink }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.secondary }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.secondary }}>
              ❓ Support
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.secondary }}>
              📄 Documentation
            </button>
            <button
              onClick={() => navigate('/feed')}
              style={{
                background: C.ink, color: C.white, border: 'none', borderRadius: 12,
                padding: '14px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                textAlign: 'center', marginTop: 8, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Launch Marketplace</button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 240, flex: 1, padding: '56px 64px', maxWidth: 1040 }}>

          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>
            Institutional Identity Verification
          </h1>
          <p style={{ fontSize: 16, color: C.secondary, lineHeight: 1.6, margin: '0 0 48px', maxWidth: 600 }}>
            To comply with financial regulations and unlock full marketplace access, please complete your identity verification.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 56, position: 'relative' }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: s.num < step ? C.ink : s.num === step ? C.ink : 'transparent',
                    border: `2px solid ${s.num <= step ? C.ink : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                    color: s.num <= step ? C.white : C.secondary,
                  }}>
                    {s.num < step ? '✓' : s.num}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: s.num === step ? 700 : 400, color: s.num === step ? C.ink : C.secondary, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step > s.num ? C.ink : C.border, marginTop: 20, maxWidth: 120 }} />
                )}
              </div>
            ))}
          </div>

          {/* Two-column form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>

            {/* Left: Personal Info form */}
            <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 32px' }}>Personal Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Field label="Legal Full Name"  placeholder="As it appears on your ID" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Date of Birth"  type="date" />
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Citizenship</label>
                    <select style={{
                      width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                      background: C.surface0, border: `1px solid rgba(196,199,199,0.45)`,
                      borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none',
                    }}>
                      <option>Select Country</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Singapore</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Upload ID + Liveness */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 300 }}>

              {/* Upload ID — purple */}
              <div style={{
                background: C.lavender, borderRadius: 20, padding: 32, color: C.white,
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16,
              }}>
                <div style={{ fontSize: 48 }}>🪪</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Upload Government-Issued ID</h3>
                <p style={{ fontSize: 14, opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
                  Passport, Driver's License, or National ID. Clear, color photos only.
                </p>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.2)', color: C.white,
                  border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
                  padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  backdropFilter: 'blur(4px)', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >
                  ⬆ Browse Files
                </button>
              </div>

              {/* Liveness Check */}
              <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.peach, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  😊
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Liveness Check</div>
                  <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5, marginBottom: 10 }}>A quick selfie to confirm you're real.</div>
                  <button style={{ color: C.teal, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Start Camera →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              style={{
                background: C.ink, color: C.white, border: 'none', borderRadius: 14,
                padding: '16px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Continue to Financials →
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}