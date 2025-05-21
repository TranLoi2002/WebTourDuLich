import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';
import { getTourByLocationId } from "../api/tour.api";

const MasonryLayout = ({ locations, title, indexSlice }) => {
    const navigate = useNavigate();
    const [tourCounts, setTourCounts] = useState({}); // Object to store tour counts by locationId

    useEffect(() => {
        const fetchTourCounts = async () => {
            try {
                const counts = {};
                await Promise.all(
                    locations.map(async (location) => {
                        const tours = await getTourByLocationId(location.id);
                        counts[location.id] = tours.length; // Store the count for each location
                    })
                );
                setTourCounts(counts); // Update state with all counts
            } catch (error) {
                console.error("Error fetching tour counts:", error);
            }
        };

        fetchTourCounts();
    }, [locations]);

    const handleLocationClick = async (locationId) => {
        try {
            const locationTours = await getTourByLocationId(locationId);
            const tours = locationTours.filter(f => f.active === true);

            navigate('/tours/location-tours', { state: { tours } });
        } catch (error) {
            console.error("Error fetching tours for location:", error);
        }
    };

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const handleViewAll = () => {
        navigate('/tours/locations/viewall');
    };

    return (
        <div className="w-full h-full border-b-2 py-[2rem]">
            <div>
                <h3 className="font-bold text-2xl mb-4">{title}</h3>
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
            >
                {locations.slice(0, indexSlice).map((location, index) => (
                    <div
                        key={index}
                        className="mb-4 relative cursor-pointer"
                        onClick={() => handleLocationClick(location.id)}
                    >
                        <img src={location.imageUrl} alt={location.name} className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent rounded-lg"></div>
                        <h4 className="text-center mt-2 text-lg font-bold absolute top-3 left-3 text-white">
                            {location.name}
                        </h4>
                        <p className="absolute top-8 left-3 text-white mt-4 text-center">
                            {tourCounts[location.id] || 0} tours available
                        </p>
                    </div>
                ))}

                {locations.length > indexSlice && (
                    <div className="mb-4 relative cursor-pointer" onClick={handleViewAll}>
                        <img src={locations[7].imageUrl} alt="View All" className="w-full h-auto rounded-lg" />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span
                                className="text-center text-lg font-bold text-white">+{locations.length - indexSlice} more</span>
                        </div>
                    </div>
                )}
            </Masonry>
        </div>
    );
};

export default MasonryLayout;