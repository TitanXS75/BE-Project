# 📡 API Documentation

This document describes the API endpoint design, local package management, and Ollama integration interfaces for the local backend server.

---

## 📡 Local API Directory Map

All API routes are served by the local backend server at `http://localhost:8000/api/v1`.

### 1. Subject Package Management (`/api/v1/packages`)
Endpoints to import and export the portable **`.rssh`** package files:
* `POST /api/v1/packages/import` - Unpack a `.rssh` file and register the subject workspace locally.
* `POST /api/v1/packages/export` - Bundle the active subject's SQLite database and vector directory into a downloadable `.rssh` package.
* `GET /api/v1/packages/active` - List all currently imported subject workspaces.
* `DELETE /api/v1/packages/{subject_id}` - Delete an imported subject workspace and its database folders from local storage.

### 2. Ollama Local Model Manager (`/api/v1/models`)
Coordinates downloading and executing open-weight AI models locally:
* `GET /api/v1/models/status` - Check if the local Ollama daemon is running and responding.
* `GET /api/v1/models/local` - List all models (Qwen, Gemma, Llama, etc.) currently installed and ready for offline use.
* `POST /api/v1/models/pull` - Trigger Ollama to download a new model. Returns an HTTP stream of download progress (bytes received, percent complete).
* `DELETE /api/v1/models/delete` - Remove a model file to free up local disk space.

### 3. Local Document Management (`/api/v1/documents`)
Used in Teacher Mode to compile subjects:
* `POST /api/v1/documents/upload` - Ingest raw educational materials (Syllabus, Textbooks, Notes, PYQs) to the active subject database.
* `GET /api/v1/documents/{document_id}/status` - Check the progress of text extraction, chunking, and embedding generation.
* `POST /api/v1/documents/process` - Trigger embedding processing manually.

### 4. Grounded AI Tutor Chat (`/api/v1/chat`)
* `POST /api/v1/chat/stream` - Send a query and receive a syllabus-grounded streaming response word-by-word (SSE) from the local Ollama model.
* `GET /api/v1/chat/{conversation_id}/history` - Retrieve chat history for the active subject workspace.

### 5. Teacher Content Tools (`/api/v1/teacher`)
* `POST /api/v1/teacher/notes` - Request generation of chapter-wise summaries.
* `POST /api/v1/teacher/assignments` - Generate worksheets and answer keys.
* `POST /api/v1/teacher/question-papers` - Create question papers based on blueprint constraints.
* `POST /api/v1/teacher/presentations` - Trigger presentation (`.pptx`) creation.

### 6. Student Study Tools (`/api/v1/student`)
* `GET /api/v1/student/pyq-analysis/{subject_id}` - Fetch topic frequency summaries and exam predictions.
* `POST /api/v1/student/quizzes` - Generate a customized self-assessment based on active units.
* `POST /api/v1/student/study-plan` - Request a calendar study schedule based on exam dates.

---

## 💬 Real-Time Streaming Chat Architecture

To create a responsive offline experience, chat endpoints stream output using Server-Sent Events (SSE).

### Request Payload Example:
```json
{
  "subject_id": "ml-101",
  "model_name": "qwen2.5-coder:7b",
  "conversation_id": "conv-3942",
  "message": "Explain overfitting according to Unit 3.",
  "parameters": {
    "marks_context": 5,
    "temperature": 0.2
  }
}
```

### Response Stream Example (SSE events):
```text
event: chunk
data: {"text": "Over"}

event: chunk
data: {"text": "fitting"}

event: chunk
data: {"text": " happens"}

...

event: citations
data: {
  "sources": [
    {
      "file_name": "Unit_3_Notes.pdf",
      "page": 12,
      "chapter": "Model Complexity"
    }
  ]
}

event: done
data: {}
```

This streaming design connects directly to Ollama's local streaming client, delivering instant feedback to the user interface.

