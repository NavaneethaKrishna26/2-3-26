import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const roles = ["Frontend", "Backend", "Designer", "Tester"];

  const handleProceed = () => {
    // Auto-generate table rows based on team size
    const newStudents = Array.from({ length: teamSize }, (_, i) => ({
      id: Date.now() + i,
      name: "",
      role: "Frontend",
      isTeamLead: false,
    }));
    setStudents(newStudents);
    setShowTable(true);
  };

  const updateStudent = (id, field, value) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  // In handleSubmit() - Replace the mock:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (students.some((s) => !s.name)) {
      alert("Fill all names!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/teams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          members: students.map((s) => ({
            name: s.name,
            rollNumber: `22CS${Math.floor(Math.random() * 900) + 100}`, // Auto-generate
            role: s.role,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Team ID: ${data.teamId} registered!`);
        navigate("/");
      } else {
        alert("Registration failed");
      }
    } catch {
      alert("Server error - check backend");
    }
    setLoading(false);
  };

  return (
    <div
      className="register-page"
      style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showTable ? "1fr 1fr" : "1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* LEFT: Team Form */}
        <div className="form-container">
          <h2>📝 Register Team</h2>
          <form>
            <div className="form-group">
              <label>Team Name</label>
              <input
                type="text"
                placeholder="Enter team name (e.g., Alpha Team)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Team Size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                required
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Members
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="submit-btn"
              onClick={handleProceed}
              disabled={!teamName || loading}
            >
              🚀 Proceed to Add Members
            </button>
          </form>
        </div>

        {/* RIGHT: Students Table */}
        {showTable && (
          <div
            className="students-preview"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "2.5rem",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem", color: "#667eea" }}>
              👥 Team Members ({students.length}/{teamSize})
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 1rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.1)" }}>
                      <th style={{ padding: "1rem", textAlign: "left" }}>
                        Name
                      </th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>
                        Role
                      </th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>
                        Team Lead
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.id}
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="text"
                            placeholder={`Member ${index + 1}`}
                            value={student.name}
                            onChange={(e) =>
                              updateStudent(student.id, "name", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.8rem",
                              background: "rgba(255,255,255,0.1)",
                              border: "2px solid rgba(255,255,255,0.2)",
                              borderRadius: "10px",
                              color: "white",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <select
                            value={student.role}
                            onChange={(e) =>
                              updateStudent(student.id, "role", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.8rem",
                              background: "rgba(255,255,255,0.1)",
                              border: "2px solid rgba(255,255,255,0.2)",
                              borderRadius: "10px",
                              color: "white",
                            }}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="checkbox"
                            checked={student.isTeamLead}
                            onChange={(e) =>
                              updateStudent(
                                student.id,
                                "isTeamLead",
                                e.target.checked,
                              )
                            }
                            style={{
                              transform: "scale(1.3)",
                              accentColor: "#667eea",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || students.some((s) => !s.name)}
                style={{ marginTop: "1.5rem" }}
              >
                {loading ? "⏳ Registering Team..." : "✅ Submit Team"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
