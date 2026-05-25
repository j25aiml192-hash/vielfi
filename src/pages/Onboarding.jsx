import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ── Role config ── */
const ROLES = [
  {
    id:    'borrower',
    icon:  '🏦',
    title: 'I want to Borrow',
    desc:  'Get a credit identity from your UPI, GST, and rental history. List loan requests and get funded by the community.',
    benefits: [
      'No CIBIL required',
      'UPI history is enough',
      '12–30% APR',
    ],
    cta:      'Start as Borrower',
    redirect: '/verify',
    gradient: 'from-yellow-900/30 to-card',
    border:   'border-gold/40',
    btnClass: 'btn-primary',
    badge:    'badge-gold',
  },
  {
    id:    'lender',
    icon:  '💰',
    title: 'I want to Lend',
    desc:  'Browse verified borrowers and fund their loans directly. Earn returns of 12–30% APR. Track your portfolio.',
    benefits: [
      'All borrowers ZK verified',
      'Direct wallet to wallet',
      'Smart contract automated',
    ],
    cta:      'Start as Lender',
    redirect: '/feed',
    gradient: 'from-teal-900/30 to-card',
    border:   'border-teal/40',
    btnClass: 'btn-teal',
    badge:    'badge-teal',
  },
]

export default function Onboarding() {
  const navigate            = useNavigate()
  const { setRole, isConnected, connect } = useWallet()

  const handleSelect = async (roleId, redirect) => {
    if (!isConnected) {
      await connect()
    }
    setRole(roleId)
    navigate(redirect)
  }

  const handleBoth = async () => {
    if (!isConnected) await connect()
    setRole('both')
    navigate('/feed')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 relative">

      {/* Background glow */}
      <div className="absolute inset-0 bg-indigo-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-gold/5 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center shadow-gold">
              <span className="text-bg font-display font-bold text-2xl">V</span>
            </div>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            How will you use{' '}
            <span className="text-gradient-gold">VeilFi?</span>
          </h1>
          <p className="text-grey text-lg">
            You can always change this later
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {ROLES.map((role, i) => (
            <div
              key={role.id}
              className={`card border ${role.border} bg-gradient-to-br ${role.gradient}
                hover:scale-[1.02] hover:shadow-gold transition-all duration-300 flex flex-col`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Icon + title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-4xl flex-shrink-0">
                  {role.icon}
                </div>
                <div>
                  <span className={`badge ${role.badge} text-xs mb-2 inline-block`}>
                    {role.id.toUpperCase()}
                  </span>
                  <h2 className="font-display font-bold text-white text-xl leading-tight">
                    {role.title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p className="text-grey text-sm leading-relaxed mb-5">
                {role.desc}
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6 flex-1">
                {role.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="w-5 h-5 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center text-teal text-xs flex-shrink-0">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                id={`onboarding-${role.id}-btn`}
                onClick={() => handleSelect(role.id, role.redirect)}
                className={`${role.btnClass} w-full justify-center py-3.5 text-base font-semibold`}
              >
                {role.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Both option */}
        <div className="text-center mt-8 animate-fade-in">
          <button
            id="onboarding-both-btn"
            onClick={handleBoth}
            className="text-grey hover:text-white text-sm transition-colors underline underline-offset-4 decoration-grey/40 hover:decoration-white/60"
          >
            I want to do Both →
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-grey/50 text-xs mt-6">
          Your role is stored locally. No account creation needed.
        </p>
      </div>
    </div>
  )
}
