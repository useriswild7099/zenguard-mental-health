# ZenGuard AI: The Complete Master Guide 🧘‍♂️🛡️

Welcome! If you are feeling overwhelmed or just want to understand **everything** about this project from scratch, start here. This document connects all the dots.

---

## Part 1: The Big Idea 💡

### What are we building?
**ZenGuard AI** is a **private mental health journal**.
Imagine a diary that understands your feelings and gives you advice, but **never tells anyone your secrets**.

### Why does the world need this?
Most AI apps (like ChatGPT) send your data to a server in the cloud. If you write "I'm depressed and my name is Alice," that company has your data.
**The Problem:** People are scared to be honest with AI because of privacy.
**Our Solution:** An AI that lives **entirely on your laptop**. It effectively has "amnesia"—it helps you in the moment, then forgets everything when you close the tab.

---

## Part 2: The Technology (The "Stack") 🛠️

To build this, we used three main tools. Think of them as a team:

1.  **Frontend (The Face):**
    *   **Tool:** Next.js (React)
    *   **Role:** This is what the user sees. The buttons, the text box, the colors.
    *   **Analogy:** The waiter at a restaurant who takes your order.

2.  **Backend (The Brain):**
    *   **Tool:** Python (FastAPI)
    *   **Role:** The logic. It receives the journal entry, cleans it (scrubs your name), and decides what to do.
    *   **Analogy:** The kitchen manager who checks the order ticket.

3.  **Local AI (The Wisdom):**
    *   **Tool:** Ollama (running the 'Gemma' model)
    *   **Role:** The actual intelligence. It reads the text and says "This person feels anxious."
    *   **Analogy:** The wise chef who knows exactly what dish (advice) to cook.

---

## Part 3: How It Works (The Flow) 🌊

1.  **You write:** "I failed my math test today."
2.  **Frontend:** Sends this text to the Backend.
3.  **Backend (Privacy Step):** Checks for names/phones. If you wrote "I failed my math test, call me at 555-0199", it changes it to "I failed my math test, call me at [REDACTED]".
4.  **Backend (AI Step):** Asks the AI: "What emotion is this?"
5.  **AI:** Replies "Sadness (80%) and Anxiety (20%)".
6.  **Backend:** Looks up advice for Anxiety -> Selects "Breathing Exercise".
7.  **Frontend:** Shows you a button: **"Try this Breathing Exercise"**.

---

## Part 4: The Code (Where to Look) 📂

Don't be scared of the number of files. You only need to care about these 4:

### 1. `frontend/src/app/page.tsx`
*   **What it is:** The **Main Page**.
*   **What to do here:** If you want to change the text on the home screen, the colors, or the layout, edit this file.

### 2. `frontend/src/lib/api.ts`
*   **What it is:** The **Messenger**.
*   **What to do here:** This file has functions like `analyzeEntry()`. It's the bridge that sends data from the Frontend to the Backend.

### 3. `backend/main.py`
*   **What it is:** The **Front Door** of the server.
*   **What to do here:** It sets up the server. You rarely need to touch this unless you're adding new big features.

### 4. `backend/routers/sentiment.py`
*   **What it is:** The **Logic Core**.
*   **What to do here:** This is where the magic happens. It receives the text, calls the AI, and calculates the "Wellness Score". If you want to change *how* the AI analyzes text, look here.

---

## Part 5: How to Run It (The Ritual) 🕯️

Because we have 3 parts (Frontend, Backend, AI), we need to start them all.

**Step 1: Start the AI**
Open a terminal and run:
`ollama run gemma3:4b`
*(Leave this running!)*

**Step 2: Start the Backend**
Open a **new** terminal window:
`cd backend`
`uvicorn main:app --reload`
*(Leave this running!)*

**Step 3: Start the Frontend**
Open a **third** terminal window:
`cd frontend`
`npm run dev`

**Step 4: Go to the website**
Open your browser and type: `http://localhost:3000`

---

## Summary for the Hackathon

*   **Project Name:** ZenGuard AI
*   **Tagline:** "Privacy-First Mental Health Companion"
*   **Killer Feature:** Everything runs locally. No data leaves the laptop.
*   **Future Plan:** Add encrypted storage so users can save their history safely.

You are now an expert on ZenGuard AI! 🚀
