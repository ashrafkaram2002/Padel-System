"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";

export default function PlayersAdminTable({ playersData=[],loading, fetchPlayersData }) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [message, setMessage] = useState('');

   // Handle Delete button click
  const handleDeleteClick = (player) => {
    setSelectedPlayer(player);
    setShowDeleteModal(true);
    setMessage("");
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!selectedPlayer) return;

    try {
      const response = await axios.delete("http://localhost:8000/removePlayer", {
        params: { id:  selectedPlayer._id} 
      });
      if (response.status === 200) {
        setMessage('Player deleted successfully!');
        setShowDeleteModal(false);
        setSelectedPlayer(null);
        fetchPlayersData();
      } else {
        setMessage('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      setMessage('Error occurred while deleting player');
    }
  };
  
  // Handle cancel actions
  const handleDeleteCancel = () => {
    setSelectedPlayer(null);
    setMessage("");
    setShowDeleteModal(false);

  };

  return (
    <div style={{marginLeft:"2rem", marginRight:"2rem"}}>
      
      {loading ? (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-5"></div>
  </div>
) : (
  <div className="players-table-container">
    {playersData.length > 0 ? (
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Points</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playersData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.position}</td>
              <td>{item.wins}</td>
              <td>{item.loses}</td>
              <td>{item.points}</td>
              <td>
                <button onClick={() => handleDeleteClick(item)}>
                  <MdDelete className="delete-icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className='center'> <div className='none-message'>No players found.</div></div> 
    )}
  </div>
)}


      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="confirmation-message">Are you sure you want to delete <div style={{fontWeight:"bold"}}>{selectedPlayer?.name} <span>?</span></div></div>
            <button className="modal-button cancel" onClick={handleDeleteConfirm}>
              Confirm
            </button>
            <button className="modal-button confirm" onClick={handleDeleteCancel}>
              Cancel
            </button>
            {message && <p className="modal-message">{message}</p>}
          </div>
        </div>
      )}
      
    </div>
  );
}
