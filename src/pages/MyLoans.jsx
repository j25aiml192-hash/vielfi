/* ─────────────────────────────────────────────────────────────────
   MyLoans.jsx — Full borrower loan view (Light Theme)
   Shows: all loans taken, EMI amounts, amortization schedule,
          lender distribution, payment progress, summary stats.
───────────────────────────────────────────────────────────────── */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { getMyLoans, createPaymentOrder, verifyPayment } from '../api/index.js'

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true)
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

/* ── Design Tokens ── */
const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  teal: '#008080', lavender: '#9966ff', peach: '#ff9966', ochre: '#cc9900',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', pink: '#ff3399', error: '#ba1a1a', green: '#2d6a4f',
  blue: '#3b82f6', purple: '#8b5cf6',
}

const INR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const short = (addr = '') => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '—'

/* ── Status colors ── */
const STATUS_MAP = {
  active:   { bg: '#dcfce7', color: '#166534',  label: 'Active'  },
  funded:   { bg: '#dbeafe', color: '#1e40af',  label: 'Funded'  },
  repaid:   { bg: '#f3e8ff', color: '#6b21a8',  label: 'Repaid'  },
  defaulted:{ bg: '#fee2e2', color: '#991b1b',  label: 'Default' },
}

const INSTALL_MAP = {
  paid:     { bg: '#dcfce7', color: '#166534',  label: '✓ Paid'    },
  due_soon: { bg: '#fef3c7', color: '#92400e',  label: '⚡ Due Soon' },
  upcoming: { bg: C.surface, color: C.secondary,  label: '○ Upcoming' },
}

/* ── Sub-components ── */

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: C.surface0, border: `1px solid rgba(196,199,199,0.3)`,
      borderRadius: 16, padding: '22px 24px',
      display: 'flex', flexDirection: 'column', gap: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || C.ink, letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.secondary }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { bg: C.surface, color: C.secondary, label: status }
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '4px 12px',
      borderRadius: 999, background: s.bg, color: s.color, letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }}>{s.label}</span>
  )
}

function ProgressBar({ pct, color = C.ochre }) {
  return (
    <div style={{ height: 6, background: 'rgba(196,199,199,0.3)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(pct, 100)}%`,
        background: color,
        borderRadius: 99, transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

/* ── Lender Distribution Panel ── */
function DistributionPanel({ distribution, emi_inr }) {
  if (!distribution || distribution.length === 0) {
    return (
      <div style={{ color: C.secondary, fontSize: 14, textAlign: 'center', padding: '30px 0' }}>
        No lenders yet — this loan hasn't been funded.
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 14, color: C.secondary, marginBottom: 20 }}>
        Each lender receives a proportional share of your monthly EMI of {' '}
        <strong style={{ color: C.ink, fontWeight: 800 }}>{INR(emi_inr)}</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {distribution.map((d, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid rgba(196,199,199,0.25)`,
            borderRadius: 16, padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: [C.teal, C.lavender, C.peach, C.ochre, C.pink][i % 5],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: C.white, flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: C.ink, fontWeight: 700 }}>
                    {d.lender_short}
                  </div>
                  <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>
                    {d.payment_method === 'UPI' ? '💳 UPI' : '🔷 ETH'} • {d.eth_contributed.toFixed(4)} ETH
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>
                  {INR(d.monthly_emi_share_inr)}<span style={{ fontSize: 12, color: C.secondary, fontWeight: 500 }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: C.secondary, fontWeight: 600, marginTop: 2 }}>{d.share_pct}% share</div>
              </div>
            </div>
            <ProgressBar pct={d.share_pct} color={[C.teal, C.lavender, C.peach, C.ochre, C.pink][i % 5]} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── EMI Schedule Panel ── */
function SchedulePanel({ loan, schedule, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [paying, setPaying] = useState(null)

  if (!schedule || schedule.length === 0) {
    return <div style={{ color: C.secondary, fontSize: 14, textAlign: 'center', padding: '30px 0' }}>No schedule — loan not yet funded.</div>
  }
  const shown = expanded ? schedule : schedule.slice(0, 4)

  const handlePayEMI = async (s) => {
    setPaying(s.installment)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay SDK failed to load')

      const orderRes = await createPaymentOrder({
        loan_id: loan.id,
        amount_inr: s.emi_inr,
        purpose: `EMI Payment ${s.installment}/${loan.duration_months}`
      })
      
      const { id: order_id, amount, currency } = orderRes.data || orderRes

      const options = {
        key: 'rzp_test_StnL6XnaTW3iLy',
        amount: amount.toString(),
        currency: currency,
        name: 'VeilFi',
        description: `EMI ${s.installment} for ${loan.purpose}`,
        order_id: order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              loan_id: loan.id,
              lender_address: 'EMI_REPAYMENT'
            })
            alert('EMI paid successfully!')
            if (onRefresh) onRefresh()
          } catch (err) {
            alert('Verification failed: ' + (err.response?.data?.detail || err.message))
          }
        },
        prefill: { name: 'Borrower', email: 'borrower@veilfi.io', contact: '9999999999' },
        theme: { color: C.teal }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => { alert(resp.error.description) })
      rzp.open()
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Payment initiation failed')
    } finally {
      setPaying(null)
    }
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid rgba(196,199,199,0.3)` }}>
              {['#', 'Due Date', 'EMI', 'Principal', 'Interest', 'Balance', 'Status', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: h === '#' || h === 'Status' ? 'center' : (h === 'Action' ? 'center' : 'right'),
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.secondary,
                  ...(h === 'Due Date' ? { textAlign: 'left' } : {})
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((s) => {
              const si = INSTALL_MAP[s.status] || INSTALL_MAP.upcoming
              return (
                <tr key={s.installment} style={{ borderBottom: `1px solid rgba(196,199,199,0.2)` }}>
                  <td style={{ padding: '16px 16px', textAlign: 'center', color: C.secondary, fontWeight: 700 }}>{s.installment}</td>
                  <td style={{ padding: '16px 16px', color: C.ink, fontWeight: 600 }}>{s.due_date}</td>
                  <td style={{ padding: '16px 16px', textAlign: 'right', fontWeight: 800, color: C.ink }}>{INR(s.emi_inr)}</td>
                  <td style={{ padding: '16px 16px', textAlign: 'right', color: C.teal, fontWeight: 500 }}>{INR(s.principal_inr)}</td>
                  <td style={{ padding: '16px 16px', textAlign: 'right', color: C.error, fontWeight: 500 }}>{INR(s.interest_inr)}</td>
                  <td style={{ padding: '16px 16px', textAlign: 'right', fontFamily: 'monospace', color: C.secondary, fontSize: 13, fontWeight: 600 }}>
                    {INR(s.balance_inr)}
                  </td>
                  <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 10px',
                      borderRadius: 999, background: si.bg, color: si.color, textTransform: 'uppercase'
                    }}>{si.label}</span>
                  </td>
                  <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                    {s.status !== 'paid' && ['active', 'funded'].includes(loan.status) && (
                      <button 
                        onClick={() => handlePayEMI(s)}
                        disabled={paying === s.installment}
                        style={{
                          padding: '6px 12px', background: C.teal, color: C.white,
                          border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          cursor: paying === s.installment ? 'not-allowed' : 'pointer',
                          opacity: paying === s.installment ? 0.7 : 1
                        }}>
                        {paying === s.installment ? 'Wait...' : 'Pay EMI 💳'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {schedule.length > 4 && (
        <button onClick={() => setExpanded(x => !x)} style={{
          width: '100%', marginTop: 16, padding: '12px',
          background: C.surface, border: `1px solid rgba(196,199,199,0.3)`,
          borderRadius: 12, color: C.ink, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,199,199,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = C.surface}
        >
          {expanded ? '▲ Show less' : `▼ Show all ${schedule.length} installments`}
        </button>
      )}
    </div>
  )
}

/* ── Loan Card ── */
function LoanCard({ loan, onRefresh }) {
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
      background: C.surface0, border: `1px solid rgba(196,199,199,0.3)`,
      borderRadius: 24, overflow: 'hidden', position: 'relative',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      transition: 'transform 0.25s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: C.teal }} />
      
      {/* Card Header */}
      <div style={{ padding: '32px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 6, letterSpacing: '-0.02em' }}>
              {loan.purpose || 'Loan'}
            </div>
            <div style={{ fontSize: 14, color: C.secondary, fontWeight: 500 }}>
              {loan.duration_months} months • {loan.apr}% APR • {loan.credit_tier} tier
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <StatusBadge status={loan.status} />
            {loan.next_due_date && loan.status === 'active' && (
              <div style={{ fontSize: 12, color: C.ochre, fontWeight: 700 }}>
                Next EMI: {loan.next_due_date}
              </div>
            )}
          </div>
        </div>

        {/* Key numbers row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24, padding: '20px', background: C.surface, borderRadius: 16 }}>
          {[
            { label: 'Loan Amount',  value: INR(loan.amount_inr),   color: C.ink },
            { label: 'Monthly EMI',  value: INR(loan.emi_inr),      color: C.teal },
            { label: 'Remaining',    value: INR(loan.remaining_inr), color: C.error },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 12, color: C.secondary, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Funding progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: C.secondary, marginBottom: 8 }}>
              <span>Funded by {loan.funder_count} lenders</span>
              <span style={{ color: C.ink, fontWeight: 800 }}>{fundedPct}%</span>
            </div>
            <ProgressBar pct={fundedPct} color={C.ochre} />
          </div>

          {/* Repayment progress */}
          {loan.total_repayable_inr > 0 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: C.secondary, marginBottom: 8 }}>
                <span>Repaid {loan.paid_installments}/{loan.duration_months} EMIs</span>
                <span style={{ color: C.green, fontWeight: 800 }}>{repaidPct}%</span>
              </div>
              <ProgressBar pct={repaidPct} color={C.green} />
            </div>
          ) : <div />}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        display: 'flex', borderBottom: `1px solid rgba(196,199,199,0.3)`, borderTop: `1px solid rgba(196,199,199,0.3)`,
        background: C.surface,
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '16px 8px', border: 'none', cursor: 'pointer',
            background: tab === t.key ? C.surface0 : 'transparent', fontSize: 14, fontWeight: 700,
            color: tab === t.key ? C.ink : C.secondary,
            borderBottom: tab === t.key ? `2px solid ${C.ink}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{ padding: '32px' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Total Borrowed',      value: INR(loan.amount_inr) },
              { label: 'Total Funded So Far', value: INR(loan.funded_inr) },
              { label: 'Monthly EMI',         value: INR(loan.emi_inr), accent: C.teal },
              { label: 'Total Repayable',     value: INR(loan.total_repayable_inr) },
              { label: 'Total Interest',      value: INR(loan.total_interest_inr), accent: C.error },
              { label: 'Already Repaid',      value: INR(loan.repaid_inr), accent: C.green },
              { label: 'Balance Remaining',   value: INR(loan.remaining_inr), accent: C.ink },
              { label: 'Lenders',             value: loan.funder_count + ' funders' },
              { label: 'Duration',            value: `${loan.duration_months} months (${loan.paid_installments} paid)` },
              { label: 'Interest Rate',       value: `${loan.apr}% per annum` },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: i < 9 ? `1px solid rgba(196,199,199,0.2)` : 'none',
              }}>
                <span style={{ fontSize: 14, color: C.secondary, fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: row.accent || C.ink }}>{row.value}</span>
              </div>
            ))}

            {/* Story */}
            {loan.story && (
              <div style={{ marginTop: 24, padding: '20px', background: C.surface, borderRadius: 16, border: `1px solid rgba(196,199,199,0.3)` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.secondary, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>YOUR LOAN STORY</div>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>{loan.story}</div>
              </div>
            )}
          </div>
        )}

        {tab === 'schedule' && (
          <SchedulePanel loan={loan} schedule={loan.schedule} onRefresh={onRefresh} />
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
  const p = { background: `linear-gradient(90deg,${C.surface0} 25%,${C.surface} 50%,${C.surface0} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite', borderRadius: 16 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ ...p, height: 104 }} />)}
      </div>
      {[0,1].map(i => <div key={i} style={{ ...p, height: 400, borderRadius: 24 }} />)}
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
      fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink,
      minHeight: '100vh', paddingBottom: 80,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px 0' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>
              Borrower Portal
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: C.ink, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              My Loans
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={load} style={{
              padding: '12px 24px', background: C.surface, border: `1px solid rgba(196,199,199,0.3)`,
              borderRadius: 12, color: C.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,199,199,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = C.surface}
            >↻ Refresh</button>
            <button onClick={() => navigate('/verify')} style={{
              padding: '12px 24px', background: C.ink, border: 'none',
              borderRadius: 12, color: C.white, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >+ New Loan</button>
          </div>
        </div>

        {/* ── Not connected ── */}
        {!isConnected && (
          <div style={{
            textAlign: 'center', padding: '100px 32px',
            background: C.surface0, borderRadius: 24, border: `1px solid rgba(196,199,199,0.3)`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>🔗</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Connect Your Wallet</div>
            <div style={{ fontSize: 16, color: C.secondary }}>Connect MetaMask to view your loan history and EMI schedule.</div>
          </div>
        )}

        {/* ── Error ── */}
        {isConnected && error && (
          <div style={{ padding: '16px 24px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, fontSize: 14, color: '#991b1b', marginBottom: 32, fontWeight: 500 }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isConnected && loading && <Skeleton />}

        {/* ── No loans ── */}
        {isConnected && !loading && loans.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '100px 32px', background: C.surface0, borderRadius: 24, border: `1px solid rgba(196,199,199,0.3)`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>📋</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 12 }}>No Loans Yet</div>
            <div style={{ fontSize: 16, color: C.secondary, marginBottom: 32 }}>
              You haven't taken any loans yet. Get verified and list your first loan.
            </div>
            <button onClick={() => navigate('/verify')} style={{
              padding: '14px 36px', background: C.ink, border: 'none',
              borderRadius: 12, color: C.white, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Get Verified & Borrow →</button>
          </div>
        )}

        {/* ── Summary stats ── */}
        {isConnected && !loading && summary && loans.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
            <SummaryCard label="Total Loans"     value={summary.total_loans}               accent={C.ink} />
            <SummaryCard label="Active Loans"    value={summary.active_loans}              accent={C.teal} />
            <SummaryCard label="Total Borrowed"  value={INR(summary.total_borrowed_inr)}   accent={C.ink} />
            <SummaryCard label="Total Funded"    value={INR(summary.total_funded_inr)}     accent={C.blue} />
            <SummaryCard label="Monthly EMI"     value={INR(summary.total_emi_inr)}        accent={C.pink}
              sub="across all active loans" />
            <SummaryCard label="Balance Remaining" value={INR(summary.total_remaining_inr)} accent={C.lavender} />
          </div>
        )}

        {/* ── Loan cards ── */}
        {isConnected && !loading && loans.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {loans.map(loan => (
              <LoanCard key={loan.id} loan={loan} onRefresh={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
