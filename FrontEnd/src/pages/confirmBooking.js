import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { verifyUser } from "../api/auth.api";
// import createBooking from "../api/booking.api"

const ConfirmBooking = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectBtnPayment, setSelectBtnPayment] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState("");

    // // Kiểm tra xác thực khi tải trang
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             await verifyUser();
    //         } catch (error) {
    //             navigate("/login", { state: { from: "/confirmbooking" } });
    //         }
    //     };
    //     checkAuth();
    // }, [navigate]);

    // Khởi tạo danh sách người tham gia dựa trên số lượng
    useEffect(() => {
        const initialParticipants = [
            ...Array(state?.adults || 0)
                .fill()
                .map(() => ({
                    fullName: "",
                    gender: "",
                    ageType: "ADULT",
                })),
            ...Array(state?.children || 0)
                .fill()
                .map(() => ({
                    fullName: "",
                    gender: "",
                    ageType: "CHILD",
                })),
            ...Array(state?.babies || 0)
                .fill()
                .map(() => ({
                    fullName: "",
                    gender: "",
                    ageType: "BABY",
                })),
        ];
        setParticipants(initialParticipants);
    }, [state]);

    const handleSelectedPayment = (btn) => {
        setSelectBtnPayment(btn);
    };

    // Cập nhật thông tin người tham gia
    const handleParticipantChange = (index, field, value) => {
        setParticipants((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
        );
    };

    // Xử lý gửi booking
    const handleConfirmBooking = async () => {
        if (!selectBtnPayment) {
            setError("Please select a payment method");
            return;
        }

        // Kiểm tra thông tin người tham gia
        for (const p of participants) {
            if (!p.fullName || !p.gender || !p.ageType) {
                setError("Please fill in all participant information");
                return;
            }
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user.id);

            const bookingData = {
                userId: user.id,
                tourId: state.tour.id,
                participants,
                totalPrice: state.totalPrice,
                notes: state.discountCode ? `Discount: ${state.discountCode}` : "",
            };
            // console.log(bookingData);
            await axios.post(
                "http://localhost:8080/api/booking",
                bookingData,
                {
                    withCredentials: true,
                }
            );

            navigate(`/`);
        } catch (error) {
            setError("Error creating booking: " + (error.response?.data?.error || error.message));
        }
    };

    if (!state || !state.tour) {
        return <Typography>No tour information available</Typography>;
    }

    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
                p: 4,
                paddingTop: "120px",
                paddingRight: "150px",
                paddingLeft: "150px",
            }}
        >
            {/* Thông tin tour (Bên trái) */}
            <Box
                sx={{
                    width: "35%",
                    borderWidth: 2,
                    borderColor: "lightgray",
                    borderStyle: "solid",
                    mr: 3,
                    p: 3,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Tour Information
                </Typography>
                <Typography>
                    <strong>Name:</strong> {state.tour.title}
                </Typography>
                <Typography>
                    <strong>Tour Code:</strong> {state.tour.tourCode}
                </Typography>
                <Typography>
                    <strong>Start Date:</strong>{" "}
                    {state.tour.startDate
                        ? format(new Date(state.tour.startDate), "MMMM, dd yyyy")
                        : "N/A"}
                </Typography>
                <Typography>
                    <strong>End Date:</strong>{" "}
                    {state.tour.endDate
                        ? format(new Date(state.tour.endDate), "MMMM, dd yyyy")
                        : "N/A"}
                </Typography>
                <Typography>
                    <strong>Adults:</strong> {state.adults}
                </Typography>
                <Typography>
                    <strong>Children:</strong> {state.children}
                </Typography>
                <Typography>
                    <strong>Babies:</strong> {state.babies}
                </Typography>
                <Typography>
                    <strong>Total Price:</strong> ${state.totalPrice.toFixed(2)}
                </Typography>
                {state.discountCode && (
                    <Typography>
                        <strong>Discount Code:</strong> {state.discountCode}
                    </Typography>
                )}
            </Box>

            {/* Thông tin người tham gia và thanh toán (Bên phải) */}
            <Box
                sx={{
                    width: "65%",
                    borderWidth: 2,
                    borderColor: "lightgray",
                    borderStyle: "solid",
                    p: 3,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Participant Information
                </Typography>
                {participants.map((participant, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 3,
                            p: 2,
                            border: "1px solid lightgray",
                            borderRadius: "4px",
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Participant {index + 1} ({participant.ageType})
                        </Typography>
                        <TextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            value={participant.fullName}
                            onChange={(e) =>
                                handleParticipantChange(index, "fullName", e.target.value)
                            }
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={participant.gender}
                                onChange={(e) =>
                                    handleParticipantChange(index, "gender", e.target.value)
                                }
                                label="Gender"
                            >
                                <MenuItem value="MALE">Male</MenuItem>
                                <MenuItem value="FEMALE">Female</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                ))}

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Method
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        marginBottom: "2rem",
                        pl: 3,
                    }}
                >
                    <Button
                        sx={{
                            justifyContent: "flex-start",
                            backgroundColor: selectBtnPayment === "credit" ? "green" : "inherit",
                            color: selectBtnPayment === "credit" ? "white" : "inherit",
                        }}
                        fullWidth
                        onClick={() => handleSelectedPayment("credit")}
                    >
                        Credit Card
                    </Button>
                    <Button
                        sx={{
                            justifyContent: "flex-start",
                            backgroundColor: selectBtnPayment === "paypal" ? "green" : "inherit",
                            color: selectBtnPayment === "paypal" ? "white" : "inherit",
                        }}
                        fullWidth
                        onClick={() => handleSelectedPayment("paypal")}
                    >
                        Paypal
                    </Button>
                    <Button
                        sx={{
                            justifyContent: "flex-start",
                            backgroundColor: selectBtnPayment === "checkin" ? "green" : "inherit",
                            color: selectBtnPayment === "checkin" ? "white" : "inherit",
                        }}
                        fullWidth
                        onClick={() => handleSelectedPayment("checkin")}
                    >
                        Pay check in
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleConfirmBooking}
                >
                    Confirm Booking
                </Button>
            </Box>
        </Box>
    );
};

export default ConfirmBooking;