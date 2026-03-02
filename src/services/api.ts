import { AuthResponse, SignupData } from "../types/auth";
import api from "../config/apiConfig";
import { eraseCookie, getCookie } from "../lib/utils";

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    eraseCookie("accessToken");
    eraseCookie("refreshToken");
  }
};

export const refresh = async (refreshToken?: string): Promise<AuthResponse> => {
  const payload = refreshToken ? { refreshToken } : undefined;
  const response = await api.post<AuthResponse>("/auth/refresh", payload);
  return response.data;
};

export const isAuthenticated = (): boolean => Boolean(getCookie("accessToken"));

export const getAccessToken = (): string | null => getCookie("accessToken");

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export default api;
