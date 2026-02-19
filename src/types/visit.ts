export type VisitStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface VisitAgent {
  _id: string;
  name: string;
  avatar?: string;
}

export interface VisitProperty {
  _id: string;
  title: string;
  location?: string;
  price?: number;
}

export interface VisitOwner {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Visit {
  _id: string;
  agent: string | VisitAgent;
  sessionId: string;
  property?: string | VisitProperty | null;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  notes?: string;
  dateTime: string;
  status: VisitStatus;
  createdBy?: string | VisitOwner;
  organization?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitListResult {
  total: number;
  page: number;
  pages: number;
  data: Visit[];
}

export interface CreateVisitPayload {
  agent: string;
  sessionId: string;
  property?: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  notes?: string;
  dateTime: string;
  status?: VisitStatus;
}

export type UpdateVisitPayload = Partial<CreateVisitPayload>;

export interface VisitStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  no_show: number;
}
