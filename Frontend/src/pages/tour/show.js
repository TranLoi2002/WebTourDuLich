import React, {useState, useEffect} from 'react';
import HorizontalLayout from '../../components/horizontalLayout';
import GridLayout from '../../components/gridLayout';
import MasonryLayout from '../../components/masonryLayout';
import {getAllTour} from "../../api/tour.api";
import {getAllLocation} from "../../api/location.api";
import {getAllTourType} from "../../api/tourtype.api";
import {getTourByTourTypeId} from "../../api/tourtype.api";
import SkeletonTourCard from "../../components/SkeletonTourCard";


const Show = () => {
    // const [layout, setLayout] = useState('horizontal');
    const [loading, setLoading] = useState(true);

    const [tourSale, setTourSale] = useState([]);
    const [tourFav, setTourFav] = useState([]);
    const [locations, setLocations] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);

    const [selectedTourType, setSelectedTourType] = useState(null);
    const [tourByTourType, setTourByTourType] = useState([]);

    // get tour have discount from tour.api.js
    useEffect(() => {
        const fetchSaleTours = async () => {
            try {
                const response = await getAllTour();
                const filterTours = response.filter(tour => tour.discount > 10);
                setTourSale(filterTours);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleTours();
    }, []);

    useEffect(() => {
        const fetchFavTours = async () => {
            try {
                const response = await getAllTour();
                const filterTours = response.filter(tour => tour.currentParticipants > 0);
                setTourFav(filterTours);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavTours();
    }, []);

    // get location from location.api.js
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await getAllLocation();
                setLocations(response);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);

    // get tour type from tourtype.api.js
    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                const response = await getAllTourType();
                setTourTypes(response);
                if (response.length > 0) {
                    setSelectedTourType(response[0].id); // Set the first tour type as default
                }
            } catch (error) {
                console.error("Error fetching tour types:", error);
            }
        };

        fetchTourTypes();
    }, []);

    useEffect(() => {
        const fetchToursByTourType = async () => {
            if (selectedTourType) {
                try {
                    const response = await getTourByTourTypeId(selectedTourType);
                    setTourByTourType(response);
                } catch (error) {
                    console.error("Error fetching tours by tour type:", error);
                }
            }
        };

        fetchToursByTourType();
    }, [selectedTourType]);

    return (
        <div className="show_tour">
            {loading ? (
                <div className="skeleton-container">
                    {Array.from({length: 5}).map((_, index) => (
                        <SkeletonTourCard key={index}/>
                    ))}
                </div>
            ) : (
                <>
                    {tourSale.length > 0 ? (
                        <HorizontalLayout tours={tourSale} title="Tour sale" isShowDescCard={true}/>
                    ) : null}

                    {tourFav.length > 0 ? (
                        <GridLayout tours={tourFav} itemsPerPage={6} title="Tour favourite" isShowDescCard={true}/>
                    ) : null}

                    {locations.length > 0 ? (
                        <MasonryLayout locations={locations} title={"Top destinations"}/>
                    ) : null}


                    {tourTypes.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold mt-8">Your plan by favourites ?</h2>
                            <div className="mt-6 flex flex-row gap-3">
                                {tourTypes.map((tourType) => (
                                    <div
                                        key={tourType.id}
                                        className={`p-4 rounded-full ${selectedTourType === tourType.id ? 'border-2 border-blue-500 bg-blue-100 ' : ''}`}
                                        onClick={() => setSelectedTourType(tourType.id)}
                                    >
                                        <h3 className={`${selectedTourType === tourType.id ? 'text-blue-500' : ''}`}>{tourType.name}</h3>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <HorizontalLayout tours={tourByTourType} title="" isShowDescCard={false}/>
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}

export default Show;