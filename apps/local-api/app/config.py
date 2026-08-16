import os
import sys
from pathlib import Path
from pydantic_settings import BaseSettings


def get_default_data_dir() -> Path:
    """Returns the platform-specific AppData directory for smart-learning."""
    if sys.platform == "win32":
        base = os.environ.get("APPDATA") or str(Path.home() / "AppData" / "Roaming")
        data_dir = Path(base) / "smart-learning"
    elif sys.platform == "darwin":
        data_dir = Path.home() / "Library" / "Application Support" / "smart-learning"
    else:
        data_dir = Path.home() / ".config" / "smart-learning"
    
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


class Settings(BaseSettings):
    APP_NAME: str = "Smart Learning Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # CORS Origins (Next.js, Tauri desktop)
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:7575",
        "http://127.0.0.1:7575",
        "tauri://localhost",
        "http://tauri.localhost",
    ]
    
    # Storage paths
    DATA_DIR: Path = get_default_data_dir()
    
    @property
    def SUBJECTS_DIR(self) -> Path:
        p = self.DATA_DIR / "subjects"
        p.mkdir(parents=True, exist_ok=True)
        return p
        
    @property
    def UPLOADS_DIR(self) -> Path:
        p = self.DATA_DIR / "uploads"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def APP_DB_PATH(self) -> Path:
        return self.DATA_DIR / "app.db"
        
    # Ollama integration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    DEFAULT_EMBEDDING_MODEL: str = "all-minilm"
    DEFAULT_CHAT_MODEL: str = "qwen2.5-coder:7b"


settings = Settings()
