import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../api/auth.api";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import {toast}  from "react-toastify";
import {Navigate} from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // prevent access though login
    if (!email) {
        return <Navigate to="/auth/sign_in" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if(otp.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await resetPassword({ email, otp, newPassword });
            toast.success("Password reset successfully");
            setTimeout(() => navigate("/auth/sign_in"), 1500);
        } catch (err) {
            toast.info("Reset password failed");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={14}>
            <Typography variant="h5" className="" gutterBottom>Reset Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="OTP"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <TextField
                    label="New Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Done
                </Button>
            </form>
        </Box>
    );
};

export default ResetPassword;