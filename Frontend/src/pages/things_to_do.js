import React, {useEffect, useState} from 'react';
import {getActivityType} from '../api/activitytour.api';
import {getAllTour, getTourByActivityType} from '../api/tour.api';
import ActivityTourCard from '../components/ActivityTourCard';

const Things_to_do = () => {
    const [activityTypes, setActivityTypes] = useState([]);
    const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredTours, setFilteredTours] = useState([]);
    const [allTours, setAllTours] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all tours with "activityTour": true
    const fetchAllTours = async () => {
        setLoading(true);
        try {
            const response = await getAllTour();
            const activityTours = response.filter(tour => tour.activityTour === true);
            setAllTours(activityTours);
            setFilteredTours(activityTours);
        } catch (error) {
            console.error('Error fetching all tours:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch activity types
    const fetchActivityTypes = async () => {
        try {
            const data = await getActivityType();
            setActivityTypes(data);
        } catch (error) {
            console.error('Error fetching activity types:', error);
        }
    };

    // Filter tours based on selected filters
    const filterTours = async () => {
        setLoading(true);
        try {
            let tours = [...allTours];

            // Filter by activity type using API
            if (selectedActivityTypes.length > 0) {
                const response = await Promise.all(
                    selectedActivityTypes.map(type => getTourByActivityType(type))
                );
                tours = response.flat();
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
        } catch (error) {
            console.error('Error filtering tours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTours();
        fetchActivityTypes();
    }, []);

    useEffect(() => {
        filterTours();
    }, [selectedActivityTypes, selectedPriceRanges, searchLocation]);

    const handleActivityChange = (e) => {
        const {name, checked} = e.target;
        setSelectedActivityTypes(prev =>
            checked ? [...prev, name] : prev.filter(type => type !== name)
        );
    };

    const handlePriceChange = (e) => {
        const {value, checked} = e.target;
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
                            <div>
                                <p className="text-red-500">no data</p>
                            </div>
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
                    {loading ? (
                        <p>Loading tours...</p>
                    ) : filteredTours.length > 0 ? (
                        filteredTours.map(tour => (
                            <ActivityTourCard key={tour.id} tour={tour}/>
                        ))
                    ) : (
                        <p className="text-red-500">No data</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Things_to_do;