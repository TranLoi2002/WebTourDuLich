import React, {useState, useEffect} from 'react';
import HorizontalLayout from '../../components/horizontalLayout';
import GridLayout from '../../components/gridLayout';
import MasonryLayout from '../../components/masonryLayout';
import {getAllTour} from "../../api/tour.api";
import {getAllLocation} from "../../api/location.api";
import {getAllTourType} from "../../api/tourtype.api";
import SkeletonTourCard from "../../components/SkeletonTourCard";


const Show = () => {
    // const [layout, setLayout] = useState('horizontal');
    const [loading, setLoading] = useState(true);

    const [tours, setTours] = useState([]);
    const [locations, setLocations] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);

    // get tour from tour.api.js
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await getAllTour();
                setTours(response);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
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
            } catch (error) {
                console.error("Error fetching tour types:", error);
            }
        };

        fetchTourTypes();
    }, []);

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
                    <HorizontalLayout tours={tours} title="Top BangKok tours"/>
                    <GridLayout tours={tours} itemsPerPage={6} title="Top HongKong tours"/>
                    <MasonryLayout locations={locations} title={"Top destinations"}/>

                    <div>
                        <div className="mt-6 flex flex-row gap-3">
                            {tourTypes.map((tourType) => (
                                <div key={tourType.id} className="border-2 p-4 rounded-full">
                                    <h3>{tourType.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Show;