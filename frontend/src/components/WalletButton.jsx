import { useWallet } from '../context/WalletContext.jsx'

export default function WalletButton({ size = 'md' }) {
  const { address, shortAddress, connecting, error, connect, disconnect, isConnected } = useWallet()

  const sizeClasses = size === 'sm'
    ? 'px-4 py-2 text-xs'
    : 'px-5 py-2.5 text-sm'

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 ${sizeClasses} rounded-xl bg-surface-soft border border-hairline font-mono`}>
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span className="text-primary">{shortAddress}</span>
        </div>
        <button
          onClick={disconnect}
          className={`${sizeClasses} rounded-xl border border-hairline text-secondary hover:text-red-500 hover:border-red-400/30 transition-all duration-200 font-medium`}
          aria-label="Disconnect wallet"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={connect}
        disabled={connecting}
        className={`btn-primary ${sizeClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
        aria-label="Connect MetaMask wallet"
      >
        {connecting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M3 12h18M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}