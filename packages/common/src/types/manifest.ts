export interface SubjectManifest {
  package_version: string;
  created_at: string;
  subject_code: string;
  title: string;
  subject_name?: string;
  academic_year: string;
  teacher: {
    name: string;
    institution: string;
    department?: string;
    signature?: string;
  };
  embedding_config: {
    model: string;
    vector_dimension: number;
    distance_metric: "cosine" | "l2" | "dot";
  };
  checksums: Record<string, string>;
}

export interface PackageStats {
  units_count: number;
  chapters_count: number;
  documents_count: number;
  chunks_count: number;
  pyqs_count: number;
  vectors_count: number;
}

export interface PackageInspectorData {
  package_id: string;
  manifest: SubjectManifest;
  stats: PackageStats;
  sqlite_tables: Record<string, number>;
  lancedb: {
    vector_dimension: number;
    table_name: string;
    row_count: number;
  };
  validation_status: "valid" | "corrupted" | "warning";
}
