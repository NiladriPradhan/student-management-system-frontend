export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser {
  id: number;
  username: string;
  name?: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
