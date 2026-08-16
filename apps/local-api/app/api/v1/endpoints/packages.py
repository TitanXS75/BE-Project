from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import shutil
import zipfile
from pathlib import Path
from app.config import settings

router = APIRouter()


class SubjectPackageManifest(BaseModel):
    package_id: str
    subject_name: str
    academic_year: str
    version: str = "1.0.0"
    teacher_name: str
    institution_name: Optional[str] = None
    compiled_at: Optional[str] = None
    embedding_model: str = "all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    units_count: Optional[int] = 0
    documents_count: Optional[int] = 0


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
                            manifest_data = json.load(f)
                            manifest_data["local_path"] = str(subject_dir)
                            subjects.append(manifest_data)
                    except Exception:
                        subjects.append({
                            "package_id": subject_dir.name,
                            "subject_name": subject_dir.name.replace("-", " ").title(),
                            "local_path": str(subject_dir)
                        })
    return {"subjects": subjects, "total": len(subjects)}


@router.post("/import", summary="Import a .rssh subject package")
async def import_subject_package(file: UploadFile = File(...)):
    """Unpacks a .rssh zip package into the sandbox subjects folder."""
    if not (file.filename.endswith(".rssh") or file.filename.endswith(".zip")):
        raise HTTPException(status_code=400, detail="Only .rssh or .zip packages are supported.")
    
    temp_zip = settings.UPLOADS_DIR / file.filename
    try:
        with open(temp_zip, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        with zipfile.ZipFile(temp_zip, "r") as zip_ref:
            # Read manifest to determine folder name
            if "manifest.json" not in zip_ref.namelist():
                raise HTTPException(status_code=400, detail="Invalid package: manifest.json is missing.")
            
            manifest_content = zip_ref.read("manifest.json").decode("utf-8")
            manifest_data = json.loads(manifest_content)
            subject_folder_name = manifest_data.get("package_id", Path(file.filename).stem)
            
            target_dir = settings.SUBJECTS_DIR / subject_folder_name
            target_dir.mkdir(parents=True, exist_ok=True)
            zip_ref.extractall(target_dir)
            
        return {
            "status": "imported",
            "subject": manifest_data,
            "path": str(target_dir)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract package: {str(e)}")
    finally:
        if temp_zip.exists():
            temp_zip.unlink()


@router.post("/export/{package_id}", summary="Export a subject workspace as .rssh package")
async def export_subject_package(package_id: str):
    """Bundles manifest.json, subject.db, and vectors directory into a .rssh package."""
    subject_dir = settings.SUBJECTS_DIR / package_id
    if not subject_dir.exists():
        raise HTTPException(status_code=404, detail="Subject package not found.")
    
    output_filename = f"{package_id}.rssh"
    output_path = settings.UPLOADS_DIR / output_filename
    
    try:
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zip_ref:
            for file_path in subject_dir.rglob("*"):
                if file_path.is_file():
                    arcname = file_path.relative_to(subject_dir)
                    zip_ref.write(file_path, arcname)
                    
        return {
            "status": "exported",
            "filename": output_filename,
            "download_path": str(output_path),
            "size_bytes": output_path.stat().st_size
        }
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
