from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pathlib import Path
import shutil
import uuid
from app.config import settings
from app.rag.ingestion.pipeline import IngestionPipeline

router = APIRouter()


@router.post("/upload", summary="Upload and ingest course document to subject")
async def upload_document(
    subject_id: str = Form(...),
    doc_type: str = Form(...),  # Syllabus, Textbook, Notes, PYQ, Assignment
    unit_id: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """Uploads a PDF/TXT document and runs automated text extraction, semantic chunking, and LanceDB vector indexing."""
    subject_dir = settings.SUBJECTS_DIR / subject_id
    subject_dir.mkdir(parents=True, exist_ok=True)
        
    docs_dir = subject_dir / "raw_documents"
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    file_id = str(uuid.uuid4())[:8]
    saved_filename = f"{file_id}_{file.filename}"
    target_path = docs_dir / saved_filename
    
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Execute Ingestion Pipeline
        pipeline = IngestionPipeline(subject_id=subject_id)
        result = await pipeline.process_document(
            file_path=target_path,
            doc_type=doc_type,
            unit_id=unit_id
        )

        return {
            "status": "ingested",
            "document_id": result["document_id"],
            "filename": file.filename,
            "doc_type": doc_type,
            "unit_id": unit_id,
            "pages_extracted": result["pages_extracted"],
            "chunks_created": result["chunks_created"],
            "vectors_indexed": result["vectors_indexed"],
            "path": str(target_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process and ingest document: {str(e)}")


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
