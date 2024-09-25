"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DrawsTable({ searchTerm }) {

  const [drawsData, setDrawsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchDrawsData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/viewDraw');
        setDrawsData(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching draws data:', error);
        setLoading(false);
      }
    };

    fetchDrawsData();
  }, []);
  

  const parseTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes); // Date object for comparison
  };

  // Function to add ordinal suffixes like "1st", "2nd", "3rd", "4th", etc.
  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Format the date with short day name and ordinal suffixes
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Map full day names to their short versions (e.g. "Tuesday" -> "Tues")
    const shortDayNames = {
      Sunday: 'Sun',
      Monday: 'Mon',
      Tuesday: 'Tues',
      Wednesday: 'Wed',
      Thursday: 'Thurs',
      Friday: 'Fri',
      Saturday: 'Sat'
    };

    // Get the full day name
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Get the shortened day name
    const shortDayName = shortDayNames[dayName];

    // Get the day of the month and add the ordinal suffix
    const day = date.getDate();
    const dayWithOrdinal = `${day}${getOrdinal(day)}`;

    // Get the month name (shortened month name, e.g. "Oct")
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    // Construct the final string: "Tues, 9th of Oct"
    return `${shortDayName}, ${dayWithOrdinal} of ${monthName}`;
  };

  const processedData = drawsData.flatMap((drawEntry) => {
    // Ensure that drawEntry.draw, drawEntry.day, and drawEntry.timings are valid arrays before proceeding
    if (!drawEntry.draw || !drawEntry.day || !drawEntry.timings) {
      return []; // Skip this entry if any of the required data is missing
    }
  
    return drawEntry.draw.map((match, index) => {
      const matchDay = drawEntry.day[index];
      const matchTiming = drawEntry.timings[index];
  
      // Ensure the match date and time are valid
      if (!matchDay || !matchTiming) {
        return null; // Skip if the date or time is missing
      }
  
      const matchDate = new Date(matchDay);
      const matchTime = parseTime(matchTiming);
  
      // Check if matchTime was parsed correctly
      if (!matchTime) {
        return null; // Skip if time parsing failed
      }
  
      const matchDateTime = new Date(
        matchDate.getFullYear(),
        matchDate.getMonth(),
        matchDate.getDate(),
        matchTime.getHours(),
        matchTime.getMinutes()
      );
  
      // Only include future matches
      if (matchDateTime > new Date()) {
        return {
          playerA: match[0].join(' - '),
          playerB: match[1].join(' - '),
          date: formatDate(matchDay),  // Use the correct date
          time: matchTiming,  // Use the correct time
          location: drawEntry.locations ? drawEntry.locations[index] : 'Unknown',  // Use the correct location, or fallback
        };
      }
      return null; // Filter out past matches
    });
  })
  .filter(Boolean) // Remove null entries
  .sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
  
    // Ensure dates and times are valid before comparing
    if (!dateA || !dateB || !timeA || !timeB) return 0;
  
    return dateA - dateB || timeA - timeB;
  });
  
  // Filter the processed data based on search term
  const filteredData = processedData.filter(
    item =>
      item.playerA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.playerB.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="players-table-container">
  {loading ? (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white mt-5"></div>
    </div>
  ) : (
    <div>
      {filteredData.length > 0 ? (
        <table className="players-table">
          <thead>
            <tr>
              <th>Team A</th>
              <th>Team B</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.playerA}</td>
                <td>{item.playerB}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='center'> <div className='none-message'>No upcoming matches found.</div></div> 
      )}
    </div>
  )}
</div>
  );
}
