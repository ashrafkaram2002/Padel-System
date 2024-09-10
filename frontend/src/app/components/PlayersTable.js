"use client"; 

import { useState } from 'react';

export default function PlayersTable({ searchTerm }) {
  const dummyData = [
    { name: 'John Doe', points: 120, matches: 15 },
    { name: 'Jane Smith', points: 95, matches: 12 },
    { name: 'Alice Johnson', points: 110, matches: 20 },
    { name: 'Bob Brown', points: 80, matches: 8 },
    { name: 'Charlie Davis', points: 130, matches: 18 },
  ];

  const filteredData = dummyData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
            <th>Total Matches</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.points}</td>
                <td>{item.matches}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
