import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import WalletButton from './WalletButton.jsx'
import { useWallet } from '../context/WalletContext.jsx'

const LINKS = [
  { to: '/feed',      label: 'Marketplace' },
  { to: '/verify',    label: 'Get Verified' },
  { to: '/circles',   label: 'Circles' },
  { to: '/dashboard', label: 'Dashboard' },
]

/* ── Role badge config ── */
const ROLE_META = {
  borrower: { icon: '🏦', label: 'Borrower', cls: 'badge-gold' },
  lender:   { icon: '💰', label: 'Lender',   cls: 'badge-teal' },
  both:     { icon: '🔄', label: 'Both',      cls: 'badge-indigo' },
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const location   = useLocation()
  const navigate   = useNavigate()
  const { userRole, clearRole, isConnected, shortAddress } = useWallet()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change
  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [location])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const roleMeta = userRole ? ROLE_META[userRole] : null

  const handleSwitchRole = () => {
    setProfileOpen(false)
    navigate('/onboarding')
  }

  const handleClearRole = () => {
    clearRole()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/90 backdrop-blur-xl border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center shadow-gold">
              <span className="text-bg font-display font-bold text-sm">V</span>
            </div>
            <span className="font-display font-bold text-lg text-white">
              Veil<span className="text-gradient-gold">Fi</span>
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-lg ${isActive ? 'text-gold bg-gold/5' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: Role badge + Profile dropdown + Wallet */}
          <div className="hidden md:flex items-center gap-3">

            {/* Role badge (shown when connected + role set) */}
            {isConnected && roleMeta && (
              <span className={`badge ${roleMeta.cls} text-xs flex items-center gap-1 px-3 py-1`}>
                <span>{roleMeta.icon}</span>
                {roleMeta.label}
              </span>
            )}

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                id="navbar-profile-btn"
                onClick={() => setProfileOpen((p) => !p)}
                className="nav-link hover:text-gold flex items-center gap-1"
              >
                Profile
                <svg className={`w-3 h-3 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-card py-1 animate-fade-in z-50">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-grey hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span>👤</span> My Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-grey hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span>📊</span> Dashboard
                  </NavLink>

                  {/* Switch role */}
                  <div className="border-t border-border my-1" />
                  <button
                    id="navbar-switch-role-btn"
                    onClick={handleSwitchRole}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-grey hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <span>🔄</span>
                    {userRole
                      ? `Switch Role (${ROLE_META[userRole]?.label})`
                      : 'Choose a Role'}
                  </button>

                  {userRole && (
                    <button
                      onClick={handleClearRole}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
                    >
                      <span>✕</span> Clear Role
                    </button>
                  )}
                </div>
              )}
            </div>

            <WalletButton />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-grey hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border animate-slide-up">
          <div className="px-4 py-4 space-y-1">

            {/* Role badge mobile */}
            {isConnected && roleMeta && (
              <div className={`badge ${roleMeta.cls} text-xs inline-flex items-center gap-1 mx-4 mb-2`}>
                <span>{roleMeta.icon}</span> {roleMeta.label} Mode
              </div>
            )}

            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'text-gold bg-gold/5' : 'text-grey hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <NavLink to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-grey hover:text-white hover:bg-white/5 transition-colors">
              Profile
            </NavLink>

            {/* Switch role mobile */}
            <button
              onClick={handleSwitchRole}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-grey hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Switch Role
            </button>

            <div className="pt-2">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
