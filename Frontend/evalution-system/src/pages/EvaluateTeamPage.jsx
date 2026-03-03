import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAdminTeamDetails, submitStudentMarks } from "../services/api";

export default function EvaluateTeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingMarks, setSubmittingMarks] = useState({});
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const data = await getAdminTeamDetails(teamId);
      console.log("Team Data:", data); // Debug
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
      alert(`❌ Failed to load team: ${error.message || "Server error"}`);
      navigate("/admin-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateMark = (studentId, criteria, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [criteria]: Number(value),
      },
    }));
  };

  const calculateTotal = (studentMarks) => {
    return Object.values(studentMarks || {}).reduce(
      (sum, v) => sum + (v || 0),
      0
    );
  };

  const saveStudentMarks = async (studentId) => {
    if (!studentId) {
      alert("Invalid Student ID");
      return;
    }

    const studentMarks = marks[studentId];

    if (
      !studentMarks ||
      Object.values(studentMarks).some((v) => v === undefined || v === "")
    ) {
      alert("⚠️ Please fill all 5 marks first!");
      return;
    }

    setSubmittingMarks((prev) => ({ ...prev, [studentId]: true }));

    try {
      await submitStudentMarks(studentId, studentMarks);
      alert("✅ Marks Saved Successfully!");

      // Clear marks for this student
      setMarks((prev) => {
        const updated = { ...prev };
        delete updated[studentId];
        return updated;
      });

      await fetchTeamDetails();
    } catch (error) {
      console.error("Error saving marks:", error);
      alert(`❌ Failed to save marks: ${error.message || "Server error"}`);
    } finally {
      setSubmittingMarks((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: "#667eea" }}>
          ⏳ Loading Team...
        </div>
      </div>
    );

  if (!team)
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "red" }}>
        Team not found
      </div>
    );

  return (
    <div className="team-container">
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/admin-dashboard"
          style={{ color: "#667eea", textDecoration: "none" }}
        >
          ← Back to Dashboard
        </Link>

        <h2 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          📝 Evaluate Team: {team.teamName}
        </h2>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Communication</th>
              <th>Technical</th>
              <th>Innovation</th>
              <th>Collaboration</th>
              <th>Presentation</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {team.members &&
              team.members.map((member) => {
                const studentMarks = marks[member.studentId] || {};
                const total = calculateTotal(studentMarks);

                const isDisabled =
                  Object.keys(studentMarks).length < 5 ||
                  Object.values(studentMarks).some(
                    (v) => v === undefined || v === ""
                  );

                return (
                  <tr key={member.studentId}>
                    <td>
                      <strong>{member.name}</strong>
                      <div className="sub-text">
                        {member.rollNumber} • {member.role}
                      </div>
                    </td>

                    {[
                      "communication",
                      "technical",
                      "innovation",
                      "collaboration",
                      "presentation",
                    ].map((criteria) => (
                      <td key={criteria}>
                        <select
                          value={studentMarks[criteria] ?? ""}
                          onChange={(e) =>
                            updateMark(
                              member.studentId,
                              criteria,
                              e.target.value
                            )
                          }
                          className="mark-select"
                        >
                          <option value="">-</option>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}

                    <td className="total">{total} / 50</td>

                    <td>
                      <button
                        className="save-btn"
                        disabled={
                          isDisabled ||
                          submittingMarks[member.studentId]
                        }
                        onClick={() =>
                          saveStudentMarks(member.studentId)
                        }
                      >
                        {submittingMarks[member.studentId]
                          ? "⏳"
                          : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}