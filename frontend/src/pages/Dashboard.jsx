import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, DollarSign, CheckCircle, Clock, AlertTriangle,
  Calendar, Zap, Trophy, FileText, Star, ChevronRight, ArrowUp
} from 'lucide-react'
import { getBorrowerDashboard, getLenderDashboard } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'
import AIRecommendations from '../components/AIRecommendations.jsx'
import LoanHistory from '../components/LoanHistory.jsx'
import StarRating from '../components/StarRating.jsx'
import SBTCard from '../components/SBTCard.jsx'

const DEMO_ADDRESS = '0x3d4613bfFc15F8d46Df148F62C31B6d32575B002'

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color = '#D4AF37', change }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
      padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + '18', color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        {change !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: change >= 0 ? '#10B981' : '#EF4444',
            background: change >= 0 ? '#DCFCE7' : '#FEE2E2',
            padding: '2px 7px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <ArrowUp size={10} style={{ transform: change < 0 ? 'rotate(180deg)' : 'none' }} />
            {Math.abs(change)}
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</div>}
    </div>
  )
}

// ── Timeline event ─────────────────────────────────────────────────────────
function TimelineItem({ event, points, icon, date }) {
  const ICONS = {
    CheckCircle: <CheckCircle size={14} />,
    Zap:         <Zap size={14} />,
    FileText:    <FileText size={14} />,
    Trophy:      <Trophy size={14} />,
    DollarSign:  <DollarSign size={14} />,
  }
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: '#FFFBEB', color: '#D4AF37',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #FEF3C7',
      }}>
        {ICONS[icon] || <CheckCircle size={14} />}
      </div>
      <div style={{ flex: 1, paddingTop: 3 }}>
        <div style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{event}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{date}</div>
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, color: '#10B981',
        background: '#DCFCE7', padding: '2px 8px', borderRadius: 10,
      }}>
        +{points} pts
      </span>
    </div>
  )
}

// ── BORROWER DASHBOARD ─────────────────────────────────────────────────────
function BorrowerView({ address }) {
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getBorrowerDashboard(address).then(setData).finally(() => setLoading(false))
  }, [address])

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Loading dashboard…</div>
  if (!data)   return null

  const daysUntilEmi = data.next_emi?.days_remaining
  const showEmiAlert = daysUntilEmi !== null && daysUntilEmi <= 7

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>
            Welcome back, {data.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#6B7280', marginTop: 4 }}>Here's your credit overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/feed')}
            style={{
              padding: '10px 20px', borderRadius: 10, border: '1px solid #E5E7EB',
              background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Browse Loans
          </button>
          <button
            onClick={() => navigate('/verify')}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#D4AF37,#B8960C)',
              color: '#1A1A1A', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}
          >
            + List a Loan
          </button>
        </div>
      </div>

      {/* EMI Alert */}
      {showEmiAlert && data.next_emi && (
        <div style={{
          background: '#FFFBEB', border: '1px solid #FCD34D',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={18} color="#D97706" />
            <div>
              <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14 }}>
                EMI Due in {daysUntilEmi} day{daysUntilEmi !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 12, color: '#B45309' }}>
                ₹{data.next_emi.amount?.toLocaleString()} due on {data.next_emi.due_date} · Pay on time for +15 score points
              </div>
            </div>
          </div>
          <button style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#D4AF37,#B8960C)',
            color: '#1A1A1A', fontWeight: 700, cursor: 'pointer', fontSize: 13,
          }}>
            Pay Now
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="CIBIL Score" value={data.cibil_score} icon={<Star size={18} />} color="#D4AF37" change={data.score_change} />
        <StatCard label="Total Borrowed" value={`₹${((data.total_borrowed || 0) / 1000).toFixed(0)}K`} icon={<DollarSign size={18} />} color="#6366F1" />
        <StatCard label="Repayment Rate" value="100%" icon={<CheckCircle size={18} />} color="#10B981" />
        <StatCard label="Active Loans" value={data.active_loans?.length || 0} icon={<TrendingUp size={18} />} color="#F59E0B" />
      </div>

      {/* Main 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Active Loans */}
          {data.active_loans?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 15 }}>
                Active Loans
              </div>
              {data.active_loans.map((loan, i) => (
                <div key={i} style={{
                  padding: '14px 20px', borderBottom: i < data.active_loans.length - 1 ? '1px solid #F9FAFB' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{loan.purpose}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                      {loan.emis_paid}/{loan.emis_total} EMIs paid · {loan.apr}% APR
                    </div>
                    <div style={{
                      marginTop: 6, height: 6, background: '#F3F4F6', borderRadius: 3,
                      width: 160, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(loan.emis_paid / loan.emis_total) * 100}%`,
                        height: '100%', background: '#D4AF37', borderRadius: 3,
                      }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'JetBrains Mono, monospace' }}>
                      ₹{(loan.amount / 1000).toFixed(0)}K
                    </div>
                    <button
                      onClick={() => navigate(`/loan/${loan.id}`)}
                      style={{
                        marginTop: 4, fontSize: 12, color: '#D4AF37', fontWeight: 600,
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto',
                      }}
                    >
                      View <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reputation Timeline */}
          {data.reputation_timeline?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Reputation Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {data.reputation_timeline.map((t, i) => (
                  <TimelineItem key={i} {...t} />
                ))}
              </div>
            </div>
          )}

          {/* AI Tips */}
          {data.ai_tips?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: '#EDE9FE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={14} color="#7C3AED" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>AI Insights for You</span>
                <span style={{ fontSize: 10, background: '#1A1A2E', color: '#D4AF37', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                  Groq AI
                </span>
              </div>
              {data.ai_tips.map((tip, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: '#FFFBEB',
                  borderLeft: '3px solid #D4AF37', borderRadius: '0 8px 8px 0',
                  fontSize: 13, color: '#374151', marginBottom: 8, lineHeight: 1.5,
                }}>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* Loan History */}
          <LoanHistory address={address} />
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SBTCard
            name={data.name}
            address={address}
            score={data.cibil_score}
            tier="Gold"
            signals={{ upi: true, gst: true, rental: false }}
            compact
          />
          <AIRecommendations role="borrower" address={address} creditScore={data.cibil_score} tier="Gold" />
        </div>
      </div>
    </div>
  )
}

// ── LENDER DASHBOARD ───────────────────────────────────────────────────────
function LenderView({ address }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getLenderDashboard(address).then(setData).finally(() => setLoading(false))
  }, [address])

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Loading portfolio…</div>
  if (!data)   return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>Your Portfolio</h1>
          <p style={{ color: '#6B7280', marginTop: 4 }}>
            Impact Score: <strong style={{ color: '#D4AF37' }}>{data.impact_score}/100</strong> · {data.people_helped} people funded
          </p>
        </div>
        <button
          onClick={() => navigate('/feed')}
          style={{
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#D4AF37,#B8960C)',
            color: '#1A1A1A', fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}
        >
          Browse Loans →
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Total Invested" value={`₹${((data.total_invested || 0) / 1000).toFixed(0)}K`} icon={<DollarSign size={18} />} color="#6366F1" />
        <StatCard label="Returns Earned" value={`₹${((data.total_earned || 0) / 1000).toFixed(1)}K`} icon={<TrendingUp size={18} />} color="#10B981" />
        <StatCard label="Active Loans" value={data.active_investments || 0} icon={<CheckCircle size={18} />} color="#D4AF37" />
        <StatCard label="Avg APR" value={`${data.avg_apr}%`} icon={<Star size={18} />} color="#F59E0B" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Portfolio table */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 15 }}>
              Active Investments
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Borrower', 'Tier', 'Amount', 'APR', 'EMI Status', 'Earned', 'Rating'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.portfolio || []).map((p, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.borrower}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: p.tier === 'Platinum' ? '#EDE9FE' : p.tier === 'Gold' ? '#FEF3C7' : p.tier === 'Silver' ? '#F3F4F6' : '#FEF3C7',
                          color: p.tier === 'Platinum' ? '#7C3AED' : p.tier === 'Gold' ? '#D97706' : p.tier === 'Silver' ? '#6B7280' : '#92400E',
                        }}>{p.tier}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
                        ₹{(p.amount / 1000).toFixed(0)}K
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#10B981', fontWeight: 600 }}>{p.apr}%</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: p.emi_status === 'on_time' ? '#DCFCE7' : '#FEF3C7',
                          color: p.emi_status === 'on_time' ? '#15803D' : '#D97706',
                        }}>
                          {p.emi_status === 'on_time' ? 'On Time' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>
                        ₹{p.earned?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StarRating rating={p.rating} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly returns bar chart */}
          {data.monthly_returns?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Monthly Returns</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
                {data.monthly_returns.map((m, i) => {
                  const max = Math.max(...data.monthly_returns.map(x => x.amount))
                  const h = Math.max(8, (m.amount / max) * 70)
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>
                        ₹{(m.amount / 1000).toFixed(1)}K
                      </div>
                      <div style={{
                        width: '100%', height: h, background: i === data.monthly_returns.length - 1
                          ? 'linear-gradient(180deg,#D4AF37,#B8960C)'
                          : '#E5E7EB',
                        borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease',
                      }} />
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{m.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI recommendations sidebar */}
        <AIRecommendations role="lender" address={address} onFund={(id) => navigate(`/loan/${id}`)} />
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD PAGE ────────────────────────────────────────────────────
export default function Dashboard() {
  const { account, userRole } = useWallet?.() || {}
  const address = account || DEMO_ADDRESS
  const [activeTab, setActiveTab] = useState(userRole === 'lender' ? 'lender' : 'borrower')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* Role tabs */}
      <div style={{
        display: 'inline-flex', background: '#F3F4F6', borderRadius: 10,
        padding: 4, gap: 4, marginBottom: 28,
      }}>
        {['borrower', 'lender'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#111827' : '#6B7280',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}
          >
            {tab === 'borrower' ? '👤 Borrower' : '💰 Lender'}
          </button>
        ))}
      </div>

      {activeTab === 'borrower'
        ? <BorrowerView address={address} />
        : <LenderView   address={address} />
      }
    </div>
  )
}
