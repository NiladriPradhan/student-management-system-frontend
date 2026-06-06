import { api } from "./api";
import { logout as clearStoredAuth } from "../utils/auth";
import type { ApiResponse, AuthPayload, AuthUser, LoginRequest } from "../types/auth";

export const login = async (
  payload: LoginRequest,
): Promise<ApiResponse<AuthPayload>> => {
  const response = await api.post<ApiResponse<AuthPayload>>(
    "/auth/index.php",
    payload,
  );

  return response.data;
};

export const getProfile = async (): Promise<ApiResponse<AuthUser>> => {
  const response = await api.get<ApiResponse<AuthUser>>("/auth/profile.php");

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout.php");
  } finally {
    clearStoredAuth();
  }
};
