"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';
import { GiConfirmed } from 'react-icons/gi';
import { useRouter} from 'next/navigation';

export default function Matches() {

    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedMatchIndex, setSelectedMatchIndex] = useState(null);
    const [message, setMessage] = useState(null);
    const [timings, setTimings] = useState([]);
    const [dates, setDates] = useState([]);
    const [locations, setLocations] = useState([]);
    const [matchTime, setMatchTime] = useState("");  // Temp state for modal input
    const [matchDate, setMatchDate] = useState("");  // Temp state for modal input
    const [matchLocation, setMatchLocation] = useState("");  // Temp state for modal input
    
    const router = useRouter();

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleAddTiming = (match, index) => {
    setSelectedMatch(match);
    setSelectedMatchIndex(index);
    setMatchTime(timings[index] || "");  // Pre-fill if timing already exists
    setMatchDate(dates[index] || "");    // Pre-fill if date already exists
    setMatchLocation(locations[index] || "");  // Pre-fill if location already exists
    setModalOpen(true);
};

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMatch(null);
    setMatchTime("");
    setMatchDate("");
    setMatchLocation("");
    setMessage("");
  }

  const goToMatchesTab = () => {
    router.push('/?tab=draws'); // Navigate to the draws tab
  };

  const handleSubmitTiming = () => {
    // Ensure all fields are filled
    if (!matchTime && !matchDate && !matchLocation) {
        setMessage("Please enter all fields");
        return;
    }
    if(!matchTime){
        setMessage("Please enter the match's time");
        return;
    }
    if(!matchDate){
        setMessage("Please enter the match's date");
        return;
    }
    if(!matchLocation){
        setMessage("Please enter the match's location");
        return;
    }

    // Update the timings, dates, and locations arrays at the selected index
    const newTimings = [...timings];
    const newDates = [...dates];
    const newLocations = [...locations];

    newTimings[selectedMatchIndex] = matchTime;
    newDates[selectedMatchIndex] = matchDate;
    newLocations[selectedMatchIndex] = matchLocation;

    setTimings(newTimings);
    setDates(newDates);
    setLocations(newLocations);

    setModalOpen(false);  // Close the modal
};

const handleFinalSubmitTimings = () => {
  // Check if timings, dates, and locations are provided for all matches
  if (timings.length !== matches.length || dates.length !== matches.length || locations.length !== matches.length) {
      alert("Please add timings, dates, and locations for all matches before submitting.");
      return;
  }

  putTimings(timings, dates, locations);
};

const putTimings = async (timings, day, locations) => {
  try {
      const response = await axios.post('http://localhost:8000/putTimings', { timings, day, locations });
      console.log('Timings updated:', response.data);
      goToMatchesTab();
      
  } catch (error) {
      console.error('Error updating timings:', error);
  }
};

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewDraw');
      const draws = response.data;
  
      const now = new Date();

        // Filter out draws with no timings and those that are yet to come
        const filteredMatches = draws.filter(draw => {
            // Check if there are no timings
            if (draw.timings.length === 0) return true;

            // Get the timings and their corresponding dates
            const hasUpcomingTiming = draw.timings.some((timing, index) => {
                const drawDate = new Date(draw.dates[index]); // Assuming you have a dates array
                const drawDateTime = new Date(drawDate.setHours(timing.split(':')[0], timing.split(':')[1]));
                return drawDateTime >= now; // Check if the timing is in the future
            });

            return !hasUpcomingTiming; // Return true if there are no upcoming timings
        }).map(draw => draw.draw);

      // Flatten the array to get a simple structure for matches
      const flattenedMatches = filteredMatches.flat();
  
      setMatches(flattenedMatches); // Update the state with the filtered matches
    } catch (error) {
      console.error('Error fetching draws:', error);
    } finally {
      setLoading(false);
      
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

<div className="center-container" style={{marginTop: "5rem", textAlign: "center"}}>
  <div className='horizontal-container2'>
    <div className="page-title">Manage Matches</div>
  </div>
  {loading ? (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-8"></div>
    </div>
  ) : (
    <div className="matches-list">
      {matches.length > 0 ? (
        matches.map((match, index) => {
          const hasTiming = timings[index] && dates[index] && locations[index]; // Check if timing, date, and location exist

          return (
            <div key={index} className="match-container2">
              <div className="team2">{match[0][0]} - {match[0][1]}</div>
              <div className="vs2">vs</div>
              <div className="team2">{match[1][0]} - {match[1][1]}</div>
              <button className="horizontal-container5" onClick={() => handleAddTiming(match, index)}>
                <div className="button-label2">
                  {hasTiming ? "Edit Timing" : "Add Timing"}
                </div>
              </button>
            </div>
          );
        })
      ) : (
        <div className='horizontal-container'>
          <div className='none-message'>No matches found.</div>
        </div>
      )}
    </div>
  )}
  
  {matches.length > 0 && (
    <div className='horizontal-container2' style={{marginLeft: "3rem", marginRight: "3rem", justifyContent: "center"}}>
      <button className="horizontal-container3" style={{height: "3rem"}} onClick={handleFinalSubmitTimings}>
        <GiConfirmed className="icon-button"/>
        <div className="button-label">Submit Timings</div>               
      </button>
    </div>
  )}
</div>


{modalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Add Match Timing</h2>
      <div className="login-subtitle" style={{ marginBottom: "0.3rem" }}>
        {selectedMatch[0][0]} - {selectedMatch[0][1]}
      </div>
      <div style={{ color: "#dc3545", fontWeight: "bold", marginBottom: "0.3" }}>VS</div>
      <div className="login-subtitle" style={{ marginBottom: "0.5rem" }}>
        {selectedMatch[1][0]} - {selectedMatch[1][1]}
      </div>
      <div>
        <label htmlFor="matchDay" className="modal-label">Match Day:</label>
        <input
          className="modal-input"
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          placeholder="Day"
        />
        
        <label htmlFor="matchTime" className="modal-label">Match Time:</label>
        <input
          id="matchTime"
          className="modal-input"
          type="time"
          value={matchTime}
          onChange={(e) => setMatchTime(e.target.value)}
        />
        <small style={{ color: "gray", display: "block", marginBottom: "1rem" }}>
          Please use AM or PM when entering the time.
        </small>
        
        <label htmlFor="matchLoc" className="modal-label">Match Location:</label>
        <input
          className="modal-input"
          type="text"
          value={matchLocation}
          onChange={(e) => setMatchLocation(e.target.value)}
          placeholder="Location"
        />
      </div>
      {message && <p className="modal-message">{message}</p>}
      <button className="modal-button confirm" onClick={handleSubmitTiming}>Confirm</button>
      <button className="modal-button cancel" onClick={handleCloseModal}>Cancel</button>
    </div>
  </div>
)}



    </>
    
  );
}
