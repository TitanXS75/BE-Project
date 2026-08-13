# 🧠 AI & RAG Design

This document covers the Retrieval-Augmented Generation (RAG) pipeline, hybrid search algorithms, agent structures, and system evaluation metrics.

---

## 🔍 Retrieval Architecture

To prevent hallucination, the system enforces a strict citation-first flow:

```text
User Question
      │
      ▼
Query Understanding
      │
      ▼
Subject / Course Identification
      │
      ▼
Metadata Filtering
      │
      ▼
Vector Retrieval
      │
      ▼
Keyword / Hybrid Retrieval
      │
      ▼
Reranking
      │
      ▼
Context Construction
      │
      ▼
LLM
      │
      ▼
Citation / Source Verification
      │
      ▼
Final Answer
```

1. **Query Parsing:** Identify the target subject, unit, and user intent (e.g., looking for definitions, exam questions, or code examples).
2. **Metadata Filtering:** Restrict database retrieval strictly to the user's institution, course, and selected subject.
3. **Retrieval:** Fetch matching document sections using PostgreSQL `pgvector` similarity alongside exact keyword matches.
4. **Reranking:** Sort chunks using a cross-encoder model to surface the most relevant concepts first.
5. **LLM Generation:** Feed the top chunks into the LLM alongside clear context boundary guidelines.
6. **Source Verification:** Match statements in the generated response to the original document citations before returning the answer.

---

## 📚 RAG Processing Pipeline

### 1. Document Ingestion & Extraction
* The system accepts several formats initially: `PDF`, `DOCX`, `PPTX`, `TXT`, `CSV`, and scanned `Images`.
* OCR (Optical Character Recognition) is run on image files to extract text, tables, and formula terms.

### 2. Semantic Chunking
* Avoids splitting raw text blindly by characters.
* Preserves document hierarchy:
  `Document -> Chapter -> Section -> Subsection -> Semantic Chunk`
* Each chunk keeps full context metadata, including the parent unit, page number, and original file name.
* Ingested chunk format:
  ```json
  {
    "text": "...",
    "subject_id": "ml-001",
    "unit": 2,
    "chapter": "Regression",
    "page": 42,
    "source": "ML_Textbook.pdf"
  }
  ```

---

## 🔍 Hybrid Search

We combine vector similarity search with full-text keyword indexing (PostgreSQL TSVector):
* **Vector Search:** Good at finding conceptual matches (e.g., synonym matching, conceptual explanations).
* **Keyword Search:** Critical for technical terms, specific formulas, acronyms, or exact question matches from PYQs.
* **Reciprocal Rank Fusion (RRF):** Merges vector and keyword scores to present the ultimate context list.

---

## 🧠 AI Backend Structure

The AI-specific backend logic lives in the following folder structure:

```text
apps/api/app/
│
├── ai/
│   ├── providers/        # LLM API abstraction (Gemini, OpenAI, local models)
│   ├── embeddings/       # Vector embedding API wrappers
│   ├── reranking/        # Cross-encoder Reranker integrations
│   ├── prompts/          # Dynamic system prompts (tutor, teacher, quizzes)
│   └── generation/       # Content generators (notes, assignments, PPTs, questions)
│
└── rag/
    ├── ingestion/        # File parsers, OCR engines, chunking algorithms
    ├── retrieval/        # Hybrid search query builders & RRF
    ├── context/          # Prompts context window builder
    └── citations/        # Post-generation citation checkers
```

---

## 📊 AI Evaluation Metrics

A RAG pipeline is only as good as its outputs. The platform uses a automated test suite to run evaluations against a ground-truth dataset:

### 1. Retrieval Quality
* **Recall@K:** Did the correct reference text appear in the top K retrieved chunks?
* **Precision@K:** Are all retrieved chunks relevant to the user query?
* **MRR (Mean Reciprocal Rank):** How high up in the search results did the correct chunk appear?

### 2. Generation Quality
* **Faithfulness (Groundedness):** Is the answer fully supported *only* by the retrieved context?
* **Answer Relevance:** Does the generated text directly answer the user's prompt?
* **Citation Accuracy:** Do the embedded page numbers and file names match the actual context sources?

### 3. Academic Quality
* **Syllabus Compliance:** Are generated questions and explanations within the active syllabus?
* **Bloom's Taxonomy/Marks Suitability:** Does the generated exam question match the targeted cognitive complexity and mark weight?
``` Sounds perfect. Let's make sure it is exactly in line with user's instructions.
