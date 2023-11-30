import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [taskData, setTaskData] = useState({ assignedIssues: [], unassignedIssues: [] });

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://localhost:3001',
    });

    api.get('/task')
      .then(response => setTaskData(response.data))
      .catch(error => console.error(error));
  }, []);

  const calculatePercentage = (count, total) => {
    return total === 0 ? '0%' : `${((count / total) * 100).toFixed(2)}%`;
  };

  const assignedCount = taskData.assignedIssues.length;
  const unassignedCount = taskData.unassignedIssues.length;
  const totalCount = assignedCount + unassignedCount;

  return (
    <>
      <div className="App">
        <h1>Jira Dashboard</h1>
        <table>
          <thead>
            <tr>
              <th colSpan="4">Issue Statistics: {taskData.projectName}</th>
            </tr>
            <tr>
              <th>Assignee</th>
              <th>Count</th>
              <th colSpan="2">Percent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{assignedCount > 0 ? taskData.assignedIssues[0].assignee : 'Unassigned'}</td>
              <td>{assignedCount}</td>
              <td className="adjust1">
                <div className="percent-bar" style={{ width: calculatePercentage(assignedCount, totalCount) }}></div>
              </td>
              <td className="adjust2">{calculatePercentage(assignedCount, totalCount)}</td>
            </tr>
            <tr>
              <td>Unassigned</td>
              <td>{unassignedCount}</td>
              <td className="adjust1">
                <div className="percent-bar" style={{ width: calculatePercentage(unassignedCount, totalCount) }}></div>
              </td>
              <td className="adjust2">{calculatePercentage(unassignedCount, totalCount)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td colSpan="3">{totalCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;