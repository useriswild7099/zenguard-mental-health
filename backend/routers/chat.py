"""
Chat Router - Conversational AI endpoints
Handles multi-turn conversations with different AI personas
"""

from fastapi import APIRouter, HTTPException
from typing import Optional

from models.schemas import ChatRequest, ChatResponse, ChatMode, ChatMessage
from services.ollama_client import OllamaClient
from privacy.text_obfuscator import TextObfuscator

from services.knowledge_base import kb  # Import Knowledge Base
from prompts import (
    MODE_PROMPTS,
    MODE_INFO,
    HUMAN_REALITY_FILTER,
    COUNSELING_PRINCIPLES
)

router = APIRouter()

# Initialize services
ollama_client = OllamaClient()

# Initialize KB on startup (lazy load)
@router.on_event("startup")
async def startup_event():
    kb.load_data()
text_obfuscator = TextObfuscator()


@router.get("/modes")
async def get_chat_modes():
    """Get available chat modes with their info"""
    return {
        "modes": [
            {
                "id": mode.value,
                "name": info["name"],
                "emoji": info["emoji"],
                "description": info["description"],
                "category": info.get("category", "general"),
                "color": info.get("color", "purple"),
                "image": info.get("image")
            }
            for mode, info in MODE_INFO.items()
        ]
    }


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the AI in the selected mode
    
    Privacy: No conversation data is stored. Processing is ephemeral.
    """
    try:
        # Obfuscate user message for privacy
        obfuscated_message = text_obfuscator.obfuscate(request.message)
        
        # 4. RAG Context Injection (If relevant)
        rag_context = ""
        if len(obfuscated_message.split()) > 5: # Only search for substantive queries
            results = kb.search(obfuscated_message, limit=1)
            if results:
                rag_context = f"\n[COUNSELING MANUAL REFERENCE (Page {results[0]['page']})]:\n{results[0]['content']}\n"
                print(f"📚 RAG Hit: Found reference on Page {results[0]['page']}")

        # 5. Construct System Prompt
        base_prompt = MODE_PROMPTS.get(request.mode, MODE_PROMPTS[ChatMode.COMPASSIONATE_FRIEND])
        
        # Inject RAG context into prompt if found
        if rag_context:
            system_prompt = f"{base_prompt}\n{HUMAN_REALITY_FILTER}\n{rag_context}\n[INSTRUCTION]: Use the manual reference above if helpful, but speak naturally."
        else:
            system_prompt = f"{base_prompt}\n{HUMAN_REALITY_FILTER}"
        
        print(f"🎭 Appending Reality Filter to {request.mode}...")
        
        # Build conversation context from history
        conversation = ""
        for msg in request.history:  # Use full session history (client manages wipe on refresh)
            role = "User" if msg.role == "user" else "Assistant"
            conversation += f"{role}: {msg.content}\n\n"
        
        # Add current message
        conversation += f"User: {obfuscated_message}\n\nAssistant:"
        
        # Generate response
        response = await ollama_client.generate(
            prompt=conversation,
            system_prompt=system_prompt,
            temperature=0.8,  # Increased for more natural variation
            max_tokens=256
        )
        
        return ChatResponse(
            response=response.strip(),
            mode=request.mode,
            data_stored=False
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@router.delete("/chat/clear")
async def clear_chat():
    """
    Clear chat context (client-side only, nothing stored server-side)
    Returns confirmation for UI update
    """
    return {"message": "Chat cleared", "data_stored": False}
