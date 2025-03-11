import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

const ConfirmBooking = () => {
    const { state } = useLocation();

    return (
        <Box sx={{ display: "flex", height: "100%", p: 4 , paddingTop:'120px', paddingRight:'150px', paddingLeft:'150px'}}>
            {/* Thông tin tour (Bên trái) */}
            <Box sx={{ width: "35%" , borderWidth: 2, borderColor:'lightgray', borderStyle:'solid', mr:3, p : 3}}>
                <Typography variant="h6" sx={{mb : 2}}>Tour Information</Typography>
                <Typography>Name: {state?.tour}</Typography>
                <Typography>Adults: {state?.adults}</Typography>
                <Typography>Children: {state?.children}</Typography>
                <Typography>Babies: {state?.babies}</Typography>
                <Typography>Total Price: ${state?.totalPrice}</Typography>
                {state?.discountCode && <Typography>Discount Code: {state?.discountCode}</Typography>}
            </Box>

            {/* Thông tin cá nhân (Bên phải) */}
            <Box sx={{ width: "65%", borderWidth: 2, borderColor:'lightgray', borderStyle:'solid', p : 3 }}>
                <Typography variant="h6" sx={{mb : 2}}>Your Information</Typography>
                <TextField fullWidth label="Full Name" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" type="email" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Phone Number" type="tel" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Address" variant="outlined" sx={{ mb: 2 }} />
                <Button variant="contained" color="primary" fullWidth>
                    Confirm Booking
                </Button>
            </Box>
        </Box>
    );
};

export default ConfirmBooking;
