"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlayersTable({ searchTerm }) {

  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(true); 

   // Fetch player data from the backend
   useEffect(() => {
    const fetchPlayersData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/viewPlayers');
        setPlayersData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players data:', error);
        setLoading(false);
      }
    };

    fetchPlayersData();
  }, []);

  const filteredData = playersData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-table-container">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      ) : (
        <table className="players-table">
          <thead>
            <tr>
              <th>Rank</th> {/* Add numbering column */}
              <th>Name</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Display row number */}
                  <td>{item.name}</td>
                  <td>{item.wins}</td>
                  <td>{item.loses}</td>
                  <td>{item.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="none-message">No players found</td> {/* Adjust colspan */}
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
  
}
