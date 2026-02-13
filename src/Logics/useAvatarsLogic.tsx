import React, { useState, useMemo } from 'react';
import { Agent } from '../types/agent';

export const useAvatarsLogic = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [formData, setFormData] = useState<Partial<Agent>>({ name: '', personality: '', role: '', description: '' });

  const maxAgents = 5; // Hardcoded for now, could come from user's plan

  const totalAgents = useMemo(() => agents.length, [agents]);
  const activeAgents = useMemo(() => agents.filter(agent => agent.status === 'active').length, [agents]);
  const totalConversations = useMemo(() => agents.reduce((sum, agent) => sum + agent.conversations, 0), [agents]);
  const totalConversions = useMemo(() => agents.reduce((sum, agent) => sum + agent.conversions, 0), [agents]);
  const avgConversionRate = useMemo(() => 
    totalConversations > 0 ? Math.round((totalConversions / totalConversations) * 100) : 0, 
    [totalConversions, totalConversations]
  );

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.personality.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, filterStatus]);


  // Placeholder functions
  const handleCreateAgent = () => {
    console.log('Create agent logic here');
  };

  const toggleAgentStatus = (agentId: string) => {
    console.log(`Toggle status for agent ${agentId}`);
  };

  const handleShowQR = (agent: Agent) => {
    console.log(`Show QR for agent ${agent.name}`);
  };

  return {
    agents,
    setAgents,
    showCreateModal,
    setShowCreateModal,
    showQRModal,
    setShowQRModal,
    selectedAgent,
    setSelectedAgent,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    formData,
    setFormData,
    maxAgents,
    totalAgents,
    activeAgents,
    totalConversations,
    totalConversions,
    avgConversionRate,
    handleCreateAgent,
    toggleAgentStatus,
    handleShowQR,
    filteredAgents,
  };
};