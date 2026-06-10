import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/sjvn-logo.jpeg";
import { API_BASE_URL } from "../config";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // 🔥 hard redirect — stops refresh loop
      window.location.replace("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please check the server.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <img src={logo} alt="SJVN Logo" className="login-logo" />

        <h2>SJVN Admin</h2>

        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <input
          type="text"
          placeholder="Admin ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
