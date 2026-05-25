/* ─────────────────────────────────────────────────────────────
   Landing Page — Stripe-inspired
   Hero → How It Works → Why VeilFi → For Who → Trust bar
───────────────────────────────────────────────────────────── */
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { useEffect, useState } from 'react'
import { Building2, DollarSign } from 'lucide-react'

/* ── Inline SVG icons ── */
const ICONS = {
  shield:  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap:     <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  users:   <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chart:   <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  lock:    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  globe:   <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  check:   <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:   <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
}

/* ── Section label (eyebrow text) ── */
function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily:    "'JetBrains Mono', monospace",
      fontSize:      11,
      fontWeight:    500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color:         '#D4AF37',
      marginBottom:  16,
    }}>{children}</div>
  )
}

/* ── Step in How It Works ── */
function Step({ n, title, desc }) {
  return (
    <div style={{ textAlign: 'center', flex: '1 1 0', minWidth: 0 }}>
      <div style={{
        width:          44,
        height:         44,
        borderRadius:   '50%',
        background:     n === 1 ? '#D4AF37' : '#F9FAFB',
        border:         `2px solid ${n === 1 ? '#D4AF37' : '#E5E7EB'}`,
        color:          n === 1 ? '#111827' : '#6B7280',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       16,
        fontWeight:     700,
        margin:         '0 auto 14px',
        fontFamily:     "'Inter', sans-serif",
      }}>{n}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8, fontFamily: "'Inter',sans-serif" }}>{title}</div>
      <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, fontFamily: "'Inter',sans-serif" }}>{desc}</div>
    </div>
  )
}

/* ── Why VeilFi: comparison row ── */
function CompareRow({ label, good }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
      <div style={{
        width:          20,
        height:         20,
        borderRadius:   '50%',
        background:     good ? '#D1FAE5' : '#FEE2E2',
        color:          good ? '#065F46' : '#991B1B',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
        marginTop:      1,
      }}>
        {good
          ? <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        }
      </div>
      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>{label}</span>
    </div>
  )
}

export default function Landing() {
  const navigate  = useNavigate()
  const { connect, isConnected, userRole } = useWallet()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleBorrow = async () => {
    if (!isConnected) await connect()
    navigate('/onboarding')
  }
  const handleLend = async () => {
    if (!isConnected) await connect()
    navigate('/feed')
  }

  /* ─── HERO STATS ─── */
  const HERO_STATS = [
    { value: '₹2.4Cr',   label: 'Funded'        },
    { value: '847',       label: 'Borrowers'     },
    { value: '12.8%',     label: 'Avg APR'       },
    { value: '98.2%',     label: 'Repaid'        },
  ]

  /* ─── STEPS ─── */
  const STEPS = [
    { title: 'Connect Wallet',      desc: 'Sign in with MetaMask — no email, no password.' },
    { title: 'Verify Privately',    desc: 'ZK proofs verify your UPI, GST, and rental data without revealing it.' },
    { title: 'Get Your SBT Score',  desc: 'Receive an on-chain Soul-Bound Token with your credit tier.' },
    { title: 'Borrow or Invest',    desc: 'List a loan request or fund one that matches your risk profile.' },
  ]

  /* ─── WHY VEILFI ─── */
  const TRADITIONAL_CONS = [
    'Requires CIBIL score + collateral',
    'Credit bureau shares your data',
    '15–30 day approval process',
    'Capped at bank branch hours',
  ]
  const VEILFI_PROS = [
    'ZK proofs — data never leaves your device',
    'No collateral — reputation-backed lending',
    'On-chain in under 5 minutes',
    'Peer-to-peer, 24/7 liquidity',
  ]

  return (
    <div style={{ background: '#FFFFFF', overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section style={{
        position:   'relative',
        padding:    '96px 24px 80px',
        maxWidth:   1200,
        margin:     '0 auto',
        textAlign:  'center',
        overflow:   'hidden',
      }}>
        {/* Subtle hero gradient — only allowed exception */}
        <div style={{
          position:   'absolute',
          top:        -120,
          left:       '50%',
          transform:  'translateX(-50%)',
          width:      900,
          height:     500,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Eyebrow */}
        <div
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <Eyebrow>India's First ZK Credit Protocol · Sepolia Testnet</Eyebrow>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      'clamp(40px, 6vw, 64px)',
            fontWeight:    700,
            color:         '#111827',
            letterSpacing: '-0.04em',
            lineHeight:    1.08,
            maxWidth:      700,
            margin:        '0 auto 20px',
            opacity:       visible ? 1 : 0,
            transform:     visible ? 'none' : 'translateY(16px)',
            transition:    'all 350ms 50ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          Credit for India's{' '}
          <span style={{
            background:           'linear-gradient(135deg, #D4AF37 0%, #F0D060 60%, #B8960C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>
            300M+ Unbanked
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize:   'clamp(16px, 2vw, 18px)',
            color:      '#6B7280',
            maxWidth:   520,
            margin:     '0 auto 36px',
            lineHeight: 1.6,
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'none' : 'translateY(16px)',
            transition: 'all 400ms 100ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          Privacy-preserving ZK proofs turn your real financial activity
          into on-chain credit — no bank account, no CIBIL, no collateral.
        </p>

        {/* CTAs */}
        <div
          style={{
            display:        'flex',
            gap:            12,
            justifyContent: 'center',
            flexWrap:       'wrap',
            marginBottom:   48,
            opacity:        visible ? 1 : 0,
            transform:      visible ? 'none' : 'translateY(12px)',
            transition:     'all 450ms 150ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <button
            onClick={handleBorrow}
            style={{
              height:       48,
              padding:      '0 28px',
              borderRadius: 8,
              background:   '#D4AF37',
              color:        '#111827',
              fontFamily:   "'Inter', sans-serif",
              fontSize:     15,
              fontWeight:   600,
              border:       'none',
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              transition:   'background 150ms, transform 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#B8960C' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#D4AF37' }}
            onMouseDown={e  => { e.currentTarget.style.transform  = 'scale(0.98)' }}
            onMouseUp={e    => { e.currentTarget.style.transform  = 'none' }}
          >
            Start Borrowing {ICONS.arrow}
          </button>
          <button
            onClick={handleLend}
            style={{
              height:       48,
              padding:      '0 28px',
              borderRadius: 8,
              background:   '#FFFFFF',
              color:        '#111827',
              fontFamily:   "'Inter', sans-serif",
              fontSize:     15,
              fontWeight:   500,
              border:       '1px solid #E5E7EB',
              cursor:       'pointer',
              transition:   'border-color 150ms, background 150ms, transform 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF' }}
            onMouseDown={e  => { e.currentTarget.style.transform   = 'scale(0.98)' }}
            onMouseUp={e    => { e.currentTarget.style.transform   = 'none' }}
          >
            Browse Marketplace
          </button>
        </div>

        {/* Trust line */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            20,
          flexWrap:       'wrap',
          opacity:        visible ? 0.6 : 0,
          transition:     'opacity 600ms 250ms',
        }}>
          {['ZK Privacy', 'On-Chain Proof', 'Ethereum Secured', 'Non-Custodial'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#6B7280', fontFamily: "'Inter',sans-serif" }}>
              <span style={{ color: '#10B981' }}>{ICONS.check}</span>
              {t}
            </div>
          ))}
        </div>

        {/* ── HERO STATS BAR ── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 1,
            maxWidth:            680,
            margin:              '56px auto 0',
            background:          '#E5E7EB',
            borderRadius:        12,
            overflow:            'hidden',
            border:              '1px solid #E5E7EB',
            opacity:             visible ? 1 : 0,
            transform:           visible ? 'none' : 'translateY(12px)',
            transition:          'all 500ms 200ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {HERO_STATS.map(({ value, label }) => (
            <div key={label} style={{
              padding:    '20px 16px',
              background: '#FFFFFF',
              textAlign:  'center',
            }}>
              <div style={{
                fontFamily:    "'Inter', sans-serif",
                fontSize:      24,
                fontWeight:    700,
                color:         '#111827',
                letterSpacing: '-0.03em',
                lineHeight:    1,
                marginBottom:  6,
              }}>{value}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   12,
                color:      '#9CA3AF',
                fontWeight: 400,
              }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>How It Works</Eyebrow>
            <h2 style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      'clamp(26px, 4vw, 36px)',
              fontWeight:    700,
              color:         '#111827',
              letterSpacing: '-0.03em',
              marginTop:     0,
            }}>
              From zero to funded in minutes
            </h2>
          </div>

          {/* Steps row with connecting lines */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', flex: 1, alignItems: 'flex-start', minWidth: 0 }}>
                <Step n={i + 1} title={step.title} desc={step.desc} />
                {i < STEPS.length - 1 && (
                  <div style={{
                    width:        40,
                    height:       2,
                    background:   '#E5E7EB',
                    marginTop:    22,
                    flexShrink:   0,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          WHY VEILFI — comparison cards
      ════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>Why VeilFi</Eyebrow>
            <h2 style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      'clamp(26px, 4vw, 36px)',
              fontWeight:    700,
              color:         '#111827',
              letterSpacing: '-0.03em',
              marginTop:     0,
            }}>
              Traditional lending is broken for 300M Indians
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860, margin: '0 auto' }}>

            {/* Traditional */}
            <div style={{
              background:   '#FFFFFF',
              border:       '1px solid #E5E7EB',
              borderRadius: 12,
              padding:      '28px 28px 32px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EF4444', marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>
                Traditional Banks
              </div>
              {TRADITIONAL_CONS.map(t => <CompareRow key={t} label={t} good={false} />)}
            </div>

            {/* VeilFi */}
            <div style={{
              background:   '#FFFFFF',
              border:       '2px solid #D4AF37',
              borderRadius: 12,
              padding:      '28px 28px 32px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 16, fontFamily: "'Inter',sans-serif" }}>
                VeilFi Protocol
              </div>
              {VEILFI_PROS.map(t => <CompareRow key={t} label={t} good={true} />)}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOR WHO — Borrower / Lender cards
      ════════════════════════════════════════════════════ */}
      <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>Built For</Eyebrow>
            <h2 style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      'clamp(26px, 4vw, 36px)',
              fontWeight:    700,
              color:         '#111827',
              letterSpacing: '-0.03em',
              marginTop:     0,
            }}>
              Two sides of the same protocol
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860, margin: '0 auto' }}>

            {/* Borrower card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 32 }}>
              <div style={{
                width:          48,
                height:         48,
                borderRadius:   12,
                background:     '#FEF3C7',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                marginBottom:   20,
              }}><Building2 size={24} color="#92400E" /></div>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginTop: 0, marginBottom: 10 }}>
                Borrowers
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 }}>
                Street vendors, gig workers, informal businesses — get fair credit based on your real financial activity, not a CIBIL score.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Borrow ₹5k–₹50L', 'APR from 8%', 'No collateral needed', '5-min verification'].map(t => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', fontFamily: "'Inter',sans-serif" }}>
                    <span style={{ color: '#10B981' }}>{ICONS.check}</span>
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleBorrow}
                style={{
                  height:       40,
                  padding:      '0 20px',
                  borderRadius: 6,
                  background:   '#D4AF37',
                  color:        '#111827',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   600,
                  border:       'none',
                  cursor:       'pointer',
                  transition:   'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B8960C' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#D4AF37' }}
              >
                Get Verified
              </button>
            </div>

            {/* Lender card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 32 }}>
              <div style={{
                width:          48,
                height:         48,
                borderRadius:   12,
                background:     '#EEF2FF',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                marginBottom:   20,
              }}><DollarSign size={24} color="#4338CA" /></div>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginTop: 0, marginBottom: 10 }}>
                Lenders
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 }}>
                Individual investors and institutions — access a verified, scored marketplace of loan requests with on-chain repayment history.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['12–18% APR returns', 'Risk-tiered loans', 'On-chain repayments', 'Real-time analytics'].map(t => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', fontFamily: "'Inter',sans-serif" }}>
                    <span style={{ color: '#6366F1' }}>{ICONS.check}</span>
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLend}
                style={{
                  height:       40,
                  padding:      '0 20px',
                  borderRadius: 6,
                  background:   '#111827',
                  color:        '#FFFFFF',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   600,
                  border:       'none',
                  cursor:       'pointer',
                  transition:   'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#374151' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111827' }}
              >
                Explore Marketplace
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background:   '#111827',
            borderRadius: 16,
            padding:      '56px 48px',
          }}>
            <Eyebrow><span style={{ color: '#D4AF37' }}>Join VeilFi</span></Eyebrow>
            <h2 style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      'clamp(24px, 4vw, 36px)',
              fontWeight:    700,
              color:         '#F9FAFB',
              letterSpacing: '-0.03em',
              marginTop:     8,
              marginBottom:  16,
            }}>
              Your financial identity deserves privacy
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 32 }}>
              Connect your wallet and get your ZK credit score in under 5 minutes.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleBorrow}
                style={{
                  height:       44,
                  padding:      '0 24px',
                  borderRadius: 8,
                  background:   '#D4AF37',
                  color:        '#111827',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   600,
                  border:       'none',
                  cursor:       'pointer',
                  transition:   'background 150ms, transform 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B8960C' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#D4AF37' }}
                onMouseDown={e  => { e.currentTarget.style.transform  = 'scale(0.98)' }}
                onMouseUp={e    => { e.currentTarget.style.transform  = 'none' }}
              >
                Get My Credit Score
              </button>
              <button
                onClick={() => navigate('/feed')}
                style={{
                  height:       44,
                  padding:      '0 24px',
                  borderRadius: 8,
                  background:   'transparent',
                  color:        '#F9FAFB',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   500,
                  border:       '1px solid #374151',
                  cursor:       'pointer',
                  transition:   'border-color 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6B7280' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151' }}
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
