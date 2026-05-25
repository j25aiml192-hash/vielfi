/* ─────────────────────────────────────────────────────────────
   FundLoan.jsx — Real ETH wallet-to-wallet transfer on Sepolia
   Props: { loan, onClose, onSuccess }
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { ethers } from 'ethers'
import { confirmFunding } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'

const C = {
  bg: '#f4f2ef', surface: '#ffffff', border: '#e0ddd8',
  text: '#1a1a1a', muted: '#888888', gold: '#c9952a',
  green: '#16a34a', red: '#dc2626', blue: '#2563eb',
}

const QUICK_AMOUNTS = [
  { label: '0.001 ETH', value: 0.001 },
  { label: '0.005 ETH', value: 0.005 },
  { label: '0.01 ETH',  value: 0.01  },
  { label: '0.05 ETH',  value: 0.05  },
]

const SEPOLIA_CHAIN_ID = 11155111n

const statusConfig = {
  idle:        { label: null,                          color: C.gold  },
  connecting:  { label: '⟳ Connecting MetaMask…',    color: C.muted },
  pending:     { label: '⟳ Waiting for approval…',   color: C.muted },
  submitted:   { label: '⟳ Transaction submitted…',   color: C.blue  },
  confirming:  { label: '⟳ Waiting for confirmation…', color: C.blue },
  confirmed:   { label: '✓ Funded Successfully!',     color: C.green },
  rejected:    { label: '✗ Transaction Rejected',     color: C.red   },
  error:       { label: '✗ Transaction Failed',       color: C.red   },
}

export default function FundLoan({ loan, onClose, onSuccess }) {
  const { address: lenderAddr } = useWallet()
  const [amount,    setAmount]    = useState(0.005)
  const [custom,    setCustom]    = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [status,    setStatus]    = useState('idle')
  const [txHash,    setTxHash]    = useState('')
  const [receipt,   setReceipt]   = useState(null)
  const [errMsg,    setErrMsg]    = useState('')

  const finalAmount = useCustom ? parseFloat(custom || 0) : amount
  const inrValue    = Math.round(finalAmount * 250000)

  const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '?'

  const executeFunding = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install MetaMask extension.')
      return
    }
    if (!finalAmount || finalAmount <= 0) {
      setErrMsg('Enter a valid ETH amount.')
      return
    }
    setErrMsg('')
    setStatus('connecting')

    try {
      // Get provider
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Request accounts
      await provider.send('eth_requestAccounts', [])
      const signer       = await provider.getSigner()
      const lenderAddress = await signer.getAddress()

      // Check + switch to Sepolia
      const network = await provider.getNetwork()
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        setStatus('pending')
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          })
        } catch (switchErr) {
          // Chain not added — ask MetaMask to add it
          if (switchErr.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia test network',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              }],
            })
          } else {
            throw switchErr
          }
        }
      }

      setStatus('pending')

      // Convert ETH → wei
      const amountWei = ethers.parseEther(finalAmount.toString())

      // Direct wallet-to-wallet ETH transfer
      const tx = await signer.sendTransaction({
        to:       loan.borrower_address,
        value:    amountWei,
        gasLimit: 21000n,
      })

      setStatus('submitted')
      setTxHash(tx.hash)

      // Wait for 1 confirmation
      setStatus('confirming')
      const rec = await tx.wait(1)
      setReceipt(rec)
      setStatus('confirmed')

      // Record in Supabase
      await confirmFunding({
        loan_id:        loan.id,
        lender_address: lenderAddress,
        amount_eth:     finalAmount,
        tx_hash:        tx.hash,
        block_number:   rec.blockNumber,
      })

      onSuccess?.({ txHash: tx.hash, amountEth: finalAmount })

    } catch (err) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setStatus('rejected')
      } else {
        setStatus('error')
        setErrMsg(err.message || 'Unknown error')
      }
    }
  }

  const reset = () => {
    setStatus('idle')
    setTxHash('')
    setReceipt(null)
    setErrMsg('')
  }

  const s = statusConfig[status]

  return (
    /* ── Modal overlay ── */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose?.()}>

      <div style={{
        background: C.surface, borderRadius: 18,
        width: '100%', maxWidth: 440,
        boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
        overflow: 'hidden', fontFamily: 'Inter, sans-serif',
        animation: 'fundIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>Fund This Loan</div>
            <div style={{ color: '#a0aec0', fontSize: 12, marginTop: 2 }}>Real ETH on Sepolia Testnet</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ padding: 24 }}>

          {/* Loan summary */}
          <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>{loan.borrower_name || 'Borrower'}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{loan.purpose} · {loan.duration_months}mo · {loan.apr}% APR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: '#e0ddd8', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(loan.funded_percentage || 0, 100)}%`, background: C.gold, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.gold }}>{loan.funded_percentage || 0}%</span>
            </div>
          </div>

          {status === 'confirmed' ? (
            /* ── SUCCESS STATE ── */
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24, color: C.green }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 6 }}>Transaction Confirmed!</div>

              <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px', margin: '16px 0', textAlign: 'left' }}>
                {[
                  { label: 'Amount',  value: `${finalAmount} ETH` },
                  { label: 'To',      value: short(loan.borrower_address) },
                  { label: 'Block',   value: receipt?.blockNumber?.toString() || '…' },
                  { label: 'TX Hash', value: short(txHash) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                    <span style={{ color: C.muted }}>{label}</span>
                    <span style={{ fontWeight: 600, color: C.text, fontFamily: label === 'TX Hash' || label === 'To' ? 'JetBrains Mono, monospace' : 'inherit' }}>{value}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, background: '#1a1a2e', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                View on Etherscan ↗
              </a>
            </div>

          ) : status === 'rejected' ? (
            /* ── REJECTED ── */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✗</div>
              <div style={{ fontWeight: 700, color: C.red, marginBottom: 16 }}>Transaction Rejected</div>
              <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 8, background: C.gold, border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
            </div>

          ) : status === 'error' ? (
            /* ── ERROR ── */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
              <div style={{ fontWeight: 700, color: C.red, marginBottom: 8 }}>Transaction Failed</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, wordBreak: 'break-word' }}>{errMsg}</div>
              <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 8, background: C.gold, border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
            </div>

          ) : (
            /* ── FUND FORM ── */
            <>
              {/* Amount selection */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10 }}>Amount to Fund</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {QUICK_AMOUNTS.map(q => (
                    <button key={q.value} onClick={() => { setAmount(q.value); setUseCustom(false) }}
                      style={{ padding: '8px 4px', borderRadius: 8, border: `1px solid ${!useCustom && amount === q.value ? C.gold : C.border}`, background: !useCustom && amount === q.value ? '#fef3c7' : '#fff', color: !useCustom && amount === q.value ? '#92400e' : C.muted, fontSize: 12, fontWeight: !useCustom && amount === q.value ? 700 : 400, cursor: 'pointer', transition: 'all 0.14s' }}
                    >{q.label}</button>
                  ))}
                </div>

                {/* Custom amount */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number" step="0.001" min="0.001" placeholder="Custom amount"
                    value={custom} onChange={e => { setCustom(e.target.value); setUseCustom(true) }}
                    onFocus={() => setUseCustom(true)}
                    style={{ flex: 1, padding: '9px 12px', border: `1px solid ${useCustom ? C.gold : C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>ETH</span>
                </div>

                <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                  ≈ ₹{inrValue.toLocaleString('en-IN')} at demo rate
                </div>
              </div>

              {/* Sending to */}
              <div style={{ background: '#f8f7f5', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: C.muted }}>
                Sending to: <span style={{ fontWeight: 700, color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{short(loan.borrower_address)}</span>
                <br />
                From: <span style={{ fontWeight: 700, color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{short(lenderAddr)}</span>
              </div>

              {/* Status bar */}
              {status !== 'idle' && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: s.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.label}
                  {txHash && (
                    <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.blue, marginLeft: 'auto' }}>
                      View on Etherscan ↗
                    </a>
                  )}
                </div>
              )}

              {errMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 12, color: C.red }}>{errMsg}</div>
              )}

              {/* Fund button */}
              <button
                onClick={executeFunding}
                disabled={['connecting', 'pending', 'submitted', 'confirming'].includes(status)}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10,
                  background: ['connecting', 'pending', 'submitted', 'confirming'].includes(status)
                    ? '#e5e7eb'
                    : 'linear-gradient(135deg, #c9952a, #e8c05a)',
                  border: 'none', color: ['connecting', 'pending', 'submitted', 'confirming'].includes(status) ? '#9ca3af' : '#fff',
                  fontWeight: 700, fontSize: 16, cursor: ['connecting', 'pending', 'submitted', 'confirming'].includes(status) ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { if (!['connecting','pending','submitted','confirming'].includes(status)) e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {status === 'idle'
                  ? `Fund ${finalAmount} ETH →`
                  : s.label
                }
              </button>

              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
                ETH is transferred directly wallet-to-wallet.<br />
                VeilFi takes no custody of your funds.
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fundIn { from { opacity:0; transform:scale(0.95) translateY(12px) } to { opacity:1; transform:none } }
      `}</style>
    </div>
  )
}
