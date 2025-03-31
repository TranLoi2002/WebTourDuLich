import React from 'react';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';
import '../assets/styles/gallery.css'

const Gallery = ({ images }) => {
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="py-[3rem] px-[8rem]">
            <div>
                <h3 className="text-4xl font-bold mb-[2rem]">Popular Destination</h3>
            </div>

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex ml-[-30px] w-auto"
                columnClassName="pl-[30px] bg-clip-padding"
            >
                {images.map((image, index) => (
                    <div key={index} className="mb-[30px] relative">
                        <Link to={`/tours/${image.location}`}>
                            <img src={image.src} alt={image.alt} className="w-full block rounded-xl" />
                            <div className="masonry-content">
                                <h3 className="text-[1rem] m-0 text-white">{image.location}</h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </Masonry>
        </div>

    );
};

export default Gallery;