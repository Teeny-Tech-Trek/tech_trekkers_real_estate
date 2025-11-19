// src/components/Settings.tsx
import React, { useState, useEffect } from "react";
import {
  User, Bell, CreditCard, Shield, Zap, Users, Database, Globe,
  Mail, Plus, MoreVertical, Loader2, AlertCircle, CheckCircle2,
  Building, MapPin, Phone, FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getOrganization,
  updateOrganization,
  getTeamMembers,
  getPendingInvites,
  inviteMember,
  revokeInvite,
  removeTeamMember,
  updateMemberRole,
  getBillingInfo,
  updateSubscription,
  getIntegrations,
  connectZillow,
  connectRealtor,
  disconnectIntegration,
  syncIntegration,
  getNotificationSettings,
  updateNotificationSettings,
  TeamMember,
  Invite,
  Organization,
  BillingInfo,
  Integration,
  NotificationSettings,
  ZillowCredentials,
  RealtorCredentials
} from "@/services/settingsApi";
import axios from "axios";

const Settings = () => {
  const { toast } = useToast();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Form states
  const [orgForm, setOrgForm] = useState({
    name: "",
    billing: {
      companyName: "",
      address: "",
      phone: "",
      realEstateLicense: ""
    }
  });

  // Integration dialogs
  const [zillowDialogOpen, setZillowDialogOpen] = useState(false);
  const [realtorDialogOpen, setRealtorDialogOpen] = useState(false);
  const [zillowCredentials, setZillowCredentials] = useState<ZillowCredentials>({
    zwsId: "",
    apiKey: "",
    settings: {
      syncProperties: true,
      syncLeads: true,
      autoImport: false,
      syncInterval: "daily"
    }
  });
  const [realtorCredentials, setRealtorCredentials] = useState<RealtorCredentials>({
    apiKey: "",
    secret: "",
    settings: {
      syncProperties: true,
      syncLeads: true,
      autoImport: false,
      syncInterval: "daily"
    }
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [
        orgData,
        membersData,
        invitesData,
        billingData,
        integrationsData,
        notificationsData
      ] = await Promise.all([
        getOrganization(),
        getTeamMembers(),
        getPendingInvites(),
        getBillingInfo(),
        getIntegrations(),
        getNotificationSettings()
      ]);

      setOrganization(orgData);
      setTeamMembers(membersData);
      setPendingInvites(invitesData);
      setBillingInfo(billingData);
      setIntegrations(integrationsData);
      setNotificationSettings(notificationsData);

      setOrgForm({
        name: orgData.name,
        billing: {
          companyName: orgData.billing?.companyName || "",
          address: orgData.billing?.address || "",
          phone: orgData.billing?.phone || "",
          realEstateLicense: orgData.billing?.realEstateLicense || ""
        }
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrganization = async () => {
    try {
      const updatedOrg = await updateOrganization(orgForm);
      setOrganization(updatedOrg);
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await inviteMember({ email: inviteEmail, role: inviteRole });
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      setInviteEmail("");
      setInviteRole("member");
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await revokeInvite(inviteId);
      toast({
        title: "Success",
        description: "Invitation revoked",
      });
      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke invitation",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeTeamMember(memberId);
      toast({
        title: "Success",
        description: "Team member removed",
      });
      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubscription = async (planId: string) => {
    try {
      const result = await updateSubscription(planId);
      setBillingInfo(prev => prev ? {
        ...prev,
        plan: result.plan
      } : null);
      toast({
        title: "Success",
        description: result.message,
      });
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async (planId: string) => {
    try {
      // Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      // Create order via backend
      const response = await axios.post("/api/payments/create-order", {
        planId,
        organizationId: organization?._id,
        amount: billingInfo?.pricingTiers[planId].price * 100, // Convert to paisa
        currency: "INR",
      });

      const { orderId, amount, currency, keyId } = response.data;

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Real Estate Platform",
        description: `Subscription for ${planId} plan`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await axios.post("/api/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              organizationId: organization?._id,
            });

            if (verifyResponse.data.success) {
              toast({
                title: "Success",
                description: "Payment successful! Subscription updated.",
              });
              await handleUpdateSubscription(planId);
            } else {
              toast({
                title: "Error",
                description: "Payment verification failed.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.response?.data?.error || "Payment verification failed",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: orgForm.name,
          contact: orgForm.billing.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  const handleConnectZillow = async () => {
    try {
      await connectZillow(zillowCredentials);
      setZillowDialogOpen(false);
      setZillowCredentials({
        zwsId: "",
        apiKey: "",
        settings: {
          syncProperties: true,
          syncLeads: true,
          autoImport: false,
          syncInterval: "daily"
        }
      });
      toast({
        title: "Success",
        description: "Zillow connected successfully",
      });
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to connect Zillow",
        variant: "destructive",
      });
    }
  };

  const handleConnectRealtor = async () => {
    try {
      await connectRealtor(realtorCredentials);
      setRealtorDialogOpen(false);
      setRealtorCredentials({
        apiKey: "",
        secret: "",
        settings: {
          syncProperties: true,
          syncLeads: true,
          autoImport: false,
          syncInterval: "daily"
        }
      });
      toast({
        title: "Success",
        description: "Realtor.com connected successfully",
      });
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to connect Realtor.com",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectIntegration = async (type: string) => {
    try {
      await disconnectIntegration(type);
      toast({
        title: "Success",
        description: `${type} disconnected successfully`,
      });
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || `Failed to disconnect ${type}`,
        variant: "destructive",
      });
    }
  };

  const handleSyncIntegration = async (type: string) => {
    try {
      await syncIntegration(type);
      toast({
        title: "Success",
        description: `${type} sync started`,
      });
      loadAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || `Failed to sync ${type}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotificationSettings = async (field: string, value: any) => {
    if (!notificationSettings) return;

    const updatedSettings = {
      ...notificationSettings,
      [field]: value
    };

    try {
      const result = await updateNotificationSettings(updatedSettings);
      setNotificationSettings(result.settings);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Admin", variant: "destructive" as const },
      member: { label: "Member", variant: "default" as const },
      agent: { label: "Agent", variant: "secondary" as const }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.member;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanBadge = (planName: string) => {
    const planConfig = {
      free: { label: "Free", variant: "secondary" as const },
      pro: { label: "Pro", variant: "default" as const },
      enterprise: { label: "Enterprise", variant: "destructive" as const }
    };

    const config = planConfig[planName as keyof typeof planConfig] || planConfig.free;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and team settings</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Account Information
            </CardTitle>
            <CardDescription>Update your personal and company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Legal Name</Label>
                <Input
                  id="companyName"
                  value={orgForm.billing.companyName}
                  onChange={(e) => setOrgForm(prev => ({
                    ...prev,
                    billing: { ...prev.billing, companyName: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={orgForm.billing.address}
                  onChange={(e) => setOrgForm(prev => ({
                    ...prev,
                    billing: { ...prev.billing, address: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Business Phone</Label>
                <Input
                  id="phone"
                  value={orgForm.billing.phone}
                  onChange={(e) => setOrgForm(prev => ({
                    ...prev,
                    billing: { ...prev.billing, phone: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="license">Real Estate License</Label>
                <Input
                  id="license"
                  value={orgForm.billing.realEstateLicense}
                  onChange={(e) => setOrgForm(prev => ({
                    ...prev,
                    billing: { ...prev.billing, realEstateLicense: e.target.value }
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleUpdateOrganization}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Team Management
            </CardTitle>
            <CardDescription>
              Manage your team members and permissions ({teamMembers.length}/{billingInfo?.plan.seats || 1} seats used)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your real estate team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Team Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleInviteMember} className="w-full">
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <h3 className="text-lg font-semibold mb-4">Team Members ({teamMembers.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.user.avatar} />
                            <AvatarFallback>
                              {getInitials(member.user.firstName, member.user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user.firstName} {member.user.lastName}</p>
                            <p className="text-sm text-gray-600">{member.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleUpdateRole(member._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleRemoveMember(member._id)}
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pendingInvites.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <div key={invite._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-sm text-gray-600">
                          Invited by {invite.invitedBy.firstName} {invite.invitedBy.lastName} •
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{invite.role}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeInvite(invite._id)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Subscription & Billing
            </CardTitle>
            <CardDescription>Manage your subscription and view billing history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {billingInfo && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Current Plan: {billingInfo.plan.name.charAt(0).toUpperCase() + billingInfo.plan.name.slice(1)}</p>
                    <p className="text-sm text-gray-600">
                      ${billingInfo.plan.price}/month • {teamMembers.length}/{billingInfo.plan.seats} seats used
                    </p>
                  </div>
                  {getPlanBadge(billingInfo.plan.name)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Agents</span>
                      <span>{billingInfo.usage.agents.used}/{billingInfo.usage.agents.limit}</span>
                    </div>
                    <Progress value={billingInfo.usage.agents.percent} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Members</span>
                      <span>{billingInfo.usage.members.used}/{billingInfo.usage.members.limit}</span>
                    </div>
                    <Progress value={billingInfo.usage.members.percent} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(billingInfo.pricingTiers).map(([planKey, plan]) => (
                    <Card key={planKey} className={
                      `border-2 ${billingInfo.plan.name === planKey
                        ? 'border-primary shadow-md'
                        : 'border-gray-200'
                      }`
                    }>
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</CardTitle>
                        <CardDescription>
                          <span className="text-2xl font-bold">${plan.price}</span>
                          <span className="text-gray-600">/month</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{plan.agentsLimit === 1000 ? 'Unlimited' : plan.agentsLimit} Agents</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{plan.propertiesLimit === 1000 ? 'Unlimited' : plan.propertiesLimit} Properties</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{plan.seats === 1000 ? 'Unlimited' : plan.seats} Team Members</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          variant={billingInfo.plan.name === planKey ? "outline" : "default"}
                          onClick={() => {
                            if (billingInfo.plan.name === planKey) return;
                            handleRazorpayPayment(planKey); // Initiate Razorpay payment
                          }}
                          disabled={billingInfo.plan.name === planKey}
                        >
                          {billingInfo.plan.name === planKey ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2 ">
                  <Button variant="outline">View Billing History</Button>
                  {/* <Button variant="outline">Download Tax Documents</Button> */}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationSettings && (
              <Tabs defaultValue="email">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="push">Push</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-base capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {key === 'newLeads' && 'Get notified when avatars capture new leads'}
                          {key === 'propertyShowings' && 'Notifications for scheduled property viewings'}
                          {key === 'offerUpdates' && 'Get alerts for new offers and negotiations'}
                          {key === 'dailyPerformance' && 'Receive daily analytics summaries'}
                          {key === 'marketTrends' && 'Weekly real estate market updates'}
                          {key === 'systemUpdates' && 'Important system and feature updates'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleUpdateNotificationSettings('emailNotifications', {
                          ...notificationSettings.emailNotifications,
                          [key]: checked
                        })}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="push" className="space-y-4">
                  {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-base capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {key === 'newLeads' && 'Push notifications for new leads'}
                          {key === 'urgentAlerts' && 'Critical alerts requiring immediate attention'}
                          {key === 'bookingReminders' && 'Reminders for upcoming appointments'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleUpdateNotificationSettings('pushNotifications', {
                          ...notificationSettings.pushNotifications,
                          [key]: checked
                        })}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sms" className="space-y-4">
                  {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-base capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {key === 'newLeads' && 'SMS alerts for new qualified leads'}
                          {key === 'showingReminders' && 'Reminders for property showings'}
                          {key === 'offerDeadlines' && 'Alerts for offer expirations'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleUpdateNotificationSettings('smsNotifications', {
                          ...notificationSettings.smsNotifications,
                          [key]: checked
                        })}
                      />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* CRM & Platform Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} />
              CRM & Platform Integrations
            </CardTitle>
            <CardDescription>Connect your real estate tools and platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration, index) => (
                <div key={index} className="flex flex-col justify-between p-4 border rounded-lg h-40">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{integration.status}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncIntegration(integration.type)}
                        >
                          Sync
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnectIntegration(integration.type)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (integration.type === 'zillow') setZillowDialogOpen(true);
                          if (integration.type === 'realtor') setRealtorDialogOpen(true);
                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage data privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Call Recording</Label>
                <p className="text-sm text-gray-600">Record avatar voice conversations for quality assurance</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Data Retention</Label>
                <p className="text-sm text-gray-600">Keep lead data for 2 years (GDPR compliant)</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Switch />
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" className="mr-2">Export Data</Button>
              <Button variant="outline" className="mr-2">Download Compliance Report</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zillow Integration Dialog */}
      <Dialog open={zillowDialogOpen} onOpenChange={setZillowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Zillow</DialogTitle>
            <DialogDescription>
              Enter your Zillow API credentials to sync properties and leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zwsId">ZWS ID</Label>
              <Input
                id="zwsId"
                placeholder="Enter your ZWS ID"
                value={zillowCredentials.zwsId}
                onChange={(e) => setZillowCredentials(prev => ({ ...prev, zwsId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={zillowCredentials.apiKey}
                onChange={(e) => setZillowCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <Label>Sync Settings</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync Properties</span>
                <Switch
                  checked={zillowCredentials.settings?.syncProperties}
                  onCheckedChange={(checked) => setZillowCredentials(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, syncProperties: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync Leads</span>
                <Switch
                  checked={zillowCredentials.settings?.syncLeads}
                  onCheckedChange={(checked) => setZillowCredentials(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, syncLeads: checked }
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleConnectZillow} className="w-full">
              Connect Zillow
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Realtor.com Integration Dialog */}
      <Dialog open={realtorDialogOpen} onOpenChange={setRealtorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Realtor.com</DialogTitle>
            <DialogDescription>
              Enter your Realtor.com API credentials to sync listings and data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="realtorApiKey">API Key</Label>
              <Input
                id="realtorApiKey"
                placeholder="Enter your API key"
                value={realtorCredentials.apiKey}
                onChange={(e) => setRealtorCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="realtorSecret">API Secret</Label>
              <Input
                id="realtorSecret"
                type="password"
                placeholder="Enter your API secret"
                value={realtorCredentials.secret}
                onChange={(e) => setRealtorCredentials(prev => ({ ...prev, secret: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <Label>Sync Settings</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync Listings</span>
                <Switch
                  checked={realtorCredentials.settings?.syncProperties}
                  onCheckedChange={(checked) => setRealtorCredentials(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, syncProperties: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Import</span>
                <Switch
                  checked={realtorCredentials.settings?.autoImport}
                  onCheckedChange={(checked) => setRealtorCredentials(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, autoImport: checked }
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleConnectRealtor} className="w-full">
              Connect Realtor.com
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;