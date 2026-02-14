"""
ZenGuard AI - Privacy-First Mental Health Sentiment Monitor
FastAPI Backend Entry Point

PRIVACY NOTICE:
- No database connections
- No request body logging
- Stateless processing only
- All analysis is ephemeral
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from routers import sentiment, chat, sia, translate
from config import settings

# Disable request logging for privacy
logging.getLogger("uvicorn.access").disabled = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - check Ollama model availability"""
    # Startup: Check Ollama connection
    from services.ollama_client import OllamaClient
    try:
        client = OllamaClient()
        is_ready = await client.health_check()
        if is_ready:
            print(f"✓ Ollama connected - Model: {client.model}")
        else:
            print(f"⚠ Ollama not available. Please start Ollama with 'ollama run {client.model}'")
    except Exception as e:
        print(f"❌ Failed to connect to Ollama: {str(e)}")
    yield
    # Shutdown: Cleanup
    print("ZenGuard AI shutting down...")


app = FastAPI(
    title="ZenGuard AI",
    description="Privacy-first mental health sentiment monitoring API",
    version="1.0.0",
    lifespan=lifespan,
    # Disable docs in production for privacy
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sentiment.router, prefix="/api", tags=["Sentiment Analysis"])
app.include_router(chat.router, prefix="/api", tags=["AI Chat"])
app.include_router(sia.router, prefix="/api", tags=["Sia Navigator"])
app.include_router(translate.router, prefix="/api", tags=["Multilingual Support"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from services.ollama_client import OllamaClient
    client = OllamaClient()
    ollama_ready = await client.health_check()
    return {
        "status": "healthy",
        "ollama": "connected" if ollama_ready else "disconnected",
        "privacy": "enforced",
        "storage": "none"
    }


@app.get("/")
async def root():
    """Root endpoint with privacy notice"""
    return {
        "name": "ZenGuard AI",
        "version": "1.0.0",
        "privacy": {
            "data_storage": False,
            "logging": False,
            "tracking": False,
            "message": "Your thoughts are safe. Nothing is stored."
        }
    }
