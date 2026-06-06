import type { RouteObject } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import AddStudent from "../pages/admin/AddStudent";
import EditStudent from "../pages/admin/EditStudent";
import Teachers from "../pages/admin/Teachers";
import Classes from "../pages/admin/Classes";
import Settings from "../pages/admin/Settings";
import Attendance from "../pages/admin/Attendance";
import SchedulePage from "../pages/admin/SchedulePage";

export const adminRoutes: RouteObject[] = [
  { index: true, element: <Dashboard /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "students", element: <Students /> },
  { path: "teachers", element: <Teachers /> },
  { path: "classes", element: <Classes /> },
  { path: "schedules", element: <SchedulePage /> },
  { path: "attendance", element: <Attendance /> },
  { path: "settings", element: <Settings /> },
  { path: "students/create", element: <AddStudent /> },
  { path: "students/add", element: <AddStudent /> },
  { path: "students/:id/edit", element: <EditStudent /> },
];
