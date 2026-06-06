import type { RouteObject } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyClasses from "../pages/teacher/MyClasses";
import Students from "../pages/teacher/Students";
import Assignments from "../pages/teacher/Assignments";
import Attendance from "../pages/teacher/Attendance";
import Grades from "../pages/teacher/Grades";
import Schedule from "../pages/teacher/Schedule";
import Resources from "../pages/teacher/Resources";
import Reports from "../pages/teacher/Reports";
import Messages from "../pages/teacher/Messages";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import TeacherSettings from "../pages/teacher/TeacherSettings";

export const teacherRoutes: RouteObject[] = [
  { index: true, element: <TeacherDashboard /> },
  { path: "dashboard", element: <TeacherDashboard /> },
  { path: "classes", element: <MyClasses /> },
  { path: "students", element: <Students /> },
  { path: "assignments", element: <Assignments /> },
  { path: "attendance", element: <Attendance /> },
  { path: "grades", element: <Grades /> },
  { path: "schedule", element: <Schedule /> },
  { path: "resources", element: <Resources /> },
  { path: "reports", element: <Reports /> },
  { path: "messages", element: <Messages /> },
  { path: "profile", element: <TeacherProfile /> },
  { path: "settings", element: <TeacherSettings /> },
];
