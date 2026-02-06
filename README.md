# ZenGuard AI

A mental health journaling app for students. Uses Gemma 3:4B locally through Ollama to analyze mood from journal entries. Everything runs on your machine - nothing gets sent to the cloud.

## What it does

- Analyzes emotional tone from journal entries using a local LLM
- Scrubs personal info (names, emails, etc.) before processing
- Shows your mood trends with a plant that grows as you journal
- Includes grounding exercises (breathing, 5-4-3-2-1, memory box)
- Lets you doodle your emotions and get feedback

No accounts, no databases, no tracking. Just a local tool for self-reflection.

## Setup

You'll need:
- [Ollama](https://ollama.com) installed
- Node.js 18+
- Python 3.10+

### Get the AI model

```bash
ollama pull gemma3:4b
```

Keep Ollama running in the background while using the app.

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

## How it works

```
Browser (Next.js)  →  API (FastAPI)  →  Ollama (Gemma 3:4B)
     ↓                     ↓                    ↓
 scrubs PII          analyzes mood         runs locally
 shows UI            scores risk           no internet needed
```

## Privacy

- PII gets stripped on the client before anything leaves the browser
- No database - nothing persists after you close the tab
- Session IDs are random, no login required
- Server logs are disabled

## Project layout

```
backend/
  main.py                 - FastAPI app
  routers/                - API routes (sentiment, chat)
  services/               - Gemma client, risk scoring, interventions
  privacy/                - Text scrubbing

frontend/
  src/app/                - Next.js pages
  src/components/         - UI components
  src/lib/                - API client, privacy utils
```

## Stack

- Gemma 3:4B via Ollama (runs locally, free)
- FastAPI + Python
- Next.js + React + Tailwind

## License

MIT
