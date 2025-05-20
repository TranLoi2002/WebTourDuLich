import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getFavouriteTourByUserId, removeFavouriteTourByUserId } from '../api/user.api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PAGE_SIZE = 5;

const FavouriteTours = () => {
    const [favouritesTour, setFavouritesTour] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    let userId = null;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        userId = user?.id || null;

        console.log("u id", userId);
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        toast.error('Invalid user data. Please log in again.');
    }

    useEffect(() => {
        if (!userId) {
            toast.error('Please log in to view your favorite tours.');
            return;
        }

        const fetchFavouriteTours = async () => {
            setIsLoading(true);
            try {
                const response = await getFavouriteTourByUserId(userId);

                console.log("response", response);
                setFavouritesTour(response || []);

            } catch (error) {
                console.error('Error fetching favorite tours:', error);
                toast.error('Failed to load favorite tours.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavouriteTours();
    }, [userId]);



    const handleRemoveFavouriteTour = async (tourId) => {
        try {
            await removeFavouriteTourByUserId(userId, tourId);
            setFavouritesTour((prev) => prev.filter((tour) => tour.id !== tourId));
            toast.success('Tour removed from favorites.');
        } catch (error) {
            console.error('Error removing favorite tour:', error);
            toast.error('Failed to remove favorite tour.');
        }
    };

    const handleDeleteAll = async () => {
        try {
            await Promise.all(favouritesTour.map((tour) => removeFavouriteTourByUserId(userId, tour.id)));
            setFavouritesTour([]);
            toast.success('All favorite tours removed.');
        } catch (error) {
            console.error('Error deleting all favorite tours:', error);
            toast.error('Failed to delete all favorite tours.');
        }
    };

    const filteredTours = useMemo(() => {
        return favouritesTour.filter((tour) =>
            tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.tourCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [favouritesTour, searchTerm]);

    const totalElements = filteredTours.length;
    const totalPages = Math.ceil(totalElements / PAGE_SIZE);
    const tours = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return filteredTours.slice(start, start + PAGE_SIZE);
    }, [filteredTours, currentPage]);

    const handlePageChange = useCallback(
        (newPage) => {
            if (newPage >= 0 && newPage < totalPages) {
                setCurrentPage(newPage);
            }
        },
        [totalPages]
    );

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">My Favourite Tours</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Tour Name or Code
                </label>
                <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter tour name or code..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Tours Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tour Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Place of Departure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Detail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Remove</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                            </td>
                        </tr>
                    ) : totalElements === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                No favorite tours found.
                            </td>
                        </tr>
                    ) : (
                        tours.map((tour) => (
                            <tr key={tour.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.tourCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.placeOfDeparture}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tour.price?.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link to={`/tours/detailtour/${tour.id}`} className="text-primary underline">
                                        More
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <i
                                        className="fa-solid fa-trash-can text-red-600 cursor-pointer"
                                        onClick={() => handleRemoveFavouriteTour(tour.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalElements > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span> to{' '}
                            <span className="font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span> of{' '}
                            <span className="font-medium">{totalElements}</span> tours
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete All Button */}
            <button
                onClick={handleDeleteAll}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Delete All
            </button>
        </div>
    );
};

export default FavouriteTours;