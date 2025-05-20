import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TourFilters from './tourFilters';
import TourList from './tourList';
import TourDetailsModal from './tourDetailsModal';
import AddTourModal from './addTourModal';
import { getAllTour, getDetailTour, createTour, updateTour, updateTourStatuses } from '../../../api/tour.api';
import { getAllTourType } from '../../../api/tourtype.api';
import { getAllLocation } from '../../../api/location.api';
import { getActivityType } from '../../../api/activitytour.api';

const PAGE_SIZE = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
    active: true,
    price: '',
    discount: 0,
    placeOfDeparture: '',
    duration: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    currentParticipants: 0,
    thumbnail: null,
    images: [],
    locationId: null,
    tourTypeId: null,
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

        const { content: toursContent, totalPages, totalItems } = toursResponse;
        const { content: tourTypesContent } = tourTypesResponse;
        const { content: locationsContent } = locationsResponse;
        const { content: activityTypesContent } = activityTypesResponse;

        const filterTourType = (tourTypesContent || []).filter(f => f.active === true);
        const filterActivities = (activityTypesContent || []).filter(f => f.active === true);
        const filterLocations = (locationsContent || []).filter(f => f.active === true);

        setTours(toursContent || []);
        setFilteredTours(toursContent || []);
        setTotalPages(totalPages || 1);
        setTotalElements(totalItems || 0);
        setTourTypes(filterTourType || []);
        setLocations(filterLocations || []);
        setActivityTypes(filterActivities || []);
      } catch (error) {
        toast.error('Failed to load data: ' + (error.message || 'Unknown error'));
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
      results = results.filter((tour) => tour.status === statusFilter);
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
        locationId: detailedTour.location?.id || null,
        tourTypeId: detailedTour.tourType?.id || null,
        startDate: detailedTour.startDate ? new Date(detailedTour.startDate).toISOString().split('T')[0] : '',
        endDate: detailedTour.endDate ? new Date(detailedTour.endDate).toISOString().split('T')[0] : '',
        active: detailedTour.active ?? true,
        description: detailedTour.description || '',
        highlights: detailedTour.highlights || '',
        thumbnail: detailedTour.thumbnail || null,
        images: detailedTour.images || [],
      });
      setIsModalOpen(true);
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to load tour details: ' + (error.message || 'Unknown error'));
      console.error(error);
    }
  }, []);

  // Xử lý cập nhật trạng thái tất cả tours
  const handleStatusUpdateAll = useCallback(async () => {
    setIsUpdating(true);
    try {
      await updateTourStatuses();
      const toursResponse = await getAllTour(currentPage, PAGE_SIZE, 'id', 'asc');
      const { content: toursContent, totalPages, totalElements } = toursResponse;
      setTours(toursContent || []);
      setFilteredTours(toursContent || []);
      setTotalPages(totalPages || 1);
      setTotalElements(totalElements || 0);
      toast.success('Tour statuses updated successfully.');
    } catch (error) {
      toast.error('Failed to update tour statuses: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, [currentPage]);

  // Xử lý thay đổi form
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          toast.error('Only JPEG or PNG images are allowed for thumbnail.');
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error('Thumbnail file size must not exceed 5MB.');
          return;
        }
      }
      setTourForm((prev) => ({ ...prev, [name]: file }));
    } else {
      setTourForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  }, []);

  // Xử lý thay đổi images
  const handleImagesChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error(`File ${file.name} is not a JPEG or PNG image.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} exceeds 5MB limit.`);
        return false;
      }
      return true;
    });
    setTourForm((prev) => ({ ...prev, images: validFiles }));
  }, []);

  // Xử lý xóa một hình ảnh
  const handleRemoveImage = useCallback((index) => {
    setTourForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  // Lưu thay đổi
  const handleSaveChanges = useCallback(async () => {
    if (!selectedTour) return;
    setIsUpdating(true);
    try {
      const tourData = {
        title: tourForm.title,
        description: tourForm.description || '',
        highlights: tourForm.highlights || '',
        activityTour: tourForm.activityTour,
        active: tourForm.active,
        price: Number(tourForm.price),
        discount: Number(tourForm.discount),
        placeOfDeparture: tourForm.placeOfDeparture,
        duration: tourForm.duration,
        startDate: new Date(tourForm.startDate).toISOString(),
        endDate: new Date(tourForm.endDate).toISOString(),
        maxParticipants: Number(tourForm.maxParticipants),
        currentParticipants: Number(tourForm.currentParticipants),
        locationId: Number(tourForm.locationId),
        tourTypeId: Number(tourForm.tourTypeId),
        tourCode: tourForm.tourCode,
      };

      const formData = new FormData();
      formData.append('tour', JSON.stringify(tourData));
      if (tourForm.thumbnail instanceof File) {
        formData.append('thumbnail', tourForm.thumbnail);
      }
      tourForm.images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img);
        }
      });

      const response = await updateTour(selectedTour.id, formData);
      setTours((prev) =>
        prev.map((tour) => (tour.id === selectedTour.id ? response : tour))
      );
      setFilteredTours((prev) =>
        prev.map((tour) => (tour.id === selectedTour.id ? response : tour))
      );
      setSelectedTour(response);
      setEditMode(false);
      setIsModalOpen(false);
      toast.success(`Tour ${tourForm.tourCode} updated successfully.`);
    } catch (error) {
      toast.error('Failed to save changes: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedTour, tourForm]);

  // Thêm tour mới
  const handleAddTour = useCallback(async () => {
    setIsUpdating(true);
    try {
      const tourData = {
        title: tourForm.title,
        description: tourForm.description || '',
        highlights: tourForm.highlights || '',
        activityTour: tourForm.activityTour,
        active: tourForm.active,
        price: Number(tourForm.price),
        discount: Number(tourForm.discount),
        placeOfDeparture: tourForm.placeOfDeparture,
        duration: tourForm.duration,
        startDate: new Date(tourForm.startDate).toISOString(),
        endDate: new Date(tourForm.endDate).toISOString(),
        maxParticipants: Number(tourForm.maxParticipants),
        currentParticipants: Number(tourForm.currentParticipants) || 0,
        locationId: Number(tourForm.locationId),
        tourTypeId: Number(tourForm.tourTypeId),
      };

      const formData = new FormData();
      formData.append('tour', JSON.stringify(tourData));
      if (tourForm.thumbnail instanceof File) {
        formData.append('thumbnail', tourForm.thumbnail);
      }
      tourForm.images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img);
        }
      });

      const response = await createTour(formData);
      setTours((prev) => [...prev, response]);
      setFilteredTours((prev) => [...prev, response]);
      setIsAddModalOpen(false);
      setTourForm({
        tourCode: '',
        title: '',
        description: '',
        highlights: '',
        activityTour: false,
        active: true,
        price: '',
        discount: 0,
        placeOfDeparture: '',
        duration: '',
        startDate: '',
        endDate: '',
        maxParticipants: '',
        currentParticipants: 0,
        thumbnail: null,
        images: [],
        locationId: null,
        tourTypeId: null,
      });
      toast.success(`Tour ${response.tourCode} added successfully.`);
    } catch (error) {
      toast.error('Failed to add new tour: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, [tourForm]);

  // Reset tourForm khi mở AddTourModal
  const handleOpenAddTourModal = useCallback(() => {
    setTourForm({
      tourCode: '',
      title: '',
      description: '',
      highlights: '',
      activityTour: false,
      active: true,
      price: '',
      discount: 0,
      placeOfDeparture: '',
      duration: '',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      currentParticipants: 0,
      thumbnail: null,
      images: [],
      locationId: null,
      tourTypeId: null,
    });
    setIsAddModalOpen(true);
  }, []);

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
        setIsAddModalOpen={handleOpenAddTourModal}
        handleStatusUpdateAll={handleStatusUpdateAll}
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
        handleRemoveImage={handleRemoveImage}
        handleSaveChanges={handleSaveChanges}
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
        handleRemoveImage={handleRemoveImage}
        handleAddTour={handleAddTour}
        tourTypes={tourTypes}
        locations={locations}
        activityTypes={activityTypes}
      />
    </div>
  );
}

export default TourTable;