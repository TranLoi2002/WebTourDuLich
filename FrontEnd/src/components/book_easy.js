import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ceoimage from "../assets/images/ceoimg.png"

const BookEasy = () => {

    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <button type="button" className="next" onClick={onClick}>
                <i className="fa-solid fa-angle-right"></i>
            </button>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <button type="button" className="prev" onClick={onClick}>
                <i className="fa-solid fa-angle-left"></i>
            </button>
        );
    };


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // nextArrow: <NextArrow/>,
        // prevArrow: <prevArrow/>
    };

    return (
        <div className="flex items-center justify-evenly gap-[20px] p-[70px]">
            {/*data-aos="fade-up-right"*/}
            <div className="relative w-[440px] h-[576px] overflow-hidden">
                {Slider && (
                    <Slider {...settings}>
                        <div className="flex relative bg-[#FEE2B6] py-[20px] px-[50px] rounded-2xl flex-col overflow-hidden">
                            <div className="relative rounded-2xl h-[450px] p-[20px] bg-green-400">
                                <h3 className="text-white text-xl">Enjoy Your Trip</h3>
                                <h4 className="leading-[50px] font-bold text-white">Set up all trip</h4>
                                <label htmlFor="" className="flex items-center">
                                    <input type="text" placeholder="Plan a Trip" className="p-[15px] rounded-lg outline-none w-[300px] relative pr-[50px] border-0" readOnly={true}/>
                                    {/*<i className="fa-solid fa-arrow-right text-primary"></i>*/}
                                </label>
                                <div className="flex mt-[20px] text-white">
                                    <ul className="relative">
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex items-center bg-white rounded-bl-[30px] rounded-br-[30px] p-[20px] w-full">
                                    <h4 className="text-2xl font-bold text-gray-500">$100.99</h4>
                                    <span className="font-bold text-gray-400">/ per Trip</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex bg-[#FEE2B6] relative py-[20px] px-[50px] rounded-2xl flex-col overflow-hidden">
                            <div className="relative rounded-2xl h-[450px] p-[20px] bg-primary">
                                <h3 className="text-white text-xl">Enjoy Your Trip</h3>
                                <h4 className="leading-[50px] font-bold text-white">Set up all trip</h4>
                                <label htmlFor="" className="flex items-center">
                                    <input type="text" placeholder="Plan a Trip"
                                           className="p-[15px] rounded-lg outline-none w-[300px] relative pr-[50px] border-0"
                                           readOnly={true}/>
                                    {/*<i className="fa-solid fa-arrow-right text-primary"></i>*/}
                                </label>
                                <div className="flex mt-[20px] text-white">
                                    <ul className="relative">
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                        <li className="mt-[10px]">
                                            <label htmlFor="" className="flex items-center gap-[10px]">
                                                <i className="fa-solid fa-circle-dot text-white"></i>
                                                <span className="font-bold">Set Up Your Account</span>
                                            </label>
                                            <p className="ml-[25px] opacity-[0.8] leading-[30px]">Book your best
                                                experience</p>
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    className="flex items-center bg-white rounded-bl-[30px] rounded-br-[30px] p-[20px] w-full">
                                    <h4 className="text-2xl font-bold text-gray-500">$100.99</h4>
                                    <span className="font-bold text-gray-400">/ per Trip</span>
                                </div>
                            </div>
                        </div>
                    </Slider>
                )}
            </div>

            <div className="flex flex-col gap-[20px] w-[500px]" data-aos="fade-left">
                <h2 className="text-4xl font-bold mb-[20px]">Book Easy 3 Steps</h2>
                <p className="opacity-[0.9] leading-[25px]">Planning a trip is sometimes not easy. But Trip Plan will help you to manage time and budget for your
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
                    <p><i className="font-light text-gray-500 opacity-[0.8]">“Plan your trip with a 3-step trip plan. Check in out at a glance, select hotel rooms on the
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