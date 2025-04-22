import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailTour, getReviewOfTour } from "../../api/tour.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { format } from "date-fns";
import { verifyUser } from "../../api/auth.api";
import {
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const DetailTour = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [showImages, setShowImages] = useState(false);
    const [randomImage, setRandomImage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [babies, setBabies] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    // Update number of people
    const addAdult = () => setAdults(adults + 1);
    const minusAdult = () => setAdults(Math.max(0, adults - 1));
    const addChild = () => setChildren(children + 1);
    const minusChild = () => setChildren(Math.max(0, children - 1));
    const addBaby = () => setBabies(babies + 1);
    const minusBaby = () => setBabies(Math.max(0, babies - 1));

    // Calculate total price
    useEffect(() => {
        if (tour) {
            const basePrice = tour.price || 0;
            const total = adults * basePrice + children * basePrice * 0.7 + babies * basePrice * 0.3;
            setTotalPrice(total);
        }
    }, [adults, children, babies, tour]);

    // Check discount code
    const checkGiamGia = () => {
        if (discountCode === "DISCOUNT10") {
            setTotalPrice((prev) => prev * 0.9);
        }
    };

    // Handle notification close
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Handle "BOOK NOW" submission
    const handleSubmit = async () => {
        if (adults < 1) {
            setNotification({
                open: true,
                message: "Please select at least one adult to proceed with booking.",
                severity: "error",
            });
            return;
        }

        try {
            const user = await verifyUser();
            navigate("/confirmbooking", {
                state: {
                    tour,
                    adults,
                    children,
                    babies,
                    totalPrice,
                    discountCode,
                    userId: user.id,
                },
            });
        } catch (error) {
            console.error("User not authenticated:", error);
            navigate("/auth/sign_in", { state: { from: `/tour/${id}` } });
        }
    };

    // Fetch reviews
    useEffect(() => {
        const fetchReviewsByTourId = async () => {
            try {
                const reviews = await getReviewOfTour(id);
                setReviews(reviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviewsByTourId();
    }, [id]);

    // Fetch tour details
    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                const response = await getDetailTour(id);
                setTour(response);
                setSelectedNotes(JSON.parse(response.notes || "[]"));
            } catch (error) {
                console.error("Error fetching tour details:", error);
            }
        };
        fetchTourDetails();
    }, [id]);

    // Get random image
    useEffect(() => {
        if (tour && tour.images && tour.images.length > 0) {
            const getRandomImage = () => {
                const randomIndex = Math.floor(Math.random() * tour.images.length);
                return tour.images[randomIndex];
            };
            setRandomImage(getRandomImage());
        }
    }, [tour]);

    if (!tour) {
        return <div>Loading...</div>;
    }

    const handleNoteChange = (note) => {
        setSelectedNotes((prevNotes) =>
            prevNotes.includes(note)
                ? prevNotes.filter((n) => n !== note)
                : [...prevNotes, note]
        );
    };

    return (
        <>
            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                    zIndex: 9999,
                    "& .MuiSnackbarContent-root": {
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        fontWeight: "medium",
                    },
                }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{
                        width: "100%",
                        bgcolor: "#ffebee",
                        color: "#c62828",
                        "& .MuiAlert-icon": {
                            color: "#c62828",
                        },
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseNotification}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <div className="detail_container">
                <div className="detail_content">
                    <div className="title_content">
                        <h2>Trip information</h2>
                    </div>
                    <div className="trip_main">
                        <div className="trip_infor">
                            <span className="Tour">{tour.tourType.name}</span>
                            <label htmlFor="">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>{tour.location.name}</span>
                            </label>
                        </div>
                        <div className="top">
                            <div className="image_main">
                                <img src={tour.thumbnail} alt="Main Tour" />
                            </div>
                            <div className="image_second">
                                {tour.images.slice(0, 1).map((image, index) => (
                                    <img key={index} src={image} alt={`Tour Image ${index + 1}`} />
                                ))}
                                <div className="image_third w-full h-full overflow-hidden">
                                    <div className="absolute w-full h-full bg-gradient-to-b from-black to-transparent rounded-lg"></div>
                                    <img src={tour.images[1]} alt={`Tour Image 3`} />
                                    {tour.images.length > 1 && (
                                        <button className="more_images_button" onClick={() => setShowImages(true)}>
                                            +{tour.images.length - 2} more
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {showImages && (
                            <div className="image_modal_overlay">
                                <div className="image_modal">
                                    <button className="close_button" onClick={() => setShowImages(false)}>
                                        ×
                                    </button>
                                    <Swiper
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                        modules={[Navigation, Pagination]}
                                    >
                                        {tour.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={image} alt={`Tour Image ${index + 1}`} className="modal_image" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="top_infor">
                        <div className="review">{randomImage && <img src={randomImage} alt="Image Tour" />}</div>
                        <div className="content">
                            <div className="details_review">
                                <span>{tour.averageRating}</span>
                                <i className="fa-solid fa-star text-yellow-600"></i>
                                <span> - ({tour.totalReviews} <i className="fa-solid fa-people-group"></i> )</span>
                                <span className="px-4 py-2 rounded bg-blue-200 text-blue-600 text-center">Good</span>
                            </div>
                            <h2 id="name">{tour.title}</h2>
                            <div className="details">
                                <label htmlFor="">
                                    <span>Tour Code</span>
                                    <a href="#" id="tcode">{tour.tourCode}</a>
                                </label>
                                <label htmlFor="">
                                    <span>Duration:</span>
                                    <a href="#" id="dura">{tour.duration}</a>
                                </label>
                                <label htmlFor="">
                                    <span>Place of departure</span>
                                    <a href="#" id="place">{tour.placeOfDeparture}</a>
                                </label>
                                <label htmlFor="">
                                    <span>Current seat:</span>
                                    <a href="#">{tour.currentParticipants} / {tour.maxParticipants}</a>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mid_details">
                        <div className="details_left">
                            <div className="infor_travel">
                                <div className="infor_header">
                                    <h2>Description</h2>
                                    <div className="status">
                                        <label htmlFor="">
                                            <i className="fa-sharp fa-solid fa-thumbs-up"></i>
                                            <span>Like</span>
                                        </label>
                                        <label htmlFor="">
                                            <i className="fa-solid fa-share"></i>
                                            <span>Share</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="intro" dangerouslySetInnerHTML={{ __html: tour.highlights }} />
                            </div>
                            <div className="highlight">
                                <h2 className="text-blue-700">Highlight</h2>
                                <div className="mt-[10px] pl-[40px] leading-5" dangerouslySetInnerHTML={{ __html: tour.highlights }} />
                            </div>

                            <div className="notes">
                                <h3>If you have any notes, please tell us!</h3>
                                <div className="select_notes">
                                    {["Smoke", "High Floor Room", "Hyperactive children", "Vegetarian", "There are people with disabilities", "Pregnant women"].map((note) => (
                                        <label key={note}>
                                            <input
                                                type="checkbox"
                                                checked={selectedNotes.includes(note)}
                                                onChange={() => handleNoteChange(note)}
                                            />
                                            <span>{note}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mess_add">
                                    <h4>Additional Notes</h4>
                                    <textarea
                                        name=""
                                        id=""
                                        cols="30"
                                        rows="10"
                                        placeholder="Please enter your messages"
                                        className="border-2 rounded"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="reviews_customer">
                                <h3 className="font-bold">Customer Reviews</h3>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div className="review" key={review.id}>
                                            <div className="review_header">
                                                <div className="review_avt">
                                                    <img src="https://picsum.photos/600" alt="" />
                                                </div>
                                                <div className="review_infor">
                                                    <div>
                                                        <h4>John Doe</h4>
                                                        <p className="review_place">Bangkok, Thailand</p>
                                                    </div>
                                                    <div>
                                                        <p className="review_date">{review.createdAt}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="review_content">
                                                <div className="review_star">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-regular fa-star-half-stroke"></i>
                                                </div>
                                                <p className="review_detail_content">{review.comment}</p>
                                                <div className="review_icon">
                                                    <div className="review_icon_like">
                                                        <i className="fa-solid fa-thumbs-up"></i>
                                                        <i className="fa-solid fa-thumbs-down"></i>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no_reviews">
                                        <p className="text-gray-600">No reviews available for this tour.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="book_container">
                            <div className="book_now">
                                <h2 className="font-bold text-primary">Trip summary</h2>
                                <div className="infor_book">
                                    <img src={tour.thumbnail} alt="" />
                                    <p>{tour.title}</p>
                                </div>
                                <div className="schedule">
                                    <label htmlFor="">
                                        <i className="fa-solid fa-calendar-days"></i>
                                        <span>
                                            Start your trip - {tour.startDate ? format(new Date(tour.startDate), "MMMM, dd yyyy") : "N/A"}
                                        </span>
                                    </label>
                                    <label htmlFor="">
                                        <i className="fa-solid fa-calendar-days"></i>
                                        <span>
                                            End your trip - {tour.endDate ? format(new Date(tour.endDate), "MMMM, dd yyyy") : "N/A"}
                                        </span>
                                    </label>
                                </div>
                                <div className="infor_booking">
                                    <label>
                                        <h4>Passenger</h4>
                                        <span>{adults + children + babies} person</span>
                                    </label>
                                    <label>
                                        <h4>Adult</h4>
                                        <div className="discrea">
                                            <i className="fa-solid fa-minus" onClick={minusAdult}></i>
                                            <span>{adults}</span>
                                            <i className="fa-solid fa-plus" onClick={addAdult}></i>
                                        </div>
                                    </label>
                                    <label>
                                        <h4>Children</h4>
                                        <div className="discrea">
                                            <i className="fa-solid fa-minus" onClick={minusChild}></i>
                                            <span>{children}</span>
                                            <i className="fa-solid fa-plus" onClick={addChild}></i>
                                        </div>
                                    </label>
                                    <label>
                                        <h4>Baby</h4>
                                        <div className="discrea">
                                            <i className="fa-solid fa-minus" onClick={minusBaby}></i>
                                            <span>{babies}</span>
                                            <i className="fa-solid fa-plus" onClick={addBaby}></i>
                                        </div>
                                    </label>
                                    <label className="discount">
                                        <h4>Discount Code</h4>
                                        <div className="discrea">
                                            <input
                                                type="text"
                                                placeholder="Add Code"
                                                value={discountCode}
                                                className="border-2 rounded px-2 py-4"
                                                onChange={(e) => setDiscountCode(e.target.value)}
                                            />
                                            <button onClick={checkGiamGia}>Apply</button>
                                        </div>
                                    </label>
                                    <label className="total">
                                        <h4>TOTAL</h4>
                                        <div className="discrea_total">
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </label>
                                    <button
                                        className={`book_submit ${adults < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleSubmit}
                                        disabled={adults < 1}
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailTour;