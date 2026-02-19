// // src/services/api.ts
// import axios, { AxiosError } from 'axios';
// import { AuthTokens, User } from '../types/auth';
// import { getCookie, setCookie, eraseCookie } from '../lib/utils'; // Import cookie utilities

// // const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
// const API_URL =  'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add interceptor to include access token in requests
// api.interceptors.request.use((config) => {
//   const accessToken = getCookie('accessToken');
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// // Handle token refresh on 401 errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config;
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//         !originalRequest.url?.includes('/auth/refresh') && // Ensure this is '/auth/refresh'
//         !originalRequest.url?.includes('/auth/login') // Ensure this is '/auth/login'
//     ) {
//       try {
//           // Attempt refresh using HttpOnly cookie on the server (no client-side access needed)
//           const { data } = await api.post('/auth/refresh');
        
//         // Store new tokens in cookies
//         setCookie('accessToken', data.accessToken, 7); // 7 days
//         // If server returns a refreshToken in response body, update non-HttpOnly copy if needed
//         if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 30);

//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Clear cookies and redirect to login on refresh failure
//         eraseCookie('accessToken');
//         eraseCookie('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const signup = async (data: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   company?: string;
//   password: string;
// }) => {
//   const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
//     '/auth/signup',
//     data
//   );
//   return response.data;
// };

// export const login = async (data: { email: string; password: string }) => {
//   const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
//     '/auth/login',
//     data
//   );
//   return response.data;
// };

// export const logout = async () => {
//   await api.post('/auth/logout');
// };

// export const refresh = async (refreshToken?: string) => {
//   // If a refreshToken is provided (non-HttpOnly), include it in the body; otherwise rely on HttpOnly cookie
//   const payload = refreshToken ? { refreshToken } : undefined;
//   const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
//     '/auth/refresh',
//     payload
//   );
//   return response.data;
// };

// export default api;

// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { AuthTokens, User, AuthResponse } from '../types/auth';
import { getCookie, setCookie, eraseCookie } from '../lib/utils';

// const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include access token
api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Don't retry on these endpoints
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/signup')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt refresh using HttpOnly cookie on the server
        const { data } = await api.post<AuthResponse>('/auth/refresh');

        // Store new tokens in cookies
        setCookie('accessToken', data.accessToken, 7); // 7 days
        if (data.refreshToken) {
          setCookie('refreshToken', data.refreshToken, 30); // 30 days
        }

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies and redirect to login on refresh failure
        eraseCookie('accessToken');
        eraseCookie('refreshToken');
        
        // Only redirect if not already on login/signup page
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle specific error responses
    if (error.response?.data) {
      const errorData = error.response.data as any;
      if (errorData.error || errorData.message) {
        const errorMessage = errorData.error || errorData.message;
        return Promise.reject(new Error(errorMessage));
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const signup = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  accountType: 'individual' | 'organization';
  company?: string;
}): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    
    // Validate response data
    if (!response.data.user || !response.data.accessToken) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Signup failed. Please try again.');
  }
};

export const login = async (data: { 
  email: string; 
  password: string; 
}): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Validate response data
    if (!response.data.user || !response.data.accessToken) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Even if logout fails on server, we clear local data
    console.error('Logout error:', error);
  } finally {
    // Always clear cookies on logout
    eraseCookie('accessToken');
    eraseCookie('refreshToken');
  }
};

export const refresh = async (refreshToken?: string): Promise<AuthResponse> => {
  try {
    // If a refreshToken is provided (non-HttpOnly), include it in the body
    // Otherwise rely on HttpOnly cookie
    const payload = refreshToken ? { refreshToken } : undefined;
    const response = await api.post<AuthResponse>('/auth/refresh', payload);
    
    // Validate response data
    if (!response.data.user || !response.data.accessToken) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Session refresh failed. Please login again.');
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCookie('accessToken');
};

// Helper function to get current access token
export const getAccessToken = (): string | null => {
  return getCookie('accessToken');
};

export default api;