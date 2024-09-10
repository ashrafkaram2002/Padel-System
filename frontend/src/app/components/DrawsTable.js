
import React from 'react';

export default function DrawsTable({ searchTerm }) {
    const dummyData = [
        { playerA: 'John Doe', playerB: 'Jane Smith', date: '2024-09-01', time: '14:00', location: 'Court 1' },
        { playerA: 'Alice Johnson', playerB: 'Bob Brown', date: '2024-09-02', time: '16:00', location: 'Court 2' },
        { playerA: 'Charlie Davis', playerB: 'John Doe', date: '2024-09-03', time: '10:00', location: 'Court 3' },
        { playerA: 'Jane Smith', playerB: 'Alice Johnson', date: '2024-09-04', time: '12:00', location: 'Court 1' },
      ];

  const filteredData = dummyData.filter(
    item =>
      item.playerA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.playerB.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-table-container">
<table className="players-table">
      <thead>
        <tr>
          <th>Player A</th>
          <th>Player B</th>
          <th>Date</th>
          <th>Time</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.playerA}</td>
              <td>{item.playerB}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>{item.location}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
    
  );
}
