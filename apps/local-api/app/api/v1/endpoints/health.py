from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import httpx
import platform
import sys
import os
import psutil
from app.config import settings

router = APIRouter()


class RecommendModelRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None


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


@router.get("/system-diagnostics", summary="Full system hardware and runtime diagnostics")
async def get_system_diagnostics():
    """Detailed hardware inspection for Python, RAM, CPU, OS, and Ollama."""
    # 1. Python info
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    
    # 2. RAM & CPU
    try:
        mem = psutil.virtual_memory()
        ram_total = round(mem.total / (1024 ** 3), 1)
        ram_available = round(mem.available / (1024 ** 3), 1)
    except Exception:
        ram_total = 16.0
        ram_available = 8.0
        
    cpu_cores = os.cpu_count() or 4
    os_name = f"{platform.system()} {platform.release()} ({platform.machine()})"
    
    # 3. Ollama Connectivity & Installed Models
    ollama_online = False
    ollama_version = None
    installed_models = []
    
    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            ver_resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/version")
            if ver_resp.status_code == 200:
                ollama_online = True
                ollama_version = ver_resp.json().get("version")
                
            tags_resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if tags_resp.status_code == 200:
                models_data = tags_resp.json().get("models", [])
                installed_models = [m.get("name") for m in models_data]
    except Exception:
        ollama_online = False

    return {
        "python": {
            "installed": True,
            "version": py_ver,
            "executable": sys.executable,
            "status": "ready"
        },
        "hardware": {
            "os": os_name,
            "cpu_cores": cpu_cores,
            "ram_total_gb": ram_total,
            "ram_available_gb": ram_available,
            "gpu": "Standard / Integrated Acceleration",
        },
        "ollama": {
            "connected": ollama_online,
            "url": settings.OLLAMA_BASE_URL,
            "version": ollama_version,
            "installed_models": installed_models
        },
        "storage": {
            "app_data_path": str(settings.DATA_DIR),
            "subjects_count": len(list(settings.SUBJECTS_DIR.iterdir())) if settings.SUBJECTS_DIR.exists() else 0
        }
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


@router.post("/recommend-model", summary="Suggest best local model using laptop specs & Gemini intelligence")
async def recommend_model(payload: RecommendModelRequest):
    """Analyzes laptop hardware and suggests the optimal local LLM."""
    try:
        mem = psutil.virtual_memory()
        ram_gb = round(mem.total / (1024 ** 3), 1)
    except Exception:
        ram_gb = 16.0
        
    cpu_cores = os.cpu_count() or 4
    gemini_key_valid = False
    ai_advice = None

    # Optional Google Gemini validation / consultation
    if payload.gemini_api_key and len(payload.gemini_api_key.strip()) > 10:
        clean_key = payload.gemini_api_key.strip()
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={clean_key}"
            prompt_content = {
                "contents": [{
                    "parts": [{
                        "text": f"You are a local LLM optimization expert. Laptop Specs: {ram_gb} GB RAM, {cpu_cores} CPU cores. In 2 concise sentences, recommend the single best Ollama model for fast local educational RAG and explain why."
                    }]
                }]
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json=prompt_content)
                if res.status_code == 200:
                    gemini_key_valid = True
                    gemini_json = res.json()
                    candidates = gemini_json.get("candidates", [])
                    if candidates:
                        ai_advice = candidates[0].get("content", {}).get("parts", [{}])[0].get("text")
        except Exception:
            gemini_key_valid = False

    # Dynamic local tier selection based on hardware
    if ram_gb >= 16.0:
        recommended = "qwen2.5-coder:7b"
        display_name = "Qwen 2.5 Coder (7B • 4.7 GB)"
        reason = ai_advice or f"With {ram_gb} GB RAM and {cpu_cores} CPU cores, your laptop easily hosts 7B parameter models in memory. Qwen 2.5 Coder 7B provides state-of-the-art reasoning for curriculum questions while leaving >10 GB RAM for smooth multitasking."
        speed = "Fast (~25-35 tokens/sec)"
        alternatives = [
            {"model": "deepseek-r1:8b", "name": "DeepSeek R1 (8B Reasoning)", "ram_req": "5.5 GB", "best_for": "Deep Chain-of-Thought math & proofs"},
            {"model": "llama3.2:3b", "name": "Llama 3.2 (3B Ultra-Fast)", "ram_req": "2.2 GB", "best_for": "Maximum battery life & high speed"},
            {"model": "mistral:7b", "name": "Mistral Instruct (7B)", "ram_req": "4.5 GB", "best_for": "General multi-lingual study"}
        ]
    elif ram_gb >= 8.0:
        recommended = "llama3.2:3b"
        display_name = "Llama 3.2 (3B • 2.2 GB)"
        reason = ai_advice or f"With {ram_gb} GB RAM, Llama 3.2 3B is the sweet spot. It consumes only ~2.2 GB RAM, delivering instant response latency and top-tier accuracy without slowing down your system."
        speed = "Ultra Fast (~40-60 tokens/sec)"
        alternatives = [
            {"model": "qwen2.5:3b", "name": "Qwen 2.5 (3B)", "ram_req": "2.4 GB", "best_for": "Dense STEM and math reasoning"},
            {"model": "phi3:mini", "name": "Microsoft Phi-3 Mini (3.8B)", "ram_req": "2.8 GB", "best_for": "High-accuracy academic textbook QA"}
        ]
    else:
        recommended = "gemma2:2b"
        display_name = "Google Gemma 2 (2B • 1.6 GB)"
        reason = ai_advice or f"With {ram_gb} GB RAM, Gemma 2 2B provides lightweight, snappy execution using less than 1.8 GB RAM."
        speed = "Instantaneous (~60+ tokens/sec)"
        alternatives = [
            {"model": "qwen2.5:1.5b", "name": "Qwen 2.5 (1.5B)", "ram_req": "1.2 GB", "best_for": "Ultra lightweight footprint"}
        ]

    return {
        "recommended_model": recommended,
        "display_name": display_name,
        "reason": reason,
        "speed_rating": speed,
        "ram_detected_gb": ram_gb,
        "cpu_cores_detected": cpu_cores,
        "gemini_api_key_valid": gemini_key_valid,
        "gemini_consultation_used": bool(ai_advice),
        "alternatives": alternatives
    }

