import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  AcademicSession,
  SchoolClass,
  Section,
  Course,
  Teacher,
  Student,
  AttendanceRecord,
  Exam,
  ExamMark,
  Notice,
  CalendarEvent,
  RoutineSlot,
  INITIAL_ERP_DATA,
} from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// LOCAL STORAGE BACKED MOCK STORE (Active when Supabase is not connected)
// ============================================================================

const STORAGE_KEY = "axiom_erp_local_db_v1";

interface ErpState {
  sessions: AcademicSession[];
  classes: SchoolClass[];
  sections: Section[];
  courses: Course[];
  teachers: Teacher[];
  students: Student[];
  attendances: AttendanceRecord[];
  exams: Exam[];
  examMarks: ExamMark[];
  notices: Notice[];
  events: CalendarEvent[];
  routines: RoutineSlot[];
}

function getLocalStore(): ErpState {
  if (typeof window === "undefined") {
    return {
      sessions: INITIAL_ERP_DATA.sessions,
      classes: INITIAL_ERP_DATA.classes,
      sections: INITIAL_ERP_DATA.sections,
      courses: INITIAL_ERP_DATA.courses,
      teachers: INITIAL_ERP_DATA.teachers,
      students: INITIAL_ERP_DATA.students,
      attendances: [],
      exams: INITIAL_ERP_DATA.exams,
      examMarks: [],
      notices: INITIAL_ERP_DATA.notices,
      events: INITIAL_ERP_DATA.events,
      routines: INITIAL_ERP_DATA.routines,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: ErpState = {
        sessions: INITIAL_ERP_DATA.sessions,
        classes: INITIAL_ERP_DATA.classes,
        sections: INITIAL_ERP_DATA.sections,
        courses: INITIAL_ERP_DATA.courses,
        teachers: INITIAL_ERP_DATA.teachers,
        students: INITIAL_ERP_DATA.students,
        attendances: [],
        exams: INITIAL_ERP_DATA.exams,
        examMarks: [],
        notices: INITIAL_ERP_DATA.notices,
        events: INITIAL_ERP_DATA.events,
        routines: INITIAL_ERP_DATA.routines,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {
      sessions: INITIAL_ERP_DATA.sessions,
      classes: INITIAL_ERP_DATA.classes,
      sections: INITIAL_ERP_DATA.sections,
      courses: INITIAL_ERP_DATA.courses,
      teachers: INITIAL_ERP_DATA.teachers,
      students: INITIAL_ERP_DATA.students,
      attendances: [],
      exams: INITIAL_ERP_DATA.exams,
      examMarks: [],
      notices: INITIAL_ERP_DATA.notices,
      events: INITIAL_ERP_DATA.events,
      routines: INITIAL_ERP_DATA.routines,
    };
  }
}

function saveLocalStore(state: ErpState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// ============================================================================
// DATA ACCESS LAYER (Transparently routes to Supabase or Mock Store)
// ============================================================================

export const ErpApi = {
  // --- ACADEMIC SESSIONS ---
  async getSessions(): Promise<AcademicSession[]> {
    if (supabase) {
      const { data, error } = await supabase.from("academic_sessions").select("*").order("start_date", { ascending: false });
      if (!error && data) return data as AcademicSession[];
    }
    return getLocalStore().sessions;
  },

  async createSession(session: Omit<AcademicSession, "id">): Promise<AcademicSession> {
    const newSession = { ...session, id: `sess-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("academic_sessions").insert([newSession]).select().single();
      if (!error && data) return data as AcademicSession;
    }
    const store = getLocalStore();
    store.sessions.unshift(newSession);
    saveLocalStore(store);
    return newSession;
  },

  // --- CLASSES ---
  async getClasses(): Promise<SchoolClass[]> {
    if (supabase) {
      const { data, error } = await supabase.from("school_classes").select("*").order("numeric_name", { ascending: true });
      if (!error && data) return data as SchoolClass[];
    }
    return getLocalStore().classes;
  },

  async createClass(cls: Omit<SchoolClass, "id">): Promise<SchoolClass> {
    const newClass = { ...cls, id: `cls-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("school_classes").insert([newClass]).select().single();
      if (!error && data) return data as SchoolClass;
    }
    const store = getLocalStore();
    store.classes.push(newClass);
    saveLocalStore(store);
    return newClass;
  },

  // --- SECTIONS ---
  async getSections(classId?: string): Promise<Section[]> {
    if (supabase) {
      let query = supabase.from("sections").select("*");
      if (classId) query = query.eq("class_id", classId);
      const { data, error } = await query;
      if (!error && data) return data as Section[];
    }
    const sections = getLocalStore().sections;
    return classId ? sections.filter((s) => s.class_id === classId) : sections;
  },

  async createSection(sec: Omit<Section, "id">): Promise<Section> {
    const newSection = { ...sec, id: `sec-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("sections").insert([newSection]).select().single();
      if (!error && data) return data as Section;
    }
    const store = getLocalStore();
    store.sections.push(newSection);
    saveLocalStore(store);
    return newSection;
  },

  // --- COURSES ---
  async getCourses(classId?: string): Promise<Course[]> {
    if (supabase) {
      let query = supabase.from("courses").select("*");
      if (classId) query = query.eq("class_id", classId);
      const { data, error } = await query;
      if (!error && data) return data as Course[];
    }
    const courses = getLocalStore().courses;
    return classId ? courses.filter((c) => c.class_id === classId) : courses;
  },

  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    const newCourse = { ...course, id: `crs-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("courses").insert([newCourse]).select().single();
      if (!error && data) return data as Course;
    }
    const store = getLocalStore();
    store.courses.push(newCourse);
    saveLocalStore(store);
    return newCourse;
  },

  // --- TEACHERS ---
  async getTeachers(): Promise<Teacher[]> {
    if (supabase) {
      const { data, error } = await supabase.from("teachers").select("*").order("first_name", { ascending: true });
      if (!error && data) return data as Teacher[];
    }
    return getLocalStore().teachers;
  },

  async createTeacher(teacher: Omit<Teacher, "id">): Promise<Teacher> {
    const newTeacher = { ...teacher, id: `tch-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("teachers").insert([newTeacher]).select().single();
      if (!error && data) return data as Teacher;
    }
    const store = getLocalStore();
    store.teachers.push(newTeacher);
    saveLocalStore(store);
    return newTeacher;
  },

  // --- STUDENTS ---
  async getStudents(classId?: string, sectionId?: string): Promise<Student[]> {
    if (supabase) {
      let query = supabase.from("students").select(`
        *,
        student_academic_records (
          class_id,
          section_id,
          roll_number,
          school_classes ( name ),
          sections ( name )
        )
      `);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          class_id: d.student_academic_records?.[0]?.class_id,
          section_id: d.student_academic_records?.[0]?.section_id,
          roll_number: d.student_academic_records?.[0]?.roll_number,
          class_name: d.student_academic_records?.[0]?.school_classes?.name,
          section_name: d.student_academic_records?.[0]?.sections?.name,
        }));
      }
    }
    let students = getLocalStore().students;
    if (classId) students = students.filter((s) => s.class_id === classId);
    if (sectionId) students = students.filter((s) => s.section_id === sectionId);
    return students;
  },

  async createStudent(student: Omit<Student, "id">): Promise<Student> {
    const newStudent = { ...student, id: `stu-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("students").insert([newStudent]).select().single();
      if (!error && data) return data as Student;
    }
    const store = getLocalStore();
    store.students.push(newStudent);
    saveLocalStore(store);
    return newStudent;
  },

  // --- ATTENDANCE ---
  async getAttendance(date: string, sectionId?: string): Promise<AttendanceRecord[]> {
    if (supabase) {
      let query = supabase.from("attendances").select("*").eq("date", date);
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (!error && data) return data as AttendanceRecord[];
    }
    const records = getLocalStore().attendances;
    return records.filter((r) => r.date === date && (!sectionId || r.section_id === sectionId));
  },

  async recordAttendance(records: Omit<AttendanceRecord, "id">[]): Promise<void> {
    const store = getLocalStore();
    for (const rec of records) {
      const index = store.attendances.findIndex(
        (a) => a.student_id === rec.student_id && a.date === rec.date && a.section_id === rec.section_id
      );
      if (index >= 0) {
        store.attendances[index] = { ...rec, id: store.attendances[index].id };
      } else {
        store.attendances.push({ ...rec, id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` });
      }
    }
    saveLocalStore(store);

    if (supabase) {
      await supabase.from("attendances").upsert(records, { onConflict: "student_id,section_id,date" });
    }
  },

  // --- NOTICES ---
  async getNotices(): Promise<Notice[]> {
    if (supabase) {
      const { data, error } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as Notice[];
    }
    return getLocalStore().notices;
  },

  async createNotice(notice: Omit<Notice, "id" | "created_at">): Promise<Notice> {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      created_at: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    if (supabase) {
      const { data, error } = await supabase.from("notices").insert([newNotice]).select().single();
      if (!error && data) return data as Notice;
    }
    const store = getLocalStore();
    store.notices.unshift(newNotice);
    saveLocalStore(store);
    return newNotice;
  },

  // --- CALENDAR EVENTS ---
  async getEvents(): Promise<CalendarEvent[]> {
    if (supabase) {
      const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true });
      if (!error && data) return data as CalendarEvent[];
    }
    return getLocalStore().events;
  },

  async createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    const newEvent = { ...event, id: `ev-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("events").insert([newEvent]).select().single();
      if (!error && data) return data as CalendarEvent;
    }
    const store = getLocalStore();
    store.events.push(newEvent);
    saveLocalStore(store);
    return newEvent;
  },

  // --- TIMETABLE / ROUTINES ---
  async getRoutines(classId?: string, sectionId?: string): Promise<RoutineSlot[]> {
    if (supabase) {
      let query = supabase.from("routines").select("*");
      if (classId) query = query.eq("class_id", classId);
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (!error && data) return data as RoutineSlot[];
    }
    let routines = getLocalStore().routines;
    if (classId) routines = routines.filter((r) => r.class_id === classId);
    if (sectionId) routines = routines.filter((r) => r.section_id === sectionId);
    return routines;
  },

  async createRoutine(routine: Omit<RoutineSlot, "id">): Promise<RoutineSlot> {
    const newRoutine = { ...routine, id: `rt-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("routines").insert([newRoutine]).select().single();
      if (!error && data) return data as RoutineSlot;
    }
    const store = getLocalStore();
    store.routines.push(newRoutine);
    saveLocalStore(store);
    return newRoutine;
  },

  // --- EXAMS ---
  async getExams(classId?: string): Promise<Exam[]> {
    if (supabase) {
      let query = supabase.from("exams").select("*");
      if (classId) query = query.eq("class_id", classId);
      const { data, error } = await query;
      if (!error && data) return data as Exam[];
    }
    let exams = getLocalStore().exams;
    if (classId) exams = exams.filter((e) => e.class_id === classId);
    return exams;
  },

  async createExam(exam: Omit<Exam, "id">): Promise<Exam> {
    const newExam = { ...exam, id: `ex-${Date.now()}` };
    if (supabase) {
      const { data, error } = await supabase.from("exams").insert([newExam]).select().single();
      if (!error && data) return data as Exam;
    }
    const store = getLocalStore();
    store.exams.push(newExam);
    saveLocalStore(store);
    return newExam;
  },
};
