"""
Chat Router - Conversational AI endpoints
Handles multi-turn conversations with different AI personas
"""

from fastapi import APIRouter, HTTPException
from typing import Optional

from models.schemas import ChatRequest, ChatResponse, ChatMode, ChatMessage
from services.ollama_client import OllamaClient
from privacy.text_obfuscator import TextObfuscator

router = APIRouter()

# Initialize services
ollama_client = OllamaClient()
text_obfuscator = TextObfuscator()

# System prompts for each mode
MODE_PROMPTS = {
    ChatMode.COMPASSIONATE_FRIEND: """You are a compassionate, understanding friend who listens without judgment. 
Your responses are warm, empathetic, and supportive. You acknowledge feelings, validate experiences, 
and offer gentle encouragement. You never give medical advice but suggest professional help when appropriate.
Keep responses concise but heartfelt. Use a conversational, caring tone.""",

    ChatMode.ACADEMIC_COACH: """You are an encouraging academic coach who helps students manage stress and succeed.
You provide practical study tips, time management strategies, and motivation for academic challenges.
You're understanding about academic pressure but help students see the bigger picture.
Keep responses focused and actionable. Balance empathy with practical guidance.""",

    ChatMode.MINDFULNESS_GUIDE: """You are a calm, centered mindfulness guide who helps with present-moment awareness.
You offer breathing exercises, grounding techniques, and gentle meditation prompts.
Your responses are peaceful, unhurried, and help create a sense of calm.
Use simple, soothing language. Guide users toward inner peace and self-compassion.""",

    ChatMode.MOTIVATIONAL_COACH: """You are an uplifting motivational coach who inspires action and positive thinking.
You help users recognize their strengths, overcome obstacles, and stay focused on their goals.
You're energetic but not overwhelming, optimistic but realistic.
Keep responses encouraging and forward-looking. Help users see their potential."""
}

# Mode display names for frontend
MODE_INFO = {
    ChatMode.COMPASSIONATE_FRIEND: {
        "name": "Compassionate Friend",
        "emoji": "💜",
        "description": "A warm, understanding listener who offers emotional support"
    },
    ChatMode.ACADEMIC_COACH: {
        "name": "Academic Coach",
        "emoji": "📚",
        "description": "Helps with study stress, time management, and academic goals"
    },
    ChatMode.MINDFULNESS_GUIDE: {
        "name": "Mindfulness Guide",
        "emoji": "🧘",
        "description": "Guides you through breathing exercises and present-moment awareness"
    },
    ChatMode.MOTIVATIONAL_COACH: {
        "name": "Motivational Coach",
        "emoji": "🚀",
        "description": "Inspires action and helps you see your potential"
    }
}


@router.get("/modes")
async def get_chat_modes():
    """Get available chat modes with their info"""
    return {
        "modes": [
            {
                "id": mode.value,
                "name": info["name"],
                "emoji": info["emoji"],
                "description": info["description"]
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
        
        # Get system prompt for selected mode
        system_prompt = MODE_PROMPTS.get(
            request.mode, 
            MODE_PROMPTS[ChatMode.COMPASSIONATE_FRIEND]
        )
        
        # Build conversation context from history
        conversation = ""
        for msg in request.history[-10:]:  # Keep last 10 messages for context
            role = "User" if msg.role == "user" else "Assistant"
            conversation += f"{role}: {msg.content}\n\n"
        
        # Add current message
        conversation += f"User: {obfuscated_message}\n\nAssistant:"
        
        # Generate response
        response = await ollama_client.generate(
            prompt=conversation,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=512
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
