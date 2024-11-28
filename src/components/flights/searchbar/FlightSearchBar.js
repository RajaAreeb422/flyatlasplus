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
import { Autocomplete, styled, Chip } from "@mui/material";
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



const FlightSearchBar = ({
  startDate1,
  from1,
  destination1,
  trip1,
  category1,
  adults1,
  children1,
  infants1,
  youth1,
  handleSearchData
}) => {
  const [destination, setToDestination] = useState(""); // for destination
  const [from, setToFrom] = useState([]);
  const [fromText, setFromText] = useState(""); // for from

  const [trip, setTrip] = React.useState('One-Way');
  const [category, setCategory] = React.useState('Economy');
  const [first, setFirst] = useState(true);

  const [searchData, setSearchData] = useState([]);
  const [fromData, setSearchFromData] = useState([]);
  const [destId, setDestId] = useState(null); // Store dest_id
  const [destType, setDestType] = useState(null); // Store dest_type
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(0);
  const [youth, setYouth] = useState(0);
  const [toddlers, setToddlers] = useState(0);
  const [infants, setInfants] = useState(0);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]); // Now an array
  const [rooms, setRooms] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const debouncedDestination = useDebounce(destination, 500);
  const debouncedFrom = useDebounce(fromText, 500);


  const handleChangeTrip = (event) => {
    setTrip(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };


  useEffect(() => {

    debugger;
    const handleDestinationSearch = async () => {
      if (!debouncedDestination) {
        setSearchData([]);
        return;
      }



      setLoading(true);


      let url = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query="



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


      let url = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query="

      try {



        const response = await axios.get(url + debouncedFrom
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
   
    debugger;
    if(first){
    setToFrom(from1)
    setStartDate(startDate1)
    setToDestination(destination1)
    setAdults(adults1)
    setInfants(infants1)
    setYouth(youth1)
    setTrip(trip1)
    setCategory(category1)
    setChildren(children1)
    setFirst(false)
    }
  }, [debouncedDestination, debouncedFrom]);




  const handleDestinationChange = (event, value) => {
    setToDestination(value ? value.id : "");
    if (value) {
      setDestId(value.id); // Set dest_id from the selected destination
      setDestType(value.type); // Set dest_type from the selected destination
    }
  };


  const handleFromChange = (event, value) => {
    debugger;
    if(value.length<=3)
    {
    setToFrom(value);
    }
  };

  const handleSearch = async () => {
    if (!startDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (children === 0 && adults === 0 && toddlers === 0 && infants === 0 && youth === 0) {
      alert("Please select at least 1 Traveller.");
      return;
    }

    if (!destination || !destId || !destType) {
      alert("Please select a valid destination.");
      return;
    }
    if (from.length===0) {
      alert("Please select a valid departure location.");
      return;
    }
    debugger;
    //let date=new Date(startDate)
    const checkinDate = startDate //formatDate(date);
    //  const checkoutDate = formatDate(endDate);
    const staticCurrency = "AED";
    const staticLocale = "en-gb";


    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;  // Month is 0-indexed (0 for January, 11 for December)
    const day = startDate.getDate();

    // Format the result as "YYYY-MM-DD"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    //setStartDate(formattedDate);

    // let sDate= new Date(startDate.toDateString().split('T')[0]);
    let childs = infants + children
    let travelingFrom="";
    if(from.length>0 && from.length>1){
      from.map((item,i)=>{
        if(travelingFrom=="")
          travelingFrom=item.id
        else{
          travelingFrom=travelingFrom+item.id
        }
        if(i!=((from.length)-1))
        travelingFrom= travelingFrom+"%2C"
      })
    }else if(from.length===1){
      travelingFrom=from[0].id
    }else{
      travelingFrom=""
    }
 
    const params = {

      fromId: travelingFrom,
      toId: destination,
      pageNo: 1,
      adults: adults,
      children: `${toddlers}%${childs}${youth === 0 ? '2C17' : youth + '2C17'}`,
      sort: 'BEST',
      cabinClass: category,
      currency_code: 'AED',
      departDate: formattedDate


    };

    // if (children > 0) {
    //   params.children_number = children;
    //   params.children_ages = childrenAges.join(","); // Convert array to comma-separated string
    // }


    axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights",
      {
        params: params,
        headers: {
          'x-rapidapi-ua': 'RapidAPI-Playground',  // Replace with your actual value
          'x-rapidapi-key': '3dc42e8945msh78eeff0020f2fbep1b86aejsnbc7327f142ab', // Replace with your actual RapidAPI key
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com', // Replace with the actual API host if different

        },
      }
    ).then(response => {

      const flights = response.data.data
      console.log("response of search is", response.data.data);
      let state= {
        flights:flights,
        checkin_date: startDate,
        from: travelingFrom,
        source:from,
        destination: destination,
        trip:trip,
        category:category,
        adults:adults,
        children:children,
        infants:infants,
        youth:youth,
        // checkout_date: checkoutDate,
        locale: staticLocale,
        currency: staticCurrency,
      }
      handleSearchData(state)
      // navigate("/results", {
      //   state: {
      //     checkin_date: startDate,
      //     from: travelingFrom,
      //     source:from,
      //     destination: destination,
      //     trip:trip,
      //     category:category,
      //     adults:adults,
      //     children:children,
      //     infants:infants,
      //     youth:youth,
      //     // checkout_date: checkoutDate,
      //     locale: staticLocale,
      //     currency: staticCurrency,
      //   },
      // });
    }).catch(error => console.log("Error fetching flight data:", error))

  }

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

  const RoundedAutocomplete = styled(Autocomplete)(({ theme }) => ({
    flex: 1,
    color: "black",
    borderRadius: '50px',  // Round the outer container
    '& .MuiAutocomplete-inputRoot': {
      borderRadius: '50px',  // Round the dropdown and outer input container
    },
    '& .MuiInputBase-popover': {
      borderRadius: '50px',  // Round the actual input area
    },
  }
  ));


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

  const formatDate = (date) => {
    return date.toString().split("T")[0];



  };


  const handleDateChange = (date) => {

    // let nDate=formatDate(date)
    // setSelectedDate(new Date(date));
    setStartDate(new Date(date));
  };

  const handleInfantChange = (e) => {
    if (e.target.value < 0) {
      setInfants(0)
    } else if (e.target.value > adults) {
      setInfants(adults)
    } else {

      setInfants(Number(e.target.value))
    }

  }

  const sum = (v1, v2, v3, v4) => {
    return v1 + v2 + v3 + v4 > 0 ? v1 + v2 + v3 + v4 : 0
  }

  return (

    

    <Box
      //display="flex"
      //flexDirection={'column'}
      justifyContent="center"
      //flexWrap="wrap" 
      alignItems="center"
      sx={{
        mt: 2,
          borderRadius: "50px",
          borderBottom: "2px solid #e0a043",
          //paddingBottom: "20px",
          //padding: "10px 10px 0px 10px",
          // paddingLeft:"50px",
          marginLeft: "10%", 
          marginRight: "15%", 
          width: "80%",
          backgroundColor: "#e0a043 ",
         //backgroundColor: "black"
      }
      }
     
      

    >





      <Box
        display="flex"
        alignItems="center"
        //flexDirection="column "

        sx={{
          borderRadius: "100px",
          border: "2px solid #e0a043",
          //backgroundColor: 'black',
          // background: "#e0a043",
          // paddingBottom: "20px",
          gap: '10px',
          padding: "10px 15px 10px 15px",
          //flex-wrap: "wrap",
          width: "100%",
          backgroundColor: "white !important",
        }}
      >






        
        <Autocomplete
          multiple
          //id="tags-outlined"
          //id="multiple-limit-tags"
          limitTags={1}
          autoHighlight
            // size="small"
          options={fromData}
          getOptionLabel={(option) => option.name}
          loading={loading}
           value={from}
          sx={{
            flex: 1, 
            display: 'flex',
            //marginLeft : '15px',
            alignItems : 'center',
            //width:'1200px !important',
            //background:'red',
            
        
            //height : '10px'
          }}
          onInputChange={(event, value) => {
               setFromText(value)
          }}
          onChange={handleFromChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              variant="outlined"
             disabled={from.length >= 3} 
              //label="limitTags" 
             // placeholder="Favorites"
              // InputProps={{
              //   ...params.InputProps,
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <PlaceIcon />
              //     </InputAdornment>
              // ),
              //}}
              sx={{
                flex: 1, marginRight: "10px",
                marginRight: "10px",
                //background:'green'
              }}


            />
          )}
        
          renderTags={(value, getTagProps) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%', overflow: 'hidden' }}>
              {value.map((option, index) => {
                let displayName = option.name;
                if (value.length === 1) {
                  displayName = option.name.substring(0, 10); 
                } else if (value.length == 2) {
                  displayName = option.name.substring(0,5); 
                }
                else if(value.length==3)
                {
                  displayName = option.name.substring(0,2);
                }
                return (
                  <Chip
                    key={option.id} 
                    label={displayName}
                    {...getTagProps({ index })}
                    sx={{ margin: '2px' }} 
                  />
                );
              })}
            </div>
          )} getOptionDisabled={(option) => from.length >= 3 && !from.includes(option)} // Disable options after 3 selections
         


        />


        <Autocomplete
          options={searchData}
          // multiple
           //id="tags-outlined"
           limitTags={1}


          getOptionLabel={(option) => option.name}
    
          loading={loading}
          sx={{ flex: 1, borderLeftRadius: "50px" }}
          onInputChange={(event, value) => {
            setToDestination(value)
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
              //sx={{ flex: 1, marginLeft: "10px" }}
            />
          )}
        />

        <Box sx={{
          flex: '0 0 150px',   minWidth: '150px',
          
        }}>
          <FormControl variant="outlined" >
            <DatePicker
              selected={startDate}
              //placeholderText="Check In - Checkout"
              placeholderText="Check In "
              onChange={handleDateChange}
              // selected={startDate}
              //endDate={endDate}
              //selectsRange
              minDate={addDays(new Date(), 1)}
              inline={false}
              customInput={
                <TextField
                  variant="outlined"
                  fullWidth
                  readOnly
                  sx={{ borderRadius: "30px", border: "none", padding: "10px" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={
                    startDate
                      ? `Check-in: ${formatDate(
                        startDate
                      )}`
                      : ""
                  }

                />
              }
            />
          </FormControl>
        </Box>



        {/* <Box sx={{ marginLeft: "20px", flex: 1 }}>
          <FormControl variant="outlined" fullWidth>
            <DatePicker
              selected={startDate}
              placeholderText="Check In "
              onChange={handleDateChange}
              
              startDate={startDate}
              //endDate={endDate}
              //selectsRange
              minDate={addDays(new Date(), 1)}
              inline={false}
              
            />
          </FormControl>
        </Box> */}

        <TextField
          readOnly
          onClick={handleClick}
          label="Travellers"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1,  borderRadius: "50px", flex: '0 0 150px', }}
          value={`${adults} adults · ${children + toddlers + infants + youth} children ·`}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#e0a043",
            color: "#fff",
            borderRadius: "50%",
            height: "52px",
            minWidth: "40px !important",
            //marginLeft: "10px",
          }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
     

      </Box>

        
      <Box
     display="flex"
     alignItems="center"
     //flexDirection="column "

     sx={{
       borderRadius: "100px",
       //border: "2px solid #e0a043",
       //backgroundColor: 'black',
        //background: "#e0a043",
       // paddingBottom: "20px",
       //padding: "10px 10px 0px 10px",
       //flex-wrap: "wrap",
       
       //marginLeft: "10%",
       //padding: "10px 15px 10px 15px",
          marginLeft: "3%",
       width: "40%",
       gap : '20px',
       paddingTop : '10px',
       backgroundColor: "#e0a043 !important",
     }}
     > 


<FormControl sx=  {{m: 1, width : 120, height: '30px'}} size="small" >
      <InputLabel id="demo-select-small-label"
      
      sx={{ 
        fontSize: '1.2rem', 
        color: 'black', 
      }} 
      
      >

      
      </InputLabel>
      <Select 
      
        labelId="demo-select-small-label"
        id="demo-select-small-label"
        defaultValue='One Way'
        value={trip}
        sx={{borderRadius:"20px black",  backgroundColor : "#ddd", color: 'black', border: ' black',
          minWidth: 120, 
          width: '120px', 
          height: '30px',
          padding: '0',
          overflow: 'hidden', 
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        height: '100%', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
         

        }}
        label="Trip"
        onChange={handleChangeTrip}
        
      >
        <MenuItem value='ONE WAY'>One Way</MenuItem>
        <MenuItem value='RETURN'>Return</MenuItem>
        <MenuItem value='MULTI CITY'>Multi City</MenuItem>
      </Select>
    </FormControl> 
 
    
<FormControl sx=  {{m: 1, minWidth: 200, height : '30px' }} size="small">
      <InputLabel id="demo-select-small-label"
      sx={{ 
        fontSize: '1.2rem', 
        color: 'black', 
      }} 
      
      ></InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small-label"
        defaultValue='Economy'
        value={category}
        sx={{borderRadius:"20px black",  backgroundColor : "#ddd", color : 'black',
          minWidth: 200,
      width: '200px', 
      height : '30px',
      padding : '0',
      overflow: 'hidden', 
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        height: '30px', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
      },
        }}
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
              onChange={(e) => setAdults(Number(e.target.value < 0 ? 0 : e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            />


            <TextField
              label="Youths 12-17"
              type="number"
              value={youth}
              onChange={(e) => setYouth(Number(e.target.value < 0 ? 0 : e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            />

            <TextField
              label="Children 2-11"
              type="number"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value < 0 ? 0 : e.target.value))}
              variant="outlined"
              sx={{ marginTop: "10px", width: "auto" }}
            />

            <TextField
              label="Toddlers in own seats"
              type="number"
              value={toddlers}
              onChange={(e) => setToddlers(Number(e.target.value < 0 ? 0 : e.target.value))}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            />
            <TextField
              label="Infants on lap under 12"
              type="number"
              value={infants}
              onChange={handleInfantChange}
              variant="outlined"
              sx={{ width: "auto", marginTop: "10px" }}
            />

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


export default FlightSearchBar;
