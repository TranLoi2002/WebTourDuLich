import React, { useEffect, useState } from 'react';
import { getCategories, getBlogsByCategoryId, getBlogs } from '../../api/blog.api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BlogSwiper from "../../components/BlogSwiper";

const BlogCard = ({ date, title, description, image, link }) => (
    <div className="flex flex-col hover:-translate-y-1 transition-transform duration-300">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />
        <div className="mt-4">
            <p className="text-sm text-gray-500">{date}</p>
            <Link to={link} className="text-lg font-semibold">{title}</Link>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>
    </div>
);

const NewsCard = ({ date, title, description, link }) => (
    <div className="mb-6">
        <p className="text-sm text-gray-500">{date}</p>
        <Link to={link} className="text-lg font-semibold">{title}</Link>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <Link to={link} className="text-gray-400 border-2 rounded-full px-4 py-1 text-sm">{link}</Link>
    </div>
);

const Show = () => {
    const [categories, setCategories] = useState([]);
    const [blogsByCategory, setBlogsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

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
            setBlogs(allBlogs);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    const fetchCategoriesAndBlogs = async () => {
        try {
            setLoading(true);
            const categoriesResponse = await getCategories(0, 10, 'id', 'asc');
            const categoriesData = categoriesResponse.content;

            const blogsData = {};
            for (const category of categoriesData) {
                const blogsResponse = await getBlogsByCategoryId(category.id, 0, 10, 'id', 'asc');
                blogsData[category.name] = blogsResponse.content;
            }

            setCategories(categoriesData);
            setBlogsByCategory(blogsData);
        } catch (error) {
            console.error("Error fetching categories and blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchCategoriesAndBlogs();
    }, []);

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMMM dd, yyyy');
    };

    // console.log("blogs , blogs")

    return (
        <div className="pt-32">

            <div className="max-w-6xl mx-auto pb-8 px-4">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <BlogSwiper blogs={blogs} />
                        </div>
                        {categories.map((category) => {
                            if (category.name === "News") return null; // Skip "News" for now

                            const blogs = blogsByCategory[category.name] || [];
                            return (
                                <div key={category.id} className="mt-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold">{category.name}</h2>
                                        <Link
                                            to={`/blogs/category/${category.id}`}
                                            className="text-blue-500 text-sm"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {blogs.slice(0, 3).map((blog) => (
                                            <BlogCard
                                                key={blog.id}
                                                date={formatDate(blog.createdAt)}
                                                title={blog.title || "Untitled"}
                                                description={blog.content || "No description available"}
                                                image={blog.thumbnail || "https://via.placeholder.com/300x200?text=Blog+Image"}
                                                link={`/blogs/detailblog/${blog.id}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* News Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">In the News</h2>
                            {blogsByCategory["News"] && blogsByCategory["News"].length > 0 ? (
                                blogsByCategory["News"].map((blog) => (
                                    <NewsCard
                                        key={blog.id}
                                        date={formatDate(blog.createdAt)}
                                        title={blog.title || "Untitled"}
                                        description={blog.content || "No description available"}
                                        link={blog.external_url || "#"}
                                    />
                                ))
                            ) : (
                                <p>No News blogs available.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Show;