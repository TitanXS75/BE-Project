# 🗄️ Database Design

This document details the relational tables, vector stores, and object storage schema requirements.

---

## 🗺️ Entity-Relationship Hierarchy

Academic structure coordinates with user roles and resource indexing models:

* **Users:** User profiles mapped to specific roles (`SUPER_ADMIN`, `INSTITUTION_ADMIN`, `TEACHER`, `STUDENT`).
* **Academic Hierarchy:** `Institution` -> `Department` -> `Course` -> `Semester` -> `Subject` -> `Unit`/`Chapter`.
* **Content:** Subjects link to academic resources like `Syllabus`, `Notes`, `Textbooks`, and `PYQs`.
* **Vector Index:** Documents partition into `Chunks` which link to high-dimensional `Embeddings`.
* **Student Activity:** Logs conversations, roadmaps, quiz history, and progress trackers.

---

## 📡 Relational Schema

```text
User Roles
 ├── Student
 ├── Teacher
 └── Admin

Academic Hierarchy
Institution
   │
   └── Department
         │
         └── Course
               │
               └── Semester
                     │
                     └── Subject
                            │
                            ├── Unit
                            ├── Chapter
                            └── Course Outcome

Content Ingestion
Subject
   │
   └── Documents (Syllabus, Notes, Textbook, PYQ, Assignment)
         │
         └── Chunks
               │
               └── Embeddings

Student Workspace Logs
Student
   │
   ├── Enrollments
   ├── Conversations
   ├── Quiz Attempts
   ├── Assignments
   ├── Progress
   └── Study Plans
```

---

## 📡 Vector Database Strategy (pgvector)

To minimize operational complexity, the platform uses **PostgreSQL + pgvector** as the vector database rather than a separate cluster (e.g., Pinecone or Qdrant).

### Benefits
* **ACID Compliance:** Ensures standard operations (deleting a course automatically deletes all of its vector chunks).
* **Metadata Filtering:** Single SQL query filters on both metadata (`subject_id = 'ml-101'`) and vector distance (`vector <=> query_vector`).
* **Indexing:** HNSW (Hierarchical Navigable Small World) or IVFFlat indexes are applied to the embedding column to speed up retrieval.

---

## 🪣 Object Storage & Media Management

To keep infrastructure costs at **$0**, the platform leverages generous free-tier cloud storage services or self-hosted local options:

### Free Storage Options
1. **Cloudinary (Free Tier):** Offers 25 Monthly Credits (approx. 25 GB of storage / bandwidth). While mainly used for images, it supports uploading raw documents (PDF, DOCX) and is easy to integrate.
2. **Cloudflare R2 (Free Tier):** Provides 10 GB of free S3-compatible storage per month with zero egress (download) fees.
3. **Supabase Storage (Free Tier):** Includes 500 MB of storage, integrated directly with PostgreSQL auth permissions.
4. **MinIO (Self-Hosted):** Completely free, open-source S3-compatible server that runs inside a local Docker container for development.

### Storage Rules
* Document uploads are stored under organized paths, e.g., `/institutions/[institution-id]/courses/[course-id]/[document-type]/[filename]`.
* Direct public access to raw academic documents must be blocked. The backend generates secure, short-lived signed URLs for retrieval.
* Never store large PDFs directly inside the PostgreSQL database.

---

## ⚡ Background Job Processing & Caching

Document chunking and indexing are processed out-of-band to prevent blocking backend API workers.
* **Worker Stack:** Python worker tasks coordinated using `Redis` and `Celery` or `ARQ`.
* **Ingestion Flow:**
  `Upload File -> API saves Document record -> Triggers Worker job -> Worker extracts/chunks/embeds -> Saves chunks to DB.`
* **Redis Caching:** Used to store frequently queried academic data (e.g., PYQ statistics summaries, standard unit list) to reduce database load.
