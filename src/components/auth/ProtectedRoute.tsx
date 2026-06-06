import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getUser } from "../../utils/auth";
import type { UserRole } from "../../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

const getRoleDashboardPath = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    default:
      return "/login";
  }
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
