import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTourType, createTourType, toggleTourTypeStatus, updateTourType } from '../../../api/tourtype.api';

const PAGE_SIZE = 5;

function TypeTable() {
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // States mới để quản lý modal chung
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); 
  const [isEditMode, setIsEditMode] = useState(false); 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch tour types
  const fetchTourTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllTourType(currentPage, PAGE_SIZE, 'id', 'asc');
      const { content, totalPages, totalItems } = response;
      setTypes(content || []);
      setFilteredTypes(content || []); 
      setTotalPages(totalPages || 1);
      setTotalElements(totalItems || 0);
    } catch (error) {
      toast.error('Failed to load tour types. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTourTypes();
  }, [fetchTourTypes]);


  useEffect(() => {
    let results = [...types]; 

    if (searchTerm) {
      results = results.filter(
        (type) =>
          type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((type) => (statusFilter === 'ACTIVE' ? type.active : !type.active));
    }

    setFilteredTypes(results);
  }, [types, searchTerm, statusFilter]); 

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle submission for both create and update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsUpdating(true);
    try {
      let response;
      if (selectedType && isEditMode) {
        // Update existing tour type
        response = await updateTourType(selectedType.id, {
          name: formData.name,
          description: formData.description,
        });
        if (response.success) {
          const updatedTypes = types.map((type) =>
            type.id === selectedType.id ? { ...type, name: formData.name, description: formData.description } : type
          );
          setTypes(updatedTypes);
          toast.success('Tour type updated successfully.');
        } else {
          toast.error(response.message || 'Failed to update tour type.');
        }
      } else if (!selectedType && isEditMode) {
        response = await createTourType(formData);
        if (response.success) {
          setTypes([response.data, ...types]);
          setCurrentPage(0);
          toast.success('Tour type created successfully.');
        } else {
          toast.error(response.message || 'Failed to create tour type.');
        }
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', active: true });
      setFormErrors({});
    } catch (error) {
      toast.error('Failed to save tour type.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleActive = async (typeId, currentActiveStatus, e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsUpdating(true);
    try {
      const response = await toggleTourTypeStatus(typeId);
      console.log(1,response);
      if (response.success) {
        const updatedTypes = types.map((type) =>
          type.id === typeId ? { ...type, active: !currentActiveStatus } : type
        );
        setTypes(updatedTypes);

        if (selectedType && selectedType.id === typeId) {
          setSelectedType({ ...selectedType, active: !currentActiveStatus });
          setFormData((prev) => ({ ...prev, active: !currentActiveStatus }));
        }
        toast.success(`Tour type ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully.`);
      } else {
        toast.error(response.message || 'Failed to update tour type status.');
      }
    } catch (error) {
      toast.error('Failed to update tour type status.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open modal in view mode
  const handleRowClick = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      active: type.active,
    });
    setFormErrors({}); 
    setIsEditMode(false); 
    setIsModalOpen(true);
  };

  // Open modal in add mode
  const handleAddNewType = () => {
    setSelectedType(null); 
    setFormData({ name: '', description: '', active: true });
    setFormErrors({});
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tour Types Management</h1>
        <p className="text-sm text-gray-600">Manage your tour categories and types</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button
            onClick={handleAddNewType}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Add New Type
          </button>
        </div>
      </div>

      {/* Tour Types Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-8 w-8 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                </td>
              </tr>
            ) : filteredTypes.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tour types found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try changing your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTypes.map((type) => (
                <tr
                  key={type.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(type)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{type.description || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        type.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {type.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredTypes.length > 0 ? currentPage * PAGE_SIZE + 1 : 0}</span> to{' '}
            <span className="font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span> of{' '}
            <span className="font-medium">{totalElements}</span> tour types
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Unified Modal for View/Edit/Create */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {isEditMode || !selectedType ? ( 
              <>
                <h2 className="text-xl font-bold mb-4">{selectedType ? 'Edit Tour Type' : 'Add New Tour Type'}</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.description ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      ></textarea>
                      {formErrors.description && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                      )}
                    </div>
            
                    {!selectedType && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="active"
                          id="active-add"
                          checked={formData.active}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active-add" className="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : (selectedType ? 'Save Changes' : 'Create')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Tour Type Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedType.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedType.description || 'N/A'}</p>
                  </div>
                  {/* Toggle switch cho Active/Inactive */}
                  <div className="flex items-center justify-between">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedType?.active || false}
                        onChange={(e) => handleToggleActive(selectedType.id, selectedType.active, e)}
                        className="sr-only peer"
                        disabled={isUpdating}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {selectedType?.active ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Click the switch to change the status of this tour type.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 w-full pt-5">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditMode(true)} 
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Tour Type
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TypeTable;