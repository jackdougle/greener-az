import { useCallback } from 'react'

type SendMessageFn = (text: string) => Promise<string>

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

const MOCK_RESPONSES = [
  "Hi — I'm Catina! I can help with the map, county stats, or carbon footprint questions. What would you like to explore today?",
]

function addPersonality(text: string) {
//   // If the backend already included a signature or conversational tone, avoid doubling up.
  const trimmed = text.trim()
//   // Soften overly restrictive system-like responses
//   // e.g. "I can only answer questions about Arizona's ..." -> "I mostly focus on Arizona data, but I can try to help with related questions too."
//   const restrictiveMatch = trimmed.match(/I can only answer(?: questions)?(?: about)?\s*(.*)/i)
//   if (restrictiveMatch) {
//     const topic = restrictiveMatch[1] ? restrictiveMatch[1].replace(/[\.\!]$/, '') : 'this topic'
//     return `I mainly focus on ${topic}, but I can try to help with related questions too — ask away and I'll do my best! 😊`
//   }
//   // If the reply is very short, expand it slightly to be warmer.
//   if (trimmed.length < 40) {
//     return `${trimmed} 😊 If you'd like, I can explain more or show the county on the map.`
//   }

//   // If it already sounds formal (contains 'Sorry' or 'Error'), soften it.
//   if (/sorry|error|failed/i.test(trimmed)) {
//     return `${trimmed} — no worries, we can try again or I can show an alternative.`
//   }

  // Default: lightly personalize the reply.
  return `${trimmed} `
}

export default function useChatbot() {
  const sendMessage: SendMessageFn = useCallback(async (text: string) => {
    const forceMock = (import.meta as any).env?.VITE_CHAT_MOCK === 'true'
    if (forceMock) {
      await sleep(500)
      const raw = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
      return addPersonality(raw)
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
        return addPersonality(txt || MOCK_RESPONSES[0])
      }

      const data = await res.json().catch(() => null)
      // Expecting { reply: string }
      if (!data || typeof data.reply !== 'string') {
        console.warn('chat API returned unexpected payload', data)
        await sleep(300)
        return addPersonality(MOCK_RESPONSES[0])
      }

      return addPersonality(data.reply)
    } catch (err) {
      // Network or CORS error — show friendly fallback and log
      console.error('chat request failed:', err)
      await sleep(400)
      return "Aw, snap — I'm offline right now. Try enabling a chat backend or set VITE_CHAT_MOCK=true to use mock replies. In the meantime, ask me something and I'll do my best! 😊"
    }
  }, [])

  return { sendMessage }
}
