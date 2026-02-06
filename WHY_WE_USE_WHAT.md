# Why We Used What We Used 🛠️🤔

This document explains every single technology in our project, what it does, and **why** we chose it.

---

## 1. The Frontend (The User Interface) 🖥️

### **Next.js (React)**
*   **What is it?** A framework for building websites.
*   **What it does:** It lets us build the UI using components (like Lego blocks). Instead of writing HTML for every page, we write reusable code like `<Button />` or `<JournalInput />`.
*   **Why we chose it:**
    *   **Speed:** It's very fast and optimized.
    *   **Popularity:** It's the industry standard, so there are tons of tutorials and help online.
    *   **Routing:** It makes creating new pages (like `/chat`) super easy.

### **Tailwind CSS**
*   **What is it?** A utility-first CSS framework.
*   **What it does:** Instead of writing a separate `.css` file with hundreds of lines, we add classes directly to the HTML.
    *   Example: `class="bg-blue-500 text-white"` makes a blue button.
*   **Why we chose it:**
    *   **Speed:** We can style things *fast* without switching files.
    *   **Design System:** It ensures all our colors and spacing look consistent automatically.

### **Lucide React**
*   **What is it?** An icon library.
*   **What it does:** Provides the icons you see (like the Shield 🛡️, Brain 🧠, etc.).
*   **Why we chose it:** It's lightweight, clean, and works perfectly with React.

---

## 2. The Backend (The Brain) 🧠

### **FastAPI (Python)**
*   **What is it?** A web framework for Python.
*   **What it does:** It creates the **API Endpoints** (the "buttons" the frontend presses to talk to the backend).
*   **Why we chose it:**
    *   **It's Fast:** As the name suggests, it's one of the fastest Python frameworks.
    *   **Automatic Docs:** It automatically creates a documentation page at `/docs` (though we disable it in production for privacy).
    *   **Easy Validation:** It uses Pydantic to make sure the data we receive is correct.

### **Pydantic**
*   **What is it?** A data validation library.
*   **What it does:** Checks if the data sent to the backend is in the right format.
*   **Why we chose it:** It prevents the server from crashing if someone sends "banana" instead of a number for `wellness_score`.

---

## 3. The AI (The Intelligence) 🤖

### **Ollama**
*   **What is it?** A tool to run AI models locally.
*   **What it does:** It downloads and runs the actual AI brain on your computer.
*   **Why we chose it:**
    *   **Privacy:** It runs **offline**. No data leaves your laptop.
    *   **Simplicity:** It's much easier to set up than manual Python scripts for models.

### **Gemma 3:4B**
*   **What is it?** The specific AI model we are using (made by Google).
*   **What it does:** This is the actual "brain" that understands English and emotions.
*   **Why we chose it:**
    *   **Size vs. Smarts:** It's "small" (4 Billion parameters) which means it runs fast on a normal laptop, but it's still smart enough to understand complex emotions. Bigger models (like Llama 70B) would be too slow.

---

## Summary Table

| Tool | Role | Why? |
| :--- | :--- | :--- |
| **Next.js** | Frontend | Best developer experience & performance. |
| **Tailwind** | Styling | Fast, beautiful UI without CSS headaches. |
| **FastAPI** | Backend | High performance Python API. |
| **Ollama** | AI runner | Easy local AI execution. |
| **Gemma 3:4B** | The Model | Perfect balance of speed and intelligence. |

Now you know exactly *why* every piece of the puzzle is there! 🧩
