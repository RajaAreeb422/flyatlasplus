import React, { useState } from 'react';
import Select from 'react-select'; // Import react-select for dropdowns
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Datepicker styles
import '../components/flights/search-results/results.css'; // Custom CSS

const Results = () => {
  const [fromLocation, setFromLocation] = useState(null); // Store the selected "From" location
  const [destination, setDestination] = useState(null); // Store the selected "To" location
  const [checkInDate, setCheckInDate] = useState(null); // Check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // Check-out date
  const [passengerCount, setPassengerCount] = useState(1); // Number of passengers

  const cities = [
    { value: 'Islamabad', label: 'Islamabad' },
    { value: 'Lahore', label: 'Lahore' },
    { value: 'Karachi', label: 'Karachi' }
  ];

  const handleSearch = () => {
    // if (fromLocation && destination && checkInDate && checkOutDate) {
    //   alert(`Searching flights from ${fromLocation.label} to ${destination.label} from ${checkInDate} to ${checkOutDate} for ${passengerCount} passenger(s).`);
    // } else {
    //   alert("Please fill in all fields.");
    // }
  };

  return (
    <div className="search-bar">
      <div className="search-bar-result-container">
        

        <div className="search-field">
          <Select
            options={cities}
            value={fromLocation}
            onChange={setFromLocation}
            placeholder="From"
            className="dropdown"
          />
        </div>

        
        <div className="search-field">
          <Select
            options={cities}
            value={destination}
            onChange={setDestination}
            placeholder="To"
            className="dropdown"
          />
        </div>

        
        <div className="search-field">
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            placeholderText="Select check-in date"
            dateFormat="MMMM d, yyyy"
            className="datepicker"
          />
        </div>

        
        <div className="search-field">
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            placeholderText="Select check-out date"
            dateFormat="MMMM d, yyyy"
            className="datepicker"
          />
        </div>

        
        <div className="search-field">
          <select
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            className="passenger-selector"
          >
            <option value={1}>1 Passenger</option>
            <option value={2}>2 Passengers</option>
            <option value={3}>3 Passengers</option>
            <option value={4}>4 Passengers</option>
            <option value={5}>5 Passengers</option>
            <option value={6}>6 Passengers</option>
          </select>
        </div>

        
        <button className="search-button" onClick={handleSearch}>
          Search Flights
        </button>
      </div>
    </div>
  );
};
export default Results;