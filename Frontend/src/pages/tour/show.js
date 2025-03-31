import React, {useState} from 'react';
import HorizontalLayout from '../../components/horizontalLayout';
import GridLayout from '../../components/gridLayout';


const Show = () => {
    const [layout, setLayout] = useState('horizontal');
    const tours = [
        {
            id: 1,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 2,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 3,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 4,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 5,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 6,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
        {
            id: 7,
            name: "Thailands Ayutthaya Temples Cruise from BangKok",
            price: 66,
            duration: "9 hours",
            review: 4.8,
            reviewCount: 12,
            image: "image_tour_1.avif",
        },
    ];

    return (
        <div className="show_tour">
            <HorizontalLayout tours={tours} title="Top BangKok tours"/>

            <GridLayout tours={tours} itemsPerPage={6} title="Top HongKong tours"/>
        </div>
    );
}

export default Show;