import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function EvaluateTeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState({});

  const mockTeam = {
    teamId: 1,
    teamName: "Alpha Developers",
    members: [
      { id: 1, name: "Ravi Kumar", rollNumber: "22CS101", role: "Backend" },
      { id: 2, name: "Priya Sharma", rollNumber: "22CS102", role: "Frontend" },
      { id: 3, name: "Arun Singh", rollNumber: "22CS103", role: "Designer" },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setTeam(mockTeam);
      setLoading(false);
    }, 500);
  }, [teamId]);

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
      0,
    );
  };

  const saveStudentMarks = (studentId) => {
    const studentMarks = marks[studentId];

    if (
      !studentMarks ||
      Object.values(studentMarks).some((v) => v === undefined || v === "")
    ) {
      alert("⚠️ Please fill all 5 marks first!");
      return;
    }

    alert("✅ Marks Saved Successfully!");
  };

  if (loading) return <div className="loading">Loading Team...</div>;

  return (
    <div className="team-container">
      <div className="top-bar">
        <Link to="/admin-dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>{team.teamName}</h1>
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
            {team.members.map((member) => {
              const studentMarks = marks[member.id] || {};
              const total = calculateTotal(studentMarks);

              const isDisabled =
                Object.keys(studentMarks).length < 5 ||
                Object.values(studentMarks).some(
                  (v) => v === undefined || v === "",
                );

              return (
                <tr key={member.id}>
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
                          updateMark(member.id, criteria, e.target.value)
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
                      disabled={isDisabled}
                      onClick={() => saveStudentMarks(member.id)}
                    >
                      Save
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
