import React, {useState, useEffect} from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LocationSearch from "./LocationSearch";

import {getAllTour} from "../api/tour.api";

const CreateTripModal = ({open, handleClose}) => {
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
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await getAllTour();
                setTours(response);
                console.log("Tours fetched:", response);
            } catch (error) {
                console.error("Error fetching tours:", error);
            }
        };

        fetchTours();
    }, []);

    const navigate = useNavigate();

    const handleSubmit = () => {
        const filteredTours = tours.filter((tour) => {
            const isBudgetMatch = budget ? tour.price <= budget : true;
            const isLocationMatch = location
                ? tour.location.name.toLowerCase().includes(location.toLowerCase())
                : selectedLocation?.name
                    ? tour.location.name.toLowerCase().includes(selectedLocation.name.toLowerCase())
                    : true;
            const isDateMatch =
                (!checkIn || new Date(checkIn) <= new Date(tour.startDate)) &&
                (!checkOut || new Date(checkOut) >= new Date(tour.endDate));

            return isBudgetMatch && isLocationMatch && isDateMatch;
        });

        if (filteredTours.length > 0) {
            navigate("/resulttour", {
                state: {
                    filteredTours,
                    searchCriteria: { selectedLocation, location, checkIn, checkOut, budget, guests, rooms },
                },
            });
        } else {
            alert("No tours match your criteria");
        }
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
                <LocationSearch onLocationSelect={setSelectedLocation}/>

                {/* Check-in & Check-out Dates */}
                <Box sx={{display: "flex", gap: 2, mb: 2}}>
                    <TextField
                        fullWidth
                        label="Check-in"
                        type="date"
                        InputLabelProps={{shrink: true}}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Check-out"
                        type="date"
                        InputLabelProps={{shrink: true}}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                </Box>

                {/* Travellers Section */}
                <Button fullWidth variant="outlined" onClick={() => setShowTravellers(!showTravellers)} sx={{mb: 2}}>
                    {rooms} Room, {guests} Guest(s)
                </Button>
                {showTravellers && (
                    <Box sx={{p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2}}>
                        <Typography>Guests</Typography>
                        <TextField
                            select
                            fullWidth
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num} Guest(s)
                                </MenuItem>
                            ))}
                        </TextField>
                        <Typography sx={{mt: 2}}>Rooms</Typography>
                        <TextField
                            select
                            fullWidth
                            value={rooms}
                            onChange={(e) => setRooms(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num} Room(s)
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                )}

                {/* Budget Section */}
                <Button fullWidth variant="outlined" onClick={() => setShowBudget(!showBudget)} sx={{mb: 2}}>
                    Budget: ${budget}
                </Button>
                {showBudget && (
                    <Box sx={{p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2}}>
                        <Typography>Set Budget</Typography>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            style={{width: "100%"}}
                        />
                        <Typography>Selected: ${budget}</Typography>
                    </Box>
                )}

                {/* Submit Button */}
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                    Done
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateTripModal;