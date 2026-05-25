/* ─────────────────────────────────────────────────────────────
   Footer — dark, multi-column
───────────────────────────────────────────────────────────── */
import { NavLink } from 'react-router-dom'

const COLS = [
  {
    title: 'Product',
    links: [
      { to: '/feed',      label: 'Marketplace'   },
      { to: '/verify',    label: 'Get Verified'  },
      { to: '/circles',   label: 'Circles'       },
      { to: '/dashboard', label: 'Dashboard'     },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/#about',    label: 'About'         },
      { to: '/#how',      label: 'How it works'  },
      { to: '/#security', label: 'Security'      },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/#privacy',  label: 'Privacy Policy'},
      { to: '/#terms',    label: 'Terms of Use'  },
      { to: '/#cookies',  label: 'Cookies'       },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background:   '#111827',
      color:        '#9CA3AF',
      padding:      '64px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top: logo + columns */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr repeat(3, auto)',
          gap:                 48,
          marginBottom:        48,
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width:          28,
                height:         28,
                borderRadius:   6,
                background:     '#D4AF37',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>V</span>
              </div>
              <span style={{
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    600,
                fontSize:      17,
                color:         '#F9FAFB',
                letterSpacing: '-0.02em',
              }}>VeilFi</span>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   14,
              lineHeight: 1.6,
              color:      '#6B7280',
              maxWidth:   220,
              margin:     0,
            }}>
              India's first ZK-powered credit identity protocol.
            </p>
            {/* Chain badge */}
            <div style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          6,
              marginTop:    16,
              padding:      '4px 10px',
              borderRadius: 9999,
              border:       '1px solid #1F2937',
              background:   '#1F2937',
            }}>
              <span style={{ fontSize: 12 }}>⛓</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6B7280', letterSpacing: '0.04em' }}>
                Built on Ethereum
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <div style={{
                fontFamily:    "'Inter', sans-serif",
                fontSize:      12,
                fontWeight:    600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:         '#F9FAFB',
                marginBottom:  14,
              }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      style={{
                        fontFamily:     "'Inter', sans-serif",
                        fontSize:       14,
                        color:          '#9CA3AF',
                        textDecoration: 'none',
                        transition:     'color 150ms',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#F9FAFB' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF' }}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1F2937', paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#4B5563' }}>
              © {new Date().getFullYear()} VeilFi · JSS University, Noida
            </span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#374151', letterSpacing: '0.04em' }}>
              Privacy-preserving ZK credit scoring
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
