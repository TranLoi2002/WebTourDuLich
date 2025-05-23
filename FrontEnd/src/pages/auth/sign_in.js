import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField,
    Box,
    Button,
    Checkbox,
    CircularProgress,
} from "@mui/material";
import logo from "../../assets/images/logo.png";
import { login } from "../../api/auth.api";
import { toast } from "react-toastify";

const Sign_In = () => {
    const [formData, setFormData] = useState({ email: "", passWord: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        toast.dismiss();
        setLoading(true);

        if (!formData.email || !formData.passWord) {
            toast.info("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const res = await login(formData);
            localStorage.setItem("user", JSON.stringify(res.user));

            if (res.user?.role?.roleName === "ADMIN") {
                toast.success("Login successful. Welcome Admin!");
                navigate("/admin");
            } else {
                toast.success("Login successful.");
                navigate("/");
            }
        } catch (err) {
            console.error("Full error:", err.response?.data);

            const data = err.response?.data;

            if (data && typeof data === "object") {
                // Duyệt qua từng lỗi trong object
                Object.values(data).forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                toast.error("Login failed. Please try again.");
            }
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
                        label="Email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        required
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