/**
 * TierBadge ΓÇö renders a colored tier pill
 * @prop {string} tier ΓÇö 'Platinum' | 'Gold' | 'Silver' | 'Bronze'
 * @prop {string} size ΓÇö 'sm' | 'md' | 'lg'
 */

const TIER_CONFIG = {
  Platinum: {
    bg: 'bg-surface-container-high',
    border: 'border-hairline',
    text: 'text-primary',
    dot: 'bg-primary/60',
    label: 'Platinum',
  },
  Gold: {
    bg: 'bg-block-cream',
    border: 'border-block-cream',
    text: 'text-primary',
    dot: 'bg-accent-magenta',
    label: 'Gold',
  },
  Silver: {
    bg: 'bg-surface-container',
    border: 'border-hairline',
    text: 'text-secondary',
    dot: 'bg-secondary/50',
    label: 'Silver',
  },
  Bronze: {
    bg: 'bg-block-coral/30',
    border: 'border-block-coral/40',
    text: 'text-primary',
    dot: 'bg-block-coral',
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
        ${config.bg} ${config.border} ${config.text} ${sizeClass}`}
    >
      <span className={`rounded-full ${config.dot} ${dotSize}`} />
      {config.label}
    </span>
  )
}