import {Link} from "react-router-dom";
// import img_tour_1 from "../assets/images/image_tour_1.avif";

const CardTour = ({tour, isShowDesc}) => {
    if (!tour || !tour.title) {
        return null; // Do not render the card if the tour object is empty or has no title
    }

    // Calculate the discounted price
    const discountedPrice = tour.discount > 0
        ? (tour.price * (1 - tour.discount / 100)).toFixed(2)
        : tour.price;

    return (
        <div className="card-tour border rounded-lg shadow-md p-4 w-full md:w-[300px] flex flex-col relative">
            <div className="img-tour h-[200px] w-full overflow-hidden rounded-lg mb-3">
                <img
                    src={tour.thumbnail ? tour.thumbnail : "https://via.placeholder.com/300"}
                    alt="Tour Image"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="">
                {tour.discount > 0 && (
                    <Link to="" className="price-sale bg-red-500 text-white px-2 py-1 rounded text-sm inline-block">
                        -{tour.discount}%
                    </Link>
                )}
                <span
                    className="absolute top-[40px] right-[30px] bg-white p-3 w-[30px] h-[30px] text-center rounded-full flex items-center justify-center">
                    <i className="fa-regular fa-heart"></i>
                </span>
            </div>

            <p className="text-base font-semibold mb-2 h-[48px] overflow-hidden">
                {tour.title.length <= 40 ? tour.title : tour.title.substring(0, 40) + "..."}
            </p>
            {isShowDesc && (
                <div>
                    <div className="review flex flex-wrap justify-between items-center text-sm mb-3">
                        <div className="review-star flex items-center">
                            <i className="fa-solid fa-star text-yellow-500 mr-1"></i>
                            <span>4.8 (12 reviews)</span>
                        </div>
                        <div className="duration text-gray-500">Duration: {tour.duration}</div>
                    </div>


                    <div className="flex flex-row items-center gap-4 ">
                        {tour.discount > 0 && (
                            <p className="text-gray-500 line-through text-[1rem]">
                                ${tour.price}
                            </p>
                        )}
                        <Link
                            to={`/tours/detailtour/${tour.id}`}
                            className="mt-auto bg-[#3b71fe] p-2 rounded-lg text-white text-center w-full"
                        >
                            ${discountedPrice}
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
}

export default CardTour;