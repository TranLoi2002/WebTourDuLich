import {Link} from "react-router-dom";
import img_tour_1 from "../assets/images/image_tour_1.avif";

const CardTour = ({tour}) => {
    return (
        <div className="card-tour border rounded-lg shadow-md p-4 w-full md:w-[300px] flex flex-col">
            <div className="img-tour h-[200px] w-full overflow-hidden rounded-lg mb-3">
                <img
                    src={tour.image || img_tour_1}
                    alt="Tour Image"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="price mb-2">
                {tour.discount > 0 && (
                    <Link to="" className="price-sale bg-red-500 text-white px-2 py-1 rounded text-sm inline-block">
                        -{tour.discount}%
                    </Link>
                )}
            </div>

            {/* Tiêu đề cố định chiều cao, dòng dài sẽ hiển thị 2 dòng hoặc cắt đi */}
            <p className="text-base font-semibold mb-2 h-[48px] overflow-hidden">
                {tour.title.length <= 40 ? tour.title : tour.title.substring(0, 40) + "..."}
            </p>

            <div className="review flex flex-wrap justify-between items-center text-sm mb-3">
                <div className="review-star flex items-center">
                    <i className="fa-solid fa-star text-yellow-500 mr-1"></i>
                    <span>4.8 (12 reviews)</span>
                </div>
                <div className="duration text-gray-500">Duration: {tour.duration}</div>
            </div>

            <Link
                to={`/tours/detailtour/${tour.id}`}
                className="mt-auto bg-[#3b71fe] p-2 rounded-lg text-white text-center w-full"
            >
                Price ${tour.price}
            </Link>
        </div>

    );
}

export default CardTour;