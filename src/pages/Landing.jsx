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
      className="relative flex flex-col items-center text-center animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Connector line */}
      {number < 5 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-border to-transparent" />
      )}
      <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl mb-4 hover:border-gold/40 hover:shadow-gold transition-all duration-300 cursor-default">
        {icon}
      </div>
      <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-bg text-xs font-bold mb-3 -mt-2">
        {number}
      </div>
      <h3 className="font-display font-semibold text-white text-base mb-2">{title}</h3>
      <p className="text-grey text-sm leading-relaxed max-w-[180px]">{desc}</p>
    </div>
  )
}

const HOW_STEPS = [
  { icon: '🪪', title: 'Link Your Data',   desc: 'Connect UPI, GST, or rental history privately using our secure adapter.' },
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
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        {/* Background glows */}
        <div className="absolute inset-0 bg-indigo-glow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-gold/5 to-transparent pointer-events-none" />

        {/* Pill */}
        <div className="animate-fade-in mb-6">
          <span className="badge badge-gold text-xs tracking-widest uppercase px-4 py-2">
            ZK Credit Protocol on Ethereum Sepolia
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight animate-slide-up">
          India's{' '}
          <span className="text-gradient-gold">Decentralized</span>
          <br />
          Credit{' '}
          <span className="text-gradient-teal">Marketplace</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-grey text-lg sm:text-xl max-w-2xl leading-relaxed animate-slide-up delay-200">
          Privacy-preserving ZK credit scores for India's 300M+ underbanked.{' '}
          <span className="text-white">Borrow without bias. Lend with confidence.</span>{' '}
          No CIBIL. No gatekeepers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-slide-up delay-300">
          <button
            onClick={() => navigate('/verify')}
            className="btn-primary text-base px-8 py-4"
          >
            Get Verified →
          </button>
          <button
            onClick={() => navigate('/feed')}
            className="btn-secondary text-base px-8 py-4"
          >
            Browse Loans
          </button>
        </div>

        {/* Trust logos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in delay-500">
          {['UPI Verified', 'ZK Powered', 'Sepolia Chain', 'Open Source'].map((tag) => (
            <span key={tag} className="flex items-center gap-2 text-xs text-grey">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              {tag}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse text-grey">
          <span className="text-xs">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-10 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map(({ label, value, prefix, suffix }) => (
              <div key={label} className="text-center">
                <div className="font-display font-black text-4xl md:text-5xl text-gradient-gold">
                  <CountUp end={value} prefix={prefix} suffix={suffix} />
                </div>
                <p className="text-grey text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">The Protocol</p>
          <h2 className="section-title">How VeilFi Works</h2>
          <p className="text-grey text-lg mt-4 max-w-xl mx-auto">
            Five steps from your financial data to decentralized credit, with zero data exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {HOW_STEPS.map((step, i) => (
            <HowStep key={step.title} number={i + 1} delay={i * 100} {...step} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/verify')}
            className="btn-primary text-base px-10 py-4"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* ── Why VeilFi ── */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-label mb-3">The Problem We Solve</p>
            <h2 className="section-title">India's Credit Gap</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏦',
                title: 'CIBIL Excludes 300M',
                desc: 'Gig workers, farmers, and SMBs have no formal credit history despite being financially active.',
                color: 'border-red-500/30',
              },
              {
                icon: '🔒',
                title: 'Zero Knowledge Privacy',
                desc: 'Your UPI flows, GST, and rental data prove your creditworthiness without revealing any numbers.',
                color: 'border-gold/30',
              },
              {
                icon: '⚡',
                title: 'No Middlemen',
                desc: 'Smart contracts replace banks. Borrowers pay less. Lenders earn more. DeFi transparency.',
                color: 'border-teal/30',
              },
            ].map((card) => (
              <div key={card.title} className={`card border ${card.color} hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{card.title}</h3>
                <p className="text-grey leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo/10 via-transparent to-gold/10 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-6">
            Ready to Build Your{' '}
            <span className="text-gradient-gold">Credit Identity?</span>
          </h2>
          <p className="text-grey text-lg mb-8">
            Join thousands of Indians reclaiming their financial future through decentralized credit.
          </p>
          <button
            onClick={() => navigate('/verify')}
            className="btn-primary text-lg px-12 py-5 animate-pulse-gold"
          >
            Get Verified Now →
          </button>
        </div>
      </section>
    </div>
  )
}
