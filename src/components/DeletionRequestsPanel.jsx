// Frontend: Admin deletion requests panel
import React, { useState, useEffect } from "react";
import axios from "axios";

export const DeletionRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [approvalReason, setApprovalReason] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/account/deletion-requests");
      setRequests(response.data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load deletion requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.post(`/api/account/delete/request/${requestId}/approve`, {
        reason: approvalReason[requestId] || undefined
      });

      // Refresh requests
      await fetchRequests();
      setApprovalReason((prev) => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to approve deletion request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this deletion request?")) {
      return;
    }

    setProcessingId(requestId);
    try {
      await axios.post(`/api/account/delete/request/${requestId}/reject`, {
        reason: approvalReason[requestId] || "Request rejected by organization owner"
      });

      // Refresh requests
      await fetchRequests();
      setApprovalReason((prev) => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reject deletion request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">⌛</div>
        <span className="ml-2 text-gray-600">Loading deletion requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center text-blue-700">
        <p>No pending account deletion requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deletion Requests</h2>

      {requests.map((request) => (
        <div
          key={request._id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">User</p>
              <p className="text-lg font-semibold text-gray-900">
                {request.requestedBy?.firstName} {request.requestedBy?.lastName}
              </p>
              <p className="text-sm text-gray-600">{request.requestedBy?.email}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
              <p
                className={`text-lg font-semibold ${
                  request.status === "pending"
                    ? "text-amber-600"
                    : request.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Requested</p>
              <p className="text-sm text-gray-600">
                {new Date(request.requestedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(request.requestedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {request.reason && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Reason
              </p>
              <p className="text-sm text-gray-700">{request.reason}</p>
            </div>
          )}

          {request.status === "pending" && (
            <div className="space-y-3">
              <label className="block">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Optional Approval Note
                </p>
                <textarea
                  value={approvalReason[request._id] || ""}
                  onChange={(e) =>
                    setApprovalReason((prev) => ({
                      ...prev,
                      [request._id]: e.target.value
                    }))
                  }
                  placeholder="Add a note about your decision (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="2"
                  disabled={processingId === request._id}
                />
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={processingId === request._id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === request._id ? "Processing..." : "Reject"}
                </button>
                <button
                  onClick={() => handleApprove(request._id)}
                  disabled={processingId === request._id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === request._id ? "Processing..." : "Approve"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                ℹ️ This request will expire in 7 days if not approved or rejected.
              </div>
            </div>
          )}

          {request.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              ✓ Approved on {new Date(request.approvedAt).toLocaleDateString()}
              {request.approvalReason && (
                <p className="text-xs mt-1">Note: {request.approvalReason}</p>
              )}
            </div>
          )}

          {request.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              ✗ Rejected
              {request.approvalReason && (
                <p className="text-xs mt-1">Reason: {request.approvalReason}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeletionRequestsPanel;
