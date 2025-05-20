import React, { useState, useEffect } from 'react';
import HorizontalLayout from '../../components/horizontalLayout';
import GridLayout from '../../components/gridLayout';
import MasonryLayout from '../../components/masonryLayout';
import { getAllTour } from "../../api/tour.api";
import { getAllLocation } from "../../api/location.api";
import { getAllTourType, getTourByTourTypeId } from "../../api/tourtype.api";
import SkeletonTourCard from "../../components/SkeletonTourCard";
import { useLoading } from "../../utils/LoadingContext";
import LoadingOverlay from "../../components/LoadingOverlay";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Show = () => {
    const { isLoading, setIsLoading } = useLoading();
    const [tourSale, setTourSale] = useState([]);
    const [tourFav, setTourFav] = useState([]);
    const [locations, setLocations] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);
    const [selectedTourType, setSelectedTourType] = useState(null);
    const [tourByTourType, setTourByTourType] = useState([]);

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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [allTours, allTourTypes, allLocations] = await Promise.all([
                fetchAllPages(getAllTour),
                fetchAllPages(getAllTourType),
                fetchAllPages(getAllLocation)
            ]);

            setTourSale(allTours.filter(tour => tour.discount > 10 && tour.active && tour.status === "UPCOMING"));
            setTourFav(allTours.filter(tour => tour.currentParticipants > 0 && tour.active && tour.status === "UPCOMING"));
            const activeTourTypes = allTourTypes.filter(tourType => tourType.active);
            setTourTypes(activeTourTypes);
            if (activeTourTypes.length > 0) setSelectedTourType(activeTourTypes[0].id);
            setLocations(allLocations.filter(location => location.active));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
    }, [selectedTourType]);

    return (
        <div className="show_tour">
            {isLoading ? (
                <>
                    <LoadingOverlay isLoading={true} />
                    <div className="skeleton-container">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonTourCard key={index} />
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
                        <MasonryLayout locations={locations} title={"Top destinations"} indexSlice={7} />
                    )}

                    {tourTypes.length > 0 && (
                        <div className="overflow-hidden w-full">
                            <h2 className="text-2xl font-bold mt-8">Your plan by favourites?</h2>
                            <div className="mt-6">
                                <Swiper
                                    spaceBetween={20}
                                    slidesPerView="auto"
                                    slidesPerGroup={1}
                                    navigation={true}
                                    loop={true}
                                    modules={[Navigation]}
                                    className="swiper-tour-layout"
                                >
                                    {tourTypes.map((tourType) => (
                                        <SwiperSlide key={tourType.id} style={{ width: 'auto' }}>
                                            <div
                                                className={`p-4 rounded-full ${selectedTourType === tourType.id ? 'border-2 border-blue-500 bg-blue-100 ' : ''}`}
                                                onClick={() => setSelectedTourType(tourType.id)}
                                            >
                                                <h3 className={`${selectedTourType === tourType.id ? 'text-blue-500' : ''}`}>
                                                    {tourType.name}
                                                </h3>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div>
                                <GridLayout
                                    tours={tourByTourType}
                                    itemsPerPage={3}
                                    title=""
                                    isShowDescCard={false}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Show;