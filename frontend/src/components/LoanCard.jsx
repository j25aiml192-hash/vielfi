/* ─────────────────────────────────────────────────────────────
   LoanCard — Linear-inspired marketplace card
   Layout spec:
   - Avatar + name/role/city + tier badge
   - Purpose chip + duration
   - Amount/APR (right-aligned)
   - Story 2-line clamp
   - Progress bar 4px gold
   - Lenders / days left / EMI
   - Dark fund button → inline confirm flow
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Users, Clock, Calendar } from 'lucide-react'
import Avatar from './Avatar.jsx'
import TierBadge from './TierBadge.jsx'
import ProgressBar from './ProgressBar.jsx'
import StarRating from './StarRating.jsx'

const PURPOSE_COLORS = {
  'Business':       { bg: '#EEF2FF', color: '#4338CA' },
  'Education':      { bg: '#F0FDF4', color: '#166534' },
  'Medical':        { bg: '#FFF1F2', color: '#9F1239' },
  'Equipment':      { bg: '#FFFBEB', color: '#92400E' },
  'Agriculture':    { bg: '#F0FDF4', color: '#14532D' },
  'Working Capital':{ bg: '#EEF2FF', color: '#3730A3' },
  'Home':           { bg: '#F0F9FF', color: '#0C4A6E' },
}

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function LoanCard({ loan = {}, onFund }) {
  const [fundState, setFundState] = useState('idle') // 'idle' | 'confirm' | 'funding' | 'done'
  const navigate = useNavigate()

  const {
    id           = '1',
    borrowerName = 'Anonymous',
    role         = 'Small Business Owner',
    city         = 'India',
    tier         = 'Silver',
    purpose      = 'Working Capital',
    story        = 'Looking for funds to grow my small business.',
    amount       = 100000,
    funded       = 45000,
    duration     = 12,
    emi          = 9500,
    interestRate = 12,
    lenders      = 3,
    daysLeft     = 14,
  } = loan

  const fundedPct = Math.round((funded / amount) * 100)
  const purposeStyle = PURPOSE_COLORS[purpose] || { bg: '#F3F4F6', color: '#374151' }

  const handleFundClick = (e) => {
    e.stopPropagation()
    if (fundState === 'idle')    { setFundState('confirm'); return }
    if (fundState === 'confirm') {
      setFundState('funding')
      setTimeout(() => {
        onFund && onFund(id, 5000)
        setFundState('done')
        setTimeout(() => setFundState('idle'), 2500)
      }, 800)
    }
  }

  return (
    <div
      onClick={() => navigate(`/loan/${id}`)}
      style={{
        background:   '#FFFFFF',
        border:       '1px solid #E5E7EB',
        borderRadius: 10,
        padding:      20,
        cursor:       'pointer',
        display:      'flex',
        flexDirection:'column',
        gap:          0,
        transition:   'border-color 150ms cubic-bezier(0.16,1,0.3,1), box-shadow 150ms, transform 150ms',
        boxShadow:    '0 1px 2px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#D4AF37'
        e.currentTarget.style.boxShadow   = '0 4px 12px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform   = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E5E7EB'
        e.currentTarget.style.boxShadow   = '0 1px 2px rgba(0,0,0,0.05)'
        e.currentTarget.style.transform   = 'none'
      }}
    >
      {/* ── Row 1: Avatar + info + amount ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <Avatar name={borrowerName} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: '#111827' }}>
              {borrowerName}
            </span>
            <TierBadge tier={tier} size="sm" />
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#9CA3AF' }}>
            {role} · {city}
          </div>
          {rating != null && (
            <div style={{ marginTop: 3 }}>
              <StarRating rating={rating} count={null} size="sm" />
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: '#111827', letterSpacing: '-0.02em' }}>
            {formatINR(amount)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
            {interestRate}% APR
          </div>
        </div>
      </div>

      {/* ── Row 2: Purpose chip ── */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          display:      'inline-flex',
          alignItems:   'center',
          padding:      '2px 8px',
          borderRadius: 9999,
          fontSize:     11,
          fontWeight:   500,
          fontFamily:   "'Inter',sans-serif",
          background:   purposeStyle.bg,
          color:        purposeStyle.color,
        }}>
          {purpose}
        </span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>
          {duration}M
        </span>
      </div>

      {/* ── Story ── */}
      <p style={{
        fontFamily:          "'Inter',sans-serif",
        fontSize:            13,
        color:               '#6B7280',
        lineHeight:          1.55,
        marginTop:           0,
        marginBottom:        14,
        display:             '-webkit-box',
        WebkitLineClamp:     2,
        WebkitBoxOrient:     'vertical',
        overflow:            'hidden',
        flex:                1,
      }}>
        {story}
      </p>

      {/* ── Progress ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B7280' }}>
            <span style={{ color: '#10B981', fontWeight: 600 }}>{formatINR(funded)}</span> raised
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#9CA3AF' }}>
            {fundedPct}%
          </span>
        </div>
        <ProgressBar value={fundedPct} color="#D4AF37" height={4} animated={false} />
      </div>

      {/* ── Footer: lenders / days / EMI + fund button ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Users size={12} color="#9CA3AF" />
            <strong style={{ color: '#374151' }}>{lenders}</strong> lenders
          </span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={12} color="#9CA3AF" />
            <strong style={{ color: '#374151' }}>{daysLeft}d</strong> left
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11} color="#9CA3AF" />
            {formatINR(emi)}/mo
          </span>
        </div>

        {/* Fund button — inline state machine */}
        <button
          onClick={handleFundClick}
          style={{
            height:       32,
            padding:      '0 12px',
            borderRadius: 6,
            border:       'none',
            cursor:       fundState === 'done' ? 'default' : 'pointer',
            fontFamily:   "'Inter',sans-serif",
            fontSize:     12,
            fontWeight:   600,
            flexShrink:   0,
            transition:   'background 150ms, transform 150ms',
            background:   fundState === 'done' ? '#10B981' :
                          fundState === 'confirm' ? '#D4AF37' :
                          '#111827',
            color:        fundState === 'confirm' ? '#111827' : '#FFFFFF',
            minWidth:     80,
            textAlign:    'center',
          }}
          onMouseDown={e => { if (fundState !== 'done') e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e   => { e.currentTarget.style.transform = 'none' }}
        >
          {fundState === 'idle'    && 'Fund Now'}
          {fundState === 'confirm' && <span style={{ display:'flex', alignItems:'center', gap:4 }}>Confirm <Check size={12} /></span>}
          {fundState === 'funding' && '...'}
          {fundState === 'done'    && <span style={{ display:'flex', alignItems:'center', gap:4 }}>Funded <Check size={12} /></span>}
        </button>
      </div>
    </div>
  )
}
