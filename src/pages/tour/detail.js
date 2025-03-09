const DetailTour = ({ match }) => {
    return (
        <div className="detail_container">
            <div className="detail_content">
                <div className="title_content">
                    <h2>Travel Information</h2>
                </div>
                <div className="trip_main">
                    <div className="trip_infor">
                        <span className="Tour">Tour</span>
                        <label for="">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>BangKok, Thailand</span>
                        </label>
                    </div>
                    <div className="top">
                        <div className="image_main">
                            <img src="https://picsum.photos/200" alt=""/>
                        </div>
                        <div className="image_second">
                            <img src="https://picsum.photos/300" alt=""/>
                            <img src="https://picsum.photos/400" alt=""/>
                        </div>
                    </div>
                </div>

                <div className="top_infor">
                    <div className="review">
                        <img src="https://picsum.photos/500" alt=""/>
                    </div>
                    <div className="content">
                        <div className="details_review">
                            <i className="fa-solid fa-star"></i>
                            <span>Good</span>
                            <h5>545 Cares</h5>
                        </div>
                        <h2 id="name">Thailands Ayutthaya Temples Cruise from BangKok</h2>
                        <div className="details">
                            <label for="">
                                <span>Tour Code</span>
                                <a href="#" id="tcode">NNSGN471-007-63535CX-V</a>
                            </label>
                            <label for="">
                                <span>Departure</span>
                                <a href="#" id="depart">24/06/2023</a>
                            </label>
                            <label for="">
                                <span>Duration:</span>
                                <a href="#" id="dura">1 days</a>
                            </label>
                            <label for="">
                                <span>Place of departure</span>
                                <a href="#" id="place">Ho Chi Minh City</a>
                            </label>
                            <label for="">
                                <span>Available seat:</span>
                                <a href="#">11</a>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="mid_details">
                    <div className="details_left">
                        <div className="infor_travel">
                            <div className="infor_header">
                                <h2>Thailand – A Land of Wonder</h2>
                                <div className="status">
                                    <label for="">
                                        <i className="fa-sharp fa-solid fa-thumbs-up"></i>
                                        <span>Like</span>
                                    </label>
                                    <label for="">
                                        <i className="fa-solid fa-share"></i>
                                        <span>Share</span>
                                    </label>
                                </div>
                            </div>
                            <p className="intro">The beautiful country of Thailand is considered as a tourist paradise,
                                the "land of friendly smiles" in Southeast Asia. Located in a quite favorable
                                geographical position in the region, with borders in contact with many countries, ethnic
                                groups, Thai culture has developed very early, inherited and mixed, influenced many
                                unique features of neighboring peoples to create a Thailand with its own cultural
                                identities, is a symbol of a country of agriculture and Buddhism. Visit Thailand with
                                Airtrav today!</p>

                            <h2>Interesting experiences in the program</h2>
                            <p>
                                <span>- South Gate of Ayutthaya Temple:</span>
                                Thai Smile airline flight hours super nice - full 5 days 4 nights and 30kg checked
                                baggage.
                            </p>
                            <p>
                                <span>- Angkor Wat Temple:</span>
                                a 12th-century temple, a World Heritage Site famous for its magnificent architecture,
                                the most visited in Cambodia.
                            </p>
                            <p>
                                <span>- Ta Prohm - </span>
                                an ancient Khmer ruin with bizarre-shaped trees was chosen by Hollywood as the filming
                                set for the movie "The Secret of the Ancient Tomb", and some other temples in the
                                area...
                            </p>

                            <h2>Are you ready?</h2>
                            <p>
                                - Vaccine Certificate (Vaccine certificate) English version: Confirmation of at least 2
                                vaccine shots with QR code / or confirmation of F0 recovery from the disease (English).
                                The information on the certificate must match the information on the passport.
                            </p>
                            <p>
                                - Children over 12 years old are required to have a certificate of vaccination with 2
                                doses
                            </p>

                            <p>
                                - In case children under 12 years old are not old enough to receive injections
                                accompanied by parents who have injected without testing.
                            </p>

                        </div>
                        <div className="highlight">
                            <h3>Highlight</h3>
                            <ul>
                                <li>Escape Bangkok on a trip to Ayutthaya, a UNESCO World Heritage Site</li>
                                <li>Admire temples and palaces with a mix of architectural styles</li>
                                <li>A guide brings the history of each landmark to life</li>
                                <li>Relax during a coach journey and river cruise, with buffet lunch</li>
                                <li>Avoid the hassle of public transport and car hire</li>
                            </ul>
                            <h4>Tour Itinerary</h4>
                            <span>Day1</span>
                            <div className="day_details">
                                <ul>
                                    <li>8h30-17:00 Pickup</li>
                                    <li>Visit 4 islands in the south</li>
                                    <li>Gam Ghi Island: Snorkelling, coral reef watching</li>
                                    <li>Buom Island (or Mong Tay Island): Snorkeling</li>
                                    <li>May Rut Island: R&R</li>
                                    <li>Lunch on the island</li>
                                    <li>Seawalker activity (at own expense): Walking on the ocean floor in an air-pumped
                                        suit
                                    </li>
                                    <li>Temple of the Reclining Buddha (Wat Lokayasutharam)</li>
                                    <li>Drop-off</li>
                                    <li>End of tour.</li>
                                </ul>
                            </div>
                            <img src="" alt=""/>
                            <h3>What you'll Experience?</h3>
                            <p className="expr">This full-day private tour from Bangkok takes you to the UNESCO Heritage
                                Site of Ayutthaya, one of Indo-China's most prosperous cities during the ancient times.
                                See traces of its glorious past on the red brick ruins in and around the city island
                                surrounded by the rivers of Chao Phraya, Pa Sak, and Lop Buri. Visit the Bang Pa-in
                                Palace, the summer retreat of the royal court in the 17th century. You will also stop by
                                four important temples of exquisite designs before heading back to Bangkok.</p>
                        </div>
                        <div className="notes">
                            <h3>If you have any notes, please tell us!</h3>
                            <div className="select_notes">
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>Smoke</span>
                                </label>
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>High Floor Room</span>
                                </label>
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>Hyperactive children</span>
                                </label>
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>Vegetarian</span>
                                </label>
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>There are people with disabilities</span>
                                </label>
                                <label for="">
                                    <input type="checkbox" name="" id=""/>
                                    <span>Pregnant women</span>
                                </label>
                            </div>
                            <div className="mess_add">
                                <h4>Additional Notes</h4>
                                <textarea name="" id="" cols="30" rows="10"
                                          placeholder="Please enter your messages"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="book_container">
                        <div className="book_contact">
                            <label for="">
                                <i className="fa-solid fa-phone"></i>
                                <span>Free call over the internet</span>
                            </label>
                            <label for="">
                                <i className="fa-solid fa-envelope"></i>
                                <span>Submit a support request now</span>
                            </label>
                        </div>
                        <div className="book_now">
                            <h2>Trip summary</h2>
                            <p>All-Inclusive Tour
                                <span>(9 pax)</span>
                            </p>
                            <div className="infor_book">
                                <img src="image/image_main.jpg" alt=""/>
                                <p>Thailands Ayutthaya Temples Cruise from BangKok</p>
                            </div>
                            <div className="schedule">
                                <label for="">
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>Start your trip</span>
                                    Saturday, 24 June
                                </label>
                                <label for="">
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>End your trip</span>
                                    Sunday, 25 June
                                </label>

                            </div>
                            <div className="infor_booking">
                                <label for="">
                                    <h4>Passenger</h4>
                                    <span id="totalPer">0 person</span>
                                </label>
                                <label for="">
                                    <h4>Adult</h4>
                                    <div className="discrea">
                                        <i className="fa-solid fa-minus" onclick="minusAdult()"></i>
                                        <span id="Adult">0</span>
                                        <i className="fa-solid fa-plus" onclick="addAdult()"></i>
                                    </div>
                                </label>
                                <label for="">
                                    <h4>Children</h4>
                                    <div className="discrea">
                                        <i className="fa-solid fa-minus" onclick="minusChild()"></i>
                                        <span id="Chil">0</span>
                                        <i className="fa-solid fa-plus" onclick="addChild()"></i>
                                    </div>
                                </label>
                                <label for="">
                                    <h4>Baby</h4>
                                    <div className="discrea">
                                        <i className="fa-solid fa-minus" onclick="minusBaby()"></i>
                                        <span id="bby">0</span>
                                        <i className="fa-solid fa-plus" onclick="addBaby()"></i>
                                    </div>
                                </label>
                                <label for="">
                                    <h4>Private room surcharge</h4>
                                    <div className="discrea_check">
                                        <input type="radio" id="private"/>
                                        <span>$1600</span>
                                    </div>
                                </label>
                                <label for="" className="discount">
                                    <h4>Discount Code</h4>
                                    <div className="discrea">
                                        <input type="text" placeholder="Add Code" id="sale"/>
                                        <button onclick="checkGiamGia()">Apply</button>
                                    </div>
                                </label>
                                <label for="" className="total">
                                    <h4>TOTAL</h4>
                                    <div className="discrea_total">
                                        <span id="totalMoney">0</span>
                                    </div>
                                </label>
                                <button className="book_submit" id="loadPayMent">BOOK NOW</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div id="modal" className="modal">*/}
            {/*    <div className="modal-content">*/}
            {/*        <span className="close">&times;</span>*/}
            {/*        <div className="nav_logo" title="Back to home" >*/}
            {/*            <a href="#">*/}
            {/*                <img src="image/logo.png" alt=""/>*/}
            {/*                    <span>Airtrav</span>*/}
            {/*            </a>*/}
            {/*        </div>*/}
            {/*        <div><h2 style={{fontSize: '2em'}} className="payment">Payment</h2></div>*/}

            {/*        <form id="myForm" className="formFAQ">*/}
            {/*            <div className="infor">*/}
            {/*                <div className="infor-cus">*/}
            {/*                    <div className="contact">*/}
            {/*                        <h3>Contact</h3>*/}
            {/*                    </div>*/}
            {/*                    <div className="name">*/}
            {/*                        <label htmlFor="fullname">Full Name:</label>*/}
            {/*                        <input title="first your name" type="text" id="firstname" name="firstname" required/>*/}
            {/*                            <input title="last your name" type="text" id="lastname" name="lastname" required/>*/}
            {/*                    </div>*/}
            {/*                    <div className="email">*/}
            {/*                        <label htmlFor="email">Email:</label>*/}
            {/*                        <input id="email" name="email" required/>*/}
            {/*                    </div>*/}
            {/*                    <div className="phone">*/}
            {/*                        <label htmlFor="phone">Phone:</label>*/}
            {/*                        <input id="phone" name="phone" required/>*/}
            {/*                    </div>*/}
            {/*                    <div className="paymentMe">*/}
            {/*                        <h3>Payment method</h3>*/}
            {/*                    </div>*/}
            {/*                    <div className="methods">*/}
            {/*                        <a className="method" onclick="qrMomo()"><img src="../imageMo/logo-momo.png" alt=""/></a>*/}
            {/*                        <a className="method" onclick="qrMomo()"><img src="../imageMo/th.jpg" alt=""/></a>*/}
            {/*                        <a className="mastercard" onclick="mastercard()"><img src="../imageMo/Mastercard_Logo_1990-2048x1223.png" alt=""/></a>*/}
            {/*                    </div>*/}
            {/*                    <div className="detail-method">*/}
            {/*                        <a id="momo-me" className="momo-method" target="_blank" href="../imageMo/My_Gallery.png"><img src="../imageMo/My_Gallery.png" alt=""/></a>*/}
            {/*                        <div className="visa-method" id="visa-me">*/}
            {/*                            <div className="cr">*/}
            {/*                                <label htmlFor="cr">Credit Card Number: </label>*/}
            {/*                                <input type="cr" id="cr" name="cr" required/>*/}
            {/*                            </div>*/}
            {/*                            <div className="cr-name">*/}
            {/*                                <label htmlFor="cr-name">Credit Card Name: </label>*/}
            {/*                                <input id="cr-name" name="cr-name" required/>*/}
            {/*                            </div>*/}
            {/*                            <div className="cvv">*/}
            {/*                                <label htmlFor="cvv">CVV: </label>*/}
            {/*                                <input id="cvv" name="cvv" required/>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="infor-tour">*/}
            {/*                    <div className="book_now1">*/}
            {/*                        <h2>Trip summary</h2>*/}
            {/*                        <div className="infor_book">*/}
            {/*                            <img src="image/image_main.jpg" alt=""/>*/}
            {/*                                <p>Thailands Ayutthaya Temples Cruise from BangKok</p>*/}
            {/*                        </div>*/}
            {/*                        <div className="infor_booking">*/}
            {/*                            <label htmlFor="">*/}
            {/*                                <h4>Passenger</h4>*/}
            {/*                                <span id="totalPer1">0 person</span>*/}
            {/*                            </label>*/}
            {/*                            <label htmlFor="">*/}
            {/*                                <h4>Adult</h4>*/}
            {/*                                <div className="discrea">*/}
            {/*                                    <span id="Adult1">0</span>*/}
            {/*                                </div>*/}
            {/*                            </label>*/}
            {/*                            <label htmlFor="">*/}
            {/*                                <h4>Children</h4>*/}
            {/*                                <div className="discrea">*/}
            {/*                                    <span id="Chil1">0</span>*/}
            {/*                                </div>*/}
            {/*                            </label>*/}
            {/*                            <label htmlFor="">*/}
            {/*                                <h4>Baby</h4>*/}
            {/*                                <div className="discrea">*/}
            {/*                                    <span id="bby1">0</span>*/}
            {/*                                </div>*/}
            {/*                            </label>*/}
            {/*                            <label htmlFor="">*/}
            {/*                                <h4>Private room surcharge</h4>*/}
            {/*                                <div className="discrea_check">*/}
            {/*                                    <input type="radio" id="private1"/>*/}
            {/*                                        <span>$1600</span>*/}
            {/*                                </div>*/}
            {/*                            </label>*/}

            {/*                            <label htmlFor="" className="total">*/}
            {/*                                <h4>TOTAL</h4>*/}
            {/*                                <div className="discrea_total">*/}
            {/*                                    <span id="totalMoney1">0</span>*/}
            {/*                                </div>*/}
            {/*                            </label>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className="footer">*/}
            {/*                <a className="btnApply" onclick="addTour()">CONFIRM</a>*/}
            {/*            </div>*/}
            {/*        </form>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
);
}

export default DetailTour;