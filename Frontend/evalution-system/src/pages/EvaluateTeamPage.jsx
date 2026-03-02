import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EvaluateTeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/api/team/${teamId}`)
      .then((res) => res.json())
      .then(setTeam);
  }, [teamId]);

  const handleMarksChange = (memberId, value) => {
    setMarks((prev) => ({ ...prev, [memberId]: Number(value) }));
  };

  const handleSubmit = async () => {
    await fetch(`http://localhost:8080/api/team/${teamId}/marks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marks }),
    });
    alert("Marks saved!");
  };

  if (!team) return <div>Loading...</div>;

  return (
    <div className="team-details">
      <h1>{team.teamName} - Evaluation</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Marks (0-100)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {team.members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>
                <input
                  type="number"
                  className="marks-input"
                  min="0"
                  max="100"
                  value={marks[member.id] || ""}
                  onChange={(e) => handleMarksChange(member.id, e.target.value)}
                />
              </td>
              <td>
                <button className="save-row-btn">Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} className="submit-btn">
        Submit All Marks
      </button>
    </div>
  );
}
