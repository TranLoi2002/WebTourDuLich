import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { verifyOTP } from "../../api/auth.api";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy email từ state truyền qua navigate trong trang đăng ký
    const emailFromRegister = location.state?.email || "";
    const [email, setEmail] = useState(emailFromRegister);
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!emailFromRegister) {
            // Nếu không có email được truyền sang => quay lại trang đăng ký
            toast.info("Email is required for verification");
            navigate("/auth/sign_up");
        }
    }, [emailFromRegister, navigate]);

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

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
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
            </Box>
        </Box>
    );
};

export default VerifyOTP;
