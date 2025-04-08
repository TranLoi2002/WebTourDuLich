import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CardTour from '../components/card_tour';

const HorizontalLayout = ({ tours, title }) => {
    return (
        <div className="horizontal-tour-layout">
            <div>
                <h3 className="font-bold text-2xl ">{title}</h3>
            </div>
            <Swiper
                spaceBetween={30}
                slidesPerView={5} // Display 5 tours at a time
                slidesPerGroup={1} // Slide one tour at a time
                navigation={true}
                modules={[Navigation]}
                className="swiper-tour-layout"
                style={{width: '100%'}}
            >
                    {tours.map((tour, index) => (
                        <SwiperSlide key={index} style={{display: 'flex', justifyContent: 'center'}}>
                            <CardTour tour={tour}/>
                        </SwiperSlide>
                    ))}


            </Swiper>
        </div>
    );
};

export default HorizontalLayout;