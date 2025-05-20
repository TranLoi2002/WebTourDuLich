import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllLocation, createLocation, updateLocation, toggleLocationStatus } from '../../../api/location.api';

const PAGE_SIZE = 5;

function LocationTable() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const locationType = ['CITY', 'COUNTRY', 'DISTRICT', 'PROVINCE'];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllLocation(currentPage, PAGE_SIZE, 'id', 'asc');
        const { content, totalPages, totalItems } = response;
        console.log(content);
        setLocations(content || []);
        setFilteredLocations(content || []);
        setTotalPages(totalPages || 1);
        setTotalElements(totalItems || 0);
      } catch (error) {
        toast.error('Failed to load locations. Please try again.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // Filter locations
  useEffect(() => {
    let results = locations;

    if (searchTerm) {
      results = results.filter(
        (location) =>
          location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((location) => (statusFilter === 'ACTIVE' ? location.active : !location.active));
    }

    setFilteredLocations(results);
  }, [locations, searchTerm, statusFilter]);

  // Handle row click to open modal in view mode
  const handleRowClick = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name || '',
      description: location.description || '',
      type: location.type || '',
      active: location.active || false,
    });
    setImageFile(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handle add new location
  const handleAddNewLocation = () => {
    setSelectedLocation(null);
    setFormData({
      name: '',
      description: '',
      type: '',
      active: true,
    });
    setImageFile(null);
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Image must be JPEG or PNG');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must not exceed 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  // Handle form submission for create/update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Location name is required');
      return;
    }
    if (!formData.type) {
      toast.error('Location type is required');
      return;
    }

    setIsUpdating(true);
    try {
      if (selectedLocation && isEditMode) {
        // Update existing location
        const response = await updateLocation(selectedLocation.id, formData, imageFile);
        if (response.success) {
          setLocations(locations.map((loc) => (loc.id === selectedLocation.id ? response.data : loc)));
          setFilteredLocations(filteredLocations.map((loc) => (loc.id === selectedLocation.id ? response.data : loc)));
          toast.success('Location updated successfully.');
          setIsModalOpen(false);
        } else {
          toast.error(response.message || 'Failed to update location.');
        }
      } else if (!selectedLocation && isEditMode) {
        // Create new location
        if (!imageFile) {
          toast.error('Image file is required');
          return;
        }
        const response = await createLocation(formData, imageFile);
        if (response.success) {
          setLocations([...locations, response.data]);
          setFilteredLocations([...filteredLocations, response.data]);
          setCurrentPage(0);
          toast.success('Location created successfully.');
          setIsModalOpen(false);
        } else {
          toast.error(response.message || 'Failed to create location.');
        }
      }
    } catch (error) {
      toast.error('Failed to save location.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleActive = async (id, currentActiveStatus, e) => {
    e.stopPropagation();
    setIsUpdating(true);

    try {
      const response = await toggleLocationStatus(id);
      if (response.success) {
        // Cập nhật state locations và filteredLocations
        const updatedLocations = locations.map(loc =>
          loc.id === id ? { ...loc, active: !currentActiveStatus } : loc
        );

        setLocations(updatedLocations);
        setFilteredLocations(updatedLocations);

        // Cập nhật selectedLocation nếu đang mở modal
        if (selectedLocation && selectedLocation.id === id) {
          setSelectedLocation({ ...selectedLocation, active: !currentActiveStatus });
        }

        toast.success(`Location ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully.`);
      } else {
        toast.error(response.message || 'Failed to update location status.');
      }
    } catch (error) {
      toast.error('Failed to update location status.');
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
        <h1 className="text-2xl font-bold text-gray-800">Tour Location Management</h1>
        <p className="text-sm text-gray-600">Manage tour location system</p>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {/* Search and filter bar */}
      <div className="flex items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name, description, or ID..."
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
          onClick={handleAddNewLocation}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Add New Location
        </button>
      </div>

      {/* Locations table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="border px-4 py-4 text-center">
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
            ) : filteredLocations.length === 0 ? (
              <tr>
                <td colSpan="5" className="border px-4 py-8 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tour location found.</h3>
                  <p className="mt-2 text-sm text-gray-500">Try changing your search or filter criteria.</p>
                </td>
              </tr>
            ) : (
              filteredLocations.map((location) => (
                <tr
                  key={location.id}
                  className="border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(location)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{location.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.description || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.type || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <span
                     style={{width:80,display:'flex',alignItems:'center',justifyContent:'center'}}
                      className={`px-2 py-1 inline-flex  text-xs leading-5  font-semibold rounded-full ${
                        location.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {location.active ? 'Active' : 'Inactive'}
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
            <span className="font-medium">{totalElements}</span> locations
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
            {isEditMode || !selectedLocation ? (
              <>
                <h2 className="text-xl font-bold mb-4">{selectedLocation ? 'Edit Location' : 'Add New Location'}</h2>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a type</option>
                      {locationType.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      className="mt-1 w-full"
                      required={!selectedLocation}
                    />
                    {selectedLocation && selectedLocation.imageUrl && (
                      <img
                        src={selectedLocation.imageUrl}
                        alt="Current location"
                        className="mt-2 w-full h-40 object-cover rounded-md"
                      />
                    )}
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
                      {isUpdating ? 'Saving...' : selectedLocation ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Location Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.description || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.type || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Active</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.active ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    {selectedLocation.imageUrl ? (
                      <img
                        src={selectedLocation.imageUrl}
                        alt={selectedLocation.name}
                        className="mt-1 w-full h-40 object-cover rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">No image available</p>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocation?.active || false}
                      onChange={(e) => handleToggleActive(selectedLocation.id, selectedLocation.active, e)}
                      className="sr-only peer"
                      disabled={isUpdating}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {selectedLocation?.active ? 'Active' : 'Inactive'}
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
                    Edit Location
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

export default LocationTable;