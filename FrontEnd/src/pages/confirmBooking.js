import React , {useState} from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

const ConfirmBooking = () => {
    const [selectBtnPayment , setSelectBtnPayment] = useState(null);
    const handleSelectedPayment = (btn) => {
        setSelectBtnPayment(btn);
    }

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

                <Typography variant="h6" sx={{mb : 2}}>Payment Method</Typography>
                <Box sx={{display:'flex',flexDirection:'column',gap:'16px', marginBottom:'2rem',pl:3}}>
                    <Button
                        sx={{ justifyContent: 'flex-start', backgroundColor: selectBtnPayment === 'credit' ? 'green' : 'inherit', color : selectBtnPayment === 'credit' ? 'white' : 'inherit' }}
                        fullWidth
                        onClick={() => handleSelectedPayment('credit')}
                    >
                        Credit Card
                    </Button>
                    <Button
                        sx={{ justifyContent: 'flex-start', backgroundColor: selectBtnPayment === 'paypal' ? 'green' : 'inherit', color : selectBtnPayment === 'paypal' ? 'white' : 'inherit' }}
                        fullWidth
                        onClick={() => handleSelectedPayment('paypal')}
                    >
                        Paypal
                    </Button>
                    <Button
                        sx={{ justifyContent: 'flex-start', backgroundColor: selectBtnPayment === 'checkin' ? 'green' : 'inherit' , color : selectBtnPayment === 'checkin' ? 'white' : 'inherit' }}
                        fullWidth
                        onClick={() => handleSelectedPayment('checkin')}
                    >
                        Pay check in
                    </Button>
                </Box>


                <Button variant="contained" color="primary" fullWidth>
                    Confirm Booking
                </Button>
            </Box>


        </Box>
    );
};

export default ConfirmBooking;
