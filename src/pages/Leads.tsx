import React, { useState, useEffect, Component, ComponentType } from "react";
import { Search, Filter, Phone, Mail, Calendar, Star, MapPin, Clock, User, Home, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { fetchLeads, fetchVisits, createLead, updateLead, deleteLead, createVisit, updateVisit, deleteVisit } from "../services/leadApi";
import { Lead, Visit } from "../types/lead";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600">Something went wrong.</h2>
          <p className="text-slate-600 mt-2">Please try refreshing the page or contact support.</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Leads: ComponentType = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [newVisit, setNewVisit] = useState<Partial<Visit>>({});
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [leadsData, visitsData] = await Promise.all([
          fetchLeads(),
          fetchVisits(),
        ]);
        console.log("Fetched leads:", leadsData);
        console.log("Fetched visits:", visitsData);
        setLeads(leadsData);
        setVisits(visitsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter leads with defensive checks
  const filteredLeads = leads.filter((lead) => {
    const name = lead.name || "";
    const email = lead.email || "";
    const property = lead.property || "";
    const query = searchQuery.toLowerCase();
    return (
      (typeof name === "string" && name.toLowerCase().includes(query)) ||
      (typeof email === "string" && email.toLowerCase().includes(query)) ||
      (typeof property === "string" && property.toLowerCase().includes(query))
    );
  });

  // Filter visits with defensive checks
  const filteredVisits = visits.filter((visit) => {
    const leadName = visit.leadName || "";
    const property = visit.property || "";
    const query = searchQuery.toLowerCase();
    return (
      (typeof leadName === "string" && leadName.toLowerCase().includes(query)) ||
      (typeof property === "string" && property.toLowerCase().includes(query))
    );
  });

  // Handle lead creation
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email || !newLead.phone || !newLead.property) {
      toast({ title: "Error", description: "Name, email, phone, and property are required", variant: "destructive" });
      return;
    }
    try {
      const createdLead = await createLead(newLead);
      setLeads([createdLead, ...leads]);
      setNewLead({});
      setIsLeadDialogOpen(false);
      toast({ title: "Success", description: "Lead created successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create lead", variant: "destructive" });
    }
  };

  // Handle lead update
  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !newLead.name || !newLead.email || !newLead.phone || !newLead.property) {
      toast({ title: "Error", description: "Name, email, phone, and property are required", variant: "destructive" });
      return;
    }
    try {
      const updatedLead = await updateLead(editingLead.id.toString(), newLead);
      setLeads(leads.map((lead) => (lead.id === editingLead.id ? updatedLead : lead)));
      setEditingLead(null);
      setNewLead({});
      setIsLeadDialogOpen(false);
      toast({ title: "Success", description: "Lead updated successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update lead", variant: "destructive" });
    }
  };

  // Handle lead deletion
  const handleDeleteLead = async (id: string | number) => {
    try {
      await deleteLead(id.toString());
      setLeads(leads.filter((lead) => lead.id !== id));
      toast({ title: "Success", description: "Lead deleted successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete lead", variant: "destructive" });
    }
  };

  // Handle visit creation
  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.leadName || !newVisit.leadEmail || !newVisit.leadPhone || !newVisit.property || !newVisit.date || !newVisit.time) {
      toast({ title: "Error", description: "Lead name, email, phone, property, date, and time are required", variant: "destructive" });
      return;
    }
    try {
      const createdVisit = await createVisit(newVisit);
      setVisits([createdVisit, ...visits]);
      setNewVisit({});
      setIsVisitDialogOpen(false);
      toast({ title: "Success", description: "Visit created successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create visit", variant: "destructive" });
    }
  };

  // Handle visit update
  const handleUpdateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVisit || !newVisit.leadName || !newVisit.leadEmail || !newVisit.leadPhone || !newVisit.property || !newVisit.date || !newVisit.time) {
      toast({ title: "Error", description: "Lead name, email, phone, property, date, and time are required", variant: "destructive" });
      return;
    }
    try {
      const updatedVisit = await updateVisit(editingVisit.id.toString(), newVisit);
      setVisits(visits.map((visit) => (visit.id === editingVisit.id ? updatedVisit : visit)));
      setEditingVisit(null);
      setNewVisit({});
      setIsVisitDialogOpen(false);
      toast({ title: "Success", description: "Visit updated successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update visit", variant: "destructive" });
    }
  };

  // Handle visit deletion
  const handleDeleteVisit = async (id: string | number) => {
    try {
      await deleteVisit(id.toString());
      setVisits(visits.filter((visit) => visit.id !== id));
      toast({ title: "Success", description: "Visit cancelled successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to cancel visit", variant: "destructive" });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500 text-white';
      case 'warm': return 'bg-yellow-500 text-white';
      case 'cold': return 'bg-blue-500 text-white';
      case 'booked': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVisitStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Leads & Visits
              </h1>
              <p className="text-slate-600 mt-1">Manage leads and scheduled property visits</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-slate-300">
                <User size={14} className="mr-1" />
                {leads.length} Active Leads
              </Badge>
              <Badge className="bg-green-500">
                <Calendar size={14} className="mr-1" />
                {visits.length} Booked Visits
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {loading && <p className="text-center text-slate-600">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Hot Leads</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {leads.filter(lead => lead.status === 'hot').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-red-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Scheduled Visits</p>
                    <p className="text-2xl font-bold text-slate-900">{visits.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Lead Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {leads.length ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length) : 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="text-purple-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="leads" className="rounded-lg data-[state=active]:bg-white">
                <User size={16} className="mr-2" />
                Leads ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="visits" className="rounded-lg data-[state=active]:bg-white">
                <Calendar size={16} className="mr-2" />
                Booked Visits ({visits.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    placeholder="Search leads by name, email, or property..." 
                    className="pl-10 border-slate-300 bg-white/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Add New Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingLead ? "Edit Lead" : "Create New Lead"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead} className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newLead.name || ""}
                          onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newLead.email || ""}
                          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={newLead.phone || ""}
                          onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Property (e.g., 3 BHK)</Label>
                        <Input
                          value={newLead.property || ""}
                          onChange={(e) => setNewLead({ ...newLead, property: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Source</Label>
                        <Select
                          value={newLead.source || ""}
                          onValueChange={(value) => setNewLead({ ...newLead, source: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chat Session">Chat Session</SelectItem>
                            <SelectItem value="Website Form">Website Form</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={newLead.status || ""}
                          onValueChange={(value) => setNewLead({ ...newLead, status: value as 'hot' | 'warm' | 'cold' | 'booked' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hot">Hot</SelectItem>
                            <SelectItem value="warm">Warm</SelectItem>
                            <SelectItem value="cold">Cold</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Score</Label>
                        <Input
                          type="number"
                          value={newLead.score || ""}
                          onChange={(e) => setNewLead({ ...newLead, score: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Assigned Agent ID</Label>
                        <Input
                          value={newLead.assignedAgent || ""}
                          onChange={(e) => setNewLead({ ...newLead, assignedAgent: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit">{editingLead ? "Update Lead" : "Create Lead"}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <Card key={lead.id} className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <img 
                            src={lead.avatar || "/default-avatar.png"} 
                            alt={lead.name || "Unknown"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800">{lead.name || "Unknown"}</h3>
                              <Badge className={getStatusColor(lead.status || 'cold')}>
                                {(lead.status || 'cold').toUpperCase()}
                              </Badge>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(lead.score || 0)}`}>
                                <Star size={12} className="inline mr-1" />
                                Score: {lead.score || 0}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                              <div className="flex items-center">
                                <Mail size={14} className="mr-2 text-slate-500" />
                                {lead.email || "N/A"}
                              </div>
                              <div className="flex items-center">
                                <Phone size={14} className="mr-2 text-slate-500" />
                                {lead.phone || "N/A"}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm flex-wrap">
                              <div className="flex items-center">
                                <Home size={14} className="mr-2 text-slate-500" />
                                <span className="font-medium text-slate-700">Interested in:</span>
                                <span className="text-blue-600 ml-1">{lead.property || "N/A"}</span>
                              </div>
                              <span className="hidden sm:block text-slate-300">•</span>
                              <span className="text-slate-600">Source: {lead.source || "N/A"}</span>
                              <span className="hidden sm:block text-slate-300">•</span>
                              <span className="text-slate-600">Agent ID: {lead.assignedAgent || "Unassigned"}</span>
                              <span className="hidden sm:block text-slate-300">•</span>
                              <span className="text-slate-500">Last contact: {lead.lastContact ? formatDate(lead.lastContact) : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            disabled={!lead.phone}
                            onClick={() => window.location.href = `tel:${lead.phone}`}
                          >
                            <Phone size={14} className="mr-1" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            disabled={!lead.email}
                            onClick={() => window.location.href = `mailto:${lead.email}`}
                          >
                            <Mail size={14} className="mr-1" />
                            Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            onClick={() => {
                              setNewVisit({ leadName: lead.name || "", leadEmail: lead.email || "", leadPhone: lead.phone || "" });
                              setIsVisitDialogOpen(true);
                            }}
                          >
                            <Calendar size={14} className="mr-1" />
                            Schedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            onClick={() => {
                              setEditingLead(lead);
                              setNewLead(lead);
                              setIsLeadDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visits" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    placeholder="Search visits by lead name or property..." 
                    className="pl-10 border-slate-300 bg-white/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isVisitDialogOpen} onOpenChange={setIsVisitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Schedule New Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingVisit ? "Edit Visit" : "Schedule New Visit"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingVisit ? handleUpdateVisit : handleCreateVisit} className="space-y-4">
                      <div>
                        <Label>Lead Name</Label>
                        <Input
                          value={newVisit.leadName || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, leadName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Lead Email</Label>
                        <Input
                          type="email"
                          value={newVisit.leadEmail || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, leadEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Lead Phone</Label>
                        <Input
                          value={newVisit.leadPhone || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, leadPhone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Property ID</Label>
                        <Input
                          value={newVisit.property || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, property: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Property Address</Label>
                        <Input
                          value={newVisit.propertyAddress || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, propertyAddress: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={newVisit.date || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={newVisit.time || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, time: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={newVisit.duration || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, duration: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={newVisit.status || ""}
                          onValueChange={(value) => setNewVisit({ ...newVisit, status: value as 'confirmed' | 'pending' | 'cancelled' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Assigned Agent ID</Label>
                        <Input
                          value={newVisit.assignedAgent || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, assignedAgent: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Input
                          value={newVisit.notes || ""}
                          onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                        />
                      </div>
                      <Button type="submit">{editingVisit ? "Update Visit" : "Schedule Visit"}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {filteredVisits.map((visit) => (
                  <Card key={visit.id} className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <img 
                            src={visit.avatar || "/default-avatar.png"} 
                            alt={visit.leadName || "Unknown"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800">{visit.leadName || "Unknown"}</h3>
                              <Badge variant="outline" className={getVisitStatusColor(visit.status || 'pending')}>
                                {(visit.status || 'pending').toUpperCase()}
                              </Badge>
                              <div className="flex items-center text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                <User size={12} className="mr-1" />
                                {visit.assignedAgent || "Unassigned"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Calendar size={14} className="mr-2 text-slate-500" />
                                  <span className="font-medium text-slate-700">Date:</span>
                                  <span className="ml-1 text-slate-800">{visit.date ? formatDate(visit.date) : "N/A"}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock size={14} className="mr-2 text-slate-500" />
                                  <span className="font-medium text-slate-700">Time:</span>
                                  <span className="ml-1 text-slate-800">{visit.time || "N/A"} ({visit.duration || "N/A"})</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Home size={14} className="mr-2 text-slate-500" />
                                  <span className="font-medium text-slate-700">Property ID:</span>
                                  <span className="ml-1 text-blue-600">{visit.property || "N/A"}</span>
                                </div>
                                <div className="flex items-start text-sm">
                                  <MapPin size={14} className="mr-2 text-slate-500 mt-0.5" />
                                  <span className="text-slate-600">{visit.propertyAddress || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm flex-wrap">
                              <div className="flex items-center">
                                <Mail size={14} className="mr-2 text-slate-500" />
                                <span className="text-slate-600">{visit.leadEmail || "N/A"}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone size={14} className="mr-2 text-slate-500" />
                                <span className="text-slate-600">{visit.leadPhone || "N/A"}</span>
                              </div>
                              {visit.notes && (
                                <div className="flex items-start">
                                  <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                                    📝 {visit.notes}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            disabled={!visit.leadPhone}
                            onClick={() => window.location.href = `tel:${visit.leadPhone}`}
                          >
                            <Phone size={14} className="mr-1" />
                            Call Lead
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 hover:bg-slate-50"
                            onClick={() => {
                              setEditingVisit(visit);
                              setNewVisit(visit);
                              setIsVisitDialogOpen(true);
                            }}
                          >
                            <Calendar size={14} className="mr-1" />
                            Reschedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteVisit(visit.id)}
                          >
                            Cancel Visit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Leads;