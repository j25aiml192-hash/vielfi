import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Loader } from 'lucide-react'
import { sendChatMessage, getChatWelcome } from '../api/index.js'

export default function ChatBot({ address }) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([
    "How does VeilFi work?",
    "Check my credit score",
    "How to get a loan?",
    "How to earn as lender?",
  ])
  const messagesEndRef = useRef(null)

  // Load welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      getChatWelcome()
        .then((data) => {
          setMessages([{ role: 'assistant', content: data.response, ts: new Date() }])
          if (data.suggestions?.length) setSuggestions(data.suggestions)
        })
        .catch(() => {
          setMessages([{
            role: 'assistant',
            content: "Namaste! 👋 Main VeilFi AI hun. Aap puchh sakte hain: apna credit score, loans, ya VeilFi kaise kaam karta hai.",
            ts: new Date(),
          }])
        })
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role: 'user', content: msg, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const history = messages.map(m => ({ role: m.role, content: m.content }))
    try {
      const data = await sendChatMessage({ message: msg, address, conversation_history: history })
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, ts: new Date() }])
      if (data.suggestions?.length) setSuggestions(data.suggestions)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! Network issue aa gayi. Thoda wait karo aur phir try karo. 🙏",
        ts: new Date(),
      }])
    }
    setLoading(false)
  }

  const fmt = (ts) => ts?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) || ''

  return (
    <>
      {/* Pulse ring */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9998,
          width: 56, height: 56, borderRadius: '50%',
          boxShadow: '0 0 0 0 rgba(201,149,42,0.7)',
          animation: 'veilPulse 2s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#0a0a0a',
          border: '2px solid rgba(201,149,42,0.35)',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,149,42,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 32px rgba(0,0,0,0.4), 0 0 0 3px rgba(201,149,42,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,149,42,0.15)'
        }}
        title="Chat with VeilFi AI"
      >
        {open
          ? <X size={22} color="#fff" />
          : (
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900, fontSize: 24,
              color: '#fff', letterSpacing: '-0.04em',
              lineHeight: 1, userSelect: 'none',
            }}>V</span>
          )
        }
        {/* Unread dot */}
        {!open && messages.length === 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 10, height: 10,
            borderRadius: '50%', background: '#EF4444', border: '2px solid #0a0a0a',
          }} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 9998,
          width: 390, height: 560, borderRadius: 20,
          background: '#fff',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,149,42,0.12)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid rgba(201,149,42,0.18)',
          animation: 'chatSlideIn 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: '1px solid rgba(201,149,42,0.2)',
          }}>
            {/* V logo */}
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #c9952a, #e8c05a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(201,149,42,0.45)',
            }}>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 900,
                fontSize: 20, color: '#fff', letterSpacing: '-0.04em',
                lineHeight: 1, userSelect: 'none',
              }}>V</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>VeilFi AI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#10B981', display: 'inline-block',
                  boxShadow: '0 0 6px #10B981',
                }} />
                <span style={{ color: '#888', fontSize: 11 }}>Online · ZK Credit Intelligence</span>
              </div>
            </div>

            <button onClick={() => setOpen(false)} style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <X size={14} color="#aaa" />
            </button>
          </div>

          {/* ── Messages area with doodle bg ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
            backgroundImage: 'url(/chat_doodle_bg.png)',
            backgroundSize: '420px auto',
            backgroundRepeat: 'repeat',
            backgroundColor: '#fefefe',
            backgroundBlendMode: 'multiply',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {/* Avatar row */}
                <div style={{
                  display: 'flex', alignItems: 'flex-end', gap: 8,
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg,#0a0a0a,#333)'
                      : 'linear-gradient(135deg,#c9952a,#e8c05a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  }}>
                    {m.role === 'user' ? 'U' : 'V'}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '76%', padding: '10px 14px', borderRadius: 14,
                    fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                    fontFamily: 'Inter, sans-serif',
                    ...(m.role === 'user'
                      ? {
                          background: '#0a0a0a',
                          color: '#fff',
                          borderBottomRightRadius: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.88)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          color: '#111',
                          border: '1px solid rgba(201,149,42,0.18)',
                          borderBottomLeftRadius: 4,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        }
                    ),
                  }}>
                    {m.content}
                  </div>
                </div>

                <span style={{
                  fontSize: 10, color: '#aaa', marginTop: 4,
                  paddingInline: 36,
                }}>
                  {fmt(m.ts)}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#c9952a,#e8c05a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                }}>V</div>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(201,149,42,0.2)',
                  borderRadius: 14, borderBottomLeftRadius: 4,
                  padding: '12px 16px',
                  display: 'flex', gap: 5, alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {[0,1,2].map(d => (
                    <span key={d} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#c9952a',
                      animation: `bounce 1s ease-in-out ${d * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggestion chips ── */}
          {suggestions.length > 0 && !loading && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(255,250,240,0.95)',
              backdropFilter: 'blur(8px)',
              overflowX: 'auto', display: 'flex', gap: 6, flexWrap: 'nowrap',
              borderTop: '1px solid rgba(201,149,42,0.15)',
            }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  whiteSpace: 'nowrap', padding: '6px 13px', borderRadius: 999,
                  border: '1px solid rgba(201,149,42,0.4)',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#7a5000', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  flexShrink: 0, transition: 'background 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fdf5e0'; e.currentTarget.style.borderColor = '#c9952a' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(201,149,42,0.4)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* ── Input bar ── */}
          <div style={{
            padding: '12px 14px', display: 'flex', gap: 8,
            background: '#fff',
            borderTop: '1px solid rgba(201,149,42,0.12)',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask VeilFi AI..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '1px solid #e8e8e8', fontSize: 13, outline: 'none',
                background: '#f9f9f9', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#c9952a'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 12, border: 'none',
                background: input.trim() && !loading ? '#0a0a0a' : '#e8e8e8',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, transform 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.transform = 'scale(1.06)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? <Loader size={16} color="#9CA3AF" /> : <Send size={16} color={input.trim() ? '#fff' : '#9CA3AF'} />}
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes veilPulse {
          0%   { box-shadow: 0 0 0 0 rgba(201,149,42,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(201,149,42,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,149,42,0); }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
