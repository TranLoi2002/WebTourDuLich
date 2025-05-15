// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//     Box,
//     Typography,
//     TextField,
//     Button,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
// <<<<<<< HEAD
// } from "@mui/material";
// import { format } from "date-fns";
// import axios from "axios";
// import { verifyUser } from "../api/auth.api";
// // import createBooking from "../api/booking.api"
// =======
//     IconButton,
//     Snackbar,
//     Alert,
//     CircularProgress,
// } from "@mui/material";
// import { format } from "date-fns";
// import { CreditCard, LocalAtm, Close as CloseIcon } from "@mui/icons-material";
// import { createBooking } from "../api/booking.api";
// import { getAllPaymentMethod } from "../api/payment.api";
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

// const ConfirmBooking = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const [selectBtnPayment, setSelectBtnPayment] = useState(null);
// <<<<<<< HEAD
//     const [participants, setParticipants] = useState([]);
//     const [error, setError] = useState("");

//     // // Kiểm tra xác thực khi tải trang
//     // useEffect(() => {
//     //     const checkAuth = async () => {
//     //         try {
//     //             await verifyUser();
//     //         } catch (error) {
//     //             navigate("/login", { state: { from: "/confirmbooking" } });
//     //         }
//     //     };
//     //     checkAuth();
//     // }, [navigate]);

//     // Khởi tạo danh sách người tham gia dựa trên số lượng
// =======
//     const [paymentMethods, setPaymentMethods] = useState([]);
//     const [participants, setParticipants] = useState([]);
//     const [notification, setNotification] = useState({
//         open: false,
//         message: "",
//         severity: "success",
//     });
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem("user"));
//         if (storedUser) {
//             setUser(storedUser);
//         }
//     }, []);

// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     useEffect(() => {
//         const initialParticipants = [
//             ...Array(state?.adults || 0)
//                 .fill()
//                 .map(() => ({
//                     fullName: "",
//                     gender: "",
//                     ageType: "ADULT",
//                 })),
//             ...Array(state?.children || 0)
//                 .fill()
//                 .map(() => ({
//                     fullName: "",
//                     gender: "",
//                     ageType: "CHILD",
//                 })),
//             ...Array(state?.babies || 0)
//                 .fill()
//                 .map(() => ({
//                     fullName: "",
//                     gender: "",
//                     ageType: "BABY",
//                 })),
//         ];
//         setParticipants(initialParticipants);
//     }, [state]);

// <<<<<<< HEAD
//     const handleSelectedPayment = (btn) => {
//         setSelectBtnPayment(btn);
//     };

//     // Cập nhật thông tin người tham gia
// =======
//     useEffect(() => {
//         const fetchPaymentMethods = async () => {
//             try {
//                 setLoading(true);
//                 const response = await getAllPaymentMethod();
//                 setPaymentMethods(response.data);
//                 setNotification({
//                     open: true,
//                     message: "Payment methods loaded successfully!",
//                     severity: "success",
//                 });
//             } catch (error) {
//                 console.error("Error fetching payment methods:", error);
//                 setNotification({
//                     open: true,
//                     message: "Failed to load payment methods",
//                     severity: "error",
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPaymentMethods();
//     }, []);

//     const handleSelectedPayment = (methodId) => {
//         setSelectBtnPayment(methodId);
//     };

// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     const handleParticipantChange = (index, field, value) => {
//         setParticipants((prev) =>
//             prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
//         );
//     };

// <<<<<<< HEAD
//     // Xử lý gửi booking
//     const handleConfirmBooking = async () => {
//         if (!selectBtnPayment) {
//             setError("Please select a payment method");
//             return;
//         }

//         // Kiểm tra thông tin người tham gia
//         for (const p of participants) {
//             if (!p.fullName || !p.gender || !p.ageType) {
//                 setError("Please fill in all participant information");
// =======
//     const handleCloseNotification = () => {
//         setNotification({ ...notification, open: false });
//     };

//     const handleConfirmBooking = async () => {
//         if (!selectBtnPayment) {
//             setNotification({
//                 open: true,
//                 message: "Please select a payment method",
//                 severity: "error",
//             });
//             return;
//         }

//         for (const p of participants) {
//             if (!p.fullName || !p.gender || !p.ageType) {
//                 setNotification({
//                     open: true,
//                     message: "Please fill in all participant information",
//                     severity: "error",
//                 });
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//                 return;
//             }
//         }

// <<<<<<< HEAD
//         try {
//             const user = JSON.parse(localStorage.getItem("user"));
//             console.log(user.id);

//             const bookingData = {
//                 userId: user.id,
//                 tourId: state.tour.id,
//                 participants,
//                 totalPrice: state.totalPrice,
//                 notes: state.discountCode ? `Discount: ${state.discountCode}` : "",
//             };
//             // console.log(bookingData);
//             await axios.post(
//                 "http://localhost:8080/api/booking",
//                 bookingData,
//                 {
//                     withCredentials: true,
//                 }
//             );

//             navigate(`/`);
//         } catch (error) {
//             setError("Error creating booking: " + (error.response?.data?.error || error.message));
// =======
//         setLoading(true);
//         try {
//             const user = JSON.parse(localStorage.getItem("user"));
//             const selectedPaymentMethod = paymentMethods.find(
//                 (method) => method.id === selectBtnPayment
//             );
//             const bookingData = {
//                 userId: user.id,
//                 tourId: state.tour.id,
//                 paymentMethodId: selectedPaymentMethod?.id || null,
//                 participants,
//                 totalPrice: state.totalPrice,
//                 notes: state.notes,
//             };
          
//             const response = await createBooking(bookingData);
//             console.log(response);
//             if (response.success) {
//                 setNotification({
//                     open: true,
//                     message: response.message || "Booking created successfully!",
//                     severity: "success",
//                 });
//                 navigate(`/payment/${response.data.id}`, {
//                     state: { isAuthorized: true,totalPrice: state.totalPrice },
//                 });
//             } else {
//                 setNotification({
//                     open: true,
//                     message: response.message || "Error creating booking",
//                     severity: "error",
//                 });
//             }
//         } catch (error) {
//             setNotification({
//                 open: true,
//                 message: "An unexpected error occurred",
//                 severity: "error",
//             });
//         } finally {
//             setLoading(false);
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//         }
//     };

//     if (!state || !state.tour) {
//         return <Typography>No tour information available</Typography>;
//     }

//     return (
// <<<<<<< HEAD
//         <Box
//             sx={{
//                 display: "flex",
//                 height: "100%",
//                 p: 4,
//                 paddingTop: "120px",
//                 paddingRight: "150px",
//                 paddingLeft: "150px",
//             }}
//         >
//             {/* Thông tin tour (Bên trái) */}
//             <Box
//                 sx={{
//                     width: "35%",
//                     borderWidth: 2,
//                     borderColor: "lightgray",
//                     borderStyle: "solid",
//                     mr: 3,
//                     p: 3,
//                 }}
//             >
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Tour Information
//                 </Typography>
//                 <Typography>
//                     <strong>Name:</strong> {state.tour.title}
//                 </Typography>
//                 <Typography>
//                     <strong>Tour Code:</strong> {state.tour.tourCode}
//                 </Typography>
//                 <Typography>
//                     <strong>Start Date:</strong>{" "}
//                     {state.tour.startDate
//                         ? format(new Date(state.tour.startDate), "MMMM, dd yyyy")
//                         : "N/A"}
//                 </Typography>
//                 <Typography>
//                     <strong>End Date:</strong>{" "}
//                     {state.tour.endDate
//                         ? format(new Date(state.tour.endDate), "MMMM, dd yyyy")
//                         : "N/A"}
//                 </Typography>
//                 <Typography>
//                     <strong>Adults:</strong> {state.adults}
//                 </Typography>
//                 <Typography>
//                     <strong>Children:</strong> {state.children}
//                 </Typography>
//                 <Typography>
//                     <strong>Babies:</strong> {state.babies}
//                 </Typography>
//                 <Typography>
//                     <strong>Total Price:</strong> ${state.totalPrice.toFixed(2)}
//                 </Typography>
//                 {state.discountCode && (
//                     <Typography>
//                         <strong>Discount Code:</strong> {state.discountCode}
//                     </Typography>
//                 )}
//             </Box>

//             {/* Thông tin người tham gia và thanh toán (Bên phải) */}
//             <Box
//                 sx={{
//                     width: "65%",
//                     borderWidth: 2,
//                     borderColor: "lightgray",
//                     borderStyle: "solid",
//                     p: 3,
//                 }}
//             >
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Participant Information
//                 </Typography>
//                 {participants.map((participant, index) => (
//                     <Box
//                         key={index}
//                         sx={{
//                             mb: 3,
//                             p: 2,
//                             border: "1px solid lightgray",
//                             borderRadius: "4px",
//                         }}
//                     >
//                         <Typography variant="subtitle1" sx={{ mb: 2 }}>
//                             Participant {index + 1} ({participant.ageType})
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             label="Full Name"
//                             variant="outlined"
//                             value={participant.fullName}
//                             onChange={(e) =>
//                                 handleParticipantChange(index, "fullName", e.target.value)
//                             }
//                             sx={{ mb: 2 }}
//                         />
//                         <FormControl fullWidth sx={{ mb: 2 }}>
//                             <InputLabel>Gender</InputLabel>
//                             <Select
//                                 value={participant.gender}
//                                 onChange={(e) =>
//                                     handleParticipantChange(index, "gender", e.target.value)
//                                 }
//                                 label="Gender"
//                             >
//                                 <MenuItem value="MALE">Male</MenuItem>
//                                 <MenuItem value="FEMALE">Female</MenuItem>
//                                 <MenuItem value="OTHER">Other</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Box>
//                 ))}

//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                     Payment Method
//                 </Typography>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "16px",
//                         marginBottom: "2rem",
//                         pl: 3,
//                     }}
//                 >
//                     <Button
//                         sx={{
//                             justifyContent: "flex-start",
//                             backgroundColor: selectBtnPayment === "credit" ? "green" : "inherit",
//                             color: selectBtnPayment === "credit" ? "white" : "inherit",
//                         }}
//                         fullWidth
//                         onClick={() => handleSelectedPayment("credit")}
//                     >
//                         Credit Card
//                     </Button>
//                     <Button
//                         sx={{
//                             justifyContent: "flex-start",
//                             backgroundColor: selectBtnPayment === "paypal" ? "green" : "inherit",
//                             color: selectBtnPayment === "paypal" ? "white" : "inherit",
//                         }}
//                         fullWidth
//                         onClick={() => handleSelectedPayment("paypal")}
//                     >
//                         Paypal
//                     </Button>
//                     <Button
//                         sx={{
//                             justifyContent: "flex-start",
//                             backgroundColor: selectBtnPayment === "checkin" ? "green" : "inherit",
//                             color: selectBtnPayment === "checkin" ? "white" : "inherit",
//                         }}
//                         fullWidth
//                         onClick={() => handleSelectedPayment("checkin")}
//                     >
//                         Pay check in
//                     </Button>
//                 </Box>

//                 {error && (
//                     <Typography color="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Typography>
//                 )}

//                 <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     onClick={handleConfirmBooking}
//                 >
//                     Confirm Booking
//                 </Button>
//             </Box>
//         </Box>
// =======
//         <>
//             <Snackbar
//                 open={notification.open}
//                 autoHideDuration={9000}
//                 onClose={handleCloseNotification}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 sx={{
//                     "& .MuiSnackbarContent-root": {
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                         fontWeight: "medium",
//                     },
//                 }}
//             >
//                 <Alert
//                     onClose={handleCloseNotification}
//                     severity={notification.severity}
//                     sx={{
//                         top: "100px",
//                         width: "100%",
//                         bgcolor:
//                             notification.severity === "success" ? "#e0f7fa" : "#ffebee",
//                         color: notification.severity === "success" ? "#00695c" : "#c62828",
//                         "& .MuiAlert-icon": {
//                             color: notification.severity === "success" ? "#00695c" : "#c62828",
//                         },
//                     }}
//                     action={
//                         <IconButton
//                             size="small"
//                             aria-label="close"
//                             color="inherit"
//                             onClick={handleCloseNotification}
//                         >
//                             <CloseIcon fontSize="small" />
//                         </IconButton>
//                     }
//                 >
//                     {notification.message}
//                 </Alert>
//             </Snackbar>

//             <Box
//                 sx={{
//                     display: "flex",
//                     minHeight: "100vh",
//                     p: 4,
//                     paddingTop: "120px",
//                     paddingRight: "150px",
//                     paddingLeft: "150px",
//                     background: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
//                 }}
//             >
//                 <Box
//                     sx={{
//                         width: "35%",
//                         bgcolor: "white",
//                         borderRadius: "12px",
//                         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//                         mr: 3,
//                         p: 3,
//                         transition: "transform 0.3s ease",
//                         "&:hover": {
//                             transform: "translateY(-5px)",
//                         },
//                     }}
//                 >
//                     <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1a3c34" }}>
//                         Tour Information
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <img src={state.tour.images[0]} alt={state.tour.title} />
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Name:</strong> {state.tour.title}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Start Date:</strong>{" "}
//                         {state.tour.startDate
//                             ? format(new Date(state.tour.startDate), "MMMM, dd yyyy")
//                             : "N/A"}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>End Date:</strong>{" "}
//                         {state.tour.endDate
//                             ? format(new Date(state.tour.endDate), "MMMM, dd yyyy")
//                             : "N/A"}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Adults:</strong> {state.adults}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Children:</strong> {state.children}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Babies:</strong> {state.babies}
//                     </Typography>
//                     <Typography sx={{ mb: 1, color: "#555" }}>
//                         <strong>Total Price:</strong> ${state.totalPrice.toFixed(2)}
//                     </Typography>
//                     {state.discountCode && (
//                         <Typography sx={{ mb: 1, color: "#555" }}>
//                             <strong>Discount Code:</strong> {state.discountCode}
//                         </Typography>
//                     )}
//                 </Box>

//                 <Box
//                     sx={{
//                         width: "65%",
//                         bgcolor: "white",
//                         borderRadius: "12px",
//                         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//                         p: 3,
//                         position: "relative",
//                         overflow: "hidden",
//                         backgroundImage: `url("https://www.transparenttextures.com/patterns/white-diamond.png")`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                         transition: "transform 0.3s ease",
//                         "&:hover": {
//                             transform: "translateY(-5px)",
//                         },
//                     }}
//                 >
//                     <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1a3c34" }}>
//                         User Information
//                     </Typography>
//                     {user ? (
//                         <Box sx={{ mb: 3 }}>
//                             <TextField
//                                 fullWidth
//                                 label="Name"
//                                 variant="outlined"
//                                 value={user.fullName || "N/A"}
//                                 sx={{ mb: 2, bgcolor: "#fff" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 label="Email"
//                                 variant="outlined"
//                                 value={user.email || "N/A"}
//                                 sx={{ mb: 2, bgcolor: "#fff" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 label="Phone"
//                                 variant="outlined"
//                                 value={user.phoneNumber || "N/A"}
//                                 sx={{ mb: 2, bgcolor: "#fff" }}
//                             />
//                         </Box>
//                     ) : (
//                         <Typography sx={{ mb: 3, color: "#555" }}>
//                             No user information available
//                         </Typography>
//                     )}
//                     <Typography
//                         variant="h5"
//                         sx={{ mb: 2, mt: 3, fontWeight: "bold", color: "#1a3c34" }}
//                         HP                   >
//                         Participant Information
//                     </Typography>
//                     {participants.map((participant, index) => (
//                         <Box
//                             key={index}
//                             sx={{
//                                 mb: 3,
//                                 p: 2,
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: "8px",
//                                 bgcolor: "#f9f9f9",
//                             }}
//                         >
//                             <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
//                                 Participant {index + 1} ({participant.ageType})
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 label="Full Name"
//                                 variant="outlined"
//                                 value={participant.fullName}
//                                 onChange={(e) =>
//                                     handleParticipantChange(index, "fullName", e.target.value)
//                                 }
//                                 sx={{ mb: 2, bgcolor: "white" }}
//                                 disabled={loading}
//                             />
//                             <FormControl fullWidth sx={{ mb: 2 }}>
//                                 <InputLabel>Gender</InputLabel>
//                                 <Select
//                                     value={participant.gender}
//                                     onChange={(e) =>
//                                         handleParticipantChange(index, "gender", e.target.value)
//                                     }
//                                     label="Gender"
//                                     sx={{ bgcolor: "white" }}
//                                     disabled={loading}
//                                 >
//                                     <MenuItem value="MALE">Male</MenuItem>
//                                     <MenuItem value="FEMALE">Female</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Box>
//                     ))}
//                     <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1a3c34" }}>
//                         Payment Method
//                     </Typography>
//                     <Box
//                         sx={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "12px",
//                             marginBottom: "2rem",
//                         }}
//                     >
//                         {paymentMethods.length > 0 ? (
//                             paymentMethods.map((method) => (
//                                 <Button
//                                     key={method.id}
//                                     variant="outlined"
//                                     startIcon={
//                                         method.name.toLowerCase().includes("cash") ? (
//                                             <LocalAtm />
//                                         ) : (
//                                             <CreditCard />
//                                         )
//                                     }
//                                     sx={{
//                                         justifyContent: "flex-start",
//                                         borderColor: selectBtnPayment === method.id ? "#1a73e8" : "#e0e0e0",
//                                         backgroundColor: selectBtnPayment === method.id ? "#e3f2fd" : "white",
//                                         color: selectBtnPayment === method.id ? "#1a73e8" : "#555",
//                                         textTransform: "none",
//                                         fontWeight: "medium",
//                                         padding: "10px 16px",
//                                         borderRadius: "8px",
//                                         "&:hover": {
//                                             borderColor: "#1a73e8",
//                                             backgroundColor: "#e3f2fd",
//                                         },
//                                     }}
//                                     fullWidth
//                                     onClick={() => handleSelectedPayment(method.id)}
//                                     disabled={loading}
//                                 >
//                                     {method.name.trim()}
//                                 </Button>
//                             ))
//                         ) : (
//                             <Typography sx={{ color: "#555" }}>
//                                 No payment methods available
//                             </Typography>
//                         )}
//                     </Box>

//                     <Button
//                         variant="contained"
//                         fullWidth
//                         onClick={handleConfirmBooking}
//                         disabled={loading}
//                         sx={{
//                             background: "linear-gradient(90deg, #1a73e8 0%, #4285f4 100%)",
//                             color: "white",
//                             fontWeight: "bold",
//                             textTransform: "none",
//                             padding: "12px",
//                             borderRadius: "8px",
//                             "&:hover": {
//                                 background: "linear-gradient(90deg, #4285f4 0%, #1a73e8 100%)",
//                             },
//                             "&:disabled": {
//                                 background: "linear-gradient(90deg, #90caf9 0%, #b0bec5 100%)",
//                                 cursor: "not-allowed",
//                             },
//                         }}
//                     >
//                         {loading ? (
//                             <CircularProgress size={24} color="inherit" />
//                         ) : (
//                             "Confirm Booking"
//                         )}
//                     </Button>
//                 </Box>
//             </Box>
//         </>
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     );
// };

// export default ConfirmBooking;