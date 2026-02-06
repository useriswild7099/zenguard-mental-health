import httpx
import asyncio

async def check_modes():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://localhost:8000/api/modes")
            if response.status_code == 200:
                data = response.json()
                modes = data.get("modes", [])
                print(f"Total modes returned by API: {len(modes)}")
                print("Categories present:", set(m.get('category') for m in modes))
            else:
                print(f"Error: Status {response.status_code}")
        except Exception as e:
            print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(check_modes())
