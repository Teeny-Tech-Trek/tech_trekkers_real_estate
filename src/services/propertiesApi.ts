// src/services/propertiesApi.ts
import axios, { AxiosError } from 'axios';
import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';

// Axios instance for property-related requests
const propertiesApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to include access token
propertiesApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Response interceptor for 401 token refresh
propertiesApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      try {
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
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
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return propertiesApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const fetchProperties = async (): Promise<Property[]> => {
  const response = await propertiesApi.get<Property[]>('/properties/list');
  return response.data;
};

export const createProperty = async (data: FormData): Promise<Property> => {
  // Let Axios automatically set Content-Type for FormData
  const response = await propertiesApi.post<Property>('/properties/create', data);
  return response.data;
};

export const updateProperty = async (id: string, data: FormData): Promise<Property> => {
  const response = await propertiesApi.put<Property>(`/properties/update/${id}`, data);
  return response.data;
};

export const toggleFavoriteProperty = async (id: string): Promise<Property> => {
  const response = await propertiesApi.patch<Property>(`/properties/${id}/toggle-favorite`, {});
  return response.data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  await propertiesApi.delete(`/properties/${id}`);
};

export default propertiesApi;
