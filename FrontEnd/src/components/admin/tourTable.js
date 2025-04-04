import React, { useState, useEffect } from 'react';

function TourTable() {
  // Tạo dữ liệu tour mẫu
  const mockTours = [
    {
      id: 1,
      name: "Hạ Long Bay Discovery",
      location: "Quảng Ninh, Vietnam",
      duration: "2 days 1 night",
      price: 150,
      category: "Adventure",
      rating: 4.8,
      startDate: "2023-06-15",
      endDate: "2023-10-30",
      maxParticipants: 20,
      currentParticipants: 12,
      status: "ACTIVE",
      description: "Explore the beautiful limestone islands and emerald waters of Ha Long Bay.",
      createdAt: "2023-01-10T09:30:00Z",
      updatedAt: "2023-05-20T14:15:00Z"
    },
    {
        id: 2,
        name: "Sapa Trekking Tour",
        location: "Lào Cai, Vietnam",
        duration: "3 days 2 nights",
        price: 200,
        category: "Trekking",
        rating: 4.9,
        startDate: "2023-05-01",
        endDate: "2023-12-15",
        maxParticipants: 15,
        currentParticipants: 8,
        status: "ACTIVE",
        description: "Trek through terraced rice fields and visit local hill tribes.",
        createdAt: "2023-02-15T10:45:00Z",
        updatedAt: "2023-05-18T11:20:00Z"
      },
      {
        id: 3,
        name: "Hue Imperial City",
        location: "Thừa Thiên Huế, Vietnam",
        duration: "1 day",
        price: 75,
        category: "Cultural",
        rating: 4.7,
        startDate: "2023-04-01",
        endDate: "2023-12-31",
        maxParticipants: 25,
        currentParticipants: 18,
        status: "ACTIVE",
        description: "Discover the ancient capital of Vietnam with its royal palaces and tombs.",
        createdAt: "2023-03-05T08:15:00Z",
        updatedAt: "2023-05-22T16:30:00Z"
      },
      {
        id: 4,
        name: "Phong Nha Cave Expedition",
        location: "Quảng Bình, Vietnam",
        duration: "2 days 1 night",
        price: 180,
        category: "Adventure",
        rating: 4.9,
        startDate: "2023-06-01",
        endDate: "2023-11-30",
        maxParticipants: 12,
        currentParticipants: 6,
        status: "ACTIVE",
        description: "Explore the world's largest caves in Phong Nha-Ke Bang National Park.",
        createdAt: "2023-01-25T11:20:00Z",
        updatedAt: "2023-05-19T09:45:00Z"
      },
      {
        id: 5,
        name: "Mekong Delta Experience",
        location: "Cần Thơ, Vietnam",
        duration: "1 day",
        price: 65,
        category: "Cultural",
        rating: 4.5,
        startDate: "2023-03-15",
        endDate: "2023-12-20",
        maxParticipants: 30,
        currentParticipants: 22,
        status: "ACTIVE",
        description: "Cruise along the Mekong River and visit floating markets.",
        createdAt: "2023-02-28T14:00:00Z",
        updatedAt: "2023-05-21T13:10:00Z"
      },
      {
        id: 6,
        name: "Da Lat Countryside",
        location: "Lâm Đồng, Vietnam",
        duration: "2 days 1 night",
        price: 120,
        category: "Nature",
        rating: 4.6,
        startDate: "2023-04-10",
        endDate: "2023-11-15",
        maxParticipants: 18,
        currentParticipants: 10,
        status: "INACTIVE",
        description: "Explore the cool climate and beautiful landscapes of Da Lat.",
        createdAt: "2023-03-12T09:15:00Z",
        updatedAt: "2023-05-17T15:40:00Z"
      }
  ];

  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // State cho form thêm/chỉnh sửa tour
  const [tourForm, setTourForm] = useState({
    name: '',
    location: '',
    duration: '',
    price: '',
    category: 'Adventure',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    description: '',
    status: 'ACTIVE'
  });

  // Load dữ liệu mẫu khi component mount
  useEffect(() => {
    setTours(mockTours);
    setFilteredTours(mockTours);
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = tours;

    if (searchTerm) {
      results = results.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.id.toString().includes(searchTerm))
    }

    if (statusFilter !== 'ALL') {
      results = results.filter(tour => tour.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      results = results.filter(tour => tour.category === categoryFilter);
    }

    setFilteredTours(results);
  }, [searchTerm, statusFilter, categoryFilter, tours]);

  // Xử lý khi click vào tour
  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
    setEditMode(false);
  };

  // Xử lý cập nhật trạng thái tour
  const handleStatusUpdate = (newStatus) => {
    const updatedTours = tours.map(tour =>
      tour.id === selectedTour.id ? { ...tour, status: newStatus } : tour
    );
    setTours(updatedTours);
    setFilteredTours(updatedTours);
    setIsModalOpen(false);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTourForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Bật chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditMode(true);
    setTourForm({
      name: selectedTour.name,
      location: selectedTour.location,
      duration: selectedTour.duration,
      price: selectedTour.price,
      category: selectedTour.category,
      startDate: selectedTour.startDate,
      endDate: selectedTour.endDate,
      maxParticipants: selectedTour.maxParticipants,
      description: selectedTour.description,
      status: selectedTour.status
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = () => {
    const updatedTour = {
      ...selectedTour,
      ...tourForm,
      price: Number(tourForm.price),
      maxParticipants: Number(tourForm.maxParticipants),
      updatedAt: new Date().toISOString()
    };

    const updatedTours = tours.map(tour => 
      tour.id === selectedTour.id ? updatedTour : tour
    );

    setTours(updatedTours);
    setFilteredTours(updatedTours);
    setSelectedTour(updatedTour);
    setEditMode(false);
  };

  // Thêm tour mới
  const handleAddTour = () => {
    const newTour = {
      id: Math.max(...tours.map(t => t.id)) + 1,
      ...tourForm,
      price: Number(tourForm.price),
      maxParticipants: Number(tourForm.maxParticipants),
      currentParticipants: 0,
      rating: 4.5, // Giá trị mặc định
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTours = [...tours, newTour];
    setTours(updatedTours);
    setFilteredTours(updatedTours);
    setIsAddModalOpen(false);
    setTourForm({
      name: '',
      location: '',
      duration: '',
      price: '',
      category: 'Adventure',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      description: '',
      status: 'ACTIVE'
    });
  };

  return (
    <div className="p-4">
      {/* Thanh tìm kiếm, bộ lọc và nút thêm mới */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Ô tìm kiếm */}
        <div className="flex-1 w-full">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Search by name, location or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Bộ lọc trạng thái */}
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

        {/* Bộ lọc danh mục */}
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="Adventure">Adventure</option>
            <option value="Trekking">Trekking</option>
            <option value="Cultural">Cultural</option>
            <option value="Nature">Nature</option>
          </select>
        </div>

        {/* Nút thêm tour mới */}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ($)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTours.map((tour) => (
              <tr
                key={tour.id}
                onClick={() => handleTourClick(tour)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                  <div className="text-sm text-gray-500">{tour.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tour.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${tour.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tour.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.currentParticipants}/{tour.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả*/}
      {filteredTours.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  {editMode ? 'Edit Tour' : 'Tour Details'} - {selectedTour.name}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                          <label className="block text-sm font-medium text-gray-700">Tour Name</label>
                          <input
                            type="text"
                            name="name"
                            value={tourForm.name}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={tourForm.location}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duration</label>
                          <input
                            type="text"
                            name="duration"
                            value={tourForm.duration}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            name="category"
                            value={tourForm.category}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          >
                            <option value="Adventure">Adventure</option>
                            <option value="Trekking">Trekking</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Nature">Nature</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={tourForm.price}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                          <input
                            type="number"
                            name="maxParticipants"
                            value={tourForm.maxParticipants}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={tourForm.startDate}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={tourForm.endDate}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            name="status"
                            value={tourForm.status}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <textarea
                        name="description"
                        value={tourForm.description}
                        onChange={handleFormChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      />
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
                        <span className="font-medium">Name:</span> {selectedTour.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Location:</span> {selectedTour.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Duration:</span> {selectedTour.duration}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Category:</span> {selectedTour.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Rating:</span> {selectedTour.rating}/5
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Price:</span> ${selectedTour.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Participants:</span> {selectedTour.currentParticipants}/{selectedTour.maxParticipants}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Available from:</span> {new Date(selectedTour.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Available to:</span> {new Date(selectedTour.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedTour.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {selectedTour.status}
                        </span>
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedTour.description}
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
                        disabled={selectedTour.status === 'ACTIVE'}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${selectedTour.status === 'ACTIVE' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('INACTIVE')}
                        disabled={selectedTour.status === 'INACTIVE'}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${selectedTour.status === 'INACTIVE' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
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
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tour Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={tourForm.name}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location*</label>
                      <input
                        type="text"
                        name="location"
                        value={tourForm.location}
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
                      <label className="block text-sm font-medium text-gray-700">Category*</label>
                      <select
                        name="category"
                        value={tourForm.category}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      >
                        <option value="Adventure">Adventure</option>
                        <option value="Trekking">Trekking</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Nature">Nature</option>
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
                      </select>
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
                  disabled={!tourForm.name || !tourForm.location || !tourForm.duration || !tourForm.price || !tourForm.maxParticipants || !tourForm.startDate || !tourForm.endDate || !tourForm.description}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                    ${!tourForm.name || !tourForm.location || !tourForm.duration || !tourForm.price || !tourForm.maxParticipants || !tourForm.startDate || !tourForm.endDate || !tourForm.description 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'}`}
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