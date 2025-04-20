import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia } from "@mui/material";
import { Star } from "@mui/icons-material";

const TourList = ({ tours, title, filtersEnabled = true }) => {
    const [filteredTours, setFilteredTours] = useState(tours);
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState(500);

    useEffect(() => {
        if (filtersEnabled) {
            const applyFilters = () => {
                const newFilteredTours = tours.filter((tour) => {
                    const isBudgetMatch = budget ? tour.price <= budget : true;
                    const isLocationMatch = location
                        ? tour.location.name.toLowerCase().includes(location.toLowerCase())
                        : true;

                    return isBudgetMatch && isLocationMatch;
                });
                setFilteredTours(newFilteredTours);
            };

            applyFilters();
        } else {
            setFilteredTours(tours);
        }
    }, [location, budget, tours, filtersEnabled]);

    console.log("Filtered Tours:", filteredTours);

    return (
        <Box sx={{ display: "flex", height: "100%", p: 4, paddingTop: "100px", paddingLeft: "100px", paddingRight: "100px" }}>
            {/* Sidebar (Filters) */}
            {filtersEnabled && (
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
                        label="Budget"
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        sx={{ mb: 2 }}
                    />
                </Box>
            )}
            {/* Search Results */}
            <Box sx={{ width: filtersEnabled ? "75%" : "100%", pl: filtersEnabled ? 4 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", paddingBottom: "20px" }}>{title}</Typography>
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

export default TourList;