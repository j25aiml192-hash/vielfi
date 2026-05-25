/**
 * ProgressBar ΓÇö animated progress bar
 * @prop {number}  value   ΓÇö 0-100
 * @prop {string}  variant ΓÇö 'gold' | 'indigo' | 'teal'
 * @prop {string}  label   ΓÇö optional left label
 * @prop {boolean} showPct ΓÇö show percentage on right
 * @prop {string}  size    ΓÇö 'sm' | 'md' | 'lg'
 */

const FILL_CLASSES = {
  gold:   'progress-fill',
  indigo: 'progress-fill-indigo',
  teal:   'progress-fill-teal',
}

const HEIGHT_CLASSES = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export default function ProgressBar({
  value = 0,
  variant = 'gold',
  label,
  showPct = false,
  size = 'md',
  animate = true,
}) {
  const fillClass  = FILL_CLASSES[variant] || FILL_CLASSES.gold
  const heightClass = HEIGHT_CLASSES[size] || HEIGHT_CLASSES.md
  const clamped    = Math.max(0, Math.min(100, value))

  return (
    <div className="w-full">
      {(label || showPct) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-secondary">{label}</span>}
          {showPct && (
            <span className={`text-xs font-semibold ${
              variant === 'gold' ? 'text-primary' :
              variant === 'teal' ? 'text-semantic-success' : 'text-block-lilac'
            }`}>
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-track ${heightClass}`}>
        <div
          className={fillClass}
          style={{
            width: `${clamped}%`,
            transition: animate ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </div>
    </div>
  )
}