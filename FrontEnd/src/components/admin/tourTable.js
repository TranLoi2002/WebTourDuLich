import React, { useState, useEffect } from 'react';
import { getAllTour } from '../../api/catalog.api';

function TourTable() {
  const mockTours = [
    {
      id: 1,
      tourCode: "T001",
      title: "Khám phá Đà Lạt",
      description: "Tour khám phá Đà Lạt mộng mơ trong 3 ngày 2 đêm.",
      price: 200,
      discount: 10,
      placeOfDeparture: "TP. Hồ Chí Minh",
      duration: "3 ngày 2 đêm",
      startDate: "2025-05-01T00:00:00Z",
      endDate: "2025-05-03T00:00:00Z",
      maxParticipants: 20,
      currentParticipants: 8,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 1, name: "Đà Lạt" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      tourCode: "T002",
      title: "Hà Nội - Hạ Long",
      description: "Tham quan Hà Nội và vịnh Hạ Long 5 ngày 4 đêm.",
      price: 350,
      discount: 15,
      placeOfDeparture: "TP. Hồ Chí Minh",
      duration: "5 ngày 4 đêm",
      startDate: "2025-06-10T00:00:00Z",
      endDate: "2025-06-14T00:00:00Z",
      maxParticipants: 30,
      currentParticipants: 25,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 2, name: "Hà Nội" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      tourCode: "T003",
      title: "Bangkok - Thái Lan",
      description: "Tour quốc tế đến Thái Lan 4 ngày.",
      price: 450,
      discount: 5,
      placeOfDeparture: "Hà Nội",
      duration: "4 ngày 3 đêm",
      startDate: "2025-07-05T00:00:00Z",
      endDate: "2025-07-08T00:00:00Z",
      maxParticipants: 25,
      currentParticipants: 10,
      tourType: { id: 2, name: "Quốc tế" },
      location: { id: 3, name: "Bangkok" },
      active: false,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      tourCode: "T004",
      title: "Phú Quốc nghỉ dưỡng",
      description: "Kỳ nghỉ tuyệt vời tại đảo ngọc Phú Quốc.",
      price: 300,
      discount: 8,
      placeOfDeparture: "Cần Thơ",
      duration: "4 ngày 3 đêm",
      startDate: "2025-08-15T00:00:00Z",
      endDate: "2025-08-18T00:00:00Z",
      maxParticipants: 20,
      currentParticipants: 12,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 4, name: "Phú Quốc" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      tourCode: "T005",
      title: "Khám phá Sapa",
      description: "Trải nghiệm văn hóa dân tộc và thiên nhiên Sapa.",
      price: 280,
      discount: 10,
      placeOfDeparture: "Hà Nội",
      duration: "3 ngày 2 đêm",
      startDate: "2025-09-01T00:00:00Z",
      endDate: "2025-09-03T00:00:00Z",
      maxParticipants: 18,
      currentParticipants: 14,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 5, name: "Sapa" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      tourCode: "T006",
      title: "Singapore khám phá",
      description: "Du lịch hiện đại tại quốc đảo sư tử Singapore.",
      price: 550,
      discount: 20,
      placeOfDeparture: "TP. Hồ Chí Minh",
      duration: "5 ngày 4 đêm",
      startDate: "2025-10-05T00:00:00Z",
      endDate: "2025-10-09T00:00:00Z",
      maxParticipants: 22,
      currentParticipants: 17,
      tourType: { id: 2, name: "Quốc tế" },
      location: { id: 6, name: "Singapore" },
      active: false,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 7,
      tourCode: "T007",
      title: "Huế - Đà Nẵng - Hội An",
      description: "Hành trình di sản miền Trung.",
      price: 320,
      discount: 12,
      placeOfDeparture: "TP. Hồ Chí Minh",
      duration: "5 ngày 4 đêm",
      startDate: "2025-11-20T00:00:00Z",
      endDate: "2025-11-24T00:00:00Z",
      maxParticipants: 28,
      currentParticipants: 20,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 7, name: "Huế - Đà Nẵng - Hội An" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 8,
      tourCode: "T008",
      title: "Hàn Quốc mùa thu",
      description: "Chiêm ngưỡng lá đỏ và khám phá Seoul.",
      price: 600,
      discount: 18,
      placeOfDeparture: "Hà Nội",
      duration: "6 ngày 5 đêm",
      startDate: "2025-10-15T00:00:00Z",
      endDate: "2025-10-20T00:00:00Z",
      maxParticipants: 24,
      currentParticipants: 19,
      tourType: { id: 2, name: "Quốc tế" },
      location: { id: 8, name: "Seoul" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 9,
      tourCode: "T009",
      title: "Nha Trang biển xanh",
      description: "Tận hưởng kỳ nghỉ bên bãi biển Nha Trang xinh đẹp.",
      price: 250,
      discount: 5,
      placeOfDeparture: "TP. Hồ Chí Minh",
      duration: "3 ngày 2 đêm",
      startDate: "2025-07-20T00:00:00Z",
      endDate: "2025-07-22T00:00:00Z",
      maxParticipants: 20,
      currentParticipants: 16,
      tourType: { id: 1, name: "Nội địa" },
      location: { id: 9, name: "Nha Trang" },
      active: true,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 10,
      tourCode: "T010",
      title: "Tokyo - Nhật Bản",
      description: "Khám phá xứ sở hoa anh đào với Tokyo sôi động.",
      price: 700,
      discount: 10,
      placeOfDeparture: "Hà Nội",
      duration: "7 ngày 6 đêm",
      startDate: "2025-12-01T00:00:00Z",
      endDate: "2025-12-07T00:00:00Z",
      maxParticipants: 26,
      currentParticipants: 22,
      tourType: { id: 2, name: "Quốc tế" },
      location: { id: 10, name: "Tokyo" },
      active: false,
      thumbnail: "",
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // State cho form thêm/chỉnh sửa tour
  const [tourForm, setTourForm] = useState({
    tourCode: '',
    title: '',
    description: '',
    price: '',
    discount: '',
    placeOfDeparture: '',
    duration: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    tourType: 'Adventure',
    active: true
  });

  // Load dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTour();
        setTours(response);
        setFilteredTours(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setTours(mockTours);
        setFilteredTours(mockTours);
      }
    };
    fetchData();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = tours;

    if (searchTerm) {
      results = results.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.tourCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      const activeFilter = statusFilter === 'ACTIVE';
      results = results.filter(tour => tour.active === activeFilter);
    }

    if (typeFilter !== 'ALL') {
      results = results.filter(tour => tour.tourType.name === typeFilter);
    }

    setFilteredTours(results);
  }, [searchTerm, statusFilter, typeFilter, tours]);

  // Xử lý khi click vào tour
  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
    setEditMode(false);
  };

  // Xử lý cập nhật trạng thái tour
  const handleStatusUpdate = (newStatus) => {
    const updatedTours = tours.map(tour =>
      tour.id === selectedTour.id ? { ...tour, active: newStatus } : tour
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
      tourCode: selectedTour.tourCode,
      title: selectedTour.title,
      description: selectedTour.description,
      price: selectedTour.price,
      discount: selectedTour.discount,
      placeOfDeparture: selectedTour.placeOfDeparture,
      duration: selectedTour.duration,
      startDate: selectedTour.startDate.split('T')[0],
      endDate: selectedTour.endDate,
      maxParticipants: selectedTour.maxParticipants,
      tourType: selectedTour.tourType.name,
      active: selectedTour.active
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = () => {
    const updatedTour = {
      ...selectedTour,
      ...tourForm,
      price: Number(tourForm.price),
      discount: Number(tourForm.discount),
      maxParticipants: Number(tourForm.maxParticipants),
      tourType: {
        ...selectedTour.tourType,
        name: tourForm.tourType
      }
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
      discount: Number(tourForm.discount),
      maxParticipants: Number(tourForm.maxParticipants),
      currentParticipants: 0,
      location: {
        id: 1,
        name: "Việt Nam"
      },
      tourType: {
        id: 1,
        name: tourForm.tourType
      },
      images: [],
      thumbnail: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTours = [...tours, newTour];
    setTours(updatedTours);
    setFilteredTours(updatedTours);
    setIsAddModalOpen(false);
    setTourForm({
      tourCode: '',
      title: '',
      description: '',
      price: '',
      discount: '',
      placeOfDeparture: '',
      duration: '',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      tourType: 'Adventure',
      active: true
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
              placeholder="Search by title, code or location"
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

        {/* Bộ lọc loại tour */}
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">ALL TYPES</option>
            <option value="Adventure">Adventure</option>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ($)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
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
                  <div className="text-sm text-gray-500">{tour.tourType.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.location.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${tour.price} {tour.discount > 0 && <span className="text-red-500">(-{tour.discount}%)</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${tour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tour.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.currentParticipants}/{tour.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
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
                          <label className="block text-sm font-medium text-gray-700">Departure Place*</label>
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
                          <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                          <select
                            name="tourType"
                            value={tourForm.tourType}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="Adventure">Adventure</option>
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
                          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                          <input
                            type="number"
                            name="discount"
                            value={tourForm.discount}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            name="active"
                            value={tourForm.active}
                            onChange={(e) => handleFormChange({ target: { name: 'active', value: e.target.value === 'true' } })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
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
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Basic Information</h4>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Code:</span> {selectedTour.tourCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Title:</span> {selectedTour.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Location:</span> {selectedTour.location.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Duration:</span> {selectedTour.duration}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Departure:</span> {selectedTour.placeOfDeparture}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Type:</span> {selectedTour.tourType.name}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Price:</span> ${selectedTour.price}
                        {selectedTour.discount > 0 && (
                          <span className="ml-2 text-red-500">(Discount: {selectedTour.discount}%)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Participants:</span> {selectedTour.currentParticipants}/{selectedTour.maxParticipants}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Start Date:</span> {formatDate(selectedTour.startDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">End Date:</span> {formatDate(selectedTour.endDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedTour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {selectedTour.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <div 
                        className="mt-1 text-sm text-gray-500"
                        dangerouslySetInnerHTML={{ __html: selectedTour.description }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900">Highlights</h4>
                      <div 
                        className="mt-1 text-sm text-gray-500"
                        dangerouslySetInnerHTML={{ __html: selectedTour.highlights }}
                      />
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
                        onClick={() => handleStatusUpdate(true)}
                        disabled={selectedTour.active}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${selectedTour.active ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(false)}
                        disabled={!selectedTour.active}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${!selectedTour.active ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
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
                      <label className="block text-sm font-medium text-gray-700">Departure Place*</label>
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
                      <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                      <select
                        name="tourType"
                        value={tourForm.tourType}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required
                      >
                        <option value="Adventure">Adventure</option>
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
                      <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={tourForm.discount}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                  disabled={!tourForm.tourCode || !tourForm.title || !tourForm.duration || 
                           !tourForm.placeOfDeparture || !tourForm.price || !tourForm.maxParticipants || 
                           !tourForm.startDate || !tourForm.endDate || !tourForm.description}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                    ${!tourForm.tourCode || !tourForm.title || !tourForm.duration || 
                     !tourForm.placeOfDeparture || !tourForm.price || !tourForm.maxParticipants || 
                     !tourForm.startDate || !tourForm.endDate || !tourForm.description
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