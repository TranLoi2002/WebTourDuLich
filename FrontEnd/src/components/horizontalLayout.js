import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CardTour from '../components/card_tour';

const HorizontalLayout = ({ tours, title, isShowDescCard }) => {
    return (
        <div className="horizontal-tour-layout">
            <div>
                <h3 className="font-bold text-2xl ">{title}</h3>
            </div>
            <Swiper
                key={tours.length}
                spaceBetween={30}
                slidesPerView="auto" // Show as many slides as possible
                slidesPerGroup={1} // Slide one tour at a time
                navigation={true}
                modules={[Navigation]}
                className="swiper-tour-layout"
                style={{width: '100%'}}
            >
                    {tours.map((tour, index) => (
                        <SwiperSlide key={index} style={{display: 'flex', justifyContent: 'center', width:'auto'}}>
                            <CardTour tour={tour} isShowDesc={isShowDescCard} containerStyle="w-[300px]"/>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default HorizontalLayout;