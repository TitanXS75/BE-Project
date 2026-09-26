export interface UnitRecord {
  id: string;
  unit_number: number;
  title: string;
  description?: string;
  topics?: string;
  chunks?: number;
  chapters?: ChapterRecord[];
}

export interface ChapterRecord {
  id: string;
  unit_id: string;
  chapter_number: number;
  title: string;
  summary?: string;
  page_start?: number;
  page_end?: number;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  doc_type: "syllabus" | "textbook" | "notes" | "pyq";
  unit_id?: string | null;
  file_size_bytes: number;
  pages_count: number;
  chunks_count: number;
  checksum: string;
  indexed_at: string;
}

export interface ChunkRecord {
  id: string;
  document_id: string;
  unit_id?: string | null;
  chapter_id?: string | null;
  content: string;
  page_number?: number;
  token_count: number;
  bloom_level?: string;
}

export interface CurriculumResponse {
  package_id: string;
  subject_name: string;
  subject_code?: string;
  academic_year?: string;
  units: UnitRecord[];
  total_chunks: number;
  total_documents: number;
}
