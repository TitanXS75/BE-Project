"""Manifest schema and validator for .rssh Subject Packages."""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class PackageStats(BaseModel):
    units_count: int = 0
    chapters_count: int = 0
    documents_count: int = 0
    chunks_count: int = 0
    vectors_count: int = 0
    pyqs_count: int = 0


class SubjectManifest(BaseModel):
    package_id: str = Field(..., description="Unique subject identifier (e.g. machine-learning-101)")
    subject_name: str = Field(..., description="Human-readable subject name")
    academic_year: str = Field(default="2026-2027")
    version: str = Field(default="1.0.0")
    teacher_name: str = Field(default="Faculty / Instructor")
    institution_name: Optional[str] = Field(default=None)
    compiled_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    embedding_model: str = Field(default="all-MiniLM-L6-v2")
    embedding_dimension: int = Field(default=384)
    stats: PackageStats = Field(default_factory=PackageStats)
    custom_metadata: Optional[Dict[str, Any]] = None
