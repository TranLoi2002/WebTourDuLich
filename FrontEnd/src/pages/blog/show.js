import adds_header from '../../assets/images/adds_header.jpg';
import image_1 from '../../assets/images/image_1.jpg';

const Show = () => {
    return (
        <div className="tour-page">

            <div className="blog_content">
                <h3>The Airtrav Blog</h3>
                <h5>9 Ways to Flight Booking of the Airtrav website</h5>
                <div className="top_blog">
                    <h4>Tour Planning</h4>
                    <span>Jun 20,2020</span>
                </div>
                <div className="adds_blog">
                    <img src={adds_header} alt=""/>
                    {/*<img src="image/adds_header.jpg" alt=""/>*/}
                    <p id="paragraph" style={{lineHeight: '30px'}}>
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

                <div className="card_blogs">
                    <div className="card">
                        <div className="image_adds">
                            <img src={image_1} alt=""/>
                        </div>
                        <div className="card_content">
                            <div className="status">
                                <span>Hotel Booking</span>
                                <h4>Jun 20,2021</h4>
                            </div>
                            <h2>
                                <a target="_blank" href="https://www.smartertravel.com/best-travel-planning-apps/"
                                   rel="noopener">
                                    Top 20 Trip Planning System By Airtrav
                                </a>
                            </h2>
                            <p>Being a Human Resource Manager, it is your responsibility to understand the needs of
                                industries have different types of workforce, but they do have one thing in common -
                                business travel.</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image_1.jpg" alt=""/>
                        </div>
                        <div className="card_content">
                            <div className="status">
                                <span>Car Booking</span>
                                <h4>Dec 20,2020</h4>
                            </div>
                            <h2>
                                <a target="_blank" href="https://www.travelandleisure.com/travel-tips" rel="noopener">
                                    Booking System By Airtrav Website
                                </a>
                            </h2>
                            <p>Being a Human Resource Manager, it is your responsibility to understand the needs of
                                industries have different types of workforce, but they do have one thing in common -
                                business travel.</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image_3.jpg" alt=""/>
                        </div>
                        <div className="card_content">
                            <div className="status">
                                <span>Car Booking</span>
                                <h4>Sep 20,2021</h4>
                            </div>
                            <h2>
                                <a target="_blank" href="https://www.smartertravel.com/best-car-rental-booking-sites/"
                                   rel="noopener">
                                    Top 16 Car Booking System By Airtrav
                                </a>
                            </h2>
                            <p>Being a Human Resource Manager, it is your responsibility to understand the needs of industries have different types of workforce, but they do have one thing in common - business travel.</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image_2.jpg" alt=""/>
                        </div>
                        <div className="card_content">
                            <div className="status">
                                <span>Flight Booking</span>
                                <h4>Oct 20,2021</h4>
                            </div>
                            <h2>
                                <a target="_blank" href="">
                                    5 days Trip Planning System Airtrav
                                </a>
                            </h2>
                            <p>Being a Human Resource Manager, it is your responsibility to understand the needs of industries have different types of workforce, but they do have one thing in common - business travel.</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image_4.jpg" alt=""/>
                        </div>
                        <div className="card_content">
                            <div className="status">
                                <span>Flight Booking</span>
                                <h4>Apr 20,2021</h4>
                            </div>
                            <h2>
                                <a target="_blank" href="https://www.washingtonpost.com/sf/style/2016/04/29/around-the-world-in-20-days/"  rel="noopener">
                                    20 days Trip Planning System Airtrav
                                </a>
                            </h2>
                            <p>Being a Human Resource Manager, it is your responsibility to understand the needs of industries have different types of workforce, but they do have one thing in common - business travel.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="select_btn_more">
                <button type="button" id="seeMore">See more</button>
            </div>
        </div>
    )
}

export default Show;