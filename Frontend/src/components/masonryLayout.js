import React from 'react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';

const MasonryLayout = ({ locations, title }) => {
    const navigate = useNavigate();
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const handleViewAll = () => {
        navigate('/locations');
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
                {locations.slice(0, 7).map((location, index) => (
                    <div key={index} className="mb-4 relative">
                        <img src={location.imageUrl} alt={location.name} className="w-full h-auto rounded-lg"/>
                        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent rounded-lg"></div>
                        <h4 className="text-center mt-2 text-lg font-bold absolute top-3 left-3 text-white">{location.name}</h4>
                    </div>
                ))}
                {locations.length > 7 && (
                    <div className="mb-4 relative cursor-pointer" onClick={handleViewAll}>
                        <img src={locations[7].imageUrl} alt="View All" className="w-full h-auto rounded-lg"/>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-center text-lg font-bold text-white">+{locations.length - 7} more</span>
                        </div>
                    </div>
                )}
            </Masonry>
        </div>
    );
};

export default MasonryLayout;