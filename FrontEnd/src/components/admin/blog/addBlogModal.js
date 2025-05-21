import React, {useState, useEffect} from 'react';
import {createBlog, updateBlog, getCategories} from '../../../api/blog.api';
import {ToastContainer, toast} from 'react-toastify';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {verifyUser} from '../../../api/auth.api';

const AddBlogModal = ({isOpen, onClose, selectedBlog, fetchBlogs}) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        external_url: '',
        active: true,
        thumbnail: null,
    });
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchUser = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    const response = await verifyUser();
                    setUser(response);
                    localStorage.setItem('user', JSON.stringify(response));
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchData();
        fetchUser();
    }, []);

    useEffect(() => {
        if (selectedBlog) {
            setFormData({
                title: selectedBlog.title || '',
                content: selectedBlog.content || '',
                categoryId: selectedBlog.categoryId || '',
                external_url: selectedBlog.external_url || '',
                active: selectedBlog.active || true,
                thumbnail: null,
            });
        }
    }, [selectedBlog]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({...prev, thumbnail: e.target.files[0]}));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData((prev) => ({...prev, content: data}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('User not logged in.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append(
            'blog',
            JSON.stringify({
                title: formData.title,
                content: formData.content,
                categoryId: formData.categoryId,
                external_url: formData.external_url,
                active: formData.active,
            })
        );
        if (formData.thumbnail) {
            formDataToSend.append('thumbnail', formData.thumbnail);
        }

        try {
            if (selectedBlog) {
                await updateBlog(selectedBlog.id, formDataToSend, user.id);
                toast.success('Blog updated successfully.');
            } else {
                await createBlog(formDataToSend, user.id);
                toast.success('Blog created successfully.');
            }
            fetchBlogs();
            onClose();
        } catch (error) {
            toast.error('Failed to save blog.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        {selectedBlog ? 'Edit Blog' : 'Add Blog'}
                    </h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.content}
                                    onChange={handleEditorChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {categories.find((cat) => cat.id === parseInt(formData.categoryId))?.name ===
                                'News' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">External URL</label>
                                        <input
                                            type="url"
                                            name="external_url"
                                            value={formData.external_url}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                        />
                                    </div>
                                )}
                          
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    accept="image/jpeg, image/png"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBlogModal;