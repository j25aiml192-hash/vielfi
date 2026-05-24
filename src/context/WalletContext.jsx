import { createContext, useContext, useState, useCallback } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [address, setAddress]     = useState(null)
  const [provider, setProvider]   = useState(null)
  const [signer, setSigner]       = useState(null)
  const [chainId, setChainId]     = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError]         = useState(null)

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask not detected. Please install MetaMask.')
      return
    }
    try {
      setConnecting(true)
      setError(null)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const _provider = new ethers.BrowserProvider(window.ethereum)
      const _signer   = await _provider.getSigner()
      const _address  = await _signer.getAddress()
      const network   = await _provider.getNetwork()
      setProvider(_provider)
      setSigner(_signer)
      setAddress(_address)
      setChainId(Number(network.chainId))

      // Listen for account/chain changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnect()
        else setAddress(accounts[0])
      })
      window.ethereum.on('chainChanged', () => window.location.reload())
    } catch (err) {
      setError(err.message || 'Connection failed')
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
  }, [])

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <WalletContext.Provider value={{
      address,
      shortAddress,
      provider,
      signer,
      chainId,
      connecting,
      error,
      connect,
      disconnect,
      isConnected: !!address,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}
