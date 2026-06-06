import type { AuthUser } from "../types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const clearStoredAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const saveAuth = (
  token: string,
  user: AuthUser,
  rememberMe: boolean,
): void => {
  clearStoredAuth();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const saveUser = (user: AuthUser): void => {
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthUser | null => {
  const storedUser =
    localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    logout();
    return null;
  }
};

export const logout = (): void => {
  clearStoredAuth();
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
};
