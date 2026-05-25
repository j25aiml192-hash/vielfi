import { Star } from 'lucide-react'

/**
 * StarRating — Feature 1
 * Props:
 *   rating     : number (0–5, supports decimals)
 *   count      : number | null
 *   size       : 'sm' | 'md' | 'lg'
 *   interactive: boolean — if true, shows clickable stars
 *   onRate     : (rating: number) => void
 */
export default function StarRating({
  rating = 0,
  count = null,
  size = 'md',
  interactive = false,
  onRate,
  className = '',
}) {
  const sizes = { sm: 14, md: 18, lg: 24 }
  const px = sizes[size] || 18
  const textClass = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size]

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled  = rating >= i + 1
    const partial = !filled && rating > i
    const pct     = partial ? Math.round((rating - i) * 100) : 0
    return { i, filled, partial, pct }
  })

  return (
    <div className={`star-rating ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {stars.map(({ i, filled, partial, pct }) => (
          <span
            key={i}
            onClick={() => interactive && onRate?.(i + 1)}
            style={{
              position: 'relative',
              cursor: interactive ? 'pointer' : 'default',
              display: 'inline-block',
            }}
            title={interactive ? `Rate ${i + 1} star${i ? 's' : ''}` : undefined}
          >
            {/* Background star (grey) */}
            <Star size={px} fill="#E5E7EB" stroke="#E5E7EB" />
            {/* Filled overlay */}
            {(filled || partial) && (
              <span style={{
                position: 'absolute', top: 0, left: 0,
                width: filled ? '100%' : `${pct}%`,
                overflow: 'hidden',
                display: 'inline-block',
              }}>
                <Star size={px} fill="#D4AF37" stroke="#D4AF37" />
              </span>
            )}
          </span>
        ))}
      </div>

      {(rating > 0 || count !== null) && (
        <span className={textClass} style={{ color: '#6B7280', fontWeight: 500 }}>
          {rating > 0 && <strong style={{ color: '#111827' }}>{rating.toFixed(1)}</strong>}
          {count !== null && (
            <span style={{ marginLeft: 2 }}>
              {rating > 0 ? ' ' : ''}({count.toLocaleString()})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
