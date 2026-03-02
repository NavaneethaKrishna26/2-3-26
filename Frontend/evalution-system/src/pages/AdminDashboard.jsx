import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Loading teams..."); // Debug log

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

    // Try API first, fallback to demo
    fetch("http://localhost:8080/api/admin/teams")
      .then((res) => {
        console.log("API Response:", res.status); // Debug
        return res.ok ? res.json() : demoTeams;
      })
      .then((data) => {
        console.log("Teams loaded:", data); // Debug
        setTeams(data);
      })
      .catch((err) => {
        console.log("API failed, using demo:", err);
        setTeams(demoTeams);
      })
      .finally(() => setLoading(false));
  }, []);

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

  console.log("Rendering teams:", teams); // Final debug

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
        <h1 style={{ margin: 0 }}>🏆 Teams Dashboard ({teams.length})</h1>
        <Link to="/" style={{ color: "#667eea", textDecoration: "none" }}>
          ← Back Home
        </Link>
      </div>

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
              (e.target.style.transform = "translateY(-10px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
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
    </div>
  );
}
