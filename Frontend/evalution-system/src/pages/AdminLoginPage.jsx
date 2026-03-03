import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("❌ Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin({ email, password });
      alert(`✅ Login successful!`);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(`❌ Login failed: ${error.message || "Invalid credentials"}`);
    }
    setLoading(false);
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
        Use your registered email and password to login
      </p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "⏳ Logging in..." : "🚀 Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}
