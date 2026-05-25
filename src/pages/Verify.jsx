import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SBTCard from '../components/SBTCard.jsx'
import TierBadge from '../components/TierBadge.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { verifyProfile } from '../api/index.js'

/* ══════════════════════════════════════════════
   DEMO PROFILES (matches screenshot exactly)
══════════════════════════════════════════════ */
const PROFILES = [
  {
    id: 'rahul',
    name: 'Rahul Sharma',
    role: 'Street Food Vendor \u00b7 Delhi',
    emoji: '\ud83c\udf5c',
    tier: 'Gold',
    score: 762,
    tagline: 'UPI & GST Verified Business Owner',
    signals: { upi: true, gst: true, rental: false },
    story: 'Rahul processes \u20b92.1L monthly through UPI across 3 food stalls. Never missed a payment.',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    role: 'Freelance Designer \u00b7 Bangalore',
    emoji: '\ud83c\udfa8',
    tier: 'Platinum',
    score: 851,
    tagline: 'Top Rated Creative Professional',
    signals: { upi: true, gst: false, rental: true },
    story: 'Priya earns \u20b93.5L/mo from international clients. Consistent rental payments for 4 years.',
  },
  {
    id: 'anita',
    name: 'Anita Meena',
    role: 'Kirana Store Owner \u00b7 Jaipur',
    emoji: '\ud83c\udfea',
    tier: 'Silver',
    score: 681,
    tagline: 'Registered SME with GST History',
    signals: { upi: true, gst: true, rental: false },
    story: 'Anita has operated her store for 6 years with consistent GST filings and UPI transactions.',
  },
  {
    id: 'vikram',
    name: 'Vikram Singh',
    role: 'Auto Driver \u00b7 Mumbai',
    emoji: '\ud83d\udefa',
    tier: 'Bronze',
    score: 558,
    tagline: 'Ola/Uber Verified Driver Partner',
    signals: { upi: true, gst: false, rental: true },
    story: 'Vikram has driven 8,000+ trips with 4.8 rating. Consistent rental payments in Dharavi.',
  },
]

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 28, started = false) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!started || !text) return
    setDisplayed(''); setDone(false)
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, started])
  return { displayed, done }
}

/* ── Animated progress bars ── */
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
          setProgress(p => ({ ...p, [key]: Math.round(val) }))
          if (val >= 100) clearInterval(id)
        }, 60)
      }, delay)
    }
    animate('upi', 0); animate('gst', 500); animate('rental', 1000)
  }, [trigger])
  const allDone = progress.upi >= 100 && progress.gst >= 100 && progress.rental >= 100
  return { progress, allDone }
}

/* ══════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════ */
function StepIndicator({ current }) {
  const steps = ['Select Profile', 'Analyze Data', 'Generate Proof', 'Reveal Identity']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
      {steps.map((label, i) => {
        const idx = i + 1; const done = idx < current; const active = idx === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
                background: done ? '#1ea64a' : active ? '#0a0a0a' : '#ececec',
                color: done || active ? '#fff' : '#888',
                boxShadow: active ? '0 0 0 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? '\u2713' : idx}
              </div>
              <span style={{
                fontSize: '0.65rem', marginTop: 4,
                color: active ? '#0a0a0a' : done ? '#1ea64a' : '#aaa',
                display: 'block', whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 64, height: 1, margin: '0 8px', marginBottom: 18, background: done ? '#1ea64a' : '#e0e0e0', transition: 'background 0.5s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════
   IDENTITY PORTAL CARD (matches screenshot right panel)
══════════════════════════════════════════════ */
function IdentityPortal({ onStart }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #e8e4df',
      padding: 32,
      boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      minWidth: 280,
    }}>
      {/* Shield icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: '#f5f5f5', border: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="#0a0a0a" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0a0a0a', marginBottom: 6 }}>Identity Portal</h3>
        <p style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.5, maxWidth: 220 }}>
          Estimated completion: ~3 minutes. Ensure you have your government-issued ID ready.
        </p>
      </div>

      {/* Status rows */}
      <div style={{ width: '100%', background: '#f9f8f6', borderRadius: 10, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'CONNECTION STATUS', value: '\u25cf Not Started', valueColor: '#666' },
          { label: 'PRIVACY LEVEL',     value: 'ZK-Secure',      valueColor: '#0a0a0a' },
        ].map(({ label, value, valueColor }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 500, color: valueColor }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '14px 24px', borderRadius: 999,
          background: '#0a0a0a', color: '#fff',
          fontWeight: 600, fontSize: '0.95rem',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)' }}
      >
        Start Verification
        <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN VERIFY PAGE
══════════════════════════════════════════════ */
export default function Verify() {
  const [step, setStep]               = useState(0) // 0 = landing, 1 = select, 2 = analyze, 3 = proof, 4 = reveal
  const [selected, setSelected]       = useState(null)
  const [verifyData, setVerifyData]   = useState(null)
  const [apiError, setApiError]       = useState('')
  const [scoreCount, setScoreCount]   = useState(300)
  const [analyzeStarted, setAnalyzeStarted] = useState(false)
  const navigate = useNavigate()

  const { progress, allDone: progressDone } = useAnimatedProgress(analyzeStarted)

  const proofText = verifyData?.proofHash || '0x7f3a9b2e1c4d8f6a5b0e3d9c7f2a4e8b1d6c3f9a2b5e8c1d4f7a0b3e6c9f2a5b8e1'
  const { displayed: typedProof, done: proofDone } = useTypewriter(proofText, 28, step === 3)

  /* Start verification flow */
  const handleStart = () => setStep(1)

  /* Select demo profile → step 2 */
  const selectProfile = async (profile) => {
    setSelected(profile); setVerifyData(null); setApiError('')
    setStep(2); setAnalyzeStarted(true)
    try {
      const data = await verifyProfile(profile.id)
      setVerifyData(data)
    } catch (err) {
      setApiError(err.message)
    }
  }

  /* Step 2 → 3 when progress bars complete */
  useEffect(() => {
    if (progressDone && step === 2) setTimeout(() => setStep(3), 600)
  }, [progressDone, step])

  /* Step 3 → 4 when proof typed */
  useEffect(() => {
    if (proofDone && step === 3) {
      setTimeout(() => {
        setStep(4)
        const target = verifyData?.cibilScore || selected?.score || 700
        let val = 300
        const id = setInterval(() => {
          val = Math.min(val + Math.round((target - val) * 0.12), target)
          setScoreCount(val)
          if (val >= target) clearInterval(id)
        }, 40)
      }, 800)
    }
  }, [proofDone, step, verifyData, selected])

  const getTier = () => verifyData?.tier || selected?.tier || 'Silver'
  const getSignals = () => verifyData
    ? { upi: (verifyData.upiScore || 0) > 0, gst: (verifyData.gstScore || 0) > 0, rental: (verifyData.rentalScore || 0) > 0 }
    : selected?.signals || { upi: true, gst: true, rental: false }

  const SIGNALS = [
    { key: 'upi',    label: 'UPI Transactions', icon: '\ud83d\udcf1', detail: 'Analyzing 90-day history\u2026' },
    { key: 'gst',    label: 'GST Filings',       icon: '\ud83d\udccb', detail: 'Fetching GSTIN records\u2026'  },
    { key: 'rental', label: 'Rental History',    icon: '\ud83c\udfe0', detail: 'Verifying payment stream\u2026' },
  ]

  /* ── STEP 0: Landing — matches screenshot exactly ── */
  if (step === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#888', marginBottom: 20 }}>
            IDENTITY VERIFICATION
          </p>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 24 }}>
            Verify Your<br />Credit Identity
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#666', lineHeight: 1.65, maxWidth: 480, margin: '0 auto 56px' }}>
            Establish your decentralized reputation. We utilize advanced ZK-proofs to cryptographically verify your off-chain history without exposing your underlying personal data.
          </p>
        </div>

        {/* Lime block — The Process */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{
            background: '#dceeb1', borderRadius: 24,
            padding: 'clamp(28px, 4vw, 48px)',
            display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start',
          }}>
            {/* Left: steps */}
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,40,0,0.5)', marginBottom: 28 }}>
                THE PROCESS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { n: 1, title: 'Connect Digital Identity',   body: 'Link your KYC or Aadhaar credentials securely. Your data is processed locally and never leaves your control.' },
                  { n: 2, title: 'Aggregate Data',             body: 'We compile your on-chain transaction history and off-chain financial data into a single encrypted state vector.' },
                  { n: 3, title: 'Generate Score',             body: 'Mint your verifiable VeilFi Credit Score as a private, soulbound token to unlock premium borrowing tiers.' },
                ].map(({ n, title, body }, i, arr) => (
                  <div key={n} style={{ display: 'flex', gap: 18, paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                    {/* Number + connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: '0.9rem', color: '#0a0a0a',
                      }}>{n}</div>
                      {i < arr.length - 1 && (
                        <div style={{ width: 1, flex: 1, minHeight: 24, background: 'rgba(0,0,0,0.12)', margin: '6px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingTop: 6 }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', marginBottom: 6 }}>{title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(0,30,0,0.65)', lineHeight: 1.65 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Identity Portal card */}
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <IdentityPortal onStart={handleStart} />
            </div>
          </div>
        </div>

        {/* Demo profiles section */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', color: '#0a0a0a', textAlign: 'center', marginBottom: 28 }}>
            Choose a demo borrower profile
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => { handleStart(); setTimeout(() => selectProfile(p), 50) }}
                style={{
                  textAlign: 'left', background: '#fff', borderRadius: 16,
                  border: '1px solid #e8e4df', padding: '20px 22px',
                  cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.025)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: '#f5f5f5', border: '1px solid #ececec',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', flexShrink: 0,
                  }}>{p.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a' }}>{p.name}</span>
                      <TierBadge tier={p.tier} size="sm" />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>{p.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>{p.story}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── STEPS 1–4: Verification flow ── */
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', paddingTop: 80, paddingBottom: 64 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Back to landing */}
        {step === 1 && (
          <button
            onClick={() => setStep(0)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.85rem', marginBottom: 32 }}
          >
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>Identity Protocol</p>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.1 }}>
            Verify Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7a5000, #c9952a, #e8c05a, #c9952a, #7a5000)',
              backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'goldShine 3s ease-in-out infinite',
            }}>Credit Identity</span>
          </h1>
        </div>

        <StepIndicator current={step} />

        {/* ── STEP 1: Profile Selection ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#0a0a0a', marginBottom: 24 }}>
              Choose a demo borrower profile
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectProfile(p)}
                  style={{
                    textAlign: 'left', background: '#fff', borderRadius: 16,
                    border: '1px solid #e8e4df', padding: '18px 20px',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.025)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f5f5', border: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{p.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a' }}>{p.name}</span>
                        <TierBadge tier={p.tier} size="sm" />
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#999', marginTop: 2 }}>{p.role}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6 }}>{p.story}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Analyzing ── */}
        {step === 2 && selected && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8e4df', padding: 32, maxWidth: 520, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f5f5f5', border: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{selected.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0a0a0a' }}>{selected.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>{selected.role}</div>
              </div>
            </div>
            {apiError && (
              <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: '#fff8f0', border: '1px solid #ffd0a0', fontSize: '0.8rem', color: '#b86000' }}>
                API offline — running demo mode
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {SIGNALS.map(({ key, label, icon, detail }) => (
                <div key={key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1rem' }}>{icon}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0a0a0a' }}>{label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {progress[key] < 100 ? (
                        <span style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{detail}</span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#1ea64a', fontWeight: 600 }}>Verified \u2713</span>
                      )}
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0a0a', width: 36, textAlign: 'right' }}>{progress[key]}%</span>
                    </div>
                  </div>
                  <ProgressBar value={progress[key]} variant={key === 'upi' ? 'indigo' : key === 'gst' ? 'gold' : 'teal'} size="md" />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0ede8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: '#c5b0f4' }} fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>Generating zero-knowledge proof\u2026</span>
            </div>
          </div>
        )}

        {/* ── STEP 3: ZK Proof ── */}
        {step === 3 && selected && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8e4df', padding: 32, maxWidth: 520, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f0ebff', border: '1px solid #d5c5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 16px' }}>
                \ud83d\udd10
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0a0a0a' }}>ZK Proof Generated</h2>
              <p style={{ fontSize: '0.85rem', color: '#888', marginTop: 6 }}>Your credit signals proved. No data revealed.</p>
            </div>
            <div style={{ background: '#f7f7f5', borderRadius: 12, padding: '16px 18px', border: '1px solid #ececec', fontFamily: 'JetBrains Mono, monospace' }}>
              <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Groth16 Proof Hash</p>
              <p style={{ fontSize: '0.78rem', color: '#1ea64a', wordBreak: 'break-all', lineHeight: 1.6 }}>{typedProof}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              {[
                { label: 'Circuit',  value: 'credit_v2.circom' },
                { label: 'Verifier', value: 'Ethereum Sepolia' },
                { label: 'Signals',  value: '3 verified' },
                { label: 'Gas Used', value: '~0.001 ETH' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#f7f7f5', borderRadius: 10, padding: '10px 14px', border: '1px solid #ececec' }}>
                  <p style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: '0.82rem', color: '#0a0a0a', fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#aaa', marginTop: 16, fontFamily: 'JetBrains Mono, monospace' }}>Minting your SBT on-chain\u2026</p>
          </div>
        )}

        {/* ── STEP 4: SBT Reveal ── */}
        {step === 4 && selected && (
          <div style={{ maxWidth: 460, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10, animation: 'bounce 1s ease 2' }}>\ud83c\udf89</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#0a0a0a' }}>Identity Verified!</h2>
              <p style={{ fontSize: '0.88rem', color: '#888', marginTop: 6 }}>Your Soul-Bound Token is live on Ethereum Sepolia</p>
            </div>

            {verifyData && (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e4df', padding: 20, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
                {[
                  { label: 'UPI Score',    val: Math.round(verifyData.upiScore ?? 0),    color: '#7c5fdb' },
                  { label: 'GST Score',    val: Math.round(verifyData.gstScore ?? 0),    color: '#c9952a' },
                  { label: 'Rental Score', val: Math.round(verifyData.rentalScore ?? 0), color: '#1ea64a' },
                ].map(({ label, val, color }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            <SBTCard
              sbt={{ name: selected.name, tier: getTier(), score: scoreCount, wallet: '0x3f7a\u20269b2e', tagline: selected.tagline, signals: getSignals() }}
              size="lg"
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => navigate('/feed')}
                style={{
                  flex: 1, padding: '14px', borderRadius: 999,
                  background: '#0a0a0a', color: '#fff',
                  fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                  transition: 'transform 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Browse Loans \u2192
              </button>
              <button
                onClick={() => { setStep(0); setSelected(null); setVerifyData(null); setAnalyzeStarted(false) }}
                style={{
                  flex: 1, padding: '14px', borderRadius: 999,
                  background: '#fff', color: '#0a0a0a',
                  fontWeight: 600, fontSize: '0.95rem',
                  border: '1.5px solid #e0e0e0', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                Try Another
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes goldShine {
          0%   { background-position: 100% 0; }
          50%  { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes bounce  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  )
}
