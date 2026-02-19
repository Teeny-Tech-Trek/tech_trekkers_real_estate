import api from "./api";

export const accountDeletionAPI = {
  requestDeletion: (reason?: string) =>
    api.post("/account/delete/request", { reason }),

  getStatus: () =>
    api.get("/account/delete/status"),

  cancelRequest: (requestId: string) =>
    api.post(`/account/delete/request/${requestId}/cancel`),

  approveDeletion: (requestId: string, reason?: string) =>
    api.post(`/account/delete/request/${requestId}/approve`, { reason }),

  rejectDeletion: (requestId: string, reason?: string) =>
    api.post(`/account/delete/request/${requestId}/reject`, { reason }),

  getPendingRequests: () =>
    api.get("/account/deletion-requests"),
};
