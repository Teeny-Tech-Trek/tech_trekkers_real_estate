// src/pages/Settings.tsx
import React, { useState } from "react";
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Zap,
  Users,
  Mail,
  Plus,
  MoreVertical,
  Loader2,
  CheckCircle2,
  Building,
  MapPin,
  Phone,
  FileText,
  X,
  Check,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Settings as SettingsIcon,
  Lock,
  Download,
  Trash2,
  LogOut,
  Edit,
  Copy,
  Crown,
  Sparkles,
  AlertCircle,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsLogic } from "../Logics/useSettingsLogic";

const Settings: React.FC = () => {
  const {
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
  } = useSettingsLogic();

  const [activeTab, setActiveTab] = useState<'account' | 'team' | 'billing' | 'notifications' | 'integrations' | 'security'>('account');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [notificationTab, setNotificationTab] = useState<'email' | 'push' | 'sms'>('email');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-slate-300 text-lg">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] p-10">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="space-y-3">
              <h1 className="text-6xl font-bold text-white tracking-tight">
                Settings
              </h1>
              <p className="text-lg text-slate-400">Manage your account, team, and preferences</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/40 border border-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <div className="text-sm">
                    <span className="text-white font-bold">{teamMembers.length}</span>
                    <span className="text-slate-500 mx-1.5">/</span>
                    <span className="text-slate-500">{billingInfo?.plan.seats || 1}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Team Seats</span>
              </div>

              <button className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group">
                <RefreshCw 
                  onClick={loadAllData}
                  className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500" 
                />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'account', label: 'Account', icon: User },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'integrations', label: 'Integrations', icon: Zap },
              { id: 'security', label: 'Security', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-900/30 border border-slate-800/50 text-slate-400 hover:bg-slate-900/50 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Account Section */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              {/* Organization Info */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Organization Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Your Organization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      value={orgForm.billing.companyName}
                      onChange={(e) => setOrgForm(prev => ({ ...prev, billing: { ...prev.billing, companyName: e.target.value } }))}
                      className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Legal Entity Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                      Business Address
                    </label>
                    <input
                      type="text"
                      value={orgForm.billing.address}
                      onChange={(e) => setOrgForm(prev => ({ ...prev, billing: { ...prev.billing, address: e.target.value } }))}
                      className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Street Address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                      Business Phone
                    </label>
                    <input
                      type="text"
                      value={orgForm.billing.phone}
                      onChange={(e) => setOrgForm(prev => ({ ...prev, billing: { ...prev.billing, phone: e.target.value } }))}
                      className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                      Real Estate License
                    </label>
                    <input
                      type="text"
                      value={orgForm.billing.realEstateLicense}
                      onChange={(e) => setOrgForm(prev => ({ ...prev, billing: { ...prev.billing, realEstateLicense: e.target.value } }))}
                      className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="License Number"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleUpdateOrganization}
                    className="group flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Team Members</h2>
                  <span className="text-slate-500 text-lg ml-2">({teamMembers.length})</span>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="group flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Invite Member
                </button>
              </div>

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <TeamMemberCard 
                    key={member._id}
                    member={member}
                    onUpdateRole={handleUpdateRole}
                    onRemove={handleRemoveMember}
                    getInitials={getInitials}
                    showMenu={showMenuFor === member._id}
                    onToggleMenu={() => setShowMenuFor(showMenuFor === member._id ? null : member._id)}
                  />
                ))}
              </div>

              {/* Pending Invites */}
              {pendingInvites.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                    <h2 className="text-2xl font-bold text-white">Pending Invitations</h2>
                    <span className="text-slate-500 text-lg ml-2">({pendingInvites.length})</span>
                  </div>

                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <PendingInviteCard 
                        key={invite._id}
                        invite={invite}
                        onRevoke={handleRevokeInvite}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Billing Section */}
          {activeTab === 'billing' && billingInfo && (
            <div className="space-y-8">
              {/* Current Plan Overview */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Current Subscription</h2>
                </div>

                <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {billingInfo.plan.name.charAt(0).toUpperCase() + billingInfo.plan.name.slice(1)} Plan
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">${billingInfo.plan.price}</span>
                        <span className="text-slate-400 text-lg">/month</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-400 text-sm font-medium">AI Agents</span>
                        <span className="text-white font-semibold">
                          {billingInfo.usage.agents.used}/{billingInfo.usage.agents.limit}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${billingInfo.usage.agents.percent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-400 text-sm font-medium">Team Members</span>
                        <span className="text-white font-semibold">
                          {billingInfo.usage.members.used}/{billingInfo.usage.members.limit}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${billingInfo.usage.members.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Available Plans</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(billingInfo.pricingTiers).map(([planKey, plan]) => {
                    const isCurrentPlan = billingInfo.plan.name === planKey;
                    const isEnterprise = planKey === 'enterprise';
                    
                    return (
                      <PricingCard 
                        key={planKey}
                        planKey={planKey}
                        plan={plan}
                        isCurrentPlan={isCurrentPlan}
                        isEnterprise={isEnterprise}
                        onUpgrade={() => handleRazorpayPayment(planKey)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Billing Actions */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  View Billing History
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Invoices
                </button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === 'notifications' && notificationSettings && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
              </div>

              {/* Notification Type Tabs */}
              <div className="flex gap-2 mb-8">
                {[
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'push', label: 'Push', icon: Bell },
                  { id: 'sms', label: 'SMS', icon: Phone },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setNotificationTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        notificationTab === tab.id
                          ? 'bg-slate-900/50 border border-slate-700/50 text-white'
                          : 'bg-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                {notificationTab === 'email' && Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                  <NotificationSettingRow 
                    key={key}
                    settingKey={key}
                    value={value}
                    onToggle={(checked) => handleUpdateNotificationSettings('emailNotifications', { ...notificationSettings.emailNotifications, [key]: checked })}
                  />
                ))}

                {notificationTab === 'push' && Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                  <NotificationSettingRow 
                    key={key}
                    settingKey={key}
                    value={value}
                    onToggle={(checked) => handleUpdateNotificationSettings('pushNotifications', { ...notificationSettings.pushNotifications, [key]: checked })}
                  />
                ))}

                {notificationTab === 'sms' && Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                  <NotificationSettingRow 
                    key={key}
                    settingKey={key}
                    value={value}
                    onToggle={(checked) => handleUpdateNotificationSettings('smsNotifications', { ...notificationSettings.smsNotifications, [key]: checked })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Integrations Section */}
          {activeTab === 'integrations' && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">CRM & Platform Integrations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration, index) => (
                  <IntegrationCard 
                    key={index}
                    integration={integration}
                    onConnect={() => {
                      if (integration.type === 'zillow') setZillowDialogOpen(true);
                      if (integration.type === 'realtor') setRealtorDialogOpen(true);
                    }}
                    onDisconnect={() => handleDisconnectIntegration(integration.type)}
                    onSync={() => handleSyncIntegration(integration.type)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Privacy & Security</h2>
              </div>

              {/* Security Settings */}
              <div className="space-y-4">
                <SecuritySettingRow 
                  title="Call Recording"
                  description="Record avatar voice conversations for quality assurance"
                  defaultChecked={true}
                />
                <SecuritySettingRow 
                  title="Data Retention"
                  description="Keep lead data for 2 years (GDPR compliant)"
                  defaultChecked={true}
                />
                <SecuritySettingRow 
                  title="Two-Factor Authentication"
                  description="Add extra security to your account"
                  defaultChecked={false}
                />
              </div>

              {/* Danger Zone */}
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-red-700 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
                </div>

                <div className="space-y-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all text-sm font-medium w-full md:w-auto">
                    <Download className="w-4 h-4" />
                    Export All Data
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all text-sm font-medium w-full md:w-auto">
                    <FileText className="w-4 h-4" />
                    Download Compliance Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium w-full md:w-auto">
                    <Trash2 className="w-4 h-4" />
                    Delete Account Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showMenuFor && <div className="fixed inset-0 z-10" onClick={() => setShowMenuFor(null)} />}
      
      <InviteMemberModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        onInvite={handleInviteMember}
      />

      <ZillowIntegrationModal 
        isOpen={zillowDialogOpen}
        onClose={() => setZillowDialogOpen(false)}
        credentials={zillowCredentials}
        setCredentials={setZillowCredentials}
        onConnect={handleConnectZillow}
      />

      <RealtorIntegrationModal 
        isOpen={realtorDialogOpen}
        onClose={() => setRealtorDialogOpen(false)}
        credentials={realtorCredentials}
        setCredentials={setRealtorCredentials}
        onConnect={handleConnectRealtor}
      />
    </div>
  );
};

// Component: Team Member Card
function TeamMemberCard({ member, onUpdateRole, onRemove, getInitials, showMenu, onToggleMenu }: any) {
  const roleColors: any = {
    owner: 'text-purple-400 bg-purple-500/10',
    admin: 'text-blue-400 bg-blue-500/10',
    agent: 'text-emerald-400 bg-emerald-500/10',
    member: 'text-slate-400 bg-slate-500/10',
  };

  return (
    <div className="group relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 border-2 border-slate-700/50">
            <AvatarImage src={member.user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold">
              {getInitials(member.user.firstName, member.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold text-base mb-1">
              {member.user.firstName} {member.user.lastName}
            </h3>
            <p className="text-slate-500 text-sm">{member.user.email}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={onToggleMenu}
            className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
              <button className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors">
                <Edit className="w-3.5 h-3.5" />
                Edit Member
              </button>
              <div className="h-px bg-slate-700/50 my-1.5" />
              <button 
                onClick={() => onRemove(member._id)}
                className="w-full px-3.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Member
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Role</span>
          <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${roleColors[member.role] || roleColors.member}`}>
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Joined</span>
          <span className="text-white font-medium">{new Date(member.joinedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// Component: Pending Invite Card
function PendingInviteCard({ invite, onRevoke }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
          <Mail className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-white">{invite.email}</p>
          <p className="text-sm text-slate-500">
            Invited by {invite.invitedBy.firstName} {invite.invitedBy.lastName} • Expires {new Date(invite.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs font-semibold text-slate-300">
          {invite.role}
        </div>
        <button 
          onClick={() => onRevoke(invite._id)}
          className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-all font-medium"
        >
          Revoke
        </button>
      </div>
    </div>
  );
}

// Component: Pricing Card
function PricingCard({ planKey, plan, isCurrentPlan, isEnterprise, onUpgrade }: any) {
  return (
    <div className={`relative bg-slate-900/30 border rounded-2xl p-6 transition-all duration-300 ${
      isCurrentPlan 
        ? 'border-white/20 bg-slate-900/50' 
        : 'border-slate-800/50 hover:border-slate-700/50'
    }`}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full text-xs font-bold text-white flex items-center gap-1">
            <Check className="w-3 h-3" />
            Current Plan
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-slate-400">/month</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{plan.agentsLimit === 1000 ? 'Unlimited' : plan.agentsLimit} AI Agents</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{plan.propertiesLimit === 1000 ? 'Unlimited' : plan.propertiesLimit} Properties</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{plan.seats === 1000 ? 'Unlimited' : plan.seats} Team Members</span>
        </div>
      </div>

      <button
        onClick={onUpgrade}
        disabled={isCurrentPlan}
        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          isCurrentPlan
            ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
            : isEnterprise
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:scale-105'
            : 'bg-white hover:bg-slate-100 text-slate-900 hover:scale-105'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
      </button>
    </div>
  );
}

// Component: Notification Setting Row
function NotificationSettingRow({ settingKey, value, onToggle }: any) {
  const descriptions: any = {
    newLeads: 'Get notified when AI agents capture new leads',
    propertyShowings: 'Notifications for scheduled property viewings',
    offerUpdates: 'Get alerts for new offers and negotiations',
    dailyPerformance: 'Receive daily analytics summaries',
    marketTrends: 'Weekly real estate market updates',
    systemUpdates: 'Important system and feature updates',
    urgentAlerts: 'Critical alerts requiring immediate attention',
    bookingReminders: 'Reminders for upcoming appointments',
    showingReminders: 'Reminders for property showings',
    offerDeadlines: 'Alerts for offer expirations',
  };

  const title = settingKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());

  return (
    <div className="flex items-center justify-between p-5 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all">
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-sm text-slate-500">{descriptions[settingKey]}</p>
      </div>
      <Switch checked={value} onCheckedChange={onToggle} />
    </div>
  );
}

// Component: Security Setting Row
function SecuritySettingRow({ title, description, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all">
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

// Component: Integration Card
function IntegrationCard({ integration, onConnect, onDisconnect, onSync }: any) {
  const isConnected = integration.status === 'connected';

  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center text-2xl">
          {integration.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">{integration.name}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
            </span>
          </div>
          {integration.lastSync && (
            <p className="text-xs text-slate-500 mt-1">
              Last sync: {new Date(integration.lastSync).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {isConnected ? (
          <>
            <button 
              onClick={onSync}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Sync
            </button>
            <button 
              onClick={onDisconnect}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Disconnect
            </button>
          </>
        ) : (
          <button 
            onClick={onConnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

// Modal: Invite Member
function InviteMemberModal({ isOpen, onClose, inviteEmail, setInviteEmail, inviteRole, setInviteRole, onInvite }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-5">
          <DialogTitle className="text-2xl font-bold text-white">Invite Team Member</DialogTitle>
          <p className="text-slate-400 text-sm mt-2">Send an invitation to join your team</p>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              Role
            </label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-800/50 pt-5">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onInvite();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
          >
            Send Invitation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal: Zillow Integration
function ZillowIntegrationModal({ isOpen, onClose, credentials, setCredentials, onConnect }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-5">
          <DialogTitle className="text-2xl font-bold text-white">Connect Zillow</DialogTitle>
          <p className="text-slate-400 text-sm mt-2">Enter your Zillow API credentials</p>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              ZWS ID
            </label>
            <input
              type="text"
              value={credentials.zwsId}
              onChange={(e) => setCredentials((prev: any) => ({ ...prev, zwsId: e.target.value }))}
              placeholder="Enter your ZWS ID"
              className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              API Key
            </label>
            <input
              type="password"
              value={credentials.apiKey}
              onChange={(e) => setCredentials((prev: any) => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your API key"
              className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/50">
            <p className="text-sm font-semibold text-slate-200">Sync Settings</p>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-200">Sync Properties</span>
              <Switch 
                checked={credentials.settings?.syncProperties} 
                onCheckedChange={(checked) => setCredentials((prev: any) => ({ 
                  ...prev, 
                  settings: { ...prev.settings, syncProperties: checked } 
                }))} 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-200">Sync Leads</span>
              <Switch 
                checked={credentials.settings?.syncLeads} 
                onCheckedChange={(checked) => setCredentials((prev: any) => ({ 
                  ...prev, 
                  settings: { ...prev.settings, syncLeads: checked } 
                }))} 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-800/50 pt-5">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConnect();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
          >
            Connect Zillow
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal: Realtor Integration
function RealtorIntegrationModal({ isOpen, onClose, credentials, setCredentials, onConnect }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-5">
          <DialogTitle className="text-2xl font-bold text-white">Connect Realtor.com</DialogTitle>
          <p className="text-slate-400 text-sm mt-2">Enter your Realtor.com API credentials</p>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              API Key
            </label>
            <input
              type="text"
              value={credentials.apiKey}
              onChange={(e) => setCredentials((prev: any) => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your API key"
              className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2.5">
              API Secret
            </label>
            <input
              type="password"
              value={credentials.secret}
              onChange={(e) => setCredentials((prev: any) => ({ ...prev, secret: e.target.value }))}
              placeholder="Enter your API secret"
              className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/50">
            <p className="text-sm font-semibold text-slate-200">Sync Settings</p>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-200">Sync Listings</span>
              <Switch 
                checked={credentials.settings?.syncProperties} 
                onCheckedChange={(checked) => setCredentials((prev: any) => ({ 
                  ...prev, 
                  settings: { ...prev.settings, syncProperties: checked } 
                }))} 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-200">Auto Import</span>
              <Switch 
                checked={credentials.settings?.autoImport} 
                onCheckedChange={(checked) => setCredentials((prev: any) => ({ 
                  ...prev, 
                  settings: { ...prev.settings, autoImport: checked } 
                }))} 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-800/50 pt-5">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConnect();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
          >
            Connect Realtor.com
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;