
import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000"

TEST_CASES = [
    {
        "mode": "best_friend",
        "situations": [
            "I'm failing my chemistry class and I'm scared.",
            "I just went through a breakup and I feel empty.",
            "I don't know what to do with my Saturday night."
        ]
    },
    {
        "mode": "school_teacher",
        "situations": [
            "I'm failing my chemistry class and I'm scared.",
            "I feel like I'm not smart enough for this school.",
            "I'm procrastinating so much on my project."
        ]
    },
    {
        "mode": "mother",
        "situations": [
            "I'm failing my chemistry class and I'm scared.",
            "I'm feeling very lonely in this new city.",
            "I forgot to eat dinner and I'm feeling low."
        ]
    }
]

async def test_variety():
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("\n🔍 STARTING PERSONA VARIETY & SPECIFICITY TEST\n")
        
        for case in TEST_CASES:
            mode = case["mode"]
            print(f"🎭 TESTING MODE: {mode.upper()}")
            print("=" * 40)
            
            responses = []
            for situation in case["situations"]:
                print(f"📝 Situation: {situation}")
                payload = {
                    "message": situation,
                    "mode": mode,
                    "history": []
                }
                try:
                    response = await client.post(f"{BASE_URL}/api/chat", json=payload)
                    if response.status_code == 200:
                        res_text = response.json()["response"]
                        print(f"💬 AI: {res_text[:150]}...")
                        responses.append(res_text)
                    else:
                        print(f"❌ Error: {response.status_code}")
                except Exception as e:
                    print(f"❌ Failed to reach server: {e}")
                print("-" * 20)
            
            # Simple repetition check
            all_text = " ".join(responses).lower()
            if "4-7-8 breathing" in all_text and all_text.count("4-7-8 breathing") > 1:
                print("⚠️ WARNING: AI is repeating the '4-7-8 breathing' suggestion too frequently.")
            
            print("\n")

if __name__ == "__main__":
    asyncio.run(test_variety())
