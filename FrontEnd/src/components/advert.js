import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import CreateTripModal from '../components/createTripModal';
import {Button} from '@mui/material'

import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import imageMain1 from "../assets/images/image_main_1.png";
import imageMain2 from "../assets/images/image_main_2.png";
import imageMain3 from "../assets/images/image_main_3.png";
import waveimg from "../assets/images/wave.png";
import element_left from "../assets/images/eliment_left.png";
import brand_1 from "../assets/images/brand01.png";
import brand_2 from "../assets/images/booking_brand02.png";
import brand_3 from "../assets/images/trivago_brand03.png";
import brand_4 from "../assets/images/trainline_brand04.png";
import brand_5 from "../assets/images/cheapflight_brand05.png";
import brand_6 from "../assets/images/momondo_brand06.png";
import label01 from "../assets/images/label01.png";
import label02 from "../assets/images/label02.png";
import label03 from "../assets/images/label03.png";


const images = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673306773569-4d864b99c96c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1520501247332-6fb052b72414?q=80&w=2086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"];

const Advert = () => {

    const navigate = useNavigate();
    const handleFocus = () => {
        navigate('/thingstodo');
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div>
                <div className="w-screen h-[92vh] mx-auto overflow-hidden slider-container">
                    <Swiper
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{delay: 3000, disableOnInteraction: false}}
                        navigation={true}
                        pagination={{clickable: true}}  // pagination
                        modules={[Autoplay, Navigation, Pagination]}
                        className="w-full h-full"
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img src={img} alt={`slide-${index}`} className="w-full h-full object-cover"/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="header_infor_details">
                    <div className="flex items-center flex-wrap mt-[6rem] ml-[55px]" data-aos="zoom-in-up">
                        <h2 className="font-bold font-sans text-[4.5em] inline-block">Travel Planning Made<span
                            className="inline-block font-bold text-[#FFC83A] relative ml-[10px] leading-none text-shadow-md ">Easy</span>
                        </h2>
                        <img src={waveimg} alt="" className="relative flex pointer-events-none"/>
                    </div>
                    <p className="text-xl font-medium ml-[55px] text-gray-600">We make it easy to plan and book your
                        next trip with a Day by Day itinerary</p>
                    <div className="flex items-center ml-[120px] mt-[40px] gap-[1rem]">
                        <label htmlFor=""
                               className="relative flex items-center mt-[50px] mb-[80px] ml-[40px] overflow-hidden">
                            <input type="text" placeholder="Plan a Trip" onFocus={handleFocus}
                                   className="p-5 pl-8 border-none outline-none rounded-full w-[360px] h-[70px] shadow-inner bg-[rgba(232,217,217,0.8)] opacity-70 transition-all duration-200"
                            />
                            {/*<img className="absolute t-[50%] r-0" src={element_left} alt=""/>*/}
                            <button onClick={() => setModalIsOpen(true)}
                                    className="btn_create_trip">
                                Create trip
                                <i className="fa-solid fa-arrow-right p-1 bg-primary rounded-full text-white ml-[10px] cursor-pointer"></i>
                            </button>
                            <CreateTripModal open={modalIsOpen} handleClose={() => setModalIsOpen(false)}/>

                        </label>

                    </div>
                    <div className="flex flex-col m-[55px]">
                        <h5 className="font-bold mb-[20px] tracking-wider text-gray-400 pointer-events-none">Our
                            customers say</h5>
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
                                <p className="flex items-center justify-center text-gray-400 pr-2">out of 5 on 194
                                    reviewers</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative bg-[#F4F5F9] m-0">
                    <ul className="flex items-center justify-center p-[18px]">
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            href="https://amadeus.com/en" target="_blank" rel="noopener"><img
                            src={brand_1} alt="amadeus_brand_img" title="Click to details"/></a></li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            target="_blank" rel="noopener"
                            href="https://www.booking.com/index.vi.html?label=gen173nr-1BCAEoggI46AdIM1gEaPQBiAEBmAEquAEXyAEM2AEB6AEBiAIBqAIDuALj8NmgBsACAdICJDJlYmYyNDVlLTVkZTYtNDcwZi05MDAyLTY3YWQwZjc1ZTAxNNgCBeACAQ&keep_landing=1&sb_price_type=total&"><img
                            src={brand_2} alt="Booking.com_img" title="Click to details"/></a></li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            target="_blank" rel="noopener"
                            href="https://www.trivago.vn/vi/lm?themeId=280&tc=18&search=200-217&sem_keyword=trivago&sem_creativeid=553381580618&sem_matchtype=e&sem_network=g&sem_device=c&sem_placement=&sem_target=&sem_adposition=&sem_param1=&sem_param2=&sem_campaignid=329911942&sem_adgroupid=120724436555&sem_targetid=kwd-5593367084&sem_location=1028581&cipc=br&cip=8419000005&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeDScEOU0jbR8jRJiJJgbZxaTxaXi-p629w0Fb2bwXb3asRBHoQ_pwwaAtdKEALw_wcB"><img
                            src={brand_3} alt="trivago_brand_img" title="Click to details"/></a>
                        </li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            target="_blank" rel="noopener"
                            href="https://www.thetrainline.com/?phcode=1011l231656.&utm_campaign=theballyhoo&utm_medium=affiliate&utm_source=network&cm=0a1e.1011l231656&phcam=1100l229&~campaign_id=1100l229&~click_id=1011lwG5oJ2r"><img
                            src={brand_4} alt="trainline_brand_img"
                            title="Click to details"/></a></li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            target="_blank" rel="noopener"
                            href="https://www.vn.cheapflights.com/?lang=en&skipapp=true&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeAeKEqwiO3S_tTev3ziWv74xSb8ZQ2XRHb8W7tLKNsliwuryycS1hAaAtzsEALw_wcB"><img
                            src={brand_5} alt="cheapflight_brand_img"
                            title="Click to details"/></a></li>
                        <li className="flex items-center justify-center m-0 mx-10 transition-all duration-500"><a
                            target="_blank" rel="noopener" href="https://www.momondo.com/"><img
                            src={brand_6} alt="momodo_brand_img" title="Click to details"/></a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-gradient-to-t from-blue-100 to-transparent w-full">
                <div className="pt-[60px]">
                    <h1 className="text-4xl text-center font-bold" data-aos="fade-down">Innovative Trip Planning</h1>
                    <p className="mt-[18px] text-center leading-[30px]" data-aos="fade-down" data-aos-duration="5000">
                        Our Vision is to revolutionize the way people travel by
                        introducing intelligent trip planning
                    </p>
                </div>
                <div className="my-[70px] w-full flex justify-center gap-[30px]">
                    <a href="#"
                       className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item1"
                       data-aos="zoom-in">
                        <div className="adver-item">
                            <img src={label01} alt=""/>
                            <p className="mt-[18px] leading-5">Partner allows you to
                                <br/>browse multiple carriers
                                <br/>for travel.</p>
                            <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">Learn
                                more
                                <i className="fa-solid fa-arrow-right"></i>
                            </p>
                        </div>
                    </a>

                    <a href="#"
                       className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item2"
                       data-aos="zoom-in">
                        <div className="adver-item ">
                            <img src={label02} alt=""/>
                            <p className="mt-[18px] leading-5">The website is a way for
                                <br/>partners to communicate
                                <br/>with their customers.</p>
                            <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">Learn
                                more
                                <i className="fa-solid fa-arrow-right"></i></p>
                        </div>
                    </a>

                    <a href="#"
                       className="min-w-[20%] text-center p-[16px] text-black relative transition-all duration-200 bg-[rgba(59,210,59,0.2)] rounded-lg hover:bg-[rgb(194,229,194)] item3"
                       data-aos="zoom-in">
                        <div className="adver-item ">
                            <img src={label03} alt=""/>
                            <p className="mt-[18px] leading-5">The eBook Reader is
                                <br/>a new way to look at
                                <br/>e-books.</p>
                            <p className="mt-[25px] text-[1.1em] font-medium flex items-center justify-center gap-[10px] transition-all duration-200 hover:tracking-wider">Learn
                                more
                                <i className="fa-solid fa-arrow-right"></i></p>
                        </div>
                    </a>
                </div>
            </div>

        </div>
    );
}

export default Advert;