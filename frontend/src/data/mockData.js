export const BORROWER_PROFILES = [
  {
    id: 'rahul',
    name: 'Rahul Sharma',
    role: 'Street Food Vendor · Delhi',
    emoji: '🍜',
    tier: 'Gold',
    score: 762,
    tagline: 'UPI & GST Verified Business Owner',
    signals: { upi: true, gst: true, rental: false },
    story: 'Rahul processes ₹2.1L monthly through UPI across 3 food stalls. Never missed a payment.',
    color: 'border-gold/40 bg-gradient-to-br from-yellow-900/20 to-card',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    role: 'Freelance Designer · Bangalore',
    emoji: '🎨',
    tier: 'Platinum',
    score: 851,
    tagline: 'Top Rated Creative Professional',
    signals: { upi: true, gst: false, rental: true },
    story: 'Priya earns ₹3.5L/mo from international clients. Consistent rental payments for 4 years.',
    color: 'border-slate-400/30 bg-gradient-to-br from-slate-800/20 to-card',
  },
  {
    id: 'anita',
    name: 'Anita Meena',
    role: 'Kirana Store Owner · Jaipur',
    emoji: '🏪',
    tier: 'Silver',
    score: 681,
    tagline: 'Registered SME with GST History',
    signals: { upi: true, gst: true, rental: false },
    story: 'Anita has operated her store for 6 years with consistent GST filings and UPI transactions.',
    color: 'border-grey/30 bg-gradient-to-br from-slate-700/20 to-card',
  },
  {
    id: 'vikram',
    name: 'Vikram Singh',
    role: 'Auto Driver · Mumbai',
    emoji: '🛺',
    tier: 'Bronze',
    score: 558,
    tagline: 'Ola/Uber Verified Driver Partner',
    signals: { upi: true, gst: false, rental: true },
    story: 'Vikram has driven 8,000+ trips with 4.8 rating. Consistent rental payments in Dharavi.',
    color: 'border-orange-700/30 bg-gradient-to-br from-orange-900/20 to-card',
  },
]

export const VERIFICATION_SIGNALS = [
  { key: 'upi', label: 'UPI Transactions', icon: '📱', detail: 'Analyzing 90-day history…' },
  { key: 'gst', label: 'GST Filings', icon: '📋', detail: 'Fetching GSTIN records…' },
  { key: 'rental', label: 'Rental History', icon: '🏠', detail: 'Verifying payment stream…' },
]

export const CONTRACT_URL = 'https://sepolia.etherscan.io/address/0xb10E4A0573145551639C69C3e8bB9B7dC7c1D4F2'

export const HOW_IT_WORKS_STEPS = [
  { icon: '🪪', title: 'Link Your Data', desc: 'Connect UPI, GST, or rental history privately using our secure adapter.' },
  { icon: '🔐', title: 'ZK Proof Minted', desc: 'Our circuit generates a zero-knowledge proof of your credit signals.' },
  { icon: '🏅', title: 'SBT Issued', desc: 'A Soul-Bound Token with your tier and score is minted on-chain.' },
  { icon: '🤝', title: 'Apply for Loans', desc: 'List your loan request on the marketplace. Community funds you.' },
  { icon: '💸', title: 'Repay & Grow', desc: 'Repay EMIs to boost your score. No middlemen. Full transparency.' },
]

export const STATS = [
  { label: 'Total Credit Market', value: 2500000, prefix: '₹', suffix: 'Cr+' },
  { label: 'Underbanked Indians', value: 300, prefix: '', suffix: 'M+' },
  { label: 'Middlemen Removed', value: 0, prefix: '', suffix: '' },
]

export const CREDIT_GAP_CARDS = [
  {
    icon: '🏦',
    title: 'CIBIL Excludes 300M',
    desc: 'Gig workers, farmers, and SMBs have no formal credit history despite being financially active.',
    color: 'border-red-500/30',
  },
  {
    icon: '🔒',
    title: 'Zero Knowledge Privacy',
    desc: 'Your UPI flows, GST, and rental data prove your creditworthiness without revealing any numbers.',
    color: 'border-gold/30',
  },
  {
    icon: '⚡',
    title: 'No Middlemen',
    desc: 'Smart contracts replace banks. Borrowers pay less. Lenders earn more. DeFi transparency.',
    color: 'border-teal/30',
  },
]

export const MARKETPLACE_LOANS = [
  { id: '1', borrowerName: 'Rahul Sharma', tier: 'Gold', purpose: 'Expand food stall chain', amount: 150000, funded: 95000, rate: 8.5, term: 12, score: 762, emoji: '🍜' },
  { id: '2', borrowerName: 'Priya Nair', tier: 'Platinum', purpose: 'Design studio equipment', amount: 300000, funded: 280000, rate: 6.2, term: 18, score: 851, emoji: '🎨' },
  { id: '3', borrowerName: 'Anita Meena', tier: 'Silver', purpose: 'Kirana store inventory', amount: 80000, funded: 20000, rate: 10.5, term: 6, score: 681, emoji: '🏪' },
  { id: '4', borrowerName: 'Vikram Singh', tier: 'Bronze', purpose: 'Auto maintenance fund', amount: 50000, funded: 10000, rate: 12.0, term: 9, score: 558, emoji: '🛺' },
  { id: '5', borrowerName: 'Meera Patel', tier: 'Gold', purpose: 'Tailoring workshop tools', amount: 120000, funded: 80000, rate: 7.8, term: 12, score: 735, emoji: '🧵' },
  { id: '6', borrowerName: 'Suresh Kumar', tier: 'Silver', purpose: 'Dairy farm expansion', amount: 200000, funded: 50000, rate: 9.5, term: 24, score: 690, emoji: '🐄' },
]

export const DASHBOARD_STATS = {
  totalLent: 450000,
  totalBorrowed: 150000,
  activeLoans: 3,
  avgReturn: 8.2,
  totalRepaid: 125000,
  creditScore: 762,
  tier: 'Gold',
  recentActivity: [
    { type: 'lent', amount: 25000, to: 'Rahul Sharma', date: '2024-01-15', status: 'active' },
    { type: 'repayment', amount: 8500, from: 'Priya Nair', date: '2024-01-12', status: 'completed' },
    { type: 'lent', amount: 50000, to: 'Anita Meena', date: '2024-01-10', status: 'active' },
    { type: 'withdrawal', amount: 15000, date: '2024-01-08', status: 'completed' },
  ],
}

export const CIRCLES_DATA = [
  { id: 'c1', name: 'Delhi Street Vendors', description: 'A tight-knit group of verified street vendors pooling credit for bulk purchases.', members: 12, poolSize: 850000, avgScore: 720, joined: false },
  { id: 'c2', name: 'Bangalore Freelancers', description: 'Tech & design freelancers building shared credit history.', members: 8, poolSize: 1200000, avgScore: 790, joined: false },
  { id: 'c3', name: 'Mumbai Auto Union', description: 'Auto and taxi drivers supporting each other with micro-loans.', members: 24, poolSize: 600000, avgScore: 650, joined: false },
  { id: 'c4', name: 'Jaipur SME Network', description: 'Small business owners from Jaipur sharing credit resources.', members: 15, poolSize: 950000, avgScore: 710, joined: true },
]
