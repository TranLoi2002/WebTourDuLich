import React, {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Parallax, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import "./styles.css"; // Swiper-specific styles
import {getAllTour} from "../api/tour.api";
import {toast} from "react-toastify";
import CreateTripModal from "./createTripModal";


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
                            <p className="text-xl text-gray-600">No top-rated tours available.</p>
                        </div>
                    ) : (
                        <Swiper
                            style={{
                                "--swiper-navigation-color": "#fff",
                                "--swiper-pagination-color": "#fff",
                            }}
                            speed={600}
                            parallax={true}
                            autoplay={{delay: 3000, disableOnInteraction: false}}
                            pagination={{clickable: true}}
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
                                    // onClick={() => navigate(`/tour/${tour.id}`)}
                                    className="relative flex text-white z-10"
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
                                    <div
                                        className="absolute inset-0 bg-black/50 flex flex-col z-20 pt-[150px] pl-[150px]">
                                        <Link to={`/tours/detailtour/${tour.id}`}
                                              className="text-6xl font-bold mb-4 text-shadow-lg text-white"
                                              data-swiper-parallax="-300"
                                        >
                                            {tour.title?.length > 50 ? tour.title.slice(0, 50) + "..." : tour.title}
                                        </Link>
                                        <p
                                            className="text-base max-w-2xl text-shadow-sm"
                                            data-swiper-parallax="-100"
                                            dangerouslySetInnerHTML={{
                                                __html: tour.description
                                                    ? tour.description.length > 200
                                                        ? `${tour.description.slice(0, 200)}...`
                                                        : tour.description
                                                    : "Explore this amazing tour!",
                                            }}
                                        ></p>
                                        <div className="flex items-center ml-[100px] gap-[1rem]">
                                            <label
                                                htmlFor=""
                                                className="relative flex items-center mt-[50px] ml-[40px] overflow-hidden"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Plan a Trip"
                                                    onFocus={handleFocus}
                                                    className="p-5 pl-8 text-white border-none outline-none rounded-full w-[360px] h-[70px] shadow-inner opacity-70 transition-all duration-200"
                                                />
                                                <button onClick={() => setModalIsOpen(true)}
                                                        className="btn_create_trip text-primary">
                                                    Create trip
                                                    <i className="fa-solid fa-arrow-right p-1 bg-primary rounded-full text-white ml-[10px] cursor-pointer"></i>
                                                </button>
                                                <CreateTripModal open={modalIsOpen}
                                                                 handleClose={() => setModalIsOpen(false)}/>
                                            </label>
                                        </div>
                                        <div className="flex flex-col m-[55px] z-99" data-swiper-parallax="-200">
                                            <h5 className="font-bold mb-[20px] tracking-wider text-gray-400 pointer-events-none">
                                                Our customers say
                                            </h5>
                                            <div className="flex">
                                                <div
                                                    className="flex flex-col justify-center border-r-2 border-gray-400 pr-[30px] mr-3">
                                                    <span className="font-xl font-bold text-gray-300">
                                                        {tour.averageRating >= 4.5
                                                            ? "Excellent"
                                                            : tour.averageRating >= 3.5
                                                                ? "Good"
                                                                : "Average"}
                                                    </span>
                                                    <div className="flex items-center mt-[10px] gap-[5px]">
                                                        {Array.from({length: 5}, (_, index) => {
                                                            if (index < Math.floor(tour.averageRating)) {
                                                                return <i key={index}
                                                                          className="fa-solid fa-star text-[#FFC83A]"></i>;
                                                            } else if (
                                                                index < Math.ceil(tour.averageRating) &&
                                                                tour.averageRating % 1 >= 0.5
                                                            ) {
                                                                return <i key={index}
                                                                          className="fa-regular fa-star-half-stroke text-[#FFC83A]"></i>;
                                                            } else {
                                                                return <i key={index}
                                                                          className="fa-regular fa-star text-[#FFC83A]"></i>;
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col mr-3 gap-2">
        <span className="text-primary font-xl font-bold pr-2">
            {(tour.averageRating || 0).toFixed(1)}
        </span>
                                                    <p className="flex items-center justify-center text-gray-400 pr-2">
                                                        out of {tour.totalReviews || 0} reviewers
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="relative bg-[#F4F5F9] m-0">
                    <ul className="flex items-center justify-center p-[18px]">
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a href="https://amadeus.com/en" target="_blank" rel="noopener">
                                <img src={brand_1} alt="amadeus_brand_img" title="Click to details"/>
                            </a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a
                                target="_blank"
                                rel="noopener"
                                href="https://www.booking.com/index.vi.html?label=gen173nr-1BCAEoggI46AdIM1gEaPQBiAEBmAEquAEXyAEM2AEB6AEBiAIBqAIDuALj8NmgBsACAdICJDJlYmYyNDVlLTVkZTYtNDcwZi05MDAyLTY3YWQwZjc1ZTAxNNgCBeACAQ&keep_landing=1&sb_price_type=total&"
                            >
                                <img src={brand_2} alt="Booking.com_img" title="Click to details"/>
                            </a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a
                                target="_blank"
                                rel="noopener"
                                href="https://www.trivago.vn/vi/lm?themeId=280&tc=18&search=200-217&sem_keyword=trivago&sem_creativeid=553381580618&sem_matchtype=e&sem_network=g&sem_device=c&sem_placement=&sem_target=&sem_adposition=&sem_param1=&sem_param2=&sem_campaignid=329911942&sem_adgroupid=120724436555&sem_targetid=kwd-5593367084&sem_location=1028581&cipc=br&cip=8419000005&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeDScEOU0jbR8jRJiJJgbZxaTxaXi-p629w0Fb2bwXb3asRBHoQ_pwwaAtdKEALw_wcB"
                            >
                                <img src={brand_3} alt="trivago_brand_img" title="Click to details"/>
                            </a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a
                                target="_blank"
                                rel="noopener"
                                href="https://www.thetrainline.com/?phcode=1011l231656.&utm_campaign=theballyhoo&utm_medium=affiliate&utm_source=network&cm=0a1e.1011l231656&phcam=1100l229&~campaign_id=1100l229&~click_id=1011lwG5oJ2r"
                            >
                                <img src={brand_4} alt="trainline_brand_img" title="Click to details"/>
                            </a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a
                                target="_blank"
                                rel="noopener"
                                href="https://www.vn.cheapflights.com/?lang=en&skipapp=true&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeAeKEqwiO3S_tTev3ziWv74xSb8ZQ2XRHb8W7tLKNsliwuryycS1hAaAtzsEALw_wcB"
                            >
                                <img src={brand_5} alt="cheapflight_brand_img" title="Click to details"/>
                            </a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500">
                            <a target="_blank" rel="noopener" href="https://www.momondo.com/">
                                <img src={brand_6} alt="momodo_brand_img" title="Click to details"/>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-t from-blue-100 to-transparent w-full">
                    <div className="pt-[60px]">
                        <h1 className="text-4xl text-center font-bold" data-aos="fade-down">
                            Innovative Trip Planning
                        </h1>
                        <p className="mt-[18px] text-center leading-[30px]" data-aos="fade-down"
                           data-aos-duration="5000">
                            Our Vision is to revolutionize the way people travel by introducing intelligent trip
                            planning
                        </p>
                    </div>
                    <div className="pb-[70px] pt-[50px] w-full flex justify-center gap-[30px]">
                        <a
                            href="#"
                            className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item1"
                            data-aos="zoom-in"
                        >
                            <div className="adver-item">
                                <img src={label01} alt=""/>
                                <p className="mt-[18px] leading-5">
                                    Partner allows you to
                                    <br/>
                                    browse multiple carriers
                                    <br/>
                                    for travel.
                                </p>
                                <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">
                                    Learn more
                                    <i className="fa-solid fa-arrow-right"></i>
                                </p>
                            </div>
                        </a>

                        <a
                            href="#"
                            className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item2"
                            data-aos="zoom-in"
                        >
                            <div className="adver-item">
                                <img src={label02} alt=""/>
                                <p className="mt-[18px] leading-5">
                                    The website is a way for
                                    <br/>
                                    partners to communicate
                                    <br/>
                                    with their customers.
                                </p>
                                <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">
                                    Learn more
                                    <i className="fa-solid fa-arrow-right"></i>
                                </p>
                            </div>
                        </a>

                        <a
                            href="#"
                            className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item3"
                            data-aos="zoom-in"
                        >
                            <div className="adver-item">
                                <img src={label03} alt=""/>
                                <p className="mt-[18px] leading-5">
                                    The eBook Reader is
                                    <br/>
                                    a new way to look at
                                    <br/>
                                    e-books.
                                </p>
                                <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">
                                    Learn more
                                    <i className="fa-solid fa-arrow-right"></i>
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advert;