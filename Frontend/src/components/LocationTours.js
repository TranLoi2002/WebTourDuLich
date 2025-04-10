import React from 'react';
import { useLocation } from 'react-router-dom';
// import HorizontalLayout from '../components/horizontalLayout';
import TourList from "./TourList";

const LocationTours = () => {
    const { state } = useLocation();
    const tours = state?.tours || [];

    console.log("LocationTours state:", state);
    console.log("tours", tours);

    return (
        <div className="location-tours">
            {tours.length > 0 ? (
                <TourList tours={tours} title="" filtersEnabled={true} />
            ) : (
                <p>No tours available for this location.</p>
            )}
        </div>
    );
};

export default LocationTours;