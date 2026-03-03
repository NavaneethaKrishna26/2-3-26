import { useState, useEffect } from "react";
import { getHomeStats } from "../services/api";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getHomeStats();
      setStats(data);
    } catch (error) {
      console.log("Stats not available:", error.message);
      // Stats are optional, so we don't show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hero">
      <h1>🏆 Team Evaluation System</h1>
      <p>Register teams and evaluate performance professionally.</p>

      {!loading && stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginTop: "3rem",
            maxWidth: "1000px",
            margin: "3rem auto 0",
          }}
        >
          <div
            style={{
              background: "rgba(102, 126, 234, 0.2)",
              border: "2px solid rgba(102, 126, 234, 0.5)",
              borderRadius: "15px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#667eea" }}>
              {stats.totalTeams || 0}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>
              Total Teams
            </div>
          </div>

          <div
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              border: "2px solid rgba(16, 185, 129, 0.5)",
              borderRadius: "15px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>
              {stats.evaluatedTeams || 0}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>
              Evaluated Teams
            </div>
          </div>

          <div
            style={{
              background: "rgba(245, 158, 11, 0.2)",
              border: "2px solid rgba(245, 158, 11, 0.5)",
              borderRadius: "15px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>
              {stats.pendingTeams || 0}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>
              Pending Teams
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
