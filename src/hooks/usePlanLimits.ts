// src/hooks/usePlanLimits.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getBillingInfo, BillingInfo } from '@/services/settingsApi';

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
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBillingInfo = async () => {
    try {
      setIsLoading(true);
      const data = await getBillingInfo();
      setBillingInfo(data);
    } catch (error) {
      console.error('Failed to load billing info:', error);
      toast({
        title: "Error",
        description: "Failed to load plan limits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingInfo();
  }, []);

  // Calculate limits based on billing info
  const agents = {
    used: billingInfo?.usage.agents.used || 0,
    limit: billingInfo?.usage.agents.limit || 1,
    remaining: Math.max(0, (billingInfo?.usage.agents.limit || 1) - (billingInfo?.usage.agents.used || 0))
  };

  const properties = {
    used: billingInfo?.usage.properties.used || 0,
    limit: billingInfo?.usage.properties.limit || 5,
    remaining: Math.max(0, (billingInfo?.usage.properties.limit || 5) - (billingInfo?.usage.properties.used || 0))
  };

  const teamMembers = {
    used: billingInfo?.usage.members.used || 0,
    limit: billingInfo?.usage.members.limit || 1,
    remaining: Math.max(0, (billingInfo?.usage.members.limit || 1) - (billingInfo?.usage.members.used || 0))
  };

  const isAtLimit = {
    agents: agents.remaining <= 0,
    properties: properties.remaining <= 0,
    teamMembers: teamMembers.remaining <= 0
  };

  const canCreateAgent = !isAtLimit.agents;
  const canCreateProperty = !isAtLimit.properties;
  const canAddTeamMember = !isAtLimit.teamMembers;

  return {
    canCreateAgent,
    canCreateProperty,
    canAddTeamMember,
    agents,
    properties,
    teamMembers,
    isAtLimit,
    planName: billingInfo?.plan.name || 'free',
    isLoading,
    refreshLimits: loadBillingInfo
  };
};