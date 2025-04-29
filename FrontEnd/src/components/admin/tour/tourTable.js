import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import TourFilters from './tourFilters';
import TourList from './tourList';
import TourDetailsModal from './tourDetailsModal';
import AddTourModal from './addTourModal';
import { getAllTour, getDetailTour } from '../../../api/tour.api';
import { getAllTourType } from '../../../api/tourtype.api';
import { getAllLocation } from '../../../api/location.api';
import { getActivityType } from '../../../api/activitytour.api';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const PAGE_SIZE = 5;

function TourTable() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
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
    activityType: null,
    status: 'ACTIVE',
  });

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [toursResponse, tourTypesResponse, locationsResponse, activityTypesResponse] = await Promise.all([
          getAllTour(currentPage, PAGE_SIZE, 'id', 'asc'),
          getAllTourType(0, 1000, 'id', 'asc'),
          getAllLocation(0, 1000, 'id', 'asc'),
          getActivityType(0, 1000, 'id', 'asc'),
        ]);

        const { content: toursContent, totalPages, totalElements } = toursResponse;
        const { content: tourTypesContent } = tourTypesResponse;
        const { content: locationsContent } = locationsResponse;
        const { content: activityTypesContent } = activityTypesResponse;

        setTours(toursContent || []);
        setFilteredTours(toursContent || []);
        setTotalPages(totalPages || 1);
        setTotalElements(totalElements || 0);
        setTourTypes(tourTypesContent || []);
        setLocations(locationsContent || []);
        setActivityTypes(activityTypesContent || []);
      } catch (error) {
        toast.error('Failed to load data. Please try again.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // Lọc tours
  const filteredToursMemo = useMemo(() => {
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

    return results;
  }, [tours, searchTerm, statusFilter, categoryFilter]);

  useEffect(() => {
    setFilteredTours(filteredToursMemo);
  }, [filteredToursMemo]);

  // Xử lý click tour để lấy chi tiết
  const handleTourClick = useCallback(async (tour) => {
    try {
      const response = await getDetailTour(tour.id);
      const detailedTour = response;
      setSelectedTour(detailedTour);
      setTourForm({
        ...detailedTour,
        location: detailedTour.location || null,
        tourType: detailedTour.tourType || null,
        activityType: detailedTour.activityType || null,
        startDate: detailedTour.startDate ? new Date(detailedTour.startDate).toISOString().split('T')[0] : '',
        endDate: detailedTour.endDate ? new Date(detailedTour.endDate).toISOString().split('T')[0] : '',
        status: detailedTour.active ? 'ACTIVE' : 'INACTIVE',
      });
      setIsModalOpen(true);
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to load tour details.');
      console.error(error);
    }
  }, []);

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = useCallback(
    async (newStatus) => {
      if (!selectedTour) return;
      setIsUpdating(true);
      try {
        const updatedTour = { ...selectedTour, active: newStatus === 'ACTIVE' };
        await axios.put(`${apiBaseUrl}/catalog/tours/${selectedTour.id}`, updatedTour);
        setTours((prev) =>
          prev.map((tour) => (tour.id === selectedTour.id ? { ...tour, active: newStatus === 'ACTIVE' } : tour))
        );
        setFilteredTours((prev) =>
          prev.map((tour) => (tour.id === selectedTour.id ? { ...tour, active: newStatus === 'ACTIVE' } : tour))
        );
        setSelectedTour(updatedTour);
        setIsModalOpen(false);
        toast.success(`Tour ${selectedTour.tourCode} updated to ${newStatus}`);
      } catch (error) {
        toast.error('Failed to update tour status.');
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedTour]
  );

  // Xử lý thay đổi form
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target || e;
    setTourForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Xử lý thay đổi images
  const handleImagesChange = useCallback((e) => {
    const images = e.target.value
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url);
    setTourForm((prev) => ({ ...prev, images }));
  }, []);

  // Lưu thay đổi
  const handleSaveChanges = useCallback(async () => {
    if (!selectedTour) return;
    setIsUpdating(true);
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
        location: tourForm.location ? { id: Number(tourForm.location.id) } : selectedTour.location,
        tourType: tourForm.tourType ? { id: Number(tourForm.tourType.id) } : selectedTour.tourType,
        activityType: tourForm.activityType ? { id: Number(tourForm.activityType.id) } : selectedTour.activityType,
      };
      await axios.put(`${apiBaseUrl}/catalog/tours/${selectedTour.id}`, updatedTour);
      setTours((prev) =>
        prev.map((tour) => (tour.id === selectedTour.id ? { ...tour, ...updatedTour } : tour))
      );
      setFilteredTours((prev) =>
        prev.map((tour) => (tour.id === selectedTour.id ? { ...tour, ...updatedTour } : tour))
      );
      setSelectedTour({ ...selectedTour, ...updatedTour });
      setEditMode(false);
      setIsModalOpen(false);
      toast.success(`Tour ${updatedTour.tourCode} updated successfully.`);
    } catch (error) {
      toast.error('Failed to save changes.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedTour, tourForm]);

  // Thêm tour mới
  const handleAddTour = useCallback(async () => {
    setIsUpdating(true);
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
        location: tourForm.location ? { id: Number(tourForm.location.id) } : null,
        tourType: tourForm.tourType ? { id: Number(tourForm.tourType.id) } : null,
        activityType: tourForm.activityType ? { id: Number(tourForm.activityType.id) } : null,
      };
      const response = await axios.post(`${apiBaseUrl}/catalog/tours`, newTour);
      setTours((prev) => [...prev, response.data]);
      setFilteredTours((prev) => [...prev, response.data]);
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
        activityType: null,
        status: 'ACTIVE',
      });
      toast.success(`Tour ${newTour.tourCode} added successfully.`);
    } catch (error) {
      toast.error('Failed to add new tour.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, [tourForm]);

  // Xử lý phân trang
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <TourFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        tourTypes={tourTypes}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <TourList tours={filteredTours} isLoading={isLoading} handleTourClick={handleTourClick} />
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span> to{' '}
            <span className="font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span> of{' '}
            <span className="font-medium">{totalElements}</span> tours
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
      <TourDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditMode(false);
        }}
        selectedTour={selectedTour}
        editMode={editMode}
        setEditMode={setEditMode}
        tourForm={tourForm}
        handleFormChange={handleFormChange}
        handleImagesChange={handleImagesChange}
        handleSaveChanges={handleSaveChanges}
        handleStatusUpdate={handleStatusUpdate}
        tourTypes={tourTypes}
        locations={locations}
        activityTypes={activityTypes}
        isUpdating={isUpdating}
      />
      <AddTourModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tourForm={tourForm}
        handleFormChange={handleFormChange}
        handleImagesChange={handleImagesChange}
        handleAddTour={handleAddTour}
        tourTypes={tourTypes}
        locations={locations}
        activityTypes={activityTypes}
      />
    </div>
  );
}

export default TourTable;