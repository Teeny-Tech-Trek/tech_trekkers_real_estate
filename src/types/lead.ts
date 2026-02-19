// types/lead.ts
export interface ApiLead {
  _id: string;
  agent: string;
  inquiries: string[];
  lastActive: string;
  leadScore: number;
  qualification: {
    contactInfo: {
      name?: string;
      email?: string;
      phone?: string;
      preferredContact?: string;
    };
    budget?: {
      min?: number;
      max?: number;
      flexible?: boolean;
    };
    timeline?: string;
    propertyType?: string;
    locationPreference?: string[];
    bedrooms?: number;
    bathrooms?: number;
    purpose?: string;
    notes?: string;
  };
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiVisit {
  _id: string;
  assignedAgent: string;
  avatar: string;
  date: string;
  duration: string;
  id: string;
  leadEmail: string;
  leadName: string;
  leadPhone: string;
  notes: string;
  property: string;
  propertyAddress: string;
  status: string;
  time: string;
  __v?: number;
  // Additional properties that might come from the API
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  dateTime?: string;
}

export interface ApiChat {
  _id: string;
  agent: string;
  sessionId: string;
  messages: {
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
    propertyCards?: {
      id: string;
      title: string;
      price: number;
      location: string;
      image: string;
    }[];
  }[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  property: string;
  source: string;
  score: number;
  status: 'new' | 'qualifying' | 'interested' | 'booked' | 'closed' | 'nurture' | 'confirmed';
  lastContact: string;
  avatar: string;
  assignedAgent: string;
  budget?: {
    min?: number;
    max?: number;
    flexible?: boolean;
  };
  timeline?: string;
  propertyType?: string;
  locationPreference?: string[];
  bedrooms?: number;
  bathrooms?: number;
  purpose?: string;
  notes?: string;
  preferredContact?: string;
  sessionId: string;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Visit {
  id: string | number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  property: string;
  propertyAddress: string;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'scheduled' | 'completed';
  assignedAgent: string;
  notes: string;
  avatar: string;
  sessionId?: string;
  createdAt?: string;
}

export interface Chat {
  id: string;
  sessionId: string;
  messages: {
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
    propertyCards?: {
      id: string;
      title: string;
      price: number;
      location: string;
      image: string;
    }[];
  }[];
  context: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// Map API Lead to UI Lead
export const mapApiLeadToLead = (apiLead: ApiLead): Lead => ({
  id: apiLead._id,
  name: apiLead.qualification.contactInfo.name || "Unknown",
  email: apiLead.qualification.contactInfo.email || "N/A",
  phone: apiLead.qualification.contactInfo.phone || "N/A",
  property: apiLead.qualification.bedrooms ? `${apiLead.qualification.bedrooms} BHK` : "Property Inquiry",
  source: apiLead.sessionId ? "Chat Session" : "Unknown",
  score: apiLead.leadScore || 0,
  status: (apiLead.status as Lead['status']) || 'qualifying',
  lastContact: apiLead.lastActive || apiLead.updatedAt || apiLead.createdAt,
  avatar: "/default-avatar.png",
  assignedAgent: apiLead.agent || "Unassigned",
  budget: apiLead.qualification.budget,
  timeline: apiLead.qualification.timeline,
  propertyType: apiLead.qualification.propertyType,
  locationPreference: Array.isArray(apiLead.qualification.locationPreference) 
    ? apiLead.qualification.locationPreference 
    : apiLead.qualification.locationPreference 
      ? [apiLead.qualification.locationPreference] 
      : [],
  bedrooms: apiLead.qualification.bedrooms,
  bathrooms: apiLead.qualification.bathrooms,
  purpose: apiLead.qualification.purpose,
  notes: apiLead.qualification.notes,
  preferredContact: apiLead.qualification.contactInfo.preferredContact || 'any',
  sessionId: apiLead.sessionId,
  lastActive: apiLead.lastActive,
  createdAt: apiLead.createdAt,
  updatedAt: apiLead.updatedAt
});

// Map API Visit to UI Visit
export const mapApiVisitToVisit = (apiVisit: ApiVisit): Visit => {
  return {
    id: apiVisit._id || apiVisit.id,
    leadName: apiVisit.buyerName || apiVisit.leadName || "Unknown",
    leadEmail: apiVisit.buyerEmail || apiVisit.leadEmail || "N/A",
    leadPhone: apiVisit.buyerPhone || apiVisit.leadPhone || "N/A",
    property: apiVisit.property || "N/A",
    propertyAddress: apiVisit.propertyAddress || "N/A",
    date: apiVisit.date || (apiVisit.dateTime ? new Date(apiVisit.dateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    time: apiVisit.time || (apiVisit.dateTime ? new Date(apiVisit.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "06:00 PM"),
    duration: apiVisit.duration || "1 hour",
    status: (apiVisit.status as Visit['status']) || 'confirmed',
    assignedAgent: apiVisit.assignedAgent || apiVisit.agent || "Unassigned",
    notes: apiVisit.notes || "",
    avatar: apiVisit.avatar || "/default-avatar.png",
    sessionId: apiVisit.sessionId,
    createdAt: apiVisit.createdAt
  };
};

// Map API Chat to UI Chat
export const mapApiChatToChat = (apiChat: ApiChat): Chat => ({
  id: apiChat._id,
  sessionId: apiChat.sessionId,
  messages: apiChat.messages.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timestamp).toISOString(),
  })),
  context: apiChat.context,
  createdAt: apiChat.createdAt,
  updatedAt: apiChat.updatedAt
});

// Helper function to get status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'booked':
    case 'confirmed':
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'interested':
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'new':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'qualifying':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
    case 'closed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'nurture':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get score color
export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

// Helper function to format budget
export const formatBudget = (budget: Lead['budget'] | undefined | null) => {
  if (!budget) return 'Flexible';
  if (budget.min === 0 && budget.max === 1500000) return 'Up to $1.5M';
  if (budget.min === undefined && budget.max === undefined) return 'Flexible';
  
  const min = budget.min || 0;
  const max = budget.max || 0;
  
  if (min === 0 && max > 0) return `Up to $${(max / 1000000).toFixed(1)}M`;
  if (min > 0 && max === 0) return `From $${(min / 1000000).toFixed(1)}M`;
  
  return `$${(min / 1000000).toFixed(1)}M - $${(max / 1000000).toFixed(1)}M`;
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to format detailed date
export const formatDetailedDate = (dateString: string) => {
  if (!dateString) return 'Never contacted';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};