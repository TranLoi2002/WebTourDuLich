import React, { useState, useEffect, useCallback } from 'react';
import BlogFilters from './blogFilters';
import BlogDetailsModal from './blogDetailModal';
import AddBlogModal from './addBlogModal';
import { getBlogs, deleteBlog } from '../../../api/blog.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogTable = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
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
            console.log(response.content);
        }

        return allData;
    };

    const fetchData = async () => {
        try {
            const allBlogs = await fetchAllPages(getBlogs);
            setBlogs(allBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddBlog = () => {
        setSelectedBlog(null);
        setIsAdding(true);
        setIsModalOpen(true);
    };

    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setIsAdding(false);
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

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? blog.active : !blog.active);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4">
            <ToastContainer />
            {/*<div className="flex justify-between items-center mb-4">*/}
            {/*    <h1 className="text-2xl font-bold">Blog Management</h1>*/}
            {/*    <button*/}
            {/*        onClick={handleAddBlog}*/}
            {/*        className="px-4 py-2 bg-indigo-600 text-white rounded-md"*/}
            {/*    >*/}
            {/*        Add Blog*/}
            {/*    </button>*/}
            {/*</div>*/}
            <BlogFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setIsAddModalOpen={handleAddBlog}
            />
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredBlogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{blog.title}</td>
                            <td className="px-6 py-4">{blog.authorName}</td>
                            <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            blog.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {blog.active ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleEditBlog(blog)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                >
                                    Change state
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <AddBlogModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedBlog={selectedBlog}
                    fetchBlogs={fetchData}
                />
            )}
        </div>
    );
};

export default BlogTable;