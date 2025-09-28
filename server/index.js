#!/usr/bin/env node
/* Minimal Express server to proxy chat requests to OpenAI (or other LLM provider).
   - Expects OPENAI_API_KEY in environment
   - POST /api/chat { message: string } -> { reply: string }
   - Simple error handling and CORS for local dev
*/

import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.warn('WARNING: OPENAI_API_KEY not set. The /api/chat endpoint will fail without it.')
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'missing message' })
  }

  try {
    // Proxy to OpenAI Chat Completions
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are Catalin, a friendly map assistant.' },
          { role: 'user', content: message },
        ],
        max_tokens: 300,
      }),
    })

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '')
      console.error('OpenAI error', resp.status, txt)
      return res.status(502).json({ error: 'upstream error', details: txt })
    }

    const json = await resp.json()
    const reply = json?.choices?.[0]?.message?.content ?? ''
    return res.json({ reply })
  } catch (err) {
    console.error('Chat proxy error', err)
    return res.status(500).json({ error: 'server error' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Chat proxy listening on http://localhost:${port}`))
