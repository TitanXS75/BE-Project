import React from "react";
import { AdminTab } from "../types";
import { AdminDashboard } from "./AdminDashboard";
import { AcademicManager } from "./AcademicManager";
import { StudentDirectory } from "./StudentDirectory";
import { TeacherDirectory } from "./TeacherDirectory";
import { AttendanceTracker } from "./AttendanceTracker";
import { ExamGradeCenter } from "./ExamGradeCenter";
import { TimetablePlanner } from "./TimetablePlanner";
import { NoticeBoardView } from "./NoticeBoardView";
import { CalendarEventsView } from "./CalendarEventsView";

interface AdminWorkspaceProps {
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
}

export function AdminWorkspace({ adminTab, setAdminTab }: AdminWorkspaceProps) {
  return (
    <div className="flex-1 w-full overflow-y-auto p-4 sm:p-8">
      {adminTab === "dashboard" && <AdminDashboard onNavigateTab={setAdminTab} />}
      {adminTab === "academic" && <AcademicManager />}
      {adminTab === "students" && <StudentDirectory />}
      {adminTab === "teachers" && <TeacherDirectory />}
      {adminTab === "attendance" && <AttendanceTracker />}
      {adminTab === "exams" && <ExamGradeCenter />}
      {adminTab === "timetable" && <TimetablePlanner />}
      {adminTab === "notices" && <NoticeBoardView />}
      {adminTab === "events" && <CalendarEventsView />}
    </div>
  );
}
