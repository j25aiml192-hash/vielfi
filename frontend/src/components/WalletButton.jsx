/* ─────────────────────────────────────────────────────────────
   WalletButton — Connect / Connected state
   Disconnected: "Connect Wallet" — dark filled
   Connected:    "0x398C...a2d2 ●" — outline + green dot
───────────────────────────────────────────────────────────── */
import { useWallet } from '../context/WalletContext.jsx'

export default function WalletButton() {
  const { isConnected, connect, disconnect, shortAddress, connecting: isLoading } = useWallet()

  if (isLoading) {
    return (
      <button
        disabled
        style={{
          height:       36,
          padding:      '0 14px',
          borderRadius: 6,
          background:   '#F3F4F6',
          border:       '1px solid #E5E7EB',
          color:        '#9CA3AF',
          fontSize:     13,
          fontWeight:   500,
          cursor:       'not-allowed',
          fontFamily:   "'Inter', sans-serif",
          display:      'flex',
          alignItems:   'center',
          gap:          6,
        }}
      >
        <span style={{
          width:        14,
          height:       14,
          borderRadius: '50%',
          border:       '2px solid #D4AF37',
          borderTopColor: 'transparent',
          animation:    'spin 0.7s linear infinite',
          display:      'inline-block',
        }} />
        Connecting...
      </button>
    )
  }

  if (isConnected) {
    return (
      <button
        onClick={disconnect}
        title="Click to disconnect"
        style={{
          height:       36,
          padding:      '0 12px',
          borderRadius: 6,
          background:   '#FFFFFF',
          border:       '1px solid #E5E7EB',
          color:        '#111827',
          fontSize:     13,
          fontWeight:   500,
          cursor:       'pointer',
          fontFamily:   "'JetBrains Mono', monospace",
          display:      'flex',
          alignItems:   'center',
          gap:          7,
          transition:   'border-color 150ms cubic-bezier(0.16,1,0.3,1)',
          whiteSpace:   'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
      >
        {/* Green connected dot */}
        <span style={{
          width:        7,
          height:       7,
          borderRadius: '50%',
          background:   '#10B981',
          flexShrink:   0,
        }} />
        {shortAddress || '0x...'}
      </button>
    )
  }

  return (
    <button
      onClick={connect}
      style={{
        height:       36,
        padding:      '0 14px',
        borderRadius: 6,
        background:   '#111827',
        color:        '#FFFFFF',
        fontSize:     13,
        fontWeight:   500,
        cursor:       'pointer',
        fontFamily:   "'Inter', sans-serif",
        border:       'none',
        transition:   'background 150ms cubic-bezier(0.16,1,0.3,1), transform 150ms',
        whiteSpace:   'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#374151' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#111827' }}
      onMouseDown={e  => { e.currentTarget.style.transform  = 'scale(0.98)' }}
      onMouseUp={e    => { e.currentTarget.style.transform  = 'none' }}
    >
      Connect Wallet
    </button>
  )
}
