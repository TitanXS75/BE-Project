# Axiom Architecture & Backend Rules

## 1. Local-First & Air-Gapped Philosophy
- By default, the entire pipeline must operate with zero internet connectivity.
- Cloud model API keys (e.g., Google Gemini) must be strictly optional user-provided fallbacks (BYOK) stored in local state/secure storage.
- Never log, stream, or transmit student chat queries, notes, or teacher curriculum files to external third-party endpoints.

## 2. RAG & Grounding Standards
- Every generative response must be bounded by LanceDB vector search results from the active `.rssh` course container.
- Responses must return exact source citations (`source_doc`, `unit`, `page_number`).
- Out-of-syllabus queries must be gracefully intercepted by the Syllabus Guard agent and guided back to active course objectives.

## 3. High Performance & Low Latency
- Vector lookups must complete in under 50ms.
- LLM inference must use Server-Sent Events (SSE) streaming for real-time word-by-word UI rendering.
- Maintain memory footprints suitable for 8GB and 16GB student laptop environments (prefer 4-bit quantized GGUF weights).
