/* ─────────────────────────────────────────────────────────────
   Avatar — colored circle with initials
   Color is deterministic from name hash (consistent per person)
───────────────────────────────────────────────────────────── */

const PALETTE = [
  { bg: '#DBEAFE', fg: '#1E40AF' }, // blue
  { bg: '#D1FAE5', fg: '#065F46' }, // green
  { bg: '#EDE9FE', fg: '#5B21B6' }, // purple
  { bg: '#FEE2E2', fg: '#991B1B' }, // red
  { bg: '#FEF3C7', fg: '#92400E' }, // amber
  { bg: '#E0F2FE', fg: '#075985' }, // sky
  { bg: '#F3E8FF', fg: '#7E22CE' }, // violet
  { bg: '#CCFBF1', fg: '#134E4A' }, // teal
]

function nameToIndex(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return hash % PALETTE.length
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const SIZE_MAP = {
  sm:  { wh: 32, font: 11 },
  md:  { wh: 40, font: 14 },
  lg:  { wh: 48, font: 16 },
  xl:  { wh: 64, font: 20 },
  '2xl': { wh: 80, font: 26 },
}

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const { wh, font } = SIZE_MAP[size] || SIZE_MAP.md
  const { bg, fg }   = PALETTE[nameToIndex(name)]
  const initials     = getInitials(name)

  return (
    <div
      className={className}
      style={{
        width:          wh,
        height:         wh,
        borderRadius:   '50%',
        background:     bg,
        color:          fg,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       font,
        fontWeight:     700,
        fontFamily:     "'Inter', sans-serif",
        flexShrink:     0,
        userSelect:     'none',
        letterSpacing:  '-0.01em',
      }}
    >
      {initials}
    </div>
  )
}
