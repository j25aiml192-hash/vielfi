import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'

/* ΓöÇΓöÇ Scroll-reveal hook ΓöÇΓöÇ */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ΓöÇΓöÇ Animated counter ΓöÇΓöÇ */
function CountUp({ end, prefix = '', suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref     = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * end))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

/* ΓöÇΓöÇ Premium VeilFi Card ΓöÇΓöÇ */
function VeilFiCard({ width = 500, tiltX = 0, tiltY = -6 }) {
  return (
    <div style={{
      position: 'relative', width, aspectRatio: '1.618 / 1', borderRadius: '2rem',
      background: 'linear-gradient(145deg, #fffef9 0%, #fdf8ec 45%, #faf0d8 100%)',
      boxShadow: '0 50px 100px -20px rgba(170,130,30,0.30), 0 0 0 1px rgba(212,175,55,0.20), inset 0 1px 0 rgba(255,255,255,0.95)',
      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transformStyle: 'preserve-3d',
    }}>
      {/* Holographic overlay */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '2rem', pointerEvents: 'none',
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,235,150,0.12) 30%, rgba(212,175,55,0.08) 50%, rgba(255,255,255,0.15) 70%, transparent 100%)',
        animation: 'hologram 8s linear infinite' }} />
      {/* Gold chip */}
      <div style={{ position: 'absolute', top: '16%', left: '7%', width: '12%', aspectRatio: '1.4/1', borderRadius: '0.35rem',
        background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 40%, #f0d060 60%, #c9952a 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(150,100,0,0.3)' }} />
      {/* VeilFi text */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(20px)' }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700,
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #7a5000 0%, #c9952a 20%, #e8c05a 35%, #fff0a0 50%, #e8c05a 65%, #c9952a 80%, #7a5000 100%)',
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'goldShine 3s ease-in-out infinite',
          filter: 'drop-shadow(0 2px 12px rgba(212,175,55,0.4))',
        }}>VeilFi</span>
      </div>
      {/* Score bar */}
      <div style={{ position: 'absolute', bottom: '10%', left: '7%', right: '7%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.45rem', color: '#8b6914', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Credit Score</span>
          <span style={{ fontSize: '0.6rem', color: '#8b6914', fontWeight: 700 }}>762</span>
        </div>
        <div style={{ height: 3, background: 'rgba(212,175,55,0.18)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: '84%', background: 'linear-gradient(90deg, #c9952a, #f0d060)', borderRadius: 99, boxShadow: '0 0 8px rgba(212,175,55,0.5)' }} />
        </div>
      </div>
      {/* Shine sweep */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '2rem', pointerEvents: 'none',
        background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.55) 50%, transparent 75%)',
        backgroundSize: '250% 100%', animation: 'shineSweep 4s ease-in-out infinite' }} />
    </div>
  )
}

/* ΓöÇΓöÇ Neon Network SVG ΓöÇΓöÇ */
function NetworkViz() {
  const lines = [
    [190,142,80,60],[190,142,310,55],[190,142,50,180],[190,142,330,190],
    [190,142,140,240],[190,142,260,245],[80,60,30,120],[80,60,150,30],
    [310,55,360,100],[310,55,245,20],[50,180,20,240],[330,190,360,240],
    [140,240,80,270],[260,245,320,270],[190,142,340,142],[190,142,40,142],
    [150,30,245,20],[30,120,20,240],[80,60,260,245],[330,190,140,240],
  ]
  const nodes = [
    [190,142,'#ff3aff',8,1],[80,60,'#b44aff',5,0.9],[310,55,'#ff3aff',5,0.9],
    [50,180,'#7c3aff',4,0.8],[330,190,'#3a8fff',4,0.8],[140,240,'#ff3aff',4,0.8],
    [260,245,'#b44aff',4,0.8],[30,120,'#3a8fff',3,0.7],[150,30,'#ff3aff',3,0.7],
    [360,100,'#7c3aff',3,0.7],[245,20,'#ff3aff',3,0.7],[20,240,'#3a8fff',3,0.7],
    [360,240,'#b44aff',3,0.7],[80,270,'#7c3aff',3,0.7],[320,270,'#ff3aff',3,0.7],
    [340,142,'#3a8fff',3,0.7],[40,142,'#b44aff',3,0.7],
  ]
  return (
    <div style={{
      width: '100%', maxWidth: 380, aspectRatio: '4/3', borderRadius: 16,
      background: 'linear-gradient(135deg, #0d0520 0%, #160a35 40%, #0a1a30 100%)',
      overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.30)', position: 'relative',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 380 285" fill="none" style={{ position: 'absolute', inset: 0 }}>
        {lines.map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 3 === 0 ? '#ff3aff' : i % 3 === 1 ? '#7c3aff' : '#3a8fff'}
            strokeWidth={i % 4 === 0 ? 1.2 : 0.7} strokeOpacity={0.3 + (i % 3) * 0.08} />
        ))}
        {nodes.map(([cx,cy,color,r,op], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r * 2.8} fill={color} fillOpacity={0.10} />
            <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={op} />
            <circle cx={cx} cy={cy} r={r * 0.38} fill="#fff" fillOpacity={0.92} />
          </g>
        ))}
        <circle cx={190} cy={142} r={32} fill="#ff3aff" fillOpacity={0.05} />
        <circle cx={190} cy={142} r={16} fill="#ff3aff" fillOpacity={0.10} />
      </svg>
    </div>
  )
}

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   LANDING PAGE
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
export default function Landing() {
  const navigate = useNavigate()
  const { isConnected, userRole, connect } = useWallet()

  /* Smart CTA navigation */
  const handleBorrowerCTA = async () => {
    if (!isConnected) { await connect(); return }
    if (!userRole)    { navigate('/onboarding'); return }
    navigate('/verify')
  }

  const handleLenderCTA = async () => {
    if (!isConnected) { await connect(); return }
    if (!userRole)    { navigate('/onboarding'); return }
    navigate('/feed')
  }

  /* Mouse tilt for hero card */
  const heroRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect(); if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setTilt({ x: y * -10, y: x * 10 })
  }, [])

  /* Scroll for hero fade */
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Section reveal refs */
  const [tickerRef, tickerVis] = useScrollReveal(0.05)
  const [howRef,    howVis]    = useScrollReveal(0.08)
  const [gapRef,    gapVis]    = useScrollReveal(0.08)
  const [ctaRef,    ctaVis]    = useScrollReveal(0.10)

  const heroFade  = Math.max(0, 1 - scrollY / 420)
  const heroShift = scrollY * 0.22

  return (
    <div style={{ overflowX: 'hidden', background: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          HERO ΓÇö golden ratio layout
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(155deg, #fdf9f3 0%, #fff8ee 50%, #fef4e6 100%)' }}
      >
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)', top: '-20%', right: '-8%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', bottom: '0%', left: '-5%' }} />

        <div style={{
          position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          opacity: heroFade, transform: `translateY(-${heroShift}px)`, willChange: 'opacity, transform',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>

            {/* Left ΓÇö 38.2% */}
            <div style={{ flex: '0 1 380px', display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
              <p className="animate-fade-in" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', fontWeight: 500,
                letterSpacing: '0.26em', textTransform: 'uppercase', color: '#b8913b', animationFillMode: 'both' }}>
                The Financial Bridge
              </p>
              <h1 className="animate-slide-up" style={{ margin: 0, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em',
                fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', color: '#0a0a0a',
                animationDelay: '150ms', animationFillMode: 'both' }}>
                India's Decentralized
                <br />
                <span style={{ background: 'linear-gradient(135deg, #7a5000,#c9952a,#e8c05a,#c9952a,#7a5000)',
                  backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', animation: 'goldShine 3s ease-in-out infinite' }}>
                  Credit Marketplace
                </span>
              </h1>
              <p className="animate-slide-up" style={{ margin: 0, fontSize: '1.05rem', color: '#5a5c5c', lineHeight: 1.65, maxWidth: 360,
                animationDelay: '280ms', animationFillMode: 'both' }}>
                Verifiable credit identity and seamless lending for the next billion users.
              </p>
              <div className="animate-slide-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animationDelay: '400ms', animationFillMode: 'both' }}>
                <button onClick={() => navigate('/feed', { state: { openDrawer: true } })} style={{
                  padding: '13px 28px', borderRadius: 999, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg,#8b6914,#c9952a,#e8c05a,#c9952a,#8b6914)', backgroundSize: '200% 100%',
                  animation: 'goldShine 3s ease-in-out infinite', boxShadow: '0 4px 24px rgba(180,130,20,0.38)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(180,130,20,0.52)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(180,130,20,0.38)' }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>Start Borrowing</span>
                  <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.35) 50%,transparent 75%)', backgroundSize: '250% 100%', animation: 'shineSweep 2.5s ease-in-out infinite', pointerEvents: 'none' }} />
                </button>
                <button onClick={() => navigate('/feed')} style={{
                  padding: '13px 28px', borderRadius: 999, fontWeight: 600, fontSize: '0.95rem',
                  border: '2px solid #c9952a', background: 'transparent', color: '#8b6914', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#c9952a'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b6914' }}
                >
                  Provide Liquidity
                </button>
              </div>
              {/* Trust tags */}
              <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, animationDelay: '550ms', animationFillMode: 'both' }}>
                {['ZK Secured', 'UPI Verified', 'CertIK Audited', 'Multi-chain'].map(tag => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.62rem',
                    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b6914',
                    border: '1px solid rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.07)', borderRadius: 999, padding: '4px 10px' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9952a', display: 'inline-block' }} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right ΓÇö 61.8% card */}
            <div style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
              <div style={{ position: 'relative', transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out' }}>
                {/* Card glow */}
                <div style={{ position: 'absolute', inset: '10%', borderRadius: '2rem',
                  background: 'radial-gradient(ellipse, rgba(212,175,55,0.35) 0%, transparent 70%)',
                  filter: 'blur(40px)', transform: 'translateZ(-60px) translateY(20%)', pointerEvents: 'none' }} />
                <VeilFiCard width={Math.min(500, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 460)} />
                {/* Floating chips */}
                {[
                  { label: 'Credit Score', val: '762',              color: '#c9952a', top: '-12%', right: '-16%', left: 'auto', delay: '0s' },
                  { label: 'TVL',          val: '\u20b9100Cr+',      color: '#0a0a0a', top: '72%',  left: '-16%',  right: 'auto', delay: '1s' },
                  { label: 'ZK Proof',     val: '\u2713 Live',       color: '#1ea64a', top: '42%',  right: '-20%', left: 'auto', delay: '0.5s' },
                ].map(({ label, val, color, top, right, left, delay }) => (
                  <div key={label} style={{
                    position: 'absolute', top, right, left,
                    background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '1rem',
                    padding: '8px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    minWidth: 86, animation: `float 3s ease-in-out ${delay} infinite`,
                  }}>
                    <p style={{ fontSize: '0.52rem', color: '#999', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color, margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="animate-bounce" style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          opacity: Math.max(0, 1 - scrollY / 120), pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8913b' }}>Scroll</span>
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="#b8913b">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          MARQUEE TICKER
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <div ref={tickerRef} style={{
        background: '#100c04', overflow: 'hidden', whiteSpace: 'nowrap',
        borderTop: '1px solid rgba(212,175,55,0.18)', borderBottom: '1px solid rgba(212,175,55,0.18)',
        transition: 'opacity 0.8s, transform 0.8s',
        opacity: tickerVis ? 1 : 0, transform: tickerVis ? 'none' : 'translateY(16px)',
      }}>
        <div style={{ display: 'inline-flex', gap: '3rem', alignItems: 'center', padding: '13px 0', animation: 'marquee 22s linear infinite' }}>
          {['SECURE · TRANSPARENT · DECENTRALIZED','\u20B9100CR+ TVL','AUDITED BY CERTIK','ZERO KNOWLEDGE PROOFS',
            '300M+ UNDERBANKED INDIANS','ZK CREDIT IDENTITY','SECURE · TRANSPARENT · DECENTRALIZED',
            '\u20B9100CR+ TVL','AUDITED BY CERTIK','ZERO KNOWLEDGE PROOFS','300M+ UNDERBANKED INDIANS','ZK CREDIT IDENTITY',
          ].map((t, i) => (
            <span key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.18em',
              color: i % 3 === 1 ? '#e8c05a' : 'rgba(255,255,255,0.62)', flexShrink: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          HOW VEILFI WORKS ΓÇö Lilac block
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <section ref={howRef} style={{
        padding: '40px 24px 0', maxWidth: 1200, margin: '0 auto',
        transition: 'opacity 1s, transform 1s',
        opacity: howVis ? 1 : 0, transform: howVis ? 'none' : 'translateY(60px)',
      }}>
        <div style={{ background: '#c4aff3', borderRadius: 24, padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Header */}
          <div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(30,0,80,0.5)', marginBottom: 10 }}>How VeilFi Works</p>
            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(20,0,50,0.65)', lineHeight: 1.65, maxWidth: 560, margin: 0 }}>A transparent and verifiable process to unlock decentralized liquidity based on your real-world financial health.</p>
          </div>
          {/* 3 step cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { n: '01', title: 'Verify Identity',  body: 'Connect your digital identity and traditional financial records securely. We use Zero-Knowledge proofs to ensure your raw data never leaves your device.', icon: '≡ƒöÉ' },
              { n: '02', title: 'Generate Score',    body: 'Our decentralised credit network aggregates your on-chain and off-chain data to generate a verifiable VeilFi Credit Score, recognised across DeFi protocols.', icon: '≡ƒôè' },
              { n: '03', title: 'Access Liquidity',  body: 'Use your credit score to access undercollateralised loans from liquidity pools. Better scores unlock higher limits and lower interest rates instantly.', icon: 'ΓÜí' },
            ].map(({ n, title, body, icon }, i) => (
              <div key={n} style={{ background: '#fff', borderRadius: 16, padding: '24px 22px', border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 500 }}>{n}</div>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0a0a0a' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#5a5c5c', lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          INDIA'S CREDIT GAP ΓÇö Lime block
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <section ref={gapRef} style={{
        padding: '32px 24px 0', maxWidth: 1200, margin: '0 auto',
        transition: 'opacity 1s, transform 1s',
        opacity: gapVis ? 1 : 0, transform: gapVis ? 'none' : 'translateY(60px)',
      }}>
        <div style={{ background: '#d6ebb0', borderRadius: 24, padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          {/* Left ΓÇö text */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,50,0,0.45)', margin: 0 }}>India's Credit Gap</p>
            <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: 'rgba(0,40,0,0.70)', lineHeight: 1.72, margin: 0 }}>
              Millions of individuals and small businesses lack access to formal credit despite having verifiable cash flows. VeilFi bridges this gap by turning digital footprints into reliable, decentralised credit profiles, empowering the unbanked and underbanked to participate in the global DeFi ecosystem.
            </p>
            <button onClick={() => navigate('/verify')} style={{
              marginTop: 4, padding: '13px 28px', borderRadius: 999, background: '#0a0a0a', color: '#fff',
              fontSize: '0.95rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
              boxShadow: '0 4px 18px rgba(0,0,0,0.22)', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.22)' }}>
              Read the Whitepaper
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
          {/* Right ΓÇö neon network */}
          <div style={{ flex: '1 1 260px', display: 'flex', justifyContent: 'center' }}>
            <NetworkViz />
          </div>
        </div>
      </section>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          CTA ΓÇö magenta button (matches screenshot)
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <section ref={ctaRef} style={{
        padding: '72px 24px 80px', maxWidth: 1200, margin: '0 auto', textAlign: 'center',
        borderTop: '1px solid #ececec', marginTop: 40,
        transition: 'opacity 1s, transform 1s',
        opacity: ctaVis ? 1 : 0, transform: ctaVis ? 'none' : 'translateY(60px)',
      }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>Ready to Build Your Credit Identity?</p>
        <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#5a5c5c', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65, marginBottom: 32 }}>
          Join thousands of users who have already bridged their real-world reputation into the decentralised ecosystem.
        </p>
        <button onClick={() => navigate('/verify')} style={{
          padding: '15px 44px', borderRadius: 999, background: '#e0187c', color: '#fff',
          fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 30px rgba(224,24,124,0.38)', position: 'relative', overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(224,24,124,0.52)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(224,24,124,0.38)' }}>
          <span style={{ position: 'relative', zIndex: 1 }}>Launch App</span>
          <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.3) 50%,transparent 75%)', backgroundSize: '250% 100%', animation: 'shineSweep 2.5s ease-in-out infinite' }} />
        </button>
      </section>

      {/* Global keyframes */}
      <style>{`
        @keyframes goldShine {
          0%   { background-position: 100% 0; }
          50%  { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes shineSweep {
          0%   { background-position: 200% 0; }
          50%  { background-position: -50% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes hologram {
          0%,100% { opacity: 0.3; }
          50%      { opacity: 0.7; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
