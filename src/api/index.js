import axios from 'axios'

const BASE = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor – attach auth if needed
api.interceptors.request.use((config) => config)

// Response interceptor – normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

// ─── Auth / Identity ─────────────────────────────────────────

/** Verify a borrower profile and trigger ZK proof generation */
export const verifyProfile = (name) =>
  api.post('/verify', { name })

/** Get ZK proof status for a profile */
export const getProofStatus = (name) =>
  api.get(`/proof/${name}`)

/** Get borrower narrative */
export const getNarrative = (name) =>
  api.get(`/narrative/${name}`)

// ─── Marketplace ─────────────────────────────────────────────

/** Fetch all live loan listings */
export const getMarketplaceFeed = (params = {}) =>
  api.get('/marketplace', { params })

/** Fetch a single loan by ID */
export const getLoanById = (loanId) =>
  api.get(`/loan/${loanId}`)

/** Get lenders list for a loan */
export const getLoanLenders = (loanId) =>
  api.get(`/loan/${loanId}/lenders`)

// ─── Lending / Repayment ─────────────────────────────────────

/** Fund a loan listing */
export const fundLoan = (loanId, amount) =>
  api.post('/fund', { loan_id: loanId, amount })

/** Repay an EMI for a loan */
export const repayEMI = (loanId) =>
  api.post('/repay', { loan_id: loanId })

// ─── User / Profile ──────────────────────────────────────────

/** Get borrower profile by wallet or name */
export const getBorrowerProfile = (identifier) =>
  api.get(`/profile/${identifier}`)

/** Get credit score history */
export const getScoreHistory = (name) =>
  api.get(`/score-history/${name}`)

/** Get loan history for a user */
export const getLoanHistory = (name) =>
  api.get(`/loan-history/${name}`)

// ─── Dashboard ───────────────────────────────────────────────

/** Get borrower dashboard data */
export const getBorrowerDashboard = (address) =>
  api.get(`/dashboard/borrower/${address}`)

/** Get lender dashboard data */
export const getLenderDashboard = (address) =>
  api.get(`/dashboard/lender/${address}`)

// ─── Circles ─────────────────────────────────────────────────

/** Get all active circles */
export const getCircles = () =>
  api.get('/circles')

/** Create a new credit circle */
export const createCircle = (data) =>
  api.post('/circles', data)

/** Join a circle */
export const joinCircle = (circleId, address) =>
  api.post(`/circles/${circleId}/join`, { address })

export default api
