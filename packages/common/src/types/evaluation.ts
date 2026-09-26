export type BloomCognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export interface QuizQuestion {
  id: number | string;
  unit?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  question: string;
  options: string[];
  correct: number;
  correct_option?: string;
  explanation: string;
  taxonomy?: string;
  source?: string;
  page_reference?: string | number;
}

export interface QuizGradeItem {
  question_id: number | string;
  question_text: string;
  submitted_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
  taxonomy?: string;
}

export interface QuizGradeResult {
  score: number;
  total_questions: number;
  percentage: number;
  mastery_level: "Mastery" | "Proficient" | "Needs Revision" | string;
  cognitive_breakdown: Record<string, { correct: number; total: number }>;
  unit_breakdown: Record<string, { correct: number; total: number }>;
  feedback: string;
  detailed_results: QuizGradeItem[];
}

export interface PYQPrediction {
  topic: string;
  unit: string;
  probability_score: number;
  recurrence_history: string;
  expected_marks: number;
  sample_question?: string;
}

export interface UnitDistributionItem {
  unit: string;
  marks_weightage: number;
  historical_question_count: number;
  trend: string;
}

export interface PYQTrendsResponse {
  subject_id: string;
  high_probability_predictions: PYQPrediction[];
  unit_distribution: UnitDistributionItem[];
  total_analyzed_papers: number;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  tasks: string[];
  unit_focus: string;
  target_hours: number;
}

export interface StudyPlanResponse {
  total_days: number;
  daily_hours: number;
  milestones: StudyPlanDay[];
  summary: string;
}

export interface ExamQuestionItem {
  number: number | string;
  text: string;
  marks: number;
  bloom_level: BloomCognitiveLevel | string;
  unit: string;
  marking_key?: string;
  citation?: string;
}

export interface ExamSection {
  section_name: string;
  section_title: string;
  total_marks: number;
  instructions: string;
  questions: ExamQuestionItem[];
}

export interface ExamPaperBlueprint {
  exam_title: string;
  course_code: string;
  subject_name: string;
  academic_year: string;
  total_marks: number;
  duration_minutes: number;
  sections: ExamSection[];
  bloom_distribution: Record<string, number>;
  docx_download_url?: string;
}
