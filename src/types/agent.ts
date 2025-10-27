// src/types/agent.ts
export interface Agent {
  _id: string;
  name: string;
  personality: string;
  voice: string;
  status: 'active' | 'paused' | 'draft';
  conversations: number;
  conversions: number;
  revenue: string;
  conversionRate: string;
  avatar: string;
  description: string;
  organization: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}