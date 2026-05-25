/* ─────────────────────────────────────────────────────────────
   CreateLoan.jsx — /loans/create
   Real form → POST /api/loans/create → Supabase → redirect /feed
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { createLoan } from '../api/index.js'

const C = {
  bg: '#f4f2ef', surface: '#ffffff', border: '#e0ddd8',
  text: '#1a1a1a', muted: '#888888', gold: '#c9952a',
  green: '#16a34a', red: '#dc2626',
}

const PURPOSES = ['Business', 'Education', 'Medical', 'Equipment', 'Agriculture', 'Personal']
const DURATIONS = [
  { label: '1 month',  value: 1  },
  { label: '3 months', value: 3  },
  { label: '6 months', value: 6  },
  { label: '12 months', value: 12 },
  { label: '24 months', value: 24 },
]

const CAT_COLORS = {
  Business: '#d97706', Education: '#4338ca', Medical: '#059669',
  Equipment: '#0284c7', Agriculture: '#65a30d', Personal: '#7c3aed',
}

const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

// ── Live preview card ──────────────────────────────────────────────────────
function PreviewCard({ form, address }) {
  const color = CAT_COLORS[form.purpose] || '#888'
  const pct   = 0
  const initials = (form.name || 'YO').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
      overflow: 'hidden', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ height: 4, background: color }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `${color}22`, border: `2px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color,
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: 'JetBrains Mono, monospace' }}>
              {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '0x…'}
            </div>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 700,
            color, background: `${color}18`, padding: '3px 10px', borderRadius: 20,
          }}>{form.purpose || 'Purpose'}</span>
        </div>

        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: '0 0 14px' }}>
          {form.story || 'Your story will appear here…'}
        </p>

        <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: '12px 16px', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 3 }}>AMOUNT</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.text }}>
                {form.amountEth ? `${form.amountEth} ETH` : '0 ETH'}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>
                ≈ {fmtINR(parseFloat(form.amountEth || 0) * 250000)}
              </div>
            </div>
            <div style={{ padding: '12px 16px', textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 3 }}>APR</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.gold }}>{form.apr}%</div>
              <div style={{ fontSize: 10, color: C.muted }}>{form.duration} months</div>
            </div>
          </div>
          <div style={{ padding: '10px 16px' }}>
            <div style={{ height: 6, background: '#e0ddd8', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: C.muted }}>
              <span>0% funded</span>
              <span>0 lenders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Input helpers ───────────────────────────────────────────────────────────
function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>{children}</div>
}

function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1px solid ${C.border}`, borderRadius: 8,
        fontSize: 14, color: C.text, background: '#fff',
        outline: 'none', fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = '#999'}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function CreateLoan() {
  const { address, isConnected } = useWallet()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', amountEth: '', purpose: 'Business',
    story: '', duration: 6, apr: 15,
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inrLive = Math.round(parseFloat(form.amountEth || 0) * 250000)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected || !address) {
      setError('Please connect your wallet first.')
      return
    }
    if (!form.amountEth || parseFloat(form.amountEth) <= 0) {
      setError('Enter a valid ETH amount.')
      return
    }
    if (form.story.length < 20) {
      setError('Please write at least 20 characters for your story.')
      return
    }

    setStatus('loading')
    setError('')
    try {
      await createLoan({
        borrower_address: address,
        borrower_name:    form.name || `${address.slice(0, 6)}…`,
        amount_eth:       parseFloat(form.amountEth),
        purpose:          form.purpose,
        story:            form.story,
        apr:              form.apr,
        duration_months:  form.duration,
        credit_tier:      'Silver',
        credit_score:     650,
      })
      setStatus('success')
      setTimeout(() => navigate('/feed'), 2000)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Failed to list loan. Check backend connection.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Loan Listed!</h2>
          <p style={{ color: C.muted, fontSize: 14 }}>Redirecting to marketplace…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'Inter, sans-serif', padding: '32px 16px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            VEILFI / LIST A LOAN
          </div>
          <h1 style={{ fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2rem)', color: C.text, letterSpacing: '-0.03em', margin: 0 }}>
            List Your Loan Request
          </h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
            Tell the community what you need. No bank. No bias. Real ETH.
          </p>
        </div>

        {/* Grid: form left, preview right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Name */}
              <div>
                <Label>Your Name</Label>
                <Input
                  type="text" placeholder="Rahul Patil"
                  value={form.name} onChange={e => set('name', e.target.value)}
                />
              </div>

              {/* Amount */}
              <div>
                <Label>Amount (ETH)</Label>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="number" step="0.001" min="0.001" placeholder="0.01"
                    value={form.amountEth} onChange={e => set('amountEth', e.target.value)}
                    style={{ paddingRight: 80 }}
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: C.muted, fontFamily: 'JetBrains Mono, monospace' }}>ETH</span>
                </div>
                {inrLive > 0 && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                    ≈ {fmtINR(inrLive)} at demo rate (1 ETH = ₹2,50,000)
                  </div>
                )}
              </div>

              {/* Purpose */}
              <div>
                <Label>Purpose</Label>
                <select
                  value={form.purpose} onChange={e => set('purpose', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, background: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                >
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Story */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Label>Your Story</Label>
                  <span style={{ fontSize: 11, color: form.story.length > 260 ? C.red : C.muted }}>{form.story.length}/280</span>
                </div>
                <textarea
                  rows={4} maxLength={280}
                  placeholder="Tell lenders why you need this loan. Be specific — better story = faster funding."
                  value={form.story} onChange={e => set('story', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, background: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#999'}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Duration */}
              <div>
                <Label>Repayment Duration</Label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DURATIONS.map(d => (
                    <button key={d.value} type="button" onClick={() => set('duration', d.value)}
                      style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${form.duration === d.value ? C.gold : C.border}`, background: form.duration === d.value ? '#fef3c7' : '#fff', color: form.duration === d.value ? '#92400e' : C.muted, fontSize: 13, fontWeight: form.duration === d.value ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                    >{d.label}</button>
                  ))}
                </div>
              </div>

              {/* APR Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Label>APR You're Offering</Label>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>{form.apr}%</span>
                </div>
                <input
                  type="range" min={8} max={30} step={0.5}
                  value={form.apr} onChange={e => set('apr', parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: C.gold }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted, marginTop: 4 }}>
                  <span>8% — Conservative</span>
                  <span style={{ color: C.gold }}>Higher APR = faster funding</span>
                  <span>30% — Aggressive</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.red }}>
                  {error}
                </div>
              )}

              {!isConnected && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e' }}>
                  Connect your wallet to list a loan.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading' || !isConnected}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10,
                  background: status === 'loading' ? '#e5e7eb' : 'linear-gradient(135deg, #c9952a, #e8c05a)',
                  border: 'none', color: status === 'loading' ? '#9ca3af' : '#fff',
                  fontWeight: 700, fontSize: 16, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {status === 'loading' ? '⟳ Listing…' : 'List My Loan →'}
              </button>
            </div>
          </form>

          {/* ── PREVIEW ── */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              LIVE PREVIEW
            </div>
            <PreviewCard form={form} address={address} />
          </div>
        </div>
      </div>
    </div>
  )
}
