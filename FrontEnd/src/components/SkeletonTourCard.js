import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonTourCard = () => {
    return (
        <div className="skeleton-tour-card">
            <Skeleton height={200} />
            <Skeleton count={3} />
        </div>
    );
};

export default SkeletonTourCard;