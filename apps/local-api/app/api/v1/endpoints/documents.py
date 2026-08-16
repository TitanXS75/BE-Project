from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pathlib import Path
import shutil
import uuid
from app.config import settings

router = APIRouter()


@router.post("/upload", summary="Upload course document to subject")
async def upload_document(
    subject_id: str = Form(...),
    doc_type: str = Form(...),  # Syllabus, Textbook, Notes, PYQ, Assignment
    unit_id: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """Uploads a PDF/DOCX/TXT file for ingestion into the subject workspace."""
    subject_dir = settings.SUBJECTS_DIR / subject_id
    if not subject_dir.exists():
        subject_dir.mkdir(parents=True, exist_ok=True)
        
    docs_dir = subject_dir / "raw_documents"
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}_{file.filename}"
    target_path = docs_dir / saved_filename
    
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "status": "uploaded",
            "document_id": file_id,
            "filename": file.filename,
            "doc_type": doc_type,
            "unit_id": unit_id,
            "size_bytes": target_path.stat().st_size,
            "path": str(target_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")


@router.get("/{subject_id}/list", summary="List raw documents in a subject")
async def list_documents(subject_id: str):
    """Returns all uploaded raw files for a given subject."""
    subject_dir = settings.SUBJECTS_DIR / subject_id
    docs_dir = subject_dir / "raw_documents"
    
    if not docs_dir.exists():
        return {"documents": [], "total": 0}
        
    documents = []
    for f in docs_dir.iterdir():
        if f.is_file():
            documents.append({
                "filename": f.name,
                "size_bytes": f.stat().st_size,
                "modified_at": f.stat().st_mtime
            })
            
    return {"documents": documents, "total": len(documents)}
