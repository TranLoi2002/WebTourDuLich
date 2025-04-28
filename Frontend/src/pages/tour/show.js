import React, {useState, useEffect} from 'react';
import HorizontalLayout from '../../components/horizontalLayout';
import GridLayout from '../../components/gridLayout';
import MasonryLayout from '../../components/masonryLayout';
import {getAllTour} from "../../api/tour.api";
import {getAllLocation} from "../../api/location.api";
import {getAllTourType} from "../../api/tourtype.api";
import {getTourByTourTypeId} from "../../api/tourtype.api";
import SkeletonTourCard from "../../components/SkeletonTourCard";
import {useLoading} from "../../utils/LoadingContext"
import LoadingOverlay from "../../components/LoadingOverlay";


const Show = () => {
    // const [layout, setLayout] = useState('horizontal');
    const {isLoading, setIsLoading} = useLoading();

    const [tourSale, setTourSale] = useState([]);
    const [tourFav, setTourFav] = useState([]);
    const [locations, setLocations] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);

    const [selectedTourType, setSelectedTourType] = useState(null);
    const [tourByTourType, setTourByTourType] = useState([]);

    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(0);

    // get tour have discount from tour.api.js

    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'asc') => {
        let allData = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            const response = await fetchFunction(currentPage, size, sortBy, sortDir);
            allData = [...allData, ...response.content];
            currentPage = response.currentPage + 1;
            totalPages = response.totalPages;
        }

        return allData;
    };

    const fetchSaleTours = async () => {
        try {
            setIsLoading(true);
            const allTours = await fetchAllPages(getAllTour);
            const filterTours = allTours.filter(tour => tour.discount > 10 && tour.active === true && tour.status === "UPCOMING");
            setTourSale(filterTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const fetchFavTours = async () => {
        try {
            setIsLoading(true);
            const allTours = await fetchAllPages(getAllTour);
            const filterTours = allTours.filter(tour => tour.currentParticipants > 0 && tour.active === true && tour.status === "UPCOMING");
            setTourFav(filterTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTourTypes = async () => {
        try {
            setIsLoading(true);
            const allTourTypes = await fetchAllPages(getAllTourType);
            const activeTourTypes = allTourTypes.filter(tourType => tourType.active === true); // Filter active tour types
            setTourTypes(activeTourTypes);
            if (activeTourTypes.length > 0) {
                setSelectedTourType(activeTourTypes[0].id); // Set the first active tour type as default
            }
        } catch (error) {
            console.error("Error fetching tour types:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            setIsLoading(true);
            const allLocations = await fetchAllPages(getAllLocation);
            const activeLocations = allLocations.filter(location => location.active === true); // Filter active locations
            setLocations(activeLocations);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSaleTours();
        fetchFavTours();
        fetchTourTypes();
        fetchLocations();
    }, []);

    // get location from location.api.js


    useEffect(() => {
        const fetchToursByTourType = async () => {
            if (selectedTourType) {
                try {
                    setIsLoading(true);
                    const response = await getTourByTourTypeId(selectedTourType);
                    setTourByTourType(response);
                } catch (error) {
                    console.error("Error fetching tours by tour type:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchToursByTourType();
    }, [selectedTourType, setIsLoading]);

    return (
        <div className="show_tour">
            {isLoading ? (
                <>
                    <LoadingOverlay isLoading={true}/>
                    <div className="skeleton-container">
                        {Array.from({length: 5}).map((_, index) => (
                            <SkeletonTourCard key={index}/>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {tourSale.length > 0 && (
                        <HorizontalLayout
                            tours={tourSale}
                            title="Tour sale"
                            isShowDescCard={true}
                        />
                    )}

                    {tourFav.length > 0 && (
                        <GridLayout
                            tours={tourFav}
                            itemsPerPage={6}
                            title="Tour favourite"
                            isShowDescCard={true}
                        />
                    )}

                    {locations.length > 0 && (
                        <MasonryLayout locations={locations} title={"Top destinations"}/>
                    )}

                    {tourTypes.length > 0 && (
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
                            <HorizontalLayout
                                tours={tourByTourType}
                                title=""
                                isShowDescCard={false}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default Show;