import React, { useState, useMemo, useCallback } from 'react';
import { Lead, Visit, getStatusColor, formatBudget, formatDate } from '../types/lead'; // Importing helper functions

export const useLeadsLogic = () => {
  // --- State Variables ---
  const mockLeads: Lead[] = [
    {
      id: "lead1",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      phone: "9876543210",
      property: "Luxury Villa with Ocean View",
      source: "Website",
      score: 85,
      status: "interested",
      lastContact: "2024-02-10T14:30:00Z",
      avatar: "/default-avatar.png",
      assignedAgent: "Agent A",
      budget: { min: 10000000, max: 15000000 },
      timeline: "3-6 months",
      propertyType: "villa",
      locationPreference: ["Mumbai"],
      bedrooms: 4,
      bathrooms: 4,
      purpose: "Investment",
      notes: "Expressed strong interest in beachfront properties. Needs 4+ bedrooms.",
      preferredContact: "email",
      sessionId: "sess_abc123",
    },
    {
      id: "lead2",
      name: "Bob Johnson",
      email: "bob.j@example.com",
      phone: "8765432109",
      property: "Spacious Apartment in Downtown",
      source: "Referral",
      score: 92,
      status: "booked",
      lastContact: "2024-02-11T09:00:00Z",
      avatar: "/default-avatar.png",
      assignedAgent: "Agent B",
      budget: { min: 7000000, max: 9000000 },
      timeline: "1-3 months",
      propertyType: "apartment",
      locationPreference: ["Delhi"],
      bedrooms: 3,
      bathrooms: 2,
      purpose: "Residential",
      notes: "Looking for a family-friendly apartment close to schools.",
      preferredContact: "phone",
      sessionId: "sess_def456",
    },
    {
      id: "lead3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "7654321098",
      property: "Modern Townhouse",
      source: "Ad Campaign",
      score: 60,
      status: "new",
      lastContact: "2024-02-12T10:00:00Z",
      avatar: "/default-avatar.png",
      assignedAgent: "Agent C",
      budget: { min: 5000000, max: 7000000 },
      timeline: "6-12 months",
      propertyType: "townhouse",
      locationPreference: ["Bangalore"],
      bedrooms: 3,
      bathrooms: 3,
      purpose: "First Home",
      notes: "Exploring options, interested in new constructions.",
      preferredContact: "email",
      sessionId: "sess_ghi789",
    },
  ];

  const mockVisits: Visit[] = [
    {
      id: "visit1",
      leadName: "Alice Smith",
      leadEmail: "alice.smith@example.com",
      leadPhone: "9876543210",
      property: "Luxury Villa with Ocean View",
      propertyAddress: "123 Ocean Drive, Mumbai",
      date: "2024-02-15",
      time: "10:00 AM",
      duration: "1 hour",
      status: "scheduled",
      assignedAgent: "Agent A",
      notes: "Client wants to see the master bedroom and kitchen first.",
      avatar: "/default-avatar.png",
    },
    {
      id: "visit2",
      leadName: "Bob Johnson",
      leadEmail: "bob.j@example.com",
      leadPhone: "8765432109",
      property: "Spacious Apartment in Downtown",
      propertyAddress: "456 City Center, Delhi",
      date: "2024-02-13",
      time: "02:00 PM",
      duration: "45 minutes",
      status: "confirmed",
      assignedAgent: "Agent B",
      notes: "Follow-up visit, client will bring family.",
      avatar: "/default-avatar.png",
    },
  ];

  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(false); // Set to false since we have mock data
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [chatModalLead, setChatModalLead] = useState<Lead | null>(null);
  const [detailsModalLead, setDetailsModalLead] = useState<Lead | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // --- Derived States (useMemo) ---
  const sortedLeads = useMemo(() => {
    let sortableLeads = [...leads];
    if (sortConfig.key) {
      sortableLeads.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];

        if (aValue === undefined || aValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === undefined || bValue === null) return sortConfig.direction === 'asc' ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        // Fallback for other types or complex objects like budget
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  const filteredLeads = useMemo(() => {
    return sortedLeads.filter(lead => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.property.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = () => {
        switch (activeTab) {
          case 'all': return true;
          case 'hot': return lead.score >= 80;
          case 'new': return lead.status === 'new';
          case 'booked': return lead.status === 'booked';
          case 'interested': return lead.status === 'interested';
          case 'with_visits': return visits.some(visit => visit.leadEmail === lead.email && visit.status === 'confirmed');
          default: return true;
        }
      };
      return matchesSearch && matchesTab();
    });
  }, [sortedLeads, searchQuery, activeTab, visits]);

  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(lead => lead.score >= 80).length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const booked = leads.filter(lead => lead.status === 'booked').length;
    const interested = leads.filter(lead => lead.status === 'interested').length;
    const highValue = leads.filter(lead => (lead.budget?.max || 0) >= 10000000).length; // Example: properties over 10M
    const withVisits = leads.filter(lead => visits.some(visit => visit.leadEmail === lead.email)).length;

    return { total, hot, new: newLeads, booked, interested, highValue, withVisits };
  }, [leads, visits]);

  // --- Functions (useCallback) ---
  const handleSort = useCallback((key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { ...prevConfig, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleCreateLead = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create Lead:', newLead);
    setLeads(prev => [...prev, { ...newLead, id: String(Date.now()), status: newLead.status || 'new', avatar: '/default-avatar.png', source: 'Manual', lastContact: new Date().toISOString(), assignedAgent: 'Unassigned', score: newLead.score || 0 } as Lead]);
    setNewLead({});
    setIsLeadDialogOpen(false);
  }, [newLead, setLeads, setNewLead, setIsLeadDialogOpen]);

  const handleUpdateLead = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    console.log('Update Lead:', newLead);
    setLeads(prev => prev.map(lead => (lead.id === editingLead.id ? { ...lead, ...newLead } as Lead : lead)));
    setEditingLead(null);
    setNewLead({});
    setIsLeadDialogOpen(false);
  }, [editingLead, newLead, setLeads, setEditingLead, setNewLead, setIsLeadDialogOpen]);

  const handleDeleteLead = useCallback((id: string) => {
    console.log('Delete Lead:', id);
    setLeads(prev => prev.filter(lead => lead.id !== id));
  }, [setLeads]);

  const handleExport = useCallback(() => {
    console.log('Exporting leads...');
    // Implement export logic here, e.g., to CSV
    alert('Export functionality coming soon!');
  }, []);

  const toggleSelectLead = useCallback((id: string) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id as string)));
    }
  }, [selectedLeads, filteredLeads]);

  const getVisitCount = useCallback((leadEmail: string) => {
    return visits.filter(visit => visit.leadEmail === leadEmail).length;
  }, [visits]);

  // --- Initial Data Loading (Example using useEffect) ---
  // In a real application, you would fetch data here
  // useEffect(() => {
  //   const fetchLeadsAndVisits = async () => {
  //     try {
  //       setLoading(true);
  //       // Simulate API call
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       const mockLeads: Lead[] = []; // Your mock data or fetched data
  //       const mockVisits: Visit[] = []; // Your mock data or fetched data
  //       setLeads(mockLeads);
  //       setVisits(mockVisits);
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLeadsAndVisits();
  // }, []);


  return {
    activeTab,
    setActiveTab,
    leads,
    setLeads,
    visits,
    setVisits,
    loading,
    setLoading,
    error,
    setError,
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
    setSortConfig,
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
  };
};