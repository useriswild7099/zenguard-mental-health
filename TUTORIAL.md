# Team Tutorial: ZenGuard AI

Welcome to the ZenGuard AI team! This document serves as a comprehensive guide to understanding, running, and contributing to the project.

## 1. Project Context

**ZenGuard AI** is a privacy-first mental health journaling application designed for students. It uses a local Large Language Model (LLM) to analyze mood and provide grounding exercises.

**Core Philosophy:**
*   **Privacy First:** No data leaves the user's machine. All processing is local.
*   **No Persistence:** We do not use a database. Sessions are ephemeral.
*   **Local AI:** We leverage Ollama to run Gemma 3:4B locally.

## 2. Tech Stack

*   **Frontend:** Next.js (React), Tailwind CSS
*   **Backend:** FastAPI (Python)
*   **AI Engine:** Ollama (running Gemma 3:4B)

## 3. Architecture Overview

The application follows a simple client-server architecture, with the "server" also running locally on the user's machine.

```mermaid
graph LR
    User[User's Browser] -- REST API --> Backend[FastAPI Server]
    Backend -- Local Network --> Ollama[Ollama (Gemma 3:4B)]
    
    subgraph Privacy Layer
    User -- PII Scrubbing --> Backend
    end
```

1.  **Frontend (Next.js):** Handles the UI, captures journal entries, and performs initial PII (Personal Identifiable Information) scrubbing.
2.  **Backend (FastAPI):** Receives sanitized text, manages the mood analysis logic, and communicates with Ollama.
3.  **Ollama:** Hosts the AI model and generates responses/analysis.

## 4. Getting Started

### Prerequisites
Ensure you have the following installed:
*   [Ollama](https://ollama.com)
*   Node.js (v18+)
*   Python (v3.10+)

### Step 1: Initialize the AI Model
We use `gemma3:4b` for its balance of speed and capability.
```bash
ollama pull gemma3:4b
```
*Keep Ollama running in the background.*

### Step 2: Set up the Backend
Navigate to the `backend` folder:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
This starts the API server at `http://localhost:8000`.

### Step 3: Set up the Frontend
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
This starts the UI at `http://localhost:3000`.

## 5. Directory Structure Guide

### `/backend`
*   `main.py`: The entry point for the FastAPI application.
*   `routers/`: Contains API endpoints (e.g., sentiment analysis, chat).
*   `services/`: Business logic.
    *   `llm_client.py`: Handles communication with Ollama.
    *   `risk_scoring.py`: Logic for detecting crisis keywords.
*   `privacy/`: Scrubbing utilities to ensure no sensitive data is processed.

### `/frontend`
*   `src/app/`: Next.js App Router pages.
*   `src/components/`: Reusable UI components.
*   `src/lib/`: Utility functions, including API clients and frontend-side privacy helpers.

## 6. Development Workflow

1.  **Always keep Ollama running.** The app will fail if it can't connect to the local model.
2.  **Privacy Checks:** When modifying the backend, ensure you are strictly adhering to the "no persistence" rule. Do not add database connections or file logging that saves user input.
3.  **Testing:** Since we don't have a database, testing often involves running the app and manually verifying the journal flow.

## 7. Troubleshooting

*   **"Model not found"**: Run `ollama list` to verify `gemma3:4b` is installed.
*   **Connection Refused**: Ensure the backend isn't blocked by a firewall and is running on port 8000.
