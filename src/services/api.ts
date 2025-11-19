// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { AuthTokens, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
// const API_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include access token in requests
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/refresh') &&
      !originalRequest.url?.includes('/login')
    ) {
      try {
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const { data } = await api.post('/auth/refresh', {
          refreshToken: auth?.tokens?.refreshToken,
        });
        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: data.user,
            tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken },
            isLoading: false,
          })
        );
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const signup = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  password: string;
}) => {
  const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
    '/auth/signup',
    data
  );
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
    '/auth/login',
    data
  );
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const refresh = async (refreshToken: string) => {
  const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
    '/auth/refresh',
    { refreshToken }
  );
  return response.data;
};

export default api;