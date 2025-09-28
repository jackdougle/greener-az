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
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // draggable position (left/top in px). null = use default bottom-right placement
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

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
    try {
      const reply = await sendMessage(userMsg.text)
      const botMsg: Message = { id: String(Date.now() + 1), role: 'bot', text: reply }
      setMessages((m) => [...m, botMsg])
    } catch (err) {
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
          className="w-32 h-32 md:w-36 md:h-36 rounded-full shadow-2xl bg-white flex items-center justify-center transform hover:scale-105 transition"
          aria-label="Open chatbot"
        >
          <img src="/assets/char.gif" alt="assistant" className="w-28 h-28 md:w-32 md:h-32" />
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 w-80 max-w-full"
          style={pos ? { left: pos.left, top: pos.top } : { right: 24, bottom: 96 }}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
            <div
              className="flex items-center gap-4 p-3 border-b cursor-move"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              title="Drag to move"
            >
              <img src="/assets/char.gif" alt="assistant" className="w-16 h-16 rounded-full" />
              <div className="font-semibold text-lg">Catina (AI)</div>
              <div className="ml-auto text-sm text-slate-500">online</div>
            </div>

            <div className="p-3 flex-1 overflow-auto" data-testid="chat-history">
              {messages.length === 0 && <div className="text-sm text-slate-500">Say hi 👋</div>}
              {messages.map((m) => (
                <div key={m.id} className={`my-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'bot' && <img src="/assets/char.gif" alt="assistant" className="w-14 h-14 rounded-full mr-3" />}
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                      m.role === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-2 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about the map or energy..."
                  className="flex-1 px-3 py-2 rounded border"
                />
                <button onClick={handleSend} className="px-3 py-2 rounded bg-sky-600 text-white">
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
