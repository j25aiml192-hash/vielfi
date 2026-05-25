/* ─────────────────────────────────────────────────────────────
   SBTCard — Soul-Bound Token identity card
   Used in: Verify Step 4, Profile
   Props: name, tier, score, signals, hash, animate
───────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import Avatar from './Avatar.jsx'
import TierBadge from './TierBadge.jsx'

const SIGNAL_LABELS = { upi: 'UPI', gst: 'GST', rental: 'Rental' }

function useCountUp(target, duration = 1200, shouldRun = true) {
  const [current, setCurrent] = useState(0)
  const rafRef  = useRef(null)
  const ran     = useRef(false)

  useEffect(() => {
    if (!shouldRun || ran.current) return
    ran.current = true
    const start = performance.now()
    const step  = (now) => {
      const p = Math.min((now - start) / duration, 1)
      // easeOut cubic
      const ease = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(ease * target))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, shouldRun])

  return current
}

export default function SBTCard({
  name     = 'Rahul Sharma',
  role     = 'Street Food Vendor',
  city     = 'Delhi',
  tier     = 'Gold',
  score    = 762,
  signals  = { upi: true, gst: true, rental: false },
  hash     = '0x7f3a9b2e1c4d8f6a...',
  animate  = true,
}) {
  const displayScore = useCountUp(score, 1200, animate)
  const scorePct = ((displayScore - 300) / (900 - 300)) * 100

  return (
    <div className="card-gold" style={{ maxWidth: 380, width: '100%' }}>

      {/* Top row: tier badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <TierBadge tier={tier} size="lg" />
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Avatar name={name} size="2xl" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>{name}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{role} · {city}</div>
        </div>
      </div>

      {/* Divider */}
      <hr className="divider" style={{ margin: '0 0 20px' }} />

      {/* Credit Score */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Credit Score</div>
        <div style={{
          fontSize:      54,
          fontWeight:    700,
          color:         '#D4AF37',
          lineHeight:    1,
          letterSpacing: '-0.04em',
          animation:     animate ? 'countUp 300ms cubic-bezier(0.16,1,0.3,1) both' : 'none',
        }}>
          {displayScore}
        </div>

        {/* Score bar: 300–900 */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>300</span>
          <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              width:        `${scorePct}%`,
              height:       '100%',
              background:   '#D4AF37',
              borderRadius: 9999,
              transition:   'width 1200ms cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>900</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="divider" style={{ margin: '0 0 16px' }} />

      {/* Verified signals */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Verified Signals</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(signals).map(([key, verified]) => (
            <span
              key={key}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          4,
                padding:      '3px 10px',
                borderRadius: 9999,
                fontSize:     12,
                fontWeight:   500,
                background:   verified ? '#D1FAE5' : '#F3F4F6',
                color:        verified ? '#065F46' : '#9CA3AF',
                border:       `1px solid ${verified ? '#A7F3D0' : '#E5E7EB'}`,
              }}
            >
              {verified
                ? <><Check size={11} strokeWidth={3} /> {SIGNAL_LABELS[key] || key.toUpperCase()}</>
                : <><Minus size={11} /> {SIGNAL_LABELS[key] || key.toUpperCase()}</>
              }
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="divider" style={{ margin: '0 0 14px' }} />

      {/* Proof hash */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize:   11,
            color:      '#9CA3AF',
            overflow:   'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex:       1,
          }}
        >
          {hash}
        </span>
        <a
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize:    12,
            fontWeight:  500,
            color:       '#D4AF37',
            whiteSpace:  'nowrap',
            display:     'flex',
            alignItems:  'center',
            gap:         3,
          }}
        >
          On-Chain ↗
        </a>
      </div>
    </div>
  )
}
