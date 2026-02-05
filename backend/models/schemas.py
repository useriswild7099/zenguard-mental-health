"""
Pydantic Models/Schemas for API Request/Response
All models are designed for stateless, privacy-first processing
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum


class EmotionType(str, Enum):
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    NEUTRAL = "neutral"
    ANXIETY = "anxiety"
    HOPE = "hope"


class InterventionType(str, Enum):
    BREATHING = "breathing"
    GROUNDING = "grounding"
    MEMORY_BOX = "memory_box"
    AFFIRMATION = "affirmation"
    MUSIC = "music"
    JOURNALING = "journaling"


class Emotion(BaseModel):
    """Single emotion with intensity"""
    type: EmotionType
    intensity: float = Field(ge=0, le=1, description="Emotion intensity from 0 to 1")
    
    
class MaskingIndicator(BaseModel):
    """Emotional masking detection result"""
    detected: bool = False
    confidence: float = Field(default=0, ge=0, le=1)
    surface_emotion: Optional[EmotionType] = None
    underlying_emotion: Optional[EmotionType] = None
    indicators: List[str] = []


class Intervention(BaseModel):
    """Recommended self-care intervention"""
    type: InterventionType
    title: str
    description: str
    priority: int = Field(ge=1, le=5, description="1 = highest priority")


class AnalysisRequest(BaseModel):
    """
    Request for sentiment analysis
    Note: Text should be pre-obfuscated on client side
    """
    text: str = Field(
        min_length=1,
        max_length=10000,
        description="Journal entry text (should be obfuscated)"
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Anonymous session ID for trend tracking within session only"
    )


class AnalysisResponse(BaseModel):
    """Full sentiment analysis response"""
    # Wellness Score (inverted risk - higher is better)
    wellness_score: float = Field(ge=0, le=100, description="Overall wellness 0-100")
    confidence: float = Field(ge=0, le=1, description="Analysis confidence")
    
    # Emotional Analysis
    primary_emotion: Emotion
    secondary_emotions: List[Emotion] = []
    emotional_intensity: float = Field(ge=0, le=1)
    
    # Pattern Detection
    masking: MaskingIndicator
    repetition_detected: bool = False
    emotional_shift: Optional[str] = None  # "improving", "declining", "stable"
    
    # Mood Visualization Data
    mood_seed_stage: str = Field(
        description="Plant growth stage: withered, seedling, growing, blooming, flourishing"
    )
    mood_color: str = Field(description="Hex color for mood visualization")
    
    # Interventions
    recommended_interventions: List[Intervention] = []
    supportive_message: str
    
    # Privacy Confirmation
    data_stored: bool = False  # Always False


class QuickCheckRequest(BaseModel):
    """Lightweight request for real-time feedback while typing"""
    text: str = Field(min_length=1, max_length=2000)


class QuickCheckResponse(BaseModel):
    """Lightweight response for real-time feedback"""
    emotional_tone: str  # "positive", "neutral", "concerning"
    intensity: float = Field(ge=0, le=1)
    suggestion: Optional[str] = None
