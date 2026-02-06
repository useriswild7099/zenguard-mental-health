
import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000"

# Scenarios to test variety in journaling analysis
JOURNAL_SCENARIOS = [
    {
        "mood": "HAPPY",
        "text": "Today was amazing! I finally finished my big project and the weather was so beautiful. I feel so accomplished and full of energy."
    },
    {
        "mood": "SAD",
        "text": "I've been feeling really down lately. Everything feels gray and I don't Have the energy to do anything. I just want to stay in bed."
    },
    {
        "mood": "ANGRY",
        "text": "I am so frustrated with my group members. They aren't doing any work and it all falls on me. It's so unfair and I'm tired of it!"
    },
    {
        "mood": "ANXIOUS",
        "text": "I have an interview tomorrow and my heart is racing. I keep playing every possible failure in my head. I'm terrified I'll mess up."
    }
]

async def test_journaling_variety():
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("\n📓 STARTING JOURNALING VARIETY & SPECIFICITY TEST\n")
        
        results = []
        for scenario in JOURNAL_SCENARIOS:
            mood = scenario["mood"]
            text = scenario["text"]
            print(f"🌟 TESTING MOOD: {mood}")
            print(f"📝 Entry: {text[:80]}...")
            
            payload = {
                "text": text,
                "session_id": f"test-variety-{mood.lower()}"
            }
            
            try:
                response = await client.post(f"{BASE_URL}/api/analyze", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    results.append({
                        "mood": mood,
                        "emotion": data.get("primary_emotion", {}).get("type"),
                        "support": data.get("supportive_message"),
                        "interventions": [i.get("title") for i in data.get("recommended_interventions", [])]
                    })
                    
                    print(f"✅ Detected Emotion: {data.get('primary_emotion', {}).get('type')}")
                    print(f"💬 Support: {data.get('supportive_message')}")
                    print(f"🛠️ Interventions: {', '.join([i.get('title') for i in data.get('recommended_interventions', [])])}")
                else:
                    print(f"❌ Error: {response.status_code} - {response.text}")
            except Exception as e:
                print(f"❌ Failed to reach server: {e}")
            print("-" * 50)

        # Repetition Check
        print("\n📊 CROSS-SCENARIO ANALYSIS")
        messages = [r["support"] for r in results if r["support"]]
        if len(messages) != len(set(messages)):
             print("⚠️ WARNING: Some supportive messages were identical across different moods.")
        else:
             print("✅ All supportive messages were unique.")

        all_interventions = []
        for r in results:
            all_interventions.extend(r["interventions"])
        
        from collections import Counter
        counts = Counter(all_interventions)
        overused = [interv for interv, count in counts.items() if count > 2]
        if overused:
             print(f"⚠️ WARNING: Some interventions might be overused: {', '.join(overused)}")
        else:
             print("✅ Interventions showed good variety across moods.")

if __name__ == "__main__":
    asyncio.run(test_journaling_variety())
