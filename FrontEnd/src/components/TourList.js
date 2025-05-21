import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia } from "@mui/material";
import { Star } from "@mui/icons-material";
import ActivityTourCard from "./ActivityTourCard";

const TourList = ({ tours, title, filtersEnabled = true }) => {
    const [filteredTours, setFilteredTours] = useState(tours);
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState(0);

    useEffect(() => {
        if (filtersEnabled) {
            const keyword = location.toLowerCase().trim();
            const applyFilters = () => {
                const newFilteredTours = tours.filter((tour) => {
                    const isBudgetMatch = budget ? tour.price <= budget : true;
                    const isLocationMatch = keyword
                        ? tour.location.name.toLowerCase().includes(keyword) ||
                        tour.title.toLowerCase().includes(keyword)
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
                        label="Destination"
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
            <Box sx={{ width: filtersEnabled ? "75%" : "100%", pl: filtersEnabled ? 4 : 0 }} className="things_right">
                <Typography variant="h6" sx={{ fontWeight: "bold", paddingBottom: "20px" }}>{title}</Typography>
                {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                        <ActivityTourCard
                            key={tour.id}
                            tour={tour}
                        />
                    ))
                ) : (
                    <Typography>No tours found with your details.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default TourList;