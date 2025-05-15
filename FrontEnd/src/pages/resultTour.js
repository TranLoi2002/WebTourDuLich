import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
} from "@mui/material";
import ActivityTourCard from "../components/ActivityTourCard";

const ResultTour = () => {
    const { state } = useLocation();
    const allTours = state?.allTours || [];
    const initialCriteria = state?.searchCriteria || {};

    const [filteredTours, setFilteredTours] = useState(allTours);
    const [location, setLocation] = useState(
        initialCriteria.selectedLocation?.display_name ||
        initialCriteria.location ||
        ""
    );
    const [checkIn, setCheckIn] = useState(initialCriteria.checkIn || "");
    const [checkOut, setCheckOut] = useState(initialCriteria.checkOut || "");
    const [budget, setBudget] = useState(initialCriteria.budget || 500);

    useEffect(() => {
        const applyFilters = () => {
            const keyword = location.toLowerCase().trim();

            const newFilteredTours = allTours.filter((tour) => {
                const isBudgetMatch = budget ? tour.price <= budget : true;

                const isLocationMatch = keyword
                    ? tour.location.name.toLowerCase().includes(keyword) ||
                    tour.title.toLowerCase().includes(keyword)
                    : true;

                const isDateMatch =
                    (!checkIn || new Date(checkIn) <= new Date(tour.startDate)) &&
                    (!checkOut || new Date(checkOut) >= new Date(tour.endDate));

                return isBudgetMatch && isLocationMatch && isDateMatch;
            });

            setFilteredTours(newFilteredTours);
        };

        applyFilters();
    }, [location, checkIn, checkOut, budget, allTours]);

    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
                p: 4,
                paddingTop: "100px",
                paddingLeft: "100px",
                paddingRight: "100px",
            }}
        >
            {/* Sidebar (Filters) */}
            <Box sx={{ width: "25%", pr: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", paddingBottom: "20px" }}
                >
                    Filters by:
                </Typography>
                <TextField
                    fullWidth
                    label="Location or Tour Title"
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
            </Box>

            {/* Search Results */}
            <Box sx={{ width: "75%", pl: 4 }} className="things_right">
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", paddingBottom: "20px" }}
                >
                    Search Results
                </Typography>
                {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                        <ActivityTourCard tour={tour} key={tour.id} />
                    ))
                ) : (
                    <Typography>No tours found with your details.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ResultTour;