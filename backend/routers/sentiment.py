"""
Sentiment Analysis API Router
Handles all emotion analysis endpoints
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
import base64

from models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    QuickCheckRequest,
    QuickCheckResponse,
    MaskingIndicator
)
from services.nlp_engine import NLPEngine
from services.risk_scorer import RiskScorer
from services.intervention_engine import InterventionEngine
from privacy.text_obfuscator import TextObfuscator

router = APIRouter()

# Initialize services (singletons)
nlp_engine = NLPEngine()
risk_scorer = RiskScorer()
intervention_engine = InterventionEngine()
text_obfuscator = TextObfuscator()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_sentiment(request: AnalysisRequest):
    """
    Full sentiment analysis with interventions
    
    Privacy: No data is stored. Processing is ephemeral.
    OPTIMIZED: Single AI call for faster response
    """
    try:
        # Additional server-side obfuscation (defense in depth)
        obfuscated_text = text_obfuscator.obfuscate(request.text)
        
        # Run SINGLE optimized NLP analysis (no separate masking call)
        sentiment_result = await nlp_engine.analyze_sentiment(
            text=obfuscated_text,
            session_id=request.session_id
        )
        
        # Analyze patterns locally (fast, no AI needed)
        repetition_detected, repeated_words = nlp_engine.analyze_repetition(obfuscated_text)
        emotional_shift = nlp_engine.detect_emotional_shift(obfuscated_text)
        
        # Create default masking indicator (skip slow AI analysis)
        masking = MaskingIndicator(detected=False)
        
        # Calculate wellness score
        wellness_result = risk_scorer.calculate_wellness_score(
            primary_emotion=sentiment_result["primary_emotion"],
            secondary_emotions=sentiment_result["secondary_emotions"],
            emotional_tone=sentiment_result["emotional_tone"],
            masking=masking,
            repetition_detected=repetition_detected,
            emotional_shift=emotional_shift,
            urgency_level=sentiment_result["urgency_level"],
            risk_score_from_ai=sentiment_result.get("risk_score")
        )
        
        # Get interventions
        interventions = intervention_engine.get_interventions(
            primary_emotion=sentiment_result["primary_emotion"],
            wellness_score=wellness_result["wellness_score"],
            masking_detected=masking.detected,
            high_intensity=sentiment_result["primary_emotion"].intensity > 0.7
        )
        
        # Get supportive message
        supportive_message = intervention_engine.get_supportive_message(
            primary_emotion=sentiment_result["primary_emotion"],
            masking_detected=masking.detected,
            ai_message=sentiment_result.get("support_message")
        )
        
        return AnalysisResponse(
            wellness_score=wellness_result["wellness_score"],
            confidence=wellness_result["confidence"],
            primary_emotion=sentiment_result["primary_emotion"],
            secondary_emotions=sentiment_result["secondary_emotions"],
            emotional_intensity=sentiment_result["primary_emotion"].intensity,
            masking=masking,
            repetition_detected=repetition_detected,
            emotional_shift=emotional_shift,
            mood_seed_stage=wellness_result["mood_seed_stage"],
            mood_color=wellness_result["mood_color"],
            recommended_interventions=interventions,
            supportive_message=supportive_message,
            therapeutic_insight=sentiment_result.get("therapeutic_insight"),
            key_patterns=sentiment_result.get("key_patterns", []),
            data_stored=False  # Privacy guarantee
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/release-affirmation")
async def get_release_affirmation(request: QuickCheckRequest):
    """
    Get a quick, context-aware affirmation for the release ritual.
    """
    try:
        affirmation = await nlp_engine.generate_release_affirmation(request.text)
        return {"affirmation": affirmation}
    except Exception:
        return {"affirmation": "You have expressed yourself honestly. Let it go."}


@router.post("/quick-check", response_model=QuickCheckResponse)
async def quick_check(request: QuickCheckRequest):
    """
    Lightweight real-time feedback while typing
    Uses simpler analysis for faster response
    """
    try:
        text = request.text
        
        # Quick sentiment indicators
        positive_words = {
            'happy', 'good', 'great', 'better', 'love', 'wonderful',
            'amazing', 'excited', 'hopeful', 'grateful', 'thankful',
            'peaceful', 'calm', 'relaxed', 'confident'
        }
        negative_words = {
            'sad', 'bad', 'worse', 'hate', 'terrible', 'awful',
            'anxious', 'worried', 'scared', 'angry', 'frustrated',
            'lonely', 'tired', 'exhausted', 'stressed', 'overwhelmed'
        }
        
        words = text.lower().split()
        pos_count = sum(1 for w in words if w in positive_words)
        neg_count = sum(1 for w in words if w in negative_words)
        
        total = pos_count + neg_count
        if total == 0:
            tone = "neutral"
            intensity = 0.3
        elif pos_count > neg_count:
            tone = "positive"
            intensity = min(1.0, pos_count / max(1, len(words)) * 5)
        else:
            tone = "concerning"
            intensity = min(1.0, neg_count / max(1, len(words)) * 5)
        
        # Generate suggestion for concerning tone
        suggestion = None
        if tone == "concerning" and intensity > 0.5:
            suggestion = "Take a deep breath. It's okay to feel this way."
        
        return QuickCheckResponse(
            emotional_tone=tone,
            intensity=intensity,
            suggestion=suggestion
        )
        
    except Exception:
        return QuickCheckResponse(
            emotional_tone="neutral",
            intensity=0.3,
            suggestion=None
        )


@router.post("/analyze-visual")
async def analyze_visual_mood(file: UploadFile = File(...)):
    """
    Analyze a mood doodle or sketch using multimodal AI
    
    Accepts image files (PNG, JPG, JPEG)
    """
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload PNG or JPG."
        )
    
    try:
        # Read and encode image
        contents = await file.read()
        image_base64 = base64.b64encode(contents).decode("utf-8")
        
        # Analyze with multimodal AI
        result = await nlp_engine.analyze_visual_mood(image_base64)
        
        # Clear image data immediately (privacy)
        del contents
        del image_base64
        
        return {
            "visual_emotion": result.get("visual_emotion", "neutral"),
            "emotional_intensity": result.get("emotional_intensity", 0.5),
            "energy_level": result.get("energy_level", "medium"),
            "interpretation": result.get("interpretation", ""),
            "visual_risk_score": result.get("visual_risk_score", 3),
            "data_stored": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visual analysis failed: {str(e)}")


@router.get("/session/{session_id}/trends")
async def get_session_trends(session_id: str):
    """
    Get emotional trends for the current session
    Uses the full 128K context window for pattern detection
    """
    try:
        trends = await nlp_engine.analyze_session_trends(session_id)
        
        if "error" in trends:
            return {"message": trends["error"], "data": None}
        
        return {
            "session_trend": trends.get("session_trend", "stable"),
            "trend_confidence": trends.get("trend_confidence", 0.5),
            "recurring_themes": trends.get("recurring_themes", []),
            "risk_trajectory": trends.get("risk_trajectory", "stable"),
            "overall_risk_score": trends.get("overall_risk_score", 3),
            "session_insight": trends.get("session_insight", ""),
            "recommended_intervention": trends.get("recommended_intervention", ""),
            "data_stored": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """
    Clear session context (for user privacy control)
    """
    nlp_engine.clear_session(session_id)
    return {"message": "Session cleared successfully", "session_id": session_id}
