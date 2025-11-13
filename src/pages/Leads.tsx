// pages/Leads.tsx
import React, { useState, useEffect, Component, ComponentType } from 'react';
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
import {
  fetchLeads,
  fetchVisits,
  createLead,
  updateLead,
  deleteLead,
} from '../services/leadApi';
import { Lead, Visit } from '../types/lead';
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <Card className="w-full max-w-md mx-4 border-0 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                Please try refreshing the page
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lead Details Component
const LeadDetailsModal: React.FC<{
  lead: Lead;
  visits: Visit[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ lead, visits, isOpen, onClose }) => {
  const leadVisits = visits.filter((visit) => visit.leadEmail === lead.email);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const formatBudget = (budget: any) => {
    if (!budget) return 'Flexible';
    if (budget.min === 0 && budget.max === 1500000) return 'Up to $1.5M';
    return `$${(budget.min / 1000000).toFixed(1)}M - $${(budget.max / 1000000).toFixed(1)}M`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Lead Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                    <p className="text-lg font-semibold">{lead.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Lead Score</Label>
                    <Badge className={`font-mono font-semibold ${getScoreColor(lead.score || 0)} border-0`}>
                      <Star size={12} className="mr-1" />
                      {lead.score}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-lg">{lead.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-lg">{lead.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant="outline" className={getStatusColor(lead.status || 'new')}>
                      {lead.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Contact</Label>
                    <p className="text-lg">{lead.lastContact ? formatDate(lead.lastContact) : 'Never'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home size={20} />
                  <span>Property Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Property Type</Label>
                    <p className="text-lg capitalize">{lead.propertyType || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bedrooms</Label>
                    <p className="text-lg">{lead.bedrooms || 'Flexible'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bathrooms</Label>
                    <p className="text-lg">{lead.bathrooms || 'Flexible'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Timeline</Label>
                    <p className="text-lg">{lead.timeline ? lead.timeline.replace('_', ' ') : 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Budget</Label>
                  <p className="text-lg font-semibold">{formatBudget(lead.budget)}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Location Preferences</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lead.locationPreference?.map((location, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        <MapPin size={12} className="mr-1" />
                        {location}
                      </Badge>
                    )) || 'Not specified'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {lead.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText size={20} />
                    <span>Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{lead.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Visits & Sidebar */}
          <div className="space-y-6">
            {/* Scheduled Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>Scheduled Visits</span>
                  <Badge variant="secondary" className="ml-2">
                    {leadVisits.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadVisits.length > 0 ? (
                  <div className="space-y-3">
                    {leadVisits.map((visit) => (
                      <div key={visit.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{visit.propertyAddress || 'Property Visit'}</p>
                            <p className="text-sm text-gray-600">{formatDate(visit.date)} at {visit.time}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(visit.status)}>
                            {visit.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>Duration: {visit.duration}</span>
                          </div>
                          {visit.notes && (
                            <p className="mt-1 text-xs">Notes: {visit.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No scheduled visits</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = `tel:${lead.phone}`}>
                  <Phone size={16} className="mr-2" />
                  Call Lead
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = `mailto:${lead.email}`}>
                  <Mail size={16} className="mr-2" />
                  Send Email
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule Visit
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText size={16} className="mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>

            {/* Lead Source */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Source</span>
                    <span className="font-medium">{lead.source || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Preferred Contact</span>
                    <span className="font-medium capitalize">{lead.preferredContact || 'Any'}</span>
                  </div>
                  {lead.sessionId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Session ID</span>
                      <span className="font-medium text-xs">{lead.sessionId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Leads: ComponentType = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [chatModalLead, setChatModalLead] = useState<Lead | null>(null);
  const [detailsModalLead, setDetailsModalLead] = useState<Lead | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'score',
    direction: 'desc',
  });
  const [selectedLeads, setSelectedLeads] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [leadsData, visitsData] = await Promise.all([fetchLeads(), fetchVisits()]);
        setLeads(leadsData);
        setVisits(visitsData);
        console.log('Visits Data:', visitsData);
        console.log('Leads Data:', leadsData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sort leads
  const sortedLeads = React.useMemo(() => {
    const sortableLeads = [...leads];
    if (sortConfig.key) {
      sortableLeads.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof Lead];
        let bValue = b[sortConfig.key as keyof Lead];

        if (sortConfig.key === 'score') {
          aValue = a.score || 0;
          bValue = b.score || 0;
        } else if (sortConfig.key === 'budget') {
          aValue = a.budget?.max || 0;
          bValue = b.budget?.max || 0;
        } else if (sortConfig.key === 'lastContact') {
          aValue = new Date(a.lastContact || 0).getTime();
          bValue = new Date(b.lastContact || 0).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  // Filter leads based on active tab and search
  const filteredLeads = sortedLeads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.property?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.locationPreference?.some((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'hot'
        ? (lead.score || 0) >= 70
        : activeTab === 'new'
        ? lead.status === 'new'
        : activeTab === 'booked'
        ? lead.status === 'booked'
        : activeTab === 'interested'
        ? lead.status === 'interested'
        : activeTab === 'with_visits'
        ? visits.some((visit) => visit.leadEmail === lead.email)
        : true;

    return matchesSearch && matchesTab;
  });

  // Statistics
  const stats = {
    total: leads.length,
    hot: leads.filter((lead) => (lead.score || 0) >= 70).length,
    new: leads.filter((lead) => lead.status === 'new').length,
    booked: leads.filter((lead) => lead.status === 'booked').length,
    interested: leads.filter((lead) => lead.status === 'interested').length,
    highValue: leads.filter((lead) => (lead.budget?.max || 0) >= 1000000).length,
    withVisits: leads.filter((lead) => visits.some((visit) => visit.leadEmail === lead.email)).length,
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email || !newLead.phone || !newLead.property) {
      toast({
        title: 'Error',
        description: 'Name, email, phone, and property are required',
        variant: 'destructive',
      });
      return;
    }
    try {
      const createdLead = await createLead(newLead);
      setLeads([createdLead, ...leads]);
      setNewLead({});
      setIsLeadDialogOpen(false);
      toast({ title: 'Success', description: 'Lead created successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create lead',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !newLead.name || !newLead.email || !newLead.phone || !newLead.property) {
      toast({
        title: 'Error',
        description: 'Name, email, phone, and property are required',
        variant: 'destructive',
      });
      return;
    }
    try {
      const updatedLead = await updateLead(editingLead.id.toString(), newLead);
      setLeads(leads.map((lead) => (lead.id === editingLead.id ? updatedLead : lead)));
      setEditingLead(null);
      setNewLead({});
      setIsLeadDialogOpen(false);
      toast({ title: 'Success', description: 'Lead updated successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLead = async (id: string | number) => {
    try {
      await deleteLead(id.toString());
      setLeads(leads.filter((lead) => lead.id !== id));
      toast({ title: 'Success', description: 'Lead deleted successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    const dataToExport =
      selectedLeads.size > 0
        ? leads.filter((lead) => selectedLeads.has(lead.id))
        : filteredLeads;

    const csvContent = [
      ['Name', 'Email', 'Phone', 'Property', 'Score', 'Status', 'Budget', 'Location', 'Last Contact', 'Visits Count'],
      ...dataToExport.map((lead) => {
        const leadVisits = visits.filter((visit) => visit.leadEmail === lead.email);
        return [
          lead.name,
          lead.email,
          lead.phone,
          lead.property,
          lead.score,
          lead.status,
          `$${(lead.budget?.min || 0).toLocaleString()} - $${(lead.budget?.max || 0).toLocaleString()}`,
          lead.locationPreference?.join(', '),
          new Date(lead.lastContact || '').toLocaleDateString(),
          leadVisits.length.toString(),
        ];
      }),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: `Exported ${dataToExport.length} leads to CSV`,
    });
  };

  const toggleSelectLead = (id: string | number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((lead) => lead.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'interested':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'qualifying':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget) return 'Flexible';
    if (budget.min === 0 && budget.max === 1500000) return 'Up to $1.5M';
    return `$${(budget.min / 1000000).toFixed(1)}M - $${(budget.max / 1000000).toFixed(1)}M`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getVisitCount = (leadEmail: string) => {
    return visits.filter((visit) => visit.leadEmail === leadEmail).length;
  };

  const SortableHeader: React.FC<{
    column: string;
    children: React.ReactNode;
    sortKey: string;
  }> = ({ column, children, sortKey }) => (
    <th
      className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors group"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )
          ) : (
            <ChevronDown size={14} className="text-gray-400" />
          )}
        </div>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                <p className="text-gray-600 mt-1">Manage your property leads effectively</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={filteredLeads.length === 0}
                  className="flex items-center space-x-2 border-gray-300"
                >
                  <Download size={16} />
                  <span>Export</span>
                  {selectedLeads.size > 0 && (
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {selectedLeads.size}
                    </span>
                  )}
                </Button>
                <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                      <Plus size={16} />
                      <span>New Lead</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={newLead.name || ''}
                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={newLead.email || ''}
                            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            value={newLead.phone || ''}
                            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Property *</Label>
                          <Input
                            value={newLead.property || ''}
                            onChange={(e) => setNewLead({ ...newLead, property: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Score</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={newLead.score || ''}
                            onChange={(e) => setNewLead({ ...newLead, score: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={newLead.status || ''}
                            onValueChange={(value) => setNewLead({ ...newLead, status: value as Lead['status'] })}
                          >
                            <SelectTrigger>
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
                          <Label>Property Type</Label>
                          <Select
                            value={newLead.propertyType || ''}
                            onValueChange={(value) => setNewLead({ ...newLead, propertyType: value })}
                          >
                            <SelectTrigger>
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
                          <Label>Bedrooms</Label>
                          <Input
                            type="number"
                            value={newLead.bedrooms || ''}
                            onChange={(e) => setNewLead({ ...newLead, bedrooms: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Location Preferences (comma separated)</Label>
                        <Input
                          value={newLead.locationPreference?.join(', ') || ''}
                          onChange={(e) =>
                            setNewLead({
                              ...newLead,
                              locationPreference: e.target.value.split(',').map((loc) => loc.trim()),
                            })
                          }
                          placeholder="Delhi, Mumbai, Pune"
                        />
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea
                          value={newLead.notes || ''}
                          onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                          placeholder="Additional notes about the lead..."
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
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
        <div className="px-8 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-7 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.hot}</p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-red-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="text-purple-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Booked</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Interested</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.interested}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-blue-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Value</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.highValue}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-emerald-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">With Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.withVisits}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Navigation className="text-orange-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Leads', icon: null },
                { value: 'hot', label: 'Hot', icon: <Sparkles size={14} className="mr-1" /> },
                { value: 'new', label: 'New', icon: null },
                { value: 'booked', label: 'Booked', icon: null },
                { value: 'interested', label: 'Interested', icon: null },
                { value: 'with_visits', label: 'With Visits', icon: <Navigation size={14} className="mr-1" /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search leads..."
                className="pl-10 w-80 border-gray-300 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Leads Table */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <User size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first lead'}
                  </p>
                  <Button
                    onClick={() => setIsLeadDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus size={16} className="mr-2" />
                    Add New Lead
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="w-12 py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <SortableHeader column="Lead" sortKey="name">
                          Lead
                        </SortableHeader>
                        <SortableHeader column="Property" sortKey="property">
                          Property
                        </SortableHeader>
                        <SortableHeader column="Score" sortKey="score">
                          Score
                        </SortableHeader>
                        <SortableHeader column="Status" sortKey="status">
                          Status
                        </SortableHeader>
                        <SortableHeader column="Budget" sortKey="budget">
                          Budget
                        </SortableHeader>
                        <SortableHeader column="Location" sortKey="locationPreference">
                          Location
                        </SortableHeader>
                        <SortableHeader column="Visits" sortKey="visits">
                          Visits
                        </SortableHeader>
                        <SortableHeader column="Last Contact" sortKey="lastContact">
                          Last Contact
                        </SortableHeader>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredLeads.map((lead) => {
                        const leadVisits = visits.filter((visit) => visit.leadEmail === lead.email);
                        return (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedLeads.has(lead.id)}
                                onChange={() => toggleSelectLead(lead.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {lead.name?.charAt(0) || 'L'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{lead.name}</div>
                                  <div className="text-sm text-gray-500">{lead.email}</div>
                                  <div className="text-sm text-gray-500">{lead.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Home size={16} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{lead.property}</span>
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                                <Building size={14} />
                                <span className="capitalize">{lead.propertyType || 'Not specified'}</span>
                                {lead.bedrooms && (
                                  <>
                                    <span>•</span>
                                    <span>{lead.bedrooms} Beds</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`font-mono font-semibold ${getStatusColor(lead.status || 'new')} border-0`}
                              >
                                <Star size={12} className="mr-1" />
                                {lead.score}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={getStatusColor(lead.status || 'new')}>
                                {lead.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <DollarSign size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{formatBudget(lead.budget)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <MapPin size={14} className="text-gray-400" />
                                <div className="max-w-xs">
                                  <div className="text-sm text-gray-900">
                                    {lead.locationPreference?.slice(0, 2).join(', ')}
                                    {lead.locationPreference && lead.locationPreference.length > 2 && (
                                      <span className="text-gray-500">
                                        {' '}
                                        +{lead.locationPreference.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Navigation size={14} className="text-gray-400" />
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {leadVisits.length}
                                </Badge>
                                {leadVisits.length > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="text-xs text-gray-500 cursor-help">
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
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-500">
                                {lead.lastContact ? formatDate(lead.lastContact) : 'Never'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-200"
                                        onClick={() => setDetailsModalLead(lead)}
                                      >
                                        <Eye size={14} />
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
                                        className="h-8 w-8 p-0 hover:bg-gray-200"
                                        onClick={() => window.location.href = `tel:${lead.phone}`}
                                      >
                                        <Phone size={14} />
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
                                        className="h-8 w-8 p-0 hover:bg-gray-200"
                                        onClick={() => window.location.href = `mailto:${lead.email}`}
                                      >
                                        <Mail size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Email Lead</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200">
                                      <MoreHorizontal size={14} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingLead(lead);
                                        setNewLead(lead);
                                        setIsLeadDialogOpen(true);
                                      }}
                                    >
                                      <Edit size={14} className="mr-2" />
                                      Edit Lead
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setChatModalLead(lead)}>
                                      <MessageSquare size={14} className="mr-2" />
                                      Open Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className="text-red-600 focus:text-red-600"
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
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
                {selectedLeads.size > 0 && ` • ${selectedLeads.size} selected`}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-gray-300">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300">
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