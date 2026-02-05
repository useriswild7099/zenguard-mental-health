"""
Ollama Client - Interface to local Gemma 3:4B model
Handles all communication with the Ollama API
"""

import httpx
import json
from typing import Optional, Dict, Any
from config import settings


class OllamaClient:
    """Async client for Ollama API"""
    
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.timeout = httpx.Timeout(120.0, connect=10.0)  # 2 min for slow hardware
        self.fast_timeout = httpx.Timeout(60.0, connect=5.0)  # 1 min for quick checks
    
    async def health_check(self) -> bool:
        """Check if Ollama is running and model is available"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    models = [m.get("name", "") for m in data.get("models", [])]
                    # Check if our model is available (with or without tag)
                    return any(self.model.split(":")[0] in m for m in models)
                return False
        except Exception:
            return False
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 512,  # Reduced for faster responses
        fast: bool = False
    ) -> str:
        """
        Generate a response from Gemma 3:4B
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system instructions
            temperature: Lower = more focused, higher = more creative
            max_tokens: Maximum response length
            fast: Use faster timeout for quick responses
            
        Returns:
            Generated text response
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        timeout = self.fast_timeout if fast else self.timeout
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                return data.get("message", {}).get("content", "")
        except httpx.TimeoutException:
            raise Exception("Ollama request timed out. Is the model loaded?")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama API error: {e.response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to connect to Ollama: {str(e)}")
    
    async def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2
    ) -> Dict[str, Any]:
        """
        Generate a JSON response from Gemma 3:4B
        Parses the response as JSON, with fallback handling
        """
        # Add JSON instruction to system prompt
        json_system = (system_prompt or "") + """

IMPORTANT: You MUST respond with valid JSON only. No markdown, no explanations, just the JSON object."""
        
        response_text = await self.generate(
            prompt=prompt,
            system_prompt=json_system,
            temperature=temperature
        )
        
        # Clean up response - remove markdown code blocks if present
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\{[^{}]*\}', cleaned, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            # Return empty dict if parsing fails
            return {}
    
    async def generate_multimodal(
        self,
        prompt: str,
        image_base64: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 1024
    ) -> str:
        """
        Generate a response analyzing an image with Gemma 3:4B's vision capabilities
        
        Args:
            prompt: The user prompt
            image_base64: Base64 encoded image data
            system_prompt: Optional system instructions
            temperature: Model temperature
            max_tokens: Maximum response length
            
        Returns:
            Generated text response
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Multimodal message with image
        messages.append({
            "role": "user",
            "content": prompt,
            "images": [image_base64]
        })
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                return data.get("message", {}).get("content", "")
        except httpx.TimeoutException:
            raise Exception("Ollama multimodal request timed out.")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama API error: {e.response.status_code}")
        except Exception as e:
            raise Exception(f"Failed multimodal request: {str(e)}")
