import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import '../Styles/HotelDetails.css';

const HotelDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState([]);
    const [hotelDescription, setHotelDescription] = useState('');
    const [error, setError] = useState(null);
    const [value, setValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAmenitiesDialog, setOpenAmenitiesDialog] = useState(false);
    const hotelId = location.state.hotelId;
    const hotelName = location.state.hotelName;

    useEffect(() => {
        const fetchRoomDetails = async () => {
            const { startDate, endDate, guests, destinationId } = location.state;
            const guestsCount = guests.adults + guests.children;

            try {
                const response = await axios.get(`http://localhost:3004/api/hotels/${hotelId}/price`, {
                    params: {
                        destination_id: destinationId,
                        checkin: startDate,
                        checkout: endDate,
                        lang: 'en_US',
                        currency: 'SGD',
                        country_code: 'SG',
                        guests: guestsCount,
                        partner_id: 1,
                    },
                });

                setRoomDetails(response.data.rooms);
            } catch (error) {
                console.error('Error fetching room details:', error);
                setError('Error fetching room details');
            }
        };

        const fetchHotelDescription = async () => {
            try {
                const response = await axios.get(`http://localhost:3004/api/hotels/${hotelId}`);
                setHotelDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching hotel description:', error);
                setHotelDescription('Description not available');
            }
        };

        fetchRoomDetails();
        fetchHotelDescription();
    }, [hotelId, location.state]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenAmenitiesDialog = () => {
        setOpenAmenitiesDialog(true);
    };

    const handleCloseAmenitiesDialog = () => {
        setOpenAmenitiesDialog(false);
    };

    const getRoomPrice = (room) => {
        const surcharges = room?.roomAdditionalInfo?.displayFields?.surcharges;
        if (surcharges && surcharges.length > 0) {
            return surcharges[0]?.amount ?? 'N/A';
        }
        return 'N/A';
    };

    const handleBook = () => {
        const { startDate, endDate, guests, destinationId } = location.state;
        navigate('/booking', {
            state: {
                destinationId,
                hotelId,
                startDate,
                endDate,
                guests,
                hotelName,
                roomPrice: getRoomPrice(roomDetails[value]),
                roomDescription: roomDetails[value]?.roomDescription // Pass the room description
            },
        });
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="hotel-details-container">
            <h1 style={{ textAlign: 'center' }}>{hotelName}</h1>
            <div className="hotel-description-container">
                <p dangerouslySetInnerHTML={{ __html: hotelDescription }} />
            </div>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {roomDetails.map((room, index) => (
                        <Tab label={room?.roomDescription ?? `Room ${index + 1}`} key={index} />
                    ))}
                </Tabs>
            </Box>
            {roomDetails.length > 0 && (
                <>
                    <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center', marginTop: '1cm' }}>
                        <div className="hotel-details">
                            <div className="image-container">
                                <div className="main-image">
                                    <img
                                        src={roomDetails[value]?.images?.[0]?.url}
                                        alt={`Room image 1`}
                                    />
                                </div>
                                <div className="grid-images">
                                    {roomDetails[value]?.images?.slice(1, 5).map((image, idx) => (
                                        <div key={idx}>
                                            <img
                                                src={image.url}
                                                alt={`Room image ${idx + 2}`}
                                            />
                                        </div>
                                    ))}
                                    {roomDetails[value]?.images?.length > 5 && (
                                        <Button
                                            variant="contained"
                                            onClick={handleOpenDialog}
                                            className="show-all-button"
                                        >
                                            Show All Images
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <div className="room-info-container">
                        <div className="price-section">
                            <h4>Price:</h4>
                            <p>${getRoomPrice(roomDetails[value])}</p>
                        </div>
                        <div className="cancellation-section">
                            <h4>Free Cancellation:</h4>
                            <p>{roomDetails[value]?.freeCancellation ? "Available" : "Not Available"}</p>
                        </div>
                        <div className="long-description-container">
                            <h4>Room Description:</h4>
                            <div dangerouslySetInnerHTML={{ __html: roomDetails[value]?.long_description ?? "No description available" }} />
                        </div>
                        <div className="amenities-section">
                            <h4>Amenities:</h4>
                            <Grid container spacing={2}>
                                {roomDetails[value]?.amenities?.slice(0, 8).map((amenity, idx) => (
                                    <Grid item xs={6} key={idx}>
                                        <div className="amenity-card">
                                            <span className="amenity-icon">&#10003;</span>
                                            <span className="amenity-text">{amenity}</span>
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                            {roomDetails[value]?.amenities?.length > 8 && (
                                <Button variant="contained" onClick={handleOpenAmenitiesDialog} className="view-all-amenities-button">
                                    View All Amenities
                                </Button>
                            )}
                        </div>
                        <Button
                            className='book'
                            variant="contained"
                            onClick={handleBook}
                            sx={{ marginTop: '10px', backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                        >
                            Book
                        </Button>
                    </div>

                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                        <DialogTitle>All Room Images</DialogTitle>
                        <DialogContent>
                            <ImageList cols={3} rowHeight={200}>
                                {roomDetails[value]?.images?.map((image, idx) => (
                                    <ImageListItem key={idx}>
                                        <img src={image.url} alt={`Room image ${idx + 1}`} />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openAmenitiesDialog} onClose={handleCloseAmenitiesDialog}>
                        <DialogTitle>All Amenities</DialogTitle>
                        <DialogContent>
                            {roomDetails[value]?.amenities?.map((amenity, idx) => (
                                <div key={idx}>
                                    {idx + 1}. {amenity}
                                </div>
                            ))}
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default HotelDetails;
