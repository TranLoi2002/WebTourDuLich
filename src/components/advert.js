import imageMain1 from "../assets/images/image_main_1.png";
import imageMain2 from "../assets/images/image_main_2.png";
import imageMain3 from "../assets/images/image_main_3.png";
import brand_1 from "../assets/images/brand01.png";
import brand_2 from "../assets/images/booking_brand02.png";
import brand_3 from "../assets/images/trivago_brand03.png";
import brand_4 from "../assets/images/trainline_brand04.png";
import brand_5 from "../assets/images/cheapflight_brand05.png";
import brand_6 from "../assets/images/momondo_brand06.png";

const Advert = () => {
    return (
        <div className="adver">
            <div className="header_infor">
                <div className="header_adds">
                    <div id="header_image_main">
                        <div className="slide-wrapper">
                            <div className="slide"><img src={imageMain1} alt="slider_image_homepage_1"/>
                            </div>
                            <div className="slide"><img src={imageMain2} alt="slider_image_homepage_2"/>
                            </div>
                            <div className="slide"><img src={imageMain3} alt="slider_image_homepage_3"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header_infor_details">
                    <div className="intro_details" data-aos="zoom-in-up">
                        <h2>Travel Planning Made</h2>
                        <span>Easy</span>
                        <img src="../image/wave.png" alt="" className="wave"/>
                    </div>
                    <p>We make it easy to plan and book your next trip with <br/> a Day by Day itinerary</p>
                    <div className="input_details">
                        <label htmlFor="" className="search_plan">
                            <input type="text" placeholder="Plan a Trip"/>
                            <i id="searchTour" className="fa-solid fa-arrow-right"></i>
                            <img src="../image/eliment_left.png" alt=""/>
                        </label>
                    </div>
                    <div className="feedback_details">
                        <h5>Our customers say</h5>
                        <div className="feedback_quality">
                            <div className="feedback_exp">
                                <span>Excellent</span>
                                <div className="feeback_ratings">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-regular fa-star-half-stroke"></i>
                                </div>
                            </div>
                            <div className="feedback_numbers">
                                <span>4.7</span>
                                <p>out of 5 on 194 reviewers</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header_brands">
                    <ul>
                        <li><a href="https://amadeus.com/en" target="_blank" rel="noopener"><img
                            src={brand_1} alt="amadeus_brand_img" title="Click to details"/></a></li>
                        <li><a target="_blank" rel="noopener"
                               href="https://www.booking.com/index.vi.html?label=gen173nr-1BCAEoggI46AdIM1gEaPQBiAEBmAEquAEXyAEM2AEB6AEBiAIBqAIDuALj8NmgBsACAdICJDJlYmYyNDVlLTVkZTYtNDcwZi05MDAyLTY3YWQwZjc1ZTAxNNgCBeACAQ&keep_landing=1&sb_price_type=total&"><img
                            src={brand_2} alt="Booking.com_img" title="Click to details"/></a></li>
                        <li><a target="_blank" rel="noopener"
                               href="https://www.trivago.vn/vi/lm?themeId=280&tc=18&search=200-217&sem_keyword=trivago&sem_creativeid=553381580618&sem_matchtype=e&sem_network=g&sem_device=c&sem_placement=&sem_target=&sem_adposition=&sem_param1=&sem_param2=&sem_campaignid=329911942&sem_adgroupid=120724436555&sem_targetid=kwd-5593367084&sem_location=1028581&cipc=br&cip=8419000005&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeDScEOU0jbR8jRJiJJgbZxaTxaXi-p629w0Fb2bwXb3asRBHoQ_pwwaAtdKEALw_wcB"><img
                            src={brand_3} alt="trivago_brand_img" title="Click to details"/></a>
                        </li>
                        <li><a target="_blank" rel="noopener"
                               href="https://www.thetrainline.com/?phcode=1011l231656.&utm_campaign=theballyhoo&utm_medium=affiliate&utm_source=network&cm=0a1e.1011l231656&phcam=1100l229&~campaign_id=1100l229&~click_id=1011lwG5oJ2r"><img
                            src={brand_4} alt="trainline_brand_img"
                            title="Click to details"/></a></li>
                        <li><a target="_blank" rel="noopener"
                               href="https://www.vn.cheapflights.com/?lang=en&skipapp=true&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeAeKEqwiO3S_tTev3ziWv74xSb8ZQ2XRHb8W7tLKNsliwuryycS1hAaAtzsEALw_wcB"><img
                            src={brand_5} alt="cheapflight_brand_img"
                            title="Click to details"/></a></li>
                        <li><a target="_blank" rel="noopener" href="https://www.momondo.com/"><img
                            src={brand_6} alt="momodo_brand_img" title="Click to details"/></a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="adver-container">
                <h1 class="adver-header" data-aos="fade-down">Innovative Trip Planning</h1>
                <p className="adver-sub-header" data-aos="fade-down" data-aos-duration="5000">
                    Our Vision is to revolutionize the way people travel by
                    introducing intelligent trip planning
                </p>
            </div>

            <div className="adver-items">
                <a href="#" className="btn-item item1" data-aos="zoom-in">
                    <div className="adver-item">
                        <img src="../image/label01.png" alt=""/>
                        <p className="">Partner allows you to
                            <br/>browse multiple carriers
                            <br/>for travel.</p>
                        <p className="learn-more">Learn more
                            <i className="fa-solid fa-arrow-right"></i>
                            </p>
                    </div>
                </a>

                <a href="#" className="btn-item item2" data-aos="zoom-in">
                    <div className="adver-item ">
                        <img src="../image/label02.png" alt=""/>
                        <p className="">The website is a way for
                            <br/>partners to communicate
                            <br/>with their customers.</p>
                        <p className="learn-more">Learn more
                            <i className="fa-solid fa-arrow-right"></i></p>
                    </div>
                </a>

                <a href="#" className="btn-item item3" data-aos="zoom-in">
                    <div className="adver-item ">
                        <img src="../image/label03.png" alt=""/>
                        <p className="">The eBook Reader is
                            <br/>a new way to look at
                            <br/>e-books.</p>
                        <p className="learn-more">Learn more
                            <i className="fa-solid fa-arrow-right"></i></p>
                    </div>
                </a>
            </div>
        </div>
);
}

export default Advert;