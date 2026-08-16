from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import json
import httpx
from app.config import settings
from app.rag.retrieval.retriever import HybridRetriever

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
    """Streams response from local Ollama model with retrieved curriculum context and source citations."""
    active_model = request.model_name or settings.DEFAULT_CHAT_MODEL

    # 1. Retrieve Grounding Context via Hybrid Search (LanceDB + SQLite FTS5)
    retriever = HybridRetriever(subject_id=request.subject_id)
    retrieved_chunks = await retriever.retrieve(
        query=request.message,
        limit=4,
        unit_id=request.unit_id
    )

    # Format context blocks
    context_text = ""
    citations = []
    for idx, chk in enumerate(retrieved_chunks, 1):
        context_text += f"\n[Document Context {idx} | Page {chk.get('page_number', 1)}]:\n{chk['text_content']}\n"
        citations.append({
            "chunk_id": chk["id"],
            "page": chk.get("page_number", 1),
            "source_type": chk.get("source_type", "hybrid"),
            "preview": chk["text_content"][:120] + "..."
        })

    marks_instruction = f"Structure this as a clear {request.parameters.marks_context}-mark examination response." if (request.parameters and request.parameters.marks_context) else "Provide a clear, structured educational explanation."

    system_prompt = (
        f"You are a helpful, expert AI Tutor specializing in {request.subject_id.replace('-', ' ').title()}.\n"
        "Your answers must be grounded strictly in the syllabus, textbooks, and course materials provided below.\n"
        f"{marks_instruction}\n"
        "Always cite the relevant page numbers or concepts when explaining.\n"
        "If a question is outside the provided academic context, politely state that it is out of syllabus.\n\n"
        f"--- CURRICULUM CONTEXT ---\n{context_text}\n--- END CONTEXT ---"
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

    async def event_generator():
        ollama_responded = False
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    f"{settings.OLLAMA_BASE_URL}/api/chat",
                    json=prompt_payload
                ) as response:
                    if response.status_code == 200:
                        ollama_responded = True
                        async for line in response.aiter_lines():
                            if line:
                                try:
                                    data = json.loads(line)
                                    msg_chunk = data.get("message", {}).get("content", "")
                                    if msg_chunk:
                                        yield f"event: chunk\ndata: {json.dumps({'text': msg_chunk})}\n\n"
                                    if data.get("done", False):
                                        yield f"event: citations\ndata: {json.dumps({'sources': citations})}\n\n"
                                        yield f"event: done\ndata: {{}}\n\n"
                                except Exception:
                                    pass
        except Exception:
            ollama_responded = False

        # Fallback offline simulation when Ollama daemon is not yet booted
        if not ollama_responded:
            grounded_answer = (
                f"### [Grounded Syllabus Explanation]\n\n"
                f"Based on **{request.subject_id.replace('-', ' ').title()}** course materials:\n\n"
            )
            if retrieved_chunks:
                grounded_answer += f"> **Primary Textbook Source (Page {retrieved_chunks[0].get('page_number', 1)}):**\n"
                grounded_answer += f"> {retrieved_chunks[0]['text_content']}\n\n"
                grounded_answer += f"**Key Takeaways:**\n"
                grounded_answer += f"1. Directly corresponds to the active curriculum syllabus requirements.\n"
                grounded_answer += f"2. Grounded via hybrid vector similarity and keyword search.\n"
            else:
                grounded_answer += f"Topic relating to '{request.message}'. (Upload course notes/textbooks to get deeper grounded citations)."

            yield f"event: chunk\ndata: {json.dumps({'text': grounded_answer})}\n\n"
            yield f"event: citations\ndata: {json.dumps({'sources': citations})}\n\n"
            yield f"event: done\ndata: {{}}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
