# Axiom Project AI Agent Rules & Core Guidelines

This repository contains **Axiom**, a local-first, air-gapped curriculum-aware learning and teaching platform.

---

## 1. Core Principles & Philosophy
1. **Local-First & Air-Gapped**: All RAG operations, vector lookups, and AI inferences must be fully functional offline via local Ollama and LanceDB. Zero external network telemetry without explicit user-provided keys.
2. **Syllabus Bounding & Zero Hallucinations**: AI responses must strictly adhere to provided course modules, textbook chapters, and syllabus limits.
3. **High-Performance Architecture**: Sub-40ms vector similarity matching, streaming SSE for token delivery, and memory-safe 4-bit local model execution.

---

## 2. Global UI & Frontend Strict Rules

> [!IMPORTANT]
> **NO ARROWS OR EMOJIS IN WEBSITE**
> - **DO NOT** use unicode arrows (`→`, `←`, `↑`, `↓`, `➔`, `➜`, `->`, `=>`, etc.) in website text, buttons, links, or headers.
> - **DO NOT** use emojis (`🚀`, `🤖`, `💡`, `🔥`, `✨`, `🎉`, `📚`, etc.) in the website UI, labels, descriptions, or copy.
> - Use clean, modern typography and dedicated Lucide React icons (`<Check />`, `<Zap />`, `<Shield />`, `<Monitor />`, etc.) for visual accents.

### Design Aesthetics & Apple Glassmorphism
- **Color System**: Curated dark palette (`#000000` deep background, `#0e0e10` / `#161618` card surfaces, `#1c1c1e` interactive layers, `#0071e3` Apple blue accent, `#30d158` success, `#ff9f0a` warning, `#38bdf8` info).
- **Glassmorphism & Lighting**: Multi-layered ambient glows with high blur radius (`blur-[140px]`), subtle 1px border glows (`border-white/[0.08]` to `border-white/20`), and frosted backdrops (`backdrop-blur-xl`).
- **Layout Expansion**: Use full-width responsive landing page layouts (`max-w-[1440px]`) with generous padding (`px-4 sm:px-10 lg:px-16`) rather than boxed, vertically compressed middle containers.

---

## 3. Technology Stack & Directory Structure
- `apps/web`: Next.js 16 (App Router), React 19, Tailwind CSS v4, Motion React, GSAP, Lucide React.
- `apps/local-api`: Python 3.13 FastAPI backend, LanceDB vector database, Ollama client, SQLite metadata engine.
- `apps/desktop`: Electron container with native `.rssh` file associations and offline IPC.
- `packages/common` & `packages/ui`: Shared TypeScript data models, schemas, and UI design tokens.

---

## 4. Skill Routing Guide
Only consult specialized skill documents when performing work in that specific domain to prevent token bloat:
- **Frontend / Styling / Design**: Consult `.agents/skills/frontend-ui-standards/SKILL.md`
- **Vector Search / RAG / LanceDB**: Consult `.agents/skills/local-rag-lancedb/SKILL.md`
- **FastAPI / Ollama / Python Backend**: Consult `.agents/skills/ollama-fastapi-backend/SKILL.md`
- **.rssh Archive Format & Ingestion**: Consult `.agents/skills/rssh-package-format/SKILL.md`
- **Electron / Desktop App**: Consult `.agents/skills/electron-desktop-container/SKILL.md`
