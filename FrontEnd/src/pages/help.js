import img_bg from '../assets/images/predictive.png'
import {Link} from 'react-router-dom'

const Help = () => {
    return (
        <div className="">
            <div className="bg-primary py-[100px] px-[200px] flex items-center">
                <div className="flex flex-col relative">
                    <h2 className="text-7xl text-white text-shadow-xl">Need help? </h2>
                    <p className="text-xl text-white ">We're here for you 24/7.</p>
                    <span className="text-[1em] leading-5 font-bold text-white pt-5">Support in approx. 30s</span>
                    <div className="flex items-center gap-[15px] pt-5">
                        <Link to="/" className="py-[8px] px-[15px] rounded-lg border-2 outline-none font-bold text-xl text-white bg-transparent">Search Bookings</Link>
                        <Link to="/auth/sign_in" target="_blank" className="py-[8px] px-[15px] rounded-lg border-2 outline-none text-xl font-bold text-primary bg-white">Sign In or Register</Link>
                    </div>
                    <label for="" className="search_box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="What can we help with you?" />
                    </label>
                </div>
                <div className="image_adds">
                    <img src={img_bg} alt=""/>
                </div>
            </div>

            <div className="flex flex-col bg-white">
                <div className="mx-[200px] my-[20px] shadow-xl rounded-lg p-5">
                    <h2 className="text-xl">Service Chat</h2>
                    <div className="relative mt-[20px]">
                        <ul className="flex items-center gap-[10px]">
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
                    <div className="grid grid-cols-2 gap-[10px] mt-[20px] service_ques">
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
                    <h3 className="leading-5 my-5">Flights FAQ Topics</h3>
                    <div className="relative faq-select">
                        <ul className="flex gap-[10px]">
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
                <div className="flex flex-col gap-[10px] shadow-xl mx-[200px] py-[20px] rounded-lg p-5 infor_adds">
                    <h2>Airtrav.com Service Guarantee</h2>
                    <span>Trip Planner says your 50% discount on airtrav and hotel up to 80% off.
                    <a href="#">Learn more</a>
                </span>
                </div>
                <div className="my-[20px] mx-[200px] shadow-xl rounded-lg py-[20px] px-[60px] flex items-center gap-[50px]">
                    <div className="help_left bg-primary text-white flex flex-col items-center gap-[20px] rounded-lg py-[50px] px-[50px]">
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
                    <div className="flex flex-col gap-[20px] help_right">
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

                        <div className="">
                            <button type="submit" id="send" className="outline-none border-none bg-primary text-white py-[10px] px-[30px] font-bold text-xl rounded-lg">Send</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
)
}

export default Help;
