import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getActivityType, createActivityTypee, updateActivityType, toggleActivityType } from '../../../api/activitytour.api';

const PAGE_SIZE = 5;

function ActivityTypeTable() {
  const [activityTypes, setActivityTypes] = useState([]);
  const [filteredActivityTypes, setFilteredActivityTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    active: true,
  });

  // Fetch initial data
  const fetchActivityTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getActivityType(currentPage, PAGE_SIZE, 'id', 'asc');
      const { content, totalPages, totalItems } = response;
      setActivityTypes(content || []);
      setFilteredActivityTypes(content || []);
      setTotalPages(totalPages || 1);
      setTotalElements(totalItems || 0);
    } catch (error) {
      toast.error('Failed to load activity types. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchActivityTypes();
  }, [fetchActivityTypes]);

  // Filter activity types
  useEffect(() => {
    let results = activityTypes;

    if (searchTerm) {
      results = results.filter(
        (type) =>
          type.name?.toLowerCase().includes(searchTerm.toLowerCase())
  
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((type) => (statusFilter === 'ACTIVE' ? type.active : !type.active));
    }

    setFilteredActivityTypes(results);
  }, [activityTypes, searchTerm, statusFilter]);


  const handleRowClick = (type) => {
    setSelectedActivityType(type);
    setFormData({
      name: type.name || '',

      active: type.active || false,
    });
    setIsEditMode(false); 
    setIsModalOpen(true);
  };

  const handleAddNewActivityType = () => {
    setSelectedActivityType(null);
    setFormData({
      name: '',
      active: true,
    });

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Activity type name is required');
      return;
    }

    setIsUpdating(true);
    try {
      if (selectedActivityType && isEditMode) {
 
        const response = await updateActivityType(selectedActivityType.id, {
          name: formData.name,
        });
        if (response.success) {
          const updatedTypes = activityTypes.map((type) =>
            type.id === selectedActivityType.id ? { ...type, ...formData } : type
          );
          setActivityTypes(updatedTypes);
          setFilteredActivityTypes(updatedTypes);
          toast.success('Activity type updated successfully.');
          setIsModalOpen(false);
        } else {
          toast.error(response.message || 'Failed to update activity type.');
        }
      } else if (!selectedActivityType && isEditMode) {
        // Create new activity type
        const response = await createActivityTypee(formData);
        if (response.success) {
          setActivityTypes([response.data, ...activityTypes]);
          setFilteredActivityTypes([response.data, ...filteredActivityTypes]);
          setCurrentPage(0);
          toast.success('Activity type created successfully.');
          setIsModalOpen(false);
        } else {
          toast.error(response.message || 'Failed to create activity type.');
        }
      }
    } catch (error) {
      toast.error('Failed to save activity type.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleActive = async (id, currentActiveStatus, e) => {
    e.stopPropagation(); 

    setIsUpdating(true);
    try {
      const response = await toggleActivityType(id);
      if (response.success) {
        const updatedActivityTypes = activityTypes.map(type =>
          type.id === id ? { ...type, active: !currentActiveStatus } : type
        );

        setActivityTypes(updatedActivityTypes);
        setFilteredActivityTypes(updatedActivityTypes);

        // Cập nhật selectedActivityType nếu đang mở modal
        if (selectedActivityType && selectedActivityType.id === id) {
          setSelectedActivityType({ ...selectedActivityType, active: !currentActiveStatus });
          setFormData(prev => ({ ...prev, active: !currentActiveStatus })); 
        }

        toast.success(`Activity type ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully.`);
      } else {
        toast.error(response.message || 'Failed to update activity type status.');
      }
    } catch (error) {
      toast.error('Failed to update activity type status.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Activity Types Management</h1>
        <p className="text-sm text-gray-600">Manage your activity categories and types</p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {/* Search and filter bar */}
      <div className="flex items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          onClick={handleAddNewActivityType}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Add New Activity Type
        </button>
      </div>

      {/* Activity Types table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-4 text-center">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500 mx-auto"
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
                </td>
              </tr>
            ) : filteredActivityTypes.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-8 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No activity type found.</h3>
                  <p className="mt-2 text-sm text-gray-500">Try changing your search or filter criteria.</p>
                </td>
              </tr>
            ) : (
              filteredActivityTypes.map((type) => (
                <tr
                  key={type.id}
                  className="border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(type)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{type.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            Showing <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span> to{' '}
            <span className="font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span> of{' '}
            <span className="font-medium">{totalElements}</span> activity types
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
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for view/edit/create */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {isEditMode || !selectedActivityType ? (
              <>
                <h2 className="text-xl font-bold mb-4">{selectedActivityType ? 'Edit Activity Type' : 'Add New Activity Type'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
             
               
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : selectedActivityType ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Activity Type Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedActivityType.name}</p>
                  </div>
                
             
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedActivityType?.active || false}
                      onChange={(e) => handleToggleActive(selectedActivityType.id, selectedActivityType.active, e)}
                      className="sr-only peer"
                      disabled={isUpdating}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {selectedActivityType?.active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
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
                    Edit Activity Type
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

export default ActivityTypeTable;