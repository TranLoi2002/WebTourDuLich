import img_bg from '../assets/images/predictive.png'
import {Link} from 'react-router-dom'

const Help = () => {
    return (
        <div className="help_container">
            <div className="help_content">
                <div className="top_help">
                    <h2>Need help? </h2>
                    <p>We're here for you 24/7.</p>
                    <span>Support in approx. 30s</span>
                    <div className="select_help">
                        <Link to="/" className="search">Search Bookings</Link>
                        <Link to="/auth/sign_in" target="_blank" className="Sign">Sign In or Register</Link>
                    </div>
                    <label for="" className="search_box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="What can we help with you?"/>
                    </label>
                </div>
                <div className="image_adds">
                    <img src={img_bg} alt=""/>
                </div>
            </div>

            <div className="service-help">
                <div className="service_chat">
                    <h2>Service Chat</h2>
                    <div className="service-select">
                        <ul>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-plane"></i>
                                    <span>Flight</span>
                                </a></li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-hotel"></i>
                                    <span>Hotels</span>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-train-subway"></i>
                                    <span>Trains</span>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-car"></i>
                                    <span>Cars Rentals</span>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-shuffle"></i>
                                    <span>Airport Transfers</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="service_ques">
                        <label for="">
                            <span>How do I change my ticket?</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </label>
                        <label for="">
                            <span>How do I check my flight change/refund policy?</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </label>
                        <label for="">
                            <span>How can I cancel my flight ticket?</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </label>
                        <label for="">
                            <span>Have a different question? Chat with us now.</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </label>
                    </div>
                    <h3 className="faq">Flights FAQ Topics</h3>
                    <div className="faq-select">
                        <ul>
                            <li>
                                <a href="#">Hot topics</a>
                            </li>
                            <li>
                                <a href="#">Booking & Price</a>
                            </li>
                            <li>
                                <a href="#">Ticketing & Payment</a>
                            </li>
                            <li>
                                <a href="#">Booking query</a>
                            </li>
                            <li>
                                <a href="#">Personal information revision</a>
                            </li>
                            <li>
                                <a href="#">...</a>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="infor_adds">
                    <h2>Airtrav.com Service Guarantee</h2>
                    <span>Trip Planner says your 50% discount on airtrav and hotel up to 80% off.
                    <a href="#">Learn more</a>
                </span>
                </div>
                <div className="details_help">
                    <div className="help_left">
                        <h2 style={{color:'white'}}>Help Information</h2>
                        <span>Fill in the form or drop an email</span>
                        <label for="">
                            <i className="fa-solid fa-envelope"></i>
                            <span>airtravofficial@gmail.com</span>
                        </label>
                        <label for="">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>Liang Bang, Germany Berlin</span>
                        </label>
                        <label for="">
                            <i className="fa-solid fa-phone"></i>
                            <span>+75 5464 8373</span>
                        </label>

                    </div>
                    <div className="help_right">
                        <label for="" className="infor_name">
                            <label for="">
                                <span>Fisrt Name</span>
                                <input type="text" name="" id="" value="Dren"/>
                            </label>
                            <label for="">
                                <span>Last Name</span>
                                <input type="text" name="" id="" value="Morgan"/>
                            </label>
                        </label>

                        <label for="" className="subject">
                            <span>Subject</span>
                            <input type="text" name="" id="" value="How to Book a flight easily"/>
                        </label>
                        <label for="" className="mess">
                            <span>Message</span>
                            <textarea name="" id="" cols="30" rows="7" placeholder="Sure, Follow all instraction..."></textarea>
                        </label>

                        <div className="select_help_btn">
                            <button type="submit" id="send">Send</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
)
}

export default Help;
