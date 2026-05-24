import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SBTCard from '../components/SBTCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { verifyProfile } from '../api/index.js'

/* ── Demo profiles ── */
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
    color: 'border-gold/40 bg-gradient-to-br from-yellow-900/20 to-card',
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
    color: 'border-slate-400/30 bg-gradient-to-br from-slate-800/20 to-card',
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
    color: 'border-grey/30 bg-gradient-to-br from-slate-700/20 to-card',
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
    color: 'border-orange-700/30 bg-gradient-to-br from-orange-900/20 to-card',
  },
]

const SIGNALS = [
  { key: 'upi',    label: 'UPI Transactions', icon: '📱', detail: 'Analyzing 90-day history…' },
  { key: 'gst',    label: 'GST Filings',       icon: '📋', detail: 'Fetching GSTIN records…'  },
  { key: 'rental', label: 'Rental History',    icon: '🏠', detail: 'Verifying payment stream…' },
]

/* ── Step indicator ── */
const SBT_CONTRACT_URL =
  'https://sepolia.etherscan.io/address/0xb10E4A0573145551639C69C3e8bB9B7dC7c1D4F2'

function StepIndicator({ current }) {
  const steps = ['Select Profile', 'Analyze Data', 'Generate Proof', 'Reveal Identity']
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => {
        const idx   = i + 1
        const done  = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done   ? 'bg-teal text-bg' :
                    active  ? 'bg-gold text-bg ring-4 ring-gold/20' :
                              'bg-border text-grey'}`}
              >
                {done ? '✓' : idx}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-gold' : done ? 'text-teal' : 'text-grey'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-px mx-2 transition-all duration-500 ${done ? 'bg-teal' : 'bg-border'}`} />
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
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started) return
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

export default function Verify() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(null)
  const [progress, setProgress] = useState({ upi: 0, gst: 0, rental: 0 })
  const [proofHash, setProofHash] = useState('')
  const [scoreCount, setScoreCount] = useState(300)
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const PROOF_TEXT =
    '0x7f3a9b2e1c4d8f6a5b0e3d9c7f2a4e8b1d6c3f9a2b5e8c1d4f7a0b3e6c9f2a5b8e1'
  const { displayed: typedProof, done: proofDone } = useTypewriter(PROOF_TEXT, 40, step === 3)

  /* Step 1 → 2: profile selected */
  const selectProfile = async (profile) => {
    setSelected(profile)
    setStep(2)
    setProgress({ upi: 0, gst: 0, rental: 0 })

    // Simulate analysis animation
    const animate = (key, duration) => {
      return new Promise((res) => {
        let val = 0
        const id = setInterval(() => {
          val = Math.min(val + Math.random() * 8, 100)
          setProgress((p) => ({ ...p, [key]: Math.round(val) }))
          if (val >= 100) { clearInterval(id); res() }
        }, duration / 15)
      })
    }

    // Call API (fire and forget, we'll use mock if it fails)
    try {
      setLoading(true)
      const data = await verifyProfile(profile.name)
      setApiData(data)
    } catch {
      // API not running — use mock data
    } finally {
      setLoading(false)
    }

    // Stagger animations
    await animate('upi', 2200)
    await animate('gst', 1800)
    await animate('rental', 2000)

    setTimeout(() => setStep(3), 600)
  }

  /* Step 3 → 4: proof generated */
  useEffect(() => {
    if (proofDone) {
      setTimeout(() => {
        setStep(4)
        // Animate score counter
        let val = 300
        const target = selected?.score || 700
        const id = setInterval(() => {
          val = Math.min(val + Math.round((target - val) * 0.12), target)
          setScoreCount(val)
          if (val >= target) clearInterval(id)
        }, 40)
      }, 800)
    }
  }, [proofDone, selected])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-3">Identity Protocol</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white">
            Get Your <span className="text-gradient-gold">Credit SBT</span>
          </h1>
          <p className="text-grey mt-3 text-lg">
            ZK-verified credit identity in 4 steps. No data exposure.
          </p>
        </div>

        <StepIndicator current={step} />

        {/* ── STEP 1: Profile Selection ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-center font-display text-xl text-white mb-6">
              Choose a demo borrower profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProfile(p)}
                  className={`text-left card border ${p.color} hover:scale-[1.02] hover:shadow-gold transition-all duration-200 active:scale-95`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl">
                      {p.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-bold text-white">{p.name}</span>
                        <TierBadge tier={p.tier} size="sm" />
                      </div>
                      <p className="text-grey text-xs">{p.role}</p>
                      <p className="text-sm text-white/70 mt-2 leading-relaxed line-clamp-2">{p.story}</p>
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
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-2xl">
                {selected.emoji}
              </div>
              <div>
                <h2 className="font-display font-bold text-white">{selected.name}</h2>
                <p className="text-grey text-sm">{selected.role}</p>
              </div>
            </div>

            <div className="space-y-5">
              {SIGNALS.map(({ key, label, icon, detail }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {progress[key] < 100 ? (
                        <span className="text-xs text-grey animate-pulse">{detail}</span>
                      ) : (
                        <span className="badge badge-teal text-xs">Verified ✓</span>
                      )}
                      <span className="text-sm font-bold text-gold w-10 text-right">
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

            <div className="mt-6 pt-5 border-t border-border text-center">
              <div className="flex items-center justify-center gap-2 text-grey text-sm">
                <svg className="w-4 h-4 animate-spin text-indigo" fill="none" viewBox="0 0 24 24">
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
              <div className="w-16 h-16 rounded-2xl bg-indigo/20 border border-indigo/40 flex items-center justify-center text-3xl mx-auto mb-4">
                🔐
              </div>
              <h2 className="font-display font-bold text-white text-xl">ZK Proof Generated</h2>
              <p className="text-grey text-sm mt-2">Your credit signals proved. No data revealed.</p>
            </div>

            <div className="bg-bg rounded-xl p-5 border border-border font-mono">
              <p className="text-xs text-grey mb-2">Groth16 Proof Hash:</p>
              <p className="text-teal text-sm break-all leading-relaxed typewriter-cursor">
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
                <div key={label} className="bg-bg rounded-lg p-3 border border-border">
                  <p className="text-xs text-grey">{label}</p>
                  <p className="text-sm text-white font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-grey text-xs mt-4 animate-pulse">
              Minting your SBT on-chain…
            </p>
          </div>
        )}

        {/* ── STEP 4: SBT Reveal ── */}
        {step === 4 && selected && (
          <div className="animate-slide-up max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2 animate-bounce">🎉</div>
              <h2 className="font-display font-bold text-white text-2xl">Identity Verified!</h2>
              <p className="text-grey text-sm mt-2">Your Soul-Bound Token is live on Ethereum Sepolia</p>
            </div>

            <SBTCard
              sbt={{
                name:    selected.name,
                tier:    selected.tier,
                score:   scoreCount,
                wallet:  '0x3f7a...9b2e',
                tagline: selected.tagline,
                signals: selected.signals,
              }}
              size="lg"
              contractUrl={SBT_CONTRACT_URL}
            />

            <a
              href={SBT_CONTRACT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center text-[12px] hover:underline"
              style={{ color: '#D4AF37' }}
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
                onClick={() => { setStep(1); setSelected(null) }}
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
