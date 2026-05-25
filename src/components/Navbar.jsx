import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import WalletButton from './WalletButton.jsx'
import { useWallet } from '../context/WalletContext.jsx'

const LINKS = [
  { to: '/feed',      label: 'Markets'    },
  { to: '/verify',    label: 'Lending'    },
  { to: '/circles',   label: 'Borrowing'  },
  { to: '/dashboard', label: 'Governance' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isConnected } = useWallet()

  useEffect(() => setMobileOpen(false), [location])

  return (
    <nav className="bg-canvas w-full top-0 sticky border-b border-hairline z-50">
      <div className="flex justify-between items-center h-[56px] px-lg max-w-[1440px] mx-auto">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-on-primary font-sans font-bold text-xs">V</span>
          </div>
          <span className="font-sans font-bold text-headline text-primary tracking-tight">
            VeilFi
          </span>
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-lg">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-opacity ${
                  isActive ? 'text-primary' : 'text-secondary hover:opacity-70'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right: Profile + Wallet */}
        <div className="hidden md:flex items-center gap-md">
          <NavLink
            to="/profile"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Profile
          </NavLink>
          <WalletButton />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden p-2 rounded-lg text-secondary hover:text-primary transition-colors"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-canvas border-t border-hairline animate-slide-up">
          <div className="px-lg py-md space-y-xs flex flex-col max-w-[1440px] mx-auto">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-md py-sm rounded-lg text-sm font-medium transition-colors inline-block ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'text-secondary hover:text-primary hover:bg-surface-container-low'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              className="px-md py-sm rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              Profile
            </NavLink>
            <div className="pt-xs flex">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
