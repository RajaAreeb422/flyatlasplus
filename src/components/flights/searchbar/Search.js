import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select for dropdowns
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Datepicker styles
import './search.css'; // Custom CSS
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPlane } from 'react-icons/fa';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';


const SearchBar = () => {

  const [searchTerm, setSearchTerm] = useState(''); // For the input value

  const [searchToTerm, setSearchToTerm] = useState(''); // For the "To" input field  

  const [cities, setCities] = useState([]); // For storing search results
  const [citiesTo, setCitiesTo] = useState([]); // For storing search results
  const [loading, setLoading] = useState(false); // For showing loading state
  const [error, setError] = useState(null); // For error handling
  const [destCities, setDestCities] = useState([]);


  const [fromLocation, setFromLocation] = useState(null); // Store the selected "From" location
  const [destination, setDestination] = useState(null); // Store the selected "To" location
  const [checkInDate, setCheckInDate] = useState(null); // Check-in date
  const [checkOutDate, setCheckOutDate] = useState(null);
  // const [cities, setCities] = useState([]); // Check-out date
  const [passengerCount, setPassengerCount] = useState(1); // Number of passengers
  const [trip, setTrips] = useState(null); // trips
  //const[isSearched, setSearchedState]=false;  

  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To get search parameters from location state


  // Dummy list of cities (replace this with real data when needed)
  const dummyCities = [
    { name: 'New York', image_url: 'https://via.placeholder.com/150?text=New+York', countryName: 'USA', parent: "USA" },
    { name: 'London', image_url: 'https://via.placeholder.com/150?text=London', countryName: 'UK', parent: "USA" },
    { name: 'Paris', image_url: 'https://via.placeholder.com/150?text=Paris', countryName: 'France', parent: "USA" },
    { name: 'Tokyo', image_url: 'https://via.placeholder.com/150?text=Tokyo', countryName: 'Japan', parent: "USA" },
    { name: 'Sydney', image_url: 'https://via.placeholder.com/150?text=Sydney', countryName: 'Australia', parent: "USA" },
    { name: 'Barcelona', image_url: 'https://via.placeholder.com/150?text=Barcelona', countryName: 'Spain', parent: "USA" },
    { name: 'Rome', image_url: 'https://via.placeholder.com/150?text=Rome', countryName: 'Italy' },
  ];

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if(e.target.value=='')
    {
       setCities([])  
    }

    else
    {
      getSearchedCities('from',e.target.value)
    }
       
    
  };


  const handleToInputChange = (e) => {
    setSearchToTerm(e.target.value)
    if(e.target.value=='')
      {
         setCitiesTo([])  
      }
  
      else
      {
        getSearchedCities('to',e.target.value)
      }


    
  };

  useEffect(() => {
    // If search term is empty, don't filter the cities
    // if (searchTerm.trim() === '') {
    //   setCities([]);
    //   setDestCities([]);
    //   return;
    // }
    // setLoading(true);

    setError('');

    // Simulate a delay for loading (mimicking an API request)
    // setTimeout(() => {
    //   getSearchedCities()

    //   setLoading(false);
    // }, 500);

  }, []); // Trigger the effect when searchTerm changes



  const getSearchedCities = (type,value) => {
    let url = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query="
    debugger
    if (type == 'to') {
      url = url + value

    }
    else {

      url = url + value
    }
    axios.get(url,

      { headers: getHeaders() })


      .then(res => {
        
        
        console.log(res)
        if(type=='to')
        {
          setCitiesTo(res.data.data)

        }
        else
        {
          setCities(res.data.data)

        }
        
        

      }).catch(err => console.log(err))

  }

  const getHeaders = () => {
    return {
      'x-rapidapi-ua': 'RapidAPI-Playground',  // Replace with your actual value
      'x-rapidapi-key': '3dc42e8945msh78eeff0020f2fbep1b86aejsnbc7327f142ab', // Replace with your actual RapidAPI key
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com', // Replace with the actual API host if different
      // Replace with the actual value for this header if needed
    };

  }

  const handleSearch = () => {
    setIsSearched(true);


    if (fromLocation && destination && checkInDate && trip) {
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


  // const cities = [
  //   { value: 'Islamabad', label: 'Islamabad', image: '/Assets/Images/emirates.jpg'},
  //   { value: 'Lahore', label: 'Lahore', image: '/Assets/Images/emirates.jpg' },
  //   { value: 'Karachi', label: 'Karachi', image: '/Assets/Images/emirates.jpg' },
  //   { value: 'Istanbul', label: 'Istanbul', image: '/Assets/Images/emirates.jpg' }
  // ];

  const trips = [
    { value: 'oneway', label: 'One Way' },
    { value: 'round', label: 'Round' },
    { value: 'multicity', label: 'Multi City' }
  ];


  return (
    <div className="search-bar">

      <div className="search-bar-container">

        <div className="search-field">
          <Select
            options={trips}
            value={trip}
            onChange={setTrips}
            placeholder="One-Way"
            className="dropdown"
          />
        </div>



        <div className="search-field">
          {/* Input field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="From"
          />

          {/* {loading && <p>Loading...</p>} */}


          {/* {error && <p>{error}</p>} */}

          {/* List of cities */}
          {cities && cities.length > 0 && !loading && !error && searchTerm!='' && (
            <div className="city-item">
              {cities.map((city, index) => (
                <>
                  {city.type === "CITY" ?
                    <div key={index} className="city-item1">

                      <img src={city.photoURI} />
                      {city.name} {city.regionName} {city.countryName} {city.code}

                    </div>
                    :

                    <div key={index} className="city-item1">

                      <img src={city.photoURI} />
                      {city.cityName} {city.name} {city.parent}

                    </div>
                  }
                </>
              )

              )}


            </div>
          )}

          {/* No results message */}
          {searchTerm && cities.length === 0 && !loading && !error && <p>No cities found</p>}



          {/* <input label="From"></input> */}

          {/* <InputText type="text" placeholder="From" /> */}

          {/* <Select
            options={cities}
            value={fromLocation}
            onChange={setFromLocation}
            placeholder="From"
            className="dropdown"
            
          /> */}



        </div>




        <div className="search-field">





          <input
            type="text"
            value={searchToTerm}
            onChange={handleToInputChange}
            placeholder="To"
          />

          {loading && <p>Loading...</p>}


          {error && <p>{error}</p>}
          
          {citiesTo && citiesTo.length > 0 && !loading && !error && searchToTerm!='' &&  (
            <div className="city-item">
              {citiesTo.map((city, index) => (
                <>
                  {city.type === "CITY" ?
                    <div key={index} className="city-item1">

                      <img src={city.photoURI} />
                      {city.name} {city.regionName} {city.countryName} {city.code}

                    </div>
                    :

                    <div key={index} className="city-item1">

                      <img src={city.photoURI} />
                      {city.cityName} {city.name} {city.parent}

                    </div>
                  }
                </>
              )

              )}


            </div>
          )}



          {searchToTerm && citiesTo.length === 0 && !loading && !error && <p>No cities found</p>}






          {/*          
           <Select
            options={cities}
            value={destination}
            onChange={setDestination}
            placeholder="Destination"
            className="dropdown"
          />  */}

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