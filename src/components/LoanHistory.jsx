import { useState, useEffect } from 'react'
import { Trophy, Star, Zap, CheckCircle, Medal, TrendingUp, AlertTriangle } from 'lucide-react'
import { getLoanHistory } from '../api/index.js'

const BADGE_STYLES = {
  'Perfect Payer':      { bg: '#FEF9C3', color: '#CA8A04', icon: <Trophy size={12} /> },
  'Early Repayer':      { bg: '#DCFCE7', color: '#15803D', icon: <Zap size={12} /> },
  'Community Favorite': { bg: '#EDE9FE', color: '#7C3AED', icon: <Star size={12} /> },
  'Trusted Borrower':   { bg: '#DBEAFE', color: '#1D4ED8', icon: <CheckCircle size={12} /> },
  'Rising Star':        { bg: '#FEE2E2', color: '#DC2626', icon: <Medal size={12} /> },
  'Veteran Lender':     { bg: '#F3E8FF', color: '#9333EA', icon: <Trophy size={12} /> },
}

const PERF_COLORS = {
  excellent: { color: '#15803D', bg: '#DCFCE7', label: 'Excellent' },
  good:      { color: '#D97706', bg: '#FEF3C7', label: 'Good' },
  average:   { color: '#CA8A04', bg: '#FEF9C3', label: 'Average' },
  poor:      { color: '#DC2626', bg: '#FEE2E2', label: 'Poor' },
}

const STATUS_COLORS = {
  completed: { color: '#15803D', bg: '#DCFCE7' },
  active:    { color: '#D97706', bg: '#FEF3C7' },
  defaulted: { color: '#DC2626', bg: '#FEE2E2' },
}

function PerformanceGauge({ score }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#D4AF37' : '#EF4444'

  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      <circle cx={55} cy={55} r={r} fill="none" stroke="#F3F4F6" strokeWidth={8} />
      <circle
        cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x={55} y={50} textAnchor="middle" fontSize={20} fontWeight={700} fill="#111827">{score}</text>
      <text x={55} y={65} textAnchor="middle" fontSize={10} fill="#6B7280">/ 100</text>
    </svg>
  )
}

export default function LoanHistory({ address }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    getLoanHistory(address)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [address])

  if (loading) return (
    <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Loading history…</div>
  )
  if (error) return (
    <div style={{ padding: 24, color: '#EF4444', display: 'flex', gap: 8, alignItems: 'center' }}>
      <AlertTriangle size={16} /> {error}
    </div>
  )
  if (!data) return null

  const { summary, loans, badges } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top row: gauge + stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr',
        gap: 24, alignItems: 'center',
        background: '#fff', border: '1px solid #E5E7EB',
        borderRadius: 16, padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <PerformanceGauge score={Math.round(summary.performance_score)} />
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: 600 }}>
            Performance Score
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Total Loans',    value: summary.total_loans },
            { label: 'Completed',      value: summary.completed_loans, color: '#15803D' },
            { label: 'On-Time Rate',   value: `${(summary.on_time_rate * 100).toFixed(0)}%`, color: '#D4AF37' },
            { label: 'Total Repaid',   value: `₹${(summary.total_repaid / 1000).toFixed(0)}K` },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#F9FAFB', borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: color || '#111827', fontFamily: 'JetBrains Mono, monospace' }}>
                {value}
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>EARNED BADGES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {badges.map(b => {
              const s = BADGE_STYLES[b] || { bg: '#F3F4F6', color: '#6B7280', icon: <Star size={12} /> }
              return (
                <span key={b} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 20,
                  background: s.bg, color: s.color,
                  fontSize: 12, fontWeight: 600,
                }}>
                  {s.icon} {b}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Loan table */}
      {loans.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Loan History</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Purpose', 'Amount', 'APR', 'Status', 'Performance', 'Rating', 'EMIs'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loans.map((l, i) => {
                  const sc = STATUS_COLORS[l.status] || STATUS_COLORS.active
                  const pc = PERF_COLORS[l.performance] || PERF_COLORS.good
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        {l.purpose}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: '#374151' }}>
                        ₹{(l.amount / 1000).toFixed(0)}K
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{l.apr}%</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                          fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color,
                        }}>{l.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                          fontSize: 11, fontWeight: 600, background: pc.bg, color: pc.color,
                        }}>{pc.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#D4AF37', fontWeight: 700 }}>
                        {l.final_rating ? `★ ${l.final_rating}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>
                        {l.emis_paid}/{l.emis_total}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
