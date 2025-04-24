import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link} from "react-router-dom";

import ceoimage from "../assets/images/ceoimg.png"
import {getAllTour} from "../api/tour.api";

const BookEasy = () => {

    const [tours, setTours] = useState([]);

    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'desc') => {
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
    const fetchTours = async () => {
        try {
            const allTours = await fetchAllPages(getAllTour);
            const filterTours = allTours.filter(tour => tour.currentParticipants >= tour.maxParticipants * 0.5);
            setTours(filterTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const NextArrow = ({onClick}) => (
        <button
            type="button"
            className="absolute right-[30px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl"
            onClick={onClick}
        >
            <i className="fa-solid fa-angle-right"></i>
        </button>
    );

    const PrevArrow = ({onClick}) => (
        <button
            type="button"
            className="absolute left-[30px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl"
            onClick={onClick}
        >
            <i className="fa-solid fa-angle-left"></i>
        </button>
    );


    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>
    };

    return (
        <div className="flex items-center justify-evenly gap-[40px] px-[100px] py-[80px]">
            {/*data-aos="fade-up-right"*/}
            <div className="relative w-1/2 overflow-hidden">
                {Slider && (
                    <Slider {...settings}>
                        {tours.map((tour, index) => (
                            <div
                                className="flex relative bg-orange-200 py-[20px] px-[50px] rounded-2xl flex-col overflow-hidden">
                                <div
                                    className="relative rounded-2xl py-[20px] px-[50px]"
                                    style={{
                                        background: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7)), url(${tour.thumbnail})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="relative z-10">
                                        <h3 className="text-white text-xl">Enjoy Your Trip</h3>
                                        <h4 className="leading-[50px] font-bold text-white">Set up
                                            trip: {tour.title}</h4>
                                        <label htmlFor="" className="flex items-center">
                                            <Link
                                                to={`/tours/detailtour/${tour.id}`}
                                                className=" rounded-lg overflow-hidden w-full border-0 bg-white flex items-center gap-[10px] text-primary font-bold justify-between hover:bg-primary hover:text-white transition-all duration-300"
                                            >

                                                <p className="flex items-center gap-1 justify-center flex-row w-[60%] text-center">
                                                    <i>Plan trip now</i><i
                                                    className="fa-solid fa-hand-pointer text-2xl"></i></p>
                                                <span
                                                    className="flex items-center bg-primary text-white p-[20px] w-[40%]">
                                                    $ {tour.price} / per Trip
                                                </span>

                                            </Link>

                                        </label>
                                        <div className="flex mt-[20px] text-white">
                                            <ul className="relative">
                                                <li className="mt-[10px]">
                                                    <label htmlFor="" className="flex items-center gap-[10px]">
                                                        <i className="fa-solid fa-circle-dot text-white"></i>
                                                        <span className="font-bold">Set Up Your Account</span>
                                                    </label>
                                                    <p className="ml-[25px] opacity-[0.8] leading-[30px]">
                                                        Your legal information is a benefit when check in
                                                    </p>
                                                </li>
                                                <li className="mt-[10px]">
                                                    <label htmlFor="" className="flex items-center gap-[10px]">
                                                        <i className="fa-solid fa-circle-dot text-white"></i>
                                                        <span className="font-bold">Respond to private request</span>
                                                    </label>
                                                    <p className="ml-[25px] opacity-[0.8] leading-[30px]">
                                                        Your request is capacity for tours of us
                                                    </p>
                                                </li>
                                                <li className="mt-[10px]">
                                                    <label htmlFor="" className="flex items-center gap-[10px]">
                                                        <i className="fa-solid fa-circle-dot text-white"></i>
                                                        <span className="font-bold">Conduct booking</span>
                                                    </label>
                                                    <p className="ml-[25px] opacity-[0.8] leading-[30px]">
                                                        Book your best experience
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}

                    </Slider>
                )}
            </div>

            <div className="flex flex-col gap-[20px] w-1/2" data-aos="fade-left">
                <h2 className="text-4xl font-bold mb-[20px]">Book Easy 3 Steps</h2>
                <p className="opacity-[0.9] leading-[25px]">Planning a trip is sometimes not easy. But Trip Plan will
                    help you to manage time and budget for your
                    journey! There are only 3 steps: Create an account, choose your destination city.</p>
                <div className="relative border-b-2 border-dashed border-[d1cdcd] pb-[20px]">
                    <ul className="flex flex-col gap-[25px]">
                        <li>
                            <label htmlFor=" " className="flex items-center flex-row gap-[10px]">
                                <i className="fa-solid fa-circle-dot text-primary"></i>
                                <span className="font-bold ml-[10px]">Set Up Your Account</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="" className="flex items-center flex-row gap-[10px]">
                                <i className="fa-solid fa-circle-dot text-primary"></i>
                                <span className="font-bold ml-[10px]">Respond to Private requests</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="" className="flex items-center flex-row gap-[10px]">
                                <i className="fa-solid fa-circle-dot text-primary"></i>
                                <span className="font-bold ml-[10px]">Booking System</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <div>
                    <p><i className="font-light text-gray-500 opacity-[0.8]">“Plan your trip with a 3-step trip plan.
                        Check in out at a glance, select hotel rooms on the
                        go, and create a packing list”</i></p>
                </div>
                <div className="flex gap-[20px] items-center">
                    <img src={ceoimage} alt=""/>
                    <div className="flex flex-col gap-[10px]">
                        <h3>Steve Jobs</h3>
                        <span className="text-gray-500 opacity-[0.7] tracking-wider">Co-Founder and CEO</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookEasy;