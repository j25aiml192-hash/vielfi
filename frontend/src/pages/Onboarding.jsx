/* ─────────────────────────────────────────────────────────────
   Onboarding — Stripe-inspired role selection
   Light, clean, centered 480px max-width
   Borrower card (gold border) / Lender card (indigo border)
   Emojis replaced with Lucide icons
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Building2, DollarSign, RefreshCw } from 'lucide-react'
import { useWallet } from '../context/WalletContext.jsx'

const ROLES = [
  {
    id:       'borrower',
    icon:     Building2,
    iconColor:'#92400E',
    title:    'I want to Borrow',
    desc:     'Get credit based on your real financial activity — UPI history, GST records, rental payments. No CIBIL needed.',
    benefits: ['No CIBIL or collateral', 'UPI & GST history accepted', 'Borrow ₹5K–₹50L at 8–18%'],
    cta:      'Start as Borrower',
    redirect: '/verify',
    accent:   '#D4AF37',
    bgAccent: '#FEF3C7',
    badge:    'Borrower',
    badgeColor: '#92400E',
  },
  {
    id:       'lender',
    icon:     DollarSign,
    iconColor:'#4338CA',
    title:    'I want to Lend',
    desc:     'Browse ZK-verified borrowers and fund loans directly from your wallet. Smart contracts handle repayments.',
    benefits: ['All borrowers ZK verified', 'Earn 12–18% APR', 'On-chain, non-custodial'],
    cta:      'Start as Lender',
    redirect: '/feed',
    accent:   '#6366F1',
    bgAccent: '#EEF2FF',
    badge:    'Lender',
    badgeColor: '#4338CA',
  },
]

export default function Onboarding() {
  const navigate  = useNavigate()
  const { setRole, isConnected, connect } = useWallet()
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSelect = async (roleId, redirect) => {
    setLoading(true)
    if (!isConnected) await connect()
    setRole(roleId)
    navigate(redirect)
    setLoading(false)
  }

  const handleBoth = async () => {
    setLoading(true)
    if (!isConnected) await connect()
    setRole('both')
    navigate('/feed')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#FFFFFF',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '64px 24px',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeIn 300ms cubic-bezier(0.16,1,0.3,1) both' }}>
        {/* Logo mark */}
        <div style={{
          width:          44,
          height:         44,
          borderRadius:   10,
          background:     '#111827',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          margin:         '0 auto 20px',
        }}>
          <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 20, fontFamily: "'Inter',sans-serif" }}>V</span>
        </div>

        <h1 style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      32,
          fontWeight:    700,
          color:         '#111827',
          letterSpacing: '-0.03em',
          marginTop:     0,
          marginBottom:  10,
        }}>
          How will you use VeilFi?
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#6B7280', margin: 0 }}>
          Choose your role to get started. You can change it later.
        </p>
      </div>

      {/* Role cards */}
      <div style={{
        display:   'flex',
        gap:       20,
        maxWidth:  840,
        width:     '100%',
        flexWrap:  'wrap',
        animation: 'slideUp 350ms 50ms cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {ROLES.map((role) => {
          const isSelected = selected === role.id
          const RoleIcon = role.icon
          return (
            <div
              key={role.id}
              onClick={() => setSelected(role.id)}
              style={{
                flex:          '1 1 340px',
                background:    isSelected ? `${role.bgAccent}40` : '#FFFFFF',
                border:        `2px solid ${isSelected ? role.accent : '#E5E7EB'}`,
                borderRadius:  12,
                padding:       28,
                cursor:        'pointer',
                transition:    'border-color 150ms cubic-bezier(0.16,1,0.3,1), background 150ms',
                display:       'flex',
                flexDirection: 'column',
                gap:           0,
              }}
            >
              {/* Top row: role icon + selection dot */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width:          52,
                  height:         52,
                  borderRadius:   12,
                  background:     role.bgAccent,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                }}>
                  <RoleIcon size={24} color={role.iconColor} />
                </div>
                {/* Selection indicator */}
                <div style={{
                  width:          22,
                  height:         22,
                  borderRadius:   '50%',
                  border:         `2px solid ${isSelected ? role.accent : '#E5E7EB'}`,
                  background:     isSelected ? role.accent : '#FFFFFF',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          '#FFFFFF',
                  transition:     'all 150ms cubic-bezier(0.16,1,0.3,1)',
                  flexShrink:     0,
                }}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </div>

              {/* Role badge */}
              <div style={{
                display:       'inline-block',
                padding:       '2px 8px',
                borderRadius:  9999,
                background:    role.bgAccent,
                color:         role.badgeColor,
                fontSize:      11,
                fontWeight:    600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily:    "'Inter',sans-serif",
                marginBottom:  10,
                width:         'fit-content',
              }}>
                {role.badge}
              </div>

              <h2 style={{
                fontFamily:    "'Inter',sans-serif",
                fontSize:      18,
                fontWeight:    600,
                color:         '#111827',
                letterSpacing: '-0.02em',
                marginTop:     0,
                marginBottom:  10,
              }}>
                {role.title}
              </h2>
              <p style={{
                fontFamily:   "'Inter',sans-serif",
                fontSize:     14,
                color:        '#6B7280',
                lineHeight:   1.55,
                marginTop:    0,
                marginBottom: 18,
                flex:         1,
              }}>
                {role.desc}
              </p>

              {/* Benefits */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {role.benefits.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', fontFamily: "'Inter',sans-serif" }}>
                    <span style={{
                      width:          18,
                      height:         18,
                      borderRadius:   '50%',
                      background:     role.bgAccent,
                      color:          role.badgeColor,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                    }}>
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <button
                id={`onboarding-${role.id}-btn`}
                onClick={(e) => { e.stopPropagation(); handleSelect(role.id, role.redirect) }}
                disabled={loading}
                style={{
                  height:       44,
                  padding:      '0 20px',
                  borderRadius: 6,
                  background:   role.accent,
                  color:        role.id === 'lender' ? '#FFFFFF' : '#111827',
                  fontFamily:   "'Inter',sans-serif",
                  fontSize:     14,
                  fontWeight:   600,
                  border:       'none',
                  cursor:       loading ? 'not-allowed' : 'pointer',
                  width:        '100%',
                  opacity:      loading ? 0.7 : 1,
                  transition:   'opacity 150ms, transform 150ms',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  gap:          6,
                }}
                onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.98)' }}
                onMouseUp={e    => { e.currentTarget.style.transform  = 'none' }}
              >
                {loading ? 'Connecting...' : role.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Both option */}
      <div style={{ textAlign: 'center', marginTop: 24, animation: 'fadeIn 400ms 150ms cubic-bezier(0.16,1,0.3,1) both' }}>
        <button
          id="onboarding-both-btn"
          onClick={handleBoth}
          disabled={loading}
          style={{
            background:          'none',
            border:              'none',
            fontFamily:          "'Inter',sans-serif",
            fontSize:            14,
            color:               '#6B7280',
            cursor:              'pointer',
            display:             'inline-flex',
            alignItems:          'center',
            gap:                 6,
            textDecoration:      'underline',
            textUnderlineOffset: 3,
            transition:          'color 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#111827' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6B7280' }}
        >
          <RefreshCw size={14} />
          I want to do both
        </button>
      </div>

      {/* Footer note */}
      <p style={{
        fontFamily: "'Inter',sans-serif",
        fontSize:   12,
        color:      '#9CA3AF',
        marginTop:  16,
        textAlign:  'center',
      }}>
        Your role is stored locally. No account creation needed.
      </p>

    </div>
  )
}
