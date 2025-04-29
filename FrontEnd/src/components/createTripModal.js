import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationSearch from "./LocationSearch";
import { toast } from "react-toastify";
import { getAllTour } from "../api/tour.api";

const CreateTripModal = ({ open, handleClose }) => {
    const [location, setLocation] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [budget, setBudget] = useState(500);
    const [showTravellers, setShowTravellers] = useState(false);
    const [showBudget, setShowBudget] = useState(false);
    const [tours, setTours] = useState([]);

    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'asc') => {
        let allData = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            const response = await fetchFunction(currentPage, size, sortBy, sortDir);
            allData = [...allData, ...response.content];
            currentPage = response.currentPage + 1;
            totalPages = response.totalPages;
        }

        return allData;
    };

    const fetchSaleTours = async () => {
        try {

            const allTours = await fetchAllPages(getAllTour);
            const filterTours = allTours.filter(tour => tour.active === true && tour.status === "UPCOMING");
            setTours(filterTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    useEffect(() => {
        fetchSaleTours();
    },[]);

    const navigate = useNavigate();

    const handleSubmit = () => {
        // Navigate to ResultTour with all tours and search criteria
        navigate("/resulttour", {
            state: {
                allTours: tours, // Pass all tours instead of filtered ones
                searchCriteria: {
                    selectedLocation,
                    location,
                    checkIn,
                    checkOut,
                    budget,
                    guests,
                    rooms,
                },
            },
        });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    width: 500,
                    maxHeight: 520,
                    overflow: "auto",
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    mx: "auto",
                    my: "10%",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Create Trip
                </Typography>

                {/* Location */}
                <LocationSearch
                    onLocationSelect={(loc) => {
                        setSelectedLocation(loc);
                        setLocation(loc?.display_name || "");
                    }}
                />

                {/* Check-in & Check-out Dates */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Check-in"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Check-out"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                </Box>

                {/* Budget Section */}
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowBudget(!showBudget)}
                    sx={{ mb: 2 }}
                >
                    Budget: ${budget}
                </Button>
                {showBudget && (
                    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
                        <Typography>Set Budget</Typography>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            style={{ width: "100%" }}
                        />
                        <Typography>Selected: ${budget}</Typography>
                    </Box>
                )}

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Done
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateTripModal;