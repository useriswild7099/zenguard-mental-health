from typing import List, Dict, Optional
from pydantic import BaseModel

class BreathingExercise(BaseModel):
    name: str
    description: str
    pattern: Optional[str] = None  # e.g. "4-7-8" or "4-4"
    duration_seconds: int = 120
    category: str

BREATHING_EXERCISES: Dict[str, List[BreathingExercise]] = {
    "Calm & Nervous System Reset": [
        BreathingExercise(name="4-4 Breathing", description="Inhale 4 sec, exhale 4 sec", pattern="4-4", category="Calm"),
        BreathingExercise(name="4-6 Breathing", description="Inhale 4, exhale 6 (excellent for anxiety)", pattern="4-6", category="Calm"),
        BreathingExercise(name="4-7-8 Breathing", description="Inhale 4, hold 7, exhale 8", pattern="4-7-8", category="Calm"),
        BreathingExercise(name="Extended Exhale Breathing", description="Inhale 3, exhale 8", pattern="3-8", category="Calm"),
        BreathingExercise(name="Physiological Sigh", description="2 inhales + 1 long exhale", category="Calm"),
        BreathingExercise(name="Box Breathing", description="4-4-4-4 (Navy SEAL method)", pattern="4-4-4-4", category="Calm"),
        BreathingExercise(name="Triangle Breathing", description="Inhale 4, hold 4, exhale 4", pattern="4-4-4", category="Calm"),
        BreathingExercise(name="5-5 Coherent Breathing", description="Inhale 5, exhale 5", pattern="5-5", category="Calm"),
        BreathingExercise(name="6-6 Heart Rate Breathing", description="Inhale 6, exhale 6", pattern="6-6", category="Calm"),
        BreathingExercise(name="Soft Nose Breathing", description="Slow, quiet nasal breathing for 5 minutes", duration_seconds=300, category="Calm")
    ],
    "Anxiety Relief & Emotional Processing": [
        BreathingExercise(name="Hand-on-heart breathing", description="Breathe while keeping a hand on your heart", category="Anxiety"),
        BreathingExercise(name="Self-hug breathing", description="Arms crossed on chest while breathing", category="Anxiety"),
        BreathingExercise(name="Crying release breathing", description="Inhale nose, sigh through mouth", category="Anxiety"),
        BreathingExercise(name="Name-the-emotion breathing", description="Say emotion mentally on exhale", category="Anxiety"),
        BreathingExercise(name="Grounding breath", description="Inhale 'I am here', exhale 'I am safe'", category="Anxiety"),
        BreathingExercise(name="Counting backward breathing", description="10 to 1 each breath", category="Anxiety"),
        BreathingExercise(name="Butterfly breathing", description="Lightly tap shoulders while breathing", category="Anxiety"),
        BreathingExercise(name="Forgiveness breathing", description="Inhale acceptance, exhale tension", category="Anxiety"),
        BreathingExercise(name="Gratitude breathing", description="Think one good thing each exhale", category="Anxiety"),
        BreathingExercise(name="Shoulder-drop breathing", description="Drop shoulders every exhale", category="Anxiety")
    ],
    "Focus & Study Preparation": [
        BreathingExercise(name="1:2 Breathing Ratio", description="Inhale 4, exhale 8", pattern="4-8", category="Focus"),
        BreathingExercise(name="Nasal-only breathing", description="Nasal-only breathing for 5 minutes", duration_seconds=300, category="Focus"),
        BreathingExercise(name="3-3-3 Focus breathing", description="Inhale 3, hold 3, exhale 3", pattern="3-3-3", category="Focus"),
        BreathingExercise(name="Equal breathing (Sama Vritti)", description="Equal inhale & exhale", category="Focus"),
        BreathingExercise(name="Pencil-tip focus breathing", description="Stare at one point while breathing", category="Focus"),
        BreathingExercise(name="Pre-study alert breathing", description="20 slightly faster nasal breaths", category="Focus"),
        BreathingExercise(name="Spine-straight breathing", description="Sit upright and breathe deep", category="Focus"),
        BreathingExercise(name="Silent breath counting to 20", description="Count your breaths up to 20", category="Focus"),
        BreathingExercise(name="Eye-closed deep diaphragmatic breathing", description="Deep breaths with eyes closed", category="Focus"),
        BreathingExercise(name="5 slow breaths", description="5 slow breaths before opening your book", category="Focus")
    ],
    "Energy & Mood Lifting": [
        BreathingExercise(name="Bellows breathing", description="Fast inhale/exhale nose", category="Energy"),
        BreathingExercise(name="Power inhale + strong mouth exhale", description="Deep inhale, forceful exhale", category="Energy"),
        BreathingExercise(name="Sun breath", description="Raise arms inhale, drop arms exhale", category="Energy"),
        BreathingExercise(name="Standing deep breathing", description="Stand tall and breathe deep", category="Energy"),
        BreathingExercise(name="Marching breathing", description="Walk in place while breathing", category="Energy"),
        BreathingExercise(name="3 quick inhales + 1 long exhale", description="Quick inhales followed by long exhale", category="Energy"),
        BreathingExercise(name="Cold air inhale", description="Breathe near window for fresh air", category="Energy"),
        BreathingExercise(name="Smile breathing", description="Slight smile while breathing", category="Energy"),
        BreathingExercise(name="Morning wake-up breathing", description="10 deep chest expansions", category="Energy"),
        BreathingExercise(name="Lion's breath", description="Inhale nose, exhale mouth tongue out", category="Energy")
    ],
    "Mindfulness & Meditation Style": [
        BreathingExercise(name="Body-scan breathing", description="Move attention from toes to head", category="Mindfulness"),
        BreathingExercise(name="Observe-only breathing", description="Don't control, just watch", category="Mindfulness"),
        BreathingExercise(name="Mantra breathing", description="Inhale 'So', exhale 'Hum'", category="Mindfulness"),
        BreathingExercise(name="Ocean wave breathing", description="Imagine waves with breaths", category="Mindfulness"),
        BreathingExercise(name="Cloud breathing", description="Thoughts pass like clouds", category="Mindfulness"),
        BreathingExercise(name="Candle-flame breathing", description="Imagine steady flame", category="Mindfulness"),
        BreathingExercise(name="Heartbeat breathing", description="Match breath to pulse", category="Mindfulness"),
        BreathingExercise(name="5-senses breathing", description="Notice senses each inhale", category="Mindfulness"),
        BreathingExercise(name="Let-go breathing", description="Imagine tension leaving body", category="Mindfulness"),
        BreathingExercise(name="2-minute silent stillness breathing", description="2 minutes of complete stillness", duration_seconds=120, category="Mindfulness")
    ]
}
