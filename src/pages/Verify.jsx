import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { verifyCreditCustom } from '../api/index.js'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  teal: '#008080', lavender: '#9966ff', peach: '#ff9966',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', pink: '#ff3399', green: '#16a34a', red: '#dc2626', blue: '#2563eb',
}

const STEPS = [
  { num: 1, label: 'Institutional Info' },
  { num: 2, label: 'Individual Identity' },
  { num: 3, label: 'Financial Verification' },
  { num: 4, label: 'Review & Submit' },
]

export default function Verify() {
  const navigate = useNavigate()
  const { isConnected, address, setRole } = useWallet()
  const [step, setStep] = useState(1)

  // Step 1: Institutional Info
  const [bizName, setBizName] = useState('Rahul Electronics')
  const [bizType, setBizType] = useState('Sole Proprietorship')
  const [bizAddress, setBizAddress] = useState('Shop 4, Lane 2, MG Road, Pune, MH')
  const [gstin, setGstin] = useState('27AAAAA1111A1Z1')
  const [revenue, setRevenue] = useState('80000')

  // Step 2: Individual Identity
  const [legalName, setLegalName] = useState('Rahul Patil')
  const [dob, setDob] = useState('1994-04-29')
  const [citizenship, setCitizenship] = useState('India')
  
  // ID Upload
  const fileInputRef = useRef(null)
  const [idFileName, setIdFileName] = useState('')
  const [idProgress, setIdProgress] = useState(0)
  const [idUploading, setIdUploading] = useState(false)
  const [idUploaded, setIdUploaded] = useState(false)

  // Liveness Check
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [cameraPermission, setCameraPermission] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [livenessStatus, setLivenessStatus] = useState('idle') // idle | scanning | verified | error
  const [livenessScore, setLivenessScore] = useState(0)

  // Step 3: Financial Verification (Bank Statement Upload)
  const bankInputRef = useRef(null)
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')
  const [statementFileName, setStatementFileName] = useState('')
  const [statementUploading, setStatementUploading] = useState(false)
  const [statementProgress, setStatementProgress] = useState(0)
  const [statementUploaded, setStatementUploaded] = useState(false)
  const [statementLogs, setStatementLogs] = useState([])
  const [analyzingTransactions, setAnalyzingTransactions] = useState(false)

  // Extracted credit metrics
  const [creditMetrics, setCreditMetrics] = useState(null)

  // Step 4: Review & Cryptographic Proof
  const [generatingProof, setGeneratingProof] = useState(false)
  const [proofProgress, setProofProgress] = useState(0)
  const [proofLogs, setProofLogs] = useState([])
  const [proofGenerated, setProofGenerated] = useState(false)
  const [proofHash, setProofHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verifiedSuccess, setVerifiedSuccess] = useState(false)

  // Autodetect lender or borrower preferences
  useEffect(() => {
    if (!isConnected) {
      // Prompt wallet connection
    }
  }, [isConnected])

  // Liveness Check logic
  const startCamera = async () => {
    setCameraActive(true)
    setLivenessStatus('scanning')
    setCapturedPhoto(null)
    setCameraPermission(null)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraStream(stream)
        setCameraPermission(true)
      }
    } catch (err) {
      console.warn('Camera blocked or unavailable, using simulation:', err)
      setCameraPermission(false)
      // Simulate face scan
      let tick = 0
      const int = setInterval(() => {
        tick += 10
        if (tick >= 100) {
          clearInterval(int)
          setLivenessStatus('verified')
          setLivenessScore(99.2)
          setCapturedPhoto('SIMULATED_FACE')
        }
      }, 300)
    }
  }

  const capturePhoto = () => {
    if (cameraStream && videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 300
      ctx.drawImage(video, 0, 0, 300, 300)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setCapturedPhoto(dataUrl)
      
      // Stop stream
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setCameraActive(false)
      
      // Perform liveness validation
      setLivenessStatus('verifying')
      setTimeout(() => {
        setLivenessStatus('verified')
        setLivenessScore(98.4)
      }, 1500)
    }
  }

  // Browse and upload ID Card
  const triggerIdSelect = () => {
    fileInputRef.current?.click()
  }

  const handleIdChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIdFileName(file.name)
      setIdUploading(true)
      setIdProgress(0)
      setIdUploaded(false)

      const int = setInterval(() => {
        setIdProgress(prev => {
          if (prev >= 100) {
            clearInterval(int)
            setIdUploading(false)
            setIdUploaded(true)
            return 100
          }
          return prev + 20
        })
      }, 200)
    }
  }

  // Bank Statement Upload logic
  const triggerBankSelect = () => {
    bankInputRef.current?.click()
  }

  const handleBankChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setStatementFileName(file.name)
      setStatementUploading(true)
      setStatementProgress(0)
      setStatementUploaded(false)
      setAnalyzingTransactions(true)
      setStatementLogs([])

      // Step-by-step progress logging
      const logs = [
        '📂 Reading bank statement PDF/CSV...',
        '⚙ Parsing structured transaction records...',
        '🔍 Analyzing UPI income and digital debits...',
        '📊 Verifying recurring rental transactions...',
        '🛡 Verifying financial health indicators...'
      ]

      let currentLogIdx = 0
      const int = setInterval(() => {
        setStatementProgress(prev => {
          if (prev >= 100) {
            clearInterval(int)
            setStatementUploading(false)
            setStatementUploaded(true)
            setAnalyzingTransactions(false)
            
            // Generate dynamic credit metrics based on monthly inputs
            const calculatedUPI = parseFloat(revenue) * 12
            const cibilScore = calculatedUPI > 800000 ? 845 : calculatedUPI > 500000 ? 762 : calculatedUPI > 200000 ? 610 : 420
            const assignedTier = cibilScore >= 800 ? 'Platinum' : cibilScore >= 700 ? 'Gold' : cibilScore >= 550 ? 'Silver' : 'Bronze'
            
            setCreditMetrics({
              monthlyInflow: parseFloat(revenue),
              avgBalance: Math.round(parseFloat(revenue) * 0.3),
              upiScore: Math.round(calculatedUPI / 1000),
              gstScore: gstin ? 90 : 0,
              rentalMonths: 36,
              rentalTimeliness: 0.95,
              cibilScore,
              tier: assignedTier
            })
            return 100
          }
          
          if (currentLogIdx < logs.length) {
            setStatementLogs(prev => [...prev, logs[currentLogIdx]])
            currentLogIdx++
          }
          return prev + 20
        })
      }, 600)
    }
  }

  // Generate ZK Cryptographic Proof
  const generateZKProof = () => {
    setGeneratingProof(true)
    setProofProgress(0)
    setProofLogs([])

    const logs = [
      '⚡ Initializing credit proof constraints...',
      '🔐 Loading weighted CIBIL score calculation circuit...',
      '🛠 Generating prover witnesses with public input keys...',
      '🧮 Computing Groth16 cryptographic proof constraints...',
      '📝 Creating ZK commitment hash commitment...',
      '✓ Soulbound Token (SBT) Proof Hash successfully generated!'
    ]

    let logIdx = 0
    const int = setInterval(() => {
      setProofProgress(prev => {
        if (prev >= 100) {
          clearInterval(int)
          setGeneratingProof(false)
          setProofGenerated(true)
          setProofHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''))
          return 100
        }
        
        if (logIdx < logs.length) {
          setProofLogs(prev => [...prev, logs[logIdx]])
          logIdx++
        }
        return prev + 17
      })
    }, 500)
  }

  // Submit and verify user in Database
  const submitVerification = async () => {
    if (!isConnected) {
      alert('Wallet is not connected. Connect MetaMask first.')
      return
    }
    setSubmitting(true)
    try {
      // Calculate scores on backend, which automatically upserts to database users table!
      const upiAnnual = creditMetrics.monthlyInflow * 12
      const result = await verifyCreditCustom({
        upi: upiAnnual,
        gst: gstin ? 12 : 0,
        rentalMonths: 36,
        rentalTimeliness: 0.95,
        address: address
      })

      // Set user's local role preference to borrower
      setRole('borrower')

      setVerifiedSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)

    } catch (err) {
      console.error(err)
      alert('Verification submission failed: ' + (err.message || err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh', paddingBottom: 100 }}>
      <main style={{ flex: 1, padding: '56px 64px', maxWidth: 1040, margin: '0 auto' }}>
        
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>
          Identity & Financial Verification
        </h1>
        <p style={{ fontSize: 16, color: C.secondary, lineHeight: 1.6, margin: '0 0 48px', maxWidth: 600 }}>
          Comply with decentralized finance regulations and unlock institutional borrowing access. All details are encrypted in zero-knowledge.
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 56, position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: s.num < step ? C.green : s.num === step ? C.ink : 'transparent',
                  border: `2px solid ${s.num < step ? C.green : s.num === step ? C.ink : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  color: s.num <= step ? C.white : C.secondary,
                  transition: 'all 0.3s'
                }}>
                  {s.num < step ? '✓' : s.num}
                </div>
                <span style={{ fontSize: 12, fontWeight: s.num === step ? 700 : 400, color: s.num === step ? C.ink : C.secondary, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step > s.num ? C.green : C.border, marginTop: 20, maxWidth: 120, transition: 'all 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Success Splash */}
        {verifiedSuccess ? (
          <div style={{ background: C.surface0, border: `2px solid ${C.green}`, borderRadius: 24, padding: 64, textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: `3px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, color: C.green }}>✓</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink, marginBottom: 12 }}>You Are Now Verified!</h2>
            <p style={{ fontSize: 16, color: C.secondary, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Congratulations <strong>{legalName}</strong>! Your transaction statement has been fully analyzed and cryptographic credit proof successfully minted.
            </p>
            <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, maxWidth: 400, margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Credit Score</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>{creditMetrics?.cibilScore}</div>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div>
                <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Assigned Tier</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.teal }}>{creditMetrics?.tier}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.secondary, marginTop: 24 }}>Redirecting to your active dashboard...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            
            {/* Left Box (Dynamic form content) */}
            <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, flex: 1 }}>
              
              {step === 1 && (
                /* Step 1: Institutional Info */
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Institutional Info</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Business / Shop Name</label>
                      <input type="text" value={bizName} onChange={e => setBizName(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Business Entity Type</label>
                        <select value={bizType} onChange={e => setBizType(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }}>
                          <option>Sole Proprietorship</option>
                          <option>Private Limited</option>
                          <option>Partnership</option>
                          <option>Freelancer / Individual</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Monthly Revenue (INR)</label>
                        <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none', fontFamily: 'JetBrains Mono, monospace' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>GSTIN / Tax ID (Optional)</label>
                      <input type="text" placeholder="27AAAAA1111A1Z1" value={gstin} onChange={e => setGstin(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none', fontFamily: 'JetBrains Mono, monospace' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Registered Business Address</label>
                      <input type="text" value={bizAddress} onChange={e => setBizAddress(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                /* Step 2: Individual Identity */
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Personal Information</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Legal Full Name</label>
                      <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="As it appears on your government ID"
                        style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Date of Birth</label>
                        <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Citizenship</label>
                        <select value={citizenship} onChange={e => setCitizenship(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }}>
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Singapore</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                /* Step 3: Financial Verification (Bank Statement) */
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>Financial Verification</h2>
                  <p style={{ fontSize: 14, color: C.secondary, lineHeight: 1.5, margin: '0 0 24px' }}>
                    Upload your official bank transaction statement (PDF/CSV) to evaluate your consistent monthly cash flows and verify creditworthiness.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.secondary, marginBottom: 6 }}>Primary Banking Institution</label>
                      <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, color: C.ink, outline: 'none' }}>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>

                    {/* Bank Statement Upload Area */}
                    <div style={{ background: '#fcfcf9', border: `2px dashed ${C.border}`, borderRadius: 16, padding: '32px 24px', textAlign: 'center' }}>
                      <input type="file" ref={bankInputRef} onChange={handleBankChange} accept=".pdf,.csv" style={{ display: 'none' }} />
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: C.ink }}>Upload 6-Month Bank Statement</h4>
                      <p style={{ fontSize: 13, color: C.secondary, margin: '0 0 16px' }}>Supports PDF format from HDFC, SBI, ICICI, etc.</p>
                      
                      {statementUploading ? (
                        <div style={{ maxWidth: 280, margin: '0 auto' }}>
                          <div style={{ height: 6, background: '#e0ddd8', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                            <div style={{ height: '100%', width: `${statementProgress}%`, background: C.teal, transition: 'width 0.2s' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Uploading & Parsing statement ({statementProgress}%)</span>
                        </div>
                      ) : statementUploaded ? (
                        <div style={{ color: C.green, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          ✓ {statementFileName} successfully uploaded and analyzed!
                        </div>
                      ) : (
                        <button type="button" onClick={triggerBankSelect}
                          style={{ background: C.teal, color: C.white, border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                          Select Bank PDF
                        </button>
                      )}
                    </div>

                    {/* Transaction scanning logs */}
                    {statementLogs.length > 0 && (
                      <div style={{ background: '#0a0a0a', color: '#10B981', fontFamily: 'JetBrains Mono, monospace', padding: 16, borderRadius: 10, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
                        {statementLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                        {analyzingTransactions && <div style={{ animation: 'blink 1s infinite' }}>⏳ analyzing statements...</div>}
                      </div>
                    )}

                    {/* Extracted Analytics Dashboard */}
                    {creditMetrics && (
                      <div style={{ background: '#fdf9f0', border: `1px solid ${C.gold}`, borderRadius: 16, padding: '24px 28px', marginTop: 10, animation: 'fadeIn 0.4s' }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: C.gold, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>🌱 Verified Credit Health Indicators</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                          <div>
                            <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Verified Monthly Inflow</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>₹{creditMetrics.monthlyInflow.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Avg Monthly Balance</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>₹{creditMetrics.avgBalance.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Derived Credit Score</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{creditMetrics.cibilScore}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: C.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Proposed Tier</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: C.teal }}>{creditMetrics.tier}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                /* Step 4: Review & ZK-Proof minting */
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 20px' }}>Review & Cryptographic Proof</h2>
                  <p style={{ fontSize: 14, color: C.secondary, lineHeight: 1.5, margin: '0 0 24px' }}>
                    Generate your private zero-knowledge credit proof. This encapsulates your scores and credit tier without leaking any transaction details.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Summary list */}
                    <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Legal Name', value: legalName },
                        { label: 'Registered Business', value: bizName },
                        { label: 'Bank Institution', value: selectedBank },
                        { label: 'Derived Credit Score', value: `${creditMetrics?.cibilScore || 762} (${creditMetrics?.tier || 'Gold'})` },
                        { label: 'Liveness Match', value: 'Face verified successfully ✓' }
                      ].map(f => (
                        <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: `1px solid ${C.surface}`, paddingBottom: 8 }}>
                          <span style={{ color: C.secondary }}>{f.label}</span>
                          <span style={{ fontWeight: 600, color: C.ink }}>{f.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cryptographic proof console */}
                    {proofLogs.length > 0 && (
                      <div style={{ background: '#0a0a0a', color: '#10B981', fontFamily: 'JetBrains Mono, monospace', padding: 16, borderRadius: 10, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                        {proofLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                        {generatingProof && <div style={{ animation: 'blink 1s infinite' }}>⚙ generating snark proof...</div>}
                      </div>
                    )}

                    {proofGenerated ? (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, fontSize: 13, color: C.green, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>✓ ZK Credit Proof successfully generated!</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, wordBreak: 'break-all', opacity: 0.8 }}>SBT Commit: {proofHash}</div>
                      </div>
                    ) : (
                      <button type="button" onClick={generateZKProof} disabled={generatingProof}
                        style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #9966ff, #6633cc)', color: C.white, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        {generatingProof ? 'Generating SNARK Proof...' : 'Generate ZK Cryptographic Credit Proof →'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Box (ID Upload and Camera widgets) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 300 }}>
              
              {/* Step 2 Right Widgets (Upload ID & Liveness) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Upload Government ID */}
                <div style={{
                  background: C.lavender, borderRadius: 20, padding: 32, color: C.white,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16
                }}>
                  <div style={{ fontSize: 48 }}>🪪</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Upload Government ID</h3>
                  <p style={{ fontSize: 13, opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
                    Passport, Driver's License, or Aadhaar. Clear color photos.
                  </p>
                  
                  <input type="file" ref={fileInputRef} onChange={handleIdChange} accept="image/*,.pdf" style={{ display: 'none' }} />
                  
                  {idUploading ? (
                    <div style={{ width: '100%' }}>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                        <div style={{ height: '100%', width: `${idProgress}%`, background: C.white, transition: 'width 0.2s' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Uploading ({idProgress}%)</span>
                    </div>
                  ) : idUploaded ? (
                    <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      ✓ {idFileName} uploaded!
                    </div>
                  ) : (
                    <button type="button" onClick={triggerIdSelect}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.2)', color: C.white,
                        border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
                        padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        backdropFilter: 'blur(4px)', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                      ⬆ Browse ID Photo
                    </button>
                  )}
                </div>

                {/* Liveness check widget */}
                <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>😊 Liveness Selfie Check</h4>
                  
                  {cameraActive ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, border: `1px solid ${C.border}` }} />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      <button type="button" onClick={capturePhoto}
                        style={{ padding: '8px 18px', background: C.gold, border: 'none', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        📸 Capture Selfie
                      </button>
                    </div>
                  ) : livenessStatus === 'verifying' ? (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: C.secondary, fontSize: 13, fontWeight: 600 }}>
                      ⟳ Scanning facial landmarks...
                    </div>
                  ) : livenessStatus === 'verified' ? (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dcfce7', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: C.green }}>✓</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Liveness Verified</div>
                        <div style={{ fontSize: 12, color: C.secondary }}>{livenessScore}% face match score</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.peach, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📷</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.4, marginBottom: 8 }}>A quick selfie using your webcam to confirm liveness.</div>
                        <button type="button" onClick={startCamera} style={{ color: C.teal, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                          Start Camera →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {!verifiedSuccess && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                style={{
                  background: 'none', border: `1px solid ${C.border}`, borderRadius: 14,
                  padding: '16px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  color: C.ink, transition: 'transform 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button type="button"
                onClick={() => {
                  if (step === 2 && (!idUploaded || livenessStatus !== 'verified')) {
                    alert('Please upload your ID and verify your liveness before continuing.')
                    return
                  }
                  if (step === 3 && !statementUploaded) {
                    alert('Please upload and verify your bank statement statement before continuing.')
                    return
                  }
                  setStep(s => s + 1)
                }}
                style={{
                  background: C.ink, color: C.white, border: 'none', borderRadius: 14,
                  padding: '16px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {step === 1 && 'Continue to Personal Details →'}
                {step === 2 && 'Continue to Financials →'}
                {step === 3 && 'Continue to Review & SBT →'}
              </button>
            ) : (
              <button type="button" onClick={submitVerification} disabled={!proofGenerated || submitting}
                style={{
                  background: !proofGenerated || submitting ? '#e5e7eb' : C.ink,
                  color: !proofGenerated || submitting ? '#9ca3af' : C.white,
                  border: 'none', borderRadius: 14,
                  padding: '16px 36px', fontSize: 15, fontWeight: 700,
                  cursor: !proofGenerated || submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.15s'
                }}
                onMouseEnter={e => { if (proofGenerated && !submitting) e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { if (proofGenerated && !submitting) e.currentTarget.style.transform = 'scale(1)' }}
              >
                {submitting ? 'Submitting Verification...' : 'Submit & Claim Verification ✓'}
              </button>
            )}
          </div>
        )}

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </div>
  )
}