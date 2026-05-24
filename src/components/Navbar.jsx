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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0A0B1A] border-b border-[#0A0B1A] shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <span className="text-[#0A0B1A] font-display font-bold text-xs">V</span>
            </div>
            <span className="font-display font-bold text-[17px] text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              VeilFi
            </span>
          </NavLink>

          {/* Desktop Links - Pill style */}
          <div className="hidden md:flex items-center gap-2">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#E39D37] text-[#1A1A1A] border border-[#E39D37]'
                      : 'border border-[#E39D37] text-[#E39D37] hover:bg-[#E39D37]/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: Profile + Wallet */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/profile" className="text-[11px] uppercase tracking-wider font-bold text-white hover:text-[#E39D37] transition-colors">
              Profile
            </NavLink>
            <div className="scale-90 origin-right">
              <WalletButton />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-white hover:text-[#E39D37] transition-colors"
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
        <div className="md:hidden bg-[#0A0B1A] border-t border-white/10 animate-slide-up">
          <div className="px-4 py-4 space-y-2 flex flex-col">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-block text-center ${
                    isActive
                      ? 'bg-[#E39D37] text-[#1A1A1A] border border-[#E39D37]'
                      : 'border border-[#E39D37] text-[#E39D37] hover:bg-[#E39D37]/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink to="/profile" className="block text-center px-4 py-2 rounded-lg text-sm font-bold text-white hover:text-[#E39D37] hover:bg-white/5 transition-colors">
              Profile
            </NavLink>
            <div className="pt-2 flex justify-center">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
