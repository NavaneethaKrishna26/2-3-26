import { useState } from "react";
import axios from "axios";

function ViewPerformancePage() {
  const [teamId, setTeamId] = useState("");
  const [data, setData] = useState([]);

  const fetchPerformance = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/teams/${teamId}/performance`,
    );
    setData(res.data);
  };

  return (
    <div>
      <h2>View Performance</h2>
      <input
        placeholder="Enter Team ID"
        onChange={(e) => setTeamId(e.target.value)}
      />
      <button onClick={fetchPerformance}>Search</button>

      {data.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>SRS</th>
              <th>RS</th>
              <th>Coding</th>
              <th>Attr1</th>
              <th>Attr2</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m, i) => (
              <tr key={i}>
                <td>{m.name}</td>
                <td>{m.srs}</td>
                <td>{m.rs}</td>
                <td>{m.coding}</td>
                <td>{m.attribute1}</td>
                <td>{m.attribute2}</td>
                <td>{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewPerformancePage;
