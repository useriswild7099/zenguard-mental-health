"""
Local Gemma Client - Direct Interface to Gemma 3:4B model using gpt4all
Handles local model loading and inference from a GGUF file.
"""

from gpt4all import GPT4All
from typing import Optional, Dict, Any, List
import logging
import re
import json
import os

class GemmaClient:
    """Synchronous client for local Gemma model via gpt4all"""
    
    _instance = None
    _model = None
    _load_error = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GemmaClient, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Only initialize once
        if self._model is not None or self._load_error is not None:
            return
            
        # Pointing to the GGUF file on the S: drive
        self.model_path = r"S:\ai models"
        self.model_file = "gemma-3-4b.gguf"
        full_path = os.path.join(self.model_path, self.model_file)
        
        if not os.path.exists(full_path):
            self._load_error = f"Model file not found at {full_path}"
            logging.error(self._load_error)
            return
            
        logging.info(f"Loading Gemma model (GGUF) from {full_path}...")
        
        try:
            self._model = GPT4All(
                model_name=self.model_file,
                model_path=self.model_path,
                allow_download=False,
                device='gpu' if 'cuda' else 'cpu'
            )
            logging.info("Gemma model loaded successfully via gpt4all.")
        except Exception as e:
            self._load_error = f"Failed to load Gemma model: {str(e)}"
            logging.error(self._load_error)
            # Do not raise, allow app to start
            self._model = None

    async def health_check(self) -> bool:
        """Check if model is loaded"""
        return self._model is not None

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 512,
        fast: bool = False
    ) -> str:
        """Generate response from local Gemma"""
        
        if self._model is None:
            return f"AI Service Unavailable: {self._load_error or 'Model not initialized'}"

        try:
            with self._model.chat_session(system_prompt or "You are a helpful assistant."):
                response = self._model.generate(
                    prompt,
                    max_tokens=max_tokens,
                    temp=temperature,
                    top_k=40,
                    top_p=0.9,
                )
                return response.strip()
        except Exception as e:
            logging.error(f"Inference error: {str(e)}")
            return f"Error during inference: {str(e)}"

    async def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2
    ) -> Dict[str, Any]:
        """Generate JSON response from local Gemma"""
        if self._model is None:
            return {"error": "AI Service Unavailable", "details": self._load_error}

        json_system = (system_prompt or "") + "\nIMPORTANT: Respond with valid JSON only."
        
        response_text = await self.generate(
            prompt=prompt,
            system_prompt=json_system,
            temperature=temperature
        )
        
        try:
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(response_text)
        except Exception:
            return {}

    async def generate_multimodal(
        self,
        prompt: str,
        image_base64: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 1024
    ) -> str:
        """Placeholder for multimodal"""
        return "Multimodal analysis not yet implemented for direct gpt4all loading."
