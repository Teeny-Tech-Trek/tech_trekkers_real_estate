/**
 * API Service Layer
 * 
 * This module exports all API endpoints using the centralized axios instance.
 * Authentication and token refresh logic is handled by interceptors in apiConfig.ts
 */

import { User } from '../types/auth';
import api from '../config/apiConfig';

/**
 * Sign up a new user
 */
export const signup = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  password: string;
}) => {
  const response = await api.post<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>('/auth/signup', data);
  return response.data;
};

/**
 * Log in an existing user
 */
export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>('/auth/login', data);
  return response.data;
};

/**
 * Log out the current user
 */
export const logout = async () => {
  await api.post('/auth/logout');
};

/**
 * Refresh the access token
 * 
 * @param refreshToken - Optional refresh token for non-HttpOnly scenarios
 */
export const refresh = async (refreshToken?: string) => {
  const payload = refreshToken ? { refreshToken } : undefined;
  const response = await api.post<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>('/auth/refresh', payload);
  return response.data;
};

export default api;