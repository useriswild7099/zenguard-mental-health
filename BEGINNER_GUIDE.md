# The "Explain Like I'm 5" Guide to ZenGuard AI

If you are new to coding, this project might look like a lot of confusing files. Don't worry! This guide explains everything using simple analogies.

## 1. What is this app?

Imagine a **digital diary** that reads what you write and tells you, "Hey, it sounds like you're sad. Try this breathing exercise." The special part? It runs **entirely on your computer**. It doesn't send your secrets to the internet.

## 2. The Restaurant Analogy 🍽️

Think of this web app like a restaurant.

### 🎨 The Frontend (The Dining Area & Menu)
*   **What it is:** The part you see and click on. The buttons, the text box, the colors.
*   **Technology:** **React** & **Next.js**.
*   **Your Job Here:** Use the menu to order (write a journal entry).
*   **Files:** `frontend/` folder.

### 👨‍🍳 The Backend (The Kitchen Manager)
*   **What it is:** The brains behind the scenes. It takes your order, checks if it's safe, and decides what to do.
*   **Technology:** **Python** & **FastAPI**.
*   **Your Job Here:** The manager receives the order ticket (your text) and scrubs off your name (Privacy!) before giving it to the Chef.
*   **Files:** `backend/` folder.

### 🤖 The AI (The Master Chef)
*   **What it is:** The deeply intelligent part that understands emotions.
*   **Technology:** **Ollama** running **Gemma 3:4B**.
*   **Your Job Here:** The Chef tastes the ingredients (text) and says "This is 80% Sadness." The Manager then tells the Waiter to bring you "Breathing Exercises."

### 🧊 The Fridge (Database)
*   **What it is:** Where restaurants keep leftovers.
*   **Our App:** **We don't have a fridge!** We buy fresh ingredients, cook the meal, and throw everything away immediately. This is our **Privacy Guarantee**. No leftovers = nothing to steal.

## 3. Communication (The API) 🗣️

How do the Waiter (Frontend) and Kitchen (Backend) talk? They shout specific codes called **API Endpoints**.

*   **POST /analyze:** "Here is a journal entry! Analyze it!"
*   **POST /chat:** "The user said 'Hello'. What should I say back?"
*   **GET /health:** "Are you awake back there?" (Checks if the backend is running).

## 4. Setup Simplified

Why do we need 3 terminal windows?
1.  **Window 1 (Ollama):** Wakes up the Chef (AI Model).
2.  **Window 2 (Backend):** Opens the Kitchen (API Server).
3.  **Window 3 (Frontend):** Unlocks the Front Door (Web Page).

If any of these are closed, the restaurant can't serve food!

## 5. Coding Concepts Dictionary 📖

*   **Localhost:** Your own computer. When we say "It runs on localhost:3000," it means your computer is acting as the web server for itself.
*   **Terminal:** The black box where you type commands. It's like the engine room of a ship.
*   **Bubbling/Scrubbing:** Removing sensitive info (like names) from text. We do this to protect privacy.
*   **Dependency:** Code written by someone else that we use (like a specific wheel for a car). We install these with `npm install` (JS) or `pip install` (Python).

## 6. Where to Start Looking

Ignore the weird files for now. Just look at these:
1.  **frontend/src/app/page.tsx:** The main page file. Change the text here to see it update on the screen!
2.  **backend/routers/sentiment.py:** The logic that decides "If sad, recommend breathing."

You've got this! Start small, break things, and fix them. That's how we all learn. 🚀
