// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { AuthTokens, User } from '../types/auth';
import { getCookie, setCookie, eraseCookie } from '../lib/utils'; // Import cookie utilities

// const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
const API_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include access token in requests
api.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
        !originalRequest.url?.includes('/auth/refresh') && // Ensure this is '/auth/refresh'
        !originalRequest.url?.includes('/auth/login') // Ensure this is '/auth/login'
    ) {
      try {
          // Attempt refresh using HttpOnly cookie on the server (no client-side access needed)
          const { data } = await api.post('/auth/refresh');
        
        // Store new tokens in cookies
        setCookie('accessToken', data.accessToken, 7); // 7 days
        // If server returns a refreshToken in response body, update non-HttpOnly copy if needed
        if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 30);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies and redirect to login on refresh failure
        eraseCookie('accessToken');
        eraseCookie('refreshToken');
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

export const refresh = async (refreshToken?: string) => {
  // If a refreshToken is provided (non-HttpOnly), include it in the body; otherwise rely on HttpOnly cookie
  const payload = refreshToken ? { refreshToken } : undefined;
  const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
    '/auth/refresh',
    payload
  );
  return response.data;
};

export default api;