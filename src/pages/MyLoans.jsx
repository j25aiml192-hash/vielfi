/* ─────────────────────────────────────────────────────────────────
   MyLoans.jsx — Full borrower loan view
   Shows: all loans taken, EMI amounts, amortization schedule,
          lender distribution, payment progress, summary stats.
───────────────────────────────────────────────────────────────── */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { getMyLoans } from '../api/index.js'

/* ── Design Tokens ── */
const C = {
  bg:      '#0e0e12',
  surface: '#16161c',
  card:    '#1c1c24',
  border:  '#2a2a38',
  text:    '#f0f0f5',
  muted:   '#7a7a9a',
  gold:    '#f0b429',
  green:   '#22c55e',
  red:     '#ef4444',
  blue:    '#60a5fa',
  purple:  '#a78bfa',
  teal:    '#2dd4bf',
}

const INR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const short = (addr = '') => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '—'

/* ── Status colors ── */
const STATUS_MAP = {
  active:   { bg: '#14532d', color: '#4ade80',  label: 'Active'  },
  funded:   { bg: '#1e3a5f', color: '#60a5fa',  label: 'Funded'  },
  repaid:   { bg: '#2e1065', color: '#a78bfa',  label: 'Repaid'  },
  defaulted:{ bg: '#450a0a', color: '#f87171',  label: 'Default' },
}

const INSTALL_MAP = {
  paid:     { bg: '#14532d', color: '#4ade80',  label: '✓ Paid'    },
  due_soon: { bg: '#713f12', color: '#fbbf24',  label: '⚡ Due Soon' },
  upcoming: { bg: '#1e2535', color: '#7a7a9a',  label: '○ Upcoming' },
}

/* ── Sub-components ── */

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '22px 24px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent || C.text, letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { bg: '#1e2535', color: C.muted, label: status }
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '4px 12px',
      borderRadius: 999, background: s.bg, color: s.color, letterSpacing: '0.05em',
    }}>{s.label}</span>
  )
}

function ProgressBar({ pct, color = C.gold }) {
  return (
    <div style={{ height: 6, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(pct, 100)}%`,
        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
        borderRadius: 99, transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

/* ── Lender Distribution Panel ── */
function DistributionPanel({ distribution, emi_inr }) {
  if (!distribution || distribution.length === 0) {
    return (
      <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
        No lenders yet — this loan hasn't been funded.
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>
        Each lender receives a proportional share of your monthly EMI of {' '}
        <strong style={{ color: C.gold }}>{INR(emi_inr)}</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {distribution.map((d, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `hsl(${i * 67 % 360}, 60%, 40%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.text, fontWeight: 600 }}>
                    {d.lender_short}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {d.payment_method === 'UPI' ? '💳 UPI' : '🔷 ETH'} · {d.eth_contributed.toFixed(4)} ETH
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.green }}>
                  {INR(d.monthly_emi_share_inr)}<span style={{ fontSize: 11, color: C.muted }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>{d.share_pct}% share</div>
              </div>
            </div>
            <ProgressBar pct={d.share_pct} color={`hsl(${i * 67 % 360}, 60%, 55%)`} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── EMI Schedule Panel ── */
function SchedulePanel({ schedule }) {
  const [expanded, setExpanded] = useState(false)
  if (!schedule || schedule.length === 0) {
    return <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No schedule — loan not yet funded.</div>
  }
  const shown = expanded ? schedule : schedule.slice(0, 4)

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['#', 'Due Date', 'EMI', 'Principal', 'Interest', 'Balance', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px', textAlign: h === '#' || h === 'Status' ? 'center' : 'right',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted,
                  ...(h === 'Due Date' ? { textAlign: 'left' } : {})
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((s) => {
              const si = INSTALL_MAP[s.status] || INSTALL_MAP.upcoming
              return (
                <tr key={s.installment} style={{ borderBottom: `1px solid ${C.border}22` }}>
                  <td style={{ padding: '12px 12px', textAlign: 'center', color: C.muted, fontWeight: 600 }}>{s.installment}</td>
                  <td style={{ padding: '12px 12px', color: C.text, fontWeight: 600 }}>{s.due_date}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: C.gold }}>{INR(s.emi_inr)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', color: C.blue }}>{INR(s.principal_inr)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', color: C.red }}>{INR(s.interest_inr)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: C.muted, fontSize: 12 }}>
                    {INR(s.balance_inr)}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px',
                      borderRadius: 999, background: si.bg, color: si.color
                    }}>{si.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {schedule.length > 4 && (
        <button onClick={() => setExpanded(x => !x)} style={{
          width: '100%', marginTop: 12, padding: '10px',
          background: C.border + '44', border: `1px solid ${C.border}`,
          borderRadius: 10, color: C.muted, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.border}
          onMouseLeave={e => e.currentTarget.style.background = C.border + '44'}
        >
          {expanded ? '▲ Show less' : `▼ Show all ${schedule.length} installments`}
        </button>
      )}
    </div>
  )
}

/* ── Loan Card ── */
function LoanCard({ loan }) {
  const [tab, setTab] = useState('overview')  // overview | schedule | distribution

  const fundedPct = loan.funded_percentage || 0
  const repaidPct = loan.total_repayable_inr > 0
    ? Math.min(Math.round((loan.repaid_inr / loan.total_repayable_inr) * 100), 100)
    : 0

  const tabs = [
    { key: 'overview',     label: '📊 Overview' },
    { key: 'schedule',     label: '📅 Schedule' },
    { key: 'distribution', label: '🏦 Lenders' },
  ]

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      {/* Card Header */}
      <div style={{
        background: `linear-gradient(135deg, #1a1a2e, #0f3460)`,
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {loan.purpose || 'Loan'}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              {loan.duration_months} months · {loan.apr}% APR · {loan.credit_tier} tier
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <StatusBadge status={loan.status} />
            {loan.next_due_date && loan.status === 'active' && (
              <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>
                Next EMI: {loan.next_due_date}
              </div>
            )}
          </div>
        </div>

        {/* Key numbers row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Loan Amount',  value: INR(loan.amount_inr),   color: '#fff' },
            { label: 'Monthly EMI',  value: INR(loan.emi_inr),      color: C.gold },
            { label: 'Remaining',    value: INR(loan.remaining_inr), color: '#f87171' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.07em' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Funding progress */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>
            <span>Funded by {loan.funder_count} lenders</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>{fundedPct}%</span>
          </div>
          <ProgressBar pct={fundedPct} color={C.gold} />
        </div>

        {/* Repayment progress */}
        {loan.total_repayable_inr > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>
              <span>Repaid {loan.paid_installments}/{loan.duration_months} installments</span>
              <span style={{ color: C.green, fontWeight: 700 }}>{repaidPct}%</span>
            </div>
            <ProgressBar pct={repaidPct} color={C.green} />
          </div>
        )}
      </div>

      {/* Tab nav */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '13px 8px', border: 'none', cursor: 'pointer',
            background: 'transparent', fontSize: 13, fontWeight: 700,
            color: tab === t.key ? C.gold : C.muted,
            borderBottom: tab === t.key ? `2px solid ${C.gold}` : '2px solid transparent',
            transition: 'color 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{ padding: '24px 28px' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Total Borrowed',      value: INR(loan.amount_inr) },
              { label: 'Total Funded So Far', value: INR(loan.funded_inr) },
              { label: 'Monthly EMI',         value: INR(loan.emi_inr), accent: C.gold },
              { label: 'Total Repayable',     value: INR(loan.total_repayable_inr) },
              { label: 'Total Interest',      value: INR(loan.total_interest_inr), accent: C.red },
              { label: 'Already Repaid',      value: INR(loan.repaid_inr), accent: C.green },
              { label: 'Balance Remaining',   value: INR(loan.remaining_inr), accent: '#f87171' },
              { label: 'Lenders',             value: loan.funder_count + ' funders' },
              { label: 'Duration',            value: `${loan.duration_months} months (${loan.paid_installments} paid)` },
              { label: 'Interest Rate',       value: `${loan.apr}% per annum` },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 0', borderBottom: `1px solid ${C.border}22`,
              }}>
                <span style={{ fontSize: 13, color: C.muted }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: row.accent || C.text }}>{row.value}</span>
              </div>
            ))}

            {/* Story */}
            {loan.story && (
              <div style={{ marginTop: 16, padding: '14px 16px', background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', marginBottom: 6 }}>YOUR LOAN STORY</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{loan.story}</div>
              </div>
            )}
          </div>
        )}

        {tab === 'schedule' && (
          <SchedulePanel schedule={loan.schedule} />
        )}

        {tab === 'distribution' && (
          <DistributionPanel distribution={loan.distribution} emi_inr={loan.emi_inr} />
        )}
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function Skeleton() {
  const p = { background: `linear-gradient(90deg,${C.card} 25%,${C.border} 50%,${C.card} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite', borderRadius: 12 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ ...p, height: 88 }} />)}
      </div>
      {[0,1].map(i => <div key={i} style={{ ...p, height: 320, borderRadius: 20 }} />)}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export default function MyLoans() {
  const { address, isConnected } = useWallet()
  const navigate = useNavigate()

  const [loans,   setLoans]   = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = useCallback(async () => {
    if (!address) { setLoading(false); return }
    setLoading(true)
    setError('')
    try {
      const res = await getMyLoans(address)
      const data = res.data || res
      setLoans(data.loans || [])
      setSummary(data.summary || null)
    } catch (e) {
      setError(e.message || 'Failed to load loans')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { load() }, [load])

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', background: C.bg,
      minHeight: '100vh', paddingBottom: 80,
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 24px 0' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>
              Borrower Portal
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              My Loans
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={load} style={{
              padding: '10px 18px', background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>↻ Refresh</button>
            <button onClick={() => navigate('/verify')} style={{
              padding: '10px 22px', background: C.gold, border: 'none',
              borderRadius: 10, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>+ New Loan</button>
          </div>
        </div>

        {/* ── Not connected ── */}
        {!isConnected && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: C.card, borderRadius: 20, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Connect Your Wallet</div>
            <div style={{ fontSize: 14, color: C.muted }}>Connect MetaMask to view your loan history and EMI schedule.</div>
          </div>
        )}

        {/* ── Error ── */}
        {isConnected && error && (
          <div style={{ padding: '14px 18px', background: '#450a0a', border: '1px solid #ef4444', borderRadius: 12, fontSize: 13, color: '#fca5a5', marginBottom: 24 }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isConnected && loading && <Skeleton />}

        {/* ── No loans ── */}
        {isConnected && !loading && loans.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: C.card, borderRadius: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>No Loans Yet</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
              You haven't taken any loans yet. Get verified and list your first loan.
            </div>
            <button onClick={() => navigate('/verify')} style={{
              padding: '12px 32px', background: C.gold, border: 'none',
              borderRadius: 12, color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Get Verified & Borrow →</button>
          </div>
        )}

        {/* ── Summary stats ── */}
        {isConnected && !loading && summary && loans.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 32 }}>
            <SummaryCard label="Total Loans"     value={summary.total_loans}               accent={C.text} />
            <SummaryCard label="Active Loans"    value={summary.active_loans}              accent={C.green} />
            <SummaryCard label="Total Borrowed"  value={INR(summary.total_borrowed_inr)}   accent={C.gold} />
            <SummaryCard label="Total Funded"    value={INR(summary.total_funded_inr)}     accent={C.blue} />
            <SummaryCard label="Monthly EMI"     value={INR(summary.total_emi_inr)}        accent={C.red}
              sub="across all active loans" />
            <SummaryCard label="Balance Remaining" value={INR(summary.total_remaining_inr)} accent={C.purple} />
          </div>
        )}

        {/* ── Loan cards ── */}
        {isConnected && !loading && loans.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {loans.map(loan => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
