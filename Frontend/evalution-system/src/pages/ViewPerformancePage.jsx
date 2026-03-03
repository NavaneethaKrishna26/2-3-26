import { useState } from "react";
import { getTeamScore } from "../services/api";

function ViewPerformancePage() {
  const [teamId, setTeamId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPerformance = async () => {
    if (!teamId) {
      setError("Please enter a Team ID");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getTeamScore(teamId);
      setData(result);
    } catch (err) {
      console.error("Error fetching performance:", err);
      setError(`Failed to fetch performance: ${err.message || "Server error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchPerformance();
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div className="form-container" style={{ marginBottom: "2rem" }}>
        <h2>📊 View Team Performance</h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Enter Team ID"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "0.8rem",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              color: "white",
            }}
          />
          <button
            onClick={fetchPerformance}
            disabled={loading}
            className="submit-btn"
            style={{ padding: "0.8rem 2rem" }}
          >
            {loading ? "⏳ Searching..." : "🔍 Search"}
          </button>
        </div>

        {error && (
          <div style={{ color: "#ff6b6b", marginTop: "1rem" }}>
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="form-container">
          <h3 style={{ color: "#667eea", marginBottom: "1.5rem" }}>
            ✅ {data.teamName}
          </h3>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
              Overall Score: <strong style={{ color: "#10b981" }}>{data.overallScore}</strong>
            </p>
          </div>

          {data.members && data.members.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 1rem",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Roll Number</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Role</th>
                    <th style={{ padding: "1rem", textAlign: "center" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.members.map((member, index) => (
                    <tr
                      key={index}
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <td style={{ padding: "1rem" }}>{member.name}</td>
                      <td style={{ padding: "1rem" }}>{member.rollNumber}</td>
                      <td style={{ padding: "1rem" }}>{member.role}</td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "#10b981",
                          fontWeight: "bold",
                        }}
                      >
                        {member.totalScore || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.7)" }}>No members data available</p>
          )}
        </div>
      )}

      {!data && !error && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <p>Enter a Team ID to view performance</p>
        </div>
      )}
    </div>
  );
}

export default ViewPerformancePage;
