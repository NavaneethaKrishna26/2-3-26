import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/teams")
      .then((res) => res.json())
      .then(setTeams)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="dashboard">
        <h2>Loading teams...</h2>
      </div>
    );

  return (
    <div className="dashboard">
      <h1>Teams Dashboard</h1>
      <div className="teams-grid">
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/evaluate-team/${team.id}`}
            className="team-card"
          >
            <h3>{team.teamName}</h3>
            <p>Size: {team.size} members</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
