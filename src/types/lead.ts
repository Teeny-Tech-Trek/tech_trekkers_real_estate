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
    };
    bedrooms?: number;
  };
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiVisit {
  _id: string;
  agent: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  createdAt: string;
  dateTime: string;
  notes: string;
  property: string;
  sessionId: string;
  __v: number;
}

export interface Lead {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  property: string;
  source: string;
  score: number;
  status: 'hot' | 'warm' | 'cold' | 'booked';
  lastContact: string;
  avatar: string;
  assignedAgent: string;
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
  status: 'confirmed' | 'pending' | 'cancelled';
  assignedAgent: string;
  notes: string;
  avatar: string;
}

// Map API Lead to UI Lead
export const mapApiLeadToLead = (apiLead: ApiLead): Lead => ({
  id: apiLead._id,
  name: apiLead.qualification.contactInfo.name || "Unknown",
  email: apiLead.qualification.contactInfo.email || "N/A",
  phone: apiLead.qualification.contactInfo.phone || "N/A",
  property: apiLead.qualification.bedrooms ? `${apiLead.qualification.bedrooms} BHK` : "N/A",
  source: apiLead.sessionId ? "Chat Session" : "Unknown",
  score: apiLead.leadScore || 0,
  status: apiLead.status as 'hot' | 'warm' | 'cold' | 'booked',
  lastContact: apiLead.lastActive || apiLead.createdAt || "N/A",
  avatar: "/default-avatar.png", // Placeholder, replace with actual avatar if available
  assignedAgent: apiLead.agent || "Unassigned",
});

// Map API Visit to UI Visit
export const mapApiVisitToVisit = (apiVisit: ApiVisit): Visit => {
  const dateTime = new Date(apiVisit.dateTime);
  return {
    id: apiVisit._id,
    leadName: apiVisit.buyerName || "Unknown",
    leadEmail: apiVisit.buyerEmail || "N/A",
    leadPhone: apiVisit.buyerPhone || "N/A",
    property: apiVisit.property || "N/A",
    propertyAddress: "N/A", // Not provided in API, use placeholder or fetch from property ID
    date: dateTime.toISOString().split('T')[0],
    time: dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    duration: "1 hour", // Not provided in API, use default
    status: "confirmed", // Not provided in API, assume confirmed for booked visits
    assignedAgent: apiVisit.agent || "Unassigned",
    notes: apiVisit.notes || "",
    avatar: "/default-avatar.png", // Placeholder, replace with actual avatar if available
  };
};