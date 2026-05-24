/**
 * TierBadge — renders a colored tier pill
 * @prop {string} tier — 'Platinum' | 'Gold' | 'Silver' | 'Bronze'
 * @prop {string} size — 'sm' | 'md' | 'lg'
 */

const TIER_CONFIG = {
  Platinum: {
    bg: 'bg-gradient-to-r from-slate-300/20 to-slate-100/10',
    border: 'border-slate-300/40',
    text: 'text-slate-200',
    dot: 'bg-slate-300',
    glow: 'shadow-[0_0_12px_rgba(203,213,225,0.3)]',
    label: 'Platinum',
  },
  Gold: {
    bg: 'bg-gradient-to-r from-gold/20 to-yellow-400/10',
    border: 'border-gold/40',
    text: 'text-gold',
    dot: 'bg-gold',
    glow: 'shadow-gold',
    label: 'Gold',
  },
  Silver: {
    bg: 'bg-gradient-to-r from-grey/20 to-grey/10',
    border: 'border-grey/40',
    text: 'text-grey',
    dot: 'bg-grey',
    glow: '',
    label: 'Silver',
  },
  Bronze: {
    bg: 'bg-gradient-to-r from-orange-900/30 to-orange-800/10',
    border: 'border-orange-700/40',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
    glow: '',
    label: 'Bronze',
  },
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2.5 py-1 gap-1.5',
  md: 'text-sm px-3.5 py-1.5 gap-2',
  lg: 'text-base px-4 py-2 gap-2.5',
}

const DOT_SIZES = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

export default function TierBadge({ tier = 'Silver', size = 'md' }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.Silver
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md
  const dotSize   = DOT_SIZES[size]   || DOT_SIZES.md

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide
        ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClass}`}
    >
      <span className={`rounded-full ${config.dot} ${dotSize}`} />
      {config.label}
    </span>
  )
}
