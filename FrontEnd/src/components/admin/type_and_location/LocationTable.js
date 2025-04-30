import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllLocation } from '../../../api/location.api';

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

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllLocation(currentPage, PAGE_SIZE, 'id', 'asc');
        const { content, totalPages, totalItems } = response;
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

  // Lọc locations
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

  // Xử lý khi click vào hàng để mở modal
  const handleRowClick = (location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    setIsUpdating(true);
    try {
      setLocations(locations.filter((item) => item.id !== id));
      setFilteredLocations(filteredLocations.filter((item) => item.id !== id));
      toast.success('Location deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete location.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Xử lý phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {/* Thanh tìm kiếm và bộ lọc */}
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
          onClick={() => toast.info('Add New Location feature not implemented yet.')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Add New Location
        </button>
      </div>

      {/* Bảng Locations */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="border px-4 py-4 text-center">
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
                <td colSpan="6" className="border px-4 py-8 text-center">
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
              filteredLocations.map((location, index) => (
                <tr
                  key={location.id}
                  className="border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(location)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{location.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.description || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.type || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p className='ml-2 px-2 inline-flex text-xs leading-5 font-semibold bg-blue-100 text-blue-800'>{location.active ? 'Yes' : 'No'}</p>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(location.id);
                      }}
                      className=" text-red-500 px-2 py-1 rounded"
                      disabled={isUpdating}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
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

      {/* Modal chi tiết Location */}
      {isModalOpen && selectedLocation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
            </div>
            <div className="flex justify-end space-x-3 w-full pt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Edit location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationTable;