
import httpx
import asyncio
import json

async def audit_personalities():
    base_url = "http://localhost:8000/api"
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Get modes
        try:
            r = await client.get(f"{base_url}/modes")
            modes = r.json().get("modes", [])
        except Exception as e:
            print(f"Error getting modes: {e}")
            return

        audit_results = []
        # Audit a subset of diverse personalities to be efficient but thorough
        # Selecting one from each category or major group
        selected_modes = [
            "compassionate_friend",
            "academic_coach",
            "mother",
            "father",
            "dalai_lama",
            "elon_mentor",
            "carl_rogers"
        ]
        
        test_scenarios = [
            {"msg": "Hi, how are you?", "desc": "Greeting"},
            {"msg": "I had a really long day and I feel like I'm failing at everything.", "desc": "Distress/Vulnerability"}
        ]

        for mode_id in selected_modes:
            mode_audit = {"mode": mode_id, "interactions": []}
            print(f"Auditing: {mode_id}")
            history = []
            for scenario in test_scenarios:
                try:
                    payload = {
                        "message": scenario["msg"],
                        "mode": mode_id,
                        "history": history
                    }
                    response = await client.post(f"{base_url}/chat", json=payload)
                    data = response.json()
                    reply = data.get("response", "N/A")
                    mode_audit["interactions"].append({
                        "input": scenario["msg"],
                        "output": reply,
                        "scenario": scenario["desc"]
                    })
                    history.append({"role": "user", "content": scenario["msg"]})
                    history.append({"role": "assistant", "content": reply})
                except Exception as e:
                    print(f"Error auditing {mode_id} for {scenario['desc']}: {e}")
            audit_results.append(mode_audit)

        # Generate markdown report
        report = "# AI Personality Audit Report\n\n"
        for result in audit_results:
            report += f"## {result['mode'].replace('_', ' ').title()}\n"
            for interaction in result["interactions"]:
                report += f"**{interaction['scenario']}**\n"
                report += f"*Input:* {interaction['input']}\n"
                report += f"*Output:* {interaction['output']}\n\n"
            report += "---\n\n"
        
        with open("audit_report.md", "w", encoding="utf-8") as f:
            f.write(report)
        print("Audit report generated: audit_report.md")

if __name__ == "__main__":
    asyncio.run(audit_personalities())
