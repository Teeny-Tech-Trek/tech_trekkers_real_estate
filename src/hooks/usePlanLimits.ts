// src/hooks/usePlanLimits.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PlanLimits {
  canCreateAgent: boolean;
  canCreateProperty: boolean;
  canAddTeamMember: boolean;
  agents: {
    used: number;
    limit: number;
    remaining: number;
  };
  properties: {
    used: number;
    limit: number;
    remaining: number;
  };
  teamMembers: {
    used: number;
    limit: number;
    remaining: number;
  };
  isAtLimit: {
    agents: boolean;
    properties: boolean;
    teamMembers: boolean;
  };
  planName: string;
  isLoading: boolean;
  refreshLimits: () => Promise<void>;
}

export const usePlanLimits = (): PlanLimits => {
  const { toast } = useToast();
  const [isLoading] = useState(false);

  // Return default unlimited limits
  const agents = {
    used: 0,
    limit: Infinity,
    remaining: Infinity
  };

  const properties = {
    used: 0,
    limit: Infinity,
    remaining: Infinity
  };

  const teamMembers = {
    used: 0,
    limit: Infinity,
    remaining: Infinity
  };

  const isAtLimit = {
    agents: false,
    properties: false,
    teamMembers: false
  };

  const canCreateAgent = true;
  const canCreateProperty = true;
  const canAddTeamMember = true;

  const loadBillingInfo = async () => {
    // No-op: function disabled
  };

  return {
    canCreateAgent,
    canCreateProperty,
    canAddTeamMember,
    agents,
    properties,
    teamMembers,
    isAtLimit,
    planName: 'unlimited',
    isLoading,
    refreshLimits: loadBillingInfo
  };
};