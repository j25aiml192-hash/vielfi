import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SBTCard from '../components/SBTCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { verifyProfile } from '../api/index.js'

/* ── Demo profiles (static UI only — data comes from backend) ── */
const PROFILES = [
  {
    id: 'rahul',
    name: 'Rahul Sharma',
    role: 'Street Food Vendor · Delhi',
    emoji: '🍜',
    tier: 'Gold',
    score: 762,
    tagline: 'UPI & GST Verified Business Owner',
    signals: { upi: true, gst: true, rental: false },
    story: 'Rahul processes ₹2.1L monthly through UPI across 3 food stalls. Never missed a payment.',
    color: 'border-hairline bg-surface-soft',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    role: 'Freelance Designer · Bangalore',
    emoji: '🎨',
    tier: 'Platinum',
    score: 851,
    tagline: 'Top Rated Creative Professional',
    signals: { upi: true, gst: false, rental: true },
    story: 'Priya earns ₹3.5L/mo from international clients. Consistent rental payments for 4 years.',
    color: 'border-hairline bg-surface-soft',
  },
  {
    id: 'anita',
    name: 'Anita Meena',
    role: 'Kirana Store Owner · Jaipur',
    emoji: '🏪',
    tier: 'Silver',
    score: 681,
    tagline: 'Registered SME with GST History',
    signals: { upi: true, gst: true, rental: false },
    story: 'Anita has operated her store for 6 years with consistent GST filings and UPI transactions.',
    color: 'border-hairline bg-surface-soft',
  },
  {
    id: 'vikram',
    name: 'Vikram Singh',
    role: 'Auto Driver · Mumbai',
    emoji: '🛺',
    tier: 'Bronze',
    score: 558,
    tagline: 'Ola/Uber Verified Driver Partner',
    signals: { upi: true, gst: false, rental: true },
    story: 'Vikram has driven 8,000+ trips with 4.8 rating. Consistent rental payments in Dharavi.',
    color: 'border-hairline bg-surface-soft',
  },
]

/* ── Step indicator ── */
function StepIndicator({ current }) {
  const steps = ['Select Profile', 'Analyze Data', 'Generate Proof', 'Reveal Identity']
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => {
        const idx    = i + 1
        const done   = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done   ? 'bg-semantic-success text-on-primary' :
                    active  ? 'bg-primary text-on-primary ring-4 ring-primary/20' :
                              'bg-hairline text-secondary'}`}
              >
                {done ? '✓' : idx}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-primary' : done ? 'text-semantic-success' : 'text-secondary'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-px mx-2 transition-all duration-500 ${done ? 'bg-semantic-success' : 'bg-hairline'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 30, started = false) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)

  useEffect(() => {
    if (!started || !text) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, started])

  return { displayed, done }
}

/* ── Animated progress bar helper ── */
function useAnimatedProgress(trigger) {
  const [progress, setProgress] = useState({ upi: 0, gst: 0, rental: 0 })

  useEffect(() => {
    if (!trigger) return
    setProgress({ upi: 0, gst: 0, rental: 0 })

    const animate = (key, delay) => {
      setTimeout(() => {
        let val = 0
        const id = setInterval(() => {
          val = Math.min(val + Math.random() * 9 + 3, 100)
          setProgress((p) => ({ ...p, [key]: Math.round(val) }))
          if (val >= 100) clearInterval(id)
        }, 60)
      }, delay)
    }

    animate('upi',    0)
    animate('gst',    500)
    animate('rental', 1000)
  }, [trigger])

  const allDone = progress.upi >= 100 && progress.gst >= 100 && progress.rental >= 100
  return { progress, allDone }
}

export default function Verify() {
  const [step, setStep]           = useState(1)
  const [selected, setSelected]   = useState(null)
  const [verifyData, setVerifyData] = useState(null)
  const [apiError, setApiError]   = useState('')
  const [scoreCount, setScoreCount] = useState(300)
  const [analyzeStarted, setAnalyzeStarted] = useState(false)
  const navigate = useNavigate()

  const { progress, allDone: progressDone } = useAnimatedProgress(analyzeStarted)

  // Proof hash: use real API data once available, fallback to placeholder
  const proofText = verifyData?.proofHash || '0x7f3a9b2e1c4d8f6a5b0e3d9c7f2a4e8b1d6c3f9a2b5e8c1d4f7a0b3e6c9f2a5b8e1'
  const { displayed: typedProof, done: proofDone } = useTypewriter(proofText, 30, step === 3)

  /* Step 1 → 2: profile selected, trigger API call + animations */
  const selectProfile = async (profile) => {
    setSelected(profile)
    setVerifyData(null)
    setApiError('')
    setStep(2)
    setAnalyzeStarted(true)

    try {
      const data = await verifyProfile(profile.id)
      console.log('[Verify] API response:', data)
      setVerifyData(data)
    } catch (err) {
      console.error('[Verify] API error:', err.message)
      setApiError(err.message)
      // Continue with demo flow even if API fails
    }
  }

  /* Advance to Step 3 once progress bars finish */
  useEffect(() => {
    if (progressDone && step === 2) {
      setTimeout(() => setStep(3), 600)
    }
  }, [progressDone, step])

  /* Step 3 → 4: proof typed out, advance to reveal */
  useEffect(() => {
    if (proofDone && step === 3) {
      setTimeout(() => {
        setStep(4)
        const target = verifyData?.cibilScore || 700
        let val = 300
        const id = setInterval(() => {
          val = Math.min(val + Math.round((target - val) * 0.12), target)
          setScoreCount(val)
          if (val >= target) clearInterval(id)
        }, 40)
      }, 800)
    }
  }, [proofDone, step, verifyData])

  /* Derive tier badge from API or fallback defaults */
  const getTier = () => {
    if (verifyData?.tier) return verifyData.tier
    const defaults = { rahul_shopkeeper: 'Gold', priya_freelancer: 'Platinum', anita_graduate: 'Silver', vikram_gig: 'Bronze' }
    return defaults[selected?.id] || 'Silver'
  }

  /* Derive ZK signal status from API scores */
  const getSignals = () => {
    if (!verifyData) return { upi: true, gst: true, rental: false }
    return {
      upi:    (verifyData.upiScore    || 0) > 0,
      gst:    (verifyData.gstScore    || 0) > 0,
      rental: (verifyData.rentalScore || 0) > 0,
    }
  }

  const SIGNALS = [
    { key: 'upi',    label: 'UPI Transactions', icon: '📱', detail: 'Analyzing 90-day history…' },
    { key: 'gst',    label: 'GST Filings',       icon: '📋', detail: 'Fetching GSTIN records…'  },
    { key: 'rental', label: 'Rental History',    icon: '🏠', detail: 'Verifying payment stream…' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-3">Identity Protocol</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-primary">
            Get Your <span className="text-gradient-gold">Credit SBT</span>
          </h1>
          <p className="text-secondary mt-3 text-lg">
            ZK-verified credit identity in 4 steps. No data exposure.
          </p>
        </div>

        <StepIndicator current={step} />

        {/* ── STEP 1: Profile Selection ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-center font-display text-xl text-primary mb-6">
              Choose a demo borrower profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProfile(p)}
                  className={`text-left card border ${p.color} hover:scale-[1.02] hover:shadow-card-hover transition-all duration-200 active:scale-95`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-soft border border-hairline flex items-center justify-center text-3xl">
                      {p.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-bold text-primary">{p.name}</span>
                        <TierBadge tier={p.tier} size="sm" />
                      </div>
                      <p className="text-secondary text-xs">{p.role}</p>
                      <p className="text-sm text-on-surface/70 mt-2 leading-relaxed line-clamp-2">{p.story}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Analyzing Data ── */}
        {step === 2 && selected && (
          <div className="card max-w-xl mx-auto animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center text-2xl">
                {selected.emoji}
              </div>
              <div>
                <h2 className="font-display font-bold text-primary">{selected.name}</h2>
                <p className="text-secondary text-sm">{selected.role}</p>
              </div>
            </div>

            {apiError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2">
                API offline — running in demo mode: {apiError}
              </div>
            )}

            <div className="space-y-5">
              {SIGNALS.map(({ key, label, icon, detail }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="text-sm font-medium text-primary">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {progress[key] < 100 ? (
                        <span className="text-xs text-secondary animate-pulse">{detail}</span>
                      ) : (
                        <span className="badge badge-teal text-xs">Verified ✓</span>
                      )}
                      <span className="text-sm font-bold text-primary w-10 text-right">
                        {progress[key]}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={progress[key]}
                    variant={key === 'upi' ? 'indigo' : key === 'gst' ? 'gold' : 'teal'}
                    size="md"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-hairline text-center">
              <div className="flex items-center justify-center gap-2 text-secondary text-sm">
                <svg className="w-4 h-4 animate-spin text-block-lilac" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Generating zero-knowledge proof…</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Proof Hash ── */}
        {step === 3 && selected && (
          <div className="card max-w-xl mx-auto animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-block-lilac/20 border border-block-lilac/40 flex items-center justify-center text-3xl mx-auto mb-4">
                🔐
              </div>
              <h2 className="font-display font-bold text-primary text-xl">ZK Proof Generated</h2>
              <p className="text-secondary text-sm mt-2">Your credit signals proved. No data revealed.</p>
            </div>

            <div className="bg-surface-soft rounded-xl p-5 border border-hairline font-mono">
              <p className="text-xs text-secondary mb-2">Groth16 Proof Hash:</p>
              <p className="text-semantic-success text-sm break-all leading-relaxed typewriter-cursor">
                {typedProof}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                { label: 'Circuit',    value: 'credit_v2.circom' },
                { label: 'Verifier',   value: 'Ethereum Sepolia' },
                { label: 'Signals',    value: '3 verified' },
                { label: 'Gas Used',   value: '~0.001 ETH' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-soft rounded-lg p-3 border border-hairline">
                  <p className="text-xs text-secondary">{label}</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-secondary text-xs mt-4 animate-pulse">
              Minting your SBT on-chain…
            </p>
          </div>
        )}

        {/* ── STEP 4: SBT Reveal ── */}
        {step === 4 && selected && (
          <div className="animate-slide-up max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2 animate-bounce">🎉</div>
              <h2 className="font-display font-bold text-primary text-2xl">Identity Verified!</h2>
              <p className="text-secondary text-sm mt-2">Your Soul-Bound Token is live on Ethereum Sepolia</p>
            </div>

            {/* Real API data panel */}
            {verifyData && (
              <div className="card mb-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-grey mb-1">UPI Score</div>
                  <div className="font-bold text-indigo">{Math.round(verifyData.upiScore ?? 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-grey mb-1">GST Score</div>
                  <div className="font-bold text-gold">{Math.round(verifyData.gstScore ?? 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-grey mb-1">Rental Score</div>
                  <div className="font-bold text-teal">{Math.round(verifyData.rentalScore ?? 0)}</div>
                </div>
              </div>
            )}

            {verifyData?.narrative && (
              <div className="card mb-4 border border-indigo/20 bg-indigo/5">
                <p className="text-xs text-grey mb-1">AI Credit Narrative</p>
                <p className="text-sm text-white/80 leading-relaxed">{verifyData.narrative}</p>
              </div>
            )}

            <SBTCard
              sbt={{
                name:    selected.name,
                tier:    getTier(),
                score:   scoreCount,
                wallet:  '0x3f7a...9b2e',
                tagline: selected.tagline,
                signals: getSignals(),
              }}
              size="lg"
            />

            <a
              href={SBT_CONTRACT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center text-[12px] text-primary hover:underline"
            >
              View contract on Etherscan ↗
            </a>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('/feed')}
                className="btn-primary flex-1 justify-center"
              >
                Browse Loans →
              </button>
              <button
                onClick={() => { setStep(1); setSelected(null); setVerifyData(null); setAnalyzeStarted(false) }}
                className="btn-secondary flex-1 justify-center"
              >
                Try Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
