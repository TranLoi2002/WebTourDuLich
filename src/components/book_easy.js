import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


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
        <div className="booking_guide_container">
            {/*data-aos="fade-up-right"*/}
            <div className="slideshow_container">
                {Slider && (
                    <Slider {...settings}>
                        <div className="booking_cards">
                            <div className="card_create_2">
                                <h3>Enjoy Your Trip</h3>
                                <h4>Set up all trip</h4>
                                <label htmlFor="" className="search_booking">
                                    <input type="text" placeholder="Plan a Trip"/>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </label>
                                <div className="details_create">
                                    <ul>
                                        <li>
                                            <label htmlFor="" className=" infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Set Up Your Account</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                        <li>
                                            <label htmlFor="" className="infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Day by day Plan</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                        <li>
                                            <label htmlFor="" className="infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Booking System</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="booking_prices">
                                    <h4>$89.99</h4>
                                    <span>/ per Trip</span>
                                </div>
                            </div>
                        </div>

                        <div className="booking_cards">
                            <div className="card_create_3">
                                <h3>VIP with Trip</h3>
                                <h4>Set up all trip</h4>
                                <label htmlFor="" className="search_booking">
                                    <input type="text" placeholder="Plan a Trip"/>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </label>
                                <div className="details_create">
                                    <ul>
                                        <li>
                                            <label htmlFor="" className=" infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Set Up Your Account</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                        <li>
                                            <label htmlFor="" className="infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Day by day Plan</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                        <li>
                                            <label htmlFor="" className="infor">
                                                <i className="fa-solid fa-circle-dot"></i>
                                                <span>Booking System</span>
                                            </label>
                                            <p>Book your best experience</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="booking_prices">
                                    <h4>$299.99</h4>
                                    <span>/ per Trip</span>
                                </div>
                            </div>
                        </div>
                    </Slider>
                )}
            </div>

            <div className="booking_steps" data-aos="fade-left">
                <h2>Book Easy 3 Steps</h2>
                <p>Planning a trip is sometimes not easy. But Trip Plan will help you to manage time and budget for your
                    journey! There are only 3 steps: Create an account, choose your destination city.</p>
                <div className="details_steps">
                    <ul>
                        <li>
                            <label htmlFor=" " className="infor_booking">
                                <i className="fa-solid fa-circle-dot"></i>
                                <span>Set Up Your Account</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="" className="infor_booking">
                                <i className="fa-solid fa-circle-dot"></i>
                                <span>Respond to Private requests</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="" className="infor_booking">
                                <i className="fa-solid fa-circle-dot"></i>
                                <span>Booking System</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="step_advice">
                    <p><i>“Plan your trip with a 3-step trip plan. Check in out at a glance, select hotel rooms on the
                        go, and create a packing list”</i></p>
                </div>
                <div className="users_booking">
                    <img src="../image/avatar.png" alt=""/>
                    <div className="details_user">
                        <h3>Steve Jobs</h3>
                        <span>Co-Founder and CEO</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookEasy;