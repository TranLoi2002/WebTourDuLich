import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia } from "@mui/material";
import { Star } from "@mui/icons-material";

const ResultTour = () => {
    const { state } = useLocation();
    const initialTours = state?.filteredTours || [];
    const initialCriteria = state?.searchCriteria || {};

    const [filteredTours, setFilteredTours] = useState(initialTours);
    const [location, setLocation] = useState(initialCriteria.selectedLocation?.name || "");
    const [checkIn, setCheckIn] = useState(initialCriteria.checkIn || "");
    const [checkOut, setCheckOut] = useState(initialCriteria.checkOut || "");
    const [budget, setBudget] = useState(initialCriteria.budget || 500);

    useEffect(() => {
        const applyFilters = () => {
            const newFilteredTours = initialTours.filter((tour) => {
                const isBudgetMatch = budget ? tour.price <= budget : true;
                const isLocationMatch = location
                    ? tour.location.name.toLowerCase().includes(location.toLowerCase())
                    : true;
                const isDateMatch =
                    (!checkIn || new Date(checkIn) <= new Date(tour.startDate)) &&
                    (!checkOut || new Date(checkOut) >= new Date(tour.endDate));

                return isBudgetMatch && isLocationMatch && isDateMatch;
            });
            setFilteredTours(newFilteredTours);
        };

        applyFilters();
    }, [location, checkIn, checkOut, budget, initialTours]);

    return (
        <Box sx={{ display: "flex", height: "100%", p: 4, paddingTop: "100px", paddingLeft: "100px", paddingRight: "100px" }}>
            {/* Sidebar (Filters) */}
            <Box sx={{ width: "25%", pr: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", paddingBottom: "20px" }}>Filters by:</Typography>
                <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    sx={{ mb: 2 }}
                />
                {/*<Button variant="contained" color="primary" fullWidth>*/}
                {/*    Apply Filters*/}
                {/*</Button>*/}
            </Box>

            {/* Search Results */}
            <Box sx={{ width: "75%", pl: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", paddingBottom: "20px" }}>Search Results</Typography>
                {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                        <Card
                            key={tour.id || Math.random()}
                            sx={{ display: "flex", marginBottom: "20px", height: "350px", borderRadius: "20px", overflow: "hidden" }}
                        >
                            <CardMedia
                                component="img"
                                height="100%"
                                sx={{ width: "40%" }}
                                image={tour.thumbnail || "https://via.placeholder.com/150"}
                                alt={tour.title || "Tour Image"}
                            />
                            <CardContent sx={{ width: "60%", display: "flex", flexDirection: "column", gap: "20px" }}>
                                <Typography variant="h5" component="div">
                                    {tour.title || "Untitled Tour"}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Star sx={{ color: "gold" }} />
                                    <Typography variant="body2" color="text.secondary">
                                        4.2 <span>(129 reviews)</span>
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontSize="18px">
                                    {tour.description || "No description available."}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                    <Button variant="contained" color="primary" className="add-to-trip" id="add-button">
                                        Add
                                    </Button>
                                    <Typography variant="h6" color="text.primary">
                                        Price ${tour.price || "N/A"}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No tours found with your details.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ResultTour;