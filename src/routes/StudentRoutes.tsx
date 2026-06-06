import type { RouteObject } from "react-router-dom";
import StudentDashboard from "../pages/student/StudentDashboard";
import MyCourse from "../pages/student/MyCourse";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentAssignments from "../pages/student/StudentAssignments";
import StudentGrade from "../pages/student/StudentGrade";
import StudentProfile from "../pages/student/StudentProfile";
import Settings from "../pages/student/Settings";
import Messages from "../pages/student/Messages";

export const studentRoutes: RouteObject[] = [
  { index: true, element: <StudentDashboard /> },
  { path: "dashboard", element: <StudentDashboard /> },
  { path: "my-course", element: <MyCourse /> },
  { path: "attendance", element: <StudentAttendance /> },
  { path: "assignments", element: <StudentAssignments /> },
  { path: "grades", element: <StudentGrade /> },
  { path: "messages", element: <Messages /> },
  { path: "profile", element: <StudentProfile /> },
  { path: "settings", element: <Settings /> },
];
