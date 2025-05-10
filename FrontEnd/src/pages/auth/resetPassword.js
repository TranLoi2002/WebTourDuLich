import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../api/auth.api";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await resetPassword({ email, otp, newPassword });
            setSuccess("Đặt lại mật khẩu thành công");
            setTimeout(() => navigate("/auth/sign_in"), 1500);
        } catch (err) {
            setError(err.error || "Đặt lại mật khẩu thất bại");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h5" gutterBottom>Đặt lại mật khẩu</Typography>
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
                    label="Mật khẩu mới"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    label="Xác nhận mật khẩu"
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
                    Xác nhận
                </Button>
            </form>
        </Box>
    );
};

export default ResetPassword;