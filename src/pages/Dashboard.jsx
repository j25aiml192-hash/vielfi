import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { useWallet } from '../context/WalletContext.jsx'

/* ── Mock data ── */
const BORROWER_DATA = {
  activeLoans: [
    { id: '1', purpose: 'Working Capital', amount: 200000, funded: 154000, nextEMI: 18500, nextEMIDate: 'Jun 5', onTime: true },
  ],
  creditScore: 762,
  tier: 'Gold',
  totalBorrowed: 350000,
  totalRepaid: 225000,
  onTimePayments: 12,
  scoreChange: 14,
}

const LENDER_DATA = {
  totalDeployed: 450000,
  activeLoans: 7,
  avgReturn: 13.2,
  totalReturns: 58500,
  impactStories: 7,
  portfolio: [
    { name: 'Rahul Sharma',  tier: 'Gold',     invested: 50000,  returns: 6500,  status: 'Active' },
    { name: 'Priya Nair',    tier: 'Platinum',  invested: 80000,  returns: 7200,  status: 'Active' },
    { name: 'Meera Pillai',  tier: 'Gold',     invested: 70000,  returns: 7700,  status: 'Active' },
    { name: 'Anita Meena',   tier: 'Silver',   invested: 40000,  returns: 5200,  status: 'Repaid' },
    { name: 'Suresh Yadav',  tier: 'Silver',   invested: 30000,  returns: 3600,  status: 'Repaid' },
  ],
}

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

/* ── Borrower Tab ── */
function BorrowerDashboard() {
  const d = BORROWER_DATA
  const navigate = useNavigate()
  const totalPct = Math.round((d.totalRepaid / d.totalBorrowed) * 100)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Credit Score', value: d.creditScore, sub: `+${d.scoreChange} this month`, color: 'text-gold' },
          { label: 'Total Borrowed', value: formatINR(d.totalBorrowed), sub: 'All loans', color: 'text-white' },
          { label: 'Total Repaid', value: formatINR(d.totalRepaid), sub: `${totalPct}% complete`, color: 'text-teal' },
          { label: 'On-Time Payments', value: `${d.onTimePayments}`, sub: '100% streak', color: 'text-indigo' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card text-center">
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-grey mt-1">{label}</div>
            <div className="text-xs text-grey/60 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Active loans */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white">Active Loans</h2>
          <button onClick={() => navigate('/feed')} className="btn-secondary text-xs px-4 py-2">
            Apply for Loan
          </button>
        </div>
        {d.activeLoans.map((loan) => {
          const fundedPct = Math.round((loan.funded / loan.amount) * 100)
          return (
            <div key={loan.id} className="rounded-xl bg-bg border border-border p-5 hover:border-gold/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-white">{loan.purpose}</span>
                  <div className="flex items-center gap-3 mt-1 text-sm text-grey">
                    <span>{formatINR(loan.amount)} total</span>
                    <span>·</span>
                    <span>{formatINR(loan.funded)} funded</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-grey">Next EMI</div>
                  <div className="font-display font-bold text-gold">{formatINR(loan.nextEMI)}</div>
                  <div className="text-xs text-grey">Due {loan.nextEMIDate}</div>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={fundedPct} variant="teal" size="md" label="Funding Progress" showPct />
              </div>
              <div className="mt-3 flex gap-3">
                <button className="btn-primary text-xs px-5 py-2">Pay EMI</button>
                <button onClick={() => navigate(`/loan/${loan.id}`)} className="btn-secondary text-xs px-5 py-2">
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Repayment schedule visual */}
      <div className="card">
        <h2 className="font-display font-bold text-white mb-4">Overall Repayment</h2>
        <ProgressBar value={totalPct} variant="gold" size="lg" showPct />
        <div className="flex justify-between text-xs text-grey mt-2">
          <span>{formatINR(d.totalRepaid)} repaid</span>
          <span>{formatINR(d.totalBorrowed - d.totalRepaid)} remaining</span>
        </div>
      </div>
    </div>
  )
}

/* ── Lender Tab ── */
function LenderDashboard() {
  const d = LENDER_DATA
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Deployed', value: formatINR(d.totalDeployed), color: 'text-gold' },
          { label: 'Active Loans',   value: d.activeLoans, color: 'text-white' },
          { label: 'Total Returns',  value: formatINR(d.totalReturns), color: 'text-teal' },
          { label: 'Avg APR',        value: `${d.avgReturn}%`, color: 'text-indigo' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-grey mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Impact banner */}
      <div className="card border border-teal/20 bg-teal/5">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🌱</div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">Your Social Impact</h3>
            <p className="text-grey text-sm mt-1">
              You've helped <span className="text-teal font-semibold">{d.impactStories} Indians</span> access fair credit —
              bypassing traditional gatekeepers.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white">Portfolio</h2>
          <button onClick={() => navigate('/feed')} className="btn-primary text-xs px-4 py-2">
            Fund More
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-grey text-left">
                <th className="pb-3 font-medium">Borrower</th>
                <th className="pb-3 font-medium">Tier</th>
                <th className="pb-3 font-medium text-right">Invested</th>
                <th className="pb-3 font-medium text-right">Returns</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {d.portfolio.map((item) => (
                <tr key={item.name} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 font-medium text-white">{item.name}</td>
                  <td className="py-3"><TierBadge tier={item.tier} size="sm" /></td>
                  <td className="py-3 text-right text-grey">{formatINR(item.invested)}</td>
                  <td className="py-3 text-right text-teal font-semibold">+{formatINR(item.returns)}</td>
                  <td className="py-3 text-right">
                    <span className={`badge text-xs ${item.status === 'Active' ? 'badge-teal' : 'badge-grey'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [role, setRole] = useState('borrower')
  const { isConnected } = useWallet()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-2">Overview</p>
            <h1 className="font-display font-black text-4xl text-white">
              Your <span className="text-gradient-gold">Dashboard</span>
            </h1>
          </div>
          {!isConnected && (
            <div className="text-sm text-grey border border-border rounded-xl px-4 py-3 bg-card">
              Showing demo data — connect wallet for live data
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div className="flex gap-2 p-1 bg-card rounded-xl border border-border w-fit mb-8">
          <button
            onClick={() => setRole('borrower')}
            className={`tab-btn ${role === 'borrower' ? 'active' : ''}`}
          >
            Borrower
          </button>
          <button
            onClick={() => setRole('lender')}
            className={`tab-btn ${role === 'lender' ? 'active' : ''}`}
          >
            Lender
          </button>
        </div>

        {role === 'borrower' ? <BorrowerDashboard /> : <LenderDashboard />}
      </div>
    </div>
  )
}
