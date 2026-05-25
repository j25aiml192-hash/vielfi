import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react'
import { getAIRecommendationsForLender, getAIRecommendationsForBorrower } from '../api/index.js'
import StarRating from './StarRating.jsx'

const RISK_COLORS = {
  Low:    { bg: '#DCFCE7', color: '#15803D' },
  Medium: { bg: '#FEF3C7', color: '#D97706' },
  High:   { bg: '#FEE2E2', color: '#DC2626' },
}

export default function AIRecommendations({ role = 'lender', address, creditScore, tier, onFund }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!address) return
    setLoading(true)

    const req = role === 'lender'
      ? getAIRecommendationsForLender({
          lender_address: address, risk_appetite: 'medium',
          preferred_duration: 12, min_apr: 10, max_amount: 100000,
        })
      : getAIRecommendationsForBorrower({
          borrower_address: address, credit_score: creditScore || 750,
          tier: tier || 'Gold', amount: 200000, purpose: 'Working Capital', duration: 12,
        })

    req.then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [address, role])

  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB',
      borderRadius: 16, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #7C3AED 100%)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Sparkles size={18} color="#D4AF37" />
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {role === 'lender' ? 'AI Top Picks For You' : 'Optimize Your Listing'}
          </div>
          <div style={{ color: '#A0AEC0', fontSize: 11, marginTop: 1 }}>Powered by Groq · llama-3.3-70b</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF' }}>
            <Sparkles size={24} style={{ marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
            <div style={{ fontSize: 13 }}>AI is analyzing portfolios…</div>
          </div>
        )}

        {error && (
          <div style={{ color: '#EF4444', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* LENDER: recommended loans */}
        {!loading && !error && role === 'lender' && data?.recommendations && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.recommendations.map((rec, i) => {
              const risk = RISK_COLORS[rec.risk_level] || RISK_COLORS.Medium
              return (
                <div key={i} style={{
                  border: '1px solid #E5E7EB', borderRadius: 12, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 10,
                  background: i === 0 ? '#FFFBEB' : '#FAFAFA',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                        {rec.loan_id?.replace('loan_', 'Loan #')}
                        {i === 0 && <span style={{ marginLeft: 6, fontSize: 10, background: '#D4AF37', color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>🏆 TOP PICK</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{rec.ai_reasoning}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#D4AF37' }}>
                        {rec.match_score}%
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>match</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#15803D', background: '#DCFCE7', padding: '2px 10px', borderRadius: 20 }}>
                      +{rec.expected_return_pct}% APR
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: risk.bg, color: risk.color }}>
                      {rec.risk_level} Risk
                    </span>
                    {rec.borrower_highlights?.map((h, j) => (
                      <span key={j} style={{ fontSize: 11, color: '#6B7280' }}>• {h}</span>
                    ))}
                  </div>

                  <button
                    onClick={() => onFund?.(rec.loan_id)}
                    style={{
                      background: 'linear-gradient(135deg,#D4AF37,#B8960C)',
                      color: '#1A1A1A', border: 'none', borderRadius: 8,
                      padding: '8px 16px', fontWeight: 700, fontSize: 13,
                      cursor: 'pointer', alignSelf: 'flex-start',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <TrendingUp size={14} /> Fund Now
                  </button>
                </div>
              )
            })}

            {/* Portfolio analysis */}
            {data.portfolio_analysis && (
              <div style={{
                marginTop: 8, padding: 14, background: '#F9FAFB',
                borderRadius: 10, border: '1px solid #E5E7EB',
              }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                  PORTFOLIO INSIGHT
                </div>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4, color: '#10B981' }} />
                  {data.portfolio_analysis.suggested_diversification}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: '#D4AF37' }}>
                  Projected Annual Return: ₹{data.portfolio_analysis.projected_annual_return?.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BORROWER view */}
        {!loading && !error && role === 'borrower' && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Recommended APR', value: `${data.recommended_apr}%`, color: '#D4AF37' },
                { label: 'Success Probability', value: `${(data.success_probability * 100).toFixed(0)}%`, color: '#10B981' },
                { label: 'Avg Market APR', value: `${data.similar_borrowers?.avg_apr}%`, color: '#6366F1' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: '#F9FAFB', borderRadius: 10, padding: '12px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {data.ai_tips?.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#6B7280', marginBottom: 8 }}>AI TIPS FOR YOU</div>
                {data.ai_tips.map((tip, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', background: '#FFFBEB',
                    borderLeft: '3px solid #D4AF37', borderRadius: '0 8px 8px 0',
                    fontSize: 13, color: '#374151', marginBottom: 6,
                  }}>
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
