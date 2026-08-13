# 📡 API Documentation

This document describes the API endpoint design, routing, and real-time streaming architectures.

---

## 📡 API Directory Map

All API routes are versioned from day one under `/api/v1`.

### 1. Authentication (`/api/v1/auth`)
* `POST /api/v1/auth/login` - User authentication and token retrieval.
* `POST /api/v1/auth/logout` - Invalidate session tokens.

### 2. Academic Metadata (`/api/v1/...`)
* `GET /api/v1/institutions` - Get or search institutions.
* `GET /api/v1/departments` - List departments inside an institution.
* `GET /api/v1/courses` - List courses.
* `GET /api/v1/subjects` - List subjects for a given department/semester.
* `GET /api/v1/subjects/{subject_id}/units` - List chapters or units.

### 3. Document Management (`/api/v1/documents`)
* `POST /api/v1/documents/upload` - Upload academic files (Notes, Textbooks, PYQs).
* `GET /api/v1/documents/{document_id}/status` - Check background processing status.
* `POST /api/v1/documents/process` - Trigger processing manually.

### 4. AI Tutor Chat (`/api/v1/chat`)
* `POST /api/v1/chat` - Start an interactive chat session.
* `POST /api/v1/chat/stream` - Stream interactive responses word-by-word (SSE).
* `GET /api/v1/chat/{conversation_id}/history` - Retrieve message history.

### 5. Teacher Content Tools (`/api/v1/teacher`)
* `POST /api/v1/teacher/notes` - Request generation of chapter-wise notes.
* `POST /api/v1/teacher/assignments` - Generate worksheets and answer keys.
* `POST /api/v1/teacher/quizzes` - Generate quizzes (MCQs/Written).
* `POST /api/v1/teacher/question-papers` - Create question papers based on blueprint.
* `POST /api/v1/teacher/presentations` - Trigger presentation (.pptx) creation.

### 6. Student Tools (`/api/v1/student`)
* `GET /api/v1/student/notes` - Get generated/saved notes.
* `POST /api/v1/student/quizzes` - Request a customized quiz.
* `GET /api/v1/student/pyq-analysis/{subject_id}` - Fetch topic frequencies and test predictions.
* `POST /api/v1/student/study-plan` - Request an automated preparation schedule.
* `GET /api/v1/student/progress` - Get subject learning metrics.

---

## 💬 Real-Time Streaming Chat Architecture

To create a fast user experience, the student chat utilizes Server-Sent Events (SSE) to stream answers word-by-word.

### Request Payload Example:
```json
{
  "subject_id": "ml-101",
  "conversation_id": "conv-8877",
  "message": "Explain how SVM models handle non-linear data.",
  "parameters": {
    "marks_context": 5,
    "style": "exam-oriented"
  }
}
```

### Response Stream Example (SSE events):
```text
event: chunk
data: {"text": "Support"}

event: chunk
data: {"text": " Vector"}

event: chunk
data: {"text": " Machines"}

...

event: citations
data: {
  "sources": [
    {
      "file_name": "Machine_Learning_Lecture_Notes.pdf",
      "page": 45,
      "chapter": "Kernel Methods"
    }
  ]
}

event: done
data: {}
```

This streaming design enables the student to receive feedback immediately and ensures every response is grounded in the verified academic knowledge base.
