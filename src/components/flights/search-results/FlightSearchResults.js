import React from 'react';
import { useLocation } from 'react-router-dom'; // useLocation to get passed state
import SearchBar from '../searchbar/Search'; // Import the SearchBar component
import './flightsearchresults.css';
import { FaClock, FaPlane, FaDollarSign } from 'react-icons/fa';


const FlightSearchResults = () => {
  const location = useLocation(); // Access state passed from the search page
  const { fromLocation, destination, checkInDate, checkOutDate } = location.state || {};

  // Dummy flight data for display
  const flights = [
    {
      airline: 'Emirates Airlines',
      price: '$5000',
      duration: '10h 45m',
      departure: '09:00 AM',
      arrival: '4:40 PM',
    },
    {
      airline: 'Delta Airlines',
      price: '$2000',
      duration: '3h 30m',
      departure: '01:43 PM',
      arrival: '06:45 PM',
    },
    {
      airline: 'Rayyan Airlines',
      price: '$4500',
      duration: '4h 15m',
      departure: '08:30 AM',
      arrival: '03:30 PM',
    },
  ];

  return (
    <div className="flight-search-results">
      {/* Render SearchBar on results page */}
      <SearchBar />

      <h2>Search Results</h2>
      <div className="flight-details">
        <p><strong>From:</strong> {fromLocation}</p>
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Check-in Date:</strong> {checkInDate ? checkInDate.toDateString() : 'Not selected'}</p>
        <p><strong>Check-out Date:</strong> {checkOutDate ? checkOutDate.toDateString() : 'Not selected'}</p>
       
      </div>

      <div className="flight-list">
        {flights.map((flight, index) => (
          <div className="flight-item" key={index}>
            <h3>{flight.airline}</h3>
            <p><strong>Price:</strong> {flight.price}</p>
            <p><strong>Duration:</strong> {flight.duration}</p>
            <p><strong>Departure:</strong> {flight.departure}</p>
            <p><strong>Arrival:</strong> {flight.arrival}</p>
            <button className="select-flight">Select Flight</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSearchResults;
