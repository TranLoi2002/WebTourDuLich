import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia } from "@mui/material";
import {Star} from '@mui/icons-material';
import img_1 from '../assets/images/image_1.jpg'

import {createTheme, ThemeProvider} from "@mui/material/styles";


const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    }
});

const mockTours = [
    { id: 1, name: "Luxury Beach Resort", price: 400 },
    { id: 2, name: "Mountain Adventure", price: 350 },
    { id: 3, name: "City Escape", price: 500 },
];

const ResultTour = () => {
    const { state } = useLocation();

    // Dùng useState để có thể chỉnh sửa bộ lọc
    const [location, setLocation] = useState(state?.location || "");
    const [checkIn, setCheckIn] = useState(state?.checkIn || "");
    const [checkOut, setCheckOut] = useState(state?.checkOut || "");
    const [guests, setGuests] = useState(state?.guests || 1);
    const [rooms, setRooms] = useState(state?.rooms || 1);
    const [budget, setBudget] = useState(state?.budget || 500);
    const [filteredTours, setFilteredTours] = useState(mockTours);

    // Hàm lọc tour khi thay đổi bộ lọc
    useEffect(() => {
        const filtered = mockTours.filter((tour) => tour.price <= budget);
        setFilteredTours(filtered);
    }, [budget]); // Chạy lại khi budget thay đổi

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", height: "100%", p: 4, paddingTop: "100px", paddingLeft:'100px', paddingRight:'100px'}}>
            {/* Sidebar (Bên trái) */}
            <Box sx={{ width: "25%", pr: 3 }}>
                <Typography variant="h6" sx={{fontWeight:'bold',paddingBottom:'20px'}}>Filters by:</Typography>
                <TextField fullWidth label="Location" variant="outlined"
                           value={location} onChange={(e) => setLocation(e.target.value)}
                           sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Check-in" type="date"
                           value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                           InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Check-out" type="date"
                           value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                           InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Guests" type="number"
                           value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                           sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Rooms" type="number"
                           value={rooms} onChange={(e) => setRooms(Number(e.target.value))}
                           sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Budget" type="number"
                           value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                           sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" fullWidth>
                    Apply Filters
                </Button>
            </Box>

            {/* Kết quả tìm kiếm (Bên phải) */}
            <Box sx={{ width: "75%", pl: 4 }}>
                <Typography variant="h6" sx={{fontWeight:'bold',paddingBottom:'20px'}}>Search Results</Typography>
                {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                        <Card sx={{ display:'flex', marginBottom:'20px', height:'350px', borderRadius:'20px', overflow:'hidden' }}>
                            <CardMedia
                                component="img"
                                height="100%"
                                sx={{
                                    width: '40%',
                                }}
                                image={img_1}
                                alt="CRU Champagne Bar"
                            />
                            <CardContent sx={{ width: '60%', display:'flex',flexDirection:'column',gap:'20px' }}>
                                <Typography variant="h5" component="div">
                                    CRU Champagne Bar
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Star sx={{ color: 'gold' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        4.2 <span>(129 reviews) Tour</span>
                                    </Typography>
                                </Box>

                                    <Typography variant="body2" color="text.secondary" fontSize="18px">
                                        Unique 360 panoramic views of the amazing Bangkok skyline, inspired from the best Champagne listings worldwide.
                                    </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Button variant="contained" color="primary" className="add-to-trip" id="add-button">
                                        Add
                                    </Button>
                                    <Typography variant="h6" color="text.primary">
                                        Price ${tour.price}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No tours found within budget.</Typography>
                )}
            </Box>
        </Box>
        </ThemeProvider>
    );
};

export default ResultTour;
