import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, TextField, Stack, IconButton } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useLocation } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const FlightSearch = () => {
  const location = useLocation();
  const [flightOffers,setFlightOffers]=useState([])
  const [departureIntervals,setDepartatureIntervals]=useState([])
  const [flightOffersAll,setFlightOffersAll]=useState([])
  const [airlines,setAirlines]=useState([])
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const { flights, checkin_date, from,destination, locale, currency } = location.state || {};
  const [sliderValues, setSliderValues] = useState([0, 0]);
  const [isFirst, setIsFirst] = useState(true);
  const [stops, setStops] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);


  useEffect(() => {

    let list=[]
    if(isFirst){
     
      setAirlines(flights.aggregation.airlines)
      setStops(flights.aggregation.stops)
      setDepartatureIntervals(flights.aggregation.departureIntervals)
      let dList=[timeToMinutes(flights.aggregation.departureIntervals[0].start),
      timeToMinutes(flights.aggregation.departureIntervals[0].end)];
      setSliderValues(dList)
      setIsFirst(false)
      flights.flightOffers.map((offer) => {
        const segments = offer.segments;
        if (segments.length === 0) return offer; // No segments available
  
        const legs = segments[0].legs; 
        
        let timeDifference = calculateTimeDifference(segments[0].departureTime, segments[0].arrivalTime);// Assuming we only care about the first segment
        segments[0].departureTime=formatDateTime(segments[0].departureTime) 
        segments[0].arrivalTime=formatDateTime(segments[0].arrivalTime) 
  
        let airlineLogo, airlineName, travellingStops;
  
        if (legs.length === 1) {
            // If there's only one leg, use the first leg's airline data
            airlineLogo = legs[0].carriersData[0].logo;
            airlineName = legs[0].carriersData[0].name;
        } else if (legs.length > 1) {
          
            let codes=[];
           legs.map((leg,i) =>{
            
                leg.carriers.map(carr=>{
                  codes.push(carr)
                  if(i!=0){
                    if(!airlineName.includes(leg.carriersData[0].name))
                    airlineName=airlineName + ", " + leg.carriersData[0].name
                    if(i!=legs.length-1)
                    travellingStops=travellingStops + ", " + leg.arrivalAirport.code
                  }
                  else{
                    airlineName=leg.carriersData[0].name
                    travellingStops=leg.arrivalAirport.code
                  }
                })
              
              
            })
  
            const carrierCodes =  codes; 
            const allSame = carrierCodes.every(code => code === carrierCodes[0]);
  
            if (!allSame) {
                // If the carrier codes are not the same, use your own logo and name
                airlineLogo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyLK6wTU3KGqKoRV3jSilpa0_Phy_sguc5sg&s'
                airlineName = airlineName; // Replace with your custom airline name
            } else {
                // If they are the same, use the first leg's airline data
                airlineLogo = legs[0].carriersData[0].logo;
                airlineName = legs[0].carriersData[0].name;
            }
        }
  
        offer.airlineLogo=airlineLogo;
        offer.airlineName=airlineName;
        offer.travellingStops=travellingStops
        offer.timeDifference=timeDifference
        list.push(offer)
      }
  
  
  
    
    )
  
      setFlightOffers(list)
      setFlightOffersAll(list)
   


    }
    filterOffers()
  },[selectedAirlines,sliderValues,selectedStops]);

  const [selectedSort, setSelectedSort] = useState('Best');
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Dummy data for 6 airlines
  // const airlines = [
  //   { id: 1,departureTime: '8:00', arrivalTime: '12:00',name: 'Emirates', price: 200, from: 'Los Angeles', to: 'New York', duration: 6, description: 'Non-stop flight to New York', rating: 4.5, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 2, name: 'Rayyan ',departureTime: '8:00', arrivalTime: '12:00', price: 150, from: 'San Francisco', to: 'Chicago', duration: 5, description: 'Comfortable seating with extra legroom', rating: 4.0, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 3, name: 'British Airlines',departureTime: '8:00', arrivalTime: '12:00', price: 120, from: 'Boston', to: 'Miami', duration: 3.5, description: 'Economy class with snacks included', rating: 3.8, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 4, name: 'PIA',departureTime: '8:00', arrivalTime: '12:00', price: 250, from: 'Houston', to: 'Los Angeles', duration: 4, description: 'First class service, fully equipped', rating: 5.0, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 5, name: 'Qatar Airways',departureTime: '8:00', arrivalTime: '12:00', price: 180, from: 'Dallas', to: 'Chicago', duration: 2.5, description: 'Special offers on group bookings', rating: 4.2, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 6, name: 'Air CHina',departureTime: '8:00', arrivalTime: '12:00', price: 220, from: 'Miami', to: 'New York', duration: 3, description: 'Business class with complimentary meals', rating: 4.8, imageUrl: 'https://via.placeholder.com/150' }
  // ];

  function formatDateTime(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const date = new Date(dateString);
    
    // Format the date
    const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
    
    return formattedDate;
}


const handleCheckboxChange = (airlineName) => {
  let list=[]
  setSelectedAirlines((prevSelected) => {
      if (prevSelected.includes(airlineName)) {
        list=prevSelected.filter(name => name !== airlineName);
        return prevSelected.filter(name => name !== airlineName)
      } else {
        list= [...prevSelected, airlineName]
          return [...prevSelected, airlineName];
      }
  });
  




}
  

  const handleStopsCheckboxChange = (stopsNo) => {
  //  let list=[]
    setSelectedStops((prevSelected) => {
        if (prevSelected.includes(stopsNo)) {
       
          return prevSelected.filter(name => name !== stopsNo)
        } else {
         // list= [...prevSelected, stopsNo]
            return [...prevSelected, stopsNo];
        }
    });
    





};




function calculateTimeDifference(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    
    // Calculate the difference in milliseconds
    const differenceInMs = endDate - startDate;
    
    // Convert milliseconds to hours and minutes
    const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes; // Convert to total minutes
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const handleSliderChange = (event, newValue) => {
  console.log(newValue)
  //newValue=timeToMinutes(newValue)
  setSliderValues(newValue); 
  // const [start, end] = newValue.map(minutesToTime);
  // const filtered = flightOffersAll.filter(offer => {
  //     const departureTime = new Date(offer.segments[0].departureTime).toISOString().substr(11, 5);
  //     return departureTime >= start && departureTime <= end;
  // });
  // //console.log(filtered)
  // setFlightOffers(filtered);
};

const filterOffers = () => {
  const [start, end] = sliderValues;
  const filtered = flightOffersAll.filter(offer => {
      const departureTime = new Date(offer.segments[0].departureTime).toISOString().substr(11, 5);
      const isTimeInRange = departureTime >= minutesToTime(start) && departureTime <= minutesToTime(end);
      const isAirlineSelected = selectedAirlines.length === 0 || offer.segments.some(segment => 
          segment.legs.some(leg => selectedAirlines.includes(leg.carriersData[0].code))
      );

      const numberOfStops = offer.segments[0].legs.length - 1; // Legs length - 1 gives the number of stops
            const isStopsSelected = selectedStops.length === 0 || selectedStops.includes(numberOfStops);

      return isTimeInRange && isAirlineSelected && isStopsSelected;
      
  });

  setFlightOffers(filtered);
};




  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%',   width: '80%', marginLeft: '10%',  marginRight: '10%',marginTop: '2%',  }}>
      {/* Left Column - Filters */}
      <Box sx={{ marginTop:'20px', flex: 1, padding: '20px', width: '16%', border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                cursor: 'pointer', marginBottom : '20px'}}>
        {/* <Typography variant="h6" gutterBottom>Filter by</Typography> */}

        {/* Price Range Filter */}
        <Box sx={{marginBottom:'10px' ,borderBottomColor: 'black' , borderBottom: '1px solid black', }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', color: 'black',fontWeight: 'bold'  }}>Stops</Typography>
        
        {/* <TextField label="Min Price" variant="outlined" fullWidth sx={{ marginBottom: '10px' }} />
        <TextField sx ={{marginBottom : '10px'}} label="Max Price" variant="outlined" fullWidth />
         */}
        
        <FormGroup>
          {stops.length>0 &&
            stops.map((st,i)=>(
              <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>
              <FormControlLabel control={
                <Checkbox
                checked={selectedStops.includes(st.numberOfStops)} 
                onChange={() => handleStopsCheckboxChange(st.numberOfStops)} 
                 />
              } 
              label={st.numberOfStops==0?'Direct':st.numberOfStops+" "+ "Stops"}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }} /> 
              <Typography variant="body2" color="black"  >{st.minPrice.units}$</Typography>
            </Box>
            ))

          }
       
       
        {/* <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>
          <FormControlLabel control={<Checkbox />} label="1 Stop" 
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}/> 
          <Typography variant="body2" color="black"  >400$</Typography>
        </Box>
       
        <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>
          <FormControlLabel control={<Checkbox />} label="2+ Stops" 
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}/> 
          <Typography variant="body2" color="black"  >500$</Typography>
        </Box> */}
       
       
        </FormGroup>

        </Box>

        <Box sx={{marginBottom:'15px' ,borderBottomColor: 'black' , borderBottom: '1px solid black',}}>
     
        
       
        
        <Typography  sx={{ marginTop: '20px', marginBottom: '10px', fontSize : '20px', fontWeight: 'bold' }}>Flight Times</Typography>
        
        {/* <Box>
        <Box sx={{ display:'flex', marginTop: '20px', marginBottom: '5px', alignItems : 'center' }}>
        <Typography sx ={{fontSize : '16px ', fontWeight : 'bold',  marginRight: '5px'}} >Take-off</Typography>
        <Typography variant="body2" > Munich(MUC)</Typography>
        </Box>  

         <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>

        <Typography variant="body2" sx={{  }}>Thu 8:00 AM</Typography>
        <Typography variant="body2" sx={{  }}>Fri 6:00 AM</Typography>
      
        </Box>
        
        

        <Box sx={{ width: 'auto', marginTop: '15px',  marginLeft : '10px', marginRight : '10px' }}>
        <Slider
    getAriaLabel={() => 'Price range'}
    valueLabelDisplay="auto"
    valueLabelFormat={(value) => `${value}`}  // Optionally format the value
    min={500}  // Set the minimum value
    max={1000}  // Set the maximum value
    defaultValue={[500, 1000]}  // Set the default range (e.g., from 20 to 80)
    sx={{
      color: 'black',  // Change the color of the slider to black
      '& .MuiSlider-thumb': {
        backgroundColor: 'white',  // Set the color of the thumb (the slider knob)
        borderRadius: '0px ',
        border: '2px solid black'

      },
      '& .MuiSlider-rail': {
        backgroundColor: 'gray',  // Set the color of the rail (the line behind the slider)
      },
      '& .MuiSlider-track': {
        backgroundColor: 'black',  // Set the color of the track (the portion filled by the slider)
      },
    }}
  />

</Box>

        </Box>
  
        
        <Box>
        
        
        <Box sx={{ display:'flex', marginTop: '20px', marginBottom: '5px', alignItems : 'center' }}>
        <Typography sx ={{fontSize : '16px ', fontWeight : 'bold',  marginRight: '5px'}} >Landing</Typography>
        <Typography variant="body2" > Berlin (BER)</Typography>
        </Box>  

        
        <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>

        <Typography variant="body2" sx={{  }}>Thu 10:00 AM</Typography>
        <Typography variant="body2" sx={{  }}>Fri 09:00 PM</Typography>
      
        </Box>
         */}
        

        {/* <Box sx={{ width: 'auto', marginTop: '15px',  marginLeft : '10px', marginRight : '10px' }}>
        <Slider
    getAriaLabel={() => 'Price range'}
    valueLabelDisplay="auto"
    valueLabelFormat={(value) => `${value}`}  // Optionally format the value
    min={500}  // Set the minimum value
    max={1000}  // Set the maximum value
    defaultValue={[500, 1000]}  // Set the default range (e.g., from 20 to 80)
    sx={{
      color: 'black',  // Change the color of the slider to black
      '& .MuiSlider-thumb': {
        backgroundColor: 'white',  // Set the color of the thumb (the slider knob)
        borderRadius: '0px ',
        border: '2px solid black'

      },
      '& .MuiSlider-rail': {
        backgroundColor: 'gray',  // Set the color of the rail (the line behind the slider)
      },
      '& .MuiSlider-track': {
        backgroundColor: 'black',  // Set the color of the track (the portion filled by the slider)
      },
    }}
  />

</Box> */}

        
  
        <Box>
        {/* <Typography variant="h6" sx={{ marginTop: '20px', marginBottom: '5px' }}>Take-off Berlin(BER)</Typography>
         */}
        <Box sx={{ display:'flex', marginTop: '20px', marginBottom: '5px', alignItems : 'center' }}>
        <Typography sx ={{fontSize : '16px ', fontWeight : 'bold',  marginRight: '5px'}} >Take-off</Typography>
        <Typography variant="body2" > {from}</Typography>
        </Box>  

        
       {departureIntervals.length>0 &&
         departureIntervals.map((dp)=>(
          <>
<Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>

<Typography variant="body2" sx={{  }}>{minutesToTime(sliderValues[0])}</Typography>
<Typography variant="body2" sx={{  }}>{minutesToTime(sliderValues[1])}</Typography>

</Box>

<Box sx={{ width: 'auto', marginTop: '15px',  marginLeft : '10px', marginRight : '10px' }}>
<Slider
getAriaLabel={() => 'Departure time range'}
valueLabelDisplay="auto"
valueLabelFormat={(value) => `${value}`}  // Optionally format the value
min={timeToMinutes(dp.start)}  // Set the minimum value
max={timeToMinutes(dp.end)}
value={sliderValues}  
defaultValue={[timeToMinutes(dp.start), timeToMinutes(dp.end)]} 
onChange={handleSliderChange} // Set the default range (e.g., from 20 to 80)
sx={{
color: 'black',  // Change the color of the slider to black
'& .MuiSlider-thumb': {
backgroundColor: 'white',  // Set the color of the thumb (the slider knob)
borderRadius: '0px ',
border: '2px solid black'

},
'& .MuiSlider-rail': {
backgroundColor: 'gray',  // Set the color of the rail (the line behind the slider)
},
'& .MuiSlider-track': {
backgroundColor: 'black',  // Set the color of the track (the portion filled by the slider)
},
}}
/>

</Box>
</>
         ))

       } 
        
        
      

 

        </Box>
  




                
        {/* <Box>
       
        <Box sx={{ display:'flex', marginTop: '20px', marginBottom: '5px', alignItems : 'center' }}>
        <Typography sx ={{fontSize : '16px ', fontWeight : 'bold',  marginRight: '5px'}} >Landing</Typography>
        <Typography variant="body2" > Munich(MUC)</Typography>
        </Box>  

        
        <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>

        <Typography variant="body2" sx={{  }}>Sun 8:00 AM</Typography>
        <Typography variant="body2" sx={{  }}>Sun 6:00 AM</Typography>
      
        </Box>
        
        

        <Box sx={{ width: 'auto', marginTop: '15px', marginLeft : '10px', marginRight : '10px' }}>
        <Slider
    getAriaLabel={() => 'Price range'}
    valueLabelDisplay="auto"
    valueLabelFormat={(value) => `${value}`}  // Optionally format the value
    min={500}  // Set the minimum value
    max={1000}  // Set the maximum value
    defaultValue={[500, 1000]}  // Set the default range (e.g., from 20 to 80)
    sx={{
      color: 'black',  // Change the color of the slider to black
      '& .MuiSlider-thumb': {
        backgroundColor: 'white',  // Set the color of the thumb (the slider knob)
        borderRadius: '0px ',
        border: '2px solid black'

      },
      '& .MuiSlider-rail': {
        backgroundColor: 'gray',  // Set the color of the rail (the line behind the slider)
      },
      '& .MuiSlider-track': {
        backgroundColor: 'black',  // Set the color of the track (the portion filled by the slider)
      },
    }}
  />

</Box>

        </Box> */}
        </Box>

        <Box sx={{marginBottom:'25px' ,borderBottomColor: 'black' , borderBottom: '1px solid black', }}>

        <Typography variant="h5" sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>Airlines</Typography>
        <Typography variant="body2" sx={{ marginTop: '10px', color: 'black' }}>Select All Airlines</Typography>
        {/* <TextField label="Min Price" variant="outlined" fullWidth sx={{ marginBottom: '10px' }} />
        <TextField sx ={{marginBottom : '10px'}} label="Max Price" variant="outlined" fullWidth />
         */}
        
        <FormGroup>
          {airlines.length>0 &&
            airlines.map((airline)=>(
             <Box sx={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center'}}>
          <FormControlLabel control={
          <Checkbox 
          checked={selectedAirlines.includes(airline.iataCode)} 
          onChange={() => handleCheckboxChange(airline.iataCode)} 
      />
          }
          label={airline.name}
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }} /> 
          <Typography variant="body2" color="black"  >${airline.minPrice.units}</Typography>
        </Box>
            ))

          }
        
      

        </FormGroup>
   
       </Box>

    
      
      </Box>

      {/* Right Column - Search Results */}
      <Box sx={{ flex: 4, padding: '20px'  }}>
        {/* Sorting Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px',marginRight:'10px', border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', }}>
          <Button
            variant={selectedSort === 'Cheapest' ? 'contained' : 'outlined'}
            onClick={() => handleSortChange('Cheapest')}
            sx={{ flex: 1, padding:'20px', color: 'black', backgroundColor: selectedSort=='Cheapest' ? '#e0a043' : 'transparent',
             '&.MuiButton-contained': {
            color: 'white', // Explicitly set text color for 'contained' variant
           // borderColor : 'black',
            fontSize : '20px'
    },
    '&.MuiButton-outlined': {
      border: 'none',
      color: 'black',
      //borderRightColor: '#e0a043', // Set the border color for 'outlined' variant 
      fontSize : '20px'
    },


             }}
          >
            Cheapest
          </Button>


          <Button
            variant={selectedSort === 'Best' ? 'contained' : 'outlined'}
            onClick={() => handleSortChange('Best')}
            sx={{ flex: 1, borderColor: 'black', color: 'black', backgroundColor:  selectedSort === 'Best' ?  '#e0a043' : 'transparent',
              '&.MuiButton-contained': {
                color: 'white', // Explicitly set text color for 'contained' variant
              //  borderRight: '2px solid ', // Set the border color for 'outlined' variant 
          //borderLeft: '2px solid ',
          borderRadius: '0px',
          fontSize : '20px'
        
        },
        '&.MuiButton-outlined': {
          border: 'none',
          color: 'black',
          borderRight: '2px solid ', // Set the border color for 'outlined' variant 
          borderLeft: '2px solid ',
          borderRadius : '0px',
          fontSize : '20px'        
        },



             }}
          >
            Best
          </Button>
          <Button
            variant={selectedSort === 'Quickest' ? 'contained' : 'outlined'}
            onClick={() => handleSortChange('Quickest')}
            sx={{ flex: 1, color: 'black', backgroundColor: selectedSort === 'Quickest' ? '#e0a043' : 'transparent',

              '&.MuiButton-contained': {
                color: 'white', // Explicitly set text color for 'contained' variant
                fontSize : '20px'
        },
        '&.MuiButton-outlined': {
          border: 'none',
          color: 'black',
          borderRightColor: 'secondary', // Set the border color for 'outlined' variant 
          fontSize : '20px'
        },
             }}
          >
            Quickest
          </Button>
        </Box>

        {/* Search Results Grid */}
        <Stack spacing={2}
        
        sx={{marginRight:'10px'}}
        >
          {flightOffers.map((item,i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '15px',
                border: '1px solid #ddd',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
                marginLeft: '15px',
                marginRight:'10px'
              }}
            >
              {/* Airline Image and Name */}
              <Box sx={{ textAlign: 'center', marginRight: '15px' }}>
                <img
                  src={item.airlineLogo}
                  alt={item.airlineName}
                  width="70px"
                  height="70px"
                  style={{ borderRadius: '50%', borderColor:'black', border: '1px solid' }}
                />
               
              </Box>

              {/* Flight Details */}
              <Box sx={{ flex: 1}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingLeft :'20px' }}>
                  
                    <Typography variant="body2" color="black"  >{from}</Typography>
                      {/* <FlightTakeoffIcon sx={{ margin: '0 5px' }} /> */}
                       <Typography variant="body2" color="black">{destination}</Typography>
                  
                {/* </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}> */}
                  <Typography variant="body2" color="black">{item.segments[0].departureTime}</Typography>
                </Box>

                {/* Horizontal Line */}
                <hr style={{ margin: '10px 0', border: '1px solid black', color:'black' }} />

                 <Box sx={{ display: 'flex',  justifyContent: 'space-between', marginBottom: '10px', paddingLeft :'20px', }}>
                  
                    <Typography variant="body2" color="black"  >{item.timeDifference}</Typography>
                      {/* <FlightTakeoffIcon sx={{ margin: '0 5px' }} /> */}
                       <Typography variant="body2" color="black">{item.segments[0].arrivalTime}</Typography>
                  
                </Box>
                
                {/* Description */}
                <Typography variant="body2" color="black" sx={{ marginBottom: '10px', textAlign: 'center' }}>
                  {item.travellingStops}
                </Typography>

                <Box sx={{ textAlign: 'center' }}>

                <Typography variant="body2" color="textSecondary" sx={{font:'8px !important', marginTop: '10px', color:'black' }}>
                  <small>{item.airlineName}</small>
                </Typography>
                  <Typography variant="h6" color="black" sx={{ marginBottom: '10px' }}>
                    $500 per ticket
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary">
                    Rating: {airline.rating} stars
                  </Typography> */}
                </Box>
              </Box>

              {/* Seat Recline Button */}
              
              <Box  sx={{padding: '15px'}}>
                <Button
            variant={selectedSort === 'Cheapest' ? 'contained' : 'outlined'  }
            onClick={() => handleSortChange('Cheapest')}
            sx={{ justifyContent: 'center', alignItems: 'center',  borderColor :'black', color: 'black', margin: '15px', flex: 1, backgroundColor: selectedSort === 'Cheapest' ? 'white' : 'transparent' }}
          
             >
            View Deal
          </Button>
           
           

                </Box>

                
              {/* <IconButton color="primary" sx={{ marginLeft: '15px' }}>
                <AirlineSeatReclineNormalIcon />
              </IconButton> */}
            </Box>
          


          ))}
        </Stack>
      </Box>
      
    </Box>
  );
};

export default FlightSearch;












// import React, { useState } from 'react';
// import { Box, Grid, Button, Typography, TextField, Stack, IconButton } from '@mui/material';
// import Slider from '@mui/material/Slider';
// import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import FlightLandIcon from '@mui/icons-material/FlightLand';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

// const FlightSearch = () => {
//   const [selectedSort, setSelectedSort] = useState('Cheapest');
//   const handleSortChange = (sortOption) => {
//     setSelectedSort(sortOption);
//   };

//   // Dummy data for 6 airlines
//   const airlines = [
//     { id: 1, name: 'Emirates', price: 200, from: 'Los Angeles', to: 'New York', duration: 6, description: 'Non-stop flight to New York', rating: 4.5, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 2, name: 'Rayyan ', price: 150, from: 'San Francisco', to: 'Chicago', duration: 5, description: 'Comfortable seating with extra legroom', rating: 4.0, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 3, name: 'British Airlines', price: 120, from: 'Boston', to: 'Miami', duration: 3.5, description: 'Economy class with snacks included', rating: 3.8, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 4, name: 'PIA', price: 250, from: 'Houston', to: 'Los Angeles', duration: 4, description: 'First class service, fully equipped', rating: 5.0, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 5, name: 'Qatar Airways', price: 180, from: 'Dallas', to: 'Chicago', duration: 2.5, description: 'Special offers on group bookings', rating: 4.2, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 6, name: 'Air CHina', price: 220, from: 'Miami', to: 'New York', duration: 3, description: 'Business class with complimentary meals', rating: 4.8, imageUrl: 'https://via.placeholder.com/150' }
//   ];

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
//       {/* Left Column - Filters */}
//       <Box sx={{ flex: 1, padding: '20px', width: '20%', borderRight: '1px solid #ddd' }}>
//         <Typography variant="h6" gutterBottom>Filter by</Typography>

//         {/* Price Range Filter */}
//         <Typography variant="body1" sx={{ marginBottom: '10px' }}>Price Range</Typography>
//         <TextField label="Min Price" variant="outlined" fullWidth sx={{ marginBottom: '10px' }} />
//         <TextField label="Max Price" variant="outlined" fullWidth />

//         {/* Star Rating Filter */}
//         <Typography variant="body1" sx={{ marginTop: '20px', marginBottom: '10px' }}>Star Rating</Typography>
//         <Box>
//           {[1, 2, 3, 4, 5].map((rating) => (
//             <Button variant="outlined" sx={{ marginRight: '10px' }} key={rating}>
//               {rating} Stars
//             </Button>
//           ))}
//         </Box>
//         <Box sx={{ width: 250 }}>

//         <Slider
//          getAriaLabel={() => 'Temperature range'}
//          //value={value}
//          //onChange={handleChange}
//           valueLabelDisplay="auto"
//          //getAriaValueText={valuetext}
// />

//         </Box>
       
//         <Slider valueLabelDisplay="auto" sx={{ marginTop: '20px' }} />
//       </Box>

//       {/* Right Column - Search Results */}
//       <Box sx={{ flex: 4, padding: '20px' }}>
//         {/* Sorting Row */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//           <Button
//             variant={selectedSort === 'Cheapest' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Cheapest')}
//             sx={{ flex: 1, backgroundColor: selectedSort === 'Cheapest' ? '#e0a043' : 'transparent' }}
//           >
//             Cheapest
//           </Button>
//           <Button
//             variant={selectedSort === 'Best' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Best')}
//             sx={{ flex: 1, backgroundColor: selectedSort === 'Best' ? '#e0a043' : 'transparent' }}
//           >
//             Best
//           </Button>
//           <Button
//             variant={selectedSort === 'Quickest' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Quickest')}
//             sx={{ flex: 1, backgroundColor: selectedSort === 'Quickest' ? '#e0a043' : 'transparent' }}
//           >
//             Quickest
//           </Button>
//         </Box>

//         {/* Search Results Grid */}
//         <Stack spacing={2}>
//           {airlines.map((airline) => (
//             <Box
//               key={airline.id}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: '',
//                 padding: '15px',
//                 border: '1px solid #ddd',
//                 borderRadius: '8px',
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 cursor: 'pointer',
//                 transition: 'transform 0.3s ease',
//                 '&:hover': { transform: 'scale(1.05)' },
//                 marginLeft:'15px',
//               }}
//             >
//               <img
//                 src={airline.imageUrl}
//                 alt={airline.name}
//                 width="50px"
//                 height="50px"
//                 style={{ borderRadius: '100%', marginRight: '15px', borderColor:'black' }}
//               />
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="h6">{airline.name}</Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <FlightTakeoffIcon sx={{ marginRight: '5px' }} />
//                   <Typography variant="body2" color="textSecondary">{airline.from}</Typography>
//                   <Typography variant="body2" sx={{ margin: '0 5px' }}>→</Typography>
//                   <FlightLandIcon sx={{ marginRight: '5px' }} />
//                   <Typography variant="body2" color="textSecondary">{airline.to}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <AccessTimeIcon sx={{ marginRight: '5px' }} />
//                   <Typography variant="body2" color="textSecondary">{airline.duration} hours</Typography>
//                 </Box>
//                 <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '10px' }}>
//                   {airline.description}
//                 </Typography>
//                 <Typography variant="h6" color="primary" sx={{ marginBottom: '10px' }}>
//                   ${airline.price} per ticket
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Rating: {airline.rating} stars
//                 </Typography>
//               </Box>
//               <IconButton color="primary" sx={{ marginLeft: '15px' }}>
//                 <AirlineSeatReclineNormalIcon />
//               </IconButton>
//             </Box>
//           ))}
//         </Stack>
//       </Box>
//     </Box>
//   );
// };

// export default FlightSearch;











// import React, { useState } from 'react';
// import { Box, Grid, Button, Typography, TextField, Stack } from '@mui/material';
// import Slider from '@mui/material/Slider';

// const FlightSearch = () => {

  
  

//   const [selectedSort, setSelectedSort] = useState('Cheapest');

//   const handleSortChange = (sortOption) => {
//     setSelectedSort(sortOption);
//   };

//   // Dummy data for 6 airlines
//   const airlines = [
//     { id: 1, name: 'Airline A', price: 200, description: 'Non-stop flight to New York', rating: 4.5, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 2, name: 'Airline B', price: 150, description: 'Comfortable seating with extra legroom', rating: 4.0, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 3, name: 'Airline C', price: 120, description: 'Economy class with snacks included', rating: 3.8, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 4, name: 'Airline D', price: 250, description: 'First class service, fully equipped', rating: 5.0, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 5, name: 'Airline E', price: 180, description: 'Special offers on group bookings', rating: 4.2, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 6, name: 'Airline F', price: 220, description: 'Business class with complimentary meals', rating: 4.8, imageUrl: 'https://via.placeholder.com/150' }
//   ];

//   return (
//     <Box sx={{ display: 'flex', 
      
//        flexDirection: 'row', height: '100vh' }}>
//       {/* Left Column - Filters */}
//       <Box sx={{ flex: 1, padding: '20px',  width : '20%' }}> { /*put border for div*/ }
//         <Typography variant="h6" gutterBottom>
//           Filter by
//         </Typography>

//         {/* Price Range Filter */}
//         <Typography variant="body1" sx={{ marginBottom: '10px' }}>
//           Price Range
//         </Typography>
//         <TextField
//           label="Min Price"
//           variant="outlined"
//           fullWidth
//           sx={{ marginBottom: '10px' }}
//         />
//         <TextField
//           label="Max Price"
//           variant="outlined"
//           fullWidth
//         />

//         {/* Star Rating Filter */}
//         <Typography variant="body1" sx={{ marginTop: '20px', marginBottom: '10px' }}>
//           Star Rating
//         </Typography>
//         <Box>
//           {[1, 2, 3, 4, 5].map((rating) => (
//             <Button variant="outlined" sx={{ marginRight: '10px' }} key={rating}>
//               {rating} Stars
//             </Button>
//           ))}
//         </Box>
        
        
        
//         <Box sx={{  }}>
      
      
//       <Slider
//         getAriaLabel={() => 'Minimum distance'}
//         //value={value1}
//         //onChange={handleChange1}
//         valueLabelDisplay="auto"
//         //getAriaValueText={valuetext}
//         disableSwap
//       />
//       <Slider
//         getAriaLabel={() => 'Minimum distance shift'}
//         //value={value2}
//         //onChange={handleChange2}
//         valueLabelDisplay="auto"
//         //getAriaValueText={valuetext}
//         disableSwap
//       />
//     </Box>



//       </Box>

//       {/* Right Column - Search Results */}
//       <Box sx={{ flex: 4, padding: '20px' }}>
//         {/* Sorting Row */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', height:'50px' }}>
//           <Button
//             variant={selectedSort === 'Cheapest' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Cheapest')}
//             sx={{ flex: 1,color: 'black' , borderColor : '#e0a043',
//               backgroundColor: selectedSort === 'Cheapest' ? '#e0a043' : 'transparent',
//               color: selectedSort === 'Cheapest' ? 'white' : 'inherit',
//               '&:hover': {
//                 backgroundColor: selectedSort === 'Cheapest' ? '#c1892b' : '#f4f4f4', }, }}
//           >
//             Cheapest
//           </Button>
//           <Button
//             variant={selectedSort === 'Best' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Best')}
//             sx={{ flex: 1,color: 'black', borderColor : '#e0a043',
//               backgroundColor: selectedSort === 'Best' ? '#e0a043' : 'transparent',
//               color: selectedSort === 'Best' ? 'white' : 'inherit',
//               '&:hover': {
//                 backgroundColor: selectedSort === 'Best' ? '#c1892b' : '#f4f4f4',
//               },
//              }}
//           >
//             Best
//           </Button>
//           <Button
//             variant={selectedSort === 'Quickest' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Quickest')}
//             sx={{ flex: 1, color: 'black', borderColor : '#e0a043',
//               backgroundColor: selectedSort === 'Quickest' ? '#e0a043' : 'transparent',
//               color: selectedSort === 'Quickest' ? 'white' : 'inherit',
//               '&:hover': {
//                 backgroundColor: selectedSort === 'Quickest' ? '#c1892b' : '#f4f4f4',
//               },
//              }}
//           >
//             Quickest
//           </Button>
//           {/* <Button
//             variant={selectedSort === 'Rating' ? 'contained' : 'outlined'}
//             onClick={() => handleSortChange('Rating')}
//             sx={{ flex: 1 }}
//           >
//             Rating
//           </Button> */}
//         </Box>

//         {/* Search Results Grid */}
//         <Stack spacing={2}>
//           {airlines.map((airline) => (
//             <Box
//               key={airline.id}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 padding: '15px',
//                 border: '1px solid #ddd',
//                 borderRadius: '8px',
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 cursor: 'pointer',
//                 transition: 'transform 0.3s ease',
//                 '&:hover': {
//                   transform: 'scale(1.05)',
//                 },
//               }}
//             >
//               <img
//                 src={airline.imageUrl}
//                 alt={airline.name}
//                 width="150px"
//                 style={{
//                   borderRadius: '8px',
//                   marginRight: '15px',
//                 }}
//               />
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="h6">{airline.name}</Typography>
//                 <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '10px' }}>
//                   {airline.description}
//                 </Typography>
//                 <Typography variant="h6" color="primary" sx={{ marginBottom: '10px' }}>
//                   ${airline.price} per ticket
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Rating: {airline.rating} stars
//                 </Typography>
//               </Box>
//             </Box>
//           ))}
//         </Stack>
//       </Box>
//     </Box>
//   );
// };

// export default FlightSearch;


// import React, { useState, useEffect } from "react";
// import './flightsearch.css';
// import PropertiesFilter from "./PropertiesFilter";
// import { useLocation } from 'react-router-dom';

// const FlightSearch = () => {
//   //const [flights, setFlights] = useState([]);

//   const location = useLocation();
  
//   // Extract data from location.state passed by the StaySearch component
//   const { flights, checkin_date,  locale, currency,from,destination } = location.state || {};

//   // Dummy flight data
//   const dummyFlights = [
//     {
//       id: 1,
//       airline: "Rayyan Airlines",
//       departure: "2024-12-01 08:30 AM",
//       arrival: "2024-12-01 10:45 AM",
//       origin: "New York (JFK)",
//       destination: "London (LHR)",
//       price: "$1200",
//       image: "https://via.placeholder.com/100x60?text=AI",
//     },
//     {
//       id: 2,
//       airline: "Qatar Airlines",
//       departure: "2024-12-02 12:15 PM",
//       arrival: "2024-12-02 02:30 PM",
//       origin: "Los Angeles (LAX)",
//       destination: "Tokyo (NRT)",
//       price: "$950",
//       image: "https://via.placeholder.com/100x60?text=DL",
//     },
//     {
//       id: 3,
//       airline: "Emirates Airlines",
//       departure: "2024-12-05 05:45 PM",
//       arrival: "2024-12-05 08:00 PM",
//       origin: "San Francisco (SFO)",
//       destination: "Paris (CDG)",
//       price: "$1450",
//       image: "https://via.placeholder.com/100x60?text=UA",
//     },
//     {
//       id: 4,
//       airline: "British Airways",
//       departure: "2024-12-10 06:00 AM",
//       arrival: "2024-12-10 08:30 AM",
//       origin: "Chicago (ORD)",
//       destination: "London (LHR)",
//       price: "$1100",
//       image: "https://via.placeholder.com/100x60?text=BA",
//     },
//   ];

//   // Automatically set flights after a brief delay (simulating loading)
//   useEffect(() => {
//     // setTimeout(() => {
//     //   flights=dummyFlights
//     //   //setFlights(dummyFlights);
//     // }, 1000); // Simulate delay (e.g., data fetching)
//   }, []);

//   return (
    
//     <div className="flight-search-container">
      
//       <h1 className="main-title">Flight Search Results</h1>

//       {flights.length === 0 ? (
//         <div className="loading-message">Loading results...</div>
//       ) : (
//         <div className="flight-results">
//           {flights.map((flight,i) => (
//             <div key={i} className="flight-card">
//               <div className="flight-card-header">
//                 <img
//                   src={flight.logoUrl}
//                   alt={flight.airline}
//                   className="airline-logo"
//                 />
//                 <h2>{flight.name}</h2>
//               </div>
//               <div className="flight-card-body">
//                 <p className="flight-route">
//                   <strong>{from}</strong> to <strong>{destination}</strong>
//                 </p>
//                 <p className="flight-time">
//                   <strong>Departure:</strong>  2024-06-12 12:00 PM
//                   <br />
//                   <strong>Arrival:</strong> 2024-05-12 08:00 PM
//                 </p>
//                 <p className="flight-price">
//                   <strong>Price:</strong> {flight.minPrice.nanos}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FlightSearch;
