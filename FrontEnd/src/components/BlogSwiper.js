import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Parallax, Pagination, Navigation } from 'swiper/modules';
import { format } from 'date-fns';
import {Link} from "react-router-dom";

const BlogSwiper = ({ blogs }) => {
    const [randomBlogs, setRandomBlogs] = useState([]);

    useEffect(() => {
        if (blogs.length > 0) {
            // Select 3 random blogs
            const shuffled = [...blogs].sort(() => 0.5 - Math.random());
            setRandomBlogs(shuffled.slice(0, 3));
        }
    }, [blogs]);

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMMM dd, yyyy');
    };

    return (
        <Swiper
            style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
            }}
            speed={600}
            parallax={true}
            loop={true}
            autoplay={true}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Parallax, Pagination, Navigation]}
            className="mySwiper h-[540px] w-full rounded-lg overflow-hidden shadow-lg"
        >
            {randomBlogs.map((blog, index) => (
                <SwiperSlide
                    key={index}
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url(${blog.thumbnail || 'https://via.placeholder.com/1200x400?text=Blog+Image'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="ml-20 mt-80 ">
                        <Link to={`/blogs/detailblog/${blog.id}`} className="text-white font-bold text-4xl" data-swiper-parallax="-300">
                            {blog.title || 'Untitled'}
                        </Link>
                        <div className="subtitle text-gray-400" data-swiper-parallax="-200">
                            {formatDate(blog.createdAt) || 'N/A'}
                        </div>
                        <div className="text text-white" data-swiper-parallax="-100">
                            <p>{blog.content?.slice(0, 150) || 'No content available'}...</p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BlogSwiper;