import React, {useEffect} from 'react';
import {useState} from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {addFavouriteTourByUserId, getFavouriteTourByUserId, removeFavouriteTourByUserId} from "../api/user.api";

const ActivityTourCard = ({tour}) => {

    const [isLiked, setIsLiked] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const [tourDetails, setTourDetails] = useState(null);

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


    const discountedPrice = tour.discount > 0
        ? (tour.price * (1 - tour.discount / 100)).toFixed(2)
        : tour.price;

    return (
        <div className="card">
            <div className="image_adds w-[40%]">
                <img className="w-full" src={tour.thumbnail} alt=""/>
                {tour.discount > 0 && (
                    <Link to="" className="price-sale bg-red-500 text-white px-2 py-1 rounded text-sm inline-block">
                        -{tour.discount}%
                    </Link>
                )}
            </div>
            <div className="card_infor w-[60%]">
                <div className="flex flex-row justify-between">
                    <h3>{tour.title}</h3>
                    <button className="w-[250px]" onClick={handleLikeClick}>
                        {isLiked ? (<span className="bg-primary p-3 text-white rounded-lg">Added to trip</span>) : (
                            <span className="rounded-lg bg-gray-400 p-3 text-white">Add to trip</span>)}
                    </button>
                </div>

                <div className="mb-3 flex gap-1 items-center">
                    <i className="fa-solid fa-location-dot"></i>
                    <h4 className="text-gray-600">{tour.location.name}</h4>
                </div>

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
                    <span className="bg-gradient-to-r from-red-400 px-3 py-1 rounded-lg mb-3 text-white">
                        Let's review now
                    </span>
                )}

                <p className="leading-4 text-sm text-gray-500">{tour.description}</p>
                <div className="read my-6">
                    <Link to={`/tours/detailtour/${tour.id}`}>Read more</Link>
                    <i className="fa-solid fa-angles-right"></i>
                </div>
                <div className="duration text-gray-500">Duration: {tour.duration}</div>

                <div className="card_select">
                    <div className="flex flex-row items-center gap-3">
                        {tour.discount > 0 && (
                            <p className="text-gray-500 line-through text-[1rem]">
                                ${tour.price}
                            </p>
                        )}
                        <Link
                            to={`/tours/detailtour/${tour.id}`}
                            className="mt-auto bg-[#3b71fe] p-2 rounded-lg text-white text-center w-[250px]"
                        >
                            ${discountedPrice}
                        </Link>
                        {/*<Link to={`/tours/detailtour/${tour.id}`} className="price">Book now</Link>*/}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ActivityTourCard;