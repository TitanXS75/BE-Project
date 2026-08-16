export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface SystemStatus {
  api_status: string;
  ollama: {
    connected: boolean;
    url: string;
    version: string | null;
  };
  storage: {
    app_data_path: string;
    subjects_count: number;
  };
}

export interface SubjectPackage {
  package_id: string;
  subject_name: string;
  academic_year?: string;
  version?: string;
  teacher_name?: string;
  institution_name?: string;
  local_path?: string;
  units_count?: number;
  documents_count?: number;
}

export interface OllamaModel {
  name: string;
  model: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE_URL}/system-status`);
  if (!res.ok) throw new Error("Failed to fetch system status");
  return res.json();
}

export async function fetchActiveSubjects(): Promise<{ subjects: SubjectPackage[]; total: number }> {
  const res = await fetch(`${API_BASE_URL}/packages/active`);
  if (!res.ok) throw new Error("Failed to fetch active subjects");
  return res.json();
}

export async function fetchLocalModels(): Promise<{ models: OllamaModel[]; warning?: string }> {
  const res = await fetch(`${API_BASE_URL}/models/local`);
  if (!res.ok) throw new Error("Failed to fetch local models");
  return res.json();
}
