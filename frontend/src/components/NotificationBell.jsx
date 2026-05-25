import { useState, useEffect, useRef } from 'react'
import { Bell, TrendingUp, Calendar, Star, Sparkles, CheckCircle, Trophy, X } from 'lucide-react'
import { getNotifications, markNotificationsRead, markAllNotificationsRead } from '../api/index.js'
import { useWallet } from '../context/WalletContext.jsx'

const ICON_MAP = {
  TrendingUp:  <TrendingUp  size={16} />,
  Calendar:    <Calendar    size={16} />,
  Star:        <Star        size={16} />,
  Sparkles:    <Sparkles    size={16} />,
  CheckCircle: <CheckCircle size={16} />,
  Trophy:      <Trophy      size={16} />,
}

const COLOR_MAP = {
  loan_funded:         { bg: '#DCFCE7', color: '#15803D' },
  emi_due:             { bg: '#FEF3C7', color: '#D97706' },
  score_updated:       { bg: '#FEF9C3', color: '#CA8A04' },
  new_recommendation:  { bg: '#EDE9FE', color: '#7C3AED' },
  loan_repaid:         { bg: '#DCFCE7', color: '#15803D' },
  tier_upgrade:        { bg: '#FEF9C3', color: '#D4AF37' },
  circle_contribution: { bg: '#F3E8FF', color: '#9333EA' },
}

const DEMO_ADDRESS = '0x3d4613bfFc15F8d46Df148F62C31B6d32575B002'

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const { account } = useWallet?.() || {}
  const address = account || DEMO_ADDRESS

  const [open, setOpen]           = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread]       = useState(0)
  const [loading, setLoading]     = useState(false)
  const dropdownRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getNotifications(address)
      setNotifications(data.notifications || [])
      setUnread(data.unread_count || 0)
    } catch {
      // silently fail
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [address])

  // Poll every 30s
  useEffect(() => {
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [address])

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(o => !o)
  }

  const handleRead = async (id) => {
    await markNotificationsRead([id])
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnread(prev => Math.max(0, prev - 1))
  }

  const handleReadAll = async () => {
    await markAllNotificationsRead(address)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: 8, borderRadius: 8,
          color: '#6B7280', display: 'flex', alignItems: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        title="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            minWidth: 16, height: 16, borderRadius: 8,
            background: '#EF4444', color: '#fff',
            fontSize: 10, fontWeight: 700, lineHeight: '16px',
            textAlign: 'center', padding: '0 3px',
            border: '2px solid #fff',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          width: 380, maxHeight: 480,
          background: '#fff', borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden', zIndex: 9990,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #F3F4F6',
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
              Notifications {unread > 0 && <span style={{ color: '#D4AF37' }}>({unread})</span>}
            </span>
            {unread > 0 && (
              <button onClick={handleReadAll} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#D4AF37', fontWeight: 600,
              }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', maxHeight: 400 }}>
            {loading && notifications.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Loading…
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <Bell size={36} color="#E5E7EB" style={{ marginBottom: 8 }} />
                <div style={{ color: '#9CA3AF', fontSize: 13 }}>No notifications yet</div>
              </div>
            )}

            {notifications.map((n) => {
              const style = COLOR_MAP[n.type] || { bg: '#F3F4F6', color: '#6B7280' }
              return (
                <div
                  key={n.id}
                  onClick={() => { handleRead(n.id); setOpen(false) }}
                  style={{
                    padding: '12px 16px', display: 'flex', gap: 12,
                    alignItems: 'flex-start', cursor: 'pointer',
                    background: n.read ? '#fff' : '#FEFCE8',
                    borderBottom: '1px solid #F9FAFB',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? '#fff' : '#FEFCE8'}
                >
                  {/* Icon */}
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: style.bg, color: style.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {ICON_MAP[n.icon] || <Bell size={16} />}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      {timeAgo(n.timestamp)}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#D4AF37', flexShrink: 0, marginTop: 4,
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
