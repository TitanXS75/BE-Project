---
name: ollama-fastapi-backend
description: FastAPI asynchronous backend patterns, Ollama local model integration, SSE streaming, 4-bit quantization, and multi-agent pedagogical orchestration.
---

# FastAPI & Ollama Local Backend Standards

## When to Use This Skill
Load this skill ONLY when working on `apps/local-api`, API endpoints, Ollama streaming, agent state machine controllers, or prompt templates.

---

## 1. Async Streaming with Server-Sent Events (SSE)
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import httpx
import json

app = FastAPI(title="Axiom Local API")

async def generate_ollama_stream(prompt: str, model: str = "qwen2.5-coder:7b"):
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            "http://127.0.0.1:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": True}
        ) as response:
            async for chunk in response.aiter_lines():
                if chunk:
                    data = json.loads(chunk)
                    yield f"data: {json.dumps({'token': data.get('response', ''), 'done': data.get('done', False)})}\n\n"

@app.post("/student/chat/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        generate_ollama_stream(request.prompt, request.model),
        media_type="text/event-stream"
    )
```

---

## 2. Multi-Agent Prompt Orchestration
- **Student Socratic Mentor**: Guide with progressive hints rather than providing full direct answers immediately when conceptual confusion is detected.
- **Syllabus Guard**: Compare retrieved citations with user query. If context similarity is `< 0.65`, notify student that the query lies outside prescribed course materials.
- **Teach-Back Feynman Evaluator**: Grade explanations against concept rubrics (Comprehension Score 0–100, Strengths, Missing Nuances, Suggested Analogy).

---

## 3. Hardware Auto-Selection Logic
- **8 GB RAM**: Default to `llama3.2:3b` (4-bit quantization).
- **16 GB RAM / Dedicated GPU**: Default to `qwen2.5-coder:7b` (4-bit quantization).
- **32 GB+ RAM / RTX 4080+**: Support `deepseek-r1:8b` or `qwen2.5-coder:14b`.
