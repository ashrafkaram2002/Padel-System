"use client"; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';
import { TbArrowsShuffle2 } from "react-icons/tb";

export default function Matches() {

    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [timings, setTimings] = useState([]);
    const [day, setDay] = useState("");
    const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleAddTiming = () => {
    setModalOpen(true);
  };

  const handleSubmitTiming = () => {
    const newTimings = matches.map((_, index) => timings[index] || "");
    const newLocations = matches.map((_, index) => locations[index] || "");
    
    putTimings(newTimings, day, newLocations);
    setModalOpen(false); // Close the modal
  };

  const putTimings = async (timings, day, locations) => {
    try {
      const response = await axios.put('http://localhost:8000/putTimings', { timings, day, locations });
      console.log('Timings updated:', response.data);
    } catch (error) {
      console.error('Error updating timings:', error);
    }
  };

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:8000/viewDraw');
      const draws = response.data;
  
      // Filter out draws with no timings
      const filteredMatches = draws.filter(draw => draw.timings.length === 0).map(draw => draw.draw);
  
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
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="center-container" style={{marginTop:"5rem", textAlign: "center"}}>
        <div className='horizontal-container2'>
          <div className="page-title"> Manage Matches</div>
        </div>
        {loading? (<div className="flex justify-center items-center">
         <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-8"></div> </div>)
        :(<div className="matches-list">
             {matches.length > 0 && (
              matches.map((match, index) => (
              <div key={index} className="match-container2">
                    <div className="team2"> {match[0][0]} | {match[0][1]}</div>
                    <div className="vs2">vs</div>
                    <div className="team2"> {match[1][0]} | {match[1][1]}</div>
                    <button className="horizontal-container5"  onClick={handleAddTiming}>
                        <div className="button-label2"> Add Timing</div>
                    </button>
              </div>     
            ))
             )}
             
        </div>)}
        <div className='horizontal-container2' style={{marginLeft:"3rem", marginRight:"3rem", alignItems:"flex-end"}}>
              <button className="horizontal-container3" style={{height:"3rem"}}>
                <TbArrowsShuffle2 className="icon-button"/>
                <div className="button-label" > Submit Timings</div>
                
              </button>
        </div>  
      </div>

        {modalOpen && (
          <div className="modal-overlay">

            <div className="modal-content">
            <h2 className="modal-title">Add Match Timing</h2>
            <div>
                <input
                  className="modal-input"
                  type="time"
                  onChange={(e) => {
                    const newTimings = [...timings];
                    newTimings[index] = e.target.value;
                    setTimings(newTimings);
                  }}
                  placeholder="Time"
                />
                <input
                  className="modal-input"
                  type="text"
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index] = e.target.value;
                    setLocations(newLocations);
                  }}
                  placeholder="Location"
                />
            </div>
            <button className="modal-button confirm" onClick={handleSubmitTiming}>Confirm</button>
            <button className="modal-button cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>

          </div>
            
        )}


    </>
    
  );
}
