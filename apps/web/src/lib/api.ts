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

export interface SystemDiagnostics {
  python: {
    installed: boolean;
    version: string;
    executable: string;
    status: string;
  };
  hardware: {
    os: string;
    cpu_cores: number;
    ram_total_gb: number;
    ram_available_gb: number;
    gpu: string;
  };
  ollama: {
    connected: boolean;
    url: string;
    version: string | null;
    installed_models: string[];
  };
  storage: {
    app_data_path: string;
    subjects_count: number;
  };
}

export interface ModelRecommendation {
  recommended_model: string;
  display_name: string;
  reason: string;
  speed_rating: string;
  ram_detected_gb: number;
  cpu_cores_detected: number;
  gemini_api_key_valid: boolean;
  gemini_consultation_used: boolean;
  alternatives: Array<{
    model: string;
    name: string;
    ram_req: string;
    best_for: string;
  }>;
}

export async function fetchSystemDiagnostics(): Promise<SystemDiagnostics> {
  const res = await fetch(`${API_BASE_URL}/system-diagnostics`);
  if (!res.ok) throw new Error("Failed to fetch system diagnostics");
  return res.json();
}

export async function requestModelRecommendation(geminiApiKey?: string): Promise<ModelRecommendation> {
  const res = await fetch(`${API_BASE_URL}/recommend-model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gemini_api_key: geminiApiKey })
  });
  if (!res.ok) throw new Error("Failed to recommend model");
  return res.json();
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

