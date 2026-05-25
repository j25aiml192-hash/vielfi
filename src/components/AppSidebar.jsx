import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext.jsx'
import { useSidebar } from '../context/SidebarContext.jsx'

/* ── Nav sections ── */
const SECTIONS = [
  {
    label: 'MARKETS',
    items: [
      {
        to: '/feed', label: 'Marketplace',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
      },
      {
        to: '/dashboard', label: 'Live Portfolio',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
      },
    ],
  },
  {
    label: 'LENDING',
    items: [
      {
        to: '/verify', label: 'Get Verified',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
      },
      {
        to: '/loan/1', label: 'My Loans', badge: 3,
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
      },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      {
        to: '/circles', label: 'Credit Circles',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>,
      },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      {
        to: '/profile', label: 'My Profile',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
      },
      {
        to: '/settings', label: 'Settings',
        icon: <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
      },
    ],
  },
]

/* ═══════════════════════════
   APP SIDEBAR — NitiSetu style
═══════════════════════════ */
export default function AppSidebar() {
  const { expanded, setExpanded } = useSidebar()
  const [filter, setFilter] = useState('')
  const { isConnected, shortAddress, disconnect, userRole } = useWallet()
  const navigate = useNavigate()

  const EXPANDED_W  = 264
  const COLLAPSED_W = 60

  const ini = isConnected
    ? (shortAddress?.replace('0x', '').slice(0, 2) || 'WL').toUpperCase()
    : 'KT'

  const filteredSections = SECTIONS.map(sec => ({
    ...sec,
    items: sec.items.filter(it =>
      !filter || it.label.toLowerCase().includes(filter.toLowerCase())
    ),
  })).filter(sec => sec.items.length > 0)

  return (
    <>
      <aside style={{
        width: expanded ? EXPANDED_W : COLLAPSED_W,
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #ececec',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 40,
        fontFamily: 'Inter, sans-serif',
      }}>

        {/* ── Logo row (always visible) ── */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          padding: expanded ? '0 16px' : '0',
          borderBottom: expanded ? '1px solid #f0f0f0' : 'none',
          flexShrink: 0,
        }}>
          {/* Logo — full when expanded, icon-only when collapsed */}
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>V</span>
            </div>
            {expanded && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>VeilFi</div>
                <div style={{ fontSize: 10, color: '#aaa', letterSpacing: '0.04em', lineHeight: 1.2 }}>Credit Intelligence</div>
              </div>
            )}
          </button>

          {/* Collapse / expand toggle — only in expanded state */}
          {expanded && (
            <button
              onClick={() => setExpanded(e => !e)}
              title="Collapse"
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: '1px solid #e8e8e8', background: '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
            >
              <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── Expand toggle row (collapsed mode only) ── */}
        {!expanded && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 0', borderBottom: '1px solid #f0f0f0', flexShrink: 0,
          }}>
            <button
              onClick={() => setExpanded(e => !e)}
              title="Expand"
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: '1px solid #e8e8e8', background: '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
            >
              <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2.2}
                style={{ transform: 'rotate(180deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
              </svg>
            </button>
          </div>
        )}


        {/* ── Search filter (expanded only) ── */}
        {expanded && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="#bbb" strokeWidth={2}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Filter..."
                style={{
                  width: '100%', padding: '8px 10px 8px 30px',
                  border: '1px solid #e8e8e8', borderRadius: 8,
                  background: '#fafafa', fontSize: 13, color: '#333',
                  outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#c9952a'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>
          </div>
        )}

        {/* ── Live status ── */}
        <div style={{
          padding: expanded ? '8px 18px' : '10px 0',
          display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: 7, flexShrink: 0,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#1ea64a',
            boxShadow: '0 0 6px #1ea64a99',
            flexShrink: 0,
          }} />
          {expanded && (
            <span style={{ fontSize: 11, color: '#999', letterSpacing: '0.02em' }}>
              Live · synced now
            </span>
          )}
        </div>

        {/* ── Nav sections ── */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: expanded ? '4px 0 8px' : '4px 0 8px',
          scrollbarWidth: 'none',
        }}>
          {filteredSections.map((sec, si) => (
            <div key={sec.label} style={{ marginBottom: 4 }}>

              {/* Section label — expanded only */}
              {expanded && (
                <div style={{
                  padding: '14px 18px 6px',
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#b0aca6',
                }}>
                  {sec.label}
                </div>
              )}

              {/* Items */}
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: 'none', display: 'block', padding: expanded ? '0 8px' : '0 6px', marginBottom: 2 }}
                >
                  {({ isActive }) => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: expanded ? '9px 12px' : '10px 0',
                        justifyContent: expanded ? 'flex-start' : 'center',
                        borderRadius: 10,
                        background: isActive ? '#fdf5e0' : 'transparent',
                        color: isActive ? '#c9952a' : '#555',
                        transition: 'background 0.15s, color 0.15s',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = '#f7f7f7'
                          e.currentTarget.style.color = '#0a0a0a'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#555'
                        }
                      }}
                    >
                      {/* Active left bar (collapsed mode) */}
                      {isActive && !expanded && (
                        <div style={{
                          position: 'absolute', left: -6, top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3, height: 18,
                          background: '#c9952a', borderRadius: 2,
                        }} />
                      )}

                      {/* Icon */}
                      <span style={{ flexShrink: 0, display: 'flex', color: 'inherit' }}>
                        {item.icon}
                      </span>

                      {/* Label + badge (expanded only) */}
                      {expanded && (
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', flex: 1,
                        }}>
                          <span style={{
                            fontSize: 14, fontWeight: isActive ? 600 : 400,
                            color: 'inherit',
                          }}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: isActive ? '#c9952a' : '#888',
                              background: isActive ? '#fdf0d0' : '#f0f0f0',
                              padding: '2px 7px', borderRadius: 10,
                              flexShrink: 0, marginLeft: 8,
                            }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip — collapsed only */}
                      {!expanded && (
                        <div className="sb-tip" style={{
                          position: 'absolute', left: 54, top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#1a1a1a', color: '#fff',
                          fontSize: 12, fontWeight: 500,
                          padding: '5px 10px', borderRadius: 7,
                          whiteSpace: 'nowrap', pointerEvents: 'none',
                          opacity: 0, transition: 'opacity 0.15s',
                          zIndex: 200, boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                        }}>
                          {item.label}
                          {item.badge && (
                            <span style={{
                              marginLeft: 6, background: '#fff', color: '#1a1a1a',
                              padding: '1px 5px', borderRadius: 8, fontSize: 9, fontWeight: 700,
                            }}>{item.badge}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}

              {/* Divider between sections */}
              {si < filteredSections.length - 1 && (
                <div style={{
                  height: 1, background: '#f3f3f3',
                  margin: expanded ? '8px 18px' : '8px 10px',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── User footer ── */}
        <div style={{
          borderTop: '1px solid #f0f0f0',
          padding: expanded ? '12px 14px' : '12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          gap: 10, flexShrink: 0,
        }}>
          {/* Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: isConnected
                ? 'linear-gradient(135deg,#c9952a,#e8c05a)'
                : '#e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 12,
              color: isConnected ? '#fff' : '#555',
            }}>
              {ini}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 9, height: 9, borderRadius: '50%',
              background: '#1ea64a', border: '2px solid #fff',
            }} />
          </div>

          {/* Name + role — expanded only */}
          {expanded && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#0a0a0a',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {isConnected ? shortAddress : 'Guest User'}
              </div>
              <div style={{
                fontSize: 11, color: '#aaa',
                letterSpacing: '0.03em',
                textTransform: 'capitalize',
              }}>
                {isConnected ? (userRole || 'Lender') : 'Not connected'}
              </div>
            </div>
          )}

          {/* Disconnect — expanded + connected */}
          {expanded && isConnected && (
            <button
              onClick={disconnect}
              title="Disconnect wallet"
              style={{
                width: 30, height: 30, borderRadius: 7,
                border: '1px solid #e8e8e8', background: '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, color: '#aaa',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.style.color = '#dc2626' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#aaa' }}
            >
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Tooltip hover style */}
      <style>{`
        [data-sidebar-item]:hover .sb-tip { opacity: 1 !important; }
        div:hover > .sb-tip { opacity: 1 !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}