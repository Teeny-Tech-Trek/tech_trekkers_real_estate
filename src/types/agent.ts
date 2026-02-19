export interface Agent {
  _id: string;
  name: string;
  personality: string;
  voice: string;
  avatar: string; // Could be a character or identifier
  description: string;
  avatarUrl: string; // Relative path, e.g., "/uploads/avatars/123.png"
  organization: string; // ObjectId
  createdBy: string; // ObjectId
  status: 'draft' | 'active' | 'paused';
  conversations: number;
  conversions: number;
  revenue: string;
  conversionRate: string;
  createdAt?: string; // Assuming Mongoose adds these
  updatedAt?: string; // Assuming Mongoose adds these
  // Add other fields if needed for the UI
}

export interface CreateAgentPayload {
  name: string;
  personality: string;
  voice?: string;
  avatar?: string;
  description: string;
  avatarFile?: File; // For form data upload
}
