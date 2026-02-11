    import axios, { AxiosError } from 'axios';
    import { useAtomValue } from 'jotai';
    import { authAtom } from '../atoms/authAtom';

    // const API_URL = import.meta.env.VITE_API_URL || 'https://api.estate.techtrekkers.ai/api';
const API_URL =  'http://localhost:5000/api';


    // Axios instance for analytics-related requests
    const analyticsApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    });

    // Request interceptor to include access token
    analyticsApi.interceptors.request.use((config) => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth?.tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
    }
    return config;
    });

    // Response interceptor for 401 token refresh
    analyticsApi.interceptors.response.use(
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
            return analyticsApi(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('auth');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
        }
        return Promise.reject(error);
    }
    );

    // Interfaces for API responses
    export interface AgentAnalytics {
    name: string;
    status: string;
    conversations: number;
    leadsGenerated: number;
    visitsScheduled: number;
    conversionRate: number;
    avgLeadScore: number;
    revenue: string;
    }

    export interface LeadAnalytics {
    status: string;
    count: number;
    avgLeadScore: number;
    avgBudget: number;
    purposeDistribution: { [key: string]: number };
    timelineDistribution: { [key: string]: number };
    }

    export interface PropertyAnalytics {
    title: string;
    price: number;
    location: string;
    views: number;
    leads: number;
    visits: number;
    conversionRate: number;
    avgLeadScore: number;
    }

    export interface EngagementAnalytics {
    chatStats: {
        totalSessions: number;
        avgMessagesPerSession: number;
        totalPropertyCards: number;
        avgSessionDuration: number;
    };
    visitStats: {
        totalVisits: number;
        visitsByProperty: { property: string; count: number }[];
    };
    }

    export interface ConversionFunnel {
    totalLeads: number;
    funnel: {
        new: number;
        qualifying: number;
        interested: number;
        booked: number;
        closed: number;
        nurture: number;
    };
    }

    // Analytics API functions
    export const fetchAgentAnalytics = async (organizationId: string): Promise<AgentAnalytics[]> => {
    const response = await analyticsApi.get(`/analytics/${organizationId}/agents`);
    return response.data;
    };

    export const fetchLeadAnalytics = async (organizationId: string): Promise<LeadAnalytics[]> => {
    const response = await analyticsApi.get(`/analytics/${organizationId}/leads`);
    return response.data;
    };

    export const fetchPropertyAnalytics = async (organizationId: string): Promise<PropertyAnalytics[]> => {
    const response = await analyticsApi.get(`/analytics/${organizationId}/properties`);
    return response.data;
    };

    export const fetchEngagementAnalytics = async (organizationId: string): Promise<EngagementAnalytics> => {
    const response = await analyticsApi.get(`/analytics/${organizationId}/engagement`);
    return response.data;
    };

    export const fetchConversionFunnel = async (organizationId: string): Promise<ConversionFunnel> => {
    const response = await analyticsApi.get(`/analytics/${organizationId}/funnel`);
    return response.data;
    };

    export default analyticsApi;
