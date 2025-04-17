import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            // Simulate password reset
            alert('Password has been reset successfully');
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 20 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Reset Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Reset Password
                </Button>
            </form>
        </Box>
    );
};

export default ResetPassword;