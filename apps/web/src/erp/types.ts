export type AdminTab =
  | "dashboard"
  | "academic"
  | "students"
  | "teachers"
  | "attendance"
  | "exams"
  | "timetable"
  | "notices"
  | "events";

export interface AcademicSession {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at?: string;
}

export interface Semester {
  id: string;
  session_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface SchoolClass {
  id: string;
  session_id: string;
  name: string;
  numeric_name?: number;
  created_at?: string;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
  room_number?: string;
  capacity?: number;
  created_at?: string;
}

export interface Course {
  id: string;
  class_id: string;
  semester_id?: string;
  name: string;
  code: string;
  credit_hours?: number;
  created_at?: string;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  gender: "male" | "female" | "other";
  join_date?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  gender: "male" | "female" | "other";
  dob?: string;
  address?: string;
  avatar_url?: string;
  // Joined fields
  class_id?: string;
  section_id?: string;
  roll_number?: string;
  class_name?: string;
  section_name?: string;
  created_at?: string;
}

export interface StudentAcademicRecord {
  id: string;
  student_id: string;
  session_id: string;
  class_id: string;
  section_id: string;
  roll_number?: string;
  status: "active" | "promoted" | "graduated" | "transferred";
  created_at?: string;
}

export interface CourseTeacherAssignment {
  id: string;
  teacher_id: string;
  course_id: string;
  section_id: string;
  semester_id?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  section_id: string;
  course_id?: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
  created_at?: string;
}

export interface Exam {
  id: string;
  name: string;
  semester_id: string;
  class_id: string;
  course_id: string;
  exam_date?: string;
  total_marks: number;
  pass_marks: number;
  created_at?: string;
}

export interface ExamMark {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  is_absent: boolean;
  remarks?: string;
  created_at?: string;
}

export interface GradingRule {
  id: string;
  grading_system_id: string;
  grade_name: string;
  min_mark: number;
  max_mark: number;
  gpa_point?: number;
  remarks?: string;
}

export interface Notice {
  id: string;
  session_id?: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  published_by: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  event_type: "academic" | "exam" | "holiday" | "sports" | "general";
  created_at?: string;
}

export interface RoutineSlot {
  id: string;
  class_id: string;
  section_id: string;
  course_id: string;
  teacher_id?: string;
  day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  start_time: string;
  end_time: string;
  room_number?: string;
  created_at?: string;
}

// Initial mock dataset for seamless offline / zero-credential instant testing
export const INITIAL_ERP_DATA = {
  sessions: [
    {
      id: "sess-1",
      name: "Academic Year 2026-2027",
      start_date: "2026-08-01",
      end_date: "2027-05-31",
      is_current: true,
    },
    {
      id: "sess-0",
      name: "Academic Year 2025-2026",
      start_date: "2025-08-01",
      end_date: "2026-05-31",
      is_current: false,
    },
  ] as AcademicSession[],

  semesters: [
    { id: "sem-1", session_id: "sess-1", name: "Semester 1 (Fall 2026)" },
    { id: "sem-2", session_id: "sess-1", name: "Semester 2 (Spring 2027)" },
  ] as Semester[],

  classes: [
    { id: "cls-1", session_id: "sess-1", name: "Grade 10 - Computer Science", numeric_name: 10 },
    { id: "cls-2", session_id: "sess-1", name: "Grade 11 - Advanced Mathematics", numeric_name: 11 },
    { id: "cls-3", session_id: "sess-1", name: "Grade 12 - Applied Physics", numeric_name: 12 },
  ] as SchoolClass[],

  sections: [
    { id: "sec-1", class_id: "cls-1", name: "Section A", room_number: "Lab 301", capacity: 35 },
    { id: "sec-2", class_id: "cls-1", name: "Section B", room_number: "Room 104", capacity: 30 },
    { id: "sec-3", class_id: "cls-2", name: "Section A", room_number: "Room 205", capacity: 40 },
    { id: "sec-4", class_id: "cls-3", name: "Section A", room_number: "Physics Lab", capacity: 28 },
  ] as Section[],

  courses: [
    { id: "crs-1", class_id: "cls-1", semester_id: "sem-1", name: "Data Structures and Algorithms", code: "CS-101", credit_hours: 4.0 },
    { id: "crs-2", class_id: "cls-1", semester_id: "sem-1", name: "Discrete Mathematics", code: "MATH-102", credit_hours: 3.0 },
    { id: "crs-3", class_id: "cls-2", semester_id: "sem-1", name: "Differential Calculus", code: "MATH-201", credit_hours: 4.0 },
    { id: "crs-4", class_id: "cls-3", semester_id: "sem-1", name: "Electromagnetism and Quantum", code: "PHY-301", credit_hours: 4.0 },
  ] as Course[],

  teachers: [
    {
      id: "tch-1",
      first_name: "Dr. Arvind",
      last_name: "Raman",
      email: "arvind.raman@axiom.edu",
      phone: "+91 98765 43210",
      designation: "Professor and Head of Dept",
      department: "Computer Science",
      gender: "male",
      join_date: "2022-06-15",
    },
    {
      id: "tch-2",
      first_name: "Prof. Priya",
      last_name: "Sharma",
      email: "priya.sharma@axiom.edu",
      phone: "+91 98765 43211",
      designation: "Associate Professor",
      department: "Mathematics",
      gender: "female",
      join_date: "2023-01-10",
    },
    {
      id: "tch-3",
      first_name: "Dr. Vikram",
      last_name: "Mehta",
      email: "vikram.mehta@axiom.edu",
      phone: "+91 98765 43212",
      designation: "Senior Lecturer",
      department: "Physics",
      gender: "male",
      join_date: "2021-08-01",
    },
  ] as Teacher[],

  students: [
    {
      id: "stu-1",
      first_name: "Aarav",
      last_name: "Patel",
      email: "aarav.patel@student.axiom.edu",
      phone: "+91 91234 56780",
      gender: "male",
      dob: "2008-04-12",
      address: "B-402, Green Valley Apartments, Mumbai",
      class_id: "cls-1",
      section_id: "sec-1",
      roll_number: "CS10-01",
      class_name: "Grade 10 - Computer Science",
      section_name: "Section A",
    },
    {
      id: "stu-2",
      first_name: "Ananya",
      last_name: "Iyer",
      email: "ananya.iyer@student.axiom.edu",
      phone: "+91 91234 56781",
      gender: "female",
      dob: "2008-09-23",
      address: "14, Lotus Enclave, Pune",
      class_id: "cls-1",
      section_id: "sec-1",
      roll_number: "CS10-02",
      class_name: "Grade 10 - Computer Science",
      section_name: "Section A",
    },
    {
      id: "stu-3",
      first_name: "Rohan",
      last_name: "Deshmukh",
      email: "rohan.d@student.axiom.edu",
      phone: "+91 91234 56782",
      gender: "male",
      dob: "2008-02-17",
      address: "701, Skyline Tower, Mumbai",
      class_id: "cls-1",
      section_id: "sec-2",
      roll_number: "CS10-03",
      class_name: "Grade 10 - Computer Science",
      section_name: "Section B",
    },
    {
      id: "stu-4",
      first_name: "Sneha",
      last_name: "Kulkarni",
      email: "sneha.k@student.axiom.edu",
      phone: "+91 91234 56783",
      gender: "female",
      dob: "2007-11-05",
      address: "A-12, Mayur Vihar, Pune",
      class_id: "cls-2",
      section_id: "sec-3",
      roll_number: "M11-01",
      class_name: "Grade 11 - Advanced Mathematics",
      section_name: "Section A",
    },
    {
      id: "stu-5",
      first_name: "Kabir",
      last_name: "Verma",
      email: "kabir.v@student.axiom.edu",
      phone: "+91 91234 56784",
      gender: "male",
      dob: "2006-08-30",
      address: "55, Pine Grove, Mumbai",
      class_id: "cls-3",
      section_id: "sec-4",
      roll_number: "P12-01",
      class_name: "Grade 12 - Applied Physics",
      section_name: "Section A",
    },
  ] as Student[],

  notices: [
    {
      id: "not-1",
      title: "Mid-Term Examination Schedule Released",
      content:
        "The mid-term examination timetable for all grades has been published. Exams commence from September 15, 2026. Practical exams will precede theoretical evaluations.",
      priority: "urgent",
      published_by: "Academic Affairs Council",
      created_at: "2026-08-16 09:30 AM",
    },
    {
      id: "not-2",
      title: "Annual Science and AI Project Symposium 2026",
      content:
        "Students are invited to register their curriculum AI models and physics robotics capstone projects before August 28, 2026. Exhibition is scheduled for the main auditorium.",
      priority: "high",
      published_by: "Research and Development Cell",
      created_at: "2026-08-14 02:15 PM",
    },
    {
      id: "not-3",
      title: "Library Portal Offline Knowledge Sync Updates",
      content:
        "New offline .rssh Subject Packages for Advanced Calculus and Linear Systems have been compiled and placed on institutional cache servers for direct download.",
      priority: "normal",
      published_by: "Central Library Management",
      created_at: "2026-08-10 11:00 AM",
    },
  ] as Notice[],

  events: [
    {
      id: "ev-1",
      title: "Faculty Orientation and Curriculum Alignment",
      description: "Semester kickoff meeting with all departmental heads.",
      start_date: "2026-08-20T09:00:00",
      end_date: "2026-08-20T17:00:00",
      event_type: "academic",
    },
    {
      id: "ev-2",
      title: "National Independence Celebration Holiday",
      description: "Institutional holiday observed across all departments.",
      start_date: "2026-08-15T00:00:00",
      end_date: "2026-08-15T23:59:59",
      event_type: "holiday",
    },
    {
      id: "ev-3",
      title: "Inter-School Hackathon & AI Showcase",
      description: "Competitive hackathon building syllabus-aware solutions.",
      start_date: "2026-08-29T10:00:00",
      end_date: "2026-08-30T18:00:00",
      event_type: "sports",
    },
  ] as CalendarEvent[],

  routines: [
    {
      id: "rt-1",
      class_id: "cls-1",
      section_id: "sec-1",
      course_id: "crs-1",
      teacher_id: "tch-1",
      day_of_week: "Monday",
      start_time: "09:00",
      end_time: "10:30",
      room_number: "Lab 301",
    },
    {
      id: "rt-2",
      class_id: "cls-1",
      section_id: "sec-1",
      course_id: "crs-2",
      teacher_id: "tch-2",
      day_of_week: "Monday",
      start_time: "10:45",
      end_time: "12:15",
      room_number: "Room 104",
    },
    {
      id: "rt-3",
      class_id: "cls-1",
      section_id: "sec-1",
      course_id: "crs-1",
      teacher_id: "tch-1",
      day_of_week: "Wednesday",
      start_time: "09:00",
      end_time: "10:30",
      room_number: "Lab 301",
    },
  ] as RoutineSlot[],

  exams: [
    {
      id: "ex-1",
      name: "Mid-Term Examination: Data Structures",
      semester_id: "sem-1",
      class_id: "cls-1",
      course_id: "crs-1",
      exam_date: "2026-09-18",
      total_marks: 100,
      pass_marks: 40,
    },
    {
      id: "ex-2",
      name: "Continuous Assessment 1: Discrete Math",
      semester_id: "sem-1",
      class_id: "cls-1",
      course_id: "crs-2",
      exam_date: "2026-09-22",
      total_marks: 50,
      pass_marks: 20,
    },
  ] as Exam[],
};
