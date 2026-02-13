import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  MoreVertical,
  QrCode,
  Play,
  Pause,
  Edit,
  Trash2,
  X,
  Download,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  Bot,
  ChevronDown,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  Activity,
  Eye,
  Copy,
  Share2,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAvatarsLogic } from '../Logics/useAvatarsLogic';

export default function Avatars() {
  const {
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
    filteredAgents
  } = useAvatarsLogic();

  return (
    <div className="min-h-screen   bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] p-10  ">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Enhanced Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="space-y-3">
              <h1 className="text-6xl font-bold text-white tracking-tight">
                AI Agents
              </h1>
              <p className="text-lg text-slate-400">Intelligent automation for your sales team</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Plan Usage - Minimalist */}
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/40 border border-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <div className="text-sm">
                    <span className="text-white font-bold">{totalAgents}</span>
                    <span className="text-slate-500 mx-1.5">/</span>
                    <span className="text-slate-500">{maxAgents}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Agents Used</span>
              </div>

              {/* Action Buttons */}
              <button className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group">
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500" />
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={totalAgents >= maxAgents}
                className="group flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:border disabled:border-slate-700"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Create Agent
              </button>
            </div>
          </div>

          {/* Enhanced KPI Stats - Organic Layout */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between gap-8 px-4">
              {/* Stat 1 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{totalAgents}</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Total Agents</div>
                <div className="text-slate-600 text-sm mt-0.5">{maxAgents - totalAgents} slots available</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 2 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{activeAgents}</span>
                </div>
                <div className="text-slate-400 font-medium">Active Now</div>
                <div className="text-slate-600 text-sm mt-0.5">{agents.filter(a => a.status === 'paused').length} paused</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 3 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{totalConversations.toLocaleString()}</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +24%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Conversations</div>
                <div className="text-slate-600 text-sm mt-0.5">Last 30 days</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 4 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{avgConversionRate}%</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +8%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Conversion Rate</div>
                <div className="text-slate-600 text-sm mt-0.5">Average across agents</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Minimal */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/30 border border-gray-400 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'paused' | 'draft')}
              className="px-4 py-3.5 bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-300 text-sm hover:bg-slate-900/50 hover:border-slate-700/50 transition-all focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          searchQuery || filterStatus !== 'all' ? (
            <NoResultsState />
          ) : (
            <EmptyState onCreateClick={() => setShowCreateModal(true)} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <EnhancedAgentCard
                key={agent.id}
                agent={agent}
                onToggleStatus={() => toggleAgentStatus(agent.id)}
                onShowQR={() => handleShowQR(agent)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Create Agent Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 max-w-md w-11/12 max-h-[85vh] overflow-y-auto shadow-2xl mx-auto">
            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-8 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Create AI Agent</h2>
                </div>
                <p className="text-slate-400 text-sm ml-13">Configure your intelligent sales assistant</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="relative p-2.5 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            {/* Plan Usage Info - Enhanced */}
            <div className="mx-8 mt-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-blue-100 font-semibold text-lg mb-1">
                      {maxAgents - totalAgents} Agent Slots Available
                    </h4>
                    <p className="text-blue-300/70 text-sm leading-relaxed">
                      You're currently using <span className="text-blue-200 font-medium">{totalAgents} of {maxAgents}</span> AI agents. 
                      Each agent can handle unlimited conversations and continuously learns from interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content - Enhanced */}
            <div className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h3 className="text-lg font-bold text-white">Basic Information</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Agent Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sarah - Sales Expert"
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Personality <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personality}
                      onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                      placeholder="e.g., Professional & Friendly"
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                    <p className="text-xs text-slate-500 mt-2">This defines how your agent communicates with clients</p>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h3 className="text-lg font-bold text-white">Role & Expertise</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Luxury Residential Specialist"
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the agent's expertise, communication style, and ideal use cases..."
                      rows={4}
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none hover:border-slate-600/50"
                    />
                    <p className="text-xs text-slate-500 mt-2">Provide context to help the AI understand its role better</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-4 p-8 border-t border-slate-700/50 bg-slate-900/30">
              <p className="text-sm text-slate-400">
                <span className="text-slate-300 font-medium">Tip:</span> Clear descriptions lead to better agent performance
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={!formData.name || !formData.personality}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2"
                >
                  Create Agent
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Enhanced QR Code Modal */}
      {showQRModal && selectedAgent && (
        <Modal onClose={() => setShowQRModal(false)}>
          <div className="bg-slate-900 rounded-2xl border  border-slate-800/50 w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-white">Share Agent</h2>
                <p className="text-slate-500 text-sm mt-0.5">{selectedAgent.name}</p>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* QR Code Content */}
            <div className="p-6">
              <div className="bg-white rounded-xl p-6 mb-5">
                <div className="w-full aspect-square bg-slate-50 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-700" />
                </div>
              </div>
              
              <div className="text-center mb-5">
                <p className="text-slate-300 font-medium text-sm mb-1">Scan to start conversation</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Share this QR code with clients to instantly connect
                </p>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600/50 transition-all text-sm font-medium">
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600/50 transition-all text-sm font-medium">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>

              {/* Download Button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-semibold transition-all duration-200 text-sm">
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Enhanced Subcomponents
function EnhancedAgentCard({ 
  agent, 
  onToggleStatus, 
  onShowQR 
}: { 
  agent: Agent; 
  onToggleStatus: (agentId: string) => void;
  onShowQR: (agent: Agent) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    active: { 
      label: 'Active', 
      color: 'text-emerald-400',
      dot: 'bg-emerald-400'
    },
    paused: { 
      label: 'Paused', 
      color: 'text-amber-400',
      dot: 'bg-amber-400'
    },
    draft: { 
      label: 'Draft', 
      color: 'text-slate-500',
      dot: 'bg-slate-500'
    }
  };

  const status = statusConfig[agent.status];
  const conversionRate = agent.conversations > 0 
    ? Math.round((agent.conversions / agent.conversations) * 100) 
    : 0;

  return (
    <div className="group relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
      {/* Content */}
      <div className="relative">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {agent.avatar}
              </div>
              {agent.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base mb-1 truncate">
                {agent.name}
              </h3>
              <p className="text-slate-500 text-sm font-medium">{agent.personality}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-2">
            <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <MoreVertical className="w-4 h-4 text-slate-500" />
              </button>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                    <button className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                    <button className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                      Edit Agent
                    </button>
                    <button className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </button>
                    <div className="h-px bg-slate-700/50 my-1.5" />
                    <button className="w-full px-3.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {agent.description}
        </p>

        {/* Performance Metrics */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Conversations</span>
            <span className="text-white font-semibold">{agent.conversations.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Conversions</span>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">{agent.conversions}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
                <span className="text-emerald-400 text-xs font-semibold w-9 text-right">{conversionRate}%</span>
              </div>
            </div>
          </div>
          {agent.responseTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Avg Response</span>
              <span className="text-white font-semibold">{agent.responseTime}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onShowQR}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <QrCode className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={onToggleStatus}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
              agent.status === 'active'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {agent.status === 'active' ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Activate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 rounded-3xl flex items-center justify-center shadow-2xl">
          <Bot className="w-12 h-12 text-slate-400" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-3">No AI Agents Yet</h3>
      <p className="text-slate-400 text-center max-w-md mb-8 leading-relaxed">
        Create your first AI agent to automate conversations, qualify leads, and boost conversions 24/7.
      </p>
      <button
        onClick={onCreateClick}
        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        Create Your First Agent
      </button>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Agents Found</h3>
      <p className="text-slate-400 text-center max-w-md">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full my-8 animate-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  );
}
