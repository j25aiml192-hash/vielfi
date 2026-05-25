import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { getLoansByAddress, getFundingsByAddress } from '../api/index.js'

/* ── Design tokens (matches Landing / Verify) ── */
const C = {
  canvas:   '#fffaf0',
  ink:      '#0a0a0a',
  secondary:'#615e57',
  surface:  '#f5f5f0',
  surface0: '#ffffff',
  border:   '#cac6c3',
  gold:     '#c9952a',
  goldLight:'#fdf5e0',
  teal:     '#008080',
  green:    '#16a34a',
  lavender: '#9966ff',
  peach:    '#ff9966',
}

/* ── helpers ── */
const formatINR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const normalizeKey     = (v) => String(v || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
const normalizeAddress = (v) => String(v || '').trim().toLowerCase()

const adaptLoan = (loan) => {
  const isETH = loan.amount_eth !== undefined;
  
  let amount = Number(loan.amount || 0);
  if (isETH) {
    amount = Number(loan.amount_inr || (loan.amount_eth * 250000));
  }
  
  let fundedAmount = Number(loan.fundedAmount ?? loan.funded ?? 0);
  if (isETH) {
    fundedAmount = Number((loan.funded_amount_eth || 0) * 250000);
  }
  
  const durationMonths = Number(loan.durationMonths || loan.duration || loan.duration_months || 12);
  const interestRate   = Number(loan.apr ?? loan.interestRate ?? 12);
  const creditScore    = Number(loan.credit_score || loan.cibilScore || 750);
  const borrowerName   = loan.borrower_name || loan.borrowerName || 'Anonymous';
  
  return {
    ...loan,
    id:             String(loan.id),
    borrowerName,
    borrower:       loan.borrower || borrowerName,
    borrowerWallet: loan.borrower_address || loan.borrowerWallet || '',
    profileId:      loan.profileId || '',
    tier:           loan.credit_tier || loan.tier || 'Silver',
    purpose:        loan.purpose || 'Loan',
    amount, 
    fundedAmount, 
    durationMonths, 
    interestRate,
    emiAmount:      Number(loan.emiAmount || Math.round((amount * (1 + interestRate / 100)) / Math.max(durationMonths, 1))),
    lenderCount:    Number(loan.funder_count || loan.lenderCount || 0),
    daysRemaining:  Number(loan.daysRemaining ?? loan.daysLeft ?? 30),
    status:         loan.status || 'active',
    lenders:        Array.isArray(loan.lenders) ? loan.lenders : [],
  }
}

const DEMO_BORROWER_LOAN = adaptLoan({
  id: 'demo_borrow_001', borrowerName: 'Rahul Sharma', borrower: 'rahul_shopkeeper',
  tier: 'Gold', cibilScore: 762, amount: 200000, fundedAmount: 154000,
  lenderCount: 8, apr: 11, purpose: 'Working Capital', duration: 12,
  emiAmount: 18500, status: 'active',
})

const DEMO_FUNDED_LOANS = [
  adaptLoan({ id: 'demo_f1', borrowerName: 'Priya Nair',  tier: 'Platinum', amount: 350000, fundedAmount: 350000, lenderCount: 14, apr: 9,  purpose: 'Equipment', duration: 18, emiAmount: 21500, status: 'funded' }),
  adaptLoan({ id: 'demo_f2', borrowerName: 'Anita Meena', tier: 'Silver',   amount: 150000, fundedAmount: 150000, lenderCount: 4,  apr: 13, purpose: 'Inventory', duration: 6,  emiAmount: 26000, status: 'repaid'  }),
]

/* ── Stat Card ── */
function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: C.surface0, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '28px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      transition: 'transform 0.18s, box-shadow 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: accent || C.ink, lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.secondary }}>{label}</span>
    </div>
  )
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    active: { bg: '#ecfdf5', color: '#16a34a', label: 'Active' },
    funded: { bg: '#eff6ff', color: '#2563eb', label: 'Funded' },
    repaid: { bg: '#f5f3ff', color: '#7c3aed', label: 'Repaid' },
  }
  const s = map[status] || { bg: C.surface, color: C.secondary, label: status }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  )
}

/* ── Skeleton loader ── */
function Skeleton() {
  const pulse = { background: 'linear-gradient(90deg,#f0ece4 25%,#e8e4dc 50%,#f0ece4 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite', borderRadius: 10 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{ ...pulse, height: 28, width: '60%' }} />
            <div style={{ ...pulse, height: 12, width: '40%' }} />
          </div>
        ))}
      </div>
      <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
        <div style={{ ...pulse, height: 20, width: 160, marginBottom: 20 }} />
        <div style={{ ...pulse, height: 80, width: '100%' }} />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

/* ── Borrower Dashboard ── */
function BorrowerDashboard({ loans, loading }) {
  const navigate = useNavigate()
  if (loading) return <Skeleton />

  const loan          = loans[0] || DEMO_BORROWER_LOAN
  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0)
  const totalRepaid   = loans.reduce((s, l) => s + Math.min(l.fundedAmount, l.amount), 0)
  const totalPct      = totalBorrowed > 0 ? Math.round((totalRepaid / totalBorrowed) * 100) : 0
  const creditScore   = loan.cibilScore || 762

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="Credit Score"     value={creditScore}              accent={C.gold} />
        <StatCard label="Total Borrowed"   value={formatINR(totalBorrowed)} accent={C.ink} />
        <StatCard label="Total Repaid"     value={formatINR(totalRepaid)}   accent={C.teal} />
        <StatCard label="On-Time Payments" value={Math.max(1, loans.length * 4)} accent={C.lavender} />
      </div>

      {/* CTA */}
      <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Need more funds?</div>
          <div style={{ fontSize: 14, color: C.secondary }}>List a new loan and get funded by the community.</div>
        </div>
        <button onClick={() => navigate('/verify')} style={{
          background: C.ink, color: '#fff', border: 'none', borderRadius: 12,
          padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >List a Loan →</button>
      </div>

      {/* Active Loans */}
      <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>Active Loans</h2>
          <button onClick={() => navigate('/feed')} style={{
            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '8px 18px', fontSize: 13, fontWeight: 600, color: C.ink, cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.ink}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >View Marketplace</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loans.map((l) => {
            const fundedPct = l.amount > 0 ? Math.round((l.fundedAmount / l.amount) * 100) : 0
            return (
              <div key={l.id} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '20px 24px',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{l.purpose}</div>
                    <div style={{ fontSize: 13, color: C.secondary }}>
                      {formatINR(l.amount)} total &nbsp;·&nbsp; {formatINR(l.fundedAmount)} funded
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: C.secondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>EMI</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{formatINR(l.emiAmount)}</div>
                    <div style={{ fontSize: 12, color: C.secondary }}>{l.daysRemaining}d remaining</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${fundedPct}%`, background: `linear-gradient(90deg,${C.gold},#e8c05a)`, borderRadius: 99, transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, minWidth: 36, textAlign: 'right' }}>{fundedPct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overall Repayment */}
      <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: '0 0 20px' }}>Overall Repayment</h2>
        <div style={{ height: 10, background: C.surface, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', width: `${totalPct}%`, background: `linear-gradient(90deg,${C.gold},#e8c05a)`, borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.secondary }}>
          <span>{formatINR(totalRepaid)} repaid</span>
          <span style={{ fontWeight: 700, color: C.gold }}>{totalPct}%</span>
          <span>{formatINR(totalBorrowed - totalRepaid)} remaining</span>
        </div>
      </div>
    </div>
  )
}

/* ── Lender Dashboard ── */
function LenderDashboard({ fundedLoans, loading }) {
  const navigate = useNavigate()
  if (loading) return <Skeleton />

  const totalDeployed = fundedLoans.reduce((s, l) => s + parseFloat(l.amount_eth || l.fundedAmount || 0), 0)
  const activeCount   = fundedLoans.filter(l => l.status !== 'repaid').length
  const avgReturn     = fundedLoans.length
    ? (fundedLoans.reduce((s, l) => s + parseFloat(l.apr || l.interestRate || 10), 0) / fundedLoans.length).toFixed(1)
    : '0.0'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="Total Deployed"  value={`${totalDeployed.toFixed(4)} ETH`} accent={C.gold} />
        <StatCard label="Active Loans"    value={activeCount}                         accent={C.ink} />
        <StatCard label="Avg APR"         value={`${avgReturn}%`}                     accent={C.teal} />
        <StatCard label="Total Fundings"  value={fundedLoans.length}                  accent={C.lavender} />
      </div>

      {/* Impact banner */}
      <div style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: 20, padding: '24px 32px',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#dcfce7', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          🌱
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Your Social Impact</div>
          <div style={{ fontSize: 14, color: C.secondary }}>
            You've helped <span style={{ color: C.green, fontWeight: 700 }}>{fundedLoans.length} people</span> access fair credit on Sepolia testnet.
          </div>
        </div>
        <button onClick={() => navigate('/feed')} style={{
          marginLeft: 'auto', background: C.ink, color: '#fff', border: 'none',
          borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.15s', flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Fund More →</button>
      </div>

      {/* Portfolio table */}
      <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 24 }}>Your Fundings</div>

        {fundedLoans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.secondary, fontSize: 14 }}>
            No fundings yet.{' '}
            <button onClick={() => navigate('/feed')} style={{ color: C.gold, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Browse Marketplace →
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {['Borrower', 'Purpose', 'Status', 'ETH Sent', 'APR', 'TX Hash'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: h === 'Borrower' || h === 'Purpose' ? 'left' : 'right',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: C.secondary, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fundedLoans.map((f, i) => (
                  <tr key={f.id} style={{
                    borderBottom: i < fundedLoans.length - 1 ? `1px solid ${C.border}` : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surface}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 14px', fontWeight: 600, color: C.ink }}>{f.borrower_name || f.borrowerName || 'Unknown'}</td>
                    <td style={{ padding: '14px 14px', color: C.secondary }}>{f.purpose || '—'}</td>
                    <td style={{ padding: '14px 14px', textAlign: 'right' }}><StatusBadge status={f.status} /></td>
                    <td style={{ padding: '14px 14px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: C.ink }}>{parseFloat(f.amount_eth || 0).toFixed(4)} ETH</td>
                    <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 700, color: C.teal }}>{f.apr || f.interestRate || '?'}%</td>
                    <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                      {f.tx_hash ? (
                        <a href={`https://sepolia.etherscan.io/tx/${f.tx_hash}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, color: C.gold, fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none', fontWeight: 600 }}>
                          {f.tx_hash.slice(0, 8)}… ↗
                        </a>
                      ) : <span style={{ color: C.secondary }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════
   MAIN EXPORT
════════════════════════════ */
export default function Dashboard() {
  const { address, isConnected, isBorrower, isLender } = useWallet()
  const navigate = useNavigate()
  const [borrowerRaw, setBorrowerRaw] = useState([])
  const [lenderRaw,   setLenderRaw]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [apiError,    setApiError]    = useState('')
  const [tab,         setTab]         = useState('borrower')

  useEffect(() => {
    if (isBorrower && !isLender) setTab('borrower')
    if (!isBorrower && isLender)  setTab('lender')
  }, [isBorrower, isLender])

  useEffect(() => {
    let alive = true
    if (!address) { setLoading(false); return }
    setLoading(true)
    Promise.all([
      getLoansByAddress(address).catch(() => ({ loans: [] })),
      getFundingsByAddress(address).catch(() => ({ fundings: [] })),
    ]).then(([borrowerData, lenderData]) => {
      if (!alive) return
      setBorrowerRaw(borrowerData?.loans || [])
      setLenderRaw(lenderData?.fundings || [])
      setApiError('')
    }).catch(err => {
      if (alive) setApiError(err.message || 'Network error')
    }).finally(() => {
      if (alive) setLoading(false)
    })
    return () => { alive = false }
  }, [address])

  const borrowerLoans = useMemo(() => borrowerRaw.length > 0 ? borrowerRaw.map(adaptLoan) : [DEMO_BORROWER_LOAN], [borrowerRaw])
  const fundedLoans   = useMemo(() => lenderRaw.length > 0 ? lenderRaw : DEMO_FUNDED_LOANS, [lenderRaw])

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 40px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>Live Portfolio</p>
            <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.04em', color: C.ink, margin: 0, lineHeight: 1.05 }}>
              Your Dashboard
            </h1>
          </div>
          {!isConnected && (
            <div style={{
              fontSize: 13, color: C.secondary,
              border: `1px solid ${C.border}`, borderRadius: 12,
              padding: '10px 18px', background: C.surface,
              whiteSpace: 'nowrap',
            }}>
              Showing demo data — connect wallet for live data
            </div>
          )}
        </div>

        {/* API error */}
        {apiError && (
          <div style={{ marginBottom: 24, padding: '12px 18px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, fontSize: 13, color: '#92400e' }}>
            Marketplace API unavailable. Showing demo data. ({apiError})
          </div>
        )}

        {/* Tab switcher */}
        <div style={{
          display: 'inline-flex', gap: 4, padding: 4,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 999, marginBottom: 32,
        }}>
          {[['borrower', 'Borrower'], ['lender', 'Lender']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '9px 28px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: tab === key ? C.ink : 'transparent',
              color: tab === key ? '#fff' : C.secondary,
            }}
              onMouseEnter={e => { if (tab !== key) e.currentTarget.style.color = C.ink }}
              onMouseLeave={e => { if (tab !== key) e.currentTarget.style.color = C.secondary }}
            >{label}</button>
          ))}
        </div>

        {/* Content */}
        {tab === 'borrower'
          ? <BorrowerDashboard loans={borrowerLoans} loading={loading} />
          : <LenderDashboard   fundedLoans={fundedLoans} loading={loading} />
        }
      </div>
    </div>
  )
}
