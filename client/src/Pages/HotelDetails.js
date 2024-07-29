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
    const [error, setError] = useState(null);
    const [value, setValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAmenitiesDialog, setOpenAmenitiesDialog] = useState(false);
    const hotelName = location.state.hotelName;

    useEffect(() => {
        const fetchRoomDetails = async () => {
            const { hotelId, startDate, endDate, guests, destinationId, hotelName } = location.state;

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

        fetchRoomDetails();
    }, [location.state]);

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
    console.log(roomDetails);

    const handleBook = () => {
        const { startDate, endDate, guests, destinationId, hotelId } = location.state;
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
        <div>
            <h1 style={{ textAlign: 'center' }}>{hotelName}</h1>
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
                    <div style={{ marginTop: '1cm' }}>
                        <h2>Price: ${getRoomPrice(roomDetails[value])}</h2>
                        <h4>Amenities:</h4>
                        <Grid container spacing={2}>
                            {roomDetails[value]?.amenities?.slice(0, 8).map((amenity, idx) => (
                                <Grid item xs={6} key={idx}>
                                    {idx + 1}. {amenity}
                                </Grid>
                            ))}
                        </Grid>
                        {roomDetails[value]?.amenities?.length > 8 && (
                            <Button variant="contained" onClick={handleOpenAmenitiesDialog} sx={{ marginTop: '10px' }}>
                                View All Amenities
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleBook}
                            sx={{ marginTop: '10px', backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                        >
                            Book
                        </Button>
                    </div>

                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                        <DialogTitle>All Room Images</DialogTitle>
                        <DialogContent>
                            <ImageList cols={3} gap={8}>
                                {roomDetails[value]?.images?.map((image, idx) => (
                                    <ImageListItem key={idx}>
                                        <img
                                            src={image.url}
                                            alt={`Room image ${idx + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openAmenitiesDialog} onClose={handleCloseAmenitiesDialog} fullWidth maxWidth="sm">
                        <DialogTitle>All Amenities</DialogTitle>
                        <DialogContent>
                            <ul>
                                {roomDetails[value]?.amenities?.map((amenity, idx) => (
                                    <li key={idx}>{amenity}</li>
                                ))}
                            </ul>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default HotelDetails;