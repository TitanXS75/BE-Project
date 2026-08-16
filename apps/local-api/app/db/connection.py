"""SQLite Connection Helper using aiosqlite."""

import aiosqlite
from pathlib import Path
from typing import AsyncGenerator
from app.config import settings
from app.db.schema import SUBJECT_DB_INIT_SQL, APP_DB_INIT_SQL


async def init_app_database() -> None:
    """Initializes the global app.db database in the user's sandbox directory."""
    db_path = settings.APP_DB_PATH
    async with aiosqlite.connect(db_path) as db:
        await db.executescript(APP_DB_INIT_SQL)
        await db.commit()


async def init_subject_database(subject_db_path: Path) -> None:
    """Initializes a new subject.db database with full curriculum schema and FTS5 index."""
    async with aiosqlite.connect(subject_db_path) as db:
        await db.executescript(SUBJECT_DB_INIT_SQL)
        await db.commit()


async def get_subject_db(subject_id: str) -> AsyncGenerator[aiosqlite.Connection, None]:
    """Yields an active SQLite connection to the specific subject database."""
    subject_dir = settings.SUBJECTS_DIR / subject_id
    db_path = subject_dir / "subject.db"
    
    if not db_path.exists():
        subject_dir.mkdir(parents=True, exist_ok=True)
        await init_subject_database(db_path)

    db = await aiosqlite.connect(db_path)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()


async def get_app_db() -> AsyncGenerator[aiosqlite.Connection, None]:
    """Yields an active SQLite connection to the global app.db database."""
    db_path = settings.APP_DB_PATH
    if not db_path.exists():
        await init_app_database()

    db = await aiosqlite.connect(db_path)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()
