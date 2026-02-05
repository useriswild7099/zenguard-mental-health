# 🧘 ZenGuard AI

**Privacy-first mental health sentiment monitoring for students**

A hackathon project that uses **Gemma 3:4B** running locally via Ollama to analyze emotional tone in journal entries - with zero data storage.

![ZenGuard AI](https://img.shields.io/badge/Privacy-First-green) ![Gemma 3:4B](https://img.shields.io/badge/AI-Gemma%203%3A4B-blue) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688) ![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black)

## ✨ Features

- 🔒 **Privacy-Locked** - Client-side PII scrubbing, no data storage, anonymous sessions
- 🧠 **Silent Sentinel NLP** - Emotional analysis without invasive monitoring
- 🌱 **Mood Visualization** - Plant growth metaphor for wellness scores
- 🫁 **Interventions** - 4-7-8 breathing, 5-4-3-2-1 grounding, Memory Box
- 🎨 **Mood Doodles** - Visual emotion expression and analysis

## 🚀 Quick Start

### Prerequisites
- [Ollama](https://ollama.ai) with `gemma3:4b` model
- Node.js 18+
- Python 3.10+

### 1. Pull Gemma Model
```bash
ollama pull gemma3:4b
```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open App
Navigate to http://localhost:3000

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│   FastAPI       │────▶│   Ollama        │
│   (Port 3000)   │     │   (Port 8000)   │     │   Gemma 3:4B    │
│                 │     │                 │     │                 │
│ • PII Scrubbing │     │ • Sentiment API │     │ • Local LLM     │
│ • Mood Visuals  │     │ • Risk Scoring  │     │ • Zero Cloud    │
│ • Interventions │     │ • No Storage    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🔐 Privacy Guarantees

1. **Client-side PII removal** before any data leaves the browser
2. **Zero database** - No persistence layer
3. **No logging** - Access logging disabled
4. **Anonymous sessions** - Crypto-random IDs, no accounts
5. **Ephemeral analysis** - Data discarded after response

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── routers/sentiment.py # API endpoints
│   ├── services/
│   │   ├── nlp_engine.py    # Gemma integration
│   │   ├── risk_scorer.py   # Wellness scoring
│   │   └── intervention_engine.py
│   └── privacy/             # Text obfuscation
│
└── frontend/
    ├── src/app/             # Next.js pages
    ├── src/components/      # React components
    └── src/lib/             # API client, privacy
```

## 🛠️ Tech Stack

- **AI**: Gemma 3:4B (local, via Ollama)
- **Backend**: FastAPI, Python 3.10+
- **Frontend**: Next.js 16, React, Tailwind CSS
- **Privacy**: Client-side regex PII scrubbing

## 📄 License

MIT License - Use freely, help students.

---

*Built with 💚 for student mental wellness*
