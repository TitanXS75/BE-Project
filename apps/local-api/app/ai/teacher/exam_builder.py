"""Exam Question Paper Builder supporting Bloom's Taxonomy Blueprint and Word (.docx) Export."""

import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import aiosqlite
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from app.config import settings
from app.db.repository import SubjectRepository
from app.rag.retrieval.retriever import HybridRetriever


class ExamPaperBuilder:
    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.subject_dir = settings.SUBJECTS_DIR / subject_id
        self.output_dir = self.subject_dir / "generated_materials"
        self.output_dir.mkdir(parents=True, exist_ok=True)
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
        """Generates a complete, balanced examination paper with section breakdown, cognitive levels, and Word export."""
        if blooms_weights is None:
            blooms_weights = {
                "Remember": 20,
                "Understand": 30,
                "Apply": 30,
                "Analyze": 20
            }

        # 1. Load manifest metadata
        manifest_data: Dict[str, Any] = {}
        manifest_path = self.subject_dir / "manifest.json"
        if manifest_path.exists():
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    manifest_data = json.load(f)
            except Exception:
                pass

        subject_name = manifest_data.get("subject_name", self.subject_id.replace("-", " ").title())
        institution_name = manifest_data.get("institution_name", "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING")
        academic_year = manifest_data.get("academic_year", "2026-2027")

        # 2. Fetch real units and PYQs from SQLite database
        units_info: List[Dict[str, Any]] = []
        pyqs_info: List[Dict[str, Any]] = []

        if self.db_path.exists():
            async with aiosqlite.connect(self.db_path) as db:
                db.row_factory = aiosqlite.Row
                repo = SubjectRepository(db)
                units_info = await repo.list_units()

                async with db.execute(
                    "SELECT id, year, exam_term, question_text, marks, unit_id, frequency_score FROM pyq_questions ORDER BY frequency_score DESC"
                ) as cur:
                    rows = await cur.fetchall()
                    pyqs_info = [dict(r) for r in rows]

        # Filter units if specified
        if units_included:
            selected_units = [u for u in units_info if u.get("id") in units_included or u.get("title") in units_included]
            if selected_units:
                units_info = selected_units

        # Fallback units if none in database
        if not units_info:
            units_info = [
                {"unit_number": 1, "title": f"{subject_name} Core Concepts & Foundations", "description": "Fundamentals, definitions, mathematical models"},
                {"unit_number": 2, "title": f"{subject_name} Architectures & Paradigms", "description": "Key structural patterns, mechanisms, protocols"},
                {"unit_number": 3, "title": f"{subject_name} Advanced Algorithms & Methods", "description": "Implementation, complexity, trade-offs"},
                {"unit_number": 4, "title": f"{subject_name} Applied Engineering & Systems", "description": "Real-world scalability, reliability, case studies"}
            ]

        # 3. Derive syllabus topics and build questions dynamically
        parsed_topics = self._extract_topics_from_units(units_info)

        # Section A: Short Answer (2 marks each, Remember / Understand) - 5 questions = 10 Marks
        sec_a_questions = self._build_section_a(parsed_topics, pyqs_info, units_info)

        # Section B: Medium Answer (5 marks each, Understand / Apply) - 3 questions = 15 Marks
        sec_b_questions = self._build_section_b(parsed_topics, pyqs_info, units_info)

        # Section C: Long Answer (10 marks each, Apply / Analyze / Evaluate) - 2 questions = 20 Marks
        sec_c_questions = self._build_section_c(parsed_topics, pyqs_info, units_info)

        exam_paper: Dict[str, Any] = {
            "title": f"{subject_name} - {exam_title}",
            "subject_name": subject_name,
            "institution_name": institution_name,
            "academic_year": academic_year,
            "duration_minutes": duration_minutes,
            "total_marks": total_marks,
            "blooms_distribution": blooms_weights,
            "instructions": [
                "Answer all questions in Section A.",
                "Answer any two questions from Section B.",
                "Answer any two questions from Section C.",
                "Assume suitable data wherever necessary.",
                "Draw neat diagrams and cite standard formulations where required."
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
            "markdown_preview": self._format_as_markdown(
                exam_title, total_marks, duration_minutes, sec_a_questions, sec_b_questions, sec_c_questions
            )
        }

        # 4. Generate and save Word (.docx) document
        clean_slug = re.sub(r"[^\w\-]+", "_", f"{self.subject_id}_{exam_title}").strip("_")
        docx_filename = f"{clean_slug}.docx"
        output_docx_path = self.export_docx(exam_paper, filename=docx_filename)

        exam_paper["docx_filename"] = docx_filename
        exam_paper["docx_download_url"] = f"/api/v1/teacher/download-material/{self.subject_id}/{docx_filename}"
        exam_paper["file_path"] = str(output_docx_path)
        exam_paper["file_size_bytes"] = output_docx_path.stat().st_size

        return exam_paper

    def export_docx(self, exam_paper: Dict[str, Any], filename: Optional[str] = None) -> Path:
        """Exports the generated exam paper as a cleanly styled Word (.docx) document."""
        if not filename:
            clean_title = re.sub(r"[^\w\-]+", "_", exam_paper.get("title", "Exam_Paper")).strip("_")
            filename = f"{clean_title}.docx"

        output_path = self.output_dir / filename

        doc = docx.Document()

        # Set 1-inch margins
        for section in doc.sections:
            section.top_margin = Inches(1.0)
            section.bottom_margin = Inches(1.0)
            section.left_margin = Inches(1.0)
            section.right_margin = Inches(1.0)

        # Style normal paragraph font
        normal_style = doc.styles["Normal"]
        normal_style.font.name = "Calibri"
        normal_style.font.size = Pt(11)
        normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        # 1. Institution & Course Header
        inst_p = doc.add_paragraph()
        inst_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        inst_run = inst_p.add_run(exam_paper.get("institution_name", "UNIVERSITY FACULTY OF ENGINEERING").upper() + "\n")
        inst_run.bold = True
        inst_run.font.size = Pt(13)
        inst_run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

        sub_run = inst_p.add_run(f"{exam_paper.get('subject_name', self.subject_id.title())} — {exam_paper.get('academic_year', '2026-2027')}\n")
        sub_run.bold = True
        sub_run.font.size = Pt(12)
        sub_run.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)

        title_run = inst_p.add_run(exam_paper.get("title", "Final Examination").split(" - ")[-1])
        title_run.bold = True
        title_run.font.size = Pt(11)
        title_run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

        # 2. Examination Metadata Table (Time, Max Marks)
        meta_table = doc.add_table(rows=1, cols=2)
        meta_table.autofit = False
        meta_table.columns[0].width = Inches(3.25)
        meta_table.columns[1].width = Inches(3.25)

        p_left = meta_table.cell(0, 0).paragraphs[0]
        p_left.add_run(f"Time Allowed: {exam_paper.get('duration_minutes', 180)} Minutes").bold = True

        p_right = meta_table.cell(0, 1).paragraphs[0]
        p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_right.add_run(f"Maximum Marks: {exam_paper.get('total_marks', 100)}").bold = True

        doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # 3. Instructions Box
        inst_head = doc.add_paragraph()
        inst_head.paragraph_format.space_after = Pt(2)
        inst_head_run = inst_head.add_run("INSTRUCTIONS TO CANDIDATES:")
        inst_head_run.bold = True
        inst_head_run.font.size = Pt(10)
        inst_head_run.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

        for inst in exam_paper.get("instructions", []):
            ip = doc.add_paragraph(style="List Bullet" if "List Bullet" in doc.styles else None)
            ip.paragraph_format.space_after = Pt(2)
            irun = ip.add_run(inst)
            irun.font.size = Pt(10)
            irun.italic = True

        doc.add_paragraph().paragraph_format.space_after = Pt(8)

        # 4. Sections & Questions
        for sec in exam_paper.get("sections", []):
            sec_p = doc.add_paragraph()
            sec_p.paragraph_format.space_before = Pt(12)
            sec_p.paragraph_format.space_after = Pt(6)
            sec_run = sec_p.add_run(sec.get("section_name", "Section"))
            sec_run.bold = True
            sec_run.font.size = Pt(11.5)
            sec_run.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

            for q in sec.get("questions", []):
                qp = doc.add_paragraph()
                qp.paragraph_format.space_after = Pt(3)
                
                num_run = qp.add_run(f"{q.get('q_number', '')}. ")
                num_run.bold = True
                
                text_run = qp.add_run(f"{q.get('question', '')} ")
                
                tax_run = qp.add_run(f"[{q.get('taxonomy', 'General')}] ")
                tax_run.italic = True
                tax_run.font.size = Pt(9.5)
                tax_run.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

                marks_run = qp.add_run(f"({q.get('marks', 2)} Marks)")
                marks_run.bold = True
                marks_run.font.size = Pt(10)

                if q.get("or_option"):
                    or_p = doc.add_paragraph()
                    or_p.paragraph_format.left_indent = Inches(0.4)
                    or_p.paragraph_format.space_after = Pt(3)
                    
                    or_label = or_p.add_run("OR\n")
                    or_label.bold = True
                    or_label.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)
                    
                    or_p.add_run(f"{q.get('or_option')} ")
                    
                    or_tax_run = or_p.add_run(f"[{q.get('taxonomy', 'General')}] ")
                    or_tax_run.italic = True
                    or_tax_run.font.size = Pt(9.5)
                    or_tax_run.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)
                    
                    or_marks_run = or_p.add_run(f"({q.get('marks', 5)} Marks)")
                    or_marks_run.bold = True
                    or_marks_run.font.size = Pt(10)

        doc.save(str(output_path))
        return output_path

    def _extract_topics_from_units(self, units: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Parses titles and descriptions into actionable subtopics per unit."""
        topics = []
        for u in units:
            unit_title = u.get("title", f"Unit {u.get('unit_number', 1)}")
            clean_title = re.sub(r"^Unit\s*\d+[:\-]?\s*", "", unit_title, flags=re.IGNORECASE).strip()
            desc = u.get("description", "") or ""
            sub_items = [s.strip() for s in desc.split(",") if s.strip()]
            if not sub_items:
                sub_items = [clean_title]

            topics.append({
                "unit_id": u.get("id", f"unit_{u.get('unit_number', 1)}"),
                "unit_label": f"Unit {u.get('unit_number', 1)}",
                "clean_title": clean_title,
                "subtopics": sub_items
            })
        return topics

    def _build_section_a(
        self,
        topics: List[Dict[str, Any]],
        pyqs: List[Dict[str, Any]],
        units: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Constructs 5 short-answer questions (2 marks each) mapped to syllabus units."""
        questions = []
        q_labels = ["1.a", "1.b", "1.c", "1.d", "1.e"]

        # Prioritize real 2-mark PYQs if present
        short_pyqs = [p for p in pyqs if p.get("marks", 0) <= 3]

        for idx, lbl in enumerate(q_labels):
            if idx < len(short_pyqs):
                pq = short_pyqs[idx]
                questions.append({
                    "q_number": lbl,
                    "question": pq["question_text"],
                    "marks": 2,
                    "taxonomy": "Remember",
                    "unit": pq.get("unit_id") or f"Unit {(idx % len(topics)) + 1}"
                })
                continue

            # Dynamically derive from unit topic
            t_idx = idx % len(topics)
            top = topics[t_idx]
            sub = top["subtopics"][idx % len(top["subtopics"])]

            templates = [
                f"State the primary definition and role of {sub}.",
                f"Distinguish between theoretical objectives and practical constraints in {sub}.",
                f"Define the key parameters that characterize {sub} in modern computing systems.",
                f"Identify two fundamental benefits of applying {sub}.",
                f"Explain how {sub} ensures correctness and efficiency in system operations."
            ]

            questions.append({
                "q_number": lbl,
                "question": templates[idx % len(templates)],
                "marks": 2,
                "taxonomy": "Remember" if idx % 2 == 0 else "Understand",
                "unit": top["unit_label"]
            })

        return questions

    def _build_section_b(
        self,
        topics: List[Dict[str, Any]],
        pyqs: List[Dict[str, Any]],
        units: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Constructs 3 analytical questions (5 marks each) with optional OR choices."""
        questions = []
        med_pyqs = [p for p in pyqs if 4 <= p.get("marks", 0) <= 6]

        for i in range(3):
            q_num = str(i + 2)
            t_idx = i % len(topics)
            top = topics[t_idx]
            sub_main = top["subtopics"][0] if top["subtopics"] else top["clean_title"]
            sub_alt = top["subtopics"][1] if len(top["subtopics"]) > 1 else f"alternative techniques for {top['clean_title']}"

            if i < len(med_pyqs):
                pq = med_pyqs[i]
                questions.append({
                    "q_number": q_num,
                    "question": pq["question_text"],
                    "marks": 5,
                    "taxonomy": "Apply",
                    "unit": top["unit_label"],
                    "or_option": f"Explain the architectural mechanisms and execution pipeline of {sub_alt}."
                })
            else:
                questions.append({
                    "q_number": q_num,
                    "question": f"Analyze the working principles of {sub_main}. Formulate the operational sequence or mathematical formulation.",
                    "marks": 5,
                    "taxonomy": "Apply" if i % 2 == 0 else "Understand",
                    "unit": top["unit_label"],
                    "or_option": f"Compare and contrast {sub_main} with {sub_alt} in terms of computational complexity and runtime trade-offs."
                })

        return questions

    def _build_section_c(
        self,
        topics: List[Dict[str, Any]],
        pyqs: List[Dict[str, Any]],
        units: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Constructs 2 comprehensive/design questions (10 marks each)."""
        questions = []
        long_pyqs = [p for p in pyqs if p.get("marks", 0) >= 8]

        for i in range(2):
            q_num = str(i + 5)
            # Take later units (more comprehensive)
            t_idx = min(len(topics) - 1, i + 2) if len(topics) > 2 else i % len(topics)
            top = topics[t_idx]
            sub = top["subtopics"][-1] if top["subtopics"] else top["clean_title"]

            if i < len(long_pyqs):
                pq = long_pyqs[i]
                questions.append({
                    "q_number": q_num,
                    "question": pq["question_text"],
                    "marks": 10,
                    "taxonomy": "Analyze / Evaluate",
                    "unit": top["unit_label"],
                    "or_option": f"Design an end-to-end framework leveraging {sub}. Discuss fault scenarios, recovery protocols, and performance metrics."
                })
            else:
                questions.append({
                    "q_number": q_num,
                    "question": f"Design a complete architecture integrating {top['clean_title']}. Specify the input pipeline, loss/objective formulation, failure mitigation, and evaluation criteria.",
                    "marks": 10,
                    "taxonomy": "Analyze / Evaluate",
                    "unit": top["unit_label"],
                    "or_option": f"Critically evaluate {sub} for large-scale enterprise deployments. How does it handle edge cases and maintain consistency under load?"
                })

        return questions

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
