import api from "./api";
import { CreateLeadPayload, Lead, UpdateLeadPayload } from "@/types/lead";

export interface TeamMemberLite {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  role: "owner" | "admin" | "member" | "agent";
}

export interface AgentLite {
  _id: string;
  name: string;
  status?: "active" | "paused" | "draft";
}

export interface PropertyLite {
  _id: string;
  title: string;
  location?: string;
  status?: string;
}

class LeadsApiService {
  async getLeads(): Promise<Lead[]> {
    const response = await api.get<Lead[]>("/leads");
    return Array.isArray(response.data) ? response.data : [];
  }

  async getLeadById(id: string): Promise<Lead> {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  }

  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const response = await api.post<Lead>("/leads", payload);
    return response.data;
  }

  async updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const response = await api.put<Lead>(`/leads/${id}`, payload);
    return response.data;
  }

  async deleteLead(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/leads/${id}`);
    return response.data;
  }

  async getOrganizationTeamMembers(): Promise<TeamMemberLite[]> {
    const response = await api.get<TeamMemberLite[]>("/settings/organization/team");
    return Array.isArray(response.data) ? response.data : [];
  }

  async getAvailableAgents(): Promise<AgentLite[]> {
    const response = await api.get<AgentLite[]>("/agents/agents");
    return Array.isArray(response.data) ? response.data : [];
  }

  async getAvailableProperties(): Promise<PropertyLite[]> {
    const response = await api.get<PropertyLite[]>("/properties/list");
    return Array.isArray(response.data) ? response.data : [];
  }
}

export const leadsApiService = new LeadsApiService();
