import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTeams } from "../services/api";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getAllTeams();
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      alert(`❌ Failed to load teams: ${error.message || "Server error"}`);
      // Fallback to demo data
      const demoTeams = [
        {
          teamId: 1,
          teamName: "⭐ Alpha Developers",
          overallScore: null,
          evaluationStatus: "PENDING",
        },
        {
          teamId: 2,
          teamName: "⚡ Beta Innovators",
          overallScore: 85,
          evaluationStatus: "COMPLETED",
        },
      ];
      setTeams(demoTeams);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="dashboard"
        style={{ textAlign: "center", padding: "4rem" }}
      >
        <div style={{ fontSize: "2rem", color: "#667eea" }}>
          ⏳ Loading Teams...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: "#667eea" }}>📊 Admin Dashboard</h1>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.8rem 1.5rem",
            background: "rgba(255, 0, 0, 0.2)",
            border: "2px solid rgba(255, 0, 0, 0.5)",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>

      {teams.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.7)" }}>
          <p style={{ fontSize: "1.2rem" }}>No teams registered yet</p>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <Link
              key={team.teamId}
              to={`/evaluate-team/${team.teamId}`}
              className="team-card"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                textDecoration: "none",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-10px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3 style={{ color: "#667eea", marginBottom: "1rem" }}>
                {team.teamName}
              </h3>
              <p style={{ margin: "0.5rem 0", opacity: 0.9 }}>
                Score: <strong>{team.overallScore || "Not Evaluated"}</strong>
              </p>
              <p style={{ margin: 0 }}>
                Status:
                <span
                  style={{
                    color:
                      team.evaluationStatus === "PENDING" ? "#f59e0b" : "#10b981",
                    fontWeight: "bold",
                    padding: "0.3rem 0.8rem",
                    background:
                      team.evaluationStatus === "PENDING"
                        ? "rgba(245,158,11,0.2)"
                        : "rgba(16,185,129,0.2)",
                    borderRadius: "20px",
                    marginLeft: "0.5rem",
                  }}
                >
                  {team.evaluationStatus}
                </span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
