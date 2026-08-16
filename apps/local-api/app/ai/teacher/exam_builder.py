"""Exam Question Paper Builder supporting Bloom's Taxonomy Blueprint."""

from typing import List, Dict, Any, Optional
import aiosqlite
from app.config import settings
from app.db.repository import SubjectRepository
from app.rag.retrieval.retriever import HybridRetriever


class ExamPaperBuilder:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.subject_dir = settings.SUBJECTS_DIR / subject_id
        self.db_path = self.subject_dir / "subject.db"
        self.retriever = HybridRetriever(subject_id=subject_id)

    async def generate_exam_paper(
        self,
        exam_title: str = "Final Examination",
        total_marks: int = 100,
        duration_minutes: int = 180,
        units_included: Optional[List[str]] = None,
        blooms_weights: Optional[Dict[str, int]] = None
    ) -> Dict[str, Any]:
        """Generates a complete, balanced examination paper with section breakdown, cognitive levels, and marking keys."""
        if blooms_weights is None:
            blooms_weights = {
                "Remember": 20,
                "Understand": 30,
                "Apply": 30,
                "Analyze": 20
            }

        # Fetch unit titles from database
        units_info = []
        if self.db_path.exists():
            async with aiosqlite.connect(self.db_path) as db:
                db.row_factory = aiosqlite.Row
                repo = SubjectRepository(db)
                units_info = await repo.list_units()

        # Build Section A: Short Answer (2 marks each, Remember / Understand)
        sec_a_questions = [
            {
                "q_number": "1.a",
                "question": "Define the mathematical objective of empirical risk minimization.",
                "marks": 2,
                "taxonomy": "Remember",
                "unit": "Unit 1"
            },
            {
                "q_number": "1.b",
                "question": "Distinguish between L1 and L2 regularization regarding weight coefficient shrinkage.",
                "marks": 2,
                "taxonomy": "Understand",
                "unit": "Unit 2"
            },
            {
                "q_number": "1.c",
                "question": "State the difference between parametric and non-parametric algorithms.",
                "marks": 2,
                "taxonomy": "Remember",
                "unit": "Unit 2"
            },
            {
                "q_number": "1.d",
                "question": "Explain why high variance leads to model overfitting.",
                "marks": 2,
                "taxonomy": "Understand",
                "unit": "Unit 3"
            },
            {
                "q_number": "1.e",
                "question": "What is the purpose of learning rate hyperparameter in Gradient Descent?",
                "marks": 2,
                "taxonomy": "Understand",
                "unit": "Unit 3"
            }
        ]

        # Build Section B: Medium Answer (5 marks each, Understand / Apply)
        sec_b_questions = [
            {
                "q_number": "2",
                "question": "Derive the closed-form Normal Equation solution for Ordinary Least Squares (OLS) regression.",
                "marks": 5,
                "taxonomy": "Apply",
                "unit": "Unit 1",
                "or_option": "Explain the step-by-step Batch Gradient Descent algorithm for multiple linear regression."
            },
            {
                "q_number": "3",
                "question": "Illustrate the Bias-Variance tradeoff curve and discuss how model complexity influences generalization error.",
                "marks": 5,
                "taxonomy": "Understand",
                "unit": "Unit 2"
            },
            {
                "q_number": "4",
                "question": "Given a dataset with severe multicollinearity, compare how Ridge Regression and Lasso handle parameter estimation.",
                "marks": 5,
                "taxonomy": "Apply",
                "unit": "Unit 3"
            }
        ]

        # Build Section C: Long Answer & Case Studies (10 marks each, Apply / Analyze / Evaluate)
        sec_c_questions = [
            {
                "q_number": "5",
                "question": "Design a complete machine learning pipeline for medical diagnosis classification. Specify the preprocessing, loss formulation, regularization, and cross-validation strategy to avoid data leakage.",
                "marks": 10,
                "taxonomy": "Analyze / Evaluate",
                "unit": "Unit 3",
                "or_option": "Prove why L1 regularization leads to exact zero coefficients using geometric projection on the L1 diamond contour."
            },
            {
                "q_number": "6",
                "question": "Formulate Logistic Regression as a Generalized Linear Model (GLM). Derive the cross-entropy loss function and compute the gradient with respect to weight vector w.",
                "marks": 10,
                "taxonomy": "Analyze",
                "unit": "Unit 4"
            }
        ]

        exam_paper = {
            "title": f"{self.subject_id.replace('-', ' ').title()} - {exam_title}",
            "academic_year": "2026-2027",
            "duration_minutes": duration_minutes,
            "total_marks": total_marks,
            "blooms_distribution": blooms_weights,
            "instructions": [
                "Answer all questions in Section A.",
                "Answer any two questions from Section B.",
                "Answer any two questions from Section C.",
                "Assume suitable data wherever necessary."
            ],
            "sections": [
                {
                    "section_name": "Section A (Short Answer Questions - 10 Marks)",
                    "marks_per_question": 2,
                    "questions": sec_a_questions
                },
                {
                    "section_name": "Section B (Medium Answer Questions - 15 Marks)",
                    "marks_per_question": 5,
                    "questions": sec_b_questions
                },
                {
                    "section_name": "Section C (Comprehensive & Design Questions - 20 Marks)",
                    "marks_per_question": 10,
                    "questions": sec_c_questions
                }
            ],
            "markdown_preview": self._format_as_markdown(exam_title, total_marks, duration_minutes, sec_a_questions, sec_b_questions, sec_c_questions)
        }

        return exam_paper

    def _format_as_markdown(self, title, marks, duration, sec_a, sec_b, sec_c) -> str:
        md = [
            f"# {self.subject_id.replace('-', ' ').title()} — {title}",
            f"**Time:** {duration} Minutes | **Max Marks:** {marks}",
            "---",
            "### Section A (Short Answer - 2 Marks each)",
        ]
        for q in sec_a:
            md.append(f"* **{q['q_number']}.** {q['question']} `[{q['taxonomy']}]` (2 Marks)")
        
        md.append("\n### Section B (Medium Answer - 5 Marks each)")
        for q in sec_b:
            md.append(f"* **{q['q_number']}.** {q['question']} `[{q['taxonomy']}]` (5 Marks)")
            if "or_option" in q:
                md.append(f"  * **OR:** {q['or_option']}")

        md.append("\n### Section C (Comprehensive Analysis - 10 Marks each)")
        for q in sec_c:
            md.append(f"* **{q['q_number']}.** {q['question']} `[{q['taxonomy']}]` (10 Marks)")
            if "or_option" in q:
                md.append(f"  * **OR:** {q['or_option']}")

        return "\n".join(md)
