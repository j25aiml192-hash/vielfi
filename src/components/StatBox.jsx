/* ─────────────────────────────────────────────────────────────
   StatBox — Dashboard stat card
   Props: value, label, trend, trendUp, icon
───────────────────────────────────────────────────────────── */

export default function StatBox({ value, label, trend, trendUp = true, icon }) {
  return (
    <div className="stat-box">
      {icon && (
        <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.6 }}>{icon}</div>
      )}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trendUp ? '' : 'down'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  )
}
