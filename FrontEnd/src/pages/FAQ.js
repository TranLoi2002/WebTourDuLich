import React , {useState} from "react";
import Modal from 'react-modal'

Modal.setAppElement('#root'); // tránh cảnh báo khi dùng Modal

const FAQ = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div class="fag_container">

            <div class="faq_content">
                <div class="header_faq">
                    <h2>Frequently Asked Questions</h2>
                    <button onClick={() => setModalIsOpen(true)} className="btn_addQuestion">
                        <i className="fa-solid fa-plus"></i> Add Question
                    </button>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    style={{
                        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                        content: { width: "50%", margin: "100px auto", padding: "20px", borderRadius: "10px" },
                    }}
                >
                    <div className="modal_top">
                        <h2>FAQ Question</h2>
                        <button onClick={() => setModalIsOpen(false)} className="close">&times;</button>
                    </div>

                    <form className="modal_content">
                        <label className="name">
                            <h4>Full Name:</h4>
                            <div className="modal_content_input">
                                <input type="text" required/>
                                <input type="text" required/>
                            </div>

                        </label>

                        <label className="email">
                            <h4>Email:</h4>
                            <div className="modal_content_input">
                                <input type="email" required/>
                            </div>

                        </label>

                        <label className="question">
                            <h4>Question:</h4>
                            <div className="modal_content_input">
                                <textarea rows="5"></textarea>
                            </div>

                        </label>
                        <div className="btn_submit_form_faq">
                            <button type="submit" className="btnSubmit">Submit</button>
                        </div>

                    </form>
                </Modal>

                <details>
                    <summary> What is Airtrav ? </summary>
                    <p>Airtrav is a trip planner that offers a platform to plan a fully-customized, realistic itinerary for any city and town across the world. Whenever you have to plan a trip, you have to take into account the major five factors influence your trip planning. These factors are- flights and transportation, hotels, attractions and things to do, tours & activities and restaurants.</p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> How can I contact you ? </summary>
                    <p>
                        You can contact me by clicking on the "Help" page on our website, which will provide you with several options for getting in touch with us. You can also reach out to our customer support team via email or phone, which are both listed on the website. We are always happy to assist you with any questions or concerns you may have regarding our travel booking services.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> When will you credit card be charged ? </summary>
                    <p>
                        Typically, your credit card will be charged at the time of booking or shortly thereafter, depending on the specific policies of the travel booking website. This should be clearly stated during the booking process, so be sure to read the terms and conditions carefully before finalizing your reservation. In some cases, you may be required to pay a deposit at the time of booking, with the balance due at a later date. It's important to understand the payment and cancellation policies of the website to avoid any unexpected charges or fees. If you have any questions or concerns about when your credit card will be charged, you should contact the website's customer support team for assistance.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> What does my quote include ?</summary>
                    <p>
                        The inclusions in your quote will depend on the specific tour package or travel booking that you have selected. In general, your quote should include all of the essential components of your trip, such as transportation, accommodation, meals, and activities. However, the exact details of what is included can vary widely depending on the nature of the tour or booking, as well as the policies of the travel booking website.
                        <br/>
                            When reviewing your quote, it's important to carefully read through the inclusions to ensure that you fully understand what is and isn't covered. Some tours or bookings may have additional fees or charges that are not included in the initial quote, such as taxes, tips, or optional excursions. Be sure to ask the travel booking website's customer support team if you have any questions or concerns about what is included in your quote, so that you can make an informed decision about your travel plans.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> Are they any specials ? </summary>
                    <p>
                        Yes, many travel booking websites offer specials or promotions for various destinations or packages. These specials can include discounts on flights, hotels, tours, and activities, as well as package deals that bundle multiple elements of your trip together for a lower price.
                        <br/>
                            It's always a good idea to compare prices and offers from multiple travel booking websites to ensure that you are getting the best deal possible for your travel plans. If you have any questions or concerns about a specific special or promotion, don't hesitate to reach out to the website's customer service team for more information.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> What do you think of plane food? Do you enjoy eating it? </summary>
                    <p>
                        It's important to note that eating on a plane can also be influenced by factors such as altitude, cabin pressure, and humidity, which can affect the way food tastes. If you have dietary restrictions or preferences, it's a good idea to request a special meal when booking your flight to ensure that your needs are met. Most airlines offer a range of special meal options to accommodate dietary needs.
                        <br/>
                            Overall, while plane food may not always be the highlight of a flight, it's important to stay hydrated and nourished during long flights to ensure your comfort and wellbeing. Many airlines offer the option to bring your own food or purchase food onboard, so you can choose what works best for you.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>
                <details>
                    <summary> Do you think air travel is an environmentally friendly way to travel? </summary>
                    <p>
                        It's important to note that airlines and the aviation industry are taking steps to reduce their environmental impact. Many airlines have implemented fuel-efficient technologies and are investing in sustainable aviation fuels to reduce their carbon emissions. Additionally, some airlines have implemented carbon offset programs that allow passengers to offset their flight's carbon footprint by contributing to environmental projects.
                        <br/>
                            As a traveler, there are also steps you can take to minimize your environmental impact while flying. These include packing light to reduce weight on the plane, choosing non-stop flights to reduce takeoff and landing emissions, and opting for sustainable transportation options such as public transit or electric taxis once you arrive at your destination.
                            <br/>
                                Overall, while air travel may not be the most environmentally friendly way to travel, the industry is taking steps to reduce its impact and travelers can also take steps to minimize their own impact.
                    </p>
                    <div class="review">
                        <label for="" id="like">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <div class="ques">
                    <span>Have you got your question yet?</span>
                </div>
            </div>


        </div>

)
}

export default FAQ;