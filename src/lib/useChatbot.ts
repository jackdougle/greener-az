import { useCallback } from 'react'

type SendMessageFn = (text: string) => Promise<string>

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

const MOCK_RESPONSES = [
  "Hi — I'm Catina! I can help with the map, county data, or carbon footprint questions.",
  "Looks like there's no chat backend right now. Try asking about county renewable percentages.",
  "I'm running in offline mode — here's a sample reply!"
]

export default function useChatbot() {
  const sendMessage: SendMessageFn = useCallback(async (text: string) => {
    const forceMock = (import.meta as any).env?.VITE_CHAT_MOCK === 'true'
    if (forceMock) {
      await sleep(500)
      return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) {
        // try to read text body for debugging
        const txt = await res.text().catch(() => null)
        console.error('chat API returned non-ok:', res.status, txt)
        // fallback to mock reply rather than throwing so UI stays usable
        await sleep(400)
        return txt || MOCK_RESPONSES[0]
      }

      const data = await res.json().catch(() => null)
      // Expecting { reply: string }
      if (!data || typeof data.reply !== 'string') {
        console.warn('chat API returned unexpected payload', data)
        await sleep(300)
        return MOCK_RESPONSES[0]
      }

      return data.reply
    } catch (err) {
      // Network or CORS error — show friendly fallback and log
      console.error('chat request failed:', err)
      await sleep(400)
      return "Sorry — I'm offline right now. Try enabling a chat backend or set VITE_CHAT_MOCK=true to use mock replies."
    }
  }, [])

  return { sendMessage }
}
