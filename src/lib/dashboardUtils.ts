import React from 'react';
import { Building, MessageSquare, PhoneCall, Trophy, UserPlus } from 'lucide-react';
import type { Agent, RecentActivity } from '../services/dashboard.service';

/**
 * ============================================================================
 * HELPER FUNCTIONS SHARED ACROSS DASHBOARD FEATURES
 * ============================================================================
 */

/**
 * Calculate time ago string from timestamp
 */
export function calculateTimeAgo(createdAt: string | Date | undefined): string {
  if (!createdAt) return 'now';

  const date = new Date(createdAt);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

/**
 * Get icon component for activity type.
 * NOTE: This is a placeholder and should be replaced with actual icon components
 * from an icon library (e.g., 'lucide-react') for proper UI rendering.
 */
export function getActivityIcon(type: string | undefined): React.ComponentType<{ className?: string }> {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    lead: UserPlus,
    visit: PhoneCall,
    chat: MessageSquare,
    deal: Trophy,
    property: Building,
    call: PhoneCall,
  };

  return (type && iconMap[type]) || UserPlus;
}

/**
 * Get color for activity type
 */
export function getActivityColor(type: string | undefined): 'cyan' | 'blue' | 'purple' | 'green' {
  const colorMap: Record<string, 'cyan' | 'blue' | 'purple' | 'green'> = {
    lead: 'cyan',
    visit: 'blue',
    chat: 'purple',
    deal: 'green',
    property: 'blue',
    call: 'cyan',
  };
  return (type && colorMap[type]) || 'cyan';
}

/**
 * Get agent initials for avatar
 */
export function getAgentInitials(name: string | undefined): string {
  if (!name) return 'AG';
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Calculate trend percentage (mock calculation)
 * In production, this could come from backend or historical data
 */
export function calculateTrend(agent: Agent | undefined): number {
  if (!agent) return 0;

  const numericConversionRate = Number(agent.conversionRate);
  if (Number.isFinite(numericConversionRate)) {
    if (numericConversionRate >= 60) return 12;
    if (numericConversionRate >= 35) return 6;
    if (numericConversionRate >= 15) return 2;
    return -2;
  }

  if (!agent.totalLeads || !agent.closedLeads) return 0;

  const conversionRate = (agent.closedLeads / agent.totalLeads) * 100;
  if (conversionRate >= 60) return 12;
  if (conversionRate >= 35) return 6;
  if (conversionRate >= 15) return 2;
  return -2;
}

/**
 * Format large numbers to readable format (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number | string | undefined): string {
  const n = typeof num === 'string' ? Number(num) : num;

  if (n === undefined || !Number.isFinite(n)) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;

  return String(n);
}

/**
 * Format currency
 */
export function formatCurrency(num: number | undefined | null): string {
  if (num == null) return '$0';
  return `$${Number(num).toLocaleString()}`;
}
