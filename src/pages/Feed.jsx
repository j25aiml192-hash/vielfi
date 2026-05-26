import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import FundLoan from '../components/FundLoan.jsx'
import { getMarketplace } from '../api/index.js'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  pink: '#ff3399', teal: '#008080', lavender: '#9966ff',
  peach: '#ff9966', ochre: '#cc9900',
  surface: '#f4f4ef', border: '#cac6c3', white: '#ffffff',
}

const CARD_COLORS = [C.pink, C.teal, C.lavender, C.peach, C.ochre, '#2d6a4f']
const CATEGORIES = ['All Markets', 'Asset-Backed', 'Unsecured', 'Real Estate', 'Agriculture', 'Technology']
const CAT_ICONS = ['☰', '🏦', '🔓', '🏠', '🌾', '💻']

/* ── Star rating helper ── */
function Stars({ rating, color }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={14} height={14} viewBox="0 0 20 20" fill={i <= rating ? '#fff' : 'rgba(255,255,255,0.3)'}>
          <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78z"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Loan Detail Modal — Golden Ratio φ=1.618 ── */
const φ = 1.618
function LoanDetailModal({ loan, color, onClose, onFund }) {
  const fundedPct = loan.amount_eth > 0 ? Math.min(100, Math.round((loan.funded_amount_eth / loan.amount_eth) * 100)) : 0
  const inr = (loan.amount_eth * 250000).toLocaleString('en-IN')
  const daysLeft = loan.duration_months ? loan.duration_months * 30 : 90
  const rating = Math.min(5, Math.max(1, Math.round(fundedPct / 20) + (loan.apr < 15 ? 1 : 0)))

  /* φ-scaled sizes */
  const base        = 10                          // base unit px
  const sm          = Math.round(base * φ)        // 16px
  const md          = Math.round(base * φ * φ)   // 26px
  const lg          = Math.round(base * φ * φ * φ) // 42px
  const pad         = Math.round(base * φ * φ)   // 26px → header padding
  const avatarSize  = Math.round(base * φ * φ * φ * 0.8) // ~34 → we'll use 52 manually but base gap on φ
  const gap         = Math.round(base * φ)        // 16px gap
  const radius      = Math.round(base * φ)        // 16px → card border radius
  const modalRadius = Math.round(base * φ * φ)   // 26px → modal border radius

  const stats = [
    { label: 'Loan Amount',    value: `₹${inr}` },
    { label: 'ETH Equivalent', value: `${loan.amount_eth} ETH` },
    { label: 'Interest Rate',  value: `${loan.apr || 12}% APR` },
    { label: 'Duration',       value: `${loan.duration_months || 3} Months` },
    { label: 'Funded',         value: `${fundedPct}%` },
    { label: 'Days Left',      value: `${daysLeft} days` },
    { label: 'Purpose',        value: loan.purpose || 'General' },
    { label: 'Risk Level',     value: fundedPct > 70 ? '🟢 Low' : fundedPct > 40 ? '🟡 Medium' : '🔴 High' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:'fixed', inset:0, zIndex:10000,
        background:'rgba(10,10,10,0.55)',
        backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        animation:'fadeIn 0.2s ease',
      }} />

      {/* Modal — width uses φ: ~580px wide, height split φ:1 (header:body) */}
      <div style={{
        position:'fixed', top:'50%', left:'50%', zIndex:10001,
        transform:'translate(-50%,-50%)',
        width:`min(${Math.round(360 * φ)}px, 94vw)`,  /* 582px */
        maxHeight:'90vh',
        background:'rgba(255,252,245,0.93)',
        backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
        borderRadius: modalRadius,
        border:'1px solid rgba(201,149,42,0.25)',
        boxShadow:'0 48px 120px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.85)',
        overflow:'hidden',
        animation:'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        display:'flex', flexDirection:'column',
        fontFamily:"'Inter', -apple-system, sans-serif",
      }}>

        {/* ── Header — φ proportion of modal ── */}
        <div style={{
          background:`linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          padding: `${pad}px ${pad}px ${Math.round(pad/φ)}px`,
          position:'relative', overflow:'hidden', flexShrink:0,
        }}>
          {/* Ghost emoji background */}
          <div style={{ position:'absolute', right: pad, top:0, fontSize: lg * 2.5, opacity:0.10, lineHeight:1, userSelect:'none' }}>
            {loan.purpose === 'Business' ? '💼' : loan.purpose === 'Education' ? '📚' : loan.purpose === 'Medical' ? '🏥' : '💡'}
          </div>

          {/* Top row: avatar + info + close */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap: gap }}>
              {/* Avatar — size = φ³ × base ≈ 42px */}
              <div style={{
                width: Math.round(base * φ * φ * φ * 0.98),
                height: Math.round(base * φ * φ * φ * 0.98),
                borderRadius:'50%',
                background:'rgba(255,255,255,0.22)',
                border:`${Math.round(φ)}px solid rgba(255,255,255,0.55)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: sm, fontWeight:900, color:'#fff',
                boxShadow:'0 4px 16px rgba(0,0,0,0.15)',
              }}>
                {(loan.borrower_name || 'A').slice(0,2).toUpperCase()}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {/* Name — φ² × base = 26px */}
                <div style={{ fontSize: Math.round(base * φ * 1.2), fontWeight:900, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1 }}>
                  {loan.borrower_name || 'Anonymous'}
                </div>
                {/* Purpose — base × φ⁰·⁵ ≈ 13px */}
                <div style={{ fontSize: Math.round(base * 1.27), color:'rgba(255,255,255,0.78)', fontWeight:600 }}>
                  {loan.purpose || 'General'}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                  <Stars rating={rating} />
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.65)', fontWeight:600 }}>{rating}.0 / 5.0</span>
                </div>
              </div>
            </div>

            {/* Close btn — size = φ² × base ≈ 26px */}
            <button onClick={onClose} style={{
              width: md, height: md, borderRadius:'50%',
              background:'rgba(255,255,255,0.18)',
              border:'1px solid rgba(255,255,255,0.28)',
              color:'#fff', fontSize:14, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, flexShrink:0, lineHeight:1,
              transition:'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
            >×</button>
          </div>

          {/* Amount row */}
          <div style={{ marginTop: gap, position:'relative' }}>
            <div style={{ fontSize: base, color:'rgba(255,255,255,0.65)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>
              Loan Amount
            </div>
            {/* Amount font — φ⁴ × base ≈ 68px */}
            <div style={{ fontSize:`clamp(28px, 5vw, ${Math.round(base * φ * φ * φ * φ * 0.6)}px)`, fontWeight:900, color:'#fff', letterSpacing:'-0.04em', lineHeight:1 }}>
              ₹{inr}
            </div>
            <div style={{ fontSize: Math.round(base * 1.1), color:'rgba(255,255,255,0.65)', marginTop:6 }}>
              {loan.amount_eth} ETH · {loan.apr || 12}% APR
            </div>
          </div>
        </div>

        {/* ── Body — scrollable ── */}
        <div style={{ overflowY:'auto', padding: `${gap}px ${pad}px ${pad}px`, flex:1, display:'flex', flexDirection:'column', gap: gap }}>

          {/* Stats grid — φfr : 1fr columns */}
          <div style={{ display:'grid', gridTemplateColumns:`${φ}fr 1fr`, gap: Math.round(gap / φ) }}>
            {stats.map(s => (
              <div key={s.label} style={{
                background:'rgba(255,255,255,0.72)',
                border:'1px solid rgba(201,149,42,0.14)',
                borderRadius: radius,
                padding:`${Math.round(gap / φ)}px ${gap}px`,
                backdropFilter:'blur(10px)',
              }}>
                <div style={{ fontSize: Math.round(base * 0.9), fontWeight:700, letterSpacing:'0.1em', color:'#9a8a70', textTransform:'uppercase', marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize: sm, fontWeight:800, color:'#0a0a0a', letterSpacing:'-0.01em', lineHeight: φ }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Funding progress */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: Math.round(gap/φ), fontSize: sm - 2, fontWeight:700, color:'#0a0a0a' }}>
              <span>Funding Progress</span>
              <span style={{ color }}>{fundedPct}%</span>
            </div>
            {/* Bar height = φ × base ÷ φ² = base/φ ≈ 6px → use 8px */}
            <div style={{ background:'#e8e4dc', borderRadius:999, height: Math.round(base / φ * 1.2), overflow:'hidden' }}>
              <div style={{ width:`${fundedPct}%`, height:'100%', background:`linear-gradient(90deg,${color},${color}88)`, borderRadius:999, transition:'width 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>

          {/* Credit Timeline */}
          <div>
            <div style={{ fontSize: base, fontWeight:700, letterSpacing:'0.1em', color:'#9a8a70', textTransform:'uppercase', marginBottom: gap }}>
              Credit Timeline
            </div>
            {['Application Submitted','KYC Verified','Credit Score Assessed','Listed on Marketplace'].map((step, i) => (
              <div key={i} style={{ display:'flex', gap: gap, alignItems:'flex-start', marginBottom: i < 3 ? Math.round(gap / φ) : 0 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{
                    width: Math.round(gap * φ * 0.9), height: Math.round(gap * φ * 0.9), borderRadius:'50%',
                    background: i <= 2 ? '#0a0a0a' : 'rgba(201,149,42,0.15)',
                    border: i <= 2 ? 'none' : '1.5px solid rgba(201,149,42,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: base - 1, fontWeight:900, color:'#fff',
                  }}>{i <= 2 ? '✓' : '·'}</div>
                  {i < 3 && <div style={{ width:1.5, height: Math.round(gap * φ * 0.7), background: i < 2 ? '#0a0a0a' : 'rgba(201,149,42,0.25)', marginTop:2 }} />}
                </div>
                <div style={{ paddingTop:2, fontSize: Math.round(base * 1.2), fontWeight: i <= 2 ? 600 : 400, color: i <= 2 ? '#0a0a0a' : '#9a8a70', lineHeight: φ }}>
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons — φ:1 width ratio */}
          <div style={{ display:'flex', gap: Math.round(gap / φ) }}>
            <button
              onClick={() => { onFund(loan); onClose() }}
              style={{
                flex: φ, background: color, color:'#fff',   /* φ wider = primary action */
                border:'none', borderRadius: radius, padding:`${Math.round(gap * 0.8)}px 0`,
                fontSize: sm - 1, fontWeight:800, cursor:'pointer',
                boxShadow:`0 ${Math.round(gap/2)}px ${gap * 2}px ${color}44`,
                transition:'opacity 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='scale(1)' }}
            >Fund This Loan</button>
            <button
              onClick={onClose}
              style={{
                flex: 1, background:'rgba(255,255,255,0.7)', color:'#0a0a0a',
                border:'1px solid rgba(201,149,42,0.22)', borderRadius: radius,
                padding:`${Math.round(gap * 0.8)}px 0`,
                fontSize: sm - 1, fontWeight:700, cursor:'pointer',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.95)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.7)'}
            >Close</button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,-44%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
      `}</style>
    </>
  )
}

/* ── Loan Card ── */
function LoanCard({ loan, idx, onFund }) {
  const [showDetail, setShowDetail] = useState(false)
  const color = CARD_COLORS[idx % CARD_COLORS.length]
  const fundedPct = loan.amount_eth > 0 ? Math.min(100, Math.round((loan.funded_amount_eth / loan.amount_eth) * 100)) : 0
  const inr = (loan.amount_eth * 250000).toLocaleString('en-IN')
  const daysLeft = loan.duration_months ? loan.duration_months * 30 : 90
  const rating = Math.min(5, Math.max(1, Math.round(fundedPct / 20) + (loan.apr < 15 ? 1 : 0)))

  return (
    <>
      {showDetail && (
        <LoanDetailModal loan={loan} color={color} onClose={() => setShowDetail(false)} onFund={onFund} />
      )}

      <div style={{
        background: color, borderRadius: 24, padding: 32, color: C.white,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 400, position: 'relative', overflow: 'hidden',
        transition: 'transform 0.25s', cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Ghost icon */}
        <div style={{ position: 'absolute', top: 0, right: 0, padding: 24, opacity: 0.15, fontSize: 120, lineHeight: 1 }}>
          {loan.purpose === 'Business' ? '💼' : loan.purpose === 'Education' ? '📚' : loan.purpose === 'Medical' ? '🏥' : '💡'}
        </div>

        {/* Top: borrower info */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, border: '2px solid rgba(255,255,255,0.6)',
            }}>
              {(loan.borrower_name || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{loan.borrower_name || 'Anonymous'}</div>
              <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: '0.02em' }}>{loan.purpose || 'General'}</div>
            </div>
          </div>

          {/* ★ Star rating */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <Stars rating={rating} />
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>{rating}.0 / 5.0 Credit Score</span>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>LOAN AMOUNT</div>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1 }}>₹{inr}</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{loan.amount_eth} ETH</div>
            <div style={{
              display: 'inline-block', marginTop: 10, padding: '4px 14px',
              background: 'rgba(255,255,255,0.2)', borderRadius: 999,
              fontSize: 12, fontWeight: 600,
            }}>{loan.apr || 12}% Interest Rate</div>
          </div>
        </div>

        {/* Bottom: progress + buttons */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: 999, height: 6, marginBottom: 8 }}>
            <div style={{ width: `${fundedPct}%`, background: C.white, height: 6, borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 14, opacity: 0.9 }}>
            <span>{fundedPct}% Funded</span>
            <span>{daysLeft} Days Left</span>
          </div>

          {/* Two action buttons */}
          <div style={{ display:'flex', gap:10 }}>
            <button
              onClick={() => setShowDetail(true)}
              style={{
                flex:1, background:'rgba(255,255,255,0.18)', color: C.white,
                border:'1px solid rgba(255,255,255,0.4)', borderRadius:12, padding:'12px 0',
                fontSize:13, fontWeight:700, cursor:'pointer',
                backdropFilter:'blur(8px)', transition:'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
            >Details</button>
            <button
              onClick={() => onFund(loan)}
              style={{
                flex:1, background: C.white, color: color,
                border: 'none', borderRadius: 12, padding: '12px 0',
                fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
                cursor: 'pointer', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Fund</button>
          </div>
        </div>
      </div>
    </>
  )
}


export default function Feed() {
  const [loans, setLoans]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setFilter]   = useState('All Markets')
  const [fundTarget, setFundTarget] = useState(null)
  const navigate = useNavigate()
  const { isConnected } = useWallet()

  const loadLoans = useCallback(async () => {
    try {
      const data = await getMarketplace()
      setLoans(data.loans || [])
    } catch (e) {
      console.error('Feed load failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadLoans() }, [loadLoans])
  useEffect(() => {
    const t = setInterval(loadLoans, 30000)
    return () => clearInterval(t)
  }, [loadLoans])

  const filtered = activeFilter === 'All Markets'
    ? loans
    : loans.filter(l => (l.purpose || '').toLowerCase().includes(activeFilter.split(' ')[0].toLowerCase()))

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-6px,8px) scale(1.08)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(8px,-6px) scale(1.12)} }
        @keyframes floatOrb3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(0.9)} }
        @keyframes sparkle {
          0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
          50%      { opacity:1; transform:scale(1) rotate(180deg); }
        }
        @keyframes shimmerBorder {
          0%,100% { border-color: rgba(201,149,42,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,149,42,0.1); }
          50%     { border-color: rgba(201,149,42,0.7); box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 12px rgba(201,149,42,0.2); }
        }
      `}</style>


      {/* ── layout: sidebar + main ── */}
      <div style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', position: 'relative' }}>

        {/* ── Left Filter Sidebar ── */}
        <aside style={{
          width: 220, flexShrink: 0, padding: '32px 20px',
          borderRight: `1px solid ${C.border}`, position: 'sticky', top: 56,
          height: 'calc(100vh - 56px)', overflowY: 'auto',
          background: C.surface, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary, marginBottom: 4 }}>Filters</div>
            <div style={{ fontSize: 12, color: C.secondary }}>Institutional Grade Credit</div>
          </div>

          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: activeFilter === cat ? '#e7e2d8' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                fontSize: 14, fontWeight: activeFilter === cat ? 700 : 400,
                color: activeFilter === cat ? C.ink : C.secondary,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (activeFilter !== cat) e.currentTarget.style.background = '#eeeee9' }}
              onMouseLeave={e => { if (activeFilter !== cat) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16 }}>{CAT_ICONS[i]}</span>
              {cat}
            </button>
          ))}

          {/* ── Apply for Loan Banner ── */}
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <div
              onClick={() => navigate('/loans/create')}
              style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 18,
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)',
                border: '1px solid rgba(201,149,42,0.3)',
                padding: '18px 16px 16px',
                cursor: 'pointer',
                animation: 'shimmerBorder 3s ease-in-out infinite',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(201,149,42,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,149,42,0.1)'
              }}
            >
              {/* Bubble orbs */}
              <div style={{ position:'absolute', top:-18, right:-18, width:70, height:70, borderRadius:'50%', background:'rgba(201,149,42,0.18)', filter:'blur(2px)', animation:'floatOrb1 4s ease-in-out infinite' }} />
              <div style={{ position:'absolute', bottom:-12, left:-10, width:48, height:48, borderRadius:'50%', background:'rgba(201,149,42,0.12)', filter:'blur(1px)', animation:'floatOrb2 5s ease-in-out infinite' }} />
              <div style={{ position:'absolute', top:'50%', right:14, width:22, height:22, borderRadius:'50%', background:'rgba(255,255,255,0.07)', animation:'floatOrb3 3.5s ease-in-out infinite' }} />

              {/* ✦ Sparkle particles */}
              {[
                { top:'12%',  left:'72%',  size:8,  delay:'0s',   dur:'2.2s'  },
                { top:'68%',  left:'82%',  size:6,  delay:'0.7s', dur:'1.8s'  },
                { top:'30%',  left:'58%',  size:10, delay:'1.1s', dur:'2.6s'  },
                { top:'80%',  left:'42%',  size:5,  delay:'0.3s', dur:'2.0s'  },
                { top:'18%',  left:'30%',  size:7,  delay:'1.5s', dur:'1.6s'  },
                { top:'55%',  left:'90%',  size:9,  delay:'0.9s', dur:'2.4s'  },
              ].map((s, i) => (
                <div key={i} style={{
                  position:'absolute', top:s.top, left:s.left,
                  width:s.size, height:s.size,
                  opacity:0,
                  animation:`sparkle ${s.dur} ease-in-out ${s.delay} infinite`,
                  pointerEvents:'none', zIndex:0,
                }}>
                  <svg viewBox="0 0 20 20" fill="none" style={{ width:'100%', height:'100%' }}>
                    <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" fill="rgba(201,149,42,0.9)"/>
                  </svg>
                </div>
              ))}

              {/* Content */}
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:'rgba(201,149,42,0.9)', textTransform:'uppercase', marginBottom:6 }}>✦ Quick Apply</div>
                <div style={{ fontSize:15, fontWeight:800, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.25, marginBottom:4 }}>Apply for a Loan</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>Get funded by the community</div>
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  background:'linear-gradient(135deg,#c9952a,#e8c05a)',
                  borderRadius:999, padding:'7px 16px',
                  fontSize:12, fontWeight:700, color:'#fff',
                  letterSpacing:'0.01em',
                }}>
                  Get Started
                  <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: '32px 48px' }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 32px', color: C.ink }}>Credit Marketplace</h1>

          {/* Stats Bar */}
          <div style={{
            display: 'flex', gap: 40, padding: '20px 28px',
            background: C.surface, borderRadius: 14, marginBottom: 40,
            border: `1px solid ${C.border}`,
          }}>
            {[
              { label: 'Capital Deployed', value: `₹${(loans.reduce((s, l) => s + (l.funded_amount_eth || 0), 0) * 250000 / 1e6).toFixed(1)}M` || '₹24.5M' },
              { label: 'Avg. Return',      value: loans.length ? `${(loans.reduce((s,l) => s+(l.apr||12),0)/loans.length).toFixed(1)}%` : '12.4%', color: C.teal },
              { label: 'Active Lenders',   value: String(loans.length || 0) },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.secondary, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: s.color || C.ink }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Loan Cards Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', color: C.secondary, padding: 60, fontSize: 15 }}>Loading marketplace…</div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 40px',
              background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 8 }}>No loans yet in this category</div>
              <div style={{ fontSize: 15, color: C.secondary, marginBottom: 32 }}>Be the first to list a loan in this market</div>
              <button
                onClick={() => navigate('/loans/create')}
                style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >List a Loan</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
              {filtered.map((loan, i) => (
                <LoanCard key={loan.id} loan={loan} idx={i} onFund={setFundTarget} />
              ))}
            </div>
          )}

          {/* Atmosphere Section */}
          <div style={{
            marginTop: 64, borderRadius: 16, overflow: 'hidden', height: 240,
            position: 'relative', background: C.surface, border: `1px solid ${C.border}`,
          }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAveDjydfHRENcawqTAwn44X0-LxQ9Qbi3jv90WXWI22xUfxNfI5cI4WLAN7XHNU1Q_-o9Ib560Gr5wxnD1caHpsSQh_Mi_3x4tEY6QWhZ9rLIHfilhSjsKJNQsiFIn9Q6ZnQidn1fJSahE-T8dDhRhHkN_BmEjsN1Me85WbhL254LE8oRb5yezY5ye4wCODphOnxXhh9X6C0-OeAMBy7iI-gFds3X3yn2dGR1FU-7vy-kOjUj5-XxppEi75BOy6sFJBqEQn5sh61I5"
              alt="Scale Your Portfolio"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink, marginBottom: 6 }}>Scale Your Portfolio</div>
              <div style={{ fontSize: 15, color: C.secondary }}>Institutional grade credit, simplified.</div>
            </div>
          </div>
        </main>
      </div>

      {/* Fund Modal */}
      {fundTarget && (
        <FundLoan loan={fundTarget} onClose={() => { setFundTarget(null); loadLoans() }} />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: '32px 64px',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
        gap: 16, fontSize: 13, color: C.secondary, fontWeight: 600, letterSpacing: '0.02em',
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>VeilFi</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Terms of Service','Privacy Policy','Institutional FAQ','Contact Support'].map(l => (
            <a key={l} href="#" style={{ color: C.secondary, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = C.ink}
              onMouseLeave={e => e.currentTarget.style.color = C.secondary}
            >{l}</a>
          ))}
        </div>
        <div>© 2024 VielFi Marketplace. All rights reserved.</div>
      </footer>
    </div>
  )
}