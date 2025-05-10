import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { forgotPassword } from '../../api/auth.api';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await forgotPassword(email);
            setSuccess("OTP đã được gửi đến email");
            setTimeout(() => {
                navigate("/auth/resetPassword", { state: { email } });
            }, 1000);
        } catch (err) {
            setError(err.error || "Gửi OTP thất bại");
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
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Gửi mã OTP
                </Button>
            </form>
        </Box>
    );
};

export default ForgotPassword;