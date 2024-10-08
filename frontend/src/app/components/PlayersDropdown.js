"use client";

import { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";

const PlayersDropdown = ({ players, onSelect, loading, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  useEffect(() => {
    // Initialize availablePlayers with players not yet selected
    setAvailablePlayers(
      players.filter(p => !selectedPlayers.some(sp => sp._id === p._id))
    );
  }, [players, selectedPlayers]);

  useEffect(() => {
    // Update availablePlayers based on searchTerm and selectedPlayers
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAvailablePlayers(filtered.filter(p => !selectedPlayers.some(sp => sp._id === p._id)));
  }, [searchTerm, players, selectedPlayers]);

  const handleSelectPlayer = (player) => {
    if (!selectedPlayers.some(p => p._id === player._id)) {
      setSelectedPlayers(prev => [...prev, player]);
      setAvailablePlayers(prev => prev.filter(p => p._id !== player._id));
      onSelect(player);
    }
  };

  const handleRemovePlayer = (player) => {
    setSelectedPlayers(prev => prev.filter(p => p._id !== player._id));
    setAvailablePlayers(prev => [...prev, player].sort((a, b) => a.name.localeCompare(b.name)));
    onRemove(player);
  };

  // Count the number of left and right players selected
  const leftCount = selectedPlayers.filter(player => player.position === 'left').length;
  const rightCount = selectedPlayers.filter(player => player.position === 'right').length;

  return (
    <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
      
      <div className="info-text" style={{ marginBottom: '0.3rem', fontSize: '0.9rem', color: '#fff', marginTop:'-0.9rem', textAlign:'left' }}>
        Click on the players you want to select
      </div>
      
      <div>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ width: "100%", marginLeft: '-0.2rem', marginBottom:"0.1rem"}}
        />

        <div className='mini-title'>Available Players</div>
        <div className='dropdown-container'>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-4"></div>
            </div>
          ) : (
            <ul>
              {availablePlayers.length > 0 ? (
                availablePlayers.map(player => (
                  <li
                    key={player._id}
                    title={`${player.position}`}
                    className='dropdown-item'
                    onClick={() => handleSelectPlayer(player)}
                  >
                    <div style={{ fontWeight: "bold", marginRight: "2rem" }}>{player.position === "left" ? "L" : "R"}</div>
                    <div>{player.name}</div>
                    <span style={{ marginLeft: "2rem", fontWeight: "lighter" }}>{player.points} pts</span>
                  </li>
                ))
              ) : (
                <li className='dropdown-item'>No players available</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className='mini-title' style={{ marginTop: "1rem" }}>
        Selected Players
        <span className='subtitle' style={{ marginLeft: "2rem" }}>
          Left: {leftCount} | Right: {rightCount}
        </span>
      </div>
      <div className='dropdown-container'>
        <ul>
          {selectedPlayers.length > 0 ? (
            selectedPlayers.map(player => (
              <li key={player._id} title={`${player.position}`} className='dropdown-item'>
                <div style={{ fontWeight: "bold", marginRight: "2rem" }}>{player.position === "left" ? "L" : "R"} </div>
                <div>{player.name}</div>
                <span style={{ marginLeft: "2rem", fontWeight: "lighter" }}>{player.points} pts</span>
                <button onClick={() => handleRemovePlayer(player)}>
                  <MdDelete className="delete-icon" />
                </button>
              </li>
            ))
          ) : (
            <li className='dropdown-item'>No players selected</li>
          )}
        </ul>
      </div>

    </div>
  );
};

export default PlayersDropdown;
