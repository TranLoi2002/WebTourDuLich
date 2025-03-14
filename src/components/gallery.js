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
        <div className="gallery">
            <div>
                <h3>Popular Destination</h3>
            </div>

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {images.map((image, index) => (
                    <div key={index} className="masonry-item">
                        <Link to={`/tours/${image.location}`}>
                            <img src={image.src} alt={image.alt} className="masonry-img" />
                            <div className="masonry-content">
                                <h3>{image.location}</h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </Masonry>
        </div>

    );
};

export default Gallery;