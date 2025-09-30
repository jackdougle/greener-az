import React, { useState, useEffect, useRef } from 'react'

import useChatbot from '../lib/useChatbot'

type Message = {
  id: string
  role: 'user' | 'bot'
  text: string
}

export default function ChatbotWidget() {
  const { sendMessage } = useChatbot()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // draggable position (left/top in px). null = use default bottom-right placement
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, isThinking])

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return
      const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
      const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      const left = clientX - dragOffset.current.x
      const top = clientY - dragOffset.current.y
      // clamp to viewport
      const vw = window.innerWidth
      const vh = window.innerHeight
      const panel = panelRef.current
      const pw = panel ? panel.offsetWidth : 320
      const ph = panel ? panel.offsetHeight : 320
      const clampedLeft = Math.min(Math.max(8, left), vw - pw - 8)
      const clampedTop = Math.min(Math.max(8, top), vh - ph - 8)
      setPos({ left: clampedLeft, top: clampedTop })
    }

    function onUp() {
      dragging.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  function startDrag(e: React.MouseEvent | React.TouchEvent) {
    const clientX = (e as React.TouchEvent).touches ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = (e as React.TouchEvent).touches ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY
    const rect = panelRef.current?.getBoundingClientRect()
    if (rect) {
      dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top }
    }
    dragging.current = true
  }

  // compute default pos when opening if not set
  useEffect(() => {
    if (!open) return
    if (pos !== null) return
    // default place near bottom-right
    const pw = panelRef.current ? panelRef.current.offsetWidth : 320
    const ph = panelRef.current ? panelRef.current.offsetHeight : 360
    const left = window.innerWidth - pw - 24
    const top = window.innerHeight - ph - 120
    setPos({ left: Math.max(8, left), top: Math.max(8, top) })
  }, [open, pos])

  async function handleSend() {
    if (!input.trim()) return
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsThinking(true)
    try {
      const reply = await sendMessage(userMsg.text)
      setIsThinking(false)
      const botMsg: Message = { id: String(Date.now() + 1), role: 'bot', text: reply }
      setMessages((m) => [...m, botMsg])
    } catch (err) {
      setIsThinking(false)
      const errMsg: Message = { id: String(Date.now() + 2), role: 'bot', text: 'Sorry, something went wrong.' }
      setMessages((m) => [...m, errMsg])
    }
  }

  return (
    <div>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((s) => !s)}
          className="w-32 h-32 md:w-36 md:h-36 rounded-full shadow-2xl flex items-center justify-center hover-lift hover-glow transition-smooth border-2 border-pink-200 dark:border-pink-800 fade-in-scale"
          aria-label="Open chatbot" style={{ background: 'var(--cactina-gradient)' }}
        >
          <img src="/assets/char.gif" alt="assistant" className="w-28 h-28 md:w-32 md:h-32" />
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 w-80 max-w-full fade-in-scale"
          style={pos ? { left: pos.left, top: pos.top } : { right: 24, bottom: 96 }}
        >
          <div
            className="rounded-lg shadow-lg overflow-hidden flex flex-col border-2 border-pink-200 dark:border-pink-800 hover-lift transition-smooth" 
            style={{ minHeight: 320, maxHeight: '60vh', background: 'var(--cactina-light-gradient)' }}
          >
            <div
              className="flex items-center gap-4 p-3 border-b border-pink-200 dark:border-pink-800 cursor-move" style={{ background: 'var(--cactina-gradient)' }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              title="Drag to move"
            >
              <img src="/assets/char.gif" alt="assistant" className="w-16 h-16 rounded-full" />
              <div className="font-semibold text-lg">Cactina (AI)</div>
            </div>

            <div className="p-3 flex-1 overflow-auto chat-scrollbar" data-testid="chat-history">
              {messages.length === 0 && <div className="text-sm text-pink-600">Ask about anything related to AZ's climate!</div>}
              {messages.map((m) => (
                <div key={m.id} className={`my-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'bot' && <img src="/assets/char.gif" alt="assistant" className="w-14 h-14 rounded-full mr-3" />}
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                      m.role === 'user' ? 'bg-pink-400 text-white dark:bg-pink-700': 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="my-2 flex justify-start">
                  <div className="px-3 py-2 rounded-lg max-w-[70%] text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                    <div className="typing-bubble">
                      <div className="typing-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-2 border-t border-pink-200 dark:border-pink-800" style={{ background: 'var(--cactina-gradient)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Say hi! 👋"
                  className="flex-1 px-3 py-2 rounded border border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-900 focus:border-pink-400 focus:outline-none"
                />
                <button onClick={handleSend} className="px-3 py-2 rounded bg-pink-500 dark:bg-pink-800 text-white hover:bg-pink-600 hover-scale transition-smooth">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
