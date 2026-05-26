import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { getMyLoans, createPaymentOrder, verifyPayment } from '../api/index.js'

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true)
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

const INR = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const short = (addr = '') => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '—'

const INSTALL_MAP = {
  paid:     { bg: 'bg-emerald-100', color: 'text-emerald-800',  label: '✓ Paid'    },
  due_soon: { bg: 'bg-amber-100', color: 'text-amber-800',  label: '⚡ Due Soon' },
  upcoming: { bg: 'bg-surface-container', color: 'text-secondary',  label: '○ Upcoming' },
}

/* ── Lender Distribution Panel ── */
function DistributionPanel({ distribution, emi_inr }) {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="text-secondary text-sm text-center py-8">
        No lenders yet — this loan hasn't been funded.
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-headline-md text-lg font-bold text-ink mb-2">Lender Distribution</h4>
      <div className="text-sm text-secondary mb-5">
        Each lender receives a proportional share of your monthly EMI of {' '}
        <strong className="text-ink font-extrabold">{INR(emi_inr)}</strong>
      </div>
      <div className="flex flex-col gap-3">
        {distribution.map((d, i) => {
          const colors = ['bg-feature-teal', 'bg-feature-lavender', 'bg-feature-peach', 'bg-feature-ochre', 'bg-feature-pink']
          const colorClass = colors[i % 5]
          
          return (
            <div key={i} className="bg-surface border border-secondary-container/50 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-ink font-bold">
                      {d.lender_short}
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {d.payment_method === 'UPI' ? '💳 UPI' : '🔷 ETH'} • {d.eth_contributed.toFixed(4)} ETH
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-600">
                    {INR(d.monthly_emi_share_inr)}<span className="text-xs text-secondary font-medium">/mo</span>
                  </div>
                  <div className="text-xs text-secondary font-semibold mt-0.5">{d.share_pct}% share</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-secondary-container/50 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${Math.min(d.share_pct, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── EMI Schedule Panel ── */
function SchedulePanel({ loan, schedule, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [paying, setPaying] = useState(null)

  if (!schedule || schedule.length === 0) {
    return <div className="text-secondary text-sm text-center py-8">No schedule — loan not yet funded.</div>
  }
  const shown = expanded ? schedule : schedule.slice(0, 4)

  const handlePayEMI = async (s) => {
    setPaying(s.installment)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay SDK failed to load')

      const orderRes = await createPaymentOrder({
        loan_id: loan.id,
        borrower_address: loan.borrower_address,
        amount_inr: s.emi_inr,
        payment_type: 'emi'
      })
      
      const { id: order_id, amount, currency } = orderRes.data || orderRes

      const options = {
        key: 'rzp_test_StnL6XnaTW3iLy',
        amount: amount.toString(),
        currency: currency,
        name: 'VeilFi',
        description: `EMI ${s.installment} for ${loan.purpose}`,
        order_id: order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              loan_id: loan.id,
              borrower_address: loan.borrower_address,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount_inr: s.emi_inr,
              payment_type: 'emi',
              lender_address: 'EMI_REPAYMENT'
            })
            alert('EMI paid successfully!')
            if (onRefresh) onRefresh()
          } catch (err) {
            alert('Verification failed: ' + (err.response?.data?.detail || err.message))
          }
        },
        prefill: { name: 'Borrower', email: 'borrower@veilfi.io', contact: '9999999999' },
        theme: { color: '#008080' } // feature-teal
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => { alert(resp.error.description) })
      rzp.open()
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Payment initiation failed')
    } finally {
      setPaying(null)
    }
  }

  return (
    <div>
      <h4 className="font-headline-md text-lg font-bold text-ink mb-2">Amortization Schedule</h4>
      <div className="text-sm text-secondary mb-5">
        Track your EMI payments, principal breakdown, and interest.
      </div>
      <div className="overflow-x-auto bg-surface border border-secondary-container/50 rounded-2xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-secondary-container">
              {['#', 'Due Date', 'EMI', 'Principal', 'Interest', 'Status', 'Action'].map(h => (
                <th key={h} className={`py-4 px-4 font-label-sm text-xs text-secondary uppercase tracking-widest ${h === '#' || h === 'Status' || h === 'Action' ? 'text-center' : (h !== 'Due Date' ? 'text-right' : 'text-left')}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-container/30">
            {shown.map((s) => {
              const si = INSTALL_MAP[s.status] || INSTALL_MAP.upcoming
              return (
                <tr key={s.installment} className="hover:bg-white transition-colors">
                  <td className="py-4 px-4 text-center text-secondary font-bold">{s.installment}</td>
                  <td className="py-4 px-4 text-ink font-semibold">{s.due_date}</td>
                  <td className="py-4 px-4 text-right font-extrabold text-ink">{INR(s.emi_inr)}</td>
                  <td className="py-4 px-4 text-right text-feature-teal font-medium">{INR(s.principal_inr)}</td>
                  <td className="py-4 px-4 text-right text-error font-medium">{INR(s.interest_inr)}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${si.bg} ${si.color}`}>
                      {si.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {s.status !== 'paid' && ['active', 'funded'].includes(loan.status) && (
                      <button 
                        onClick={() => handlePayEMI(s)}
                        disabled={paying === s.installment}
                        className="px-3 py-1.5 bg-feature-teal text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                        {paying === s.installment ? 'Wait...' : 'Pay EMI 💳'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {schedule.length > 4 && (
        <button onClick={() => setExpanded(x => !x)} className="w-full mt-4 py-3 bg-surface border border-secondary-container/50 rounded-xl text-ink text-sm font-bold hover:bg-surface-container-low transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all ${schedule.length} installments`}
        </button>
      )}
    </div>
  )
}

/* ── Loan Row ── */
function LoanRow({ loan, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  
  // get next payment
  let nextPayment = 'N/A'
  if (loan.schedule && loan.schedule.length > 0) {
     const next = loan.schedule.find(s => s.status === 'upcoming' || s.status === 'due_soon')
     if (next) nextPayment = next.due_date
  }

  const apy = loan.apr ? `${loan.apr.toFixed(2)}%` : '12.00%'

  const statusStyles = {
    active: 'bg-feature-teal/10 text-feature-teal',
    funded: 'bg-feature-lavender/10 text-feature-lavender',
    repaid: 'bg-feature-pink/10 text-feature-pink',
    defaulted: 'bg-error/10 text-error',
  }
  const statusClass = statusStyles[loan.status] || 'bg-surface-container text-secondary'

  const initials = loan.purpose ? loan.purpose.charAt(0).toUpperCase() : 'L'
  const iconColor = ['bg-feature-pink', 'bg-feature-peach', 'bg-feature-lavender', 'bg-feature-teal', 'bg-feature-ochre'][loan.id.charCodeAt(0) % 5] || 'bg-ink'

  return (
    <>
      <tr className="hover:bg-white transition-colors group">
        <td className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center text-white font-bold`}>{initials}</div>
             <span className="font-headline-md text-lg font-bold text-ink">{loan.purpose || 'Business Loan'}</span>
          </div>
        </td>
        <td className="px-6 py-6">
          <span className="font-body-md text-body-md font-bold text-feature-teal">{apy}</span>
        </td>
        <td className="px-6 py-6">
          <span className="font-body-md text-body-md text-ink">{INR(loan.remaining_inr)}</span>
        </td>
        <td className="px-6 py-6">
          <div className="flex flex-col">
             <span className="font-body-md text-body-md text-ink">{nextPayment}</span>
             <span className="font-label-sm text-[11px] text-secondary">EMI: {INR(loan.emi_inr)}</span>
          </div>
        </td>
        <td className="px-6 py-6">
          <span className="font-body-md text-body-md text-secondary">{loan.duration_months} months</span>
        </td>
        <td className="px-6 py-6 text-center">
          <span className={`px-3 py-1 rounded-full font-label-sm text-[12px] uppercase tracking-wide ${statusClass}`}>{loan.status}</span>
        </td>
        <td className="px-8 py-6 text-right">
          <button 
             onClick={() => setExpanded(!expanded)}
             className={`px-4 py-2 rounded-xl bg-ink text-white font-label-sm text-sm font-semibold transition-opacity hover:scale-105 ${expanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
             {expanded ? 'Hide Detail' : 'View Detail'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
           <td colSpan="7" className="px-8 py-8 bg-surface-container-lowest border-b border-secondary-container">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <SchedulePanel loan={loan} schedule={loan.schedule} onRefresh={onRefresh} />
               <DistributionPanel distribution={loan.distribution} emi_inr={loan.emi_inr} />
             </div>
           </td>
        </tr>
      )}
    </>
  )
}

/* ── Main Page Component ── */
export default function MyLoans() {
  const { address, isConnected } = useWallet()
  const navigate = useNavigate()
  
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ borrowed: 0, emi: 0, funded: 0, remaining: 0, active: 0 })

  const load = useCallback(async () => {
    if (!address) return
    try {
      setLoading(true)
      const res = await getMyLoans(address)
      if (res.data) {
        setLoans(res.data)
        // Aggregate stats
        let borrowed = 0, emi = 0, funded = 0, remaining = 0
        let active = 0
        res.data.forEach(l => {
          borrowed += l.principal_inr || 0
          emi += l.emi_inr || 0
          funded += l.funded_inr || 0
          remaining += l.remaining_inr || 0
          if (l.status === 'active' || l.status === 'funded') active++
        })
        setStats({ borrowed, emi, funded, remaining, active })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      load()
    } else {
      setLoading(false)
    }
  }, [isConnected, address, load])

  return (
    <div className="min-h-screen bg-canvas p-margin-desktop font-sans">
      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h2 className="font-display-lg text-4xl font-bold text-ink tracking-tight">My Portfolio</h2>
            <p className="text-secondary mt-2">Manage your active loans and upcoming EMI payments.</p>
          </div>
          <button onClick={load} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-ink">refresh</span>
          </button>
        </header>

        {!isConnected && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-secondary-container">
            <h2 className="text-2xl font-bold text-ink">Connect Wallet</h2>
            <p className="text-secondary mt-2 mb-6">Please connect your wallet to view your loans.</p>
          </div>
        )}

        {isConnected && loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink mx-auto"></div>
            <p className="text-secondary mt-4 font-medium tracking-widest uppercase text-sm">Loading Portfolio...</p>
          </div>
        )}

        {isConnected && !loading && loans.length === 0 && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-secondary-container">
            <h2 className="text-2xl font-bold text-ink">No Loans Yet</h2>
            <p className="text-secondary mt-2 mb-6">You haven't applied for any loans.</p>
            <button onClick={() => navigate('/create-loan')} className="px-6 py-3 bg-ink text-white font-bold rounded-xl hover:scale-105 transition-transform">
              Apply for a Loan
            </button>
          </div>
        )}

        {isConnected && !loading && loans.length > 0 && (
          <>
            {/* Portfolio Overview Bento */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="institution-card p-8 bg-feature-teal rounded-[24px] text-white flex flex-col justify-between h-56 transition-transform hover:-translate-y-1">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4">account_balance</span>
                  <p className="font-label-sm text-xs uppercase tracking-widest opacity-80">Principal Outstanding</p>
                </div>
                <h3 className="font-display-lg text-4xl font-bold tracking-tight">{INR(stats.remaining)}</h3>
              </div>
              <div className="institution-card p-8 bg-feature-lavender rounded-[24px] text-white flex flex-col justify-between h-56 transition-transform hover:-translate-y-1">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4">payments</span>
                  <p className="font-label-sm text-xs uppercase tracking-widest opacity-80">Total Borrowed</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <h3 className="font-display-lg text-4xl font-bold tracking-tight">{INR(stats.borrowed)}</h3>
                </div>
              </div>
              <div className="institution-card p-8 bg-feature-peach rounded-[24px] text-white flex flex-col justify-between h-56 transition-transform hover:-translate-y-1">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4">timer</span>
                  <p className="font-label-sm text-xs uppercase tracking-widest opacity-80">Total Active Loans</p>
                </div>
                <h3 className="font-display-lg text-4xl font-bold tracking-tight">{stats.active} Positions</h3>
              </div>
            </section>

            {/* Loan List Table */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-headline-md text-2xl font-bold text-ink">Active Loans</h4>
                  <p className="font-body-md text-secondary mt-1">Detailed overview of your current credit deployments.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/create-loan')} className="px-4 py-2 border-[1.5px] border-secondary-container rounded-xl font-label-sm text-sm font-semibold hover:bg-surface-container-low transition-colors">
                    + New Loan
                  </button>
                </div>
              </div>
              
              <div className="bg-surface-container-low rounded-[24px] overflow-hidden border border-secondary-container/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-secondary-container">
                      <th className="px-8 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">Loan Name</th>
                      <th className="px-6 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">APY</th>
                      <th className="px-6 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">Remaining</th>
                      <th className="px-6 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">Next Payment</th>
                      <th className="px-6 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">Maturity</th>
                      <th className="px-6 py-5 font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold text-center">Status</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-container/30">
                    {loans.map(loan => (
                      <LoanRow key={loan.id} loan={loan} onRefresh={load} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
