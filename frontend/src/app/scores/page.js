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
  const [successModal, setSuccessModal] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewDraw');
      const draws = response.data;
  
      // Get the current date and time
      const now = new Date();
  
      // Filter out draws that have already passed
      const filteredMatches = draws.filter(draw => {
        // Extract the date and time from the draw
        const drawDate = new Date(draw.day[0]); // Assuming the day is in an array
        const drawTimings = draw.timings; // Assuming timings is an array
  
        // Check if any timing indicates the match has passed
        return drawTimings.some(timing => {
          const [hours, minutes] = timing.split(':').map(Number);
          const drawDateTime = new Date(drawDate.setHours(hours, minutes));
          return drawDateTime < now; // Include only past matches
        });
      }).map(draw => draw.draw); // Return only the draw details
  
      const flattenedMatches = filteredMatches.flat();
  
      setMatches(flattenedMatches); // Update the state with the filtered matches

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
    setSelectedMatch(null);
    setScore("");
    setMessage("");
  }

  const handleSuccessModal = () => {
    setMessage(`${winner}` + " won!")
    setSuccessModal(true);
    handleCloseModal();
  }

  const closeSuccessModal = () => {
    setSuccessModal(false);
    setSelectedMatch(null);
    setScore("");
    setMessage("");
    setWinner("");
  }

  const validateScore = (score) => {
    const sets = score.split('/'); // Split the score into sets
    let leftWins = 0;
    let rightWins = 0;
  
    for (const set of sets) {
      const [left, right] = set.split('-').map(Number); // Split each set into left and right scores
  
      // Check if both scores are valid numbers
      if (isNaN(left) || isNaN(right)) {
        setMessage("Scores must be numbers.");
        return { valid: false };
      }
  
      // Check if scores are non-negative and not greater than 7
      if (left < 0 || right < 0 || left > 7 || right > 7) {
        setMessage("Scores must be non-negative numbers no greater than 7.");
        return { valid: false };
      }
  
      // Validate score conditions
      if (left === 6 && right <= 7) {
        leftWins++;
      } else if (right === 6 && left <= 7) {
        rightWins++;
      } else if (left === 7 && (right === 5 || right === 6)) {
        leftWins++;
      } else if (right === 7 && (left === 5 || left === 6)) {
        rightWins++;
      } else if (Math.abs(left - right) < 2) {
        setMessage("The score difference must be at least 2.");
        return { valid: false };
      } else if (left < 6 && right < 6) {
        setMessage("At least one score must be 6 to win a set.");
        return { valid: false };
      } else if (left === 6 && right === 6) {
        setMessage("Both teams cannot score 6 in the same set.");
        return { valid: false };
      }
    }
  
    // Check final outcome
    if (leftWins > 1 || (leftWins === 1 && rightWins === 0)) {
        setWinner(`${selectedMatch[0][0]} & ${selectedMatch[0][1]}`);
      return { valid: true };
    } else if (rightWins > 1 || (rightWins === 1 && leftWins === 0)) {
        setWinner(`${selectedMatch[1][0]} & ${selectedMatch[1][1]}`);
      return { valid: true };
    } else {
      setMessage("Each team has won a set; a final set is needed.");
      return { valid: false };
    }
  };
  

  const handleAddScore = async () => {
    const teams = [
        [selectedMatch[0][0],selectedMatch[0][1]], // Assuming team names are in [0][0] and [0][1]
        [selectedMatch[1][0],selectedMatch[1][1]], // Assuming team names are in [1][0] and [1][1]
      ];
    
      console.log(teams);
  
    // Validate score format
    const validation = validateScore(score);
    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }
  
    try {
      const response = await axios.post(' http://localhost:8000/updateScoreAndPoints', {
        teams,
        score,
      });
  
      // Handle success response
      if (response.status === 200) {
        setMessage('Score updated successfully!');
        handleSuccessModal();
        setMatches((prevMatches) => prevMatches.filter(match => match.id !== selectedMatch.id));
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
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="center-container" style={{marginTop:"5rem", textAlign: "center"}}>
        <div className='horizontal-container2'>
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
                  <div className="team2">{match[0][0]} | {match[0][1]}</div>
                  <div className="vs2">vs</div>
                  <div className="team2">{match[1][0]} | {match[1][1]}</div>
                  <button className="horizontal-container5" onClick={() => handleOpenModal(match)}>
                    <div className="button-label2">Add Score</div>
                  </button>
                </div>
              ))
            ) : (
                <div className='horizontal-container'><div className='none-message'> No matches found.</div></div> 
            )}
          </div>
        )}

        {modalOpen && (
          <div className="modal-overlay">

            <div className="modal-content">
            <h2 className="modal-title">Add Match Scores</h2>
            <div className="login-subtitle" style={{marginBottom:"0.3rem"}}>{selectedMatch[0][0]}-{selectedMatch[0][1]}</div>
            <div style={{color:"#dc3545", fontWeight:"bold", marginBottom:"0.3"}}>VS</div>
            <div className="login-subtitle" style={{marginBottom:"0.5rem"}}>{selectedMatch[1][0]} & {selectedMatch[1][1]} </div>
            <div>
                {/* <label htmlFor="score" className="modal-label">Set X-X     Sets X-X/X-X</label> */}
                <input
                  className="modal-input"
                  type="text"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Score"
                />
            </div>
            {message && <p className="modal-message">{message}</p>}
            <button className="modal-button confirm" onClick={handleAddScore}>Confirm</button>
            <button className="modal-button cancel"  onClick={handleCloseModal}>Cancel</button>
            </div>

          </div>
            
        )}


        {/* Modal for score confirmation */}
      {successModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="confirmation-message">{message}</p>
            <button className="modal-button confirm" onClick={closeSuccessModal}>
              OK
            </button>
          </div>
        </div>
      )}

      </div>

    </>
    
  );
}
