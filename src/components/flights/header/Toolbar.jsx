import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttractionsIcon from "@mui/icons-material/Attractions";
import VillaIcon from "@mui/icons-material/Villa";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import { Link } from "react-router-dom";

const Toolbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
  };

  const items = [
    { label: 'Stay', icon: <DirectionsCarIcon />, path: '/' },
    {
      label: "Flights ",
      icon: <FlightTakeoffIcon />,
      path: "/flights",
    },
    { label: "Car Rentals", icon: <DirectionsCarIcon />, path: "/car-rentals" },
    { label: "Attractions", icon: <AttractionsIcon />, path: "/attractions" },
    {
      label: "Vacation Rentals",
      icon: <VillaIcon />,
      path: "/vacation-rentals",
    },
    { label: "Cab Service", icon: <LocalTaxiIcon />, path: "/cab-service" },
  ];

  return (
    <Box sx={{background: 'linear-gradient(to right, #e7f9fe, #f6d3fe)',}}>
    <Box
      display="flex"      
      justifyContent="center"
      sx={{ padding: 2, maxWidth: '100%', }}
    >
      {items.map((item, index) => (
        <Link to={item.path} style={{ textDecoration: "none" }} key={index}>
          <Button
            onClick={() => handleButtonClick(index)}
            sx={{
              color: activeIndex === index ? "#FFA500" : "gray",
              "&:hover": {
                color: "#FFA500",
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%", 
                backgroundColor:
                  activeIndex === index ? "#FFA500" : "transparent", 
                display: "flex",

                color: activeIndex === index ? "white" : "gray",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 1,
              }}
            >
              {React.cloneElement(item.icon, {
                color: activeIndex === index ? "white" : "inherit",
              })}
            </Box>
            <Typography variant="body1" sx={{ textTransform: "none",fontSize:'12px' }}>
              {item.label}
            </Typography>
          </Button>
        </Link>
      ))}
    </Box>
    </Box>
  );
};

export default Toolbar;
