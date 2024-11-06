import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select for dropdowns
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Datepicker styles
import './search.css'; // Custom CSS
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const SearchBar = () => {
  const [fromLocation, setFromLocation] = useState(null); // Store the selected "From" location
  const [destination, setDestination] = useState(null); // Store the selected "To" location
  const [checkInDate, setCheckInDate] = useState(null); // Check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // Check-out date
  const [passengerCount, setPassengerCount] = useState(1); // Number of passengers
  
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To get search parameters from location state
  
  useEffect(() => {
    if (location.state) {
      const { fromLocation, destination, checkInDate, checkOutDate  } = location.state;
      setFromLocation(fromLocation);
      setDestination(destination);
      setCheckInDate(checkInDate);
      setCheckOutDate(checkOutDate);
      
    }
  }, [location.state]);

  const handleSearch = () => {
    setIsSearched(true);
    
    
    if (fromLocation && destination && checkInDate && checkOutDate) {
      // Navigate to the results page
      navigate('/results', {
        state: {
          fromLocation: fromLocation.label,
          destination: destination.label,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  };


  const cities = [
    { value: 'Islamabad', label: 'Islamabad' },
    { value: 'Lahore', label: 'Lahore' },
    { value: 'Karachi', label: 'Karachi' },
    { value: 'Istanbul', label: 'Istanbul' }
  ];

  
  return (
    <div className="search-bar">
      <div className="search-bar-container">
        

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
            placeholder="Destination"
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

{/*         
        <div className="search-field">
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            placeholderText="Select check-out date"
            dateFormat="MMMM d, yyyy"
            className="datepicker"
          />
        </div> */}

{/*         
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
        </div> */}

        
        <button className="search-button" onClick={handleSearch}>
          Search Flights
        </button>
      </div>
    </div>
  );
};
export default SearchBar;