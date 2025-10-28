// src/pages/Avatars.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Power, MoreHorizontal, X, Save, QrCode, MessageSquare, Calendar, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchAgents, createAgent, toggleAgentStatus, deleteAgent, generateQRCode } from '@/services/agentApi';
import { Agent } from '@/types/agent';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { PlanLimitAlert } from '@/hooks/PlanLimitAlert';

interface CreateAgentData {
  name: string;
  personality: string;
  voice: string;
  avatar: string;
  description: string;
}

const Avatars = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const [newAgent, setNewAgent] = useState<CreateAgentData>({
    name: '',
    personality: '',
    voice: 'male-1',
    avatar: '',
    description: '',
  });

  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const limits = usePlanLimits();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch agents on mount
  useEffect(() => {
    if (user) {
      fetchAgentsData();
    }
  }, [user]);

  const fetchAgentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAgents();
      setAgents(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load agents';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    // Check plan limits before creating
    if (!limits.canCreateAgent) {
      toast({
        title: "Agent limit reached",
        description: "Please upgrade your plan to create more agents",
        variant: "destructive",
      });
      return;
    }

    try {
      setError(null);
      const agent = await createAgent(newAgent);
      setAgents((prev) => [...prev, agent]);
      setIsCreateModalOpen(false);
      setNewAgent({
        name: '',
        personality: '',
        voice: 'male-1',
        avatar: '',
        description: '',
      });
      
      // Refresh limits after creating agent
      limits.refreshLimits();
      
      toast({
        title: 'Success',
        description: `Agent ${agent.name} created successfully`,
      });
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to create agent';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleAgentStatus = async (agentId: string) => {
    try {
      setError(null);
      const updatedAgent = await toggleAgentStatus(agentId);
      setAgents((prev) =>
        prev.map((agent) => (agent._id === agentId ? updatedAgent : agent))
      );
      toast({
        title: 'Success',
        description: `Agent ${updatedAgent.name} is now ${updatedAgent.status}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update agent status';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      setError(null);
      await deleteAgent(agentId);
      setAgents((prev) => prev.filter((agent) => agent._id !== agentId));
      
      // Refresh limits after deleting agent
      limits.refreshLimits();
      
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete agent';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleGenerateQRCode = async (agentId: string) => {
    try {
      setError(null);
      const agent = agents.find((a) => a._id === agentId);
      if (!agent) throw new Error('Agent not found');
      setSelectedAgent(agent);
      const url = await generateQRCode(agentId);
      setQrCodeUrl(url);
      setIsQRModalOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedAgent) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${selectedAgent.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const voiceOptions = [
    { value: 'male-1', label: 'Male Voice 1' },
    { value: 'male-2', label: 'Male Voice 2' },
    { value: 'female-1', label: 'Female Voice 1' },
    { value: 'female-2', label: 'Female Voice 2' },
    { value: 'neutral-1', label: 'Neutral Voice 1' },
  ];

  const personalityOptions = [
    'Friendly and Approachable',
    'Professional and Formal',
    'Enthusiastic and Energetic',
    'Calm and Reassuring',
    'Expert and Knowledgeable',
    'Casual and Relatable',
  ];

  if (authLoading || loading) {
    return <AvatarsSkeleton />;
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              AI Agents
            </h1>
            <p className="text-slate-600 mt-1">Manage your AI sales agents and their performance</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Plan Usage Badge */}
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {limits.agents.used}/{limits.agents.limit} Agents Used
            </Badge>
            
            <Button
              variant="outline"
              onClick={fetchAgentsData}
              className="flex items-center gap-2 border-slate-300"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!limits.canCreateAgent || (user.role !== 'admin' && user.role !== 'owner')}
            >
              <Plus size={16} />
              Create New Agent
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Plan Limit Alert */}
        {!limits.canCreateAgent && (
          <PlanLimitAlert
            type="agent"
            current={limits.agents.used}
            limit={limits.agents.limit}
            planName={limits.planName}
          />
        )}

        {/* Low Limit Warning */}
        {limits.canCreateAgent && limits.agents.remaining <= 2 && limits.agents.remaining > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <strong>Agent limit approaching:</strong> You have {limits.agents.remaining} agent{limits.agents.remaining === 1 ? '' : 's'} remaining on your {limits.planName} plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Agents</p>
                  <p className="text-2xl font-bold text-slate-900">{agents.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="text-blue-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Agents</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {agents.filter((a) => a.status === 'active').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Power className="text-green-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {agents.reduce((sum, agent) => sum + agent.conversations, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-purple-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {agents
                      .reduce(
                        (sum, agent) =>
                          sum + parseFloat(agent.revenue.replace('$', '').replace(',', '')),
                        0
                      )
                      .toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card
              key={agent._id}
              className="relative group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-slate-200/60 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(agent.status)}`}></div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {agent.avatar || agent.name.charAt(0)}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                      ></div>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">{agent.name}</CardTitle>
                      <CardDescription className="text-slate-600">{agent.personality}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGenerateQRCode(agent._id)}>
                        <QrCode size={14} className="mr-2" />
                        Generate QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit size={14} className="mr-2" />
                        Edit Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye size={14} className="mr-2" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleAgentStatus(agent._id)}>
                        <Power size={14} className="mr-2" />
                        {agent.status === 'active' ? 'Pause' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteAgent(agent._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <X size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant={getStatusVariant(agent.status)}
                    className={
                      agent.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : agent.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
                    }
                  >
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </Badge>
                  {agent.status === 'active' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{agent.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50/50">
                    <span className="text-slate-600">Conversations</span>
                    <span className="font-semibold text-slate-800">{agent.conversations}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50/50">
                    <span className="text-slate-600">Conversions</span>
                    <span className="font-semibold text-slate-800">{agent.conversions}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50/50">
                    <span className="text-slate-600">Conversion Rate</span>
                    <span className="font-semibold text-green-600">{agent.conversionRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50/50">
                    <span className="text-slate-600">Revenue</span>
                    <span className="font-semibold text-blue-600">{agent.revenue}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-300 hover:bg-slate-50"
                    onClick={() => handleGenerateQRCode(agent._id)}
                  >
                    <QrCode size={14} className="mr-1" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-300 hover:bg-slate-50"
                    onClick={() => handleToggleAgentStatus(agent._id)}
                  >
                    <Power size={14} className="mr-1" />
                    {agent.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Plus className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No agents created yet</h3>
            <p className="text-slate-600 mb-6">Create your first AI agent to get started</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!limits.canCreateAgent || (user.role !== 'admin' && user.role !== 'owner')}
            >
              <Plus size={16} className="mr-2" />
              Create Your First Agent
            </Button>
            
            {!limits.canCreateAgent && (
              <div className="mt-4 max-w-md mx-auto">
                <PlanLimitAlert
                  type="agent"
                  current={limits.agents.used}
                  limit={limits.agents.limit}
                  planName={limits.planName}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Agent Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Create New AI Agent
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Configure your AI sales agent with personality, voice, and description.
            </DialogDescription>
          </DialogHeader>

          {/* Plan Usage Info in Modal */}
          {limits.canCreateAgent && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                <strong>Plan Usage:</strong> You have {limits.agents.remaining} agent{limits.agents.remaining === 1 ? '' : 's'} remaining on your {limits.planName} plan.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-700">
                  Agent Name *
                </Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Enter agent name"
                  className="mt-1 border-slate-300"
                />
              </div>

              <div>
                <Label htmlFor="personality" className="text-slate-700">
                  Personality *
                </Label>
                <Select
                  value={newAgent.personality}
                  onValueChange={(value) => setNewAgent({ ...newAgent, personality: value })}
                >
                  <SelectTrigger className="mt-1 border-slate-300">
                    <SelectValue placeholder="Select personality type" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalityOptions.map((personality) => (
                      <SelectItem key={personality} value={personality}>
                        {personality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="voice" className="text-slate-700">
                  Voice Style
                </Label>
                <Select
                  value={newAgent.voice}
                  onValueChange={(value) => setNewAgent({ ...newAgent, voice: value })}
                >
                  <SelectTrigger className="mt-1 border-slate-300">
                    <SelectValue placeholder="Select voice style" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="avatar" className="text-slate-700">
                  Avatar Initials
                </Label>
                <Input
                  id="avatar"
                  value={newAgent.avatar}
                  onChange={(e) => setNewAgent({ ...newAgent, avatar: e.target.value })}
                  placeholder="Enter initials (e.g., SJ)"
                  className="mt-1 border-slate-300"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700">
                  Description *
                </Label>
                <textarea
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Describe your agent's role and specialization..."
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-slate-300"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleCreateAgent}
                disabled={!limits.canCreateAgent || !newAgent.name || !newAgent.personality || !newAgent.description}
              >
                <Save size={16} className="mr-2" />
                Create Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              QR Code for {selectedAgent?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Scan this QR code to chat with your AI agent
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 border border-slate-200 rounded-lg"
              />
            )}
            <Button
              onClick={downloadQRCode}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download size={16} className="mr-2" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Skeleton loader component
const AvatarsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/60 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-md" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="space-y-2 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full rounded-lg" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avatars;