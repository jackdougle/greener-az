# Chat proxy (example)

This is a minimal example server that proxies POST `/api/chat` to OpenAI's Chat Completions API.

Usage

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. cd server
3. npm install
4. npm run dev

Example request

POST http://localhost:4000/api/chat
Body: { "message": "Hello" }

Response: { "reply": "..." }

Security note: keep your API key server-side. Do not place it in the frontend.
