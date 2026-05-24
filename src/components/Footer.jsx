import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',          label: 'Home' },
  { to: '/feed',      label: 'Marketplace' },
  { to: '/verify',    label: 'Get Verified' },
  { to: '/circles',   label: 'Circles' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center">
                <span className="text-bg font-display font-bold text-sm">V</span>
              </div>
              <span className="font-display font-bold text-lg">
                Veil<span className="text-gradient-gold">Fi</span>
              </span>
            </div>
            <p className="text-grey text-sm leading-relaxed max-w-xs">
              India's first ZK-powered decentralized credit identity protocol.
              Borrow without bias. Lend with confidence.
            </p>
            <div className="flex gap-3 mt-5">
              {['Twitter', 'Discord', 'GitHub'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-grey hover:text-gold transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-gold/30"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigate</h4>
            <ul className="space-y-2">
              {NAV.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className="text-sm text-grey hover:text-gold transition-colors">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Protocol</h4>
            <ul className="space-y-2">
              {['Whitepaper', 'Smart Contracts', 'ZK Circuits', 'Security Audit', 'Bug Bounty'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-grey hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-grey">
          <span>&copy; {new Date().getFullYear()} VeilFi Protocol. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Docs</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
