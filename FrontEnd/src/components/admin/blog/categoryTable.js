import React, {useState, useEffect, useCallback} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getCategories, createCategory, updateCategory, toggleCategoryStatus} from '../../../api/blog.api';

const PAGE_SIZE = 5;

function CategoryTable() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({name: '', description: ''});


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
            const [allCates] = await Promise.all([
                fetchAllPages(getCategories)
            ]);
            setCategories(allCates);
            setFilteredCategories(allCates);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const results = categories.filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(results);
    }, [categories, searchTerm]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateCategory(selectedCategory.id, formData);
                toast.success('Category updated successfully.');
            } else {
                await createCategory(formData);
                toast.success('Category created successfully.');
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to save category.');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleCategoryStatus(id);
            toast.success('Category status updated.');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status.');
        }
    };

    const handleAddCategory = () => {
        setFormData({name: '', description: ''});
        setSelectedCategory(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setFormData({name: category.name, description: category.description});
        setSelectedCategory(category);
        setIsEditMode(true);
        setIsModalOpen(true);
    };
console.log(categories);
    return (
        <div className="p-4">
            <ToastContainer/>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Category Management</h1>
                <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Add Category
                </button>
            </div>
            <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredCategories.map((category) => (
                    <tr key={category.id}>
                        <td className="px-6 py-4">{category.id}</td>
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4">{category.description}</td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => handleEditCategory(category)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleToggleStatus(category.id)}
                                className={`px-4 py-2 rounded-md ${
                                    !category.active ? 'bg-red-500' : 'bg-green-500'
                                } text-white`}
                            >
                                {!category.active ? 'InActivate':'Activate' }
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditMode ? 'Edit Category' : 'Add Category'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryTable;