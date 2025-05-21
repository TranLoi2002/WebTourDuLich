import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../api/auth.api';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        if (!email) {
            toast.info("Please enter your email");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.info("Invalid email format");
            return;
        }

        setLoading(true);

        try {
            await forgotPassword(email);
            toast.success("OTP has been sent to your email");
            setTimeout(() => {
                navigate("/auth/resetPassword", { state: { email } });
            }, 1000);
        } catch (err) {
            toast.error(err?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 20 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Forgot Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send OTP code"}
                </Button>
            </form>
        </Box>
    );
};

export default ForgotPassword;