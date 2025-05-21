import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const BlogDetailsModal = ({
                              isOpen,
                              onClose,
                              selectedBlog,
                              editMode,
                              handleEditClick,
                              handleSaveChanges,
                          }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm({
        defaultValues: {
            title: '',
            content: '',
            author: '',

        },
    });

    useEffect(() => {
        if (selectedBlog) {
            reset({
                title: selectedBlog.title || '',
                content: selectedBlog.content || '',
                author: selectedBlog.author || '',

            });
        }
    }, [selectedBlog, reset]);

    const onSubmit = (data) => {
        handleSaveChanges(data);
    };

    if (!isOpen || !selectedBlog) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">
                            {editMode ? 'Edit Blog' : 'Blog Details'} - {selectedBlog.title}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    {...register('content', { required: 'Content is required' })}
                                    rows="5"
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.content ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                ></textarea>
                                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input
                                    {...register('author', { required: 'Author is required' })}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.author ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                />
                                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
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
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailsModal;