"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';
import PlayersAdminTable from '../components/PlayersAdminTable';
import SearchBar from '../components/SearchBar';
import { MdDelete, MdPersonAdd } from "react-icons/md";

export default function Players() {

 const [searchTerm, setSearchTerm] = useState('');
 const [playersData, setPlayersData] = useState([]);
 const [showAddModal, setShowAddModal] = useState(false);
 const [newPlayer, setNewPlayer] = useState({ name: '', position: 'Left', points: 0 });
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(true);

 const fetchPlayersData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewPlayers');
      setPlayersData(response.data);
      console.log('Fetched data:', response.data); // Log the fetched data
      // Optionally, you can use another useEffect to log updated state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlayersData();
  }, []);
  
  // Handle Add Player button click
  const handleAddPlayerClick = () => {
    setShowAddModal(true);
  };

  // Handle Add Player form submission
  const handleAddPlayerConfirm = async () => {
    // Validate the player's name (must contain at least two words)
    const nameParts = newPlayer.name.trim().split(' ');
    if (nameParts.length < 2) {
      setMessage('Please enter both first and last names.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/addPlayer', newPlayer);
      if (response.status === 200) {
        setMessage('Player added successfully!');
        setNewPlayer({ name: '', position: 'left', points: 0 });
        fetchPlayersData();
        // Close the modal after a successful operation
        setTimeout(() => {
          setShowAddModal(false);
          setMessage(''); // Clear the message when closing the modal
        }, 1500); // Optionally delay closing to let user see the message
      } else {
        setMessage('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      setMessage('Error occurred while adding player');
    }
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    setMessage('');
    setNewPlayer({ name: '', position: 'left', points: 0 });
  };

 const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredData = playersData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <AppNavBar onLogin={false} onHome={false}/>
      <div className="relative min-h-screen">
        <Image
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="center-container" style={{marginTop:"5rem", textAlign: "center"}}>
        <div className='horizontal-container2'>
          <div className="page-title"> Manage Players</div>
          <button onClick={handleAddPlayerClick}>
             <MdPersonAdd className="icon-button"/>
             <div className="button-label"> </div>
          </button>
        </div>
        <SearchBar className="search-bar" onSearch={handleSearch}/>
        <PlayersAdminTable searchTerm={searchTerm} playersData={filteredData} loading={loading} fetchPlayersData={fetchPlayersData} />
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Player</h2>

            <label htmlFor="playerName" className="modal-label">Player Name:</label>
      <input
        type="text"
        id="playerName"
        placeholder="Enter player's name"
        value={newPlayer.name}
        className="modal-input"
        onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
      />

      <label htmlFor="playerPosition" className="modal-label">Player Position:</label>
      <select
        id="playerPosition"
        value={newPlayer.position}
        className="modal-input"
        onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
      >
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>

      <label htmlFor="playerPoints" className="modal-label">Player Points:</label>
      <input
        type="number"
        id="playerPoints"
        placeholder="Enter player's points"
        className="modal-input"
        value={newPlayer.points}
        onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })}
      />
      {message && <p className="modal-message2">{message}</p>}
            <button className="modal-button confirm" onClick={handleAddPlayerConfirm}>
              Add Player
            </button>
            <button className="modal-button cancel" onClick={handleAddCancel}>
              Cancel
            </button>
            
          </div>
        </div>
      )}

    </>
    
  );
}
