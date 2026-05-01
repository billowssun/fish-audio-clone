# Project Context

## Build & Verification
- `npm run dev` — Start development server
- `npm run build` — Production build (`vite build`)
- `npm run lint` — ESLint check
- `npm run preview` — Preview production build

## Environment Variables
Copy `.env.example` to `.env.local` and fill in:
- `FISH_AUDIO_API_KEY` — Fish Audio API key
- `GROQ_API_KEY` — Groq API key (for Whisper ASR)
- `ALLOWED_ORIGIN` (optional) — Restrict CORS in production

## Project Structure
```
src/
  components/   — UI components (Header, ErrorBanner, panels, etc.)
  hooks/        — Custom hooks (useLocalVoices, useTTS)
  App.jsx       — Main orchestrator
api/
  aliyun/asr.js — Groq Whisper proxy (edge function)
  fish/v1/tts.js — Fish Audio TTS proxy (edge function)
```
