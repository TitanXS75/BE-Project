from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    models,
    packages,
    documents,
    chat,
    teacher,
    student
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health & Status"])
api_router.include_router(models.router, prefix="/models", tags=["Ollama Model Manager"])
api_router.include_router(packages.router, prefix="/packages", tags=["Subject Packages (.rssh)"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document Management"])
api_router.include_router(chat.router, prefix="/chat", tags=["Grounded RAG Chat"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["Teacher Tools"])
api_router.include_router(student.router, prefix="/student", tags=["Student Tools"])
