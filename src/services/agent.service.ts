// src/services/agent.service.ts
import api, { API_BASE_URL } from '@/config/apiConfig';
import { Agent, CreateAgentPayload } from '@/types/agent';
import { getCookie } from '@/lib/utils'; // same util your AuthContext uses

// ─── Helpers ───────────────────────────────────────────────────────────────

const isFullUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://');

const resolveAvatarUrl = (avatarUrl?: string): string | undefined => {
  if (!avatarUrl) return undefined;
  return isFullUrl(avatarUrl) ? avatarUrl : `${API_BASE_URL}${avatarUrl}`;
};

const normaliseAgent = (agent: Agent): Agent => ({
  ...agent,
  avatarUrl: resolveAvatarUrl(agent.avatarUrl),
});

/**
 * Fetches a binary resource as a base64 data URL using the native Fetch API.
 *
 * WHY NOT AXIOS?
 * Axios is built on XMLHttpRequest. React DevTools patches every XHR via
 * installHook.js / inspector.js and reads xhr.responseText after each
 * response. The browser throws InvalidStateError when responseType is
 * 'blob' or 'arraybuffer' because responseText is only readable for
 * '' / 'text' responses. This affects both responseType values — it is
 * an XHR-level restriction, not an Axios one.
 *
 * Native fetch() uses the Streams API and is completely separate from XHR,
 * so React DevTools never intercepts it and the error disappears entirely.
 *
 * Auth token is read from the 'accessToken' cookie, matching AuthContext.
 */
const fetchBinaryAsDataUrl = async (endpoint: string): Promise<string> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Read token from cookie — same source AuthContext uses (getCookie('accessToken'))
  const token = getCookie('accessToken') ?? '';

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'image/png',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include', // sends HttpOnly cookies (refreshToken) alongside
  });

  if (!res.ok) {
    throw new Error(`QR fetch failed: ${res.status} ${res.statusText}`);
  }

  const blob = await res.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('FileReader failed reading QR blob'));
    reader.readAsDataURL(blob);
  });
};

// ─── Service ───────────────────────────────────────────────────────────────

const agentService = {
  /**
   * GET /agents/agents
   * Returns all agents visible to the authenticated user.
   */
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get<Agent[]>('/agents/agents');
    return response.data.map(normaliseAgent);
  },

  /**
   * POST /agents/createagent  (multipart/form-data)
   * Backend expects: name, personality, description, voice?, avatar?, avatarFile?
   */
  createAgent: async (payload: CreateAgentPayload): Promise<Agent> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('personality', payload.personality);
    formData.append('description', payload.description);
    if (payload.voice) formData.append('voice', payload.voice);
    if (payload.avatar) formData.append('avatar', payload.avatar);
    if (payload.avatarFile) formData.append('avatarFile', payload.avatarFile);

    const response = await api.post<Agent>('/agents/createagent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normaliseAgent(response.data);
  },

  /**
   * DELETE /agents/:id
   */
  deleteAgent: async (agentId: string): Promise<void> => {
    await api.delete(`/agents/${agentId}`);
  },

  /**
   * PATCH /agents/:id/toggle
   * Toggles agent status between 'active' and 'paused'.
   */
  toggleAgentStatus: async (agentId: string): Promise<Agent> => {
    const response = await api.patch<Agent>(`/agents/${agentId}/toggle`);
    return normaliseAgent(response.data);
  },

  /**
   * GET /agents/:id/qr
   *
   * Uses native fetch() instead of Axios to avoid the React DevTools
   * InvalidStateError (see fetchBinaryAsDataUrl above).
   * Returns a data:image/png;base64,... string for <img src>.
   */
  getAgentQrCode: async (agentId: string): Promise<string> => {
    return fetchBinaryAsDataUrl(`/agents/${agentId}/qr`);
  },

  /**
   * GET /agents/public/:id
   * Public-facing agent — no auth required, only returns active agents.
   */
  getPublicAgent: async (agentId: string): Promise<Agent> => {
    const response = await api.get<Agent>(`/agents/public/${agentId}`);
    return normaliseAgent(response.data);
  },

  /**
   * PATCH /agents/:id
   * Updates mutable agent fields.
   */
  updateAgent: async (agentId: string, data: Partial<Agent>): Promise<Agent> => {
    const response = await api.patch<Agent>(`/agents/${agentId}`, data);
    return normaliseAgent(response.data);
  },
};

export default agentService;