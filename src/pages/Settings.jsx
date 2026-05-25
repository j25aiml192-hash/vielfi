import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ── Design tokens — matches Landing / Dashboard / Verify ── */
const C = {
  canvas:   '#fffaf0',
  ink:      '#0a0a0a',
  secondary:'#615e57',
  surface:  '#f5f5f0',
  surface0: '#ffffff',
  border:   '#cac6c3',
  gold:     '#c9952a',
  goldLight:'#fdf5e0',
  red:      '#dc2626',
  green:    '#16a34a',
  teal:     '#008080',
  blue:     '#2563eb',
  purple:   '#7c3aed',
  amber:    '#d97706',
}

/* ── Toggle switch ── */
function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 46, height: 26, borderRadius: 999,
      background: value ? C.gold : C.border,
      border: 'none', cursor: 'pointer',
      position: 'relative', flexShrink: 0,
      transition: 'background 0.22s',
    }}>
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 23 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.22s',
        display: 'block',
      }} />
    </button>
  )
}

/* ── Section card wrapper ── */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: C.secondary,
        marginBottom: 10, paddingLeft: 2,
      }}>{title}</div>
      <div style={{
        background: C.surface0, border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

/* ── Info / action row ── */
function Row({ icon, label, value, chevron, danger, onClick, last }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 20px',
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
      cursor: chevron || onClick ? 'pointer' : 'default',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => { if (chevron || onClick) e.currentTarget.style.background = C.surface }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: icon.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon.el}</div>
      <span style={{ flex: 1, fontSize: 14, color: danger ? C.red : C.ink, fontWeight: danger ? 600 : 400 }}>
        {label}
      </span>
      {value && <span style={{ fontSize: 13, color: C.secondary }}>{value}</span>}
      {chevron && (
        <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke={C.secondary} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  )
}

/* ── Toggle row ── */
function ToggleRow({ icon, label, hint, value, onChange, last }) {
  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: icon.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{icon.el}</div>
        <span style={{ flex: 1, fontSize: 14, color: C.ink }}>{label}</span>
        <Toggle value={value} onChange={onChange} />
      </div>
      {hint && !value && (
        <p style={{ fontSize: 12, color: C.secondary, margin: '0 20px 14px 68px', lineHeight: 1.5 }}>{hint}</p>
      )}
    </div>
  )
}

/* ── Icon helpers ── */
const ic = {
  wallet:   { bg: '#1a1a2e', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg> },
  network:  { bg: '#0f4c75', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg> },
  role:     { bg: '#5b21b6', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg> },
  status:   { bg: '#065f46', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  bell:     { bg: '#b45309', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> },
  push:     { bg: '#1d4ed8', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg> },
  critical: { bg: '#991b1b', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg> },
  zk:       { bg: '#374151', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> },
  key:      { bg: '#78350f', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg> },
  ai:       { bg: '#0369a1', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.828-1.498 2.552l-3.914-.782a6.544 6.544 0 00-2.59 0l-3.914.782c-1.528.276-2.498-1.552-1.498-2.552L5 14.5"/></svg> },
  chat:     { bg: '#6d28d9', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> },
  star:     { bg: C.gold,   el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg> },
  history:  { bg: '#047857', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  download: { bg: '#1d4ed8', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> },
  trash:    { bg: '#991b1b', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> },
  info:     { bg: '#374151', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg> },
  backend:  { bg: '#1f2937', el: <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"/></svg> },
}

/* ═══════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════ */
export default function Settings() {
  const { address, userRole, isConnected, disconnect } = useWallet()
  const navigate = useNavigate()

  const shortAddr   = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Not connected'
  const displayName = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Guest'
  const role        = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Not set'

  const [notifs, setNotifs]     = useState({ email: true, push: true, critical: false })
  const [security, setSecurity] = useState({ zkProof: false })
  const [ai, setAi]             = useState({ chatbot: true, recs: true, history: true })

  const handleSignOut = () => { disconnect?.(); navigate('/') }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px 0' }}>

        {/* ── Page heading ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>Account</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.04em', color: C.ink, margin: 0 }}>Settings</h1>
        </div>

        {/* ── Identity card ── */}
        <div style={{
          background: C.surface0, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: '24px 24px',
          display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28,
        }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#c9952a,#e8c05a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18, color: '#fff',
          }}>
            {isConnected ? shortAddr.slice(0, 2).toUpperCase() : 'GU'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>{displayName}</div>
            {address && (
              <div style={{ fontSize: 11, color: C.secondary, fontFamily: 'JetBrains Mono, monospace', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {address}
              </div>
            )}
            {userRole && (
              <span style={{
                display: 'inline-block', marginTop: 8, padding: '3px 12px',
                borderRadius: 999, background: C.goldLight,
                color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{role}</span>
            )}
          </div>
          {!isConnected && (
            <button onClick={() => navigate('/onboarding')} style={{
              padding: '10px 20px', borderRadius: 10, background: C.ink,
              border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 13,
              transition: 'opacity 0.15s', flexShrink: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Connect Wallet</button>
          )}
        </div>

        {/* ── Profile ── */}
        <Section title="Profile">
          <Row icon={ic.wallet}  label="Wallet Address"    value={shortAddr}                                last={false} />
          <Row icon={ic.network} label="Network"           value="Sepolia Testnet"                          last={false} />
          <Row icon={ic.role}    label="Role"              value={role}        chevron onClick={() => navigate('/onboarding')} last={false} />
          <Row icon={ic.status}  label="Onboarding Status" value={userRole ? '✓ Complete' : 'Pending'}      last />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          <ToggleRow icon={ic.bell}     label="Email Notifications" value={notifs.email}    onChange={v => setNotifs(n => ({ ...n, email: v }))}    last={false} />
          <ToggleRow icon={ic.push}     label="Push Notifications"  value={notifs.push}     onChange={v => setNotifs(n => ({ ...n, push: v }))}     last={false} />
          <ToggleRow icon={ic.critical} label="Critical Alerts Only"
            hint="When enabled, only loan repayments, funding events, and defaults will trigger notifications."
            value={notifs.critical} onChange={v => setNotifs(n => ({ ...n, critical: v }))} last />
        </Section>

        {/* ── Security ── */}
        <Section title="Security">
          <ToggleRow icon={ic.zk} label="ZK Proof Verification" value={security.zkProof} onChange={v => setSecurity(s => ({ ...s, zkProof: v }))} last={false} />
          <Row icon={ic.key} label="View SBT on Etherscan" chevron
            onClick={() => window.open('https://sepolia.etherscan.io', '_blank')} last />
        </Section>

        {/* ── AI Features ── */}
        <Section title="AI Features">
          <ToggleRow icon={ic.chat}    label="VeilFi AI Chatbot"        value={ai.chatbot}  onChange={v => setAi(a => ({ ...a, chatbot: v }))}  last={false} />
          <ToggleRow icon={ic.star}    label="AI Loan Recommendations"  value={ai.recs}     onChange={v => setAi(a => ({ ...a, recs: v }))}     last={false} />
          <ToggleRow icon={ic.history} label="Loan History Analysis"    value={ai.history}  onChange={v => setAi(a => ({ ...a, history: v }))}  last />
        </Section>

        {/* ── Data & Privacy ── */}
        <Section title="Data & Privacy">
          <Row icon={ic.download} label="Export My ZK Proof Data" chevron last={false} />
          <Row icon={ic.trash}    label="Clear Activity Logs"     chevron danger last />
          <div style={{ padding: '0 20px 14px 68px', fontSize: 12, color: C.secondary }}>
            Clearing activity logs is permanent and cannot be undone.
          </div>
        </Section>

        {/* ── About ── */}
        <Section title="About">
          <Row icon={ic.info}    label="Version"     value="1.0.0"              last={false} />
          <Row icon={ic.network} label="Environment" value="Production"         last={false} />
          <Row icon={ic.backend} label="Backend"     value="Render / FastAPI"   last />
        </Section>

        {/* ── Sign out ── */}
        <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '16px 20px', background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600,
            color: C.red, textAlign: 'center', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {isConnected ? 'Disconnect Wallet' : 'Sign Out'}
          </button>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: 12, color: C.secondary, marginBottom: 0 }}>
          VeilFi v1.0.0 · <span style={{ color: C.gold, fontWeight: 600 }}>ZK Credit Intelligence</span>
        </p>
      </div>
    </div>
  )
}
