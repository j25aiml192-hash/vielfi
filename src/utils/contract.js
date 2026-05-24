import { ethers } from 'ethers'

// ─── ABI Fragments ───────────────────────────────────────────

const CREDIT_VERIFIER_ABI = [
  'function verifyCredit(address borrower, uint256 score, bytes calldata proof) external returns (bool)',
  'function getCreditScore(address borrower) external view returns (uint256)',
  'function isVerified(address borrower) external view returns (bool)',
  'event CreditVerified(address indexed borrower, uint256 score, uint256 timestamp)',
]

const SBT_ABI = [
  'function mintSBT(address to, uint256 tier, uint256 score, string calldata uri) external',
  'function getSBT(address owner) external view returns (uint256 tokenId, uint256 tier, uint256 score, uint256 mintedAt)',
  'function hasSBT(address owner) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]

const LOAN_MARKETPLACE_ABI = [
  'function createLoan(uint256 amount, uint256 durationMonths, string calldata purpose) external returns (uint256)',
  'function fundLoan(uint256 loanId) external payable',
  'function repayEMI(uint256 loanId) external payable',
  'function getLoan(uint256 loanId) external view returns (tuple(uint256 id, address borrower, uint256 amount, uint256 funded, uint256 duration, string purpose, uint8 status))',
  'function getTotalLoans() external view returns (uint256)',
  'event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount)',
  'event LoanFunded(uint256 indexed loanId, address indexed lender, uint256 amount)',
  'event EMIRepaid(uint256 indexed loanId, uint256 amount)',
]

// ─── Contract Addresses (update after deployment) ────────────
export const ADDRESSES = {
  creditVerifier:   import.meta.env.VITE_CREDIT_VERIFIER  || '0x0000000000000000000000000000000000000001',
  sbt:              import.meta.env.VITE_SBT_CONTRACT     || '0x0000000000000000000000000000000000000002',
  loanMarketplace:  import.meta.env.VITE_LOAN_MARKETPLACE || '0x0000000000000000000000000000000000000003',
}

// ─── Provider Helpers ────────────────────────────────────────

/** Get a read-only provider (no wallet needed) */
export function getReadProvider() {
  const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://rpc.ankr.com/eth_sepolia'
  return new ethers.JsonRpcProvider(rpcUrl)
}

/** Get a browser provider from MetaMask */
export async function getBrowserProvider() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not found')
  }
  return new ethers.BrowserProvider(window.ethereum)
}

// ─── Contract Factory ────────────────────────────────────────

/** Create a read-only contract instance */
export function getReadContract(address, abi) {
  return new ethers.Contract(address, abi, getReadProvider())
}

/** Create a write-enabled contract instance (requires signer) */
export async function getWriteContract(address, abi) {
  const provider = await getBrowserProvider()
  const signer   = await provider.getSigner()
  return new ethers.Contract(address, signer)
}

// ─── Credit Verifier Contract ────────────────────────────────

export function getCreditVerifierRead() {
  return getReadContract(ADDRESSES.creditVerifier, CREDIT_VERIFIER_ABI)
}

export async function getCreditVerifierWrite() {
  const provider = await getBrowserProvider()
  const signer   = await provider.getSigner()
  return new ethers.Contract(ADDRESSES.creditVerifier, CREDIT_VERIFIER_ABI, signer)
}

export async function getCreditScore(borrowerAddress) {
  const contract = getCreditVerifierRead()
  const score    = await contract.getCreditScore(borrowerAddress)
  return Number(score)
}

export async function isVerified(borrowerAddress) {
  const contract = getCreditVerifierRead()
  return contract.isVerified(borrowerAddress)
}

// ─── SBT Contract ────────────────────────────────────────────

export function getSBTRead() {
  return getReadContract(ADDRESSES.sbt, SBT_ABI)
}

export async function hasSBT(ownerAddress) {
  const contract = getSBTRead()
  return contract.hasSBT(ownerAddress)
}

export async function getSBT(ownerAddress) {
  const contract = getSBTRead()
  return contract.getSBT(ownerAddress)
}

// ─── Loan Marketplace Contract ───────────────────────────────

export function getLoanMarketplaceRead() {
  return getReadContract(ADDRESSES.loanMarketplace, LOAN_MARKETPLACE_ABI)
}

export async function getLoanMarketplaceWrite() {
  const provider = await getBrowserProvider()
  const signer   = await provider.getSigner()
  return new ethers.Contract(ADDRESSES.loanMarketplace, LOAN_MARKETPLACE_ABI, signer)
}

export async function getLoan(loanId) {
  const contract = getLoanMarketplaceRead()
  return contract.getLoan(loanId)
}

export async function fundLoanOnChain(loanId, amountEth) {
  const contract = await getLoanMarketplaceWrite()
  const value    = ethers.parseEther(String(amountEth))
  const tx       = await contract.fundLoan(loanId, { value })
  return tx.wait()
}

export async function repayEMIOnChain(loanId, amountEth) {
  const contract = await getLoanMarketplaceWrite()
  const value    = ethers.parseEther(String(amountEth))
  const tx       = await contract.repayEMI(loanId, { value })
  return tx.wait()
}

// ─── Utility ─────────────────────────────────────────────────

/** Format ETH value */
export const formatEth = (wei) => ethers.formatEther(wei)

/** Parse ETH string */
export const parseEth = (eth) => ethers.parseEther(String(eth))

/** Short address */
export const shortAddr = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
