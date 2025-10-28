// src/services/settingsApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';

// Create Axios instance for settings-related requests
const settingsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to include access token
settingsApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

// Interceptor for token refresh on 401
settingsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
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
        return settingsApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface TeamMember {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    createdAt: string;
  };
  role: 'admin' | 'member' | 'agent';
  joinedAt: string;
}

export interface Invite {
  _id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  invitedBy: {
    firstName: string;
    lastName: string;
  };
}

export interface Organization {
  _id: string;
  name: string;
  billing: {
    companyName?: string;
    address?: string;
    phone?: string;
    realEstateLicense?: string;
  };
  plan: {
    name: string;
    seats: number;
    agentsLimit: number;
    propertiesLimit: number;
    price: number;
  };
  members: TeamMember[];
  usage: {
    agents: number;
    properties: number;
    members: number;
  };
}

export interface BillingInfo {
  plan: {
    name: string;
    price: number;
    agentsLimit: number;
    propertiesLimit: number;
    seats: number;
  };
  billing: {
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    invoices: any[];
  };
  usage: {
    agents: {
      used: number;
      limit: number;
      percent: number;
    };
    properties: {
      used: number;
      limit: number;
      percent: number;
    };
    members: {
      used: number;
      limit: number;
      percent: number;
    };
  };
  pricingTiers: {
    free: any;
    pro: any;
    enterprise: any;
  };
}

export interface Integration {
  type: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  lastSync?: string;
  settings?: any;
}

export interface NotificationSettings {
  emailNotifications: {
    newLeads: boolean;
    propertyShowings: boolean;
    offerUpdates: boolean;
    dailyPerformance: boolean;
    marketTrends: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    newLeads: boolean;
    urgentAlerts: boolean;
    bookingReminders: boolean;
  };
  smsNotifications: {
    newLeads: boolean;
    showingReminders: boolean;
    offerDeadlines: boolean;
  };
}

export interface ZillowCredentials {
  zwsId: string;
  apiKey: string;
  settings?: {
    syncProperties: boolean;
    syncLeads: boolean;
    autoImport: boolean;
    syncInterval: string;
  };
}

export interface RealtorCredentials {
  apiKey: string;
  secret: string;
  settings?: {
    syncProperties: boolean;
    syncLeads: boolean;
    autoImport: boolean;
    syncInterval: string;
  };
}

// Organization Settings
export const getOrganization = async (): Promise<Organization> => {
  const response = await settingsApi.get('/settings/organization');
  return response.data;
};

export const updateOrganization = async (data: { name: string; billing: any }): Promise<Organization> => {
  const response = await settingsApi.put('/settings/organization/update', data);
  return response.data;
};

// Team Management
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await settingsApi.get('/settings/organization/team');
  return response.data;
};

export const getPendingInvites = async (): Promise<Invite[]> => {
  const response = await settingsApi.get('/settings/organization/invites');
  return response.data;
};

export const inviteMember = async (data: { email: string; role: string }): Promise<{ message: string }> => {
  const response = await settingsApi.post('/auth/invite', data);
  return response.data;
};

export const revokeInvite = async (inviteId: string): Promise<void> => {
  await settingsApi.delete(`/settings/organization/invites/${inviteId}`);
};

export const removeTeamMember = async (memberId: string): Promise<void> => {
  await settingsApi.delete(`/settings/organization/team/${memberId}`);
};

export const updateMemberRole = async (memberId: string, role: string): Promise<TeamMember> => {
  const response = await settingsApi.patch(`/settings/organization/team/${memberId}`, { role });
  return response.data;
};

// Billing & Subscription
export const getBillingInfo = async (): Promise<BillingInfo> => {
  const response = await settingsApi.get('/settings/billing');
  return response.data;
};

export const updateSubscription = async (planId: string): Promise<{ message: string; plan: any }> => {
  const response = await settingsApi.post('/settings/billing/subscribe', { planId });
  return response.data;
};

export const getInvoices = async (): Promise<any[]> => {
  const response = await settingsApi.get('/settings/billing/invoices');
  return response.data;
};

export const createTestInvoice = async (): Promise<any> => {
  const response = await settingsApi.post('/settings/billing/invoices/test');
  return response.data;
};

// Integrations
export const getIntegrations = async (): Promise<Integration[]> => {
  const response = await settingsApi.get('/settings/integrations');
  return response.data;
};

export const connectZillow = async (credentials: ZillowCredentials): Promise<{ message: string; integration: any }> => {
  const response = await settingsApi.post('/settings/integrations/zillow', credentials);
  return response.data;
};

export const connectRealtor = async (credentials: RealtorCredentials): Promise<{ message: string; integration: any }> => {
  const response = await settingsApi.post('/settings/integrations/realtor', credentials);
  return response.data;
};

export const disconnectIntegration = async (type: string): Promise<{ message: string }> => {
  const response = await settingsApi.delete(`/settings/integrations/${type}`);
  return response.data;
};

export const syncIntegration = async (type: string): Promise<{ message: string }> => {
  const response = await settingsApi.post(`/settings/integrations/${type}/sync`);
  return response.data;
};

// Notifications
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await settingsApi.get('/settings/user/notifications');
  return response.data;
};

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<{ message: string; settings: NotificationSettings }> => {
  const response = await settingsApi.put('/settings/user/notifications', settings);
  return response.data;
};

export default settingsApi;