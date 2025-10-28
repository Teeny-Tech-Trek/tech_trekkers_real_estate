import React, { useState, useEffect, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.estate.techtrekkers.ai/api";

const AcceptInvitePage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // extract token from query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing invite token.");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post<{ accessToken: string }>(
        `${API_BASE_URL}/auth/invite/accept`,
        {
          token,
          firstName,
          lastName,
          password,
        }
      );

      // Auto-login and redirect
      localStorage.setItem("accessToken", res.data.accessToken);
      setMessage("Invite accepted! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Failed to accept invite");
      } else {
        setMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Accept Invitation</h2>
      {!token ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Accept Invite"}
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "400px",
    margin: "80px auto",
    background: "#121212",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    marginTop: "10px",
    color: "#00e676",
  },
};

export default AcceptInvitePage;
