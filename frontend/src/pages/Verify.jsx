/* ─────────────────────────────────────────────────────────────
   Verify — Supabase-inspired 4-step ZK verification flow
   Step 1: Profile selection (2×2 grid)
   Step 2: Animated progress bars (UPI/GST/Rental)
   Step 3: Dark terminal card with typewriter proof hash
   Step 4: Confetti + SBTCard reveal + AI narrative
───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Palette, ShoppingBag, Car, Lock, Sparkles, Smartphone, FileText, Home, Check } from 'lucide-react'
import SBTCard from '../components/SBTCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import Avatar from '../components/Avatar.jsx'
import { verifyProfile } from '../api/index.js'

const SBT_CONTRACT_URL = 'https://sepolia.etherscan.io/address/0x0000000000000000000000000000000000000000'

/* ── Demo profiles (API call is made on selection) ── */
const PROFILES = [
  {
    id:      'rahul',
    name:    'Rahul Sharma',
    role:    'Street Food Vendor',
    city:    'Delhi',
    Icon:    Store,
    iconColor: '#92400E',
    tier:    'Gold',
    score:   762,
    tagline: 'UPI & GST Verified Business Owner',
    signals: { upi: true, gst: true, rental: false },
    story:   'Rahul processes ₹2.1L monthly through UPI across 3 food stalls. Never missed a payment.',
  },
  {
    id:      'priya',
    name:    'Priya Nair',
    role:    'Freelance Designer',
    city:    'Bangalore',
    Icon:    Palette,
    iconColor: '#7C3AED',
    tier:    'Platinum',
    score:   851,
    tagline: 'Top Rated Creative Professional',
    signals: { upi: true, gst: false, rental: true },
    story:   'Priya earns ₹3.5L/mo from international clients. Consistent rental payments for 4 years.',
  },
  {
    id:      'anita',
    name:    'Anita Meena',
    role:    'Kirana Store Owner',
    city:    'Jaipur',
    Icon:    ShoppingBag,
    iconColor: '#065F46',
    tier:    'Silver',
    score:   681,
    tagline: 'Registered SME with GST History',
    signals: { upi: true, gst: true, rental: false },
    story:   'Anita has operated her store for 6 years with consistent GST filings.',
  },
  {
    id:      'vikram',
    name:    'Vikram Singh',
    role:    'Auto Driver',
    city:    'Mumbai',
    Icon:    Car,
    iconColor: '#0C4A6E',
    tier:    'Bronze',
    score:   558,
    tagline: 'Ola/Uber Verified Driver Partner',
    signals: { upi: true, gst: false, rental: true },
    story:   'Vikram has driven 8,000+ trips with 4.8 rating. Consistent rental payments in Dharavi.',
  },
]

/* ── Step indicator ── */
function StepIndicator({ current }) {
  const steps = ['Select Profile', 'Analyze Data', 'Generate Proof', 'Reveal Identity']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
      {steps.map((label, i) => {
        const idx    = i + 1
        const done   = idx < current
        const active = idx === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div className={`step-dot ${done ? 'complete' : active ? 'active' : 'inactive'}`}>
                {done ? (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : idx}
              </div>
              <span style={{
                fontSize:   11,
                fontFamily: "'Inter',sans-serif",
                fontWeight: active ? 600 : 400,
                color:      active ? '#111827' : done ? '#10B981' : '#9CA3AF',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-line ${done ? 'complete' : ''}`} style={{ width: 64, margin: '0 8px', marginTop: -20 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Typewriter hook (preserved exactly from original) ── */
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

/* ── Animated progress hook (preserved exactly from original) ── */
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

const SIGNALS = [
  { key: 'upi',    label: 'UPI Transactions', detail: 'Analyzing 90-day history…',  color: '#6366F1', Icon: Smartphone },
  { key: 'gst',    label: 'GST Filings',       detail: 'Fetching GSTIN records…',   color: '#D4AF37', Icon: FileText  },
  { key: 'rental', label: 'Rental History',    detail: 'Verifying payment stream…', color: '#10B981', Icon: Home     },
]

export default function Verify() {
  const [step,           setStep]           = useState(1)
  const [selected,       setSelected]       = useState(null)
  const [verifyData,     setVerifyData]     = useState(null)
  const [apiError,       setApiError]       = useState('')
  const [scoreCount,     setScoreCount]     = useState(300)
  const [analyzeStarted, setAnalyzeStarted] = useState(false)
  const navigate = useNavigate()

  const { progress, allDone: progressDone } = useAnimatedProgress(analyzeStarted)

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

  /* Step 2 → 3 */
  useEffect(() => {
    if (progressDone && step === 2) {
      setTimeout(() => setStep(3), 600)
    }
  }, [progressDone, step])

  /* Step 3 → 4 */
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

  const getTier = () => {
    if (verifyData?.tier) return verifyData.tier
    return selected?.tier || 'Silver'
  }

  const getSignals = () => {
    if (!verifyData) return selected?.signals || { upi: true, gst: true, rental: false }
    return {
      upi:    (verifyData.upiScore    || 0) > 0,
      gst:    (verifyData.gstScore    || 0) > 0,
      rental: (verifyData.rentalScore || 0) > 0,
    }
  }

  const resetFlow = () => {
    setStep(1)
    setSelected(null)
    setVerifyData(null)
    setAnalyzeStarted(false)
    setScoreCount(300)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeIn 300ms cubic-bezier(0.16,1,0.3,1) both' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Identity Protocol</div>
          <h1 style={{
            fontFamily:    "'Inter',sans-serif",
            fontSize:      'clamp(28px, 5vw, 40px)',
            fontWeight:    700,
            color:         '#111827',
            letterSpacing: '-0.03em',
            marginTop:     0,
            marginBottom:  10,
          }}>
            Get Your{' '}
            <span style={{
              background:           'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #B8960C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Credit SBT
            </span>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#6B7280', margin: 0 }}>
            ZK-verified credit identity in 4 steps. No data exposed.
          </p>
        </div>

        <StepIndicator current={step} />

        {/* ── STEP 1: Profile Selection ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 250ms cubic-bezier(0.16,1,0.3,1) both' }}>
            <p style={{ textAlign: 'center', fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', marginBottom: 24, marginTop: 0 }}>
              Choose a demo borrower profile to verify
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProfile(p)}
                  style={{
                    textAlign:    'left',
                    background:   '#FFFFFF',
                    border:       '1px solid #E5E7EB',
                    borderRadius: 10,
                    padding:      20,
                    cursor:       'pointer',
                    transition:   'border-color 150ms, box-shadow 150ms, transform 150ms',
                    width:        '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#D4AF37'
                    e.currentTarget.style.boxShadow   = '0 4px 12px rgba(212,175,55,0.12)'
                    e.currentTarget.style.transform   = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E5E7EB'
                    e.currentTarget.style.boxShadow   = 'none'
                    e.currentTarget.style.transform   = 'none'
                  }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.99)' }}
                  onMouseUp={e   => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <Avatar name={p.name} size="md" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: '#111827' }}>
                          {p.name}
                        </span>
                        <TierBadge tier={p.tier} size="sm" />
                      </div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#9CA3AF' }}>
                        {p.role} · {p.city}
                      </div>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize:   13,
                    color:      '#6B7280',
                    lineHeight: 1.5,
                    margin:     0,
                    display:    '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow:   'hidden',
                  }}>
                    {p.story}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Analyzing Data ── */}
        {step === 2 && selected && (
          <div style={{ maxWidth: 520, margin: '0 auto', animation: 'slideUp 300ms cubic-bezier(0.16,1,0.3,1) both' }}>
            <div className="card" style={{ padding: 28 }}>
              {/* Profile row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Avatar name={selected.name} size="lg" />
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 16, color: '#111827' }}>{selected.name}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#9CA3AF' }}>{selected.role} · {selected.city}</div>
                </div>
              </div>

              {/* API offline notice */}
              {apiError && (
                <div style={{
                  marginBottom: 16,
                  padding:      '8px 12px',
                  borderRadius: 6,
                  background:   '#FEF3C7',
                  border:       '1px solid #F59E0B',
                  color:        '#92400E',
                  fontSize:     12,
                  fontFamily:   "'Inter',sans-serif",
                }}>
                  Backend offline — running in demo mode
                </div>
              )}

              {/* Progress bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {SIGNALS.map(({ key, label, detail, color, Icon: SignalIcon }) => (
                  <div key={key}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SignalIcon size={14} color={color} />
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {progress[key] < 100 ? (
                          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#9CA3AF' }}>{detail}</span>
                        ) : (
                          <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 9999, background: '#D1FAE5', color: '#065F46', fontFamily: "'Inter',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Check size={10} strokeWidth={3} /> Verified
                          </span>
                        )}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: 'right' }}>
                          {progress[key]}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={progress[key]} color={color} height={5} animated={false} />
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{
                marginTop:      24,
                paddingTop:     20,
                borderTop:      '1px solid #E5E7EB',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            10,
              }}>
                <div style={{
                  width:        14,
                  height:       14,
                  borderRadius: '50%',
                  border:       '2px solid #6366F1',
                  borderTopColor: 'transparent',
                  animation:    'spin 0.7s linear infinite',
                }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#6B7280' }}>
                  Generating zero-knowledge proof…
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Proof Hash ── */}
        {step === 3 && selected && (
          <div style={{ maxWidth: 520, margin: '0 auto', animation: 'slideUp 300ms cubic-bezier(0.16,1,0.3,1) both' }}>
            <div className="card" style={{ padding: 28 }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  width:          56,
                  height:         56,
                  borderRadius:   12,
                  background:     '#1F2937',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  margin:         '0 auto 14px',
                }}><Lock size={26} color="#D4AF37" /></div>
                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginTop: 0, marginBottom: 6 }}>
                  ZK Proof Generated
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', margin: 0 }}>
                  Your credit signals proved. No data revealed.
                </p>
              </div>

              {/* Terminal card */}
              <div className="card-terminal" style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Groth16 Proof Hash
                </p>
                <p style={{
                  fontFamily:  "'JetBrains Mono',monospace",
                  fontSize:    12,
                  color:       '#10B981',
                  lineHeight:  1.6,
                  wordBreak:   'break-all',
                  margin:      0,
                }}>
                  {typedProof}
                  <span style={{ animation: 'blink 0.8s step-end infinite', color: '#D4AF37' }}>|</span>
                </p>
              </div>

              {/* Proof metadata grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Circuit',  value: 'credit_v2.circom' },
                  { label: 'Verifier', value: 'Ethereum Sepolia'  },
                  { label: 'Signals',  value: '3 verified'        },
                  { label: 'Gas Used', value: '~0.001 ETH'        },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background:   '#F9FAFB',
                    border:       '1px solid #E5E7EB',
                    borderRadius: 6,
                    padding:      '10px 12px',
                  }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#374151', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Minting status */}
              <p style={{ textAlign: 'center', fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#9CA3AF', marginTop: 20, marginBottom: 0, animation: 'fadeIn 500ms ease both' }}>
                Minting your SBT on-chain…
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 4: SBT Reveal ── */}
        {step === 4 && selected && (
          <div style={{ maxWidth: 440, margin: '0 auto', animation: 'slideUp 350ms cubic-bezier(0.16,1,0.3,1) both' }}>

            {/* Celebration */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, animation: 'pulseOnce 600ms cubic-bezier(0.16,1,0.3,1) both' }}>
                <Sparkles size={40} color="#D4AF37" />
              </div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', marginTop: 0, marginBottom: 6 }}>
                Identity Verified!
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B7280', margin: 0 }}>
                Your Soul-Bound Token is live on Ethereum Sepolia
              </p>
            </div>

            {/* API score breakdown */}
            {verifyData && (
              <div className="card-sm" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                {[
                  { label: 'UPI Score',    value: verifyData.upiScore,    color: '#6366F1' },
                  { label: 'GST Score',    value: verifyData.gstScore,    color: '#D4AF37' },
                  { label: 'Rental Score', value: verifyData.rentalScore, color: '#10B981' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color }}>{Math.round(value ?? 0)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* AI narrative */}
            {verifyData?.narrative && (
              <div style={{
                background:   '#EEF2FF',
                border:       '1px solid #C7D2FE',
                borderRadius: 8,
                padding:      '14px 16px',
                marginBottom: 16,
              }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#4338CA', fontWeight: 600, margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI Credit Narrative
                </p>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                  {verifyData.narrative}
                </p>
              </div>
            )}

            {/* SBT Card */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <SBTCard
                name={selected.name}
                role={selected.role}
                city={selected.city}
                tier={getTier()}
                score={scoreCount}
                signals={getSignals()}
                hash={verifyData?.proofHash || '0x7f3a9b2e1c4d8f6a5b0e3d...'}
                animate={true}
              />
            </div>

            {/* Etherscan link */}
            <a
              href={SBT_CONTRACT_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display:        'block',
                textAlign:      'center',
                fontFamily:     "'JetBrains Mono',monospace",
                fontSize:       12,
                color:          '#D4AF37',
                marginBottom:   20,
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
            >
              View contract on Etherscan ↗
            </a>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate('/feed')}
                style={{
                  flex:         1,
                  height:       44,
                  borderRadius: 6,
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
                Browse Loans →
              </button>
              <button
                onClick={resetFlow}
                style={{
                  flex:         1,
                  height:       44,
                  borderRadius: 6,
                  background:   '#FFFFFF',
                  color:        '#374151',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   500,
                  border:       '1px solid #E5E7EB',
                  cursor:       'pointer',
                  transition:   'border-color 150ms, transform 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
                onMouseDown={e  => { e.currentTarget.style.transform   = 'scale(0.98)' }}
                onMouseUp={e    => { e.currentTarget.style.transform   = 'none' }}
              >
                Try Another
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
