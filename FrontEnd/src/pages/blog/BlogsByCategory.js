// `Frontend/src/pages/blog/BlogsByCategory.js`
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogsByCategoryId } from '../../api/blog.api';
import { format } from 'date-fns';

const BlogsByCategory = () => {
    const { categoryId } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMMM dd, yyyy');
    };

    const fetchAllPages = async (fetchFunction, categoryId, size = 10, sortBy = 'id', sortDir = 'asc') => {
        let allData = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            const response = await fetchFunction(categoryId, currentPage, size, sortBy, sortDir);
            allData = [...allData, ...response.content];
            currentPage = response.currentPage + 1;
            totalPages = response.totalPages;
        }

        return allData;
    };

    const fetchBlogsByCategory = async () => {
        try {
            const allBlogs = await fetchAllPages(getBlogsByCategoryId, categoryId);
            setBlogs(allBlogs);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogsByCategory();
    }, [categoryId]);

    return (
        <div className="max-w-5xl mx-auto px-7 pt-[6rem] pb-7">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/*<h1 className="text-3xl font-bold mb-6">Blogs in Category</h1>*/}
                    <ul className="space-y-6">
                        {blogs.map((blog) => (
                            <li key={blog.id} className="flex gap-4 border-b pb-4">
                                <img
                                    src={blog.thumbnail || 'https://via.placeholder.com/150'}
                                    alt={blog.title}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        <Link to={`/blogs/detailblog/${blog.id}`} className="text-blue-500 hover:underline">
                                            {blog.title || 'Untitled'}
                                        </Link>
                                    </h2>
                                    <p className="text-sm text-gray-500">{formatDate(blog.createdAt)}</p>
                                    <p className="text-gray-700 line-clamp-3">{blog.content || 'No description available'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default BlogsByCategory;