import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // ✅ CHANGED: 123 123 credentials
    if (username === "123" && password === "123") {
      localStorage.setItem("token", "admin-token");
      navigate("/admin-dashboard");
    } else {
      alert("❌ Invalid credentials! Use: 123 / 123");
    }
  };

  return (
    <div className="form-container">
      <h2>🔐 Admin Login</h2>
      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "2rem",
          fontSize: "0.95rem",
        }}
      >
        Username: <strong>123</strong> | Password: <strong>123</strong>
      </p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username (123)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password (123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          🚀 Login to Dashboard
        </button>
      </form>
    </div>
  );
}
