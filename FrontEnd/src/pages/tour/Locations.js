// `Frontend/src/pages/location/ViewAllLocations.js`
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLocation } from '../../api/location.api';
import { getTourByLocationId } from '../../api/tour.api';
import MasonryLayout from "../../components/masonryLayout";

const ViewAllLocations = () => {
    const [locations, setLocations] = useState([]);
    const [tourCounts, setTourCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
    }

    const fetchLocations = async () => {
        try {
            const allLocations = await fetchAllPages(getAllLocation);
            setLocations(allLocations);
            const counts = {};
            await Promise.all(
                allLocations.map(async (location) => {
                    const tours = await getTourByLocationId(location.id);
                    counts[location.id] = tours.length;
                })
            );
            setTourCounts(counts);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">All Locations</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {locations.length > 0 && (
                        <MasonryLayout locations={locations} title="" indexSlice={locations.length}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewAllLocations;