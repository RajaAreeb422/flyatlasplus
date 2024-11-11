import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Popover,
  Typography,
  FormControl,
  Stack,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Flight } from '@mui/icons-material';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};



const StaySearch = () => {
  const [destination, setToDestination] = useState(""); // for destination
  const [from, setToFrom] = useState(""); // for from
  
  const [trip, setTrip] = React.useState('One-Way');
  const [category, setCategory] = React.useState('Economy');

  const [searchData, setSearchData] = useState([]);
  const [fromData, setSearchFromData] = useState([]);
  const [destId, setDestId] = useState(null); // Store dest_id
  const [destType, setDestType] = useState(null); // Store dest_type
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]); // Now an array
  const [rooms, setRooms] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const debouncedDestination = useDebounce(destination, 500);
  const debouncedFrom = useDebounce(from, 500);
  

  const handleChangeTrip = (event) => {
    setTrip(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };


  useEffect(() => {

    debugger;
    const handleDestinationSearch = async () => {
      if (!debouncedDestination ) {
        setSearchData([]);
        return;
      }

      

      setLoading(true);

         
        let   url ="https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query="
         
    
    
       try {
        

        
        const response = await axios.get(url + debouncedDestination
          ,
          {
           
            headers: {
              'x-rapidapi-ua': 'RapidAPI-Playground',  // Replace with your actual value
              'x-rapidapi-key': '3dc42e8945msh78eeff0020f2fbep1b86aejsnbc7327f142ab', // Replace with your actual RapidAPI key
              'x-rapidapi-host': 'booking-com15.p.rapidapi.com', // Replace with the actual API host if different
      
            },
          }
        );
        debugger;

            setSearchData(response.data.data);
        
         
        
      } catch (error) {
        
            console.error("Error fetching destination data:", error);
             setSearchData([]);

        
            

              } finally {
        setLoading(false);
      }
    };
   
    const handleFromSearch = async () => {

      if (!debouncedFrom) {
        setSearchFromData([]);
        return;
      }

      setLoading(true);

         
       let    url ="https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=" 

       try {
        

        
        const response = await axios.get(url+debouncedFrom
          ,
          {
           
            headers: {
              'x-rapidapi-ua': 'RapidAPI-Playground',  // Replace with your actual value
              'x-rapidapi-key': '3dc42e8945msh78eeff0020f2fbep1b86aejsnbc7327f142ab', // Replace with your actual RapidAPI key
              'x-rapidapi-host': 'booking-com15.p.rapidapi.com', // Replace with the actual API host if different
      
            },
          }
        );
        debugger;

        
            setSearchFromData(response.data.data);
        
        
      } catch (error) {
        
        
            console.error("Error fetching From data:", error);
            setSearchFromData([]);
    
        

              } finally {
        setLoading(false);
      }
    };
   

    handleDestinationSearch();
    handleFromSearch()
  }, [debouncedDestination,debouncedFrom]);


  

  const handleDestinationChange = (event, value) => {
    setToDestination(value ? value.name : "");
    if (value) {
      setDestId(value.id); // Set dest_id from the selected destination
      setDestType(value.type); // Set dest_type from the selected destination
    }
  };


  const handleFromChange = (event, value) => {
    setToFrom(value ? value.name : "");
    if (value) {
      setDestId(value.id); // Set dest_id from the selected to
      setDestType(value.type); // Set dest_type from the selected to
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (!destination || !destId || !destType) {
      alert("Please select a valid destination.");
      return;
    }

    const checkinDate = formatDate(startDate);
    const checkoutDate = formatDate(endDate);
    const staticCurrency = "AED";
    const staticLocale = "en-gb";

    const params = {

      fromId:from,
      toId:destination,
      pageNo:0,
      adults:adults,
      children:'0%2C17',
      sort:'BEST',
      cabinClass:category,
      currency_code:'AED',
      departDate:startDate

      
    };

    // if (children > 0) {
    //   params.children_number = children;
    //   params.children_ages = childrenAges.join(","); // Convert array to comma-separated string
    // }

    try {
      const response = await axios.get(
        "https://booking-com.p.rapidapi.com/v2/hotels/search",
        {
          params: params,
          headers: {
            "x-rapidapi-key":
              "382abf3e9cmshee671a0454ca0abp16ae5ejsn53a4ed9ba4c8",
            "x-rapidapi-host": "booking-com.p.rapidapi.com",
          },
        }
      );

      const flights = response.data;
      console.log("response of search is", response.data);

      navigate("/results", {
        state: {
          flights: flights,
          checkin_date: checkinDate,
         // checkout_date: checkoutDate,
          locale: staticLocale,
          currency: staticCurrency,
        },
      });
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  const handleChildrenChange = (e) => {
    const numChildren = Number(e.target.value);
    setChildren(numChildren);

    if (numChildren > childrenAges.length) {
      setChildrenAges([
        ...childrenAges,
        ...Array(numChildren - childrenAges.length).fill(0),
      ]);
    } else {
      setChildrenAges(childrenAges.slice(0, numChildren));
    }
  };

  const handleChildAgeChange = (index, value) => {
    const ages = [...childrenAges];
    ages[index] = value;
    setChildrenAges(ages);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;


  
    const [selectedCountries, setSelectedCountries] = useState(null);
    const countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const countryTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.name}</div>
            </div>
        );
    };

    const panelFooterTemplate = () => {
        const length = selectedCountries ? selectedCountries.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };



  return (
    
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 2 }}
    >

 
      <Box
        display="flex"
        alignItems="center"
        sx={{
          borderRadius: "30px",
          border: "2px solid #e0a043",
          padding: "10px",
          width: "100%",
        }}
      >


<FormControl sx={{ m: 1, minWidth: 80 }} >
      <InputLabel id="demo-simple-select-error-label">Trip</InputLabel>
      <Select
      
        labelId="demo-simple-select-error-label"
        id="demo-simple-select-error-label"
        defaultValue='One Way'
        value={trip}
        label="Trip"
        onChange={handleChangeTrip}
        
      >
        <MenuItem value='ONE WAY'>One Way</MenuItem>
        <MenuItem value='RETURN'>Return</MenuItem>
        <MenuItem value='MULTI CITY'>Multi City</MenuItem>
      </Select>
    </FormControl> 
 
    
<FormControl sx={{ m: 1 , minWidth:80 }}>
      <InputLabel id="demo-simple-select-error-label">Category</InputLabel>
      <Select
        labelId="demo-simple-select-error-label"
        id="demo-simple-select-error-label"
        defaultValue='Economy'
        value={category}
        label="Category"
        onChange={handleChangeCategory}
        
      >
        <MenuItem value='ECONOMY'>Economy</MenuItem>
        <MenuItem value='PREMIUM ECONOMY'>Premium Economy</MenuItem>
        <MenuItem value='BUSINESS'>Business</MenuItem>
        <MenuItem value='FIRST'>First</MenuItem>
        <MenuItem value='MULTIPLE'>Multiple</MenuItem>
              </Select>
    </FormControl> 

            <Autocomplete
        //  multiple
        //  id="tags-outlined"
          options={fromData}
          getOptionLabel={(option) => option.name}
          loading={loading}
          sx={{ flex: 1 }}
          onInputChange={(event, value) => {
            setToFrom(value);
          }}
          onChange={handleFromChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              variant="outlined"
              // InputProps={{
              //   ...params.InputProps,
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <PlaceIcon />
              //     </InputAdornment>
                // ),
              //}}
              sx={{ flex: 1, marginRight: "10px" }}
            />
          )}
        />


<Autocomplete
          options={searchData}
        //   multiple
        //  id="tags-outlined"
          
          

           getOptionLabel={(option) => option.name}
          
           loading={loading}
          sx={{ flex: 1 }}
          onInputChange={(event, value) => {
            setToDestination(value);
          }}
          onChange={handleDestinationChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              variant="outlined"
              // InputProps={{
              //   ...params.InputProps,
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <PlaceIcon />
              //     </InputAdornment>
              //   ),
              // }}
              sx={{ flex: 1, marginLeft: "10px" }}
            />
          )}
        />

        <Box sx={{ marginLeft: "10px", flex: 1 }}>
          <FormControl variant="outlined" fullWidth>
            <DatePicker
              selected={startDate}
              placeholderText="Check In - Checkout"
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              minDate={addDays(new Date(), 1)}
              inline={false}
              customInput={
                <TextField
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: "30px", border: "none", padding: "10px" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={
                    startDate && endDate
                      ? `Check-in: ${formatDate(
                          startDate
                        )}\nCheck-out: ${formatDate(endDate)}`
                      : ""
                  }
                  readOnly
                />
              }
            />
          </FormControl>
        </Box>

        <TextField
          readOnly
          onClick={handleClick}
          label="Guests & Rooms"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, marginLeft: "10px" }}
          value={`${adults} adults · ${children} children · ${rooms} room${
            rooms > 1 ? "s" : ""
          }`}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#e0a043",
            color: "#fff",
            borderRadius: "50%",
            height: "52px",
            minWidth: "40px !important",
            marginLeft: "10px",
          }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            width: "265px",
          }}
        >
          <Typography variant="subtitle1">Passengers</Typography>
          <Box display="flex" flexDirection="column " justifyContent="space-between" sx={{ mt: 1 }} >
            <TextField
              label="Adults 18+"
              type="number"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px"}}
            />
            {/* <TextField
              label="Students over 18"
              type="number"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop:"10px" }}
            /> */}

            {/* <TextField
              label="Youths 12-17"
              type="number"
              value={children}
              onChange={handleChildrenChange}
              variant="outlined"
              sx={{ width: "auto", marginTop:"10px"}}
            /> */}

            <TextField
              label="Children 2-11"
              type="number"
              value={children}
              onChange={handleChildrenChange}
              variant="outlined"
              sx={{  marginTop: "10px",width: "auto" }}
            />
          
            {/* <TextField
              label="Toddlers in own seats"
              type="number"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            />
            <TextField
              label="Infants on lap under 12"
              type="number"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            /> */}

          </Box>

          {/* {children > 0 && (
            <Box mt={2}>
              {childrenAges.map((age, index) => (
                <TextField
                  key={index}
                  label={`Child ${index + 1} Age`}
                  type="number"
                  value={age}
                  onChange={(e) =>
                    handleChildAgeChange(index, Number(e.target.value))
                  }
                  variant="outlined"
                  sx={{
                    width: "70px",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                />
              ))}
            </Box>
          )} */}
        </Box>
      </Popover>
    </Box>




  );
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];

 

};

export default StaySearch;
