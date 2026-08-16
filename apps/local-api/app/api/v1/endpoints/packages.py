from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import shutil
import aiosqlite
from pathlib import Path
from app.config import settings
from app.rag.packaging.manifest import SubjectManifest
from app.rag.packaging.packager import SubjectPackager
from app.db.connection import init_subject_database
from app.db.repository import SubjectRepository

router = APIRouter()


class CreateSubjectRequest(BaseModel):
    package_id: str
    subject_name: str
    academic_year: str = "2026-2027"
    teacher_name: str = "Faculty / Instructor"
    institution_name: Optional[str] = None
    units: Optional[List[str]] = None


@router.get("/active", summary="List all currently imported subjects")
async def list_active_subjects():
    """Returns list of active subject workspaces discovered in the sandbox."""
    subjects = []
    if settings.SUBJECTS_DIR.exists():
        for subject_dir in settings.SUBJECTS_DIR.iterdir():
            if subject_dir.is_dir():
                manifest_path = subject_dir / "manifest.json"
                if manifest_path.exists():
                    try:
                        with open(manifest_path, "r", encoding="utf-8") as f:
                            manifest_data = SubjectManifest.model_validate_json(f.read())
                            manifest_dict = manifest_data.model_dump()
                            manifest_dict["local_path"] = str(subject_dir)
                            subjects.append(manifest_dict)
                    except Exception:
                        subjects.append({
                            "package_id": subject_dir.name,
                            "subject_name": subject_dir.name.replace("-", " ").title(),
                            "local_path": str(subject_dir)
                        })
    return {"subjects": subjects, "total": len(subjects)}


@router.post("/create", summary="Create a new subject workspace (Teacher Mode)")
async def create_subject_workspace(payload: CreateSubjectRequest):
    """Initializes a new subject workspace with SQLite schema and manifest."""
    subject_dir = settings.SUBJECTS_DIR / payload.package_id
    if subject_dir.exists():
        raise HTTPException(status_code=400, detail="Subject workspace already exists.")

    subject_dir.mkdir(parents=True, exist_ok=True)
    db_path = subject_dir / "subject.db"
    await init_subject_database(db_path)

    # Populate initial units if provided
    async with aiosqlite.connect(db_path) as db:
        repo = SubjectRepository(db)
        if payload.units:
            for idx, unit_title in enumerate(payload.units, 1):
                await repo.create_unit(unit_number=idx, title=unit_title)

    # Create initial manifest.json
    manifest = SubjectManifest(
        package_id=payload.package_id,
        subject_name=payload.subject_name,
        academic_year=payload.academic_year,
        teacher_name=payload.teacher_name,
        institution_name=payload.institution_name
    )
    manifest_path = subject_dir / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest.model_dump_json(indent=2))

    return {
        "status": "created",
        "package_id": payload.package_id,
        "manifest": manifest.model_dump(),
        "path": str(subject_dir)
    }


@router.get("/{package_id}/curriculum", summary="Get curriculum tree (units, chapters, documents)")
async def get_curriculum(package_id: str):
    """Fetches the full curriculum hierarchy from subject.db."""
    subject_dir = settings.SUBJECTS_DIR / package_id
    db_path = subject_dir / "subject.db"

    if not db_path.exists():
        raise HTTPException(status_code=404, detail="Subject database not found.")

    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        repo = SubjectRepository(db)
        units = await repo.list_units()
        chapters = await repo.list_chapters()
        documents = await repo.list_documents()

    # Nest chapters under units
    units_map = {}
    for u in units:
        units_map[u["id"]] = {**u, "chapters": []}

    for ch in chapters:
        if ch["unit_id"] in units_map:
            units_map[ch["unit_id"]]["chapters"].append(ch)

    return {
        "package_id": package_id,
        "units": list(units_map.values()),
        "documents": documents
    }


@router.post("/import", summary="Import a .rssh subject package")
async def import_subject_package(file: UploadFile = File(...)):
    """Unpacks a .rssh zip package into the sandbox subjects folder and registers it."""
    if not (file.filename.endswith(".rssh") or file.filename.endswith(".zip")):
        raise HTTPException(status_code=400, detail="Only .rssh or .zip packages are supported.")

    temp_path = settings.UPLOADS_DIR / file.filename
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        target_dir, manifest = await SubjectPackager.unpack_package(temp_path)
        return {
            "status": "imported",
            "subject": manifest.model_dump(),
            "path": str(target_dir)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to import package: {str(e)}")
    finally:
        if temp_path.exists():
            temp_path.unlink()


@router.post("/export/{package_id}", summary="Export a subject workspace as .rssh package")
async def export_subject_package(package_id: str):
    """Bundles manifest.json, subject.db, and vectors directory into a downloadable .rssh package."""
    try:
        output_file, manifest = await SubjectPackager.compile_package(package_id)
        return {
            "status": "exported",
            "filename": output_file.name,
            "download_path": str(output_file),
            "size_bytes": output_file.stat().st_size,
            "manifest": manifest.model_dump()
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Subject package not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to bundle package: {str(e)}")


@router.delete("/{package_id}", summary="Delete an imported subject workspace")
async def delete_subject_workspace(package_id: str):
    """Deletes the extracted subject directory from local storage."""
    subject_dir = settings.SUBJECTS_DIR / package_id
    if not subject_dir.exists():
        raise HTTPException(status_code=404, detail="Subject package not found.")

    shutil.rmtree(subject_dir)
    return {"status": "deleted", "package_id": package_id}
