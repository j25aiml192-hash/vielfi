import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ── Role config ── */
const ROLES = [
  {
    id:    'borrower',
    icon:  '💼',
    title: 'I want to Borrow',
    desc:  'Get a credit identity from your UPI, GST, and rental history. List loan requests and get funded by the community.',
    benefits: [
      'No CIBIL required',
      'UPI history is enough',
      '12–30% APR',
    ],
    cta:      'Start as Borrower',
    redirect: '/verify',
    cardStyle: 'bg-feature-peach text-white',
    btnStyle: 'bg-white text-feature-peach hover:bg-white/90',
  },
  {
    id:    'lender',
    icon:  '🏦',
    title: 'I want to Lend',
    desc:  'Browse verified borrowers and fund their loans directly. Earn returns of 12–30% APR. Track your portfolio.',
    benefits: [
      'All borrowers ZK verified',
      'Direct wallet to wallet',
      'Smart contract automated',
    ],
    cta:      'Start as Lender',
    redirect: '/feed',
    cardStyle: 'bg-feature-teal text-white',
    btnStyle: 'bg-white text-feature-teal hover:bg-white/90',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-canvas font-sans flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-[1080px] w-full">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-display-lg text-5xl md:text-6xl font-bold text-ink mb-4 tracking-tight">
            How will you use VeilFi?
          </h1>
          <p className="font-body-lg text-secondary text-xl font-medium">
            You can always change this later
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
          {ROLES.map((role, i) => (
            <div
              key={role.id}
              className={`rounded-[32px] p-10 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2 cursor-default ${role.cardStyle} shadow-soft`}
              style={{ minHeight: '440px', animationDelay: `${i * 100}ms` }}
            >
              <div>
                {/* Icon + title */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
                    {role.icon}
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest mb-2 inline-block">
                      {role.id}
                    </span>
                    <h2 className="font-headline-md text-3xl font-bold leading-tight tracking-tight">
                      {role.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-[17px] leading-relaxed mb-8 font-medium">
                  {role.desc}
                </p>

                {/* Benefits */}
                <ul className="space-y-4 mb-8">
                  {role.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-base font-bold text-white">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm shrink-0">
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                id={`onboarding-${role.id}-btn`}
                onClick={() => handleSelect(role.id, role.redirect)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${role.btnStyle}`}
              >
                {role.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Both option */}
        <div className="text-center mt-12 animate-fade-in">
          <button
            id="onboarding-both-btn"
            onClick={handleBoth}
            className="text-secondary hover:text-ink font-bold text-lg transition-colors border-b-2 border-transparent hover:border-ink pb-1"
          >
            I want to do Both →
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-secondary/60 text-sm mt-8 font-medium">
          Your role is stored locally. No account creation needed.
        </p>
      </div>
    </div>
  )
}