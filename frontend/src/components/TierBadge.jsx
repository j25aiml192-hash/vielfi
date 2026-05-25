/* ─────────────────────────────────────────────────────────────
   TierBadge — spec-aligned pill badges for loan tier system
   Usage: <TierBadge tier="Gold" />
───────────────────────────────────────────────────────────── */

const TIER_STYLES = {
  Platinum: 'bg-tier-platinum-bg text-tier-platinum-text',
  Gold:     'bg-tier-gold-bg     text-tier-gold-text',
  Silver:   'bg-tier-silver-bg   text-tier-silver-text',
  Bronze:   'bg-tier-bronze-bg   text-tier-bronze-text',
}

const TIER_DOT = {
  Platinum: '#6366F1',
  Gold:     '#D97706',
  Silver:   '#6B7280',
  Bronze:   '#B45309',
}

export default function TierBadge({ tier, size = 'sm' }) {
  const cls    = TIER_STYLES[tier] || TIER_STYLES.Silver
  const dot    = TIER_DOT[tier]    || TIER_DOT.Silver
  const isLg   = size === 'lg'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap ${cls}`}
      style={{
        fontSize:   isLg ? 13 : 11,
        padding:    isLg ? '3px 10px' : '2px 8px',
        lineHeight: isLg ? '20px' : '18px',
      }}
    >
      <span
        style={{
          width:        isLg ? 7 : 5,
          height:       isLg ? 7 : 5,
          borderRadius: '50%',
          background:   dot,
          flexShrink:   0,
          display:      'inline-block',
        }}
      />
      {tier}
    </span>
  )
}
