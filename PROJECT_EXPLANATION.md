# Project Technical Deep Dive: ZenGuard AI

This document provides a comprehensive technical overview of ZenGuard AI. It explains the architecture, API endpoints, data flow, and specific technologies used, enabling any team member to understand "how it works" under the hood.

## 1. High-Level Architecture

ZenGuard AI operates as a **Local-First Web Application**. Unlike traditional web apps, the "server" and the "AI" both live on the user's physical machine, ensuring zero data leakage.

```mermaid
graph TD
    subgraph "User's Machine (Localhost)"
        Browser[Browser (Frontend)] <-->|JSON / HTTP| API[FastAPI Backend]
        
        subgraph "Backend Logic"
            API --> Privacy[Privacy Layer (Scrubbing)]
            Privacy --> Logic[Business Logic & Risk Scoring]
            Logic <-->|Local Network Call| Ollama[Ollama Service]
            
            subgraph "AI Models"
                Ollama --> Gemma[Gemma 3:4B Model]
            end
        end
    end
```

## 2. Technology Stack

### Frontend (User Interface)
*   **Next.js 14+ (App Router):** The React framework used for structure and routing.
*   **Tailwind CSS:** For styling (e.g., `bg-purple-50`, `text-zinc-300`).
*   **Lucide React:** Icon library (e.g., `<Shield />`, `<Brain />`).
*   **TypeScript:** Ensures type safety across the frontend code.
*   **Fetch API:** Native web API used to communicate with the backend (in `src/lib/api.ts`).

### Backend (API & Logic)
*   **FastAPI:** A modern, high-performance web framework for building APIs with Python.
*   **Pydantic:** Data validation library. It ensures the data sent from the frontend matches what the backend expects (e.g., `AnalysisRequest` schema).
*   **Uvicorn:** The ASGI web server that runs the FastAPI app.
*   **Python-Multipart:** Required for handling file uploads (used in the "Mood Doodle" feature).

### AI Layer
*   **Ollama:** A tool that allows us to run open-source LLMs locally.
*   **Gemma 3:4B:** The specific Google model we use. It's lightweight (runs on most laptops) but capable of understanding emotion.

## 3. Key API Endpoints & Data Flow

Here is a breakdown of exactly what happens when you use the app.

### A. Journal Analysis (`POST /api/analyze`)
**Trigger:** User clicks "Analyze" on a journal entry.

1.  **Frontend (`api.ts`):** Sends JSON: `{ "text": "I feel sad...", "session_id": "xyz" }`
2.  **Backend (`routers/sentiment.py`):**
    *   **Step 1 (Privacy):** Passes text to `TextObfuscator`. "Call me at 555-0199" -> "Call me at [PHONE_REDACTED]".
    *   **Step 2 (AI):** Sends sanitized text to Ollama with a prompt to extract emotions.
    *   **Step 3 (Logic):** `RiskScorer` calculates a "wellness score" (0-100) based on the AI's output + rule-based checks (e.g., repetition).
    *   **Step 4 (Intervention):** If score is low, `InterventionEngine` selects an exercise (e.g., Breathing).
3.  **Response:** Returns JSON with `wellness_score`, `primary_emotion`, `mood_color`, and `recommended_interventions`.

### B. Quick Check (`POST /api/quick-check`)
**Trigger:** Runs automatically while the user is typing (debounced).

*   **Logic:** This does **NOT** call the AI (to save battery/resources).
*   **Mechanism:** It uses a simple Python dictionary of positive/negative words to give instant feedback (e.g., "Positive tone", "Concerning tone").
*   **Purpose:** Provides immediate UI responsiveness without the latency of a full LLM call.

### C. AI Chat (`POST /api/chat`)
**Trigger:** User messages the "Compassionate Friend" or "Academic Coach".

1.  **Backend (`routers/chat.py`):**
    *   **Context:** It constructs a prompt containing the last 10 messages of the conversation.
    *   **System Prompt:** Depending on the mode (e.g., `ChatMode.ACADEMIC_COACH`), it injects a specific personality instruction (e.g., "You are a supportive academic coach...").
    *   **Ollama generation:** Generates the next response.
2.  **Privacy:** No chat history is saved to a database. The client sends the history with each request, and the server forgets it immediately after responding.

## 4. Key Code Files to Know

| File | Purpose |
| :--- | :--- |
| `backend/main.py` | The "Front Door" of the API. Sets up CORS and includes routers. |
| `backend/routers/sentiment.py` | The brain. Orchestrates scrubbing, AI calls, and scoring. |
| `backend/services/ollama_client.py` | The bridge. Helper class that makes HTTP requests to your local Ollama instance (usually port 11434). |
| `frontend/src/lib/api.ts` | The messenger. Contains all the functions (`analyzeEntry`, `sendMessage`) that call the backend. |
| `frontend/src/app/page.tsx` | The UI controller. Manages state like `sessionId`, `journalText`, and which view is active. |

## 5. "Secret Sauce" Mechanisms

*   **Mood Seed:** The growing plant UI isn't just an image; it's a visualization of your `wellness_score`. A higher score = healthier plant stage.
*   **PII Scrubbing:** We use Regex (Regular Expressions) in `privacy/text_obfuscator.py` to identify patterns like emails or phone numbers and replace them before the AI ever sees them. This is our primary privacy guarantee.
