"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MatchesTable({ searchTerm }) {

  const [matchesData, setMatchesData] = useState([]);
  const [loading, setLoading] = useState(true); 

  // Fetch matches data from the backend
  useEffect(() => {
    const fetchMacthesData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/viewMatches');
        setMatchesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching macthes data:', error);
        setLoading(false);
      }
    };

    fetchMacthesData();
  }, []);

  const filteredData = matchesData.filter(
    item =>
      item.team1[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.team1[1].toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.team2[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.team2[1].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-table-container">
      {loading && 
     (<div className="flex justify-center items-center">
       <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
      </div>)}
     <table className="players-table">
      <thead>
        <tr>
          <th>Team 1</th>
          <th>Team 2</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.team1[0]} - {item.team1[1]}</td>
              <td>{item.team2[0]} - {item.team2[1]}</td>
              <td>{item.score}</td>
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
