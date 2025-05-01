import {Link} from 'react-router-dom'
import {useState, useEffect} from 'react';
import {getBlogs} from "../../api/blog.api";


import adds_header from '../../assets/images/adds_header.jpg';
import image_1 from '../../assets/images/image_1.jpg';

const Show = () => {
    const [blogs, setBlogs] = useState([]);
    const [randomBlog, setRandomBlog] = useState(null);

    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'asc') => {
        let allData = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            const response = await fetchFunction(currentPage, size, sortBy, sortDir);
            allData = [...allData, ...response.content];
            currentPage = response.currentPage + 1;
            totalPages = response.totalPages;
        }

        return allData;
    };

    const fetchBlogs = async () => {
        try {
            const allBlogs = await fetchAllPages(getBlogs);
            // const filterBlog = allBlogs.filter(blog => blog.active === true);
            setBlogs(allBlogs);
            // Select a random blog
            if (allBlogs.length > 0) {
                const randomIndex = Math.floor(Math.random() * allBlogs.length);
                setRandomBlog(allBlogs[randomIndex]);
            }
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    console.log(blogs)

    useEffect(() => {
        console.log(blogs)
        fetchBlogs();
    })

    return (
        <div className="tour-page">
            <div className="flex flex-col mt-[100px] mx-[200px] justify-center">
                {randomBlog ? (
                    <>
                        <h3 className="text-[2em]">{randomBlog.title}</h3>
                        <h5 className="text-[#828080] leading-5 border-b-2 pb-[25px] text-[1.5em]">
                            {randomBlog.categoryName}
                        </h5>
                        <div className="flex justify-between my-[15px] mx-0">
                            <h4 className="text-[#58c270] bg-[#EEF9F2] text-[0.8em] py-[8px] px-[10px] rounded-lg">
                                {randomBlog.categoryName}
                            </h4>
                            <span className="text-[#9d9c9c] font-bold">{randomBlog.createdAt}</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="w-full h-[500px] rounded-2xl overflow-hidden">
                                <img src={randomBlog.thumbnail || adds_header} alt=""
                                     className="object-cover w-full h-full"/>
                            </div>
                            <p id="paragraph" className="leading-6 mt-[15px]">
                                {randomBlog.content}
                            </p>
                        </div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}

                <div className="flex gap-4">
                    <div className="flex flex-col gap-[25px] mt-[50px] w-[70%]">
                        {blogs.map((blog, index) => (
                                <div className="flex gap-[20px] border-b-2 pb-[30px]">
                                    <div className="w-[30%] h-[200px] rounded-lg overflow-hidden">
                                        <img src={blog.thumbnail} alt="" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex flex-col items-start flex-1 w-[70%]">
                                        <div className="flex items-center">
                                <span
                                    className="text-[#FA8F54] bg-[#FEE9DD] text-[0.8em] py-[8px] px-[10px] rounded-lg">{blog.categoryName}</span>
                                            <h4 className="text-[#9d9c9c] font-bold">{blog.createdAt}</h4>
                                        </div>
                                        <h2 className="leading-6">
                                            <Link to="/blogs/detail_blog" className="text-gray-400">
                                                {blog.title}
                                            </Link>
                                        </h2>
                                        <p className="mt-4 leading-4">{blog.content}</p>
                                    </div>
                                </div>
                            )
                        )}


                    </div>
                    <div className="flex flex-col gap-[25px] mt-[50px] w-[30%] ml-16">
                        <h2 className="text-xl font-bold ">Blog communicate</h2>
                        <div>
                            <div className="flex gap-[20px] border-b-2 pb-[30px]">
                                <div className="flex flex-col items-start flex-1 w-[70%]">
                                    <div className="flex items-center">
                                        <h4 className="text-[#9d9c9c] font-bold">Jun 20,2021</h4>
                                    </div>
                                    <h2 className="leading-6">
                                        <Link target="_blank"
                                              to="https://www.smartertravel.com/best-travel-planning-apps/"
                                              rel="noopener" className="text-gray-400">
                                            Top 20 Trip Planning System By Airtrav
                                        </Link>
                                    </h2>
                                    <p className="mt-4 leading-4">Being a Human Resource Manager, it is your
                                        responsibility
                                        to
                                        understand the needs of
                                        industries have different types of workforce, but they do have one thing in
                                        common -
                                        business travel.</p>
                                </div>
                            </div>
                            <div className="flex gap-[20px] border-b-2 pb-[30px]">

                                <div className="flex flex-col items-start flex-1 w-[70%]">
                                    <div className="flex items-center">
                                        <h4 className="text-[#9d9c9c] font-bold">Dec 20,2020</h4>
                                    </div>
                                    <h2>
                                        <Link className="text-gray-400" target="_blank"
                                              to="https://www.travelandleisure.com/travel-tips" rel="noopener">
                                            Booking System By Airtrav Website
                                        </Link>
                                    </h2>
                                    <p className="mt-4 leading-4">Being a Human Resource Manager, it is your
                                        responsibility
                                        to
                                        understand the needs of
                                        industries have different types of workforce, but they do have one thing in
                                        common -
                                        business travel.</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div className="flex items-center justify-center">
                <button type="button" id="seeMore"
                        className="py-[15px] px-[30px] outline-none border-none bg-primary text-white rounded-2xl w-[180px] text-xl mt-[50px]">See
                    more
                </button>
            </div>
        </div>
    )
}

export default Show;