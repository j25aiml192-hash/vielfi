import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Animated counter ── */
function CountUp({ end, prefix = '', suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start     = performance.now()
          const tick = (now) => {
            const pct     = Math.min((now - start) / duration, 1)
            const eased   = 1 - Math.pow(1 - pct, 3)
            setVal(Math.round(eased * end))
            if (pct < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

/* ── How it works step ── */
function HowStep({ number, title, desc, icon, delay = 0 }) {
  return (
    <div
      className="relative flex flex-col items-center text-center animate-slide-up z-10"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Connector line */}
      {number < 5 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-[1px] bg-[#0A0A1A]/20 -z-10" />
      )}
      <div className="w-20 h-20 rounded-2xl bg-[#0A0A1A] flex items-center justify-center text-3xl mb-4 transition-all duration-300 shadow-lg text-white">
        {icon}
      </div>
      <div className="w-6 h-6 rounded-full bg-[#E5B54F] flex items-center justify-center text-[#0A0A1A] text-xs font-bold mb-3 -mt-2 z-10 shadow-md">
        {number}
      </div>
      <h3 className="font-display font-bold text-[#0A0A1A] text-[15px] mb-2">{title}</h3>
      <p className="text-[#334155] text-xs leading-relaxed max-w-[160px]">{desc}</p>
    </div>
  )
}

const HOW_STEPS = [
  { icon: '💳', title: 'Link Your Data',   desc: 'Connect UPI, GST, or rental history privately using our secure adapter.' },
  { icon: '🔐', title: 'ZK Proof Minted',  desc: 'Our circuit generates a zero-knowledge proof of your credit signals.' },
  { icon: '🏅', title: 'SBT Issued',       desc: 'A Soul-Bound Token with your tier and score is minted on-chain.' },
  { icon: '🤝', title: 'Apply for Loans',  desc: 'List your loan request on the marketplace. Community funds you.' },
  { icon: '💸', title: 'Repay & Grow',     desc: 'Repay EMIs to boost your score. No middlemen. Full transparency.' },
]

const STATS = [
  { label: 'Total Credit Market', value: 2500000, prefix: '₹', suffix: 'Cr+' },
  { label: 'Underbanked Indians', value: 300,    prefix: '',  suffix: 'M+' },
  { label: 'Middlemen Removed',   value: 0,      prefix: '',  suffix: '' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden bg-[#F5F2E6] font-sans">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 bg-[#F5F2E6]">
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,185,120,0.2)_0%,transparent_50%)] pointer-events-none" />

        {/* Pill */}
        <div className="animate-fade-in mb-8 z-10">
          <span className="inline-block bg-[#E3DEC9] text-[#4F4B3C] text-[10px] sm:text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full shadow-sm">
            PRIVACY PRESERVING ON-CHAIN CREDIT PROTOCOL
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-normal text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight animate-slide-up z-10 mb-6 drop-shadow-sm text-center" style={{ fontFamily: "'Playfair Display', serif", color: "#B8913B" }}>
          VeilFi
        </h1>

        {/* Subtext */}
        <p className="text-[#2F3A56] text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed animate-slide-up delay-200 z-10 font-medium">
          Privacy-preserving on-chain credit identity for India's credit-invisible population.<br className="hidden md:block" />
          Transforming UPI, GST, and rental behavior into trusted DeFi eligibility.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-slide-up delay-300 z-10">
          <button
            onClick={() => navigate('/verify')}
            className="flex items-center gap-2 rounded-lg bg-[#DEAF42] px-8 py-3.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#C89B36] transition-all shadow-md active:scale-95"
          >
            Get Verified →
          </button>
          <button
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 rounded-lg border border-[#1A1A1A] bg-transparent px-8 py-3.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all active:scale-95"
          >
            Browse Loans
          </button>
        </div>

        {/* Trust logos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in delay-500 z-10">
          {['UPI Verified', 'ZK Secured', 'Smart Contract', 'Multi-chain Identity'].map((tag) => (
            <span key={tag} className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#4F4B3C] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DEAF42]" />
              {tag}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse text-[#4F4B3C]">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-16 bg-[#0A0B1A] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map(({ label, value, prefix, suffix }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-4xl md:text-5xl text-[#DEAF42] mb-2">
                  <CountUp end={value} prefix={prefix} suffix={suffix} />
                </div>
                <p className="text-[#A1A1AA] text-xs uppercase tracking-widest font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto bg-[#F5F2E6]">
        <div className="text-center mb-20">
          <p className="text-[10px] font-bold tracking-widest text-[#B8913B] uppercase mb-3">The Protocol</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0A0A1A]">How VeilFi Works</h2>
          <p className="text-[#475569] text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Five steps from your financial data to decentralized credit, with zero data exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative">
          {HOW_STEPS.map((step, i) => (
            <HowStep key={step.title} number={i + 1} delay={i * 100} {...step} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <button
            onClick={() => navigate('/verify')}
            className="rounded-lg bg-[#DEAF42] px-10 py-3.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#C89B36] transition-all shadow-md active:scale-95"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* ── Why VeilFi ── */}
      <section className="py-24 relative text-[#0A0A1A]">
        {/* Background texture simulation */}
        <div className="absolute inset-0 bg-[#D3AC50] opacity-90" style={{ backgroundImage: 'radial-gradient(#C69E3D 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="text-center mb-16">
            <p className="font-bold text-[10px] uppercase tracking-widest text-[#0A0A1A]/70 mb-3">The Problem We Solve</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0A0A1A]">India's Credit Gap</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏦',
                title: 'CIBIL Excludes 300M',
                desc: 'Gig workers, farmers, and SMBs have no formal credit history despite being financially active.',
              },
              {
                icon: '🔒',
                title: 'Zero Knowledge Privacy',
                desc: 'Your UPI flows, GST, and rental data prove your creditworthiness without revealing any numbers.',
              },
              {
                icon: '⚡',
                title: 'No Middlemen',
                desc: 'Smart contracts replace banks. Borrowers pay less. Lenders earn more. DeFi transparency.',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border-none bg-[#0A0B1A] p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 text-white flex flex-col">
                <div className="text-3xl mb-6 bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center">{card.icon}</div>
                <h3 className="font-display font-bold text-white text-lg mb-4">{card.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-32 px-4 text-center relative overflow-hidden bg-[#F5F2E6] text-[#0A0A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,185,120,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto z-10">
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#0A0B1A] mb-6">
            Ready to Build Your <span className="text-[#DEAF42]">Credit Identity?</span>
          </h2>
          <p className="text-[#475569] text-base mb-10 leading-relaxed">
            Join thousands of Indians reclaiming their financial future through decentralized credit.
          </p>
          <button
            onClick={() => navigate('/verify')}
            className="rounded-lg bg-[#DEAF42] px-12 py-4 text-sm font-bold text-[#1A1A1A] hover:bg-[#C89B36] transition-all shadow-lg active:scale-95"
          >
            Get Verified Now →
          </button>
        </div>
      </section>
    </div>
  )
}
