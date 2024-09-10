
import React from 'react';

export default function MatchesTable({ searchTerm }) {
  const dummyData = [
    { player1: 'John Doe', player2: 'Jane Smith', scores: '3-2', winner: 'John Doe' },
    { player1: 'Alice Johnson', player2: 'Bob Brown', scores: '1-0', winner: 'Alice Johnson' },
    { player1: 'Charlie Davis', player2: 'John Doe', scores: '2-3', winner: 'John Doe' },
    { player1: 'Jane Smith', player2: 'Alice Johnson', scores: '2-2', winner: 'Draw' },
  ];

  const filteredData = dummyData.filter(
    item =>
      item.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.player2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-table-container">
<table className="players-table">
      <thead>
        <tr>
          <th>Player A</th>
          <th>Player B</th>
          <th>Scores</th>
          <th>Winner</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.player1}</td>
              <td>{item.player2}</td>
              <td>{item.scores}</td>
              <td>{item.winner}</td>
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
