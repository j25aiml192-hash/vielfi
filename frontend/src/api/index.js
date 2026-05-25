import axios from 'axios'

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  url = url.trim();
  url = url.replace(/\/+$/, '');
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      url = 'http://' + url;
    } else {
      url = 'https://' + url;
    }
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
  return config
})

api.interceptors.response.use(
  (res) => { console.log(`[API] Response:`, res.data); return res.data },
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Network error'
    console.error(`[API] Error:`, msg)
    return Promise.reject(new Error(msg))
  }
)

// ─── Credit Verification ───────────────────────────────────────────────────
export const verifyProfile = (profileName) =>
  api.post('/api/credit/verify', { profileName })

export const verifyCreditCustom = (data) =>
  api.post('/api/credit/verify', data)

// ─── Marketplace ──────────────────────────────────────────────────────────
export const getMarketplaceFeed = () => api.get('/api/marketplace/feed')

// ─── Loans ────────────────────────────────────────────────────────────────
export const fundLoan    = (loanId, amount) => api.post('/api/loans/fund',   { loanId, amount })
export const repayEMI    = (loanId)         => api.post('/api/loans/repay',  { loanId })

// ─── Circles ──────────────────────────────────────────────────────────────
export const getCircleById = (id)     => api.get(`/api/circles/${id}`)
export const createCircle  = (data)   => api.post('/api/circles/create', {
  name: data.name,
  description: data.description,
  targetAmount: Number(data.targetAmount) || 0,
})
export const joinCircle = (circleId, amount, lenderAddress) => 
  api.post('/api/circles/contribute', { circleId, amount: Number(amount), lenderAddress })
export const getCircles = ()          => api.get('/api/circles')
export const getNarrative = (profileName) => api.post(`/api/narrative/${profileName}`)

// ─── Feature 1: Ratings ───────────────────────────────────────────────────
export const getRatings = (address) =>
  api.get(`/api/ratings/${address}`)

export const submitRating = (data) =>
  api.post('/api/ratings/submit', data)

// ─── Feature 2: Loan History ──────────────────────────────────────────────
export const getLoanHistory = (address) =>
  api.get(`/api/history/${address}`)

// ─── Feature 3 & 6: Dashboard + AI Recommendations ───────────────────────
export const getBorrowerDashboard = (address) =>
  api.get(`/api/dashboard/borrower/${address}`)

export const getLenderDashboard = (address) =>
  api.get(`/api/dashboard/lender/${address}`)

export const getAIRecommendationsForLender = (data) =>
  api.post('/api/dashboard/ai/recommend/lender', data)

export const getAIRecommendationsForBorrower = (data) =>
  api.post('/api/dashboard/ai/recommend/borrower', data)

// ─── Feature 4: AI Chatbot ────────────────────────────────────────────────
export const sendChatMessage = (data) =>
  api.post('/api/chat/message', data)

export const getChatWelcome = () =>
  api.get('/api/chat/welcome')

// ─── Feature 5: Notifications ─────────────────────────────────────────────
export const getNotifications = (address) =>
  api.get(`/api/notifications/${address}`)

export const markNotificationsRead = (ids) =>
  api.post('/api/notifications/read', { notification_ids: ids })

export const markAllNotificationsRead = (address) =>
  api.post(`/api/notifications/read-all/${address}`)

export default api
