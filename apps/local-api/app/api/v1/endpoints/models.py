from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
import json
import time
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.config import settings

router = APIRouter()


class ModelPullRequest(BaseModel):
    model: str
    insecure: bool = False


class ModelDeleteRequest(BaseModel):
    model: str


class ValidateCloudKeyRequest(BaseModel):
    provider: str  # "gemini", "openai", "anthropic", "groq", "deepseek"
    api_key: str
    model: Optional[str] = None


@router.post("/validate-cloud-key", summary="Validate AI cloud model API key")
async def validate_cloud_key(payload: ValidateCloudKeyRequest):
    """Validates the cloud API key against the specified provider's endpoint."""
    key = payload.api_key.strip()
    provider = payload.provider.lower().strip()
    
    if not key or len(key) < 6:
        return {
            "valid": False,
            "provider": provider,
            "error": "API key is too short or empty."
        }

    start_time = time.time()
    try:
        if provider == "gemini":
            test_model = payload.model or "gemini-2.0-flash"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{test_model}:generateContent?key={key}"
            req_body = {
                "contents": [{"parts": [{"text": "ping"}]}],
                "generationConfig": {"maxOutputTokens": 5}
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, json=req_body)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "gemini",
                        "model": test_model,
                        "latency_ms": latency_ms,
                        "models_available": [
                            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash (Fastest & Free Tier)"},
                            {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro (Deep Multimodal & Long Context)"},
                            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash (Lightweight)"}
                        ]
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "gemini",
                        "error": f"Gemini API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        elif provider == "openai":
            test_model = payload.model or "gpt-4o-mini"
            url = "https://api.openai.com/v1/models"
            headers = {"Authorization": f"Bearer {key}"}
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url, headers=headers)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "openai",
                        "model": test_model,
                        "latency_ms": latency_ms,
                        "models_available": [
                            {"id": "gpt-4o", "name": "GPT-4o (Flagship Omni Model)"},
                            {"id": "gpt-4o-mini", "name": "GPT-4o Mini (Affordable & Ultra-Fast)"},
                            {"id": "o1-mini", "name": "o1-mini (Advanced Reasoning & Math)"}
                        ]
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "openai",
                        "error": f"OpenAI API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        elif provider == "anthropic":
            test_model = payload.model or "claude-3-5-sonnet-20241022"
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            }
            req_body = {
                "model": test_model,
                "max_tokens": 5,
                "messages": [{"role": "user", "content": "ping"}]
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, headers=headers, json=req_body)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "anthropic",
                        "model": test_model,
                        "latency_ms": latency_ms,
                        "models_available": [
                            {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet (State-of-the-Art)"},
                            {"id": "claude-3-5-haiku-20241022", "name": "Claude 3.5 Haiku (Rapid Generation)"}
                        ]
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "anthropic",
                        "error": f"Anthropic API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        elif provider == "groq":
            test_model = payload.model or "llama-3.3-70b-versatile"
            url = "https://api.groq.com/openai/v1/models"
            headers = {"Authorization": f"Bearer {key}"}
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url, headers=headers)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "groq",
                        "model": test_model,
                        "latency_ms": latency_ms,
                        "models_available": [
                            {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B (Ultra-Low Latency LPU)"},
                            {"id": "mixtral-8x7b-32768", "name": "Mixtral 8x7B (Fast 32k Context)"}
                        ]
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "groq",
                        "error": f"Groq API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        elif provider == "deepseek":
            test_model = payload.model or "deepseek-chat"
            url = "https://api.deepseek.com/models"
            headers = {"Authorization": f"Bearer {key}"}
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url, headers=headers)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "deepseek",
                        "model": test_model,
                        "latency_ms": latency_ms
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "deepseek",
                        "error": f"DeepSeek API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        elif provider == "openrouter":
            test_model = payload.model or "google/gemini-2.0-flash-001"
            url = "https://openrouter.ai/api/v1/auth/key"
            headers = {
                "Authorization": f"Bearer {key}",
                "HTTP-Referer": "http://localhost:7575",
                "X-Title": "Axiom Curriculum Intelligence"
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url, headers=headers)
                latency_ms = int((time.time() - start_time) * 1000)
                if res.status_code == 200:
                    return {
                        "valid": True,
                        "provider": "openrouter",
                        "model": test_model,
                        "latency_ms": latency_ms
                    }
                else:
                    return {
                        "valid": False,
                        "provider": "openrouter",
                        "error": f"OpenRouter API returned HTTP {res.status_code}: {res.text[:150]}"
                    }

        return {
            "valid": False,
            "provider": provider,
            "error": f"Unsupported provider '{provider}'."
        }
    except Exception as e:
        return {
            "valid": False,
            "provider": provider,
            "error": f"Connection error: {str(e)}"
        }


@router.get("/status", summary="Check Ollama daemon status")
async def get_ollama_status():
    """Checks whether Ollama daemon is reachable."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/version")
            if resp.status_code == 200:
                return {"status": "running", "version": resp.json().get("version", "unknown")}
            return {"status": "unavailable", "detail": f"Ollama returned HTTP {resp.status_code}"}
    except Exception as e:
        return {"status": "stopped", "detail": str(e), "tip": "Please install and launch Ollama (ollama serve)"}


@router.get("/local", summary="List locally installed Ollama models")
async def list_local_models():
    """Fetches list of all locally installed models from Ollama."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                return resp.json()
            raise HTTPException(status_code=resp.status_code, detail="Failed to fetch models from Ollama")
    except httpx.ConnectError:
        return {"models": [], "warning": "Ollama daemon is not reachable at " + settings.OLLAMA_BASE_URL}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pull", summary="Pull a model from Ollama with progress stream")
async def pull_model(payload: ModelPullRequest):
    """Streams pull progress from Ollama to the client."""
    async def event_generator():
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream(
                    "POST",
                    f"{settings.OLLAMA_BASE_URL}/api/pull",
                    json={"name": payload.model, "insecure": payload.insecure},
                ) as response:
                    if response.status_code != 200:
                        yield f"data: {json.dumps({'error': f'Failed with status {response.status_code}'})}\n\n"
                        return

                    async for line in response.aiter_lines():
                        if line:
                            yield f"data: {line}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.delete("/delete", summary="Delete a locally installed Ollama model")
async def delete_model(payload: ModelDeleteRequest):
    """Deletes an installed model from local Ollama storage."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.request(
                "DELETE",
                f"{settings.OLLAMA_BASE_URL}/api/delete",
                json={"name": payload.model}
            )
            if resp.status_code == 200:
                return {"status": "deleted", "model": payload.model}
            raise HTTPException(status_code=resp.status_code, detail="Failed to delete model")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

