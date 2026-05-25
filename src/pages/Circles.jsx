import { useState, useEffect, useMemo } from 'react'
import { getCircles, createCircle, joinCircle } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'
import { ethers } from 'ethers'

const C = {
  canvas: '#fffaf0', ink: '#0a0a0a', secondary: '#615e57',
  pink: '#ff3399', teal: '#008080', lavender: '#9966ff',
  peach: '#ff9966', ochre: '#cc9900',
  surface: '#f4f4ef', surface0: '#ffffff', border: '#cac6c3',
  white: '#ffffff', green: '#16a34a', red: '#dc2626', blue: '#2563eb',
}

const COLORS = [C.teal, C.lavender, C.peach, C.pink]

export default function Circles() {
  const { isConnected, address } = useWallet()
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create Circle Modal
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTarget, setNewTarget] = useState('10.0')
  const [creating, setCreating] = useState(false)

  // Invest/Contribute Modal
  const [selectedCircle, setSelectedCircle] = useState(null)
  const [investAmt, setInvestAmt] = useState('0.05')
  const [status, setStatus] = useState('idle') // idle | connecting | pending | confirming | confirmed | error
  const [txHash, setTxHash] = useState('')
  const [investErr, setInvestErr] = useState('')

  const loadCircles = () => {
    setLoading(true)
    getCircles()
      .then(res => {
        setCircles(Array.isArray(res) ? res : res.data || [])
        setError('')
      })
      .catch(err => {
        console.error(err)
        setError(err.message || 'Failed to load credit circles.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCircles()
  }, [])

  // Derived stats
  const activeCount = circles.length
  const totalPooled = circles.reduce((s, c) => s + Number(c.currentAmount || 0), 0)
  const avgYield = circles.length > 0 
    ? (circles.reduce((s, c) => s + (9.0 + (c.targetAmount % 4)), 0) / circles.length).toFixed(1)
    : '9.4'

  // My Circles: Filter pools where the user is a member
  const myCircles = useMemo(() => {
    if (!address) return []
    return circles.filter(c => 
      c.members?.map(m => m.toLowerCase()).includes(address.toLowerCase())
    )
  }, [circles, address])

  // Handle Create Circle
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName || !newDesc || !newTarget) {
      alert('Please fill out all fields.')
      return
    }
    setCreating(true)
    try {
      await createCircle({
        name: newName,
        description: newDesc,
        targetAmount: parseFloat(newTarget)
      })
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      setNewTarget('10.0')
      loadCircles()
    } catch (err) {
      alert('Error creating circle: ' + (err.message || err))
    } finally {
      setCreating(false)
    }
  }

  // Handle Contribute/Pool ETH
  const handleContribute = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first.')
      return
    }
    if (!investAmt || parseFloat(investAmt) <= 0) {
      setInvestErr('Enter a valid investment amount.')
      return
    }

    setInvestErr('')
    setStatus('connecting')

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not detected. Please install extension.')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const senderAddress = await signer.getAddress()

      // Target address: Pool operator or developer multisig (we use a mock contract address or the borrower's own address)
      const targetPoolWallet = "0x43CdD005E02aA2EBF78963B2E458182Dc5E5126f"
      const amountWei = ethers.parseEther(investAmt)

      setStatus('pending')
      
      // Real Ethereum Sepolia Transaction
      const tx = await signer.sendTransaction({
        to: targetPoolWallet,
        value: amountWei,
        gasLimit: 25000n
      })

      setTxHash(tx.hash)
      setStatus('confirming')

      // Wait 1 confirmation
      const receipt = await tx.wait(1)

      // Post to backend to record contribution
      await joinCircle(selectedCircle.id, parseFloat(investAmt), senderAddress)

      setStatus('confirmed')
      setTimeout(() => {
        setSelectedCircle(null)
        setStatus('idle')
        setTxHash('')
        loadCircles()
      }, 3000)

    } catch (err) {
      console.error(err)
      setStatus('error')
      setInvestErr(err.message || 'Transaction failed.')
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.canvas, color: C.ink, minHeight: '100vh', paddingBottom: 80 }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 64px 80px' }}>

        {/* Hero */}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56, gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Investment Circles</h1>
            <p style={{ fontSize: 18, color: C.secondary, lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
              Join or create private credit pools to pool capital, automate yield generation, and diversify risk with verified borrowers.
            </p>
          </div>
          {isConnected && (
            <button 
              onClick={() => setShowCreate(true)}
              style={{
                background: C.ink, color: C.white, border: 'none', borderRadius: 14,
                padding: '16px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'transform 0.15s', flexShrink: 0
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              + Create Credit Circle
            </button>
          )}
        </section>

        {/* Stats Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 64 }}>
          {[
            { label: 'Active Circles',       value: activeCount },
            { label: 'Total Pooled Capital',  value: `${totalPooled.toFixed(2)} ETH` },
            { label: 'Average Circle Yield',  value: `${avgYield}% APY` },
          ].map(s => (
            <div key={s.label} style={{
              background: C.surface0, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
              transition: 'transform 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary, marginBottom: 8 }}>{s.label}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink }}>{s.value}</span>
            </div>
          ))}
        </section>

        {/* Available Circles */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Available Pools</h2>
          </div>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: C.secondary }}>Loading lending pools...</div>
          ) : error ? (
            <div style={{ padding: 32, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: C.red }}>{error}</div>
          ) : circles.length === 0 ? (
            <div style={{ padding: 48, background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, textAlign: 'center', color: C.secondary }}>No private pools listed yet. Create one!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {circles.map((c, i) => {
                const pct = Math.min(100, Math.round(((c.currentAmount || 0) / c.targetAmount) * 100))
                const apy = (9.0 + (c.targetAmount % 4)).toFixed(1)
                const color = COLORS[i % COLORS.length]
                const ghostIcon = ['🌐', '🏢', '🏪', '🌿'][i % 4]
                const tag = ['Emerging Credit', 'Real Estate', 'SME Growth', 'GreenTech'][i % 4]
                
                return (
                  <div key={c.id} onClick={() => setSelectedCircle(c)} style={{
                    background: color, borderRadius: 24, padding: 32, color: C.white,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: 280, position: 'relative', overflow: 'hidden', cursor: 'pointer',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: 12, opacity: 0.15, fontSize: 130, lineHeight: 1 }}>{ghostIcon}</div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        display: 'inline-block', padding: '4px 14px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 600,
                        backdropFilter: 'blur(4px)', marginBottom: 16,
                      }}>{tag}</div>
                      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{c.name}</div>
                      <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, marginBottom: 16, maxWidth: '85%' }}>{c.description}</div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
                        <span>👥 {c.members?.length || 0} Members</span>
                        <span>📈 {apy}% APY</span>
                      </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                        <span>{pct}% Funded ({c.currentAmount?.toFixed(2)} ETH)</span>
                        <span>Goal: {c.targetAmount} ETH</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.25)', borderRadius: 999, height: 6 }}>
                        <div style={{ width: `${pct}%`, background: C.white, height: 6, borderRadius: 999 }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* My Pools */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>My Active Commitment</h2>
          <div style={{ background: C.surface0, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(244,244,239,0.5)' }}>
                  {['Circle Name','Active Pool Size','Yield Range','Participation Status','Actions'].map((h, i) => (
                    <th key={h} style={{
                      padding: '14px 24px', textAlign: i === 4 ? 'right' : 'left',
                      fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.secondary,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myCircles.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px 24px', textAlign: 'center', color: C.secondary, fontSize: 14 }}>
                      You haven't participated in any investment circles yet.
                    </td>
                  </tr>
                ) : (
                  myCircles.map((row, i) => {
                    const apy = (9.0 + (row.targetAmount % 4)).toFixed(1)
                    const status = row.currentAmount >= row.targetAmount ? 'Fully Funded' : 'Active Funding'
                    const icon = ['🌐', '🏢', '🏪', '🌿'][i % 4]
                    const color = COLORS[i % COLORS.length]
                    
                    return (
                      <tr key={row.id} style={{
                        borderBottom: i < myCircles.length - 1 ? `1px solid ${C.border}` : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,244,239,0.35)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: color + '15', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                              {icon}
                            </div>
                            <span style={{ fontWeight: 600, color: C.ink }}>{row.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', color: C.ink, fontWeight: 600 }}>{row.targetAmount} ETH</td>
                        <td style={{ padding: '16px 24px', color: C.teal, fontWeight: 700 }}>{apy}% APY</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 999,
                            background: status === 'Fully Funded' ? '#dcfce7' : '#fef3c7', 
                            fontSize: 12, fontWeight: 700, 
                            color: status === 'Fully Funded' ? '#16a34a' : '#d97706',
                          }}>{status}</span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => setSelectedCircle(row)} style={{ color: C.teal, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            Invest More
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* ── CREATE CIRCLE MODAL ── */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 20, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0a0a0a, #333)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0 }}>Create Private Credit Circle</h3>
                <p style={{ color: '#aaa', fontSize: 11, margin: '2px 0 0' }}>Pool capital and automate decentralized yield</p>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 18 }}>×</button>
            </div>
            
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 6 }}>Circle Name</label>
                <input type="text" placeholder="e.g. Apex FinTech Yield Pool" value={newName} onChange={e => setNewName(e.target.value)} required
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 6 }}>Description / Strategy</label>
                <textarea rows="3" placeholder="Describe the credit strategy, target borrowers, and collateralization terms..." value={newDesc} onChange={e => setNewDesc(e.target.value)} required
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 6 }}>Target Pool Size (ETH)</label>
                <input type="number" step="0.1" value={newTarget} onChange={e => setNewTarget(e.target.value)} required
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'JetBrains Mono, monospace' }} />
              </div>
              <button type="submit" disabled={creating} style={{ width: '100%', padding: 14, borderRadius: 12, background: C.ink, color: C.white, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 10 }}>
                {creating ? 'Creating Pool...' : 'Deploy Pool to Chain →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── INVEST/CONTRIBUTE MODAL ── */}
      {selectedCircle && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => { if (status !== 'confirming' && status !== 'pending') setSelectedCircle(null) }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 20, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
            <div style={{ background: 'linear-gradient(135deg, #008080, #004d4d)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0 }}>Join Investment Circle</h3>
                <p style={{ color: '#e6f4f4', fontSize: 11, margin: '2px 0 0' }}>{selectedCircle.name}</p>
              </div>
              <button type="button" disabled={status === 'confirming' || status === 'pending'} onClick={() => setSelectedCircle(null)} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 18 }}>×</button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {status === 'confirmed' ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, color: C.green }}>✓</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 8 }}>Capital Pooled Successfully!</div>
                  <p style={{ fontSize: 13, color: C.secondary, margin: '0 0 16px' }}>Your commitment is registered. Generating yields...</p>
                  <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: C.teal, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>View on Etherscan ↗</a>
                </div>
              ) : (
                <>
                  <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 13, color: C.secondary, marginBottom: 4 }}>Strategy / Goal</div>
                    <div style={{ fontSize: 14, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>{selectedCircle.description}</div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 6 }}>Amount to Pool (ETH)</label>
                    <input type="number" step="0.01" value={investAmt} onChange={e => setInvestAmt(e.target.value)} disabled={status !== 'idle' && status !== 'error'}
                      style={{ width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'JetBrains Mono, monospace' }} />
                  </div>

                  {status !== 'idle' && (
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.blue, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {status === 'connecting' && '⟳ Connecting MetaMask...'}
                        {status === 'pending' && '⟳ Waiting for approval...'}
                        {status === 'confirming' && '⟳ Waiting for confirmation...'}
                      </span>
                      {txHash && (
                        <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.blue, fontWeight: 700 }}>Etherscan ↗</a>
                      )}
                    </div>
                  )}

                  {investErr && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: C.red }}>{investErr}</div>
                  )}

                  <button onClick={handleContribute} disabled={status !== 'idle' && status !== 'error'}
                    style={{ width: '100%', padding: 14, borderRadius: 12, background: C.teal, color: C.white, border: 'none', fontWeight: 700, fontSize: 15, cursor: status === 'idle' || status === 'error' ? 'pointer' : 'not-allowed' }}>
                    Pool Capital via MetaMask →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: `1px solid rgba(196,199,199,0.15)`, padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, color: C.secondary }}>© 2024 VielFi Institutional Credit Marketplace</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Terms of Service','Privacy Policy','Compliance','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.secondary, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = C.ink}
              onMouseLeave={e => e.currentTarget.style.color = C.secondary}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}