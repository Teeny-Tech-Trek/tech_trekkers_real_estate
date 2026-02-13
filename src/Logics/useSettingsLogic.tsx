import React, { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Settings as LucideSettings, Zap } from 'lucide-react'; // Import necessary icons for integrations

// Placeholder types - these would ideally be defined in a types file
interface Organization {
  name: string;
  billing: {
    companyName: string;
    address: string;
    phone: string;
    realEstateLicense: string;
  };
}

interface TeamMember {
  _id: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  role: 'owner' | 'admin' | 'agent' | 'member';
  joinedAt: string;
}

interface PendingInvite {
  _id: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: {
    firstName: string;
    lastName: string;
  };
  expiresAt: string;
}

interface BillingPlan {
  name: string;
  price: number;
  seats: number;
  agentsLimit: number;
  propertiesLimit: number;
}

interface BillingUsage {
  agents: { used: number; limit: number; percent: number };
  members: { used: number; limit: number; percent: number };
}

interface BillingInfo {
  plan: BillingPlan;
  pricingTiers: Record<string, BillingPlan>;
  usage: BillingUsage;
}

interface Integration {
  name: string;
  type: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

interface NotificationSettings {
  emailNotifications: Record<string, boolean>;
  pushNotifications: Record<string, boolean>;
  smsNotifications: Record<string, boolean>;
}

export const useSettingsLogic = () => {
  const { toast: toastFn } = useToast();

  // --- State Variables ---
  const [organization, setOrganization] = useState<Organization>({
    name: 'PulseRobot Corp',
    billing: {
      companyName: 'PulseRobot Inc.',
      address: '123 AI Lane, Tech City',
      phone: '+1 (555) 123-4567',
      realEstateLicense: 'RE123456',
    },
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // Initialize as empty array
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]); // Initialize as empty array
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null); // Initialize as null
  const [integrations, setIntegrations] = useState<Integration[]>([]); // Initialize as empty array
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [orgForm, setOrgForm] = useState<Organization>(organization); // Form state for organization details
  const [zillowDialogOpen, setZillowDialogOpen] = useState(false);
  const [realtorDialogOpen, setRealtorDialogOpen] = useState(false);
  const [zillowCredentials, setZillowCredentials] = useState<any>({ zwsId: '', apiKey: '', settings: { syncProperties: true, syncLeads: true } });
  const [realtorCredentials, setRealtorCredentials] = useState<any>({ apiKey: '', secret: '', settings: { syncListings: true, autoImport: false } });

  // --- Functions (useCallback) ---
  const loadAllData = useCallback(() => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setTeamMembers([
        {
          _id: 'tm1',
          user: { _id: 'u1', email: 'owner@example.com', firstName: 'Owner', lastName: 'User', avatar: '' },
          role: 'owner',
          joinedAt: '2023-01-01T10:00:00Z',
        },
        {
          _id: 'tm2',
          user: { _id: 'u2', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', avatar: '' },
          role: 'admin',
          joinedAt: '2023-02-01T10:00:00Z',
        },
      ]);
      setPendingInvites([
        {
          _id: 'pi1',
          email: 'pending@example.com',
          role: 'member',
          invitedBy: { firstName: 'Owner', lastName: 'User' }, // Simplified
          expiresAt: '2024-03-01T10:00:00Z',
        },
      ]);
      setBillingInfo({
        plan: { name: 'pro', price: 99, seats: 5, agentsLimit: 10, propertiesLimit: 50 },
        pricingTiers: {
          basic: { name: 'basic', price: 29, seats: 1, agentsLimit: 3, propertiesLimit: 10 },
          pro: { name: 'pro', price: 99, seats: 5, agentsLimit: 10, propertiesLimit: 50 },
          enterprise: { name: 'enterprise', price: 499, seats: 1000, agentsLimit: 1000, propertiesLimit: 1000 },
        },
        usage: {
          agents: { used: 3, limit: 10, percent: 30 },
          members: { used: 2, limit: 5, percent: 40 },
        },
      });
      setIntegrations([
        { name: 'Zillow', type: 'zillow', icon: '🏠', status: 'disconnected' },
        { name: 'Realtor.com', type: 'realtor', icon: '🏘️', status: 'connected', lastSync: '2024-02-12T10:00:00Z' },
      ]);
      setNotificationSettings({
        emailNotifications: {
          newLeads: true,
          propertyShowings: true,
          offerUpdates: false,
          dailyPerformance: true,
          marketTrends: false,
          systemUpdates: true,
          urgentAlerts: true,
          bookingReminders: true,
          showingReminders: true,
          offerDeadlines: true,
        },
        pushNotifications: {
          newLeads: true,
          propertyShowings: true,
          offerUpdates: false,
          dailyPerformance: false,
          marketTrends: false,
          systemUpdates: true,
          urgentAlerts: true,
          bookingReminders: true,
          showingReminders: true,
          offerDeadlines: true,
        },
        smsNotifications: {
          newLeads: false,
          propertyShowings: true,
          offerUpdates: false,
          dailyPerformance: false,
          marketTrends: false,
          systemUpdates: false,
          urgentAlerts: true,
          bookingReminders: true,
          showingReminders: true,
          offerDeadlines: true,
        },
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate initial data load
  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleUpdateOrganization = useCallback(() => {
    console.log('Updating organization:', orgForm);
    setOrganization(orgForm);
    toastFn({ title: 'Organization Updated', description: 'Your organization details have been saved.' });
  }, [orgForm, toastFn]);

  const handleInviteMember = useCallback(() => {
    console.log(`Inviting ${inviteEmail} as ${inviteRole}`);
    // Add logic to send invite
    setPendingInvites(prev => [...prev, {
      _id: `pi_${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      invitedBy: { firstName: organization.name.split(' ')[0], lastName: '' }, // Simplified
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    }]);
    setInviteEmail('');
    setInviteRole('member');
    toastFn({ title: 'Invitation Sent', description: `${inviteEmail} has been invited.` });
  }, [inviteEmail, inviteRole, organization.name, toastFn]);

  const handleRevokeInvite = useCallback((id: string) => {
    console.log('Revoking invite:', id);
    setPendingInvites(prev => prev.filter(invite => invite._id !== id));
    toastFn({ title: 'Invite Revoked', description: 'The invitation has been revoked.' });
  }, [toastFn]);

  const handleRemoveMember = useCallback((id: string) => {
    console.log('Removing member:', id);
    setTeamMembers(prev => prev.filter(member => member._id !== id));
    toastFn({ title: 'Member Removed', description: 'The team member has been removed.' });
  }, [toastFn]);

  const handleUpdateRole = useCallback((id: string, newRole: 'owner' | 'admin' | 'agent' | 'member') => {
    console.log(`Updating role for ${id} to ${newRole}`);
    setTeamMembers(prev => prev.map(member => (member._id === id ? { ...member, role: newRole } : member)));
    toastFn({ title: 'Role Updated', description: 'Team member role has been updated.' });
  }, [toastFn]);

  const handleUpdateSubscription = useCallback(() => {
    console.log('Updating subscription');
    toastFn({ title: 'Subscription Updated', description: 'Your subscription has been changed.' });
  }, [toastFn]);

  const handleRazorpayPayment = useCallback((planKey: string) => {
    console.log('Initiating Razorpay payment for plan:', planKey);
    toastFn({ title: 'Payment Initiated', description: `Redirecting to payment for ${planKey} plan.` });
    // In a real app, this would redirect to Razorpay
  }, [toastFn]);

  const handleConnectZillow = useCallback(() => {
    console.log('Connecting Zillow with credentials:', zillowCredentials);
    setIntegrations(prev => prev.map(int => (int.type === 'zillow' ? { ...int, status: 'connected', lastSync: new Date().toISOString() } : int)));
    toastFn({ title: 'Zillow Connected', description: 'Zillow integration is active.' });
  }, [zillowCredentials, toastFn]);

  const handleConnectRealtor = useCallback(() => {
    console.log('Connecting Realtor.com with credentials:', realtorCredentials);
    setIntegrations(prev => prev.map(int => (int.type === 'realtor' ? { ...int, status: 'connected', lastSync: new Date().toISOString() } : int)));
    toastFn({ title: 'Realtor.com Connected', description: 'Realtor.com integration is active.' });
  }, [realtorCredentials, toastFn]);

  const handleDisconnectIntegration = useCallback((type: string) => {
    console.log(`Disconnecting ${type} integration`);
    setIntegrations(prev => prev.map(int => (int.type === type ? { ...int, status: 'disconnected' } : int)));
    toastFn({ title: 'Integration Disconnected', description: `${type} integration has been disconnected.` });
  }, [toastFn]);

  const handleSyncIntegration = useCallback((type: string) => {
    console.log(`Syncing ${type} integration`);
    setIntegrations(prev => prev.map(int => (int.type === type ? { ...int, lastSync: new Date().toISOString() } : int)));
    toastFn({ title: 'Sync Complete', description: `${type} integration data synced.` });
  }, [toastFn]);

  const handleUpdateNotificationSettings = useCallback((category: string, settings: Record<string, boolean>) => {
    console.log(`Updating ${category} notifications:`, settings);
    setNotificationSettings(prev => prev ? { ...prev, [category]: settings } : null);
    toastFn({ title: 'Notifications Updated', description: 'Your notification preferences have been saved.' });
  }, [toastFn]);

  const getInitials = useCallback((firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  }, []);

  const getRoleBadge = useCallback((role: string) => {
    // This function is defined in Settings.tsx directly, so no implementation needed here for now
    return <Badge>{role}</Badge>;
  }, []);

  const getPlanBadge = useCallback((planName: string) => {
    // This function is defined in Settings.tsx directly, so no implementation needed here for now
    return <Badge>{planName}</Badge>;
  }, []);

  return {
    organization,
    teamMembers,
    pendingInvites,
    billingInfo,
    integrations,
    notificationSettings,
    isLoading,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    orgForm,
    setOrgForm,
    zillowDialogOpen,
    setZillowDialogOpen,
    realtorDialogOpen,
    setRealtorDialogOpen,
    zillowCredentials,
    setZillowCredentials,
    realtorCredentials,
    setRealtorCredentials,
    loadAllData,
    handleUpdateOrganization,
    handleInviteMember,
    handleRevokeInvite,
    handleRemoveMember,
    handleUpdateRole,
    handleUpdateSubscription,
    handleRazorpayPayment,
    handleConnectZillow,
    handleConnectRealtor,
    handleDisconnectIntegration,
    handleSyncIntegration,
    handleUpdateNotificationSettings,
    getInitials,
    getRoleBadge,
    getPlanBadge,
  };
};