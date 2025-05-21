import React, { useState, useEffect } from 'react';
import AddBlogModal from './addBlogModal';
import BlogDetailsModal from './BlogDetailsModal';
import {getBlogs, deleteBlog, getCategories} from '../../../api/blog.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

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

    const fetchData = async () => {
        try {
            const [allblogs] = await Promise.all([
                fetchAllPages(getBlogs)
            ]);
            setBlogs(allblogs);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddBlog = () => {
        setSelectedBlog(null);
        setIsModalOpen(true);
    };

    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlog(id);
            toast.success('Blog deleted successfully.');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete blog.');
        }
    };

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Blog Management</h1>
                <button
                    onClick={handleAddBlog}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Add Blog
                </button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Author</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {blogs.map((blog) => (
                    <tr key={blog.id}>
                        <td className="px-6 py-4">{blog.title}</td>
                        <td className="px-6 py-4">{blog.author}</td>
                        <td className="px-6 py-4">{blog.isActive ? 'Active' : 'Inactive'}</td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => handleEditBlog(blog)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isModalOpen && (
                <AddBlogModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedBlog={selectedBlog}
                    // fetchBlogs={fetchBlogs}
                    isAdding={isAdding}
                />
            )}
        </div>
    );
};

export default BlogList;