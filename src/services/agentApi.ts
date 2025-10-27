// src/services/agentApi.ts
import axios, { AxiosError } from 'axios';
import { Agent } from '../types/agent';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance for agent-related requests
const agentApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to include access token
agentApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Interceptor for token refresh on 401
agentApi.interceptors.response.use(
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
        return agentApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchAgents = async (): Promise<Agent[]> => {
  const response = await agentApi.get<Agent[]>('/agents');
  return response.data;
};

export const createAgent = async (data: {
  name: string;
  personality: string;
  voice: string;
  avatar: string;
  description: string;
}): Promise<Agent> => {
  const response = await agentApi.post<Agent>('/createagent', data);
  return response.data;
};

export const toggleAgentStatus = async (agentId: string): Promise<Agent> => {
  const response = await agentApi.patch<Agent>(`/${agentId}/toggle`);
  return response.data;
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  await agentApi.delete(`/${agentId}`);
};

export const generateQRCode = async (agentId: string): Promise<string> => {
  const response = await agentApi.get(`/${agentId}/qr`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
};

export const getAgentPublic = async (id: string) => {
  const res = await agentApi.get(`/${id}/public`);
  return res.data;
};

// Get chat history for a session
export const getAgentHistory = async (id: string, sessionId: string) => {
  const res = await agentApi.get(`/${id}/history`, { 
    params: { sessionId } 
  });
  return res.data.history || [];
};

// Send message to agent - FIXED ROUTE
export const chatWithAgent = async (agentId: string, sessionId: string, message: string) => {
  const response = await agentApi.post(`/${agentId}/chat`, {
    sessionId,
    message,
  });
  return response.data;
};

// Book a property visit - FIXED to use axios
export const bookPropertyVisit = async (
  agentId: string, 
  sessionId: string, 
  propertyId: string | null, 
  dateTime: Date, 
  contactInfo: any
) => {
  console.log('📅 Booking visit with data:', {
    agentId, sessionId, propertyId, dateTime, contactInfo
  });

  // Format date properly
  let formattedDateTime;
  try {
    if (dateTime instanceof Date) {
      formattedDateTime = dateTime.toISOString();
    } else if (typeof dateTime === 'string') {
      const parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      formattedDateTime = parsedDate.toISOString();
    } else {
      throw new Error('Date is required');
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    throw new Error('Please provide a valid date and time');
  }

  const bookingData = {
    sessionId,
    propertyId: propertyId || null,
    dateTime: formattedDateTime,
    buyerName: contactInfo.name,
    buyerEmail: contactInfo.email,
    buyerPhone: contactInfo.phone,
    notes: contactInfo.notes || `Booking from chat session - ${new Date().toLocaleString()}`
  };

  console.log('📦 Sending booking data:', bookingData);

  // Use axios instead of fetch
  const response = await agentApi.post(`/${agentId}/book`, bookingData);
  return response.data;
};

// Qualify lead - FIXED to use axios
export const qualifyLead = async (agentId: string, sessionId: string, qualificationData: any) => {
  const response = await agentApi.post(`/${agentId}/qualify`, {
    sessionId,
    ...qualificationData
  });
  return response.data;
};

// Get lead status - FIXED ROUTE
export const getLeadStatus = async (agentId: string, sessionId: string) => {
  const response = await agentApi.get(`/${agentId}/lead-status/${sessionId}`);
  return response.data;
};

export default agentApi;