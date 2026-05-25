import { useState } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import TierBadge from '../components/TierBadge.jsx'
import { createCircle, joinCircle, getCircles } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

/* ── Mock circles ── */
const MOCK_CIRCLES = [
  {
    id: 'c1',
    name: 'Delhi Street Vendors',
    description: 'A tight-knit group of Chandni Chowk vendors pooling credit power together.',
    members: 12,
    maxMembers: 20,
    totalPool: 600000,
    tier: 'Gold',
    purpose: 'Working Capital',
    admin: '0x3f7a...9b2e',
    joined: true,
    contributions: [
      { name: 'Rahul S.', amount: 50000 },
      { name: 'Ravi K.',  amount: 45000 },
      { name: 'Sunita M.',amount: 40000 },
    ],
  },
  {
    id: 'c2',
    name: 'Bangalore Freelancers',
    description: 'Creative professionals building collective credit history in the gig economy.',
    members: 8,
    maxMembers: 15,
    totalPool: 800000,
    tier: 'Platinum',
    purpose: 'Equipment & Tools',
    admin: '0x7d8e...9f0a',
    joined: false,
    contributions: [
      { name: 'Priya N.', amount: 100000 },
      { name: 'Arun T.',  amount: 80000 },
    ],
  },
  {
    id: 'c3',
    name: 'Maharashtra Farmers',
    description: 'Seasonal credit circle for Nashik farmers for harvest equipment and storage.',
    members: 25,
    maxMembers: 30,
    totalPool: 1250000,
    tier: 'Silver',
    purpose: 'Agricultural',
    admin: '0x1c2d...3e4f',
    joined: false,
    contributions: [
      { name: 'Ganesh P.', amount: 50000 },
      { name: 'Lata B.',   amount: 45000 },
    ],
  },
]

/* ── Circle Card ── */
function CircleCard({ circle, onJoin }) {
  const [expanded, setExpanded] = useState(false)
  const fillPct = Math.round((circle.members / circle.maxMembers) * 100)

  return (
    <div className="card-hover">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-primary">{circle.name}</h3>
            <TierBadge tier={circle.tier} size="sm" />
          </div>
          <p className="text-secondary text-sm">{circle.description}</p>
        </div>
        {circle.joined && (
          <span className="badge badge-teal flex-shrink-0">Joined</span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-hairline">
        <div className="text-center">
          <div className="font-bold text-primary">{circle.members}/{circle.maxMembers}</div>
          <div className="text-xs text-secondary mt-0.5">Members</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-primary">{formatINR(circle.totalPool)}</div>
          <div className="text-xs text-secondary mt-0.5">Pool Size</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-primary">{circle.purpose}</div>
          <div className="text-xs text-secondary mt-0.5">Purpose</div>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mt-4">
        <ProgressBar value={fillPct} variant={fillPct > 80 ? 'gold' : 'indigo'} label="Capacity" showPct size="sm" />
      </div>

      {/* Expand: contributions */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-hairline animate-fade-in">
          <h4 className="text-sm font-semibold text-primary mb-3">Top Contributors</h4>
          <div className="space-y-2">
            {circle.contributions.map((c) => (
              <div key={c.name} className="flex justify-between text-sm">
                <span className="text-secondary">{c.name}</span>
                <span className="text-primary font-medium">{formatINR(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="btn-secondary text-xs px-4 py-2 flex-1 justify-center"
        >
          {expanded ? 'Collapse' : 'View Members'}
        </button>
        {!circle.joined && (
          <button
            onClick={() => onJoin(circle.id)}
            className="btn-primary text-xs px-4 py-2 flex-1 justify-center"
          >
            Join Circle
          </button>
        )}
        {circle.joined && (
          <button className="btn-primary text-xs px-4 py-2 flex-1 justify-center">
            Manage
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Create Circle Form ── */
function CreateCircleForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    purpose: '',
    maxMembers: 15,
    targetPool: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createCircle(form)
    } catch { /* demo */ }
    setSuccess(true)
    setLoading(false)
    setTimeout(() => { setSuccess(false); onCreated?.() }, 2000)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-display font-bold text-primary text-xl mb-2">Circle Created!</h3>
        <p className="text-secondary text-sm">Your credit circle is now live on VeilFi.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-secondary mb-2 block">Circle Name *</label>
        <input required className="input" placeholder="e.g. Mumbai Artisans Circle" value={form.name} onChange={set('name')} />
      </div>
      <div>
        <label className="text-sm text-secondary mb-2 block">Description *</label>
        <textarea required className="input min-h-[80px] resize-none" placeholder="What is this circle for?" value={form.description} onChange={set('description')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-secondary mb-2 block">Purpose</label>
          <select className="select" value={form.purpose} onChange={set('purpose')}>
            <option value="">Select…</option>
            {['Working Capital', 'Equipment', 'Education', 'Agricultural', 'Health', 'Housing'].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-secondary mb-2 block">Max Members</label>
          <input type="number" className="input" min={3} max={50} value={form.maxMembers} onChange={set('maxMembers')} />
        </div>
      </div>
      <div>
        <label className="text-sm text-secondary mb-2 block">Target Pool (INR)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">₹</span>
          <input type="number" className="input pl-8" placeholder="500000" value={form.targetPool} onChange={set('targetPool')} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
        {loading ? 'Creating…' : 'Create Circle'}
      </button>
    </form>
  )
}

export default function Circles() {
  const [circles, setCircles] = useState(MOCK_CIRCLES)
  const [tab, setTab] = useState('browse')
  const { isConnected } = useWallet()

  const handleJoin = async (circleId) => {
    try {
      await joinCircle(circleId, '0x0000')
    } catch { /* demo */ }
    setCircles((prev) =>
      prev.map((c) => c.id === circleId ? { ...c, joined: true, members: c.members + 1 } : c)
    )
  }

  const joined    = circles.filter((c) => c.joined)
  const notJoined = circles.filter((c) => !c.joined)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Collective Credit</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl text-primary">
                Credit <span className="text-block-lilac">Circles</span>
              </h1>
              <p className="text-secondary mt-2 text-lg">
                Pool credit power with your community. Borrow bigger, together.
              </p>
            </div>
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Circles', value: circles.length },
            { label: 'Total Members',  value: circles.reduce((a, c) => a + c.members, 0) },
            { label: 'Total Pool',     value: '₹26.5L' },
          ].map(({ label, value }) => (
            <div key={label} className="stat-card">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-surface-soft rounded-xl border border-hairline w-fit mb-8">
          <button onClick={() => setTab('browse')}  className={`tab-btn ${tab === 'browse'  ? 'active' : ''}`}>Browse Circles</button>
          <button onClick={() => setTab('mine')}    className={`tab-btn ${tab === 'mine'    ? 'active' : ''}`}>My Circles ({joined.length})</button>
          <button onClick={() => setTab('create')}  className={`tab-btn ${tab === 'create'  ? 'active' : ''}`}>Create Circle</button>
        </div>

        {/* Browse */}
        {tab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {notJoined.map((c, i) => (
              <div key={c.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <CircleCard circle={c} onJoin={handleJoin} />
              </div>
            ))}
          </div>
        )}

        {/* My circles */}
        {tab === 'mine' && (
          <div className="animate-fade-in">
            {joined.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⭕</div>
                <h3 className="font-display font-bold text-primary text-xl mb-2">No circles yet</h3>
                <p className="text-secondary mb-5">Browse and join a credit circle to get started</p>
                <button onClick={() => setTab('browse')} className="btn-primary">Browse Circles</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {joined.map((c) => (
                  <CircleCard key={c.id} circle={c} onJoin={handleJoin} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create */}
        {tab === 'create' && (
          <div className="max-w-lg mx-auto card animate-slide-up">
            <h2 className="font-display font-bold text-primary text-xl mb-6">Create a Credit Circle</h2>
            {!isConnected && (
              <div className="badge badge-gold mb-4 text-xs px-3 py-2">
                Connect wallet to create a circle
              </div>
            )}
            <CreateCircleForm onCreated={() => setTab('browse')} />
          </div>
        )}
      </div>
    </div>
  )
}
