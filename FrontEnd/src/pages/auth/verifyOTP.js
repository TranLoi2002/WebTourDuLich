import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, TextField, Button, Alert } from "@mui/material";
import { verifyOTP } from "../../api/auth.api";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy email từ state truyền qua navigate trong trang đăng ký
    const emailFromRegister = location.state?.email || "";
    const [email, setEmail] = useState(emailFromRegister);
    const [otp, setOTP] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!emailFromRegister) {
            // Nếu không có email được truyền sang => quay lại trang đăng ký
            navigate("/auth/sign_up");
        }
    }, [emailFromRegister, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            console.log(email,otp);

            const res = await verifyOTP( email, otp );
            console.log(res);

            setSuccess("Xác thực thành công! Đang chuyển đến trang đăng nhập...");
            setTimeout(() => navigate("/auth/sign_in"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Xác thực OTP thất bại");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
            <h2>Xác Thực OTP</h2>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    disabled // không cho người dùng sửa email
                />
                <TextField
                    label="OTP"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Xác Thực
                </Button>
            </Box>
        </Box>
    );
};

export default VerifyOTP;
