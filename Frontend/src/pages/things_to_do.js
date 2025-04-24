import React, { useEffect, useState } from 'react';
import { getActivityType } from '../api/activitytour.api';
import { getAllTour, getTourByActivityType } from '../api/tour.api';
import ActivityTourCard from '../components/ActivityTourCard';
import { toast } from 'react-toastify';

const Things_to_do = () => {
    const [activityTypes, setActivityTypes] = useState([]);
    const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredTours, setFilteredTours] = useState([]);
    const [allTours, setAllTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage] = useState(10);

    // Fetch all tours
    const fetchAllTours = async () => {
        setLoading(true);
        try {
            let allData = [];
            let page = 0;
            let hasMorePages = true;

            while (hasMorePages) {
                const response = await getAllTour(page, toursPerPage, 'id', 'asc');
                allData = [...allData, ...response.content.filter(tour => tour.activityTour === true)];
                hasMorePages = page + 1 < response.totalPages;
                page++;
            }

            setAllTours(allData);
            setFilteredTours(allData.slice(0, toursPerPage));
        } catch (error) {
            console.error('Error fetching tours:', error);
            toast.error('Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    };

    // Fetch activity types
    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'desc') => {
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

    const fetchActivityTypes = async () => {
        try {
            const allTours = await fetchAllPages(getActivityType);
            setActivityTypes(allTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };


    // Filter tours
    const filterTours = async () => {
        setLoading(true);
        try {
            let tours = [...allTours];

            // Filter by activity type
            if (selectedActivityTypes.length > 0) {
                const response = await Promise.all(
                    selectedActivityTypes.map(type => getTourByActivityType(type))
                );
                tours = response.flat().filter(tour => tour.activityTour === true);
            }

            // Filter by location
            if (searchLocation.trim()) {
                tours = tours.filter(tour =>
                    tour.location?.name?.toLowerCase().includes(searchLocation.toLowerCase())
                );
            }

            // Filter by price range
            if (selectedPriceRanges.length > 0) {
                tours = tours.filter(tour =>
                    selectedPriceRanges.some(range => {
                        const price = tour.price;
                        if (range === '10-100') return price >= 10 && price <= 100;
                        if (range === '100-500') return price > 100 && price <= 500;
                        if (range === '500+') return price > 500;
                        return false;
                    })
                );
            }

            setFilteredTours(tours);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error filtering tours:', error);
            toast.error('Failed to filter tours');
        } finally {
            setLoading(false);
        }
    };

    // Calculate paginated tours
    const getPaginatedTours = () => {
        const startIndex = (currentPage - 1) * toursPerPage;
        const endIndex = startIndex + toursPerPage;
        return filteredTours.slice(startIndex, endIndex);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);

    useEffect(() => {
        fetchAllTours();
        fetchActivityTypes();
    }, []);

    useEffect(() => {
        filterTours();
    }, [selectedActivityTypes, selectedPriceRanges, searchLocation, allTours]);

    const handleActivityChange = (e) => {
        const { name, checked } = e.target;
        setSelectedActivityTypes(prev =>
            checked ? [...prev, name] : prev.filter(type => type !== name)
        );
    };

    const handlePriceChange = (e) => {
        const { value, checked } = e.target;
        setSelectedPriceRanges(prev =>
            checked ? [...prev, value] : prev.filter(p => p !== value)
        );
    };

    return (
        <div className="things-to-do">
            <div className="things_container">
                <div className="things_left">
                    <div className="top">
                        <h3 className="font-bold">Search location or property</h3>
                        <label className="search_locate">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Search location"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="bottom">
                        <h3>Activity type</h3>
                        {activityTypes.length > 0 ? (
                            activityTypes.map(activityType => (
                                <label key={activityType.id} className="activity_type">
                                    <input
                                        type="checkbox"
                                        name={activityType.name}
                                        checked={selectedActivityTypes.includes(activityType.name)}
                                        onChange={handleActivityChange}
                                    />
                                    <span>{activityType.name}</span>
                                </label>
                            ))
                        ) : (
                            <p className="text-red-500">No activity types available</p>
                        )}

                        <h3>Price</h3>
                        {['10-100', '100-500', '500+'].map(range => (
                            <label key={range}>
                                <input
                                    type="checkbox"
                                    value={range}
                                    checked={selectedPriceRanges.includes(range)}
                                    onChange={handlePriceChange}
                                />
                                <span>
                                    {range === '10-100' && 'From $10 to $100'}
                                    {range === '100-500' && 'From $100 to $500'}
                                    {range === '500+' && '$500 and up'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="things_right w-[60%]" id="thing_right_items">
                    <div>
                        {loading ? (
                            <p>Loading tours...</p>
                        ) : getPaginatedTours().length > 0 ? (
                            getPaginatedTours().map(tour => (
                                <ActivityTourCard key={tour.id} tour={tour} />
                            ))
                        ) : (
                            <p className="text-red-500">No tours found</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Things_to_do;