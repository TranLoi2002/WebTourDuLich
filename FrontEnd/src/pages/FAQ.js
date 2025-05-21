import React , {useState} from "react";
import Modal from 'react-modal'
import {TextField} from "@mui/material";

Modal.setAppElement('#root'); // tránh cảnh báo khi dùng Modal

const FAQ = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div className="">
            <div className="flex flex-col gap-[25px] my-[100px] mx-[200px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl mb-[30px] font-bold">Frequently Asked Questions</h2>
                    {/*<button onClick={() => setModalIsOpen(true)} className="bg-primary rounded-lg py-[14px] px-[22px] text-white cursor-pointer outline-none border-none">*/}
                    {/*    <i className="fa-solid fa-plus"></i> Add Question*/}
                    {/*</button>*/}
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    style={{
                        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                        content: { width: "45%", margin: "100px auto", padding: "20px", borderRadius: "10px" },
                    }}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl">FAQ Question</h2>
                        <button onClick={() => setModalIsOpen(false)} className="bg-primary text-white outline-none border-none py-[10px] px-[20px] rounded-lg cursor-pointer text-xl">&times;</button>
                    </div>

                    <form className="flex relative flex-col w-full mt-[2rem]">
                        <div className="flex items-center gap-4">
                            <h4 className="w-[20%]">Full Name:</h4>
                            <div className="w-[80%] items-center flex justify-between">
                                <TextField id="txtfname" label="First Name" required/>
                                <TextField id="txtlname" label="Last Name" required/>
                            </div>

                        </div>

                        <div className="flex items-center mt-4 gap-4">
                            <h4 className="w-[20%]">Email:</h4>
                            <div className="w-[80%]">
                                <TextField className="flex-1 w-full" id="txtemail" label="Email" required/>
                            </div>

                        </div>

                        <div className="flex items-center mt-4 gap-4">
                            <h4 className="w-[20%]">Question:</h4>
                            <div className="w-[80%]">
                                <textarea className="border-2 w-full flex-1 p-2" rows="3"></textarea>
                            </div>

                        </div>
                        <div className="flex items-end justify-end">
                            <button type="submit" className="rounded-lg p-3 text-white outline-none border-none bg-primary">Submit</button>
                        </div>

                    </form>
                </Modal>

                <details>
                    <summary> What is Airtrav ? </summary>
                    <p>Airtrav is a trip planner that offers a platform to plan a fully-customized, realistic itinerary for any city and town across the world. Whenever you have to plan a trip, you have to take into account the major five factors influence your trip planning. These factors are- flights and transportation, hotels, attractions and things to do, tours & activities and restaurants.</p>
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> How can I contact you ? </summary>
                    <p>
                        You can contact me by clicking on the "Help" page on our website, which will provide you with several options for getting in touch with us. You can also reach out to our customer support team via email or phone, which are both listed on the website. We are always happy to assist you with any questions or concerns you may have regarding our travel booking services.
                    </p>
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <details>
                    <summary> When will you credit card be charged ? </summary>
                    <p>
                        Typically, your credit card will be charged at the time of booking or shortly thereafter, depending on the specific policies of the travel booking website. This should be clearly stated during the booking process, so be sure to read the terms and conditions carefully before finalizing your reservation. In some cases, you may be required to pay a deposit at the time of booking, with the balance due at a later date. It's important to understand the payment and cancellation policies of the website to avoid any unexpected charges or fees. If you have any questions or concerns about when your credit card will be charged, you should contact the website's customer support team for assistance.
                    </p>
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
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
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
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
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
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
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
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
                    <div className="review_faq">
                        <label for="" id="like">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <span>Like</span>
                        </label>
                        <label for="" id="dislike">
                            <i className="fa-solid fa-thumbs-down"></i>
                            <span>Dislike</span>
                        </label>
                    </div>
                </details>

                <div className="py-[14px] px-[22px] rounded-lg bg-primary max-w-[500px] text-white mt-[30px]">
                    <span>Have you got your question yet?</span>
                </div>
            </div>


        </div>

)
}

export default FAQ;