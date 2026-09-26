import os
import sys
import shutil
import platform
import subprocess
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, List
import httpx
import psutil
from app.config import settings


def find_ollama_executable() -> Optional[str]:
    """Finds Ollama binary path across PATH and standard OS installation directories."""
    # 1. System PATH
    which_path = shutil.which("ollama")
    if which_path:
        return which_path

    # 2. Windows standard installation locations
    if platform.system() == "Windows":
        local_app_data = os.environ.get("LOCALAPPDATA", "")
        prog_files = os.environ.get("ProgramFiles", "")
        prog_files_x86 = os.environ.get("ProgramFiles(x86)", "")
        user_home = Path.home()

        candidates = [
            Path(local_app_data) / "Programs" / "Ollama" / "ollama.exe",
            Path(prog_files) / "Ollama" / "ollama.exe",
            Path(prog_files_x86) / "Ollama" / "ollama.exe",
            user_home / "AppData" / "Local" / "Programs" / "Ollama" / "ollama.exe",
            Path(r"C:\Program Files\Ollama\ollama.exe"),
            Path(r"C:\Program Files (x86)\Ollama\ollama.exe"),
        ]
        for c in candidates:
            if c.exists() and c.is_file():
                return str(c)

    # 3. macOS / Linux standard locations
    elif platform.system() in ("Darwin", "Linux"):
        candidates = [
            Path("/usr/local/bin/ollama"),
            Path("/usr/bin/ollama"),
            Path("/opt/homebrew/bin/ollama"),
            Path.home() / ".ollama" / "ollama",
        ]
        for c in candidates:
            if c.exists() and c.is_file():
                return str(c)

    return None


def is_ollama_process_in_memory() -> bool:
    """Checks if an Ollama process is actively loaded in the OS process table."""
    try:
        for proc in psutil.process_iter(["name"]):
            name = (proc.info.get("name") or "").lower()
            if "ollama" in name:
                return True
    except Exception:
        pass
    return False


async def inspect_ollama_daemon(timeout_sec: float = 2.5) -> Dict[str, Any]:
    """
    Exhaustively determines:
    1. If Ollama is installed on the local device.
    2. If the background daemon is actively responding on HTTP.
    3. What models are downloaded and available.
    """
    exec_path = find_ollama_executable()
    process_active = is_ollama_process_in_memory()
    is_installed = (exec_path is not None) or process_active
    is_running = False
    version = None
    installed_models: List[str] = []

    # Test HTTP reachability
    try:
        async with httpx.AsyncClient(timeout=timeout_sec) as client:
            ver_resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/version")
            if ver_resp.status_code == 200:
                is_running = True
                version = ver_resp.json().get("version")

            tags_resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if tags_resp.status_code == 200:
                models_data = tags_resp.json().get("models", [])
                installed_models = [m.get("name") for m in models_data if m.get("name")]
    except Exception:
        is_running = False

    # Status classification
    if is_running:
        status = "running"
        message = f"Ollama is running (v{version or 'active'}) with {len(installed_models)} model(s) available."
    elif is_installed or process_active:
        status = "installed_not_running"
        message = "Ollama is installed on your device, but the background service is not running."
    else:
        status = "not_installed"
        message = "Ollama was not detected on this device. Install from ollama.com or use Cloud AI mode."

    return {
        "installed": is_installed or is_running,
        "running": is_running,
        "connected": is_running,
        "status": status,
        "version": version,
        "installed_models": installed_models,
        "models_count": len(installed_models),
        "executable_path": exec_path,
        "url": settings.OLLAMA_BASE_URL,
        "message": message,
    }


async def launch_ollama_daemon() -> Dict[str, Any]:
    """Spawns `ollama serve` in the background and polls for health."""
    current = await inspect_ollama_daemon(timeout_sec=1.0)
    if current["running"]:
        return {
            "status": "already_running",
            "message": current["message"],
            "version": current["version"],
            "installed_models": current["installed_models"],
        }

    exec_path = find_ollama_executable()
    if not exec_path:
        return {
            "status": "not_installed",
            "error": "Ollama executable not found on system. Please download from https://ollama.com",
        }

    try:
        if platform.system() == "Windows":
            # Launch detached quietly without flashing console
            creation_flags = subprocess.CREATE_NO_WINDOW if hasattr(subprocess, "CREATE_NO_WINDOW") else 0x08000000
            subprocess.Popen(
                [exec_path, "serve"],
                creationflags=creation_flags,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                stdin=subprocess.DEVNULL,
                close_fds=True,
            )
        else:
            subprocess.Popen(
                [exec_path, "serve"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                stdin=subprocess.DEVNULL,
                start_new_session=True,
            )

        # Poll for daemon initialization (up to 6 seconds)
        for _ in range(12):
            await asyncio.sleep(0.5)
            check = await inspect_ollama_daemon(timeout_sec=0.8)
            if check["running"]:
                return {
                    "status": "started",
                    "message": "Ollama service started successfully.",
                    "version": check["version"],
                    "installed_models": check["installed_models"],
                }

        return {
            "status": "starting",
            "message": "Ollama process launched. Initializing background service...",
        }
    except Exception as e:
        return {
            "status": "error",
            "error": f"Failed to start Ollama: {str(e)}",
        }
