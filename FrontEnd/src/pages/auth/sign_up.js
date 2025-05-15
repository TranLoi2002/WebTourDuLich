import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { Box, TextField, Button, Alert } from '@mui/material';
import { requestOTP } from '../../api/auth.api';
import {toast} from "react-toastify";

const Sign_Up = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        passWord: "",
        confirmPassword: "",
        roleName: "USER",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate form fields
        if (!formData.userName || !formData.email || !formData.phoneNumber || !formData.passWord || !formData.confirmPassword) {
            toast.info("Please fill in all fields");
            return;
        }
    
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            toast.info("Invalid email format");
            return;
        }

        // Validate phone number format (example: 10 digits)
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(formData.phoneNumber)) {
            toast.info("Invalid phone number format");
            return;
        }

        // Validate password length
        if (formData.passWord.length < 6) {
            toast.info("Password must be at least 6 characters long");
            return;
        }


        // Validate password and confirmPassword
        if (formData.passWord !== formData.confirmPassword) {
            toast.info("Password and Confirm Password do not match");
            return;
        }

        const user = {
            userName: formData.userName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            passWord: formData.passWord,
            roleName: formData.roleName
        };

        try {
            const res = await requestOTP(user); // Call the signup API
            toast.info("Register account success. Let's complete your sign in !!");
            navigate("/auth/verifyOTP", { state: { email: formData.email } });
        } catch (err) {
            toast.error("Register account failed. Please try again !!");
        }
    };

    return (
        <>
            <div className="image_main_signup" />
            <div className="card_sign_up">
                <div className="sign-up-left">
                    <div className="logo_header">
                        <Link to="/">
                            <img src={logo} alt="" />
                            <span>Airtrav</span>
                        </Link>
                    </div>
                    <h2>Get Started</h2>
                    <div className="forget">
                        <p>Already have an account? <Link to='/auth/sign_in'>Sign in</Link></p>
                    </div>

                    <Box className="infor" component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="userName"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Full Name"
                            name="fullName"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.fullName}
                            onChange={handleChange}

                        />
                        <TextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Password"
                            name="passWord"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.passWord}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Sign Up
                        </Button>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default Sign_Up;