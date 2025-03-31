import React, { useState } from 'react';
import img_1 from '../assets/images/image@2x.png';

const Things_to_do = () => {
    const [showSiteTrips, setShowSiteTrips] = useState(true);
    const [showMyTrips, setShowMyTrips] = useState(false);
    const [activityTypes, setActivityTypes] = useState({
        hiddenGems: false,
        shopping: false,
        historySites: false,
        nightlife: false,
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setActivityTypes((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    return (
        <div className="things-to-do">
            <div className="things_container">
                <div className="things_left">
                    <div className="top">
                        <h3>Search location or property</h3>
                        <label htmlFor="" className="search_locate">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Search location or property" />
                        </label>
                        <label htmlFor="check_trip" className="chk_trip">
                            <input
                                type="checkbox"
                                id="check_trip"
                                checked={showSiteTrips}
                                onChange={() => setShowSiteTrips(!showSiteTrips)}
                            />
                            <span>Show site trips</span>
                        </label>
                        <label htmlFor="show-my-trip" className="chk_trip">
                            <input
                                type="checkbox"
                                id="show-my-trip"
                                checked={showMyTrips}
                                onChange={() => setShowMyTrips(!showMyTrips)}
                            />
                            <span>Show items in my trips</span>
                        </label>
                    </div>
                    <div className="bottom">
                        <h3>Activity type</h3>
                        <label htmlFor="hiddenGems" className="chk-trip">
                            <input
                                type="checkbox"
                                id="hiddenGems"
                                name="hiddenGems"
                                checked={activityTypes.hiddenGems}
                                onChange={handleCheckboxChange}
                            />
                            <span>Hidden Gems</span>
                        </label>
                        <label htmlFor="shopping" className="chk-trip">
                            <input
                                type="checkbox"
                                id="shopping"
                                name="shopping"
                                checked={activityTypes.shopping}
                                onChange={handleCheckboxChange}
                            />
                            <span>Shopping</span>
                        </label>
                        <label htmlFor="historySites" className="chk-trip">
                            <input
                                type="checkbox"
                                id="historySites"
                                name="historySites"
                                checked={activityTypes.historySites}
                                onChange={handleCheckboxChange}
                            />
                            <span>History Sites</span>
                        </label>
                        <label htmlFor="nightlife" className="chk-trip">
                            <input
                                type="checkbox"
                                id="nightlife"
                                name="nightlife"
                                checked={activityTypes.nightlife}
                                onChange={handleCheckboxChange}
                            />
                            <span>Nightlife</span>
                        </label>
                    </div>
                </div>
                <div className="things_right" id="thing_right_items">
                    <div className="card">
                        <div className="image_adds">
                            <img src={img_1} alt="" />
                        </div>
                        <div className="card_infor">
                            <h3>CRU Champagne Bar</h3>
                            <div className="card_review">
                                <i className="fa-solid fa-star"></i>
                                <p>4.2 <span>(129 reviews) Tour</span></p>
                            </div>
                            <p>Unique 360 panoramic views of the amazing Bangkok skyline, inspired from the best Champagne listings worldwide.</p>
                            <div className="read">
                                <span>Read more</span>
                                <i className="fa-solid fa-angles-right"></i>
                            </div>
                            <div className="card_select">
                                <button className="add add-to-trip" id="add-button">Add</button>
                                <span className="price">Price $83</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image1@2x.png" alt="" />
                        </div>
                        <div className="card_infor">
                            <h3>Tour with Guiding</h3>
                            <div className="card_review">
                                <i className="fa-solid fa-star"></i>
                                <p>4.8 <span>(122 reviews) Tour</span></p>
                            </div>
                            <p>Unique 360 panoramic views of the amazing Bangkok skyline, inspired from the best Champagne listings worldwide. </p>
                            <div className="read">
                                <span>Read more</span>
                                <i className="fa-solid fa-angles-right"></i>
                            </div>
                            <div className="card_select">
                                <button className="add add-to-trip" id="add-button">Add</button>
                                <span className="price">Price $59</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="image_adds">
                            <img src="image/image_vn.png" alt="" />
                        </div>
                        <div className="card_infor">
                            <h3>Da Nang Campaign</h3>
                            <div className="card_review">
                                <i className="fa-solid fa-star"></i>
                                <p>4.9 <span>(345 reviews) Tour</span></p>
                            </div>
                            <p>Unique 360 panoramic views of the amazing Vietnam skyline, inspired from the best Campaign listings worldwide.</p>
                            <div className="read">
                                <span>Read more</span>
                                <i className="fa-solid fa-angles-right"></i>
                            </div>
                            <div className="card_select">
                                <button className="add add-to-trip" id="add-button">Add</button>
                                <span className="price">Price $79</span>
                            </div>
                        </div>
                    </div>
                    <div className="select_btn">
                        <button type="button" id="explore">Explore All</button>
                    </div>
                </div>
                <div className="trip-list" id="my-trip-list"></div>
            </div>
        </div>
    );
}

export default Things_to_do;