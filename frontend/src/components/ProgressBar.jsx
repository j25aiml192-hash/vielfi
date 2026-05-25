/* ─────────────────────────────────────────────────────────────
   ProgressBar — spec-aligned progress component
   Props:
     value      (0-100)
     color      (CSS color string, default gold)
     height     (px)
     showLabel  (shows % label on right)
     animated   (CSS transition on mount)
     variant    ('gold'|'indigo'|'teal' — legacy support)
───────────────────────────────────────────────────────────── */
import { useEffect, useState } from 'react'

const VARIANT_COLORS = {
  gold:   '#D4AF37',
  indigo: '#6366F1',
  teal:   '#10B981',
  red:    '#EF4444',
  green:  '#22C55E',
}

export default function ProgressBar({
  value     = 0,
  color,
  variant,
  height    = 4,
  showLabel = false,
  animated  = true,
}) {
  const [width, setWidth] = useState(animated ? 0 : value)

  useEffect(() => {
    if (!animated) { setWidth(value); return }
    const t = setTimeout(() => setWidth(value), 50)
    return () => clearTimeout(t)
  }, [value, animated])

  const pct = Math.min(100, Math.max(0, width))
  const barColor = color || VARIANT_COLORS[variant] || '#D4AF37'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div style={{
        flex:         1,
        height:       height,
        background:   '#E5E7EB',
        borderRadius: 9999,
        overflow:     'hidden',
      }}>
        <div style={{
          width:      `${pct}%`,
          height:     '100%',
          background: barColor,
          borderRadius: 9999,
          transition: animated ? 'width 600ms cubic-bezier(0.16,1,0.3,1)' : 'none',
        }} />
      </div>
      {showLabel && (
        <span style={{
          fontSize:   12,
          fontWeight: 600,
          color:      barColor,
          minWidth:   32,
          textAlign:  'right',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}
