"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';
import PlayersDropdown from '../components/PlayersDropdown';
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { BsFillPeopleFill} from "react-icons/bs";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TbArrowsShuffle2 } from "react-icons/tb";

export default function Teams() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawMade, setDrawMade] = useState(false);
  const [matches, setMatches] = useState([]);
  const [drawConfirmed, setDrawConfirmed] = useState(false);  // State for modal visibility

  const closeModal = () => {
    setDrawConfirmed(false);
    setDrawMade(false); 
    setTeams([]);
  };

  const fetchPlayersData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewPlayers');
      setPlayers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const handleSelectPlayer = (player) => {
    setSelectedPlayers(prev => [...prev, player]);
  };

  const handleRemovePlayer = (player) => {
    setSelectedPlayers(prev => prev.filter(p => p._id !== player._id));
  };

  const handleMatchTeams = async () => {
    const leftPlayers = selectedPlayers.filter(player => player.position === 'left');
    const rightPlayers = selectedPlayers.filter(player => player.position === 'right');
    console.log(selectedPlayers.length)
    if(selectedPlayers.length%4!==0){
      alert('The number of players should be divisible by 4.');
      return;
    }
    if (leftPlayers.length !== rightPlayers.length) {
      console.log("r", rightPlayers)
      console.log("l", leftPlayers)
      alert('The number of players positioned left must be equal to the number of players positioned right.');
      return;
    }
  
    // Extract player names from selected players
    const playerNames = selectedPlayers.map(player => player.name);
  
    try {
      const response = await axios.post('http://localhost:8000/teamMatching', { playerNames });
      setTeams(response.data.teams || []);
    } catch (error) {
      alert(`Error matching teams: ${error.response ? error.response.data.error : error.message}`);
    }
  };


  
  const handleAlternativeMatchTeams = async () => {
    const leftPlayers = selectedPlayers.filter(player => player.position === 'left');
    const rightPlayers = selectedPlayers.filter(player => player.position === 'right');
    if(selectedPlayers.length%4!==0){
      alert('The number of players should be divisible by 4.');
      return;
    }
    if (leftPlayers.length !== rightPlayers.length) {
      alert('The number of players positioned left must be equal to the number of players positioned right.');
      return;
    }
  
    // Extract player names from selected players
    const playerNames = selectedPlayers.map(player => player.name);
  
    try {
      const response = await axios.post('http://localhost:8000/teamMatchingRandomized', { playerNames });
      setTeams(response.data.teams || []);
    } catch (error) {
      alert(`Error matching teams: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleMakeDraw = async () => {
    setDrawMade(true); // Set state to indicate the draw is made
    setLoading(true); // Start loading before sending the request
  
    try {
      // Send the teams to the backend to generate matches
      const response = await axios.post('http://localhost:8000/makeDraw', { teams });
      setMatches(response.data || []); // Store the retrieved matches
    } catch (error) {
      alert(`Error making draw: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setLoading(false); // Stop loading after the request is finished
    }
  };

  const handleReDraw = async () => {
    setLoading(true);  // Show loading indicator
  
    try {
      const response = await axios.post('http://localhost:8000/makeDraw2', { teams });
      setMatches(response.data || []);  // Store the new matches
    } catch (error) {
      alert(`Error making re-draw: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  const handleConfirmDraw = async () => {
    setLoading(true);  // Show loading indicator
  
    try {
      const response = await axios.post('http://localhost:8000/confirmDraw', { teams });
      setDrawConfirmed(true);  // Set state to show confirmation modal
    } catch (error) {
      alert(`Error confirming draw: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };
  
  return (
    <>
      <AppNavBar onLogin={false} onHome={false} />
      <div className="relative min-h-screen">
      <Image
          src="/assets/padel3.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
          style={{ objectPosition: 'right'}} // Center the image
        />
      </div>

      <div className="center-container" style={{ marginTop: "5rem", textAlign: "center" }}>
        {drawMade?( (loading? (<div className="flex justify-center items-center">
         <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-8"></div>
      </div>): (<div >
             <div className='horizontal-container2'>
               <div className="page-title">Manage Draws</div>
             </div>
             <div className="matches-list">
             {matches.length > 0 && (
              matches.map((match, index) => (
              <div key={index} className="match-container">
                    <div className="team"> {match[0][0]} - {match[0][1]}</div>
                    <div className="vs">vs</div>
                    <div className="team"> {match[1][0]} - {match[1][1]}</div>
      
              </div>
            ))
             )}
             </div>
             <div className='horizontal-container2' style={{marginLeft:"3rem", marginRight:"3rem"}}>
              <button className="horizontal-container3" style={{height:"3rem"}} onClick={handleReDraw}>
                <TbArrowsShuffle2 className="icon-button"/>
                <div className="button-label" > Re-Draw</div>
                
              </button>
              <button className="horizontal-container3" style={{height:"3rem"}} onClick={handleConfirmDraw}>
                <GiConfirmed className="icon-button"/>
                <div className="button-label"> Confirm Draw</div>
               
              </button>
             </div>
             {drawConfirmed && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p className="confirmation-message">Drawn matches are confirmed</p>
                   <button className="modal-button confirm" onClick={closeModal}>
                       Close
                   </button>
                </div>
              </div>
              )}
         </div>))
          )
        :
        (<div>
          <div className='horizontal-container2'>
            <div className="page-title">Manage Teams</div>
          </div>
  
          <div className="two-column-container">
  
            <div className='column'>
          
              <PlayersDropdown 
                players={players} 
                onSelect={handleSelectPlayer} 
                onRemove={handleRemovePlayer}
                loading={loading}
              />

              <div className='horizontal-container' style={{marginTop:"1rem"}}>
                <button className="horizontal-container3" onClick={handleMatchTeams}>
                   <BsFillPeopleFill className="icon-button"/>
                   <div className="button-label"> Match Teams</div>
                </button>
  
                <button className="horizontal-container3" onClick={handleAlternativeMatchTeams}>
                   <GiPerspectiveDiceSixFacesRandom className="icon-button"/>
                   <div className="button-label"> Randomize</div>
                </button>
  
              </div>
              
            </div>
  
            <div className='column'>
    
              <div className='mini-title' style={{marginLeft:"1rem"}}>Teams</div>
              
              <div className='teams-list'>
        {teams.length > 0 ? (
          teams.map((team, index) => (
            <div key={index} className='team-container'>
              <div className='team-member'>{team[0]}</div>
              <div className='team-member'>{team[1]}</div>
            </div>
          ))
        ) : (
          <div></div>
        )}
              </div>
  
              <div style={{height:"5rem", display:"flex", justifyContent:"center"}}>
              {teams.length>0 && (<button className="horizontal-container3" style={{height:"3rem"}}>
                <div className="button-label" onClick={handleMakeDraw}> Make Draw</div>
                <MdKeyboardDoubleArrowRight className="icon-button"/>
              </button>)}
              </div>
  
              
             </div>
  
  
  
          </div>
  
          </div>)}
        

      </div>
    </>
  );
}
