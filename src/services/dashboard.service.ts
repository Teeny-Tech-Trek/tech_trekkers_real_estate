/**
 * Dashboard Service
 * 
 * Handles all API calls related to the dashboard feature.
 * Uses the existing axios instance with automatic token management.
 * 
 * Architecture: Services → Logics → UI Components
 */

import api from '@/config/apiConfig';
import React from 'react';
import { calculateTrend, getAgentInitials } from '../lib/dashboardUtils';

/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */

export interface DashboardHeader {
  userInfo?: {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'individual' | 'agent';
    accountType?: string;
    organization?: {
      id: string;
      name: string;
      plan: string;
      isActive: boolean;
    };
  };
}

export interface KPIMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: 'cyan' | 'blue' | 'purple' | 'green' | 'emerald';
}

export interface LeadTrendDataPoint {
  date: string;
  total: number;
  closed: number;
  interested?: number;
  new?: number;
  newLeads?: number; // For backward compatibility
}

export interface ConversionStats {
  totalVisits: number;
  qualifiedLeads: number;
  closedDeals: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'lead' | 'visit' | 'chat' | 'deal' | 'property';
  title: string;
  time: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'cyan' | 'blue' | 'purple' | 'green';
  status?: string;
  leadQuality?: string;
  agent?: {
    id: string;
    name: string;
    avatar: string;
  };
  property?: {
    id: string;
    title: string;
  };
  createdAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  conversions: number;
  revenue: number;
  avatar: string;
  trend?: number;
  status?: string;
  totalLeads?: number;
  closedLeads?: number;
  conversionRate?: string | number;
  visits?: number;
  revenueFormatted?: string;
}

export interface DashboardStats {
  userInfo?: {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'individual' | 'agent';
    accountType?: string;
    organization?: {
      id: string;
      name: string;
      plan: string;
      isActive: boolean;
    };
  };
  summary?: {
    totalLeads: number;
    totalProperties: number;
    totalVisits: number;
    totalChats: number;
    totalRevenue: number;
    totalRevenueFormatted?: string;
    conversionRate: number;
    closedLeads?: number;
    activeAgents?: number;
  };
  leadsBreakdown?: {
    byStatus?: Record<string, number>;
    byQuality?: Record<string, number>;
    total?: number;
  };
  myAgents?: Agent[];
  recentActivities?: RecentActivity[];
}

/**
 * ============================================================================
 * API ENDPOINTS
 * ============================================================================
 */

/**
 * Get all dashboard data from the personal dashboard endpoint.
 * This includes user info, KPIs, summary, and recent activities.
 * This single call prevents redundant network requests.
 */
export const getDashboardData = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get('/dashboard/overview');
    // Ensure we robustly handle the response, providing a default structure if data is missing.
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    // Return a safe default structure to avoid null-state UI failures.
    return {
      summary: {
        totalLeads: 0,
        totalProperties: 0,
        totalVisits: 0,
        totalChats: 0,
        totalRevenue: 0,
        conversionRate: 0,
      },
      leadsBreakdown: {
        byStatus: {},
        byQuality: {},
        total: 0,
      },
      myAgents: [],
      recentActivities: [],
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};


/**
 * Get leads trend data for chart
 * Returns daily lead counts (new leads vs closed) for specified number of days
 *
 * @param days - Number of days to fetch (1-365, default: 30)
 */
export const getLeadsTrend = async (days: number = 30): Promise<LeadTrendDataPoint[]> => {
  try {
    const res = await api.get(`/dashboard/trends/leads?days=${days}`);
    if (res.data?.success && res.data?.data) {
      // Transform backend data to UI format
      return res.data.data.map((point: LeadTrendDataPoint) => ({
        date: point.date,
        total: point.total,
        closed: point.closed,
        interested: point.interested,
        new: point.new,
        // For backward compatibility with old chart expectations
        newLeads: point.total - point.closed,
      }));
    }
    // Always return an empty array if data is missing or not successful
    return [];
  } catch (error) {
    console.error('Error fetching leads trend:', error);
    return [];
  }
};

/**
 * Get top performing agents
 * Returns agents sorted by conversions and revenue
 *
 * @param limit - Number of agents to fetch (default: 5)
 */
export const getTopAgents = async (limit: number = 5): Promise<Agent[]> => {
  try {
    const res = await api.get(`/dashboard/top-agents?limit=${limit}`);
    if (res.data?.success && res.data?.data) {
      return res.data.data.map((agent: Agent) => ({
        id: agent.id,
        name: agent.name,
        conversions: agent.closedLeads || 0,
        revenue: agent.revenue || 0,
        avatar: getAgentInitials(agent.name),
        trend: calculateTrend(agent),
        status: agent.status,
        totalLeads: agent.totalLeads,
        closedLeads: agent.closedLeads,
        conversionRate: agent.conversionRate,
        visits: agent.visits,
        revenueFormatted: agent.revenueFormatted,
      }));
    }
    // Always return an empty array if data is missing or not successful
    return [];
  } catch (error) {
    console.error('Error fetching top agents:', error);
    return [];
  }
};



/**
 * ============================================================================
 * SERVICE EXPORT
 * ============================================================================
 */

export const dashboardService = {
  getDashboardData,
  getLeadsTrend,
  getTopAgents,
};

export default dashboardService;
