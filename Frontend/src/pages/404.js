import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-8">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;