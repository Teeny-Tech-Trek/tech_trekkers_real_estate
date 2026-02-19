import { useCallback, useState } from "react";
import { accountDeletionAPI } from "../services/accountDeletion.api";

export const useAccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<any>(null);

  const checkStatus = useCallback(async () => {
    try {
      const response = await accountDeletionAPI.getStatus();
      setDeleteStatus(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check status");
      return null;
    }
  }, []);

  const requestDeletion = useCallback(async (reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountDeletionAPI.requestDeletion(reason);
      if (response.data.type === "individual") {
        window.location.href = "/login";
      } else {
        setDeleteStatus({ status: "pending", requestId: response.data.requestId });
      }
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Deletion request failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRequest = useCallback(async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountDeletionAPI.cancelRequest(requestId);
      setDeleteStatus(null);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteStatus,
    checkStatus,
    requestDeletion,
    cancelRequest,
  };
};
