import {Link} from 'react-router-dom'


import adds_header from '../../assets/images/adds_header.jpg';
import image_1 from '../../assets/images/image_1.jpg';

const Show = () => {
    return (
        <div className="tour-page">
            <div className="flex flex-col mt-[100px] mx-[200px] justify-center">
                <h3 className="text-[2em]">The Airtrav Blog</h3>
                <h5 className="text-[#828080] leading-5 border-b-2 pb-[25px] text-[1.5em]">9 Ways to Flight Booking of
                    the Airtrav website</h5>
                <div className="flex justify-between my-[15px] mx-0">
                    <h4 className="text-[#58c270] bg-[#EEF9F2] text-[0.8em] py-[8px] px-[10px] rounded-lg">Tour
                        Planning</h4>
                    <span className="text-[#9d9c9c] font-bold">Jun 20,2020</span>
                </div>
                <div className="flex flex-col">
                    <div className="w-full h-[500px] rounded-2xl overflow-hidden">
                        <img src={adds_header} alt="" className="object-cover w-full h-full"/>
                    </div>

                    {/*<img src="image/adds_header.jpg" alt=""/>*/}
                    <p id="paragraph" className="leading-6 mt-[15px]">
                        <b style={{fontSize: '1.3em'}}>Airtrav is a popular travel website that offers a wide range of
                            flight booking options to its customers. Here are 9 ways to book flights on
                            Airtrav:</b><br/>
                        <br/><b>1. Book directly on the Airtrav website:</b> This is the most straightforward way to
                        book flights on Airtrav. Customers can enter their travel details, including their destination,
                        travel dates, and number of passengers, and then browse through the available flight options.
                        <br/><b>2. Use the Airtrav mobile app:</b> Airtrav also offers a mobile app that customers can
                        download and use to book flights. The app is available for both Android and iOS devices and
                        offers all the same features as the website.
                        <br/><b>3. Sign up for Airtrav's newsletter:</b> By signing up for Airtrav's newsletter,
                        customers can stay up-to-date on the latest flight deals and promotions. They may also receive
                        exclusive discounts and offers that are not available to the general public.
                        <br/><b>4. Use Airtrav's flexible search feature:</b> Airtrav's flexible search feature allows
                        customers to search for flights based on their budget, preferred airline, travel dates, and
                        other factors. This can help customers find the best flights at the best prices.
                        <br/><b>5. Book flights in advance:</b> Customers who book their flights well in advance of
                        their travel dates may be able to find better deals and discounts. Airtrav allows customers to
                        book flights up to 11 months in advance.
                        <br/><b>6. Use Airtrav's price alerts:</b> Customers can set up price alerts on Airtrav to
                        receive notifications when the price of a flight they are interested in drops. This can be a
                        great way to save money on flights.
                        <br/><b>7. Bundle flights with hotels and car rentals:</b> Airtrav also offers bundle packages
                        that include flights, hotels, and car rentals. Customers can save money by booking all of these
                        components together.
                        <br/><b>8. Use Airtrav's loyalty program:</b> Airtrav's loyalty program rewards customers with
                        points for every flight they book through the website. These points can be redeemed for future
                        flight bookings or other rewards.
                        <br/><b>9. Contact Airtrav's customer service:</b> If customers have any questions or need help
                        booking their flights, they can contact Airtrav's customer service team. The team is available
                        24/7 and can assist customers with any issues or concerns they may have.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-[25px] mt-[50px] w-[70%]">
                        <div className="flex gap-[20px] border-b-2 pb-[30px]">
                            <div className="w-[30%] h-[200px] rounded-lg overflow-hidden">
                                <img src={image_1} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex flex-col items-start flex-1 w-[70%]">
                                <div className="flex items-center">
                                <span
                                    className="text-[#FA8F54] bg-[#FEE9DD] text-[0.8em] py-[8px] px-[10px] rounded-lg">Hotel Booking</span>
                                    <h4 className="text-[#9d9c9c] font-bold">Jun 20,2021</h4>
                                </div>
                                <h2 className="leading-6">
                                    <Link to="/blogs/detail_blog" className="text-gray-400">
                                        Top 20 Trip Planning System By Airtrav
                                    </Link>
                                </h2>
                                <p className="mt-4 leading-4">Being a Human Resource Manager, it is your responsibility
                                    to
                                    understand the needs of
                                    industries have different types of workforce, but they do have one thing in common -
                                    business travel.</p>
                            </div>
                        </div>
                        <div className="flex gap-[20px] border-b-2 pb-[30px]">
                            <div className="w-[30%] h-[200px] rounded-lg overflow-hidden">
                                <img src={image_1} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex flex-col items-start flex-1 w-[70%]">
                                <div className="flex items-center">
                                <span
                                    className="text-[#FA8F54] bg-[#FEE9DD] text-[0.8em] py-[8px] px-[10px] rounded-lg">Car Booking</span>
                                    <h4 className="text-[#9d9c9c] font-bold">Dec 20,2020</h4>
                                </div>
                                <h2>
                                    <Link className="text-gray-400" to="/blogs/detail_blog" >
                                        Booking System By Airtrav Website
                                    </Link>
                                </h2>
                                <p className="mt-4 leading-4">Being a Human Resource Manager, it is your responsibility
                                    to
                                    understand the needs of
                                    industries have different types of workforce, but they do have one thing in common -
                                    business travel.</p>
                            </div>
                        </div>


                    </div>
                    <div className="flex flex-col gap-[25px] mt-[50px] w-[30%] ml-16">
                        <h2 className="text-xl font-bold ">Blog communicate</h2>
                        <div>
                            <div className="flex gap-[20px] border-b-2 pb-[30px]">
                                <div className="flex flex-col items-start flex-1 w-[70%]">
                                    <div className="flex items-center">
                                        <h4 className="text-[#9d9c9c] font-bold">Jun 20,2021</h4>
                                    </div>
                                    <h2 className="leading-6">
                                        <Link target="_blank"
                                              to="https://www.smartertravel.com/best-travel-planning-apps/"
                                              rel="noopener" className="text-gray-400">
                                            Top 20 Trip Planning System By Airtrav
                                        </Link>
                                    </h2>
                                    <p className="mt-4 leading-4">Being a Human Resource Manager, it is your
                                        responsibility
                                        to
                                        understand the needs of
                                        industries have different types of workforce, but they do have one thing in
                                        common -
                                        business travel.</p>
                                </div>
                            </div>
                            <div className="flex gap-[20px] border-b-2 pb-[30px]">

                                <div className="flex flex-col items-start flex-1 w-[70%]">
                                    <div className="flex items-center">
                                        <h4 className="text-[#9d9c9c] font-bold">Dec 20,2020</h4>
                                    </div>
                                    <h2>
                                        <Link className="text-gray-400" target="_blank"
                                              to="https://www.travelandleisure.com/travel-tips" rel="noopener">
                                            Booking System By Airtrav Website
                                        </Link>
                                    </h2>
                                    <p className="mt-4 leading-4">Being a Human Resource Manager, it is your
                                        responsibility
                                        to
                                        understand the needs of
                                        industries have different types of workforce, but they do have one thing in
                                        common -
                                        business travel.</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div className="flex items-center justify-center">
                <button type="button" id="seeMore"
                        className="py-[15px] px-[30px] outline-none border-none bg-primary text-white rounded-2xl w-[180px] text-xl mt-[50px]">See
                    more
                </button>
            </div>
        </div>
    )
}

export default Show;