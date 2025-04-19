import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllTour, getDetailTour } from '../../api/tour.api';
import { getAllTourType } from '../../api/tourtype.api';
import { getAllLocation } from '../../api/location.api';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

function TourTable() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  // State cho form thêm/chỉnh sửa tour
  const [tourForm, setTourForm] = useState({
    tourCode: '',
    title: '',
    description: '',
    highlights: '',
    activityTour: false,
    price: '',
    discount: 0,
    placeOfDeparture: '',
    duration: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    currentParticipants: 0,
    thumbnail: '',
    images: [],
    location: null,
    tourType: null,
    status: 'ACTIVE',
  });

  // Load dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách tours
        const toursData = await getAllTour();
        setTours(toursData);
        setFilteredTours(toursData);
        console.log(toursData);
        // Lấy danh sách tour types
        const tourTypesData = await getAllTourType();
        setTourTypes(tourTypesData);

        // Lấy danh sách locations
        const locationsData = await getAllLocation();
        setLocations(locationsData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = tours;

    if (searchTerm) {
      results = results.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.placeOfDeparture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.tourCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((tour) => (tour.active ? 'ACTIVE' : 'INACTIVE') === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      results = results.filter((tour) => tour.tourType?.name === categoryFilter);
    }

    setFilteredTours(results);
  }, [searchTerm, statusFilter, categoryFilter, tours]);

  // Xử lý khi click vào tour
  const handleTourClick = async (tour) => {
    try {
      const detailedTour = await getDetailTour(tour.id);
      setSelectedTour(detailedTour);
      setIsModalOpen(true);
      setEditMode(false);
    } catch (err) {
      setError('Failed to load tour details.');
      console.error(err);
    }
  };

  // Xử lý cập nhật trạng thái tour
  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedTour = { ...selectedTour, active: newStatus === 'ACTIVE' };
      await axios.put(`${apiBaseUrl}/catalog/tours/${selectedTour.id}`, updatedTour);
      const updatedTours = tours.map((tour) =>
        tour.id === selectedTour.id ? { ...tour, active: newStatus === 'ACTIVE' } : tour
      );
      setTours(updatedTours);
      setFilteredTours(updatedTours);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to update tour status.');
      console.error(err);
    }
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTourForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Xử lý thay đổi images (danh sách URL cách nhau bởi dấu phẩy)
  const handleImagesChange = (e) => {
    const images = e.target.value.split(',').map((url) => url.trim()).filter((url) => url);
    setTourForm((prev) => ({ ...prev, images }));
  };

  // Bật chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditMode(true);
    setTourForm({
      tourCode: selectedTour.tourCode || '',
      title: selectedTour.title || '',
      description: selectedTour.description || '',
      highlights: selectedTour.highlights || '',
      activityTour: selectedTour.activityTour || false,
      price: selectedTour.price || '',
      discount: selectedTour.discount || 0,
      placeOfDeparture: selectedTour.placeOfDeparture || '',
      duration: selectedTour.duration || '',
      startDate: selectedTour.startDate ? new Date(selectedTour.startDate).toISOString().split('T')[0] : '',
      endDate: selectedTour.endDate ? new Date(selectedTour.endDate).toISOString().split('T')[0] : '',
      maxParticipants: selectedTour.maxParticipants || '',
      currentParticipants: selectedTour.currentParticipants || 0,
      thumbnail: selectedTour.thumbnail || '',
      images: selectedTour.images || [],
      location: selectedTour.location || null,
      tourType: selectedTour.tourType || null,
      status: selectedTour.active ? 'ACTIVE' : 'INACTIVE',
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = async () => {
    try {
      const updatedTour = {
        ...tourForm,
        price: Number(tourForm.price),
        discount: Number(tourForm.discount),
        maxParticipants: Number(tourForm.maxParticipants),
        currentParticipants: Number(tourForm.currentParticipants),
        startDate: new Date(tourForm.startDate),
        endDate: new Date(tourForm.endDate),
        active: tourForm.status === 'ACTIVE',
        location: tourForm.location ? { id: Number(tourForm.location) } : selectedTour.location,
        tourType: tourForm.tourType ? { id: Number(tourForm.tourType) } : selectedTour.tourType,
      };

      await axios.put(`${apiBaseUrl}/catalog/tours/${selectedTour.id}`, updatedTour);
      const updatedTours = tours.map((tour) =>
        tour.id === selectedTour.id ? { ...tour, ...updatedTour } : tour
      );
      setTours(updatedTours);
      setFilteredTours(updatedTours);
      setSelectedTour({ ...selectedTour, ...updatedTour });
      setEditMode(false);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save changes.');
      console.error(err);
    }
  };

  // Thêm tour mới
  const handleAddTour = async () => {
    try {
      const newTour = {
        ...tourForm,
        price: Number(tourForm.price),
        discount: Number(tourForm.discount),
        maxParticipants: Number(tourForm.maxParticipants),
        currentParticipants: Number(tourForm.currentParticipants) || 0,
        startDate: new Date(tourForm.startDate),
        endDate: new Date(tourForm.endDate),
        active: tourForm.status === 'ACTIVE',
        location: tourForm.location ? { id: Number(tourForm.location) } : null,
        tourType: tourForm.tourType ? { id: Number(tourForm.tourType) } : null,
      };

      const response = await axios.post(`${apiBaseUrl}/catalog/tours`, newTour);
      const updatedTours = [...tours, response.data];
      setTours(updatedTours);
      setFilteredTours(updatedTours);
      setIsAddModalOpen(false);
      setTourForm({
        tourCode: '',
        title: '',
        description: '',
        highlights: '',
        activityTour: false,
        price: '',
        discount: 0,
        placeOfDeparture: '',
        duration: '',
        startDate: '',
        endDate: '',
        maxParticipants: '',
        currentParticipants: 0,
        thumbnail: '',
        images: [],
        location: null,
        tourType: null,
        status: 'ACTIVE',
      });
    } catch (err) {
      setError('Failed to add new tour.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-900">
            Close
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm, bộ lọc và nút thêm mới */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Search by name, location, or code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">ALL STATUS</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">ALL CATEGORIES</option>
            {tourTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Tour
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tour Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tour Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price ($)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Participants
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTours.map((tour) => (
              <tr
                key={tour.id}
                onClick={() => handleTourClick(tour)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.tourCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                  <div className="text-sm text-gray-500">{tour.tourType?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.placeOfDeparture}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tour.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {tour.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.currentParticipants}/{tour.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.startDate ? new Date(tour.startDate).toLocaleDateString() : 'N/A'} -{' '}
                  {tour.endDate ? new Date(tour.endDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả */}
      {filteredTours.length === 0 && (
        <div className="text-center py-8">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tours found</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing your search or filter criteria</p>
        </div>
      )}

      {/* Modal hiển thị chi tiết/chỉnh sửa tour */}
      {isModalOpen && selectedTour && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {editMode ? 'Edit Tour' : 'Tour Details'} - {selectedTour.title}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {editMode ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Basic Information</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tour Code*</label>
                          <input
                            type="text"
                            name="tourCode"
                            value={tourForm.tourCode}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title*</label>
                          <input
                            type="text"
                            name="title"
                            value={tourForm.title}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Place of Departure*</label>
                          <input
                            type="text"
                            name="placeOfDeparture"
                            value={tourForm.placeOfDeparture}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duration*</label>
                          <input
                            type="text"
                            name="duration"
                            value={tourForm.duration}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                          <select
                            name="tourType"
                            value={tourForm.tourType?.id || ''}
                            onChange={(e) =>
                              setTourForm((prev) => ({
                                ...prev,
                                tourType: { id: e.target.value },
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="">Select Tour Type</option>
                            {tourTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location*</label>
                          <select
                            name="location"
                            value={tourForm.location?.id || ''}
                            onChange={(e) =>
                              setTourForm((prev) => ({
                                ...prev,
                                location: { id: e.target.value },
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price ($)*</label>
                          <input
                            type="number"
                            name="price"
                            value={tourForm.price}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                          <input
                            type="number"
                            name="discount"
                            value={tourForm.discount}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max Participants*</label>
                          <input
                            type="number"
                            name="maxParticipants"
                            value={tourForm.maxParticipants}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Participants</label>
                          <input
                            type="number"
                            name="currentParticipants"
                            value={tourForm.currentParticipants}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            disabled={tourForm.currentParticipants > 0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                          <input
                            type="date"
                            name="startDate"
                            value={tourForm.startDate}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date*</label>
                          <input
                            type="date"
                            name="endDate"
                            value={tourForm.endDate}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status*</label>
                          <select
                            name="status"
                            value={tourForm.status}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Media</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Thumbnail URL*</label>
                          <input
                            type="url"
                            name="thumbnail"
                            value={tourForm.thumbnail}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
                          <input
                            type="text"
                            name="images"
                            value={tourForm.images.join(',')}
                            onChange={handleImagesChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="https://example.com/image1.jpg,https://example.com/image2.jpg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Description*</h4>
                      <textarea
                        name="description"
                        value={tourForm.description}
                        onChange={handleFormChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Highlights</h4>
                      <textarea
                        name="highlights"
                        value={tourForm.highlights}
                        onChange={handleFormChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="activityTour"
                          checked={tourForm.activityTour}
                          onChange={handleFormChange}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Is Activity Tour</span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Basic Information</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">ID:</span> {selectedTour.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Tour Code:</span> {selectedTour.tourCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Title:</span> {selectedTour.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Place of Departure:</span> {selectedTour.placeOfDeparture}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Duration:</span> {selectedTour.duration}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Tour Type:</span> {selectedTour.tourType?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Location:</span> {selectedTour.location?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Rating:</span>{' '}
                        {selectedTour.averageRating ? `${selectedTour.averageRating}/5 ⭐` : 'N/A'} (
                        {selectedTour.totalReviews || 0} reviews)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Price:</span> ${selectedTour.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Discount:</span> {selectedTour.discount}%
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Participants:</span> {selectedTour.currentParticipants}/
                        {selectedTour.maxParticipants}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Available from:</span>{' '}
                        {selectedTour.startDate
                          ? new Date(selectedTour.startDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Available to:</span>{' '}
                        {selectedTour.endDate ? new Date(selectedTour.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedTour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {selectedTour.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 text-lg mb-2">Media</h4>

                      {/* Thumbnail */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Thumbnail:</span>{' '}
                         
                        </p>
                        <div className="mt-2">
                          <img
                            src={selectedTour.thumbnail}
                            alt="Thumbnail"
                            className="object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Images */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Images:</span>
                        </p>
                        <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 p-1">
                          {selectedTour.images?.length > 0 ? (
                            selectedTour.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Image ${idx + 1}`}
                                className="w-28 h-20 object-cover rounded-lg shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
                              />
                            ))
                          ) : (
                            <span className="text-gray-400 italic">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <p className="mt-1 text-sm text-gray-500">{selectedTour.description || 'N/A'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Highlights</h4>
                      <p className="mt-1 text-sm text-gray-500">{selectedTour.highlights || 'N/A'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Is Activity Tour:</span>{' '}
                        {selectedTour.activityTour ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                {!editMode ? (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Edit Tour
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleStatusUpdate('ACTIVE')}
                        disabled={selectedTour.active}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${selectedTour.active
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                          }`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('INACTIVE')}
                        disabled={!selectedTour.active}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${!selectedTour.active
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                          }`}
                      >
                        Deactivate
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-end space-x-2 w-full">
                    <button
                      onClick={() => setEditMode(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={
                        !tourForm.tourCode ||
                        !tourForm.title ||
                        !tourForm.placeOfDeparture ||
                        !tourForm.duration ||
                        !tourForm.price ||
                        !tourForm.maxParticipants ||
                        !tourForm.startDate ||
                        !tourForm.endDate ||
                        !tourForm.thumbnail ||
                        !tourForm.location ||
                        !tourForm.tourType
                      }
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${!tourForm.tourCode ||
                          !tourForm.title ||
                          !tourForm.placeOfDeparture ||
                          !tourForm.duration ||
                          !tourForm.price ||
                          !tourForm.maxParticipants ||
                          !tourForm.startDate ||
                          !tourForm.endDate ||
                          !tourForm.thumbnail ||
                          !tourForm.location ||
                          !tourForm.tourType
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm tour mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Add New Tour</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tour Code*</label>
                      <input
                        type="text"
                        name="tourCode"
                        value={tourForm.tourCode}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={tourForm.title}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Place of Departure*</label>
                      <input
                        type="text"
                        name="placeOfDeparture"
                        value={tourForm.placeOfDeparture}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration*</label>
                      <input
                        type="text"
                        name="duration"
                        value={tourForm.duration}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                      <select
                        name="tourType"
                        value={tourForm.tourType?.id || ''}
                        onChange={(e) =>
                          setTourForm((prev) => ({
                            ...prev,
                            tourType: { id: e.target.value },
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      >
                        <option value="">Select Tour Type</option>
                        {tourTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location*</label>
                      <select
                        name="location"
                        value={tourForm.location?.id || ''}
                        onChange={(e) =>
                          setTourForm((prev) => ({
                            ...prev,
                            location: { id: e.target.value },
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price ($)*</label>
                      <input
                        type="number"
                        name="price"
                        value={tourForm.price}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={tourForm.discount}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Participants*</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={tourForm.maxParticipants}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Participants</label>
                      <input
                        type="number"
                        name="currentParticipants"
                        value={tourForm.currentParticipants}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                      <input
                        type="date"
                        name="startDate"
                        value={tourForm.startDate}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date*</label>
                      <input
                        type="date"
                        name="endDate"
                        value={tourForm.endDate}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status*</label>
                      <select
                        name="status"
                        value={tourForm.status}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900">Media</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thumbnail URL*</label>
                      <input
                        type="url"
                        name="thumbnail"
                        value={tourForm.thumbnail}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
                      <input
                        type="text"
                        name="images"
                        value={tourForm.images.join(',')}
                        onChange={handleImagesChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="https://example.com/image1.jpg,https://example.com/image2.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900">Description*</h4>
                  <textarea
                    name="description"
                    value={tourForm.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900">Highlights</h4>
                  <textarea
                    name="highlights"
                    value={tourForm.highlights}
                    onChange={handleFormChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="activityTour"
                      checked={tourForm.activityTour}
                      onChange={handleFormChange}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Is Activity Tour</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTour}
                  disabled={
                    !tourForm.tourCode ||
                    !tourForm.title ||
                    !tourForm.placeOfDeparture ||
                    !tourForm.duration ||
                    !tourForm.price ||
                    !tourForm.maxParticipants ||
                    !tourForm.startDate ||
                    !tourForm.endDate ||
                    !tourForm.thumbnail ||
                    !tourForm.location ||
                    !tourForm.tourType
                  }
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${!tourForm.tourCode ||
                      !tourForm.title ||
                      !tourForm.placeOfDeparture ||
                      !tourForm.duration ||
                      !tourForm.price ||
                      !tourForm.maxParticipants ||
                      !tourForm.startDate ||
                      !tourForm.endDate ||
                      !tourForm.thumbnail ||
                      !tourForm.location ||
                      !tourForm.tourType
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  Add Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TourTable;