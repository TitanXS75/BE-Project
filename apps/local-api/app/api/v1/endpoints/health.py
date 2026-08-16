from fastapi import APIRouter
import httpx
from app.config import settings

router = APIRouter()


@router.get("/health", summary="Health check")
async def get_health():
    """Returns basic service health status, storage location, and version."""
    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "data_dir": str(settings.DATA_DIR),
        "subjects_dir": str(settings.SUBJECTS_DIR),
    }


@router.get("/system-status", summary="System and Ollama status check")
async def get_system_status():
    """Checks the status of the local backend and connectivity to the local Ollama daemon."""
    ollama_online = False
    ollama_version = None
    
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/version")
            if resp.status_code == 200:
                ollama_online = True
                ollama_version = resp.json().get("version")
    except Exception:
        ollama_online = False

    return {
        "api_status": "ok",
        "ollama": {
            "connected": ollama_online,
            "url": settings.OLLAMA_BASE_URL,
            "version": ollama_version,
        },
        "storage": {
            "app_data_path": str(settings.DATA_DIR),
            "subjects_count": len(list(settings.SUBJECTS_DIR.iterdir())) if settings.SUBJECTS_DIR.exists() else 0
        }
    }
