"""Subject Packaging Engine: Compile, Unpack, and Verify .rssh files."""

import json
import zipfile
import shutil
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
from app.config import settings
from app.rag.packaging.manifest import SubjectManifest, PackageStats
from app.rag.vector.lancedb_client import LanceVectorStore
import aiosqlite


class SubjectPackager:
    @staticmethod
    async def compile_package(subject_id: str, output_path: Optional[Path] = None) -> Tuple[Path, SubjectManifest]:
        """Bundles manifest.json, subject.db, and vectors/ directory into a .rssh ZIP archive."""
        subject_dir = settings.SUBJECTS_DIR / subject_id
        if not subject_dir.exists():
            raise FileNotFoundError(f"Subject workspace '{subject_id}' does not exist.")

        manifest_path = subject_dir / "manifest.json"
        db_path = subject_dir / "subject.db"
        vector_dir = subject_dir / "vectors"

        # Read existing manifest or build default
        if manifest_path.exists():
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)
                manifest = SubjectManifest(**manifest_data)
        else:
            manifest = SubjectManifest(
                package_id=subject_id,
                subject_name=subject_id.replace("-", " ").title()
            )

        # Compute dynamic statistics from SQLite and LanceDB
        stats = PackageStats()
        if db_path.exists():
            async with aiosqlite.connect(db_path) as db:
                async with db.execute("SELECT COUNT(*) FROM units") as c:
                    stats.units_count = (await c.fetchone())[0]
                async with db.execute("SELECT COUNT(*) FROM chapters") as c:
                    stats.chapters_count = (await c.fetchone())[0]
                async with db.execute("SELECT COUNT(*) FROM documents") as c:
                    stats.documents_count = (await c.fetchone())[0]
                async with db.execute("SELECT COUNT(*) FROM chunks") as c:
                    stats.chunks_count = (await c.fetchone())[0]
                async with db.execute("SELECT COUNT(*) FROM pyq_questions") as c:
                    stats.pyqs_count = (await c.fetchone())[0]

        if vector_dir.exists():
            try:
                store = LanceVectorStore(vector_dir)
                stats.vectors_count = store.count()
            except Exception:
                stats.vectors_count = 0

        manifest.stats = stats

        # Write updated manifest.json
        with open(manifest_path, "w", encoding="utf-8") as f:
            f.write(manifest.model_dump_json(indent=2))

        # Target output file
        if not output_path:
            output_path = settings.UPLOADS_DIR / f"{subject_id}.rssh"

        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Build ZIP archive
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zip_ref:
            # 1. manifest.json
            zip_ref.write(manifest_path, arcname="manifest.json")

            # 2. subject.db
            if db_path.exists():
                zip_ref.write(db_path, arcname="subject.db")

            # 3. vectors directory
            if vector_dir.exists():
                for f in vector_dir.rglob("*"):
                    if f.is_file():
                        arcname = f"vectors/{f.relative_to(vector_dir).as_posix()}"
                        zip_ref.write(f, arcname=arcname)

        return output_path, manifest

    @staticmethod
    def verify_package(rssh_path: Path) -> Tuple[bool, str, Optional[SubjectManifest]]:
        """Verifies integrity and structure of a .rssh package archive."""
        if not rssh_path.exists():
            return False, "File does not exist.", None

        if not zipfile.is_zipfile(rssh_path):
            return False, "Not a valid ZIP / .rssh package archive.", None

        try:
            with zipfile.ZipFile(rssh_path, "r") as z:
                files = z.namelist()
                if "manifest.json" not in files:
                    return False, "Package is missing manifest.json.", None

                if "subject.db" not in files:
                    return False, "Package is missing subject.db SQLite database.", None

                manifest_raw = z.read("manifest.json").decode("utf-8")
                manifest = SubjectManifest(**json.loads(manifest_raw))

                return True, "Package verified successfully.", manifest
        except Exception as e:
            return False, f"Verification error: {str(e)}", None

    @staticmethod
    async def unpack_package(rssh_path: Path) -> Tuple[Path, SubjectManifest]:
        """Unpacks a verified .rssh package into the local sandbox subjects directory."""
        valid, msg, manifest = SubjectPackager.verify_package(rssh_path)
        if not valid or not manifest:
            raise ValueError(f"Cannot unpack invalid package: {msg}")

        target_dir = settings.SUBJECTS_DIR / manifest.package_id
        target_dir.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(rssh_path, "r") as z:
            z.extractall(target_dir)

        # Register in global app.db
        app_db_path = settings.APP_DB_PATH
        async with aiosqlite.connect(app_db_path) as db:
            await db.execute(
                """INSERT OR REPLACE INTO imported_subjects 
                   (package_id, subject_name, academic_year, version, teacher_name, institution_name, folder_path)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (
                    manifest.package_id,
                    manifest.subject_name,
                    manifest.academic_year,
                    manifest.version,
                    manifest.teacher_name,
                    manifest.institution_name,
                    str(target_dir)
                )
            )
            await db.commit()

        return target_dir, manifest
