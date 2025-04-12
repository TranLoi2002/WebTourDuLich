import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { Box, TextField, Button, Alert } from '@mui/material';
import { signup } from '../../api/users.api';

const Sign_Up = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        passWord: "",
        confirmPassword: "",
        role: "USER",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate password and confirmPassword
        if (formData.passWord !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await signup(formData); // Call the signup API
            console.log("Signup success:", res);
            navigate("/auth/sign_in"); // Redirect to the login page
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
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
                            label="Full Name"
                            name="fullName"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.fullName}
                            onChange={handleChange}
                            // required
                        />
                        <TextField
                            label="Username"
                            name="userName"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.userName}
                            onChange={handleChange}
                            // required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.email}
                            onChange={handleChange}
                            // required
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            // required
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
                            // required
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
                            // required
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