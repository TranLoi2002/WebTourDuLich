// <<<<<<< HEAD
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getDetailTour, getReviewOfTour } from "../../api/tour.api";
// =======
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getDetailTour, getRelatedTourByLocationId } from "../../api/tour.api";
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { format } from "date-fns";
// import { verifyUser } from "../../api/auth.api";
// <<<<<<< HEAD
// =======
// import {
//     createReview,
//     getReviewOfTour,
//     addReply,
//     getRepliesByReviewId,
//     uploadImages,
//     getCountReplies
// } from "../../api/review.api";
// import { getUserById } from "../../api/user.api";
// import { toast } from "react-toastify";
// import HorizontalLayout from "../../components/horizontalLayout";
// import Modal from "react-modal";

// // Bind modal to app element for accessibility
// Modal.setAppElement("#root");

// // Sub-component for Tour Information (unchanged)
// const TourInfo = ({ tour, randomImage, showImages, setShowImages }) => (
//     <div className="trip_main">
//         <div className="trip_infor">
//             {tour && tour.tourType ? (
//                 <>
//                     <span className="Tour">{tour.tourType.name}</span>
//                     <label>
//                         <i className="fa-solid fa-location-dot"></i>
//                         <span>{tour.location.name}</span>
//                     </label>
//                 </>
//             ) : (
//                 <p>No tour information available.</p>
//             )}
//         </div>
//         <div className="top">
//             <div className="image_main">
//                 <img src={tour.thumbnail} alt="Main Tour" />
//             </div>
//             <div className="image_second">
//                 {tour.images.slice(0, 1).map((image, index) => (
//                     <img key={index} src={image} alt={`Tour Image ${index + 1}`} />
//                 ))}
//                 <div className="image_third w-full h-full overflow-hidden">
//                     <div className="absolute w-full h-full bg-gradient-to-b from-black to-transparent rounded-lg"></div>
//                     <img src={tour.images[1]} alt={`Tour Image 3`} />
//                     {tour.images.length > 1 && (
//                         <button className="more_images_button" onClick={() => setShowImages(true)}>
//                             +{tour.images.length - 2} more
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//         {showImages && (
//             <div className="image_modal_overlay">
//                 <div className="image_modal">
//                     <button className="close_button" onClick={() => setShowImages(false)}>
//                         ×
//                     </button>
//                     <Swiper spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }}
//                         modules={[Navigation, Pagination]}>
//                         {tour.images.map((image, index) => (
//                             <SwiperSlide key={index}>
//                                 <img src={image} alt={`Tour Image ${index + 1}`} className="modal_image" />
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>
//             </div>
//         )}
//         <div className="top_infor">
//             <div className="review">{randomImage && <img src={randomImage} alt="Image Tour" />}</div>
//             <div className="content">
//                 <div className="details_review">
//                     <span>{tour.averageRating.toFixed(1)}</span>
//                     <i className="fa-solid fa-star text-yellow-600"></i>
//                     <span>
//                         - ({tour.totalReviews} <i className="fa-solid fa-people-group"></i>)
//                     </span>
//                 </div>
//                 <h2 id="name">{tour.title}</h2>
//                 <div className="details">
//                     <label>
//                         <span>Tour Code:</span>
//                         <a href="#" id="tcode">{tour.tourCode}</a>
//                     </label>
//                     <label>
//                         <span>Duration:</span>
//                         <a href="#" id="dura">{tour.duration}</a>
//                     </label>
//                     <label>
//                         <span>Place of departure:</span>
//                         <a href="#" id="place">{tour.placeOfDeparture}</a>
//                     </label>
//                     <label>
//                         <span>Current seat:</span>
//                         <a href="#">{tour.currentParticipants} / {tour.maxParticipants}</a>
//                     </label>
//                 </div>
//             </div>
//         </div>
//     </div>
// );
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

// // Sub-component for Booking Form (unchanged)
// const BookingForm = ({
//     tour,
//     adults,
//     setAdults,
//     children,
//     setChildren,
//     babies,
//     setBabies,
//     discountCode,
//     setDiscountCode,
//     totalPrice,
//     handleSubmit,
//     checkGiamGia,
//     totalPassengers,
//     isBooking
// }) => {
//     const availableSeats = tour.maxParticipants - tour.currentParticipants;

//     const handlePassengerChange = (type, value) => {
//         const newTotalPassengers =
//             (type === "adults" ? value : adults) +
//             (type === "children" ? value : children) +
//             (type === "babies" ? value : babies);

//         if (newTotalPassengers > availableSeats) {
//             toast.error("The number of passengers exceeds the available seats!");
//             return;
//         }

//         if (type === "adults") setAdults(value);
//         if (type === "children") setChildren(value);
//         if (type === "babies") setBabies(value);
//     };

//     return (
//         <div className="book_container">
//             <div className="book_now">
//                 <h2 className="font-bold text-primary">Trip summary</h2>
//                 <div className="infor_book">
//                     <img src={tour.thumbnail} alt="" />
//                     <p>{tour.title}</p>
//                 </div>
//                 <div className="schedule">
//                     <label>
//                         <i className="fa-solid fa-calendar-days"></i>
//                         <span>Start your trip - {tour.startDate ? format(new Date(tour.startDate), "MMMM, dd yyyy") : "N/A"}</span>
//                     </label>
//                     <label>
//                         <i className="fa-solid fa-calendar-days"></i>
//                         <span>End your trip - {tour.endDate ? format(new Date(tour.endDate), "MMMM, dd yyyy") : "N/A"}</span>
//                     </label>
//                 </div>
//                 <div className="infor_booking">
//                     <label>
//                         <h4>Passenger
//                             <span className="text-[0.8rem] text-gray-500">(Available : {availableSeats} seat)</span>
//                         </h4>
//                         <span>{totalPassengers}</span>
//                     </label>
//                     <label>
//                         <h4>Adult</h4>
//                         <div className="discrea">
//                             <i className="fa-solid fa-minus"
//                                 onClick={() => handlePassengerChange("adults", Math.max(0, adults - 1))}></i>
//                             <span>{adults}</span>
//                             <i className="fa-solid fa-plus"
//                                 onClick={() => handlePassengerChange("adults", adults + 1)}></i>
//                         </div>
//                     </label>
//                     <label>
//                         <h4>Children</h4>
//                         <div className="discrea">
//                             <i className="fa-solid fa-minus"
//                                 onClick={() => handlePassengerChange("children", Math.max(0, children - 1))}></i>
//                             <span>{children}</span>
//                             <i className="fa-solid fa-plus"
//                                 onClick={() => handlePassengerChange("children", children + 1)}></i>
//                         </div>
//                     </label>
//                     <label>
//                         <h4>Baby</h4>
//                         <div className="discrea">
//                             <i className="fa-solid fa-minus"
//                                 onClick={() => handlePassengerChange("babies", Math.max(0, babies - 1))}></i>
//                             <span>{babies}</span>
//                             <i className="fa-solid fa-plus"
//                                 onClick={() => handlePassengerChange("babies", babies + 1)}></i>
//                         </div>
//                     </label>
//                     <label className="discount">
//                         <h4>Discount Code</h4>
//                         <div className="discrea">
//                             <input
//                                 type="text"
//                                 placeholder="Add Code"
//                                 value={discountCode}
//                                 className="border-2 rounded px-2 py-4"
//                                 onChange={(e) => setDiscountCode(e.target.value)}
//                             />
//                             <button onClick={checkGiamGia}>Apply</button>
//                         </div>
//                     </label>
//                     <label className="total">
//                         <h4>TOTAL</h4>
//                         <div className="discrea_total">
//                             <span>${totalPrice.toFixed(2)}</span>
//                         </div>
//                     </label>
//                     <button
//                         disabled={adults < 1 || isBooking}
//                         className={`book_submit ${adults < 1 || isBooking ? "opacity-50 cursor-not-allowed" : ""}`}
//                         onClick={handleSubmit}
//                     >
//                         {isBooking ? "Booking..." : "BOOK NOW"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Updated ReviewSection with Star Rating, Image Upload, and Modal
// const ReviewSection = ({
//     reviews,
//     user,
//     newReview,
//     setNewReview,
//     rating,
//     setRating,
//     images,
//     setImages,
//     handleReviewSubmit,
//     toggleReplies,
//     handleReplySubmit,
//     newReply,
//     setNewReply,
//     loadMoreReviews,
//     hasMore,
//     tour,
//     allReviews,
//     setModalIsOpen
// }) => {
//     const [modalIsOpen, setModalIsOpenLocal] = useState(false);

//     // Sync local modal state with parent
//     const handleModalToggle = (isOpen) => {
//         setModalIsOpenLocal(isOpen);
//         setModalIsOpen(isOpen);
//     };

//     // Handle image selection with limit
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files).slice(0, 5 - images.length);
//         if (files.length < e.target.files.length) {
//             toast.warn("Maximum 5 images allowed.");
//         }
//         const newImages = files.map((file) => ({
//             file,
//             preview: URL.createObjectURL(file),
//         }));
//         setImages((prev) => [...prev, ...newImages]);
//     };

//     // Remove an image from the preview
//     const removeImage = (index) => {
//         setImages((prev) => {
//             const updatedImages = [...prev];
//             URL.revokeObjectURL(updatedImages[index].preview);
//             updatedImages.splice(index, 1);
//             return updatedImages;
//         });
//     };

//     // Render stars for rating selection
//     const renderStars = (currentRating, isEditable = false) => {
//         const stars = [];
//         for (let i = 1; i <= 5; i++) {
//             stars.push(
//                 <i
//                     key={i}
//                     className={`fa-solid fa-star ${i <= currentRating ? "text-yellow-600" : "text-gray-300"} ${isEditable ? "cursor-pointer" : ""}`}
//                     onClick={isEditable ? () => setRating(i) : undefined}
//                     aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
//                     role={isEditable ? "button" : "img"}
//                 ></i>
//             );
//         }
//         return stars;
//     };

//     // Render a single review (reused in main section and modal)
//     const renderReview = (review, index) => (
//         <div className="review flex-col" key={`${review.id}-${index}`}>
//             <div className="review_header">
//                 <div className="review_avt">
//                     <img src={review.avatar || "https://picsum.photos/600"} alt="avt-user" />
//                 </div>
//                 <div className="review_infor flex items-center justify-between">
//                     <div>
//                         <h4 className="font-bold">{review.userName}</h4>
//                     </div>
//                     <div>
//                         <p className="text-gray-400">posted in {format(new Date(review.createdAt), "MMMM, dd yyyy")}</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="review_content">
//                 <div className="review_star flex">{renderStars(review.rating)}</div>
//                 <p className="review_detail_content">{review.comment}</p>
//                 {review.images?.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                         {Array.isArray(review.images) && review.images.map((image, imgIndex) => (
//                             <img
//                                 key={imgIndex}
//                                 src={image}
//                                 alt={`Review Image ${imgIndex + 1}`}
//                                 className="w-24 h-24 object-cover rounded"
//                                 loading="lazy"
//                             />
//                         ))}
//                     </div>
//                 )}
//                 <div className="review_icon">
//                     <div className="review_icon_like">
//                         <i className="fa-solid fa-thumbs-up"></i>
//                         <i className="fa-solid fa-thumbs-down"></i>
//                     </div>
//                     <div className="items-center">
//                         <button onClick={() => toggleReplies(review.id)}>
//                             {review.replies ? "Hide" : `Reply (${review.countReplies || 0})`}
//                         </button>
//                         <i className="fa-solid fa-ellipsis-vertical ml-3"></i>
//                     </div>
//                 </div>
//                 {review.replies && (
//                     <div className="w-full border-2 p-4">
//                         {review.replies.map((reply) => (
//                             <div key={reply.id} className="reply">
//                                 <div className="flex items-center justify-between">
//                                     <p>
//                                         <strong>Replier: {reply.userId === user?.id ? "me" : reply.userName}</strong>
//                                     </p>
//                                     <p className="text-gray-500">posted
//                                         in {format(new Date(reply.createdAt), "MMMM, dd yyyy")}</p>
//                                 </div>
//                                 <p className="w-[70%] ml-6">{reply.content}</p>
//                             </div>
//                         ))}
//                         <textarea
//                             className="w-full border rounded p-2 mb-2 mt-3"
//                             value={newReply[review.id] || ""}
//                             onChange={(e) =>
//                                 setNewReply((prev) => ({
//                                     ...prev,
//                                     [review.id]: e.target.value,
//                                 }))
//                             }
//                             placeholder="Write a reply..."
//                         />
//                         <button
//                             className="bg-primary text-white px-4 py-2 rounded"
//                             onClick={() => handleReplySubmit(review.id)}
//                         >
//                             Answer
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

//     return (
//         <div className="reviews_customer">
//             <div className="flex justify-between gap-4 mb-4">
//                 <div>
//                     <h3 className="font-bold">Customer Reviews</h3>
//                     <div className="details_review">
//                         <span>{tour.averageRating.toFixed(1)}</span>
//                         <i className="fa-solid fa-star text-yellow-600"></i>
//                         <span>
//                             - ({tour.totalReviews} <i className="fa-solid fa-people-group"></i>)
//                         </span>
//                     </div>
//                 </div>
//                 <div>
//                     <span className="text-primary cursor-pointer" onClick={() => handleModalToggle(true)}>
//                         See all
//                     </span>
//                 </div>
//             </div>

//             <div className="review_form mb-6">
//                 <div className="mb-2">
//                     <label className="font-semibold">Your Rating:</label>
//                     <div className="flex">{renderStars(rating, true)}</div>
//                 </div>
//                 <textarea
//                     className="w-full border rounded p-2 mb-2"
//                     placeholder="Write your review here..."
//                     value={newReview}
//                     onChange={(e) => setNewReview(e.target.value)}
//                 />
//                 <div className="mb-2">
//                     <label className="font-semibold">Upload Images:</label>
//                     <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="w-full border rounded p-2"
//                         onChange={handleImageChange}
//                     />
//                 </div>
//                 {images.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                         {images.map((image, index) => (
//                             <div key={index} className="relative">
//                                 <img src={image.preview} alt={`Preview ${index}`}
//                                     className="w-24 h-24 object-cover rounded" />
//                                 <button
//                                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                                     onClick={() => removeImage(index)}
//                                 >
//                                     ×
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//                 <button
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                     onClick={handleReviewSubmit}
//                     disabled={!newReview || rating === 0}
//                 >
//                     Submit
//                 </button>
//             </div>

//             {reviews.length > 0 ? (
//                 reviews.map((review, index) => renderReview(review, index))
//             ) : (
//                 <div className="no_reviews">
//                     <p className="text-gray-600">No reviews available for this tour.</p>
//                 </div>
//             )}
//             {hasMore && (
//                 <button onClick={loadMoreReviews} className="load-more-button">
//                     Load More Reviews
//                 </button>
//             )}

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={() => handleModalToggle(false)}
//                 style={{
//                     content: {
//                         position: "absolute",
//                         top: "0",
//                         right: "0 !important",
//                         bottom: "0",
//                         width: "50vw",
//                         height: "100vh",
//                         // padding: "20px",
//                         paddingTop: "40px !important",
//                         overflow: "auto",
//                         backgroundColor: "#fff",
//                         border: "none",
//                         zIndex: 1000,
//                         boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
//                         inset: "unset !important",
//                         paddingLeft: "0 !important",
//                         paddingRight: "0 !important",
//                     },
//                     overlay: {
//                         zIndex: 999,
//                         backgroundColor: "rgba(0, 0, 0, 0.5)",
//                     },
//                 }}
//             >
//                 <div className="modal-header flex justify-between items-center mb-4 mt-6">
//                     <h2 className="font-bold text-xl ml-[40px]">All Reviews ({allReviews.length})</h2>
//                     <button
//                         onClick={() => handleModalToggle(false)}
//                         style={{ fontSize: "1.5rem", cursor: "pointer" }}
//                     >
//                         ✕
//                     </button>
//                 </div>
//                 <div className="modal-body reviews_customer">
//                     {allReviews.length > 0 ? (
//                         allReviews.map((review, index) => renderReview(review, index))
//                     ) : (
//                         <p className="text-gray-600">No reviews available for this tour.</p>
//                     )}
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// // Main Component
// const DetailTour = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [tour, setTour] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedNotes, setSelectedNotes] = useState([]);
//     const [showImages, setShowImages] = useState(false);
//     const [randomImage, setRandomImage] = useState(null);
// <<<<<<< HEAD
//     const [reviews, setReviews] = useState([]);
// =======
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     const [adults, setAdults] = useState(0);
//     const [children, setChildren] = useState(0);
//     const [babies, setBabies] = useState(0);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [discountCode, setDiscountCode] = useState("");
// <<<<<<< HEAD

//     // Cập nhật số lượng người
//     const addAdult = () => setAdults(adults + 1);
//     const minusAdult = () => setAdults(Math.max(0, adults - 1));
//     const addChild = () => setChildren(children + 1);
//     const minusChild = () => setChildren(Math.max(0, children - 1));
//     const addBaby = () => setBabies(babies + 1);
//     const minusBaby = () => setBabies(Math.max(0, babies - 1));

//     // Tính tổng giá tiền
//     useEffect(() => {
//         if (tour) {
//             const basePrice = tour.price || 0;
//             const total = adults * basePrice + children * basePrice * 0.7 + babies * basePrice * 0.3;
//             setTotalPrice(total);
//         }
//     }, [adults, children, babies, tour]);

//     // Kiểm tra mã giảm giá
//     const checkGiamGia = () => {
//         if (discountCode === "DISCOUNT10") {
//             setTotalPrice((prev) => prev * 0.9);
//         }
//     };

//     // Xử lý khi nhấn "BOOK NOW"
//     const handleSubmit = async () => {
//         try {
//             const user = await verifyUser();
//             navigate("/confirmbooking", {
//                 state: {
//                     tour,
//                     adults,
//                     children,
//                     babies,
//                     totalPrice,
//                     discountCode,
//                     userId: user.id,
//                 },
//             });
//         } catch (error) {
//             console.error("User not authenticated:", error);
//             navigate("/auth/sign_in", { state: { from: `/tour/${id}` } });
//         }
//     };

//     // Lấy danh sách đánh giá
// =======
//     const [reviews, setReviews] = useState([]);
//     const [newReview, setNewReview] = useState("");
//     const [rating, setRating] = useState(0);
//     const [images, setImages] = useState([]);
//     const [user, setUser] = useState(null);
//     const [newReply, setNewReply] = useState({});
//     const [page, setPage] = useState(0);
//     const [hasMore, setHasMore] = useState(true);
//     const [relatedTours, setRelatedTours] = useState([]);
//     const [userCache, setUserCache] = useState({});
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [allReviews, setAllReviews] = useState([]);
//     const [isBooking, setIsBooking] = useState(false);
//     // Fetch user
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
// <<<<<<< HEAD
//                 const reviews = await getReviewOfTour(id);
//                 setReviews(reviews);
// =======
//                 const verifiedUser = await verifyUser();
//                 setUser(verifiedUser);
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//             } catch (error) {
//                 console.error("User not authenticated:", error);
//             }
//         };
// <<<<<<< HEAD
//         fetchReviewsByTourId();
//     }, [id]);

//     // Lấy chi tiết tour
// =======
//         fetchUser();
//     }, []);

//     // Fetch tour details
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     useEffect(() => {
//         const fetchTourDetails = async () => {
//             if (!id) {
//                 setError("Invalid tour ID");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 const response = await getDetailTour(id);
//                 if (!response) {
//                     throw new Error("No data returned from API");
//                 }
//                 setTour(response);
// <<<<<<< HEAD
//                 setSelectedNotes(JSON.parse(response.notes || "[]"));
// =======
//                 try {
//                     setSelectedNotes(JSON.parse(response.notes || "[]"));
//                 } catch (e) {
//                     console.error("Error parsing notes:", e);
//                     setSelectedNotes([]);
//                 }
//                 if (response.images?.length > 0) {
//                     const randomIndex = Math.floor(Math.random() * response.images.length);
//                     setRandomImage(response.images[randomIndex]);
//                 }
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//             } catch (error) {
//                 console.error("Error fetching tour details:", error);
//                 setError("Failed to load tour details");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTourDetails();
//     }, [id]);

// <<<<<<< HEAD
//     // Lấy hình ảnh ngẫu nhiên
// =======
//     // Fetch related tours
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//     useEffect(() => {
//         const fetchRelatedTours = async () => {
//             try {
//                 if (tour?.location?.id) {
//                     const response = await getRelatedTourByLocationId(tour.location.id, tour.id, 5);
//                     setRelatedTours(response);
//                 }
//             } catch (error) {
//                 console.error("Error fetching related tours:", error);
//             }
//         };

//         fetchRelatedTours();
//     }, [tour]);

//     // Calculate total price
//     useEffect(() => {
//         if (tour) {
//             const basePrice = tour.price || 0;
//             const total = adults * basePrice + children * basePrice * 0.7 + babies * basePrice * 0.3;
//             setTotalPrice(total);
//         }
//     }, [adults, children, babies, tour]);

//     // Fetch paginated reviews for main section
//     useEffect(() => {
//         const fetchReviewsWithUserDetails = async () => {
//             try {
//                 const response = await getReviewOfTour(id, page, 5);
//                 const reviewsWithUserDetails = await Promise.all(
//                     (response.content || []).map(async (review) => {
//                         let userDetails = userCache[review.userId];
//                         if (!userDetails) {
//                             userDetails = await getUserById(review.userId);
//                             setUserCache((prev) => ({ ...prev, [review.userId]: userDetails }));
//                         }
//                         const countReplies = await getCountReplies(review.id);
//                         return { ...review, userName: userDetails.userName, avatar: userDetails.avatar, countReplies };
//                     })
//                 );

//                 setReviews((prevReviews) => {
//                     const newReviews = reviewsWithUserDetails.filter(
//                         (newReview) => !prevReviews.some((prevReview) => prevReview.id === newReview.id)
//                     );
//                     return [...prevReviews, ...newReviews];
//                 });

//                 if (response.totalPages && page + 1 >= response.totalPages) setHasMore(false);
//             } catch (error) {
//                 console.error("Error fetching reviews:", error);
//             }
//         };

//         if (id) fetchReviewsWithUserDetails();
//     }, [id, page, userCache]);

//     // Fetch all reviews for modal
//     useEffect(() => {
//         const fetchAllReviews = async () => {
//             if (!modalIsOpen || !id || !tour?.totalReviews) return;

//             try {
//                 // Try fetching all reviews with tour.totalReviews as size
//                 const response = await getReviewOfTour(id, 0, tour.totalReviews);
//                 let allFetchedReviews = response.content || [];

//                 // If the response doesn't contain all reviews, fetch iteratively
//                 if (allFetchedReviews.length < tour.totalReviews) {
//                     let currentPage = 0;
//                     const pageSize = 10; // Adjust based on backend limits
//                     allFetchedReviews = [];

//                     while (allFetchedReviews.length < tour.totalReviews) {
//                         const pageResponse = await getReviewOfTour(id, currentPage, pageSize);
//                         allFetchedReviews = [...allFetchedReviews, ...(pageResponse.content || [])];
//                         if (pageResponse.content.length < pageSize) break; // No more reviews
//                         currentPage++;
//                     }
//                 }

//                 const reviewsWithUserDetails = await Promise.all(
//                     allFetchedReviews.map(async (review) => {
//                         let userDetails = userCache[review.userId];
//                         if (!userDetails) {
//                             userDetails = await getUserById(review.userId);
//                             setUserCache((prev) => ({ ...prev, [review.userId]: userDetails }));
//                         }
//                         const countReplies = await getCountReplies(review.id);
//                         return { ...review, userName: userDetails.userName, avatar: userDetails.avatar, countReplies };
//                     })
//                 );

//                 setAllReviews(reviewsWithUserDetails);
//             } catch (error) {
//                 console.error("Error fetching all reviews:", error);
//                 toast.error("Failed to load all reviews");
//             }
//         };

//         fetchAllReviews();
//     }, [modalIsOpen, id, tour, userCache]);

//     // Handle review submission
//     const handleReviewSubmit = useCallback(async () => {
//         if (!user) {
//             toast.info("Please log in to submit a review.");
//             return;
//         }

//         try {
//             // Step 1: Create review without images
//             const reviewData = {
//                 tourId: id,
//                 userId: user.id,
//                 comment: newReview,
//                 rating,
//                 images: [],
//             };
//             const createdReview = await createReview(reviewData);

//             // Step 2: Get reviewId from the created review
//             const reviewId = createdReview.id;

//             // Step 3: Upload images if any
//             let uploadedImageUrls = [];
//             if (images.length > 0) {
//                 const formData = new FormData();
//                 images.forEach((image) => {
//                     formData.append("images", image.file);
//                 });
//                 uploadedImageUrls = await uploadImages(reviewId, formData);
//             }

//             // Step 4: Update reviews list with images
//             const userDetails = userCache[user.id] || (await getUserById(user.id));
//             setUserCache((prev) => ({ ...prev, [user.id]: userDetails }));

//             const newReviewWithDetails = {
//                 ...createdReview,
//                 userName: userDetails.userName,
//                 avatar: userDetails.avatar,
//                 images: uploadedImageUrls,
//                 countReplies: 0,
//             };

//             setReviews((prevReviews) => [newReviewWithDetails, ...prevReviews]);
//             setAllReviews((prevAllReviews) => [newReviewWithDetails, ...prevAllReviews]);

//             toast.success("Review posted! Thank you for your feedback.");
//             setNewReview("");
//             setRating(0);
//             setImages((prev) => {
//                 prev.forEach((image) => URL.revokeObjectURL(image.preview));
//                 return [];
//             });
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             toast.error("Failed to submit review");
//         }
//     }, [user, id, newReview, rating, images, userCache]);

//     // Check discount code
//     const checkGiamGia = useCallback(() => {
//         if (discountCode === "DISCOUNT10") {
//             setTotalPrice((prev) => prev * 0.9);
//             toast.success("Discount applied!");
//         } else {
//             toast.error("Invalid discount code");
//         }
//     }, [discountCode]);

//     // Handle booking submission
//     const handleSubmit = useCallback(async () => {
//         if (adults < 1) {
//             toast.error("Please select at least one adult.");
//             return;
//         }
//         setIsBooking(true);
//         try {
//             const user = await verifyUser();
//             const notesString = selectedNotes.join(",");
//             console.log("notesString",notesString);
//             console.log("selectedNotes",selectedNotes);

//             navigate("/confirmbooking", {
//                 state: { tour, adults, children, babies, totalPrice, discountCode, userId: user.id, notes: notesString },
//             });
//         } catch (error) {
//             console.error("User not authenticated:", error);
//             navigate("/auth/sign_in", { state: { from: `/tour/${id}` } });
//         }
//         finally {
//             setIsBooking(false);
//         }
//     }, [tour, adults, children, babies, totalPrice, discountCode, id, navigate, selectedNotes]);

//     // Handle note change
//     const handleNoteChange = useCallback((note) => {
//         setSelectedNotes((prevNotes) =>
//             prevNotes.includes(note) ? prevNotes.filter((n) => n !== note) : [...prevNotes, note]
//         );
//     }, []);

//     // Fetch replies
//     const fetchReplies = useCallback(
//         async (reviewId) => {
//             try {
//                 const fetchedReplies = await getRepliesByReviewId(reviewId);
//                 const repliesWithUserDetails = await Promise.all(
//                     fetchedReplies.map(async (reply) => {
//                         let userDetails = userCache[reply.userId];
//                         if (!userDetails) {
//                             userDetails = await getUserById(reply.userId);
//                             setUserCache((prev) => ({ ...prev, [reply.userId]: userDetails }));
//                         }
//                         return { ...reply, userName: userDetails.userName };
//                     })
//                 );

//                 setReviews((prevReviews) =>
//                     prevReviews.map((review) =>
//                         review.id === reviewId ? { ...review, replies: repliesWithUserDetails } : review
//                     )
//                 );
//                 setAllReviews((prevAllReviews) =>
//                     prevAllReviews.map((review) =>
//                         review.id === reviewId ? { ...review, replies: repliesWithUserDetails } : review
//                     )
//                 );
//             } catch (error) {
//                 console.error("Error fetching replies:", error);
//             }
//         },
//         [userCache]
//     );

//     // Handle reply submission
//     const handleReplySubmit = useCallback(
//         async (reviewId) => {
//             if (!user) {
//                 toast.info("Please log in to reply.");
//                 return;
//             }

//             try {
//                 const replyData = {
//                     reviewId,
//                     content: newReply[reviewId] || "",
//                     userId: user.id,
//                 };
//                 const createdReply = await addReply(replyData);
//                 const userDetails = userCache[user.id] || (await getUserById(user.id));
//                 setUserCache((prev) => ({ ...prev, [user.id]: userDetails }));

//                 const newReplyWithUser = { ...createdReply, userName: userDetails.userName };

//                 setReviews((prevReviews) =>
//                     prevReviews.map((review) =>
//                         review.id === reviewId
//                             ? {
//                                 ...review,
//                                 replies: [...(review.replies || []), newReplyWithUser],
//                                 countReplies: (review.countReplies || 0) + 1,
//                             }
//                             : review
//                     )
//                 );
//                 setAllReviews((prevAllReviews) =>
//                     prevAllReviews.map((review) =>
//                         review.id === reviewId
//                             ? {
//                                 ...review,
//                                 replies: [...(review.replies || []), newReplyWithUser],
//                                 countReplies: (review.countReplies || 0) + 1,
//                             }
//                             : review
//                     )
//                 );
//                 setNewReply((prev) => ({ ...prev, [reviewId]: "" }));
//                 toast.success("Reply posted!");
//             } catch (error) {
//                 console.error("Error submitting reply:", error);
//                 toast.error("Failed to submit reply");
//             }
//         },
//         [user, newReply, userCache]
//     );

//     // Toggle replies
//     const toggleReplies = useCallback(
//         (reviewId) => {
//             setReviews((prevReviews) =>
//                 prevReviews.map((review) =>
//                     review.id === reviewId ? { ...review, replies: review.replies ? null : [] } : review
//                 )
//             );
//             setAllReviews((prevAllReviews) =>
//                 prevAllReviews.map((review) =>
//                     review.id === reviewId ? { ...review, replies: review.replies ? null : [] } : review
//                 )
//             );

//             const review = reviews.find((r) => r.id === reviewId) || allReviews.find((r) => r.id === reviewId);
//             if (!review.replies) {
//                 fetchReplies(reviewId);
//             }
//         },
//         [fetchReplies, reviews, allReviews]
//     );

//     // Load more reviews
//     const loadMoreReviews = useCallback(() => {
//         if (hasMore) setPage((prevPage) => prevPage + 1);
//     }, [hasMore]);

//     if (loading) {
//         return <div className="detail_container">Loading tour details...</div>;
//     }

// <<<<<<< HEAD
//     const handleNoteChange = (note) => {
//         setSelectedNotes((prevNotes) =>
//             prevNotes.includes(note)
//                 ? prevNotes.filter((n) => n !== note)
//                 : [...prevNotes, note]
//         );
//     };
// =======
//     if (error) {
//         return <div className="detail_container">{error}</div>;
//     }
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

//     return (
//         <div className="detail_container">
//             <div className="detail_content">
//                 <div className="title_content">
//                     <h2>Trip information</h2>
//                 </div>
// <<<<<<< HEAD
//                 <div className="trip_main">
//                     <div className="trip_infor">
//                         <span className="Tour">{tour.tourType.name}</span>
//                         <label htmlFor="">
//                             <i className="fa-solid fa-location-dot"></i>
//                             <span>{tour.location.name}</span>
//                         </label>
//                     </div>
//                     <div className="top">
//                         <div className="image_main">
//                             <img src={tour.thumbnail} alt="Main Tour" />
//                         </div>
//                         <div className="image_second">
//                             {tour.images.slice(0, 1).map((image, index) => (
//                                 <img key={index} src={image} alt={`Tour Image ${index + 1}`}/>
//                             ))}
//                             <div className="image_third w-full h-full overflow-hidden">
//                                 <div className="absolute w-full h-full bg-gradient-to-b from-black to-transparent rounded-lg"></div>
//                                 <img src={tour.images[1]} alt={`Tour Image 3`}/>
//                                 {tour.images.length > 1 && (
//                                     <button className="more_images_button" onClick={() => setShowImages(true)}>
//                                         +{tour.images.length - 2} more
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     {showImages && (
//                         <div className="image_modal_overlay">
//                             <div className="image_modal">
//                                 <button className="close_button" onClick={() => setShowImages(false)}>
//                                     ×
//                                 </button>
//                                 <Swiper
//                                     spaceBetween={10}
//                                     slidesPerView={1}
//                                     navigation
//                                     pagination={{clickable: true}}
//                                     modules={[Navigation, Pagination]}
//                                 >
//                                     {tour.images.map((image, index) => (
//                                         <SwiperSlide key={index}>
//                                             <img src={image} alt={`Tour Image ${index + 1}`} className="modal_image"/>
//                                         </SwiperSlide>
//                                     ))}
//                                 </Swiper>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="top_infor">
//                     <div className="review">{randomImage && <img src={randomImage} alt="Image Tour"/>}</div>
//                     <div className="content">
//                         <div className="details_review">
//                             <span>{tour.averageRating}</span>
//                             <i className="fa-solid fa-star text-yellow-600"></i>
//                             <span> - ({tour.totalReviews} <i className="fa-solid fa-people-group"></i> )</span>
//                             <span className="px-4 py-2 rounded bg-blue-200 text-blue-600 text-center">Good</span>
//                         </div>
//                         <h2 id="name">{tour.title}</h2>
//                         <div className="details">
//                             <label htmlFor="">
//                                 <span>Tour Code</span>
//                                 <a href="#" id="tcode">{tour.tourCode}</a>
//                             </label>
//                             <label htmlFor="">
//                                 <span>Duration:</span>
//                                 <a href="#" id="dura">{tour.duration}</a>
//                             </label>
//                             <label htmlFor="">
//                                 <span>Place of departure</span>
//                                 <a href="#" id="place">{tour.placeOfDeparture}</a>
//                             </label>
//                             <label htmlFor="">
//                                 <span>Current seat:</span>
//                                 <a href="#">{tour.currentParticipants} / {tour.maxParticipants}</a>
//                             </label>
//                         </div>
//                     </div>
//                 </div>

// =======
//                 <TourInfo tour={tour} randomImage={randomImage} showImages={showImages} setShowImages={setShowImages} />
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//                 <div className="mid_details">
//                     <div className="details_left">
//                         <div className="infor_travel">
//                             <div className="infor_header">
//                                 <h2>Description</h2>
//                             </div>
//                             <div className="intro" dangerouslySetInnerHTML={{ __html: tour.highlights }} />
//                         </div>
//                         <div className="highlight">
//                             <h2 className="text-blue-700">Highlight</h2>
// <<<<<<< HEAD
//                             <div className="mt-[10px] pl-[40px] leading-5" dangerouslySetInnerHTML={{__html: tour.highlights}}/>
// =======
//                             <div className="mt-[10px] pl-[40px] leading-5"
//                                 dangerouslySetInnerHTML={{ __html: tour.highlights }} />
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//                         </div>
//                         <div className="notes">
//                             <h3>If you have any notes, please tell us!</h3>
//                             <div className="select_notes">
//                                 {["Smoke", "High Floor Room", "Hyperactive children", "Vegetarian", "There are people with disabilities", "Pregnant women"].map((note) => (
//                                     <label key={note}>
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedNotes.includes(note)}
//                                             onChange={() => handleNoteChange(note)}
//                                         />
//                                         <span>{note}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                             <div className="mess_add">
// <<<<<<< HEAD
//                                 <h4>Additional Notes</h4>
// =======
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//                                 <textarea
//                                     name=""
//                                     id=""
//                                     cols="30"
//                                     rows="10"
//                                     placeholder="Please enter your messages"
//                                     className="border-2 rounded"
//                                 ></textarea>
// <<<<<<< HEAD
//                             </div>
//                         </div>

//                         <div className="reviews_customer">
//                             <h3 className="font-bold">Customer Reviews</h3>
//                             {reviews.length > 0 ? (
//                                 reviews.map((review) => (
//                                     <div className="review" key={review.id}>
//                                         <div className="review_header">
//                                             <div className="review_avt">
//                                                 <img src="https://picsum.photos/600" alt=""/>
//                                             </div>
//                                             <div className="review_infor">
//                                                 <div>
//                                                     <h4>John Doe</h4>
//                                                     <p className="review_place">Bangkok, Thailand</p>
//                                                 </div>
//                                                 <div>
//                                                     <p className="review_date">{review.createdAt}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="review_content">
//                                             <div className="review_star">
//                                                 <i className="fa-solid fa-star"></i>
//                                                 <i className="fa-solid fa-star"></i>
//                                                 <i className="fa-solid fa-star"></i>
//                                                 <i className="fa-solid fa-star"></i>
//                                                 <i className="fa-regular fa-star-half-stroke"></i>
//                                             </div>
//                                             <p className="review_detail_content">{review.comment}</p>
//                                             <div className="review_icon">
//                                                 <div className="review_icon_like">
//                                                     <i className="fa-solid fa-thumbs-up"></i>
//                                                     <i className="fa-solid fa-thumbs-down"></i>
//                                                 </div>
//                                                 <div>
//                                                     <i className="fa-solid fa-ellipsis-vertical"></i>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="no_reviews">
//                                     <p className="text-gray-600">No reviews available for this tour.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="book_container">
//                         <div className="book_now">
//                             <h2 className="font-bold text-primary">Trip summary</h2>
//                             <div className="infor_book">
//                                 <img src={tour.thumbnail} alt=""/>
//                                 <p>{tour.title}</p>
//                             </div>
//                             <div className="schedule">
//                                 <label htmlFor="">
//                                     <i className="fa-solid fa-calendar-days"></i>
//                                     <span>
//                     Start your trip - {tour.startDate ? format(new Date(tour.startDate), "MMMM, dd yyyy") : "N/A"}
//                   </span>
//                                 </label>
//                                 <label htmlFor="">
//                                     <i className="fa-solid fa-calendar-days"></i>
//                                     <span>
//                     End your trip - {tour.endDate ? format(new Date(tour.endDate), "MMMM, dd yyyy") : "N/A"}
//                   </span>
//                                 </label>
//                             </div>
//                             <div className="infor_booking">
//                                 <label>
//                                     <h4>Passenger</h4>
//                                     <span>{adults + children + babies} person</span>
//                                 </label>
//                                 <label>
//                                     <h4>Adult</h4>
//                                     <div className="discrea">
//                                         <i className="fa-solid fa-minus" onClick={minusAdult}></i>
//                                         <span>{adults}</span>
//                                         <i className="fa-solid fa-plus" onClick={addAdult}></i>
//                                     </div>
//                                 </label>
//                                 <label>
//                                     <h4>Children</h4>
//                                     <div className="discrea">
//                                         <i className="fa-solid fa-minus" onClick={minusChild}></i>
//                                         <span>{children}</span>
//                                         <i className="fa-solid fa-plus" onClick={addChild}></i>
//                                     </div>
//                                 </label>
//                                 <label>
//                                     <h4>Baby</h4>
//                                     <div className="discrea">
//                                         <i className="fa-solid fa-minus" onClick={minusBaby}></i>
//                                         <span>{babies}</span>
//                                         <i className="fa-solid fa-plus" onClick={addBaby}></i>
//                                     </div>
//                                 </label>
//                                 <label className="discount">
//                                     <h4>Discount Code</h4>
//                                     <div className="discrea">
//                                         <input
//                                             type="text"
//                                             placeholder="Add Code"
//                                             value={discountCode}
//                                             className="border-2 rounded px-2 py-4"
//                                             onChange={(e) => setDiscountCode(e.target.value)}
//                                         />
//                                         <button onClick={checkGiamGia}>Apply</button>
//                                     </div>
//                                 </label>
//                                 <label className="total">
//                                     <h4>TOTAL</h4>
//                                     <div className="discrea_total">
//                                         <span>${totalPrice.toFixed(2)}</span>
//                                     </div>
//                                 </label>
//                                 <button className="book_submit" onClick={handleSubmit}>
//                                     BOOK NOW
//                                 </button>
// =======
// >>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
//                             </div>
//                         </div>
//                         <ReviewSection
//                             reviews={reviews}
//                             user={user}
//                             newReview={newReview}
//                             setNewReview={setNewReview}
//                             rating={rating}
//                             setRating={setRating}
//                             images={images}
//                             setImages={setImages} // Fixed typo: setsmages -> setImages
//                             handleReviewSubmit={handleReviewSubmit}
//                             toggleReplies={toggleReplies}
//                             handleReplySubmit={handleReplySubmit}
//                             newReply={newReply}
//                             setNewReply={setNewReply}
//                             loadMoreReviews={loadMoreReviews}
//                             hasMore={hasMore}
//                             tour={tour}
//                             allReviews={allReviews}
//                             setModalIsOpen={setModalIsOpen}
//                         />
//                         {relatedTours.length > 0 && (
//                             <div className="related_tours">
//                                 <HorizontalLayout tours={relatedTours} title="Related tour" isShowDescCard={true} />
//                             </div>
//                         )}
//                     </div>
//                     <BookingForm
//                         tour={tour}
//                         adults={adults}
//                         setAdults={setAdults}
//                         children={children}
//                         setChildren={setChildren}
//                         babies={babies}
//                         setBabies={setBabies}
//                         discountCode={discountCode}
//                         setDiscountCode={setDiscountCode}
//                         totalPrice={totalPrice}
//                         handleSubmit={handleSubmit}
//                         checkGiamGia={checkGiamGia}
//                         totalPassengers={`${adults + children + babies} passengers`}
//                         isBooking={isBooking}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DetailTour;
