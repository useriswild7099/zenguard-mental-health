# ZenGuard AI 🛡️
> **Privacy-First Mental Health Companion & Sentiment Analytics**

ZenGuard AI is a sophisticated, edge-computing mental health platform designed for students. It leverages the **Gemma 3:4B** large language model running entirely on local hardware via **Ollama** to provide deep emotional insights, personalized companion interactions, and grounding exercises without compromising user privacy.

---

## ✨ Key Features

### 👤 57+ AI Personalities (Elite Realism Stack)
Experience conversations with a diverse range of companions, from **Stoic Philosophers** and **Global Icons** to **Family Archetypes**.
- **Tiered Behavioral Architecture**: Each persona follows a 7-tier hierarchy (Identity, Lexical Fingerprints, Emotional Intensity, Rhythm Variance, Micro-Imperfections, and Question Control).
- **Linguistic Mirroring**: AI adapts its vocabulary and cadence to match the user's emotional state.
- **Privacy-Locked Identity**: Personas are strictly non-clinical and non-judgmental.

### 🧠 Advanced Sentiment Analytics
- **Emotional Masking Detection**: Detects discrepancies between stated feelings and underlying stress patterns.
- **Visual Mood Tracking**: Multimodal analysis of "Mood Doodles" to interpret unspoken emotions.
- **Chain-of-Thought Reasoning**: Uses `<think>` tags to reason through complex emotional patterns before responding.

### 🛡️ Privacy by Design
- **Client-Side Sanitization**: PII (Personally Identifiable Information) is scrubbed locally before analysis.
- **Stateless Processing**: Zero database connections. No conversation history is stored server-side.
- **Zero-Log Policy**: Server logs are disabled to ensure ephemeral, truly private interactions.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **LLM Engine** | Google Gemma 3:4B (Ollama) |
| **Backend** | Python 3.10+, FastAPI |
| **Frontend** | React, Next.js 14, Tailwind CSS |
| **Privacy** | Custom PII Scrubber (Client-side) |
| **Deployment** | Local-First / Self-Hosted |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Ollama**: [Download & Install](https://ollama.com)
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher

### 2. Prepare the AI
```bash
ollama pull gemma3:4b
```

### 3. Installation
Clone the repository and install dependencies for both layers:

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3500` to start your session.

---

## 📂 Project Architecture

```bash
├── backend/
│   ├── models/       # Pydantic data schemas
│   ├── routers/      # API endpoints (Sentiment, Chat)
│   ├── services/     # NLP Engine, Ollama Client
│   ├── tools/        # Verification & Audit utilities
│   └── prompts.py    # Global Persona Architecture
├── frontend/
│   ├── src/app/      # Next.js layouts & pages
│   ├── src/comp/     # React visuals & interaction
│   └── src/lib/      # API & Privacy orchestration
├── research/         # Design docs & research materials
└── PERSONA_REGISTRY.md # Detailed mapping of all 57 personalities
```

---

## 📑 Documentation
For a deep dive into the AI's cognitive design, see:
- [PERSONA_REGISTRY.md](./PERSONA_REGISTRY.md) - Behavioral logic for every companion.
- [RESEARCH](./research/) - Core design principles and feature research.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with focus on student well-being and digital sovereignty.*
