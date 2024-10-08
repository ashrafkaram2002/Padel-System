"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';

export default function Scores() {

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [score, setScore] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewDraw');
      const draws = response.data;
  
      // Get the current date and time
      const now = new Date();
  
      // Filter out matches that are in the future
      const filteredMatches = draws.map(draw => {
        return draw.draw.filter((match, index) => {
          const drawDate = new Date(draw.day[index]); // Get the corresponding date for the match
          const timing = draw.timings[index]; // Get the corresponding timing
  
          // Extract hours and minutes from the timing
          const [hours, minutes] = timing.split(':').map(Number);
          drawDate.setHours(hours, minutes, 0, 0); // Set the hours and minutes
  
          // Return true if the match date and time are in the past
          return drawDate < now;
        });
      }).filter(draw => draw.length > 0); // Filter out any draws with no valid matches
  
      // Flatten the matches into a single array
      const flattenedMatches = filteredMatches.flat();
  
      setMatches(flattenedMatches); // Update the state with the filtered matches
      console.log(flattenedMatches);
    } catch (error) {
      console.error('Error fetching draws:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleOpenModal = (match) => {
    setSelectedMatch(match);
    setModalOpen(true);
};

  const handleCloseModal = () => {
    setModalOpen(false);
    setMessage("");
    setScore("");
  }

  const handleCloseModal2 = () => {
    setModalOpen(false);
    setMessage("");
    // setScore("");
  }

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
    setSelectedMatch(null);
    setScore("");
    setMessage("");
    setConfirmationMessage("");
  }

  const handleConfirmationModal = () => {
    const validation = validateScore(score);

    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    setConfirmationMessage(validation.message);
    setConfirmationModal(true);
    handleCloseModal2();
  };

  
  const validateScore = (score) => {
    const sets = score.split('/'); // Split the score into sets
    let leftWins = 0;
    let rightWins = 0;
  
    for (const set of sets) {
      const [left, right] = set.split('-').map(Number); // Split each set into left and right scores
  
      // Check if both scores are valid numbers
      if (isNaN(left) || isNaN(right)) {
        return { valid: false, message: "Scores must be numbers." };
      }
  
      // Check if scores are non-negative and not greater than 7
      if (left < 0 || right < 0 || left > 7 || right > 7) {
        return { valid: false, message: "Scores must be non-negative numbers no greater than 7." };
      }
  
      // Validate score conditions
      if (right === 7 && left === 6){
        rightWins++;
      } else if (left === 7 && right === 6){
        leftWins++;
      } else if (Math.abs(left - right) < 2){
        return { valid: false, message: "Invalid score" };
      } else if (left === 6 && right < 7) {
        leftWins++;
      } else if (right === 6 && left < 7) {
        rightWins++;
      } else if (left === 7 && (right === 5 || right === 6)) {
        leftWins++;
      } else if (right === 7 && (left === 5 || left === 6)) {
        rightWins++;
      } else if (right === 7 && (left<5)) {
        return { valid: false, message: "Invalid score" };
      } else if (left === 7 && (right<5)) {
        return { valid: false, message: "Invalid score" };
      } else if (left < 6 && right < 6) {
        return { valid: false, message: "Invalid score" };
      } else if (left === 6 && right === 6) {
        return { valid: false, message: "Invalid score" };
      }
    }
  
    // Check final outcome and set the confirmation message
    if (leftWins > rightWins) {
      return { valid: true, message: `Are you sure team ${selectedMatch[0][0]} & ${selectedMatch[0][1]} won with a score of ${score}?` };
    } else if (leftWins < rightWins) {
      return { valid: true, message: `Are you sure team ${selectedMatch[1][0]} & ${selectedMatch[1][1]} won with a score of ${score}?` };
    } else {
      return { valid: false, message: "Each team has won a set; a final set is needed." };
    }
  };
  

  const handleAddScore = async () => {
    const teams = [
        [selectedMatch[0][0],selectedMatch[0][1]], 
        [selectedMatch[1][0],selectedMatch[1][1]], 
      ];
    
      console.log(teams);
  
    try {
      const response = await axios.post(' http://localhost:8000/updateScoreAndPoints', {
        teams,
        score,
      });
  
      // Handle success response
      if (response.status === 200) {
        closeConfirmationModal();
        // Remove the match based on team names and timing
        // setMatches((prevMatches) => prevMatches.filter((match) => {
        //     return !(
        //       match[0][0] === selectedMatch[0][0] &&
        //       match[0][1] === selectedMatch[0][1] &&
        //       match[1][0] === selectedMatch[1][0] &&
        //       match[1][1] === selectedMatch[1][1]
        //     );
        // }));
        fetchDraws();
    }
    } catch (error) {
      // Handle error response
      setMessage(`Error updating score: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <>
      <AppNavBar onLogin={false} onHome={false}/>
      <div className="relative min-h-screen">
      <Image
          src="/assets/padel3.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
          style={{ objectPosition: 'right'}} // Center the image
        />
      </div>

      <div className="center-container" style={{marginTop:"5rem", textAlign: "center"}}>
        <div className='title-container'>
          <div className="page-title">Update Scores</div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-8"></div>
          </div>
        ) : (
          <div className="matches-list">
            {matches.length > 0 ? (
              matches.map((match, index) => (
                <div key={index} className="match-container2">
                  <div className="team2">{match[0][0]} - {match[0][1]}</div>
                  <div className="vs2">vs</div>
                  <div className="team2">{match[1][0]} - {match[1][1]}</div>
                  <button className="horizontal-container6" onClick={() => handleOpenModal(match)}>
                    <div className="button-label2">Add Score</div>
                  </button>
                </div>
              ))
            ) : (
                <div className='horizontal-container'><div className='none-message'> No completed matches found.</div></div> 
            )}
          </div>
        )}

        {modalOpen && (
          <div className="modal-overlay">

            <div className="modal-content">
            <h2 className="modal-title">Add Match Scores</h2>
            <div className="login-subtitle" style={{marginBottom:"0.3rem"}}>{selectedMatch[0][0]}-{selectedMatch[0][1]}</div>
            {/* <div style={{color:"#dc3545", fontWeight:"bold", marginBottom:"0.3"}}>VS</div> */}
            <div className="login-subtitle" style={{marginBottom:"0.5rem"}}>{selectedMatch[1][0]} & {selectedMatch[1][1]} </div>
            <div>
                {/* <label htmlFor="score" className="modal-label">Set X-X     Sets X-X/X-X</label> */}
                <input
                  className="modal-input"
                  type="text"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Enter score"
                />
            </div>
            {message && <p className="modal-message">{message}</p>}
            <button className="modal-button confirm" onClick={handleConfirmationModal}>Submit</button>
            <button className="modal-button cancel"  onClick={handleCloseModal}>Cancel</button>
            </div>

          </div>
            
        )}


        {/* Modal for score confirmation */}
      {confirmationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
          {message && <p className="modal-message">{message}</p>}
            <button className="modal-button confirm" onClick={handleAddScore}>
              Confirm
            </button>
            <button className="modal-button cancel" onClick={closeConfirmationModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      </div>

    </>
    
  );
}
