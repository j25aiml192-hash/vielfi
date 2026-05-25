import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TierBadge from './TierBadge.jsx'
import ProgressBar from './ProgressBar.jsx'

/**
 * LoanCard ΓÇö marketplace loan listing card
 * @prop {object} loan ΓÇö loan data object
 * @prop {function} onFund ΓÇö called with (loanId, amount)
 */

export default function LoanCard({ loan = {}, onFund }) {
  const [hovering, setHovering] = useState(false)
  const navigate = useNavigate()

  const {
    id          = '1',
    borrowerName = 'Anonymous',
    tier         = 'Silver',
    purpose      = 'Working Capital',
    story        = 'Looking for funds to grow my small business.',
    amount       = 100000,
    funded       = 45000,
    duration     = 12,
    emi          = 9500,
    interestRate = 12,
    lenders      = 3,
    daysLeft     = 14,
    avatar       = null,
  } = loan

  const fundedPct  = Math.round((funded / amount) * 100)
  const remaining  = amount - funded

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  const initials = borrowerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="card-hover cursor-pointer group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/loan/${id}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-block-lilac/20 flex items-center justify-center text-block-lilac font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-primary text-sm truncate">{borrowerName}</h3>
            <TierBadge tier={tier} size="sm" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="badge badge-indigo text-xs">{purpose}</span>
            <span className="text-xs text-secondary">{duration}M</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-primary font-display font-bold">{formatINR(amount)}</div>
          <div className="text-secondary text-xs">{interestRate}% APR</div>
        </div>
      </div>

      {/* Story */}
      <p className="text-sm text-secondary mt-3 leading-relaxed line-clamp-2">
        {story}
      </p>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-secondary">
            <span className="text-semantic-success font-semibold">{formatINR(funded)}</span> raised
          </span>
          <span className="text-secondary">{fundedPct}% funded</span>
        </div>
        <ProgressBar value={fundedPct} variant="teal" size="sm" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-hairline">
        <div className="flex items-center gap-4 text-xs text-secondary">
          <span>
            <span className="text-primary font-medium">{lenders}</span> lenders
          </span>
          <span>
            <span className="text-primary font-medium">{daysLeft}d</span> left
          </span>
          <span>EMI {formatINR(emi)}/mo</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFund && onFund(id, 5000)
          }}
          className="btn-primary px-4 py-2 text-xs"
        >
          Fund Now
        </button>
      </div>
    </div>
  )
}