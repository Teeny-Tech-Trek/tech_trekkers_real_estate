import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Power, MoreHorizontal, X, Save, QrCode, MessageSquare, Calendar, Download, RefreshCw, AlertTriangle, Sparkles, Bot, Zap, TrendingUp } from 'lucide-react';
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
import { motion } from 'framer-motion';

interface CreateAgentData {
  name: string;
  personality: string;
  voice: string;
  avatar: string;
  avatarFile?: File | null;
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newAgent, setNewAgent] = useState<CreateAgentData>({
    name: '',
    personality: '',
    voice: 'male-1',
    avatar: '',
    avatarFile: null,
    description: '',
  });

  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const limits = usePlanLimits();

  // Cleanup avatar preview URL
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
      console.log('Fetched agents:', data);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setAvatarError('Please upload a JPEG, PNG, or GIF image.');
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a JPEG, PNG, or GIF image.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAvatarError('Image size must be less than 5MB.');
        toast({
          title: 'File Too Large',
          description: 'Image size must be less than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setNewAgent({ ...newAgent, avatarFile: file });
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleCreateAgent = async () => {
    if (!limits.canCreateAgent) {
      toast({
        title: 'Agent limit reached',
        description: 'Please upgrade your plan to create more agents',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      setError(null);
      const formData = new FormData();
      formData.append('name', newAgent.name);
      formData.append('personality', newAgent.personality);
      formData.append('voice', newAgent.voice);
      formData.append('avatar', newAgent.avatarFile ? '' : newAgent.avatar); // Clear initials if file is uploaded
      formData.append('description', newAgent.description);
      if (newAgent.avatarFile) {
        formData.append('avatarFile', newAgent.avatarFile);
      }

      const agent = await createAgent(formData);
      setAgents((prev) => [...prev, agent]);
      setIsCreateModalOpen(false);
      setNewAgent({
        name: '',
        personality: '',
        voice: 'male-1',
        avatar: '',
        avatarFile: null,
        description: '',
      });
      setAvatarPreview(null);
      setAvatarError(null);
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
    } finally {
      setIsCreating(false);
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
        return 'from-green-500 to-emerald-600';
      case 'paused':
        return 'from-yellow-500 to-orange-500';
      case 'draft':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-400 to-gray-500';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-20 shadow-sm relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-6 py-5"
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              AI Agents
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Manage your AI sales agents and their performance</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Plan Usage Badge */}
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-100 hover:to-purple-100 border-0 px-4 py-2">
              <Sparkles className="w-3 h-3 mr-1" />
              {limits.agents.used}/{limits.agents.limit} Agents
            </Badge>
            
            <Button
              variant="outline"
              onClick={fetchAgentsData}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!limits.canCreateAgent || (user.role !== 'admin' && user.role !== 'owner')}
              aria-label="Create new AI agent"
            >
              <Plus size={16} />
              Create New Agent
            </Button>
          </div>
        </motion.div>
      </header>

      <div className="p-6 max-w-7xl mx-auto relative z-10">
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Plan Limit Alert */}
        {!limits.canCreateAgent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PlanLimitAlert
              type="agent"
              current={limits.agents.used}
              limit={limits.agents.limit}
              planName={limits.planName}
            />
          </motion.div>
        )}

        {/* Low Limit Warning */}
        {limits.canCreateAgent && limits.agents.remaining <= 2 && limits.agents.remaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="mb-6 border-amber-200 bg-amber-50/50 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <strong>Agent limit approaching:</strong> You have {limits.agents.remaining} agent{limits.agents.remaining === 1 ? '' : 's'} remaining on your {limits.planName} plan.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Bot className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.filter((a) => a.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Power className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl" />
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.reduce((sum, agent) => sum + agent.conversations, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MessageSquare className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="relative group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 overflow-hidden shadow-lg">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getStatusColor(agent.status)}`}></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {agent.avatarUrl ? (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg"
                          >
                            <img
  src={`https://api.estate.techtrekkers.ai${agent.avatarUrl}`}
  alt={agent.name}
  className="w-full h-full object-cover"
/>

                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          >
                            {agent.avatar || agent.name.charAt(0)}
                          </motion.div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-gradient-to-r ${getStatusColor(agent.status)} shadow-sm`}
                        ></div>
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-800">{agent.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">{agent.personality}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleGenerateQRCode(agent._id)}>
                          <QrCode size={14} className="mr-2" />
                          Generate QR Code
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
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-600 border-0 shadow-sm'
                          : agent.status === 'paused'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-500 border-0 shadow-sm'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-200 border-0'
                      }
                    >
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </Badge>
                    {agent.status === 'active' && (
                      <div className="flex items-center space-x-1.5">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
                      <span className="text-gray-600 font-medium">Conversations</span>
                      <span className="font-bold text-blue-600">{agent.conversations}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50">
                      <span className="text-gray-600 font-medium">Conversions</span>
                      <span className="font-bold text-green-600">{agent.conversions}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50">
                      <span className="text-gray-600 font-medium">Last Update</span>
                      <span className="font-bold text-purple-600">
                        {new Date(agent.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      onClick={() => handleGenerateQRCode(agent._id)}
                      aria-label="Generate QR code"
                    >
                      <QrCode size={14} className="mr-1" />
                      QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      onClick={() => handleToggleAgentStatus(agent._id)}
                      aria-label={agent.status === 'active' ? 'Pause agent' : 'Activate agent'}
                    >
                      <Power size={14} className="mr-1" />
                      {agent.status === 'active' ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {agents.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Bot className="text-blue-600" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No agents created yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first AI agent to start automating your real estate sales process</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              disabled={!limits.canCreateAgent || (user.role !== 'admin' && user.role !== 'owner')}
              aria-label="Create your first AI agent"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Agent
            </Button>
            
            {!limits.canCreateAgent && (
              <div className="mt-6 max-w-md mx-auto">
                <PlanLimitAlert
                  type="agent"
                  current={limits.agents.used}
                  limit={limits.agents.limit}
                  planName={limits.planName}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Create Agent Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) {
          setAvatarPreview(null);
          setAvatarError(null);
          setNewAgent({
            name: '',
            personality: '',
            voice: 'male-1',
            avatar: '',
            avatarFile: null,
            description: '',
          });
        }
      }}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Create New AI Agent
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Configure your AI sales agent with personality, voice, and description.
            </DialogDescription>
          </DialogHeader>

          {/* Plan Usage Info in Modal */}
          {limits.canCreateAgent && (
            <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Plan Usage:</strong> You have {limits.agents.remaining} agent{limits.agents.remaining === 1 ? '' : 's'} remaining on your {limits.planName} plan.
              </AlertDescription>
            </Alert>
          )}

          {/* Error in Modal */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Agent Name *
                </Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Enter agent name"
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="personality" className="text-gray-700 font-medium">
                  Personality *
                </Label>
                <Select
                  value={newAgent.personality}
                  onValueChange={(value) => setNewAgent({ ...newAgent, personality: value })}
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true">
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
                <Label htmlFor="voice" className="text-gray-700 font-medium">
                  Voice Style
                </Label>
                <Select
                  value={newAgent.voice}
                  onValueChange={(value) => setNewAgent({ ...newAgent, voice: value })}
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                <Label htmlFor="avatar" className="text-gray-700 font-medium">
                  Avatar Initials
                </Label>
                <Input
                  id="avatar"
                  value={newAgent.avatar}
                  onChange={(e) => setNewAgent({ ...newAgent, avatar: e.target.value })}
                  placeholder="Enter initials (e.g., SJ)"
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="avatarFile" className="text-gray-700 font-medium">
                  Avatar Image
                </Label>
                <Input
                  id="avatarFile"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarChange}
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  aria-describedby="avatarError"
                />
                {avatarError && (
                  <p id="avatarError" className="text-red-500 text-sm mt-1">{avatarError}</p>
                )}
                {avatarPreview && (
                  <div className="mt-2">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-xl object-cover shadow-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Role *
                </Label>
                <textarea
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Describe your agent's role ex: Customer Support"
                  className="mt-1.5 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] resize-none"
                  aria-required="true"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Cancel agent creation"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                onClick={handleCreateAgent}
                disabled={isCreating || !limits.canCreateAgent || !newAgent.name || !newAgent.personality || !newAgent.description}
                aria-label="Create AI agent"
              >
                {isCreating ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                Create Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              QR Code for {selectedAgent?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Scan this QR code to chat with your AI agent
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCodeUrl && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-white rounded-2xl shadow-xl"
              >
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 rounded-xl"
                />
              </motion.div>
            )}
            <Button
              onClick={downloadQRCode}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              aria-label="Download QR code"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400" />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-md" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-20 mb-4 rounded-full" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="space-y-2 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full rounded-xl" />
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