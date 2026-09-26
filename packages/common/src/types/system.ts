export type CloudProvider =
  | "gemini"
  | "openai"
  | "anthropic"
  | "groq"
  | "deepseek"
  | "openrouter";

export interface CloudAiConfig {
  mode: "cloud" | "local" | "hybrid";
  provider: CloudProvider;
  apiKey: string;
  model: string;
  isValid: boolean;
  providerName: string;
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
