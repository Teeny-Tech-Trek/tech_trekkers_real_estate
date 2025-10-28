import axios, { AxiosError } from 'axios';
import { ApiLead, ApiVisit, Lead, Visit, mapApiLeadToLead, mapApiVisitToVisit } from '../types/lead';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';

// Axios instance for lead and visit-related requests
const leadApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to include access token
leadApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Response interceptor for 401 token refresh
leadApi.interceptors.response.use(
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
        return leadApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Lead API functions
export const fetchLeads = async (filter = {}): Promise<Lead[]> => {
  const response = await leadApi.get<ApiLead[]>('/leads', { params: filter });
  return response.data.map(mapApiLeadToLead);
};

export const fetchLeadById = async (id: string): Promise<Lead> => {
  const response = await leadApi.get<ApiLead>(`/leads/${id}`);
  return mapApiLeadToLead(response.data);
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const apiData = {
    qualification: {
      contactInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      bedrooms: data.property?.match(/\d+/) ? parseInt(data.property.match(/\d+/)[0]) : undefined,
    },
    leadScore: data.score,
    status: data.status,
    agent: data.assignedAgent,
    sessionId: data.source === "Chat Session" ? "generated-session-id" : undefined,
  };
  const response = await leadApi.post<ApiLead>('/leads', apiData);
  return mapApiLeadToLead(response.data);
};

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  const apiData = {
    qualification: {
      contactInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      bedrooms: data.property?.match(/\d+/) ? parseInt(data.property.match(/\d+/)[0]) : undefined,
    },
    leadScore: data.score,
    status: data.status,
    agent: data.assignedAgent,
  };
  const response = await leadApi.put<ApiLead>(`/leads/${id}`, apiData);
  return mapApiLeadToLead(response.data);
};

export const deleteLead = async (id: string): Promise<void> => {
  await leadApi.delete(`/leads/${id}`);
};

// Visit API functions
export const fetchVisits = async (filter = {}): Promise<Visit[]> => {
  const response = await leadApi.get<ApiVisit[]>('/visits', { params: filter });
  return response.data.map(mapApiVisitToVisit);
};

export const fetchVisitById = async (id: string): Promise<Visit> => {
  const response = await leadApi.get<ApiVisit>(`/visits/${id}`);
  return mapApiVisitToVisit(response.data);
};

export const createVisit = async (data: Partial<Visit>): Promise<Visit> => {
  const dateTime = new Date(`${data.date}T${data.time}`);
  const apiData = {
    buyerName: data.leadName,
    buyerEmail: data.leadEmail,
    buyerPhone: data.leadPhone,
    property: data.property,
    dateTime: dateTime.toISOString(),
    notes: data.notes,
    agent: data.assignedAgent,
  };
  const response = await leadApi.post<ApiVisit>('/visits', apiData);
  return mapApiVisitToVisit(response.data);
};

export const updateVisit = async (id: string, data: Partial<Visit>): Promise<Visit> => {
  const dateTime = new Date(`${data.date}T${data.time}`);
  const apiData = {
    buyerName: data.leadName,
    buyerEmail: data.leadEmail,
    buyerPhone: data.leadPhone,
    property: data.property,
    dateTime: dateTime.toISOString(),
    notes: data.notes,
    agent: data.assignedAgent,
  };
  const response = await leadApi.put<ApiVisit>(`/visits/${id}`, apiData);
  return mapApiVisitToVisit(response.data);
};

export const deleteVisit = async (id: string): Promise<void> => {
  await leadApi.delete(`/visits/${id}`);
};

export default leadApi;