import React from 'react';
import {Link} from "react-router-dom";

import img_1 from "../assets/images/image@2x.png";

const ActivityTourCard = ({tour}) => {


    return (
        <div className="card">
            <div className="image_adds">
                <img src={img_1} alt=""/>
            </div>
            <div className="card_infor">
                <h3>{tour.title}</h3>
                <div className="mb-3 flex gap-1 items-center">
                    <i className="fa-solid fa-location-dot"></i>
                    <h4 className="text-gray-600">{tour.location.name}</h4>
                </div>

                <div className="card_review mb-3">
                    <i className="fa-solid fa-star"></i>
                    <p>4.2 <span>(129 reviews) Tour</span></p>
                </div>
                <p className="leading-4 text-sm text-gray-500">Unique 360 panoramic views of the amazing Bangkok skyline, inspired from the best Champagne listings
                    worldwide.</p>
                <div className="read my-6">
                    <Link to={`/tours/detailtour/${tour.id}`}>Read more</Link>
                    <i className="fa-solid fa-angles-right"></i>
                </div>
                <div className="card_select">
                    <button className="add add-to-trip" id="add-button">Add to trip</button>
                    <Link to={`/tours/detailtour/${tour.id}`} className="price">Book now</Link>
                </div>
            </div>
        </div>
    )
}

export default ActivityTourCard;