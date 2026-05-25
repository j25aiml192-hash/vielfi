import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import WalletButton from './WalletButton.jsx'

/* ── Nav items for the slide-in drawer ── */
const NAV_ITEMS = [
  {
    to: '/feed',
    label: 'Markets',
    description: 'Browse live loan listings',
    icon: (
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    to: '/verify',
    label: 'Lending',
    description: 'Verify identity & get credit score',
    icon: (
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    to: '/circles',
    label: 'Borrowing',
    description: 'Create loan requests & join circles',
    icon: (
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
  },
  {
    to: '/dashboard',
    label: 'Governance',
    description: 'Portfolio & repayment dashboard',
    icon: (
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    description: 'Your account & settings',
    icon: (
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

/* ════════════════════════════
   GLOBAL NAV DRAWER
════════════════════════════ */
function NavDrawer({ open, onClose }) {
  const navigate = useNavigate()

  const go = (to) => { onClose(); navigate(to) }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.22)',
          backdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 290,
        background: '#fff',
        boxShadow: '6px 0 40px rgba(0,0,0,0.11)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
      }}>

        {/* Drawer header — matches Navbar height */}
        <div style={{
          height: 56, padding: '0 20px',
          borderBottom: '1px solid #f0ede8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          {/* Logo */}
          <button
            onClick={() => go('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>V</span>
            </div>
            <span style={{
              fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'goldShine 3s ease-in-out infinite',
            }}>VeilFi</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              border: '1px solid #ececec', background: '#faf8f5',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, label, description, icon }) => (
            <button
              key={to}
              onClick={() => go(to)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 12,
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left', marginBottom: 2,
                transition: 'background 0.16s, transform 0.16s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fdf9f3'; e.currentTarget.style.transform = 'translateX(3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(145deg,#fdf8ec,#faf0d8)',
                border: '1px solid rgba(212,175,55,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#c9952a',
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a', marginBottom: 1 }}>{label}</div>
                <div style={{ fontSize: '0.7rem', color: '#999', lineHeight: 1.4 }}>{description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #f0ede8', flexShrink: 0 }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem', color: '#ccc',
            letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center',
          }}>
            Secure &middot; Transparent &middot; Decentralized
          </p>
        </div>
      </div>

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

/* ════════════════════════════
   NAVBAR (sticky, every page)
════════════════════════════ */
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  /* Close drawer on route change */
  useEffect(() => setDrawerOpen(false), [location])

  return (
    <>
      {/* Global slide-in nav drawer */}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#fff',
        borderBottom: '1px solid #f0ede8',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          height: 56,
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* Left: Hamburger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Hamburger — opens global nav drawer */}
            <button
              id="navbar-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              style={{
                width: 36, height: 36, borderRadius: 9,
                border: '1px solid #e8e4df',
                background: '#faf8f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fdf5e0'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(200,160,40,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#faf8f5'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#c9952a" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>V</span>
              </div>
              <span style={{
                fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg,#7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: 'goldShine 3s ease-in-out infinite',
              }}>VeilFi</span>
            </NavLink>
          </div>

          {/* Right: Profile + Wallet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <NavLink
              to="/profile"
              style={{ fontSize: '0.88rem', fontWeight: 500, color: '#666', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.color = '#666'}
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
