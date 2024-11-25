import React, { useState, useEffect } from 'react'; 
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia,Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const currencyFormat = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatDate = (date) => date.split('T')[0];

const getRatingDescription = (rating) => {
    if (rating >= 9) return "Excellent";
    if (rating >= 8) return "Very Good";
    if (rating >= 7) return "Good";
    if (rating >= 6) return "Fair";
    return "Poor";
  };

  const PropertyCard = ({ property, isFavorite, toggleFavorite, checkAvailability }) => {
    return (
        <Card sx={{ display: 'flex', marginBottom: '20px', boxShadow: 3, padding: '15px', borderRadius: '10px', maxHeight: '70%' }}>
            {/* Image Section */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 180, height: 200, borderRadius: '8px' }}
                    image={property.photoMainUrl} // Correctly using the photoMainUrl for the main image.
                    alt={property.name}
                />
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    {isFavorite ? (
                        <FavoriteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={toggleFavorite} />
                    ) : (
                        <FavoriteBorderIcon style={{ color: 'gray', cursor: 'pointer' }} onClick={toggleFavorite} />
                    )}
                </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px 20px' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Grid container spacing={2}>
                        {/* Property Info */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{property.name}</Typography>
                           

                            {/* Additional Labels */}
                            {/* {property.additionalLabels && property.additionalLabels.length > 0 && (
                                <Box sx={{ marginTop: '8px' }}>
                                    {property.additionalLabels.map((label, index) => (
                                        <Chip 
                                            key={index}
                                            label={label}
                                            color="warning"
                                            size="small"
                                            sx={{ marginRight: '8px' }}
                                        />
                                    ))}
                                </Box>
                            )} */}

                            {/* Benefit Badges */}
                            {property.benefitBadges && property.benefitBadges.length > 0 && (
                                <Box sx={{ marginTop: '8px' }}>
                                    {property.benefitBadges.map((badge, index) => (
                                        <Chip 
                                            key={index}
                                            label={badge.text}  // Correctly mapping the benefit badge's text
                                            color="primary"
                                            size="small"
                                            sx={{ marginRight: '8px' }}
                                        />
                                    ))}
                                </Box>
                            )}

                            {/* Accommodation Details */}
                            {property.proposedAccommodation && property.proposedAccommodation.length > 0 && (
                                <Box sx={{ marginTop: '8px' }}>
                                    {property.proposedAccommodation.map((accommodation, index) => (
                                        <Typography key={index} variant="body2" color="text.secondary">
                                            {accommodation}
                                        </Typography>
                                    ))}
                                </Box>
                            )}

                            {/* Review Score Section */}
                            <Box sx={{ marginTop: '8px' }}>
                                <Chip 
                                    label={property.reviewScoreWord || `Rating: ${property.reviewScore}`} 
                                    color="success" 
                                    size="small"
                                    icon={<StarIcon />} 
                                    sx={{ marginRight: '8px' }}
                                />
                                <Typography variant="body2" component="span" color="text.secondary">
                                    {property.reviewScore} / 10 ({property.reviewCount} reviews)
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Price and Button */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            {/* {property.currency}  */}
                            {currencyFormat(property.priceDetails.gross)}                          
                              </Typography>
                            
                            <Typography variant="body2" color="text.secondary">
                                {property.priceDetails.info} 
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {property.priceDetails.taxInfo}  
                           </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ textTransform: 'none', backgroundColor: '#cd8b14', borderRadius: '15px' }}
                                onClick={() => checkAvailability(property.id, property.checkinDate, property.checkoutDate)}
                            >
                                See Availability
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Box>
        </Card>
    );
};

const FoundProperties = ({ hotels }) => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = (hotelId) => {
        setFavorites((prev) => prev.includes(hotelId) 
            ? prev.filter((id) => id !== hotelId) 
            : [...prev, hotelId]
        );
    };


    const checkAvailability = async (hotelId, checkinDate, checkoutDate) => {
        // setLoading(true); // Set loading state when fetching details
        // const availability = await fetchHotelDetails(hotelId, checkinDate, checkoutDate);
        navigate(`/hotelDetail/${hotelId}`, { state: { checkinDate, checkoutDate } });
        // setLoading(false); // Reset loading state
        // console.log("Availability data:", availability);
        // Handle the availability data as needed (e.g., show a modal, update state, etc.)
    };

    useEffect(() => {
        if (hotels?.results?.length) {
            setProperties(hotels.results); // Store properties without fetching details
        } else {
            console.warn("No hotels found:", hotels);
        }
    }, [hotels]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while fetching details
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom sx={{fontWeight:'400'}}>
                {properties.length} properties found
            </Typography>
            <Grid container direction="column">
                {properties.map((property) => (
                    <Grid item key={property?.id}>
                        <PropertyCard
                            property={property}
                            isFavorite={favorites.includes(property?.id)}
                            toggleFavorite={() => toggleFavorite(property?.id)}
                            checkAvailability={checkAvailability} // Pass checkAvailability function
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FoundProperties;
