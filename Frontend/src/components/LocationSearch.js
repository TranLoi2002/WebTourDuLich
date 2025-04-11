import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";

const LocationSearch = ({ onLocationSelect }) => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchLocations = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
            setLoading(false);
        };

        const delayDebounce = setTimeout(() => {
            fetchLocations();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [location]);

    return (
        <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => option.display_name}
            onChange={(event, newValue) => {
                if (newValue) {
                    setLocation(newValue.display_name);
                    onLocationSelect(newValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        onLocationSelect({ display_name: e.target.value });
                    }}
                    sx={{ mb: 2 }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: loading ? <CircularProgress size={20} /> : null,
                    }}
                />
            )}
        />
    );
};

export default LocationSearch;