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
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        location
                    )}`
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
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.display_name
            }
            onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                    setLocation(newValue);
                    onLocationSelect({ display_name: newValue });
                } else if (newValue) {
                    setLocation(newValue.display_name);
                    onLocationSelect(newValue);
                }
            }}
            inputValue={location}
            onInputChange={(event, newInputValue) => {
                setLocation(newInputValue);
                onLocationSelect({ display_name: newInputValue });
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label="Location"
                    variant="outlined"
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