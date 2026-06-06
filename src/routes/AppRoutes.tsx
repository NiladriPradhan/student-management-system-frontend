import { useRoutes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import Login from "../pages/auth/Login";
import Home from "../pages/common/Home";
import NotFound from "../pages/common/NotFound";
import { adminRoutes } from "./AdminRoutes";
import { studentRoutes } from "./StudentRoutes";
import { teacherRoutes } from "./TeacherRoutes";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const appRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: adminRoutes,
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: studentRoutes,
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: teacherRoutes,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default function AppRoutes() {
  return useRoutes(appRoutes);
}
