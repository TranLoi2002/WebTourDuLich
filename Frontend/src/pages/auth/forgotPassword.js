import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending reset link
        alert(`Reset link sent to ${email}`);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 20 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Forgot Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Send Reset Link
                </Button>
            </form>
        </Box>
    );
};

export default ForgotPassword;