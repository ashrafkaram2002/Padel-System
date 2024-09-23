"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DrawsTable({ searchTerm }) {

  const [drawsData, setDrawsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch draws data from the backend
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

  // Process and sort draws data based on date and time
  const processedData = drawsData.flatMap((drawEntry) => {
    return drawEntry.draw.map((match, index) => ({
      playerA: match[0].join(' - '),  // Combine player names for team A
      playerB: match[1].join(' - '),  // Combine player names for team B
      date: formatDate(drawEntry.day[0]),     // Use the first date (assuming one per draw)
      time: drawEntry.timings[0], // Use the first time (assuming one per draw)
      location: drawEntry.locations[0], // Use the first location (assuming one per draw)
    }));
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);

    // First compare dates, then times
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
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      ) : (
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
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.playerA}</td>
                  <td>{item.playerB}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className='none-message'>No draws available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
