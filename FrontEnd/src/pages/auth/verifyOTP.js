import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { verifyOTP, requestOTP } from "../../api/auth.api";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy user object từ state truyền qua navigate trong trang đăng ký
    const userFromRegister = location.state?.user || null;
    const [email, setEmail] = useState(userFromRegister?.email || "");
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60); // Initialize cooldown to 60s
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (!userFromRegister) {
            // Nếu không có user object được truyền sang => quay lại trang đăng ký
            toast.info("User data is required for verification");
            navigate("/auth/sign_up");
        } else {
            // Show toast notification when entering the page
            toast.info("An OTP has been sent to your email");
        }
    }, [userFromRegister, navigate]);

    // Handle countdown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        if (!otp) {
            toast.info("Please enter the OTP");
            return;
        }

        setLoading(true);

        try {
            await verifyOTP(email, otp);
            toast.success("OTP verified successfully. Redirecting to sign in...");
            setTimeout(() => navigate("/auth/sign_in"), 2000);
        } catch (err) {
            toast.error(err?.response?.data?.error || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        toast.dismiss();

        try {
            // Use the full user object for resending OTP
            await requestOTP(userFromRegister);
            toast.success("New OTP sent successfully");
            setResendCooldown(60); // Reset 60-second cooldown
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 30 }}>
            <h2>OTP Verification</h2>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    disabled
                />
                <TextField
                    label="OTP"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleResendOTP}
                    disabled={resendLoading || resendCooldown > 0}
                >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                </Button>
                {resendCooldown > 0 && (
                    <Typography sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}>
                        Wait {resendCooldown} seconds to resend OTP
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default VerifyOTP;