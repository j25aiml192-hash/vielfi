import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { getMarketplace } from '../api/index.js'
import FundLoan from '../components/FundLoan.jsx'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  teal: '#008080', lavender: '#9966ff', peach: '#ff9966',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', pink: '#ff3399',
}

export default function LoanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const [loan, setLoan]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [amount, setAmount]     = useState('')
  const [showFund, setShowFund] = useState(false)

  const loadLoan = () => {
    setLoading(true)
    getMarketplace()
      .then(d => {
        const found = (d.loans || []).find(l => l.id === id)
        setLoan(found || null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLoan()
  }, [id])

  if (loading) return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.secondary }}>
      Loading loan details…
    </div>
  )

  if (!loan) return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>Loan not found</div>
      <button onClick={() => navigate('/feed')} style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 12, padding: '12px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
        Back to Marketplace
      </button>
    </div>
  )

  const fundedPct  = loan.amount_eth > 0 ? Math.min(100, Math.round((loan.funded_amount_eth || 0) / loan.amount_eth * 100)) : 0
  const raisedInr  = ((loan.funded_amount_eth || 0) * 250000).toLocaleString('en-IN')
  const goalInr    = (loan.amount_eth * 250000).toLocaleString('en-IN')
  const tileColors = [C.teal, C.lavender, C.peach, '#e8e8e3']

  const TILES = [
    { label: 'Target APR',    value: `${loan.apr || 12}%`                           },
    { label: 'Term',          value: `${loan.duration_months || 12}m`               },
    { label: 'Total Amount',  value: `${loan.amount_eth} ETH`                       },
    { label: 'LTV',          value: `${loan.collateral_type ? '65%' : 'N/A'}`      },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh' }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 64px 80px' }}>

        {/* Breadcrumb + Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.secondary, fontSize: 14, fontWeight: 600 }}>
            ← Marketplace
          </button>
          <span style={{ color: C.border }}>/</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            background: '#e6f4f4', color: C.teal,
            fontSize: 12, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block' }} />
            {loan.status === 'active' ? 'Active' : loan.status}
          </span>
          <span style={{ fontSize: 14, color: C.secondary }}>{loan.purpose || 'General'}</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, gap: 24 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', margin: 0, maxWidth: 700, lineHeight: 1.1 }}>
            {loan.borrower_name || 'Borrower'} — {loan.purpose || 'Loan'} Facility
          </h1>
          {isConnected && (
            <button
              onClick={() => setShowFund(true)}
              style={{
                background: C.ink, color: C.white, border: 'none', borderRadius: 16,
                padding: '16px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'transform 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Invest Now</button>
          )}
        </div>

        {/* 4 Stat Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
          {TILES.map((t, i) => (
            <div key={t.label} style={{
              background: tileColors[i], borderRadius: 16, padding: '24px 20px',
              color: i === 3 ? C.ink : C.white,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: i === 3 ? 0.7 : 0.8, marginBottom: 10 }}>{t.label}</div>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>{t.value}</div>
            </div>
          ))}
        </div>

        {/* Content: Borrower overview + Funding Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>

          {/* Borrower Overview */}
          <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, padding: '32px' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              🏢 Borrower Overview
            </h3>
            <p style={{ fontSize: 15, color: C.secondary, lineHeight: 1.7, margin: '0 0 16px' }}>
              <strong style={{ color: C.ink }}>{loan.borrower_name}</strong> is requesting ₹{goalInr} ({loan.amount_eth} ETH) for {(loan.purpose || 'general').toLowerCase()} purposes.
              This loan request was submitted on {new Date(loan.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
            <p style={{ fontSize: 15, color: C.secondary, lineHeight: 1.7, margin: '0 0 16px' }}>
              Wallet address: <code style={{ background: C.surface, padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>{loan.borrower_address}</code>
            </p>
            {loan.description && (
              <p style={{ fontSize: 15, color: C.secondary, lineHeight: 1.7, margin: 0 }}>{loan.description}</p>
            )}

            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 28, paddingTop: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Facility Terms</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px' }}>
                {[
                  { label: 'Loan Amount (ETH)', value: `${loan.amount_eth} ETH`          },
                  { label: 'Interest Rate',     value: `${loan.apr || 12}% APR`           },
                  { label: 'Duration',          value: `${loan.duration_months || 12} months` },
                  { label: 'Purpose',           value: loan.purpose || 'General'          },
                  { label: 'Collateral',        value: loan.collateral_type || 'None'     },
                  { label: 'Status',            value: loan.status || 'active'            },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary, marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Funding Progress card */}
          <div style={{ width: 320, background: C.ink, borderRadius: 20, padding: 28, color: C.white }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 20px' }}>Funding Progress</h3>
            <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>{fundedPct}%</div>
            <div style={{ fontSize: 13, opacity: 0.65, marginBottom: 12 }}>Funded</div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 999, height: 8, marginBottom: 12 }}>
              <div style={{ width: `${fundedPct}%`, background: C.teal, height: 8, borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 24, opacity: 0.8 }}>
              <div><div style={{ opacity: 0.65, marginBottom: 2 }}>Raised</div> <div style={{ fontWeight: 700 }}>₹{raisedInr}</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ opacity: 0.65, marginBottom: 2 }}>Goal</div> <div style={{ fontWeight: 700 }}>₹{goalInr}</div></div>
            </div>

            {isConnected ? (
              <>
                <input
                  type="number" step="0.001" placeholder="$ Enter amount"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 12, padding: '12px 16px', color: C.white, fontSize: 14, marginBottom: 12,
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button
                  onClick={() => setShowFund(true)}
                  style={{
                    width: '100%', background: C.teal, color: C.white,
                    border: 'none', borderRadius: 12, padding: '14px 0',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >Participate Now</button>
                <div style={{ textAlign: 'center', fontSize: 12, marginTop: 10, opacity: 0.55 }}>Min. investment 0.001 ETH</div>
              </>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.65, fontSize: 13, marginTop: 8 }}>Connect wallet to fund</div>
            )}
          </div>
        </div>
      </main>

      {/* Fund Modal */}
      {showFund && (
        <FundLoan loan={loan} onClose={() => { setShowFund(false); loadLoan() }} />
      )}
    </div>
  )
}