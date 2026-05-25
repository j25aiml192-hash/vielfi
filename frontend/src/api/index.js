import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
  return config
})

// Response interceptor – unwrap .data and normalize errors
api.interceptors.response.use(
  (res) => {
    console.log(`[API] Response:`, res.data)
    return res.data
  },
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Network error'
    console.error(`[API] Error:`, msg)
    return Promise.reject(new Error(msg))
  }
)

// ─── Credit Verification ──────────────────────────────────────

/**
 * Verify a borrower profile and get ZK credit scores.
 * POST /api/credit/verify  { profileName }
 * Returns: { upiScore, gstScore, rentalScore, weightedScore,
 *            tier, cibilScore, proofHash, narrative }
 */
export const verifyProfile = (profileName) =>
  api.post('/api/credit/verify', { profileName })

// ─── Marketplace ─────────────────────────────────────────────

/**
 * Fetch all live loan listings.
 * GET /api/marketplace/feed
 * Returns: [{ id, title, borrower, amount, interestRate,
 *             durationMonths, fundedAmount, status, tier }]
 */
export const getMarketplaceFeed = () =>
  api.get('/api/marketplace/feed')

// ─── Loans ───────────────────────────────────────────────────

/**
 * Fund a loan listing.
 * POST /api/loans/fund  { loanId, amount }
 */
export const fundLoan = (loanId, amount) =>
  api.post('/api/loans/fund', { loanId, amount })

/**
 * Repay an EMI for a loan.
 * POST /api/loans/repay  { loanId }
 */
export const repayEMI = (loanId) =>
  api.post('/api/loans/repay', { loanId })

// ─── Circles ─────────────────────────────────────────────────

/**
 * Get a specific circle by ID.
 * GET /api/circles/{circle_id}
 */
export const getCircleById = (circleId) =>
  api.get(`/api/circles/${circleId}`)

/**
 * Create a new credit circle.
 * POST /api/circles/create  { name, description, targetAmount }
 */
export const createCircle = (data) =>
  api.post('/api/circles/create', {
    name:         data.name,
    description:  data.description,
    targetAmount: Number(data.targetPool) || 0,
  })

/**
 * Contribute to (join) a circle.
 * POST /api/circles/contribute  { circleId, amount }
 */
export const joinCircle = (circleId, _address) =>
  api.post('/api/circles/contribute', { circleId, amount: 0 })

// Keep for backward compat (Feed.jsx, Circles.jsx imports)
export const getCircles = () => Promise.resolve([])
export const getNarrative = (profileName) =>
  api.post(`/api/narrative/${profileName}`)

export default api
