import axios, { AxiosError } from "axios";
import { getToken, logout } from "../utils/auth";

const RAW_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = RAW_API_BASE.replace(/\/$/, "") + "/api";

export const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_URL || RAW_API_BASE.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      logout();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const backendMessage =
      typeof error.response?.data === "object" &&
      error.response?.data &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : "";

    if (backendMessage) {
      return backendMessage;
    }

    if (error.response?.status === 400) {
      return "Please check the submitted details and try again.";
    }

    if (error.response?.status === 401) {
      return "Your session has expired. Please log in again.";
    }

    if (error.response?.status === 404) {
      return "The requested record was not found.";
    }

    if (error.response?.status === 409) {
      return "A record with the same details already exists.";
    }

    if (error.response?.status && error.response.status >= 500) {
      return "The server is unavailable right now. Please try again later.";
    }

    if (error.request) {
      return "Network error. Please check your connection and backend server.";
    }
  }

  return "Something went wrong. Please try again.";
};
