/* ─────────────────────────────────────────────────────────────
   Settings — NitiSetu-inspired design
   Sections: Profile · Notifications · Security · AI Features · Data & Privacy · About
   Cream bg, section headers, icon rows, toggle switches, chevron rows
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ── Design tokens ── */
const C = {
  bg:      '#f4f2ef',
  surface: '#ffffff',
  border:  '#e8e4de',
  text:    '#1a1a1a',
  mid:     '#555555',
  muted:   '#888888',
  danger:  '#dc2626',
  gold:    '#c9952a',
}

/* ── Helper: colored icon square ── */
function IconBox({ color, children }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9,
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

/* ── Toggle switch ── */
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 46, height: 27, borderRadius: 999,
        background: value ? '#22c55e' : '#d1d5db',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.22s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 22 : 3,
        width: 21, height: 21, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'left 0.22s',
        display: 'block',
      }} />
    </button>
  )
}

/* ── Section header ── */
function SectionHeader({ label }) {
  return (
    <div style={{
      padding: '20px 24px 8px',
      fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
      color: C.muted, fontFamily: "'Inter', sans-serif",
      textTransform: 'uppercase',
    }}>
      {label}
    </div>
  )
}

/* ── Row with right value or chevron ── */
function InfoRow({ icon, label, value, chevron, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 24px',
      borderBottom: `1px solid ${C.border}`,
      cursor: chevron ? 'pointer' : 'default',
    }}
      onMouseEnter={e => { if (chevron) e.currentTarget.style.background = '#f9f7f4' }}
      onMouseLeave={e => { if (chevron) e.currentTarget.style.background = 'transparent' }}
    >
      <IconBox color={icon.color}>{icon.el}</IconBox>
      <span style={{
        flex: 1, fontSize: 14, fontFamily: "'Inter', sans-serif",
        color: danger ? C.danger : C.text, fontWeight: danger ? 500 : 400,
      }}>
        {label}
      </span>
      {value && (
        <span style={{ fontSize: 14, color: C.muted, fontFamily: "'Inter', sans-serif" }}>
          {value}
        </span>
      )}
      {chevron && (
        <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke={C.muted} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  )
}

/* ── Row with toggle ── */
function ToggleRow({ icon, label, hint, value, onChange }) {
  return (
    <div style={{
      padding: '0 24px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
        <IconBox color={icon.color}>{icon.el}</IconBox>
        <span style={{ flex: 1, fontSize: 14, fontFamily: "'Inter', sans-serif", color: C.text }}>
          {label}
        </span>
        <Toggle value={value} onChange={onChange} />
      </div>
      {hint && !value && (
        <p style={{
          fontSize: 12, color: C.muted, margin: '0 0 12px 48px',
          fontFamily: "'Inter', sans-serif",
        }}>{hint}</p>
      )}
    </div>
  )
}

/* ── SVG icons ── */
const icons = {
  user:    (c='#5b6af5') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> }),
  email:   (c='#3b82f6') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> }),
  role:    (c='#8b5cf6') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> }),
  bell:    (c='#f59e0b') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> }),
  push:    (c='#3b82f6') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg> }),
  alert:   (c='#ef4444') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg> }),
  lock2fa: (c='#6b7280') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> }),
  key:     (c='#92400e') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg> }),
  ai:      (c='#0ea5e9') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.828-1.498 2.552l-3.914-.782a6.544 6.544 0 00-2.59 0l-3.914.782c-1.528.276-2.498-1.552-1.498-2.552L5 14.5"/></svg> }),
  chat:    (c='#8b5cf6') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> }),
  recs:    (c='#c9952a') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg> }),
  history: (c='#059669') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }),
  download:(c='#2563eb') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> }),
  trash:   (c='#dc2626') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> }),
  wallet:  (c='#374151') => ({ color: c, el: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg> }),
}

/* ── Avatar initials circle ── */
function AvatarCircle({ name = 'U', size = 52 }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #5b6af5, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", fontWeight: 700,
      fontSize: size * 0.36, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

/* ═══════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════ */
export default function Settings() {
  const { address, userRole, isConnected, disconnect } = useWallet()
  const navigate = useNavigate()

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : 'Not connected'

  const displayName = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : 'Guest'

  const [notifs, setNotifs] = useState({
    email:    true,
    push:     true,
    critical: false,
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
  })
  const [ai, setAi] = useState({
    chatbot:  true,
    recs:     true,
    history:  true,
  })

  const handleSignOut = () => {
    disconnect?.()
    navigate('/')
  }

  const role = userRole
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
    : 'Not set'

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Inter', sans-serif",
      paddingBottom: 60,
    }}>
      {/* ── Page header ── */}
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '32px 16px 0',
      }}>
        <h1 style={{
          fontSize: 26, fontWeight: 700, color: C.text,
          margin: '0 0 24px', letterSpacing: '-0.02em',
        }}>
          Settings
        </h1>

        {/* ── User identity card ── */}
        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 24,
        }}>
          <AvatarCircle name={isConnected ? shortAddr : 'GU'} size={54} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: C.text }}>{displayName}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
              {address || 'wallet not connected'}
            </div>
            {userRole && (
              <span style={{
                display: 'inline-block', marginTop: 8,
                padding: '2px 10px', borderRadius: 9999,
                background: '#EEF2FF', color: '#4338CA',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}>
                {role}
              </span>
            )}
          </div>
          {!isConnected && (
            <button
              onClick={() => navigate('/onboarding')}
              style={{
                padding: '8px 16px', borderRadius: 8,
                background: C.gold, border: 'none', cursor: 'pointer',
                color: '#fff', fontWeight: 600, fontSize: 13,
              }}
            >
              Connect
            </button>
          )}
        </div>

        {/* ── Card wrapper ── */}
        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* PROFILE */}
          <SectionHeader label="Profile" />
          <InfoRow
            icon={icons.user()}
            label="Wallet Address"
            value={shortAddr}
          />
          <InfoRow
            icon={icons.wallet()}
            label="Network"
            value="Sepolia Testnet"
          />
          <InfoRow
            icon={icons.role()}
            label="Role"
            value={role}
            chevron
          />
          <InfoRow
            icon={icons.email()}
            label="Onboarding Status"
            value={userRole ? '✓ Complete' : 'Pending'}
          />
        </div>

        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* NOTIFICATIONS */}
          <SectionHeader label="Notifications" />
          <ToggleRow
            icon={icons.bell()}
            label="Email Notifications"
            value={notifs.email}
            onChange={v => setNotifs(n => ({ ...n, email: v }))}
          />
          <ToggleRow
            icon={icons.push()}
            label="Push Notifications"
            value={notifs.push}
            onChange={v => setNotifs(n => ({ ...n, push: v }))}
          />
          <ToggleRow
            icon={icons.alert()}
            label="Critical Alerts Only"
            hint="When critical alerts only is enabled, you will only receive notifications for loan repayments, funding events, and defaults."
            value={notifs.critical}
            onChange={v => setNotifs(n => ({ ...n, critical: v }))}
          />
        </div>

        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* SECURITY */}
          <SectionHeader label="Security" />
          <ToggleRow
            icon={icons.lock2fa()}
            label="ZK Proof Verification"
            value={security.twoFactor}
            onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))}
          />
          <InfoRow
            icon={icons.key()}
            label="View SBT on Etherscan"
            chevron
          />
        </div>

        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* AI FEATURES */}
          <SectionHeader label="AI Features" />
          <ToggleRow
            icon={icons.chat()}
            label="VeilFi AI Chatbot"
            value={ai.chatbot}
            onChange={v => setAi(a => ({ ...a, chatbot: v }))}
          />
          <ToggleRow
            icon={icons.recs()}
            label="AI Loan Recommendations"
            value={ai.recs}
            onChange={v => setAi(a => ({ ...a, recs: v }))}
          />
          <ToggleRow
            icon={icons.history()}
            label="Loan History Analysis"
            value={ai.history}
            onChange={v => setAi(a => ({ ...a, history: v }))}
          />
        </div>

        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* DATA & PRIVACY */}
          <SectionHeader label="Data &amp; Privacy" />
          <InfoRow
            icon={icons.download()}
            label="Export My ZK Proof Data"
            chevron
          />
          <InfoRow
            icon={icons.trash()}
            label="Clear Activity Logs"
            chevron
            danger
          />
          <p style={{
            margin: '0 24px 14px 24px',
            fontSize: 12, color: C.muted,
          }}>
            Clearing activity logs is permanent and cannot be undone.
          </p>
        </div>

        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          {/* ABOUT */}
          <SectionHeader label="About" />
          <InfoRow icon={icons.role('#374151')} label="Version" value="1.0.0" />
          <InfoRow icon={icons.email('#374151')} label="Environment" value="Production" />
          <InfoRow icon={icons.wallet()} label="Backend" value="Render / FastAPI" />
        </div>

        {/* Sign Out */}
        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '16px 24px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600,
              color: C.danger, fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {isConnected ? 'Disconnect Wallet' : 'Sign Out'}
          </button>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', fontSize: 12,
          color: C.muted, marginTop: 16,
        }}>
          VeilFi v1.0.0 · <span style={{ color: C.gold }}>ZK Credit Intelligence</span>
        </p>
      </div>
    </div>
  )
}
