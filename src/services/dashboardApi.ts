// src/services/dashboardApi.ts
import axios, { AxiosError } from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
const API_URL =  'http://localhost:5000/api';


const dashboardApi = axios.create({
  baseURL: `${API_URL}/dashboard`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token
dashboardApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Refresh token handler
dashboardApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh')
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
            tokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
            isLoading: false,
          })
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return dashboardApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Updated API calls to match backend routes
export const fetchDashboardStats = async () => {
  const response = await dashboardApi.get('/overview');
  return response.data;
};

export const fetchRecentActivity = async (limit = 10) => {
  const response = await dashboardApi.get(`/activity?limit=${limit}`);
  return response.data.activity;
};

export const fetchTopAgents = async (limit = 5) => {
  const response = await dashboardApi.get(`/agents/top?limit=${limit}`);
  return response.data.agents;
};

export const fetchLeadsTrend = async (days = 30) => {
  const response = await dashboardApi.get(`/trend/leads?days=${days}`);
  return response.data.trend;
};

export const fetchVisitConversion = async () => {
  const response = await dashboardApi.get('/visits/conversion');
  return response.data;
};

export default dashboardApi;