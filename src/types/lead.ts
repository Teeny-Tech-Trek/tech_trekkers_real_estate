export type LeadStatus =
  | "new"
  | "qualifying"
  | "interested"
  | "viewing_scheduled"
  | "negotiating"
  | "booked"
  | "closed"
  | "nurture"
  | "lost";

export type LeadQuality = "cold" | "warm" | "hot" | "very_hot";

export interface LeadBudget {
  min?: number;
  max?: number;
  flexible?: boolean;
}

export interface LeadContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: "email" | "phone" | "whatsapp" | "any";
}

export interface LeadQualification {
  budget?: LeadBudget;
  timeline?: "immediate" | "1-3_months" | "3-6_months" | "6-12_months" | "exploring";
  propertyType?: "apartment" | "villa" | "independent_house" | "plot" | "commercial";
  locationPreference?: string[];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  purpose?: "primary_residence" | "investment" | "rental" | "vacation" | "commercial";
  contactInfo?: LeadContactInfo;
  notes?: string;
}

export interface LeadInquiry {
  text?: string;
  timestamp?: string;
  extractedIntent?: string;
  sentiment?: string;
}

export interface Lead {
  _id: string;
  agent: string;
  property?: string | null;
  sessionId: string;
  createdBy?: string | { _id?: string; firstName?: string; lastName?: string; email?: string };
  organization?: string | null;
  status: LeadStatus;
  qualification?: LeadQualification;
  inquiries?: LeadInquiry[];
  leadScore?: number;
  leadQuality?: LeadQuality;
  conversionProbability?: number;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface LeadWithOwner extends Lead {
  ownerName: string;
  ownerEmail?: string;
  isMine: boolean;
}

export interface CreateLeadPayload {
  agent: string;
  sessionId: string;
  property?: string;
  status?: LeadStatus;
  leadQuality?: LeadQuality;
  qualification?: LeadQualification;
  tags?: string[];
}

export type UpdateLeadPayload = Partial<CreateLeadPayload> & Record<string, unknown>;
