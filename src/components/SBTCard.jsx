import TierBadge from './TierBadge.jsx'
import ProgressBar from './ProgressBar.jsx'

/**
 * SBTCard — Soul-Bound Token identity card
 * @prop {object} sbt — { name, tier, score, wallet, avatar, tagline, signals }
 * @prop {string} size — 'sm' | 'md' | 'lg'
 */

const TIER_SCORES = {
  Platinum: 850,
  Gold:     750,
  Silver:   650,
  Bronze:   550,
}

const AVATAR_INITIALS = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const TIER_AVATAR_BG = {
  Platinum: 'bg-surface-container-high text-primary',
  Gold:     'bg-block-cream text-primary',
  Silver:   'bg-surface-container text-secondary',
  Bronze:   'bg-block-coral/30 text-primary',
}

export default function SBTCard({
  sbt = {},
  size = 'md',
  contractUrl = '',
}) {
  const {
    name      = 'Anonymous',
    tier      = 'Silver',
    score     = 700,
    wallet    = '0x0000...0000',
    tagline   = 'DeFi Identity Verified',
    signals   = { upi: true, gst: false, rental: true },
    mintedAt  = null,
  } = sbt

  const maxScore     = TIER_SCORES[tier] || 800
  const scorePct     = Math.round((score / 900) * 100)
  const avatarStyle  = TIER_AVATAR_BG[tier] || TIER_AVATAR_BG.Silver
  const isLarge      = size === 'lg'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-soft shadow-card transition-all duration-300 hover:shadow-card-hover
        ${isLarge ? 'p-8' : 'p-5'}
      `}
    >
      {/* Subtle decorative accent */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/[0.02] pointer-events-none" />

      {/* Header row */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`rounded-2xl flex items-center justify-center font-display font-bold
              ${avatarStyle}
              ${isLarge ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg'}
            `}
          >
            {AVATAR_INITIALS(name)}
          </div>
          <div>
            <h3 className={`font-display font-bold text-primary ${isLarge ? 'text-2xl' : 'text-lg'}`}>
              {name}
            </h3>
            <p className="text-secondary text-xs mt-0.5">{tagline}</p>
          </div>
        </div>
        <TierBadge tier={tier} size={isLarge ? 'md' : 'sm'} />
      </div>

      {/* Score */}
      <div className={`relative ${isLarge ? 'mt-8' : 'mt-5'}`}>
        <div className="flex items-end justify-between mb-2">
          <span className="text-xs text-secondary uppercase tracking-wider font-mono">Credit Score</span>
          <span className={`font-display font-bold text-primary ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
            {score}
          </span>
        </div>
        <ProgressBar value={scorePct} variant="gold" size={isLarge ? 'lg' : 'md'} />
        <div className="flex justify-between text-xs text-secondary mt-1">
          <span>300</span>
          <span>900</span>
        </div>
      </div>

      {/* Verified Signals */}
      {isLarge && (
        <div className="relative mt-6">
          <p className="text-xs text-secondary uppercase tracking-wider mb-3 font-mono">Verified Signals</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(signals).map(([signal, verified]) => (
              <span
                key={signal}
                className={`badge text-xs ${verified ? 'badge-teal' : 'badge-grey opacity-50'}`}
              >
                {verified ? '✓' : '—'} {signal.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Wallet + Proof hash */}
      <div className="relative mt-5 pt-4 border-t border-hairline flex items-center justify-between">
        <span className="text-xs text-secondary font-mono truncate max-w-[60%]">{wallet}</span>
        {mintedAt && (
          <span className="text-xs text-secondary/60">
            Minted {new Date(mintedAt).toLocaleDateString('en-IN')}
          </span>
        )}
        {!mintedAt && (
          contractUrl ? (
            <a
              href={contractUrl}
              target="_blank"
              rel="noreferrer"
              className="badge badge-teal text-xs hover:opacity-80 transition-opacity"
            >
              On-Chain
            </a>
          ) : (
            <span className="badge badge-teal text-xs">
              On-Chain
            </span>
          )
        )}
      </div>
    </div>
  )
}
