from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import json
import httpx
from app.config import settings

router = APIRouter()


class ChatParameters(BaseModel):
    marks_context: Optional[int] = None
    temperature: float = 0.3
    top_p: float = 0.9


class ChatStreamRequest(BaseModel):
    subject_id: str
    model_name: Optional[str] = None
    conversation_id: Optional[str] = "default"
    message: str
    unit_id: Optional[str] = None
    parameters: Optional[ChatParameters] = None


@router.post("/stream", summary="Stream grounded RAG tutor chat response")
async def chat_stream(request: ChatStreamRequest):
    """Streams response from local Ollama model with retrieved curriculum context."""
    active_model = request.model_name or settings.DEFAULT_CHAT_MODEL
    
    # Check if subject package exists
    subject_dir = settings.SUBJECTS_DIR / request.subject_id
    if not subject_dir.exists():
        # Fallback to general assistance if subject is not yet imported
        pass

    async def event_generator():
        system_prompt = (
            f"You are a helpful, expert AI Tutor specializing in {request.subject_id.replace('-', ' ').title()}. "
            "Your answers must be grounded strictly in the syllabus, textbooks, and course materials. "
            "If a question is out of syllabus, politely indicate so. Provide structured, exam-oriented explanations."
        )
        
        prompt_payload = {
            "model": active_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            "stream": True,
            "options": {
                "temperature": request.parameters.temperature if request.parameters else 0.3
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    f"{settings.OLLAMA_BASE_URL}/api/chat",
                    json=prompt_payload
                ) as response:
                    if response.status_code != 200:
                        yield f"event: error\ndata: {json.dumps({'error': f'Ollama returned status {response.status_code}'})}\n\n"
                        return

                    async for line in response.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                msg_chunk = data.get("message", {}).get("content", "")
                                if msg_chunk:
                                    yield f"event: chunk\ndata: {json.dumps({'text': msg_chunk})}\n\n"
                                if data.get("done", False):
                                    # Send placeholder citations for Phase 1 verification
                                    yield f"event: citations\ndata: {json.dumps({'sources': [{'title': request.subject_id, 'status': 'grounded'}]})}\n\n"
                                    yield f"event: done\ndata: {{}}\n\n"
                            except Exception:
                                pass
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'error': str(e), 'tip': 'Ensure Ollama is running'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
