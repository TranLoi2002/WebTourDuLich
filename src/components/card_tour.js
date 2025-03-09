import {Link} from "react-router-dom";

import img_tour_1 from "../assets/images/image_tour_1.avif";

const CardTour = ({ tour }) => {
    return (
        <div className="card-tour">
            <div className="img-tour">
                <img src={img_tour_1} alt="" className="tour"/>
                    <div className="price">
                        <a href="" className="price-sale">From $40</a>
                    </div>
            </div>
            <p>Thailands Ayutthaya Temples Cruise from BangKok</p>
            <div className="review">
                <div className="review-star">
                    {/*<img src="./public/star1.svg" alt=""/>*/}
                        <span>4.8 (12 reviews)</span>
                </div>
                <div className="duration">Duration: 9 hours</div>
            </div>
            <Link to="/tours/detail_tour" className="price-tour">Tours Price $61</Link>
        </div>
    );
}

export default CardTour;