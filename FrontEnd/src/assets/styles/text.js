
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import CreateTripModal from "../components/createTripModal";
import { Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Parallax, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import "./styles.css"; // Uncommented to apply custom Swiper styles
import { getAllTour } from "../api/tour.api";
import { toast } from "react-toastify";

import waveimg from "../assets/images/wave.png";
import brand_1 from "../assets/images/brand01.png";
import brand_2 from "../assets/images/booking_brand02.png";
import brand_3 from "../assets/images/trivago_brand03.png";
import brand_4 from "../assets/images/trainline_brand04.png";
import brand_5 from "../assets/images/cheapflight_brand05.png";
import brand_6 from "../assets/images/momondo_brand06.png";
import label01 from "../assets/images/label01.png";
import label02 from "../assets/images/label02.png";
import label03 from "../assets/images/label03.png";

// Utility to fetch all pages
const fetchAllPages = async (fetchFunction, size = 10, sortBy = "id", sortDir = "asc") => {
    let allData = [];
    let currentPage = 0;
    let totalPages = 1;

    while (currentPage < totalPages) {
        const response = await fetchFunction(currentPage, size, sortBy, sortDir);
        allData = [...allData, ...response.content];
        currentPage = response.currentPage + 1;
        totalPages = response.totalPages;
    }

    return allData;
};

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

const Advert = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch and filter top 3 tours by averageRating
    useEffect(() => {
        const fetchTopRatedTours = async () => {
            try {
                setLoading(true);
                const allTours = await fetchAllPages(getAllTour);
                const filteredTours = allTours
                    .filter((tour) => tour.active === true && tour.status === "UPCOMING")
                    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                    .slice(0, 3);
                setTours(filteredTours);
            } catch (error) {
                console.error("Error fetching tours:", error);
                toast.error("Failed to load top tours");
            } finally {
                setLoading(false);
            }
        };
        fetchTopRatedTours();
    }, []);

    const handleFocus = () => {
        navigate("/thingstodo");
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div>
                <div className="w-screen h-[92vh] mx-auto overflow-hidden slider-container">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                        </div>
                    ) : tours.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p>No top-rated tours available.</p>
                        </div>
                    ) : (
                        <Swiper
                            style={{
                                "--swiper-navigation-color": "#fff",
                                "--swiper-pagination-color": "#fff",
                            }}
                            speed={600}
                            parallax={true}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            navigation={true}
                            modules={[Autoplay, Parallax, Navigation, Pagination]}
                            className="mySwiper w-full h-full"
                        >
                            <div
                                slot="container-start"
                                className="parallax-bg"
                                data-swiper-parallax="-23%"
                            ></div>
                            {tours.map((tour) => (
                                <SwiperSlide
                                    key={tour.id}
                                    onClick={() => navigate(`/tour/${tour.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div
                                        className="parallax-bg"
                                        style={{
                                            backgroundImage: `url(${tour.thumbnail || "https://via.placeholder.com/1920x1080"})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            height: "100%",
                                            width: "100%",
                                            zIndex: 1,
                                        }}
                                        data-swiper-parallax="-23%"
                                    ></div>
                                    <div className="overlay">
                                        <div className="title" data-swiper-parallax="-300">
                                            {tour.title}
                                        </div>
                                        <div className="subtitle" data-swiper-parallax="-200">
                                            Rating: {(tour.averageRating || 0).toFixed(1)} ({tour.totalReviews || 0} reviews)
                                        </div>
                                        <div className="text" data-swiper-parallax="-100">
                                            <p>
                                                {tour.description?.slice(0, 200) +
                                                    (tour.description?.length > 200 ? "..." : "") ||
                                                    "Explore this amazing tour!"}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="header_infor_details">

                    <div className="flex items-center ml-[120px] mt-[40px] gap-[1rem]">
                        <label
                            htmlFor=""
                            className="relative flex items-center mt-[50px] mb-[80px] ml-[40px] overflow-hidden"
                        >
                            <input
                                type="text"
                                placeholder="Plan a Trip"
                                onFocus={handleFocus}
                                className="p-5 pl-8 border-none outline-none rounded-full w-[360px] h-[70px] shadow-inner bg-[rgba(232,217,217,0.8)] opacity-70 transition-all duration-200"
                            />
                            <button onClick={() => setModalIsOpen(true)} className="btn_create_trip">
                                Create trip
                                <i className="fa-solid fa-arrow-right p-1 bg-primary rounded-full text-white ml-[10px] cursor-pointer"></i>
                            </button>
                            <CreateTripModal open={modalIsOpen} handleClose={() => setModalIsOpen(false)} />
                        </label>
                    </div>
                    <div className="flex flex-col m-[55px]">
                        <h5 className="font-bold mb-[20px] tracking-wider text-gray-400 pointer-events-none">
                            Our customers say
                        </h5>
                        <div className="flex">
                            <div className="flex flex-col justify-center border-r-2 border-gray-400 pr-[30px] mr-3">
                                <span className="font-xl font-bold text-gray-300">Excellent</span>
                                <div className="flex items-center mt-[10px] gap-[5px]">
                                    <i className="fa-solid fa-star text-[#FFC83A]"></i>
                                    <i className="fa-solid fa-star text-[#FFC83A]"></i>
                                    <i className="fa-solid fa-star text-[#FFC83A]"></i>
                                    <i className="fa-solid fa-star text-[#FFC83A]"></i>
                                    <i className="fa-regular fa-star-half-stroke text-[#FFC83A]"></i>
                                </div>
                            </div>
                            <div className="flex flex-col mr-3 gap-2">
                                <span className="text-primary font-xl font-bold pr-2">4.7</span>
                                <p className="flex items-center justify-center text-gray-400 pr-2">
                                    out of 5 on 194 reviewers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default Advert;
