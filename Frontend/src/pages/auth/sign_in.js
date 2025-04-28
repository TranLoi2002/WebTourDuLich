import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Alert,
} from "@mui/material";
import logo from "../../assets/images/logo.png";
import { login } from "../../api/auth.api";
import {toast} from "react-toastify";

const Sign_In = () => {
    const [formData, setFormData] = useState({ userName: "", passWord: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // validate
        if (!formData.userName || !formData.passWord) {
            toast.info("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const res = await login(formData); // Gọi API login
            // console.log(res);
            localStorage.setItem("user", JSON.stringify(res.user)); // Lưu thông tin người dùng vào localStorage

            // Điều hướng dựa trên vai trò
            if (res.user?.role?.roleName === "ADMIN") {
                toast.success("Login success with Admin.");
                navigate("/admin");
            } else {
                toast.success("Login successfully.");
                navigate("/");
            }
        } catch (err) {
            console.error("Login error", err);
            const message =
                err.response?.data?.error || "Login failed. Please try again.";
            toast.error(message); // Hiển thị lỗi
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-sign-in">
            <div className="sign-in-left">
                <div className="sign-in-brand">
                    <Link to="/" title="Back Home">
                        <img src={logo} alt="Logo" className="logo" />
                        <span>Airtrav</span>
                    </Link>
                </div>

                <h2>Welcome Back</h2>
                <h3 style={{ fontSize: "1rem", fontWeight: "normal", color: "lightgray" }}>
                    Please enter your details.
                </h3>

                <Box
                    className="form_sign_in"
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                >
                    <TextField
                        label="Username"
                        name="userName"
                        variant="outlined"
                        fullWidth
                        value={formData.userName}
                        onChange={handleChange}
                        // required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="passWord"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.passWord}
                        onChange={handleChange}
                        // required
                        margin="normal"
                    />

                    <div className="section_remem_forgot">
                        <label style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox />
                            <span>Remember me</span>
                        </label>
                        <Link
                            to="/auth/forgotpassword"
                            style={{ fontSize: "0.8rem", color: "#3B71FE" }}
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    {error && (
                        <Alert severity="error" style={{ marginTop: 10 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: 20 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "LOGIN"
                        )}
                    </Button>
                </Box>

                <div className="sign-in-ques" style={{ marginTop: 20 }}>
                    <span>Don't have an account?</span>{" "}
                    <Link to="/auth/sign_up">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Sign_In;