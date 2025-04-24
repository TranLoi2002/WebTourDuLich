import {Link, useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {addFavouriteTourByUserId, getFavouriteTourByUserId, removeFavouriteTourByUserId} from "../api/user.api";

const CardTour = ({tour, isShowDesc, containerStyle}) => {

    const [isLiked, setIsLiked] = useState(false);

    // check like tour if do not login by user in localstorage
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const checkIfLiked = async () => {
            if (user) {
                try {
                    const favourites = await getFavouriteTourByUserId(user.id);
                    const isTourLiked = favourites.some((fav) => fav.id === tour.id);
                    setIsLiked(isTourLiked);
                } catch (error) {
                    console.error("Failed to fetch favourites:", error);
                }
            }
        };
        checkIfLiked();
    }, [user, tour.id]);

    if (!tour || !tour.title) {
        return null;
    }

    // Calculate the discounted price
    const discountedPrice = tour.discount > 0
        ? (tour.price * (1 - tour.discount / 100)).toFixed(2)
        : tour.price;

    const handleLikeClick = async () => {
        if (!user) {
            toast.info("Please login to like this tour.");
            return;
        }

        try {
            if (isLiked) {
                await removeFavouriteTourByUserId(user.id, tour.id);
                setIsLiked(false);
                toast.success("Removed from favourites.");
            } else {
                await addFavouriteTourByUserId(user.id, tour.id);
                setIsLiked(true);
                toast.success("Added to favourites.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        }
    };


    return (
        <div className={`card-tour ${containerStyle} border rounded-lg shadow-md p-4 flex flex-col relative`}>
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
                    className={`absolute cursor-pointer top-[40px] right-[30px] bg-white p-3 w-[30px] h-[30px] text-center rounded-full flex items-center justify-center ${
                        isLiked ? "text-red-500" : "text-white"
                    }`}
                >
                   <i
                       className={`fa-solid fa-heart ${isLiked ? "text-red-500" : "text-gray-300"} cursor-pointer`}
                       onClick={handleLikeClick}
                   />
                </span>


            </div>

            <Link to={`/tours/detailtour/${tour.id}`} className="text-base font-semibold mb-2 h-[48px] overflow-hidden">
                {tour.title.length <= 40 ? tour.title : tour.title.substring(0, 40) + "..."}
            </Link>
            {isShowDesc && (
                <div>
                    <div className="review flex flex-wrap justify-between items-center text-sm mb-3">

                        {tour.totalReviews > 0 ? (
                            <div className="details_review">
                                <span>{tour.averageRating.toFixed(1)}</span>
                                <i className="fa-solid fa-star text-yellow-600"></i>
                                <span>
                                - ({tour.totalReviews} <i className="fa-solid fa-people-group"></i>)
                            </span>
                                {/*<span className="px-4 py-2 rounded bg-blue-200 text-blue-600 text-center">Good</span>*/}
                            </div>
                        ) : (
                            <span className="bg-gradient-to-r from-red-500 px-6 py-1 rounded-lg mb-3 text-white w-full ">
                                Tour is waiting for you
                                <Link to={`/tours/detailtour/${tour.id}`} className="underline text-primary ml-2">Book now</Link>
                            </span>
                        )}

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