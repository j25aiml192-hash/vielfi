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
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with VeilFi AI"
      >
        {open
          ? <X size={22} color="#fff" />
          : (
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900, fontSize: 22,
              color: '#fff', letterSpacing: '-0.04em',
              lineHeight: 1, userSelect: 'none',
            }}>V</span>
          )
        }
        {/* Unread dot */}
        {!open && messages.length === 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 10, height: 10,
            borderRadius: '50%', background: '#EF4444', border: '2px solid #fff',
          }} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 9998,
          width: 380, height: 520, borderRadius: 16,
          background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #E5E7EB',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)',
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #c9952a, #e8c05a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(201,149,42,0.4)',
            }}>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900, fontSize: 18,
                color: '#fff', letterSpacing: '-0.04em',
                lineHeight: 1, userSelect: 'none',
              }}>V</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>VeilFi AI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span style={{ color: '#A0AEC0', fontSize: 11 }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <X size={16} color="#A0AEC0" />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
            background: '#F9FAFB',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 13px', borderRadius: 12,
                  fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                  ...(m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#D4AF37,#B8960C)', color: '#fff',
                        borderBottomRightRadius: 4 }
                    : { background: '#fff', color: '#111827', border: '1px solid #E5E7EB',
                        borderBottomLeftRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
                  ),
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, paddingInline: 4 }}>
                  {fmt(m.ts)}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
                  borderBottomLeftRadius: 4, padding: '10px 14px',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0,1,2].map(d => (
                    <span key={d} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#D4AF37',
                      animation: `bounce 1s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {suggestions.length > 0 && !loading && (
            <div style={{
              padding: '6px 12px', background: '#F9FAFB',
              overflowX: 'auto', display: 'flex', gap: 6, flexWrap: 'nowrap',
              borderTop: '1px solid #F3F4F6',
            }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 20,
                  border: '1px solid #D4AF37', background: '#FEFCE8',
                  color: '#92400E', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  flexShrink: 0,
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 12px', display: 'flex', gap: 8, background: '#fff',
            borderTop: '1px solid #E5E7EB',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask VeilFi AI..."
              style={{
                flex: 1, padding: '9px 13px', borderRadius: 10,
                border: '1px solid #E5E7EB', fontSize: 13, outline: 'none',
                background: '#F9FAFB',
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none',
                background: input.trim() && !loading ? 'linear-gradient(135deg,#D4AF37,#B8960C)' : '#E5E7EB',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
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
      `}</style>
    </>
  )
}
