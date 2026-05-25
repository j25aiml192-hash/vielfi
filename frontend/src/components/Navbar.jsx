/* ─────────────────────────────────────────────────────────────
   Navbar — Stripe-inspired
   Height: 64px, white bg, border-bottom
   Logo: "VeilFi" wordmark, Inter 600
   Links: Inter 14px, #374151
   CTA: Gold filled "Get Started" button
   Sticky + backdrop blur on scroll
   Dark mode toggle (Lucide Sun/Moon)
───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Sun, Moon, Store, ShieldCheck, Users, LayoutDashboard,
  User, ArrowRight, Menu, X,
} from 'lucide-react'
import WalletButton from './WalletButton.jsx'
import { useWallet } from '../context/WalletContext.jsx'

const LINKS = [
  { to: '/feed',      label: 'Marketplace', icon: Store          },
  { to: '/verify',    label: 'Get Verified', icon: ShieldCheck   },
  { to: '/circles',   label: 'Circles',      icon: Users         },
  { to: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [darkMode,   setDarkMode]   = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isConnected, userRole } = useWallet()

  /* Close mobile menu on route change */
  useEffect(() => setMobileOpen(false), [location])

  /* Scroll listener for backdrop blur */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Dark mode toggle */
  const toggleDark = () => {
    setDarkMode(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  /* Smart CTA */
  const handleGetStarted = () => {
    if (!isConnected)             navigate('/onboarding')
    else if (!userRole)           navigate('/onboarding')
    else if (userRole === 'lender') navigate('/feed')
    else                          navigate('/verify')
  }

  const navStyle = {
    position:       'sticky',
    top:            0,
    zIndex:         100,
    height:         64,
    background:     scrolled ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom:   '1px solid #E5E7EB',
    transition:     'background 300ms cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <header style={navStyle}>
      <div style={{
        maxWidth:       1200,
        margin:         '0 auto',
        padding:        '0 24px',
        height:         '100%',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            24,
      }}>

        {/* ── Logo ── */}
        <NavLink
          to="/"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            8,
            textDecoration: 'none',
            flexShrink:     0,
          }}
        >
          <div style={{
            width:          28,
            height:         28,
            borderRadius:   6,
            background:     '#111827',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color:      '#D4AF37',
              fontWeight: 700,
              fontSize:   14,
              lineHeight: 1,
              fontFamily: "'Inter', sans-serif",
            }}>V</span>
          </div>
          <span style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    600,
            fontSize:      17,
            color:         '#111827',
            letterSpacing: '-0.02em',
          }}>VeilFi</span>
        </NavLink>

        {/* ── Desktop nav links ── */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
          className="hidden-mobile"
        >
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontFamily:     "'Inter', sans-serif",
                fontSize:       14,
                fontWeight:     isActive ? 500 : 400,
                color:          isActive ? '#111827' : '#374151',
                padding:        '6px 12px',
                borderRadius:   6,
                textDecoration: 'none',
                transition:     'color 150ms, background 150ms',
                background:     isActive ? '#F9FAFB' : 'transparent',
                display:        'flex',
                alignItems:     'center',
                gap:            6,
              })}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
              onMouseLeave={e => {
                const active = e.currentTarget.getAttribute('aria-current') === 'page'
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right: dark toggle + profile + wallet + CTA ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={darkMode ? 'Switch to light' : 'Switch to dark'}
            style={{
              width:          32,
              height:         32,
              borderRadius:   6,
              border:         '1px solid #E5E7EB',
              background:     '#FFFFFF',
              color:          '#6B7280',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              transition:     'border-color 150ms, background 150ms',
            }}
            className="hidden-mobile"
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF' }}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Profile link */}
          <NavLink
            to="/profile"
            className="hidden-mobile"
            style={{
              fontFamily:     "'Inter', sans-serif",
              fontSize:       14,
              fontWeight:     400,
              color:          '#374151',
              textDecoration: 'none',
              padding:        '4px 8px',
              display:        'flex',
              alignItems:     'center',
              gap:            5,
            }}
          >
            <User size={14} />
            Profile
          </NavLink>

          {/* Wallet */}
          <div className="hidden-mobile">
            <WalletButton />
          </div>

          {/* Gold CTA */}
          <button
            onClick={handleGetStarted}
            className="hidden-mobile"
            style={{
              height:       36,
              padding:      '0 14px',
              borderRadius: 6,
              background:   '#D4AF37',
              color:        '#111827',
              fontFamily:   "'Inter', sans-serif",
              fontSize:     13,
              fontWeight:   600,
              border:       'none',
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              transition:   'background 150ms, transform 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#B8960C' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#D4AF37' }}
            onMouseDown={e  => { e.currentTarget.style.transform  = 'scale(0.98)' }}
            onMouseUp={e    => { e.currentTarget.style.transform  = 'none' }}
          >
            Get Started
            <ArrowRight size={14} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              width:          36,
              height:         36,
              borderRadius:   6,
              border:         '1px solid #E5E7EB',
              background:     '#FFFFFF',
              color:          '#374151',
              display:        'none',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
            }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {mobileOpen && (
        <div style={{
          background: '#FFFFFF',
          borderTop:  '1px solid #E5E7EB',
          padding:    '12px 24px 20px',
          animation:  'slideDown 200ms cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {[...LINKS, { to: '/profile', label: 'Profile', icon: User }].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display:        'flex',
                alignItems:     'center',
                gap:            8,
                padding:        '10px 12px',
                borderRadius:   6,
                fontFamily:     "'Inter', sans-serif",
                fontSize:       15,
                fontWeight:     isActive ? 500 : 400,
                color:          isActive ? '#111827' : '#374151',
                textDecoration: 'none',
                background:     isActive ? '#F9FAFB' : 'transparent',
                marginBottom:   2,
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <WalletButton />
            <button
              onClick={() => { setMobileOpen(false); handleGetStarted() }}
              style={{
                height:       40,
                padding:      '0 16px',
                borderRadius: 6,
                background:   '#D4AF37',
                color:        '#111827',
                fontFamily:   "'Inter', sans-serif",
                fontSize:     14,
                fontWeight:   600,
                border:       'none',
                cursor:       'pointer',
                display:      'flex',
                alignItems:   'center',
                gap:          6,
              }}
            >
              Get Started
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Inline responsive helpers */}
      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile   { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </header>
  )
}
