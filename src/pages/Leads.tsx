import React, { Component, ComponentType } from 'react';
import {
  Search,
  Phone,
  Mail,
  Calendar,
  Star,
  MapPin,
  MoreHorizontal,
  Download,
  User,
  Home,
  Building,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Sparkles,
  Target,
  Zap,
  BarChart3,
  Clock,
  Navigation,
  FileText,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import ChatModal from '../components/ChatModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { useLeadsLogic } from '../Logics/useLeadsLogic';
import { Lead, Visit } from '../types/lead';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400">Please refresh the page and try again</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// LeadDetailsModal Component
function LeadDetailsModal({
  lead,
  visits,
  isOpen,
  onClose,
}: {
  lead: Lead;
  visits: Visit[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const leadVisits = visits.filter((visit) => visit.leadEmail === lead.email);
  const confirmedVisits = leadVisits.filter((v) => v.status === 'confirmed');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-modal rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="sticky top-0 bg-transparent border-b border-blue-800/20 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Lead Details</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{lead.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900 truncate">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-medium text-gray-900">{lead.score}/100</p>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-medium text-gray-900">{lead.property}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{lead.propertyType || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-medium text-gray-900">{lead.bedrooms || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-medium text-gray-900">
                  ${(lead.budget?.min || 0).toLocaleString()} - ${(lead.budget?.max || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Visits */}
          {leadVisits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Visits ({leadVisits.length})</h3>
              <div className="space-y-2">
                {leadVisits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{visit.propertyName}</p>
                      <p className="text-sm text-gray-600">{new Date(visit.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={visit.status === 'confirmed' ? 'default' : 'secondary'}>
                      {visit.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-gray-700">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Leads: ComponentType = () => {
  const {
    activeTab,
    setActiveTab,
    leads,
    visits,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    newLead,
    setNewLead,
    isLeadDialogOpen,
    setIsLeadDialogOpen,
    editingLead,
    setEditingLead,
    chatModalLead,
    setChatModalLead,
    detailsModalLead,
    setDetailsModalLead,
    sortConfig,
    selectedLeads,
    setSelectedLeads,
    sortedLeads,
    filteredLeads,
    stats,
    handleSort,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
    handleExport,
    toggleSelectLead,
    toggleSelectAll,
    getStatusColor,
    formatBudget,
    formatDate,
    getVisitCount,
  } = useLeadsLogic();

  const SortableHeader: React.FC<{
    column: string;
    children: React.ReactNode;
    sortKey: string;
  }> = ({ column, children, sortKey }) => (
    <th
      className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 cursor-pointer  transition-colors group text-xs sm:text-sm"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? (
              <ChevronUp size={12} className="sm:w-3.5 sm:h-3.5" />
            ) : (
              <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
            )
          ) : (
            <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
          )}
        </div>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] -m-4 lg:-m-6  lg:p-6  flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
        {/* Header */}
        <div className="bg-transparent border-b border-slate-800/40">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Leads</h1>
                <p className="text-slate-300 mt-1 text-sm sm:text-base">Manage your property leads effectively</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={filteredLeads.length === 0}
                  className="flex items-center space-x-2 border-white text-sm"
                >
                  <Download size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Export</span>
                  {selectedLeads.size > 0 && (
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {selectedLeads.size}
                    </span>
                  )}
                </Button>
                <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 text-sm">
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      <span>New Lead</span>
                    </Button>
                  </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-modal hide-scrollbar">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">{editingLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-sm">Name *</Label>
                          <Input
                            value={newLead.name || ''}
                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Email *</Label>
                          <Input
                            type="email"
                            value={newLead.email || ''}
                            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Phone *</Label>
                          <Input
                            value={newLead.phone || ''}
                            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Property *</Label>
                          <Input
                            value={newLead.property || ''}
                            onChange={(e) => setNewLead({ ...newLead, property: e.target.value })}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Score</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={newLead.score || ''}
                            onChange={(e) => setNewLead({ ...newLead, score: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Status</Label>
                          <Select
                            value={newLead.status || ''}
                            onValueChange={(value) => setNewLead({ ...newLead, status: value as Lead['status'] })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="qualifying">Qualifying</SelectItem>
                              <SelectItem value="interested">Interested</SelectItem>
                              <SelectItem value="booked">Booked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Property Type</Label>
                          <Select
                            value={newLead.propertyType || ''}
                            onValueChange={(value) => setNewLead({ ...newLead, propertyType: value })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Bedrooms</Label>
                          <Input
                            type="number"
                            value={newLead.bedrooms || ''}
                            onChange={(e) => setNewLead({ ...newLead, bedrooms: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Location Preferences (comma separated)</Label>
                        <Input
                          value={newLead.locationPreference?.join(', ') || ''}
                          onChange={(e) =>
                            setNewLead({
                              ...newLead,
                              locationPreference: e.target.value.split(',').map((loc) => loc.trim()),
                            })
                          }
                          placeholder="Delhi, Mumbai, Pune"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Notes</Label>
                        <Textarea
                          value={newLead.notes || ''}
                          onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                          placeholder="Additional notes about the lead..."
                          className="text-sm"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                        {editingLead ? 'Update Lead' : 'Create Lead'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">Total Leads</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="text-blue-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">Hot Leads</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.hot}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-red-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">New</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.new}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="text-purple-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">Booked</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.booked}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">Interested</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.interested}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-blue-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">High Value</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.highValue}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-emerald-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">With Visits</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.withVisits}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Navigation className="text-orange-600" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Leads', icon: null },
                { value: 'hot', label: 'Hot', icon: <Sparkles size={12} className="mr-1" /> },
                { value: 'new', label: 'New', icon: null },
                { value: 'booked', label: 'Booked', icon: null },
                { value: 'interested', label: 'Interested', icon: null },
                { value: 'with_visits', label: 'With Visits', icon: <Navigation size={12} className="mr-1" /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex items-center px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2  transform -translate-y-1/2 text-slate-400" size={14} />
              <Input
                placeholder="Search leads..."
                className="pl-9 sm:pl-10 w-full sm:w-80 bg-slate-700/40 text-sm text-slate-200 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Leads Table */}
          <Card className="bg-slate-900/30 border border-slate-800/50 shadow-sm">
            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4 text-slate-300">
                  <User size={40} className="sm:w-12 sm:h-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No leads found</h3>
                  <p className="text-sm sm:text-base text-slate-300 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first lead'}
                  </p>
                  <Button
                    onClick={() => setIsLeadDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Plus size={14} className="mr-2" />
                    Add New Lead
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/40">
                        <th className="w-8 sm:w-12 py-2 sm:py-3 px-2 sm:px-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <SortableHeader column="Lead" sortKey="name">
                          <span className="text-slate-300">Lead</span>
                        </SortableHeader>
                        <SortableHeader column="Property" sortKey="property">
                          <span className="text-slate-300">Property</span>
                        </SortableHeader>
                        <SortableHeader column="Score" sortKey="score">
                          <span className="text-slate-300">Score</span>
                        </SortableHeader>
                        <SortableHeader column="Status" sortKey="status">
                          <span className="text-slate-300">Status</span>
                        </SortableHeader>
                        <SortableHeader column="Budget" sortKey="budget">
                          <span className="text-slate-300">Budget</span>
                        </SortableHeader>
                        <SortableHeader column="Location" sortKey="locationPreference">
                          <span className="text-slate-300">Location</span>
                        </SortableHeader>
                        <SortableHeader column="Visits" sortKey="visits">
                          <span className="text-slate-300">Visits</span>
                        </SortableHeader>
                        <SortableHeader column="Last Contact" sortKey="lastContact">
                          <span className="text-slate-300">Last Contact</span>
                        </SortableHeader>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-300 text-xs sm:text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredLeads.map((lead) => {
                        const leadVisits = visits.filter((visit) => visit.leadEmail === lead.email);
                        return (
                          <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <input
                                type="checkbox"
                                checked={selectedLeads.has(lead.id)}
                                onChange={() => toggleSelectLead(lead.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                                  {lead.name?.charAt(0) || 'L'}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-100 text-xs sm:text-sm truncate">{lead.name}</div>
                                  <div className="text-xs text-slate-400 truncate">{lead.email}</div>
                                  <div className="text-xs text-slate-400">{lead.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2">
                                <Home size={14} className="text-gray-400 flex-shrink-0" />
                                <span className="font-medium text-slate-100 text-xs sm:text-sm truncate">{lead.property}</span>
                              </div>
                              <div className="text-xs text-slate-400 flex items-center space-x-2 mt-1">
                                <Building size={12} />
                                <span className="capitalize truncate">{lead.propertyType || 'Not specified'}</span>
                                {lead.bedrooms && (
                                  <>
                                    <span>•</span>
                                    <span>{lead.bedrooms} Beds</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <Badge
                                className={`font-mono font-semibold text-xs ${getStatusColor(lead.status || 'new')} border-0`}
                              >
                                <Star size={10} className="mr-1" />
                                {lead.score}
                              </Badge>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(lead.status || 'new')}`}>
                                {lead.status}
                              </Badge>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2">
                                <DollarSign size={12} className="text-gray-400 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-xs sm:text-sm">{formatBudget(lead.budget)}</span>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2">
                                <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                <div className="max-w-xs">
                                  <div className="text-xs sm:text-sm text-slate-100 truncate">
                                    {lead.locationPreference?.slice(0, 2).join(', ')}
                                    {lead.locationPreference && lead.locationPreference.length > 2 && (
                                      <span className="text-gray-500">
                                        {' '}
                                        +{lead.locationPreference.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2">
                                <Navigation size={12} className="text-gray-400 flex-shrink-0" />
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  {leadVisits.length}
                                </Badge>
                                {leadVisits.length > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="text-xs text-gray-500 cursor-help hidden sm:inline">
                                          {leadVisits.filter((v) => v.status === 'confirmed').length} confirmed
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="text-xs">
                                          <div>Total: {leadVisits.length}</div>
                                          <div>Confirmed: {leadVisits.filter((v) => v.status === 'confirmed').length}</div>
                                          <div>Scheduled: {leadVisits.filter((v) => v.status === 'scheduled').length}</div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="text-xs sm:text-sm text-slate-400">
                                {lead.lastContact ? formatDate(lead.lastContact) : 'Never'}
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200"
                                        onClick={() => setDetailsModalLead(lead)}
                                      >
                                        <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200"
                                        onClick={() => window.location.href = `tel:${lead.phone}`}
                                      >
                                        <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Call Lead</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200"
                                        onClick={() => window.location.href = `mailto:${lead.email}`}
                                      >
                                        <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Email Lead</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200">
                                      <MoreHorizontal size={12} className="sm:w-3.5 sm:h-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingLead(lead);
                                        setNewLead(lead);
                                        setIsLeadDialogOpen(true);
                                      }}
                                      className="text-sm"
                                    >
                                      <Edit size={14} className="mr-2" />
                                      Edit Lead
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setChatModalLead(lead)} className="text-sm">
                                      <MessageSquare size={14} className="mr-2" />
                                      Open Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className="text-red-600 focus:text-red-600 text-sm"
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Delete Lead
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 sm:mt-6">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
                {selectedLeads.size > 0 && ` • ${selectedLeads.size} selected`}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-gray-300 text-sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {chatModalLead && (
          <ChatModal
            lead={chatModalLead}
            isOpen={!!chatModalLead}
            onClose={() => setChatModalLead(null)}
          />
        )}

        {detailsModalLead && (
          <LeadDetailsModal
            lead={detailsModalLead}
            visits={visits}
            isOpen={!!detailsModalLead}
            onClose={() => setDetailsModalLead(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Leads;
