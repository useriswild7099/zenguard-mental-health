# Hackathon Q&A: ZenGuard AI

This document contains anticipated questions from judges and mentors, along with suggested answers.

## 🌟 General & Inspiration

**Q: What inspired you to build ZenGuard AI?**
**A:** We noticed that while there are many mental health apps, most require you to send your deepest, most private thoughts to a cloud server. For students especially, privacy is a huge concern. We wanted to build a tool that offers the benefits of AI analysis (mood tracking, insights) without *ever* compromising user privacy.

**Q: How is this different from ChatGPT or other journaling apps?**
**A:** Two main differences:
1.  **Privacy:** ChatGPT claims training data usage; we guarantee *zero* data leaves your device.
2.  **Specialization:** We aren't just a chatbot. We specifically analyze journal entries for mood trends and offer clinical-based grounding exercises (like 5-4-3-2-1) tailored to the user's current emotional state.

## 🔒 Privacy & Security (The "Secret Sauce")

**Q: You claim "Privacy First," but how do we know our data isn't being leaked?**
**A:**
*   **Architecture:** We use an exclusively local architecture. The LLM (Gemma 3:4B) runs on the user's machine via Ollama. There is no cloud database and no external API calls for the analysis.
*   **PII Scrubbing:** Even before the text reaches the local LLM, we run a scrubbing layer that strips out names, emails, and phone numbers, just in case.
*   **Ephemeral:** We don't use a persistent database. Once you close the tab, the data is gone. It's designed for "in-the-moment" reflection.

**Q: What if I type my social security number or full name?**
**A:** Our PII (Personally Identifiable Information) scrubber detects patterns like SSNs, emails, and phone numbers and replaces them with placeholders (like `[REDACTED]`) before the AI even sees the text.

## 🛠️ Technology & Implementation

**Q: Why did you choose Gemma 3:4B?**
**A:** We needed a model that was:
1.  **Small enough** to run on a standard laptop (4B parameters is very efficient).
2.  **Smart enough** to understand emotional nuance.
Gemma 3 struck the perfect balance between performance and resource usage compared to larger models like Llama 3 8B.

**Q: Why no database? How do I see my history?**
**A:** For this hackathon version, we prioritized *absolute privacy* and simplicity. "No database" means "no liability" and "no data leaks." In a future version, we would implement an encrypted local-only storage (like SQLite with encryption) so users can save their history without it leaving their device.

**Q: What was the biggest technical challenge?**
**A:** Getting the frontend, backend, and Ollama to communicate seamlessly while handling timeouts was tricky. Local models can be slow on some hardware, so handling asynchronous requests and showing proper loading states in the UI was critical for a good user experience.

## 🚀 Future & Scalability

**Q: How would you monetize this?**
**A:**
1.  **Premium Local Features:** Advanced analytics or specialized therapy modules.
2.  **Enterprise/School Licensing:** Schools could deploy this on their own hardware for students without worrying about data compliance (GDPR/FERPA) because data never leaves the student's device.

**Q: What's next for ZenGuard?**
**A:**
*   **Encrypted Sync:** allowing users to sync data between devices using end-to-end encryption (so we still can't see it).
*   **Voice Capability:** Adding local whisper models for voice journaling.
*   **Emergency Interventions:** Better detection of crisis keywords to provide immediate helpline resources (strictly local detection).
