import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../api/auth.api";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import {Navigate} from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // prevent access though login
    if (!email) {
        return <Navigate to="/auth/sign_in" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous toast
        toast.dismiss();

        // Validate input
        if (!otp || !newPassword || !confirmPassword) {
            toast.info("Please fill in all fields");
            return;
        }

        if (newPassword.length < 8) {
            toast.info("Password must be at least 8 characters long");
            return;
        }

        const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!pattern.test(newPassword)) {
            toast.info("Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character, minimum 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.info("Password and confirmation do not match");
            return;
        }

        setLoading(true);

        try {
            await resetPassword({ email, otp, newPassword });
            toast.success("Password has been reset successfully");
            setTimeout(() => navigate("/auth/sign_in"), 1500);
        } catch (err) {
            toast.error(err?.error || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h5" gutterBottom>Reset Password</Typography>
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
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Confirm"}
                </Button>
            </form>
        </Box>
    );
};

export default ResetPassword;