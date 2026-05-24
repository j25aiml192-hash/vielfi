import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import WalletButton from './WalletButton.jsx'

const LINKS = [
  { to: '/feed',      label: 'Marketplace' },
  { to: '/verify',    label: 'Get Verified' },
  { to: '/circles',   label: 'Circles' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

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

          {/* Right: Wallet + Profile */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/profile" className="nav-link hover:text-gold">
              Profile
            </NavLink>
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
            <div className="pt-2">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
