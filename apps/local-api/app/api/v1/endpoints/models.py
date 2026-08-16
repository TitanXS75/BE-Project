from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
import json
from pydantic import BaseModel
from app.config import settings

router = APIRouter()


class ModelPullRequest(BaseModel):
    model: str
    insecure: bool = False


class ModelDeleteRequest(BaseModel):
    model: str


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
