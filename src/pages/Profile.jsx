import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SBTCard from '../components/SBTCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import api from '../api/index.js'

const DEFAULT_PROFILE_NAME = 'rahul_shopkeeper'
const ETHERSCAN_URL = 'https://sepolia.etherscan.io/address/0x3d4613bfFc15F8d46Df148F62C31B6d32575B002'

const FALLBACK_VERIFY_RESPONSE = {
  tier: 'Gold',
  cibilScore: 762,
  upiScore: 100,
  gstScore: 100,
  rentalScore: 97.5,
  proofHash: '0x7f3a9b2e1c4d8f6a5b0e3d9c7f2a4e8b1d6c3f9a2b5e8c1d4f7a0b3e6c9f2a5b8e1',
  narrative: 'Demo profile loaded while the verification API is unavailable.',
}

const PROFILE_META = {
  name: 'Rahul Sharma',
  wallet: '0x3d4613bfFc15F8d46Df148F62C31B6d32575B002',
  tagline: 'UPI, GST & rental verified business owner',
  mintedAt: '2024-03-15',
}

const LOAN_HISTORY = [
  { id: '1', purpose: 'Working Capital', amount: 100000, status: 'Active', repaid: 45000, duration: 12, startDate: 'Jan 2024' },
  { id: '2', purpose: 'Equipment', amount: 50000, status: 'Closed', repaid: 50000, duration: 6, startDate: 'Jul 2023' },
  { id: '3', purpose: 'Inventory', amount: 75000, status: 'Closed', repaid: 75000, duration: 9, startDate: 'Jan 2023' },
]

const REPUTATION_TIMELINE = [
  { date: 'Mar 2024', event: 'SBT Minted',          icon: '🏅', color: 'text-primary' },
  { date: 'Mar 2024', event: 'ZK Proof Generated',   icon: '🔐', color: 'text-block-lilac' },
  { date: 'Mar 2024', event: 'GST Data Linked',       icon: '📋', color: 'text-semantic-success' },
  { date: 'Feb 2024', event: 'UPI History Verified',  icon: '📱', color: 'text-semantic-success' },
  { date: 'Jan 2024', event: 'Loan #1 Repaid Early',  icon: '✓',  color: 'text-semantic-success' },
  { date: 'Jul 2023', event: 'Loan #2 Funded',        icon: '💰', color: 'text-primary' },
]

const readScore = (data, camelKey, snakeKey) =>
  Number(data?.[camelKey] ?? data?.[snakeKey] ?? 0)

const adaptVerifyResponse = (data) => ({
  tier: data?.tier || 'Silver',
  cibilScore: readScore(data, 'cibilScore', 'cibil_score'),
  upiScore: readScore(data, 'upiScore', 'upi_score'),
  gstScore: readScore(data, 'gstScore', 'gst_score'),
  rentalScore: readScore(data, 'rentalScore', 'rental_score'),
  proofHash: data?.proofHash || data?.proof_hash || '',
  narrative: data?.narrative || '',
})

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const clampPct = (value) => Math.max(0, Math.min(100, Math.round(value || 0)))

function buildScoreHistory(score) {
  const current = Number(score || 700)
  return [
    { month: 'Nov', score: Math.max(300, current - 142) },
    { month: 'Dec', score: Math.max(300, current - 114) },
    { month: 'Jan', score: Math.max(300, current - 77) },
    { month: 'Feb', score: Math.max(300, current - 42) },
    { month: 'Mar', score: Math.max(300, current - 14) },
    { month: 'Apr', score: current },
  ]
}

function ScoreChart({ history }) {
  const max = Math.max(...history.map((h) => h.score))
  const min = Math.min(550, ...history.map((h) => h.score))
  const range = Math.max(max - min, 1)

  return (
    <div className="relative h-32 flex items-end gap-2">
      {history.map(({ month, score }) => {
        const pct = ((score - min) / range) * 100
        return (
          <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {score}
            </span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary/20 to-primary/40 transition-all duration-700 relative overflow-hidden"
              style={{ height: `${pct}%`, minHeight: '8px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
            </div>
            <span className="text-xs text-secondary">{month}</span>
          </div>
        )
      })}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-1 space-y-4">
        <div className="card h-96">
          <div className="h-16 w-16 rounded-2xl bg-border" />
          <div className="h-7 bg-border rounded w-2/3 mt-5" />
          <div className="h-3 bg-border rounded w-1/2 mt-3" />
          <div className="h-24 bg-border rounded mt-12" />
        </div>
        <div className="card grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-border rounded mx-auto w-14" />
              <div className="h-3 bg-border rounded mx-auto w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="card h-80">
          <div className="h-6 bg-border rounded w-48" />
          <div className="h-32 bg-border rounded mt-8" />
          <div className="space-y-3 mt-8">
            <div className="h-3 bg-border rounded" />
            <div className="h-3 bg-border rounded" />
            <div className="h-3 bg-border rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const [tab, setTab] = useState('overview')
  const [verifyData, setVerifyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const { isConnected, shortAddress } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setLoading(true)
      try {
        const data = await api.post('/api/credit/verify', {
          profile_name: DEFAULT_PROFILE_NAME,
          profileName: DEFAULT_PROFILE_NAME,
        })
        if (!isMounted) return

        setVerifyData(adaptVerifyResponse(data))
        setApiError('')
      } catch (err) {
        if (!isMounted) return

        setVerifyData(adaptVerifyResponse(FALLBACK_VERIFY_RESPONSE))
        setApiError(err.message || 'Verification API failed')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const profile = useMemo(() => {
    const data = verifyData || adaptVerifyResponse(FALLBACK_VERIFY_RESPONSE)
    return {
      ...PROFILE_META,
      tier: data.tier,
      score: data.cibilScore,
      proofHash: data.proofHash,
      signals: {
        upi: data.upiScore > 0,
        gst: data.gstScore > 0,
        rental: data.rentalScore > 0,
      },
    }
  }, [verifyData])

  const scoreHistory = useMemo(() => buildScoreHistory(profile.score), [profile.score])
  const scoreGain = scoreHistory.at(-1).score - scoreHistory[0].score
  const proofHash = profile.proofHash || FALLBACK_VERIFY_RESPONSE.proofHash

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-2">Your Identity</p>
            <h1 className="font-display font-black text-4xl text-primary">
              Credit <span className="text-gradient-gold">Profile</span>
            </h1>
          </div>
          {!isConnected && (
            <div className="card border border-primary/20 bg-primary/5 text-sm text-primary py-3 px-4 max-w-xs">
              Connect wallet to see your live profile
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: SBT Card */}
          <div className="lg:col-span-1 space-y-4">
            <SBTCard sbt={{ ...profile, wallet: isConnected ? `${shortAddress}` : profile.wallet }} size="lg" />

            {/* Quick stats */}
            <div className="card grid grid-cols-2 gap-4">
              {[
                { label: 'Loans Taken',   value: '3' },
                { label: 'On-Time Repay', value: '100%' },
                { label: 'Total Borrowed', value: '₹2.25L' },
                { label: 'Current Score',  value: profile.score },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-display font-bold text-xl text-primary">{value}</div>
                  <div className="text-xs text-secondary mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tabs */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tab bar */}
            <div className="flex gap-2 p-1 bg-surface-container rounded-full border border-hairline w-fit">
              {['overview', 'loans', 'timeline'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`tab-btn capitalize ${tab === t ? 'active' : ''}`}
                >
                  {t === 'overview' ? 'Score History' : t === 'loans' ? 'Loan History' : 'Timeline'}
                </button>
              ))}
            </div>

            {/* Overview: Score chart */}
            {tab === 'overview' && (
              <div className="card animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-primary">Credit Score History</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-gradient-gold">{profile.score}</span>
                    <span className="badge badge-teal text-xs">+14 this month</span>
                  </div>
                </div>
                <ScoreChart history={SCORE_HISTORY} />
                <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">6 months</div>
                    <div className="text-xs text-secondary">Score period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-semantic-success">+142</div>
                    <div className="text-xs text-secondary">Total gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">Gold</div>
                    <div className="text-xs text-secondary">Current tier</div>
                  </div>
                </div>

                {/* Signal breakdown */}
                <div className="mt-6 space-y-4 pt-4 border-t border-hairline">
                  <h3 className="text-sm font-semibold text-primary">Signal Breakdown</h3>
                  <ProgressBar value={82} variant="indigo" label="UPI Transaction History" showPct />
                  <ProgressBar value={74} variant="gold"   label="GST Filing Consistency"   showPct />
                  <ProgressBar value={66} variant="teal"   label="Rental Payment Record"    showPct />
                </div>
              </div>
            )}

            {/* Loan history */}
            {tab === 'loans' && (
              <div className="card animate-fade-in">
                <h2 className="font-display font-bold text-primary mb-6">Loan History</h2>
                <div className="space-y-4">
                  {LOAN_HISTORY.map((loan) => {
                    const repaidPct = Math.round((loan.repaid / loan.amount) * 100)
                    return (
                      <div
                        key={loan.id}
                        onClick={() => navigate(`/loan/${loan.id}`)}
                        className="rounded-xl bg-surface-soft border border-hairline p-4 hover:border-primary/20 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-primary">{loan.purpose}</span>
                              <span className={`badge text-xs ${
                                loan.status === 'Active' ? 'badge-teal' : 'badge-grey'
                              }`}>
                                {loan.status}
                              </span>
                            </div>
                            <div className="text-xs text-secondary">
                              Started {loan.startDate} · {loan.duration}M term
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-display font-bold text-primary">{formatINR(loan.amount)}</div>
                            <div className="text-xs text-secondary mt-0.5">
                              {formatINR(loan.repaid)} repaid
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={repaidPct} variant={loan.status === 'Closed' ? 'teal' : 'gold'} size="sm" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Timeline */}
            {tab === 'timeline' && (
              <div className="card animate-fade-in">
                <h2 className="font-display font-bold text-primary mb-6">Reputation Timeline</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-hairline" />
                  <div className="space-y-5 pl-10">
                    {REPUTATION_TIMELINE.map((item, i) => (
                      <div
                        key={i}
                        className="relative animate-slide-right"
                        style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                      >
                        <div className="absolute -left-10 w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-sm">
                          {item.icon}
                        </div>
                        <div className="rounded-xl bg-surface-soft border border-hairline p-3 hover:border-primary/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-sm ${item.color}`}>{item.event}</span>
                            <span className="text-xs text-secondary">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <a
              href={ETHERSCAN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm"
            >
              View on Etherscan
            </a>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm px-4 py-3">
            Verification API failed. Showing demo fallback. ({apiError})
          </div>
        )}

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <SBTCard
                sbt={{ ...profile, wallet: isConnected ? `${shortAddress}` : profile.wallet }}
                size="lg"
                contractUrl={ETHERSCAN_URL}
              />

              <div className="card grid grid-cols-2 gap-4">
                {[
                  { label: 'Loans Taken', value: '3' },
                  { label: 'On-Time Repay', value: '100%' },
                  { label: 'Total Borrowed', value: 'INR 2.25L' },
                  { label: 'Current Score', value: profile.score },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="font-display font-bold text-xl text-white">{value}</div>
                    <div className="text-xs text-grey mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-2 p-1 bg-card rounded-xl border border-border w-fit">
                {['overview', 'loans', 'timeline'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`tab-btn capitalize ${tab === t ? 'active' : ''}`}
                  >
                    {t === 'overview' ? 'Score History' : t === 'loans' ? 'Loan History' : 'Timeline'}
                  </button>
                ))}
              </div>

              {tab === 'overview' && (
                <div className="card animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-white">Credit Score History</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-display font-bold text-gradient-gold">{profile.score}</span>
                      <span className="badge badge-teal text-xs">+{scoreGain} total</span>
                    </div>
                  </div>
                  <ScoreChart history={scoreHistory} />
                  <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">6 months</div>
                      <div className="text-xs text-grey">Score period</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-teal">+{scoreGain}</div>
                      <div className="text-xs text-grey">Total gain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gold">{profile.tier}</div>
                      <div className="text-xs text-grey">Current tier</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-white">Signal Breakdown</h3>
                    <ProgressBar value={clampPct(verifyData.upiScore)} variant="indigo" label="UPI Transaction History" showPct />
                    <ProgressBar value={clampPct(verifyData.gstScore)} variant="gold" label="GST Filing Consistency" showPct />
                    <ProgressBar value={clampPct(verifyData.rentalScore)} variant="teal" label="Rental Payment Record" showPct />
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-white">Proof Hash</h3>
                    <p className="mt-2 text-xs text-grey font-mono break-all">{proofHash}</p>
                  </div>
                </div>
              )}

              {tab === 'loans' && (
                <div className="card animate-fade-in">
                  <h2 className="font-display font-bold text-white mb-6">Loan History</h2>
                  <div className="space-y-4">
                    {LOAN_HISTORY.map((loan) => {
                      const repaidPct = Math.round((loan.repaid / loan.amount) * 100)
                      return (
                        <div
                          key={loan.id}
                          onClick={() => navigate(`/loan/${loan.id}`)}
                          className="rounded-xl bg-bg border border-border p-4 hover:border-gold/30 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white">{loan.purpose}</span>
                                <span className={`badge text-xs ${loan.status === 'Active' ? 'badge-teal' : 'badge-grey'}`}>
                                  {loan.status}
                                </span>
                              </div>
                              <div className="text-xs text-grey">
                                Started {loan.startDate} | {loan.duration}M term
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-display font-bold text-white">{formatINR(loan.amount)}</div>
                              <div className="text-xs text-grey mt-0.5">
                                {formatINR(loan.repaid)} repaid
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <ProgressBar value={repaidPct} variant={loan.status === 'Closed' ? 'teal' : 'gold'} size="sm" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {tab === 'timeline' && (
                <div className="card animate-fade-in">
                  <h2 className="font-display font-bold text-white mb-6">Reputation Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-5 pl-10">
                      {REPUTATION_TIMELINE.map((item, i) => (
                        <div
                          key={item.event}
                          className="relative animate-slide-right"
                          style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                        >
                          <div className="absolute -left-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-bold text-grey">
                            {item.marker}
                          </div>
                          <div className="rounded-xl bg-bg border border-border p-3 hover:border-gold/20 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium text-sm ${item.color}`}>{item.event}</span>
                              <span className="text-xs text-grey">{item.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
