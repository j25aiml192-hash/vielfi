/* ─────────────────────────────────────────────────────────────
   LoadingSkeleton — shimmer placeholder for loading states
   Usage: <LoadingSkeleton width="100%" height={20} rounded />
───────────────────────────────────────────────────────────── */

export function Skeleton({ width = '100%', height = 16, rounded = false, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded ? 9999 : 4,
        flexShrink:   0,
      }}
    />
  )
}

/* Preset card skeleton for loan cards */
export function LoanCardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Skeleton width={40} height={40} rounded />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="55%" height={14} />
          <Skeleton width="35%" height={12} />
        </div>
        <Skeleton width={56} height={20} rounded />
      </div>
      <Skeleton width="40%" height={12} />
      <Skeleton width="100%" height={28} />
      <Skeleton width="90%" height={12} />
      <Skeleton width="80%" height={12} />
      <Skeleton width="100%" height={4} rounded />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="30%" height={12} />
      </div>
      <Skeleton width="100%" height={36} />
    </div>
  )
}

/* Preset stat box skeleton */
export function StatBoxSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton width="50%" height={28} />
      <Skeleton width="70%" height={14} />
      <Skeleton width="40%" height={12} />
    </div>
  )
}

export default Skeleton
