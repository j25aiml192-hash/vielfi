import { ethers } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7'

export const ADDRESSES = {
  veilSBT:
    import.meta.env.VITE_VEIL_SBT ||
    import.meta.env.VITE_SBT_CONTRACT ||
    '0x3d4613bfFc15F8d46Df148F62C31B6d32575B002',
  creditOracle:
    import.meta.env.VITE_CREDIT_ORACLE ||
    import.meta.env.VITE_CREDIT_VERIFIER ||
    '0xb10E4A0573145551639C69C3e8bB9B7dC7c1D4F2',
  loanMarketplace:
    import.meta.env.VITE_LOAN_MARKETPLACE ||
    '0x43CdD005E02aA2EBF78963B2E458182Dc5E5126f',
  reputationEngine:
    import.meta.env.VITE_REPUTATION_ENGINE ||
    '0x7422233D200144452537D9Dc1273E968db9cd05d2A',
}

ADDRESSES.sbt = ADDRESSES.veilSBT
ADDRESSES.creditVerifier = ADDRESSES.creditOracle

export const CREDIT_ORACLE_ABI = [
  'function veilSBT() external view returns (address)',
  'function owner() external view returns (address)',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
  'function verifyCredit(address borrower, uint256 upiScore, uint256 gstScore, uint256 rentalScore) external returns (uint256 tokenId, bytes32 proofHash)',
  'function tierForScore(uint256 score) external pure returns (string)',
  'event CreditVerified(address indexed borrower, uint256 upiScore, uint256 gstScore, uint256 rentalScore, uint256 weightedScore, string tier, bytes32 proofHash, uint256 tokenId)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'error InvalidScore()',
  'error ScoreBelowMinimumTier()',
  'error OwnableInvalidOwner(address owner)',
  'error OwnableUnauthorizedAccount(address account)',
]

export const VEIL_SBT_ABI = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function owner() external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function getApproved(uint256 tokenId) external view returns (address)',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function approve(address to, uint256 tokenId) external',
  'function setApprovalForAll(address operator, bool approved) external',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external',
  'function supportsInterface(bytes4 interfaceId) external view returns (bool)',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
  'function creditOracle() external view returns (address)',
  'function reputationEngine() external view returns (address)',
  'function setCreditOracle(address newCreditOracle) external',
  'function setReputationEngine(address newReputationEngine) external',
  'function mint(address to, string tier, uint256 score, bytes32 proofHash) external returns (uint256 tokenId)',
  'function updateReputation(address account, string tier, uint256 score) external',
  'function tokenOfOwner(address account) external view returns (uint256)',
  'function creditData(uint256 tokenId) external view returns (tuple(string tier, uint256 score, bytes32 proofHash, uint256 timestamp))',
  'function creditDataOf(address account) external view returns (tuple(string tier, uint256 score, bytes32 proofHash, uint256 timestamp))',
  'function locked(uint256 tokenId) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'function tierColor(string tier) external pure returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'event Locked(uint256 tokenId)',
  'event CreditOracleUpdated(address indexed creditOracle)',
  'event ReputationEngineUpdated(address indexed reputationEngine)',
  'event ReputationUpdated(address indexed account, uint256 indexed tokenId, string tier, uint256 score)',
  'error SoulBoundToken()',
  'error AlreadyMinted()',
  'error NotCreditOracle()',
  'error NotReputationEngine()',
  'error TokenNotFound()',
  'error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner)',
  'error ERC721InsufficientApproval(address operator, uint256 tokenId)',
  'error ERC721InvalidApprover(address approver)',
  'error ERC721InvalidOperator(address operator)',
  'error ERC721InvalidOwner(address owner)',
  'error ERC721InvalidReceiver(address receiver)',
  'error ERC721InvalidSender(address sender)',
  'error ERC721NonexistentToken(uint256 tokenId)',
  'error OwnableInvalidOwner(address owner)',
  'error OwnableUnauthorizedAccount(address account)',
]

export const LOAN_MARKETPLACE_ABI = [
  'function veilSBT() external view returns (address)',
  'function reputationEngine() external view returns (address)',
  'function nextLoanId() external view returns (uint256)',
  'function BPS_DENOMINATOR() external view returns (uint256)',
  'function MONTH() external view returns (uint256)',
  'function DEFAULT_GRACE_PERIOD() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
  'function loans(uint256) external view returns (uint256 id, address borrower, uint256 amount, string purpose, uint256 durationMonths, uint256 aprBps, string story, uint256 totalFunded, uint256 totalRepaid, uint256 totalRepayable, uint256 emiAmount, uint256 disbursedAt, uint256 emiPaidCount, uint8 status)',
  'function fundedAmount(uint256, address) external view returns (uint256)',
  'function emiPaid(uint256, uint256) external view returns (bool)',
  'function listLoan(uint256 amount, string purpose, uint256 durationMonths, uint256 aprBps, string story) external returns (uint256 loanId)',
  'function fund(uint256 loanId) external payable',
  'function repay(uint256 loanId) external payable',
  'function markDefault(uint256 loanId) external',
  'function lenders(uint256 loanId) external view returns (address[])',
  'function getEMISchedule(uint256 loanId) external view returns (uint256[] dueDates, uint256[] amounts, bool[] paid)',
  'function emiDueDate(uint256 loanId, uint256 emiIndex) external view returns (uint256)',
  'function nextEMIAmount(uint256 loanId) external view returns (uint256)',
  'event LoanListed(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose, uint256 durationMonths, uint256 aprBps, string story)',
  'event Funded(uint256 indexed loanId, address indexed lender, uint256 amount, uint256 totalFunded)',
  'event Disbursed(uint256 indexed loanId, address indexed borrower, uint256 amount)',
  'event EMIPaid(uint256 indexed loanId, address indexed borrower, uint256 emiIndex, uint256 amount, bool late)',
  'event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount)',
  'event LoanDefaulted(uint256 indexed loanId, address indexed borrower)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'error NotSBTHolder()',
  'error InvalidLoan()',
  'error InvalidFunding()',
  'error LoanUnavailable()',
  'error NotBorrower()',
  'error NotDisbursed()',
  'error NothingDue()',
  'error DefaultUnavailable()',
  'error TransferFailed()',
  'error ReentrancyGuardReentrantCall()',
  'error OwnableInvalidOwner(address owner)',
  'error OwnableUnauthorizedAccount(address account)',
]

export const REPUTATION_ENGINE_ABI = [
  'function veilSBT() external view returns (address)',
  'function loanMarketplace() external view returns (address)',
  'function ON_TIME_EMI_POINTS() external view returns (int256)',
  'function EARLY_REPAY_POINTS() external view returns (int256)',
  'function LOAN_COMPLETE_POINTS() external view returns (int256)',
  'function LATE_PAYMENT_POINTS() external view returns (int256)',
  'function DEFAULT_POINTS() external view returns (int256)',
  'function owner() external view returns (address)',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
  'function setLoanMarketplace(address newLoanMarketplace) external',
  'function recordOnTimeEMI(address borrower) external',
  'function recordEarlyRepay(address borrower) external',
  'function recordLoanComplete(address borrower) external',
  'function recordLatePayment(address borrower) external',
  'function recordDefault(address borrower) external',
  'function tierForScore(uint256 score) external pure returns (string)',
  'event LoanMarketplaceUpdated(address indexed loanMarketplace)',
  'event ReputationChange(address indexed borrower, int256 delta, uint256 oldScore, uint256 newScore, string newTier, string reason)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'error NotLoanMarketplace()',
  'error OwnableInvalidOwner(address owner)',
  'error OwnableUnauthorizedAccount(address account)',
]

export const CREDIT_VERIFIER_ABI = CREDIT_ORACLE_ABI
export const SBT_ABI = VEIL_SBT_ABI

export function getReadProvider() {
  const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://rpc.ankr.com/eth_sepolia'
  return new ethers.JsonRpcProvider(rpcUrl, SEPOLIA_CHAIN_ID)
}

export async function getBrowserProvider() {
  if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not found')
  }

  return new ethers.BrowserProvider(window.ethereum)
}

export async function ensureSepoliaNetwork() {
  if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not found')
  }

  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
  if (currentChainId === SEPOLIA_CHAIN_ID_HEX) return

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
  })
}

export function getReadContract(address, abi) {
  return new ethers.Contract(address, abi, getReadProvider())
}

export async function getWriteContract(address, abi) {
  await ensureSepoliaNetwork()
  const provider = await getBrowserProvider()
  const signer = await provider.getSigner()
  return new ethers.Contract(address, abi, signer)
}

export function getCreditOracleRead() {
  return getReadContract(ADDRESSES.creditOracle, CREDIT_ORACLE_ABI)
}

export function getCreditVerifierRead() {
  return getCreditOracleRead()
}

export async function getCreditOracleWrite() {
  return getWriteContract(ADDRESSES.creditOracle, CREDIT_ORACLE_ABI)
}

export async function getCreditVerifierWrite() {
  return getCreditOracleWrite()
}

export async function verifyCreditOnChain(borrowerAddress, upiScore, gstScore, rentalScore) {
  const contract = await getCreditOracleWrite()
  const tx = await contract.verifyCredit(borrowerAddress, upiScore, gstScore, rentalScore)
  return tx.wait()
}

export async function tierForCreditScore(score) {
  const contract = getCreditOracleRead()
  return contract.tierForScore(score)
}

export function getVeilSBTRead() {
  return getReadContract(ADDRESSES.veilSBT, VEIL_SBT_ABI)
}

export function getSBTRead() {
  return getVeilSBTRead()
}

export async function getVeilSBTWrite() {
  return getWriteContract(ADDRESSES.veilSBT, VEIL_SBT_ABI)
}

export async function getSBTWrite() {
  return getVeilSBTWrite()
}

export async function hasSBT(ownerAddress) {
  const contract = getVeilSBTRead()
  return (await contract.balanceOf(ownerAddress)) > 0n
}

export async function getSBT(ownerAddress) {
  const contract = getVeilSBTRead()
  const tokenId = await contract.tokenOfOwner(ownerAddress)
  if (tokenId === 0n) return null

  const data = await contract.creditData(tokenId)
  return {
    tokenId,
    tier: data.tier,
    score: data.score,
    proofHash: data.proofHash,
    timestamp: data.timestamp,
  }
}

export async function getCreditData(ownerAddress) {
  const contract = getVeilSBTRead()
  return contract.creditDataOf(ownerAddress)
}

export async function getCreditScore(borrowerAddress) {
  const data = await getCreditData(borrowerAddress)
  return Number(data.score)
}

export async function isVerified(borrowerAddress) {
  return hasSBT(borrowerAddress)
}

export function getLoanMarketplaceRead() {
  return getReadContract(ADDRESSES.loanMarketplace, LOAN_MARKETPLACE_ABI)
}

export async function getLoanMarketplaceWrite() {
  return getWriteContract(ADDRESSES.loanMarketplace, LOAN_MARKETPLACE_ABI)
}

export async function listLoanOnChain(amountEth, purpose, durationMonths, aprBps, story) {
  const contract = await getLoanMarketplaceWrite()
  const amount = parseEth(amountEth)
  const tx = await contract.listLoan(amount, purpose, durationMonths, aprBps, story)
  return tx.wait()
}

export async function getLoan(loanId) {
  const contract = getLoanMarketplaceRead()
  return contract.loans(loanId)
}

export async function getLoanLenders(loanId) {
  const contract = getLoanMarketplaceRead()
  return contract.lenders(loanId)
}

export async function getEMISchedule(loanId) {
  const contract = getLoanMarketplaceRead()
  return contract.getEMISchedule(loanId)
}

export async function getNextEMIAmount(loanId) {
  const contract = getLoanMarketplaceRead()
  return contract.nextEMIAmount(loanId)
}

export async function fundLoanOnChain(loanId, amountEth) {
  const contract = await getLoanMarketplaceWrite()
  const value = parseEth(amountEth)
  const tx = await contract.fund(loanId, { value })
  return tx.wait()
}

export async function repayEMIOnChain(loanId, amountEth) {
  const contract = await getLoanMarketplaceWrite()
  const value = parseEth(amountEth)
  const tx = await contract.repay(loanId, { value })
  return tx.wait()
}

export async function markDefaultOnChain(loanId) {
  const contract = await getLoanMarketplaceWrite()
  const tx = await contract.markDefault(loanId)
  return tx.wait()
}

export function getReputationEngineRead() {
  return getReadContract(ADDRESSES.reputationEngine, REPUTATION_ENGINE_ABI)
}

export async function getReputationEngineWrite() {
  return getWriteContract(ADDRESSES.reputationEngine, REPUTATION_ENGINE_ABI)
}

export async function reputationTierForScore(score) {
  const contract = getReputationEngineRead()
  return contract.tierForScore(score)
}

export const formatEth = (wei) => ethers.formatEther(wei ?? 0n)

export const parseEth = (eth) => ethers.parseEther(String(eth || '0'))

export const shortAddr = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

