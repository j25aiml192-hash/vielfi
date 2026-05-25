import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { useSidebar } from '../context/SidebarContext.jsx'

/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   NAV SECTIONS  (NitiSetu-style)
ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
const SECTIONS = [
  {
    label: 'MARKETS',
    items: [
      {
        to: '/feed',
        label: 'Marketplace',
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
        ),
      },
      {
        to: '/dashboard',
        label: 'Live Portfolio',
        badge: null,
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'LENDING',
    items: [
      {
        to: '/verify',
        label: 'Get Verified',
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
        ),
      },
      {
        to: '/loan/1',
        label: 'My Loans',
        badge: 3,
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      {
        to: '/circles',
        label: 'Credit Circles',
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      {
        to: '/profile',
        label: 'My Profile',
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        ),
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: (
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        ),
      },
    ],
  },
]

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   APP SIDEBAR  ΓÇö NitiSetu-inspired
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
export default function AppSidebar() {
  const { expanded, setExpanded } = useSidebar()
  const [filter,   setFilter]   = useState('')
  const { isConnected, shortAddress, disconnect, userRole } = useWallet()
  const navigate = useNavigate()

  const ini = isConnected
    ? (shortAddress?.slice(2, 4) || 'WL').toUpperCase()
    : 'KT'

  const W = expanded ? 264 : 60

  const filteredSections = SECTIONS.map(sec => ({
    ...sec,
    items: sec.items.filter(it =>
      !filter || it.label.toLowerCase().includes(filter.toLowerCase())
    ),
  })).filter(sec => sec.items.length > 0)

  return (
    <aside style={{
      width: W,
      height: '100vh',
      background: '#fff',
      borderRight: '1px solid #e8e6e2',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40,          /* above navbar (z-30) */
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ΓöÇΓöÇ Logo + collapse toggle ΓöÇΓöÇ */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        padding: expanded ? '0 14px 0 16px' : '0',
        borderBottom: '1px solid #f0ede8',
        flexShrink: 0,
      }}>
        {expanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.78rem' }}>V</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>VeilFi</div>
              <div style={{ fontSize: 9, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Credit Intelligence</div>
            </div>
          </div>
        )}

        {/* Collapse/expand button */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            width: 28, height: 28, borderRadius: 6,
            border: '1px solid #e8e6e2', background: '#faf8f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f0ede8'}
          onMouseLeave={e => e.currentTarget.style.background = '#faf8f5'}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#777" strokeWidth={2.2}
            style={{ transform: expanded ? 'none' : 'rotate(180deg)', transition: 'transform 0.25s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* ΓöÇΓöÇ Search filter (expanded only) ΓöÇΓöÇ */}
      {expanded && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0ede8', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#bbb" strokeWidth={2}
              style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Filter..."
              style={{
                width: '100%', padding: '7px 10px 7px 26px',
                border: '1px solid #e8e6e2', borderRadius: 8,
                background: '#faf9f7', fontSize: 12, color: '#333',
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {/* ΓöÇΓöÇ Live status (expanded only) ΓöÇΓöÇ */}
      {expanded && (
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1ea64a', boxShadow: '0 0 6px #1ea64a88' }} />
          <span style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>Live ┬╖ synced now</span>
        </div>
      )}

      {/* ΓöÇΓöÇ Nav sections ΓöÇΓöÇ */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: expanded ? '6px 0' : '8px 0', scrollbarWidth: 'none' }}>
        {filteredSections.map(sec => (
          <div key={sec.label}>
            {/* Section label (expanded only) */}
            {expanded && (
              <div style={{
                padding: '12px 16px 4px',
                fontSize: 9, fontWeight: 700, color: '#aaa',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {sec.label}
              </div>
            )}

            {/* Items */}
            {sec.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {({ isActive }) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: expanded ? 12 : 0,
                    padding: expanded ? '10px 16px' : '11px 0',
                    justifyContent: expanded ? 'flex-start' : 'center',
                    borderRadius: expanded ? 8 : 10,
                    margin: expanded ? '1px 8px' : '2px 8px',
                    background: isActive ? '#f0ede8' : 'transparent',
                    color: isActive ? '#0a0a0a' : '#666',
                    transition: 'background 0.15s, color 0.15s',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#faf8f5'; e.currentTarget.style.color = '#0a0a0a' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? '#0a0a0a' : '#666' }}
                  >
                    {/* Active indicator bar */}
                    {isActive && !expanded && (
                      <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#0a0a0a', borderRadius: 2 }} />
                    )}

                    {/* Icon */}
                    <span style={{ flexShrink: 0, display: 'flex', color: 'inherit' }}>
                      {item.icon}
                    </span>

                    {/* Label + badge (expanded only) */}
                    {expanded && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#0a0a0a', padding: '2px 6px', borderRadius: 10, flexShrink: 0, marginLeft: 6 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tooltip (collapsed only) */}
                    {!expanded && (
                      <span className="sb-tooltip" style={{
                        position: 'absolute', left: 54, top: '50%', transform: 'translateY(-50%)',
                        background: '#1a1a1a', color: '#fff', fontSize: 11, fontWeight: 500,
                        padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                        pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s',
                        zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}>
                        {item.label}
                        {item.badge && <span style={{ marginLeft: 6, background: '#fff', color: '#1a1a1a', padding: '1px 5px', borderRadius: 8, fontSize: 9, fontWeight: 700 }}>{item.badge}</span>}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}

            {/* Section divider */}
            <div style={{ height: 1, background: '#f5f3ef', margin: expanded ? '6px 12px' : '6px 10px' }} />
          </div>
        ))}
      </div>

      {/* ΓöÇΓöÇ User profile footer ΓöÇΓöÇ */}
      <div style={{
        borderTop: '1px solid #f0ede8',
        padding: expanded ? '12px 14px' : '12px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: isConnected ? '#4338ca' : '#e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 11, color: isConnected ? '#fff' : '#555',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/profile')}
          >{ini}</div>
          {/* Online dot */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#1ea64a', border: '2px solid #fff' }} />
        </div>

        {/* Name + role (expanded only) */}
        {expanded && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isConnected ? shortAddress : 'Guest User'}
            </div>
            <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isConnected ? (userRole || 'Lender') : 'Not connected'}
            </div>
          </div>
        )}

        {/* Disconnect / logout (expanded only) */}
        {expanded && isConnected && (
          <button
            onClick={disconnect}
            title="Disconnect wallet"
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: '1px solid #e8e6e2', background: '#faf8f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, color: '#888',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#dc2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#faf8f5'; e.currentTarget.style.color = '#888' }}
          >
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        )}
      </div>

      {/* Tooltip hover style */}
      <style>{`
        .sb-tooltip { opacity: 0 !important; }
        [class*="NavLink"]:hover .sb-tooltip,
        div:hover > .sb-tooltip { opacity: 1 !important; }
        div:hover > span.sb-tooltip { opacity: 1 !important; }
      `}</style>
    </aside>
  )
}