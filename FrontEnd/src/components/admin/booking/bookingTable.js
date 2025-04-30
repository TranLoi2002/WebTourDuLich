import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBookings, updateBookingStatus, cancelBooking } from '../../../api/booking.api';
import BookingFilters from './BookingFilters';
import BookingList from './BookingList';
import BookingDetailsModal from './BookingDetailsModal';
import CancelBookingModal from './CancelBookingModal';
import { useWebSocket } from './useWebSocket';
import { PAGE_SIZE, CANCEL_REASONS } from './Constants';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0].value);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // WebSocket handlers
  const handleNewBooking = useCallback((newBooking) => {
    setBookings((prev) => {
      if (!prev.some((b) => b.id === newBooking.id)) {
        return [newBooking, ...prev].slice(0, PAGE_SIZE);
      }
      return prev;
    });
    setTotalElements((prev) => prev + 1);
  }, []);

  const handleBookingUpdate = useCallback((updatedBooking) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
    );
  }, []);

  useWebSocket(handleNewBooking, handleBookingUpdate);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await getAllBookings(currentPage, PAGE_SIZE);
        const { content, totalPages, totalElements } = response.data;
        setBookings(content || []);
        setTotalPages(totalPages || 1);
        setTotalElements(totalElements || 0);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error(error.response?.data?.message || 'Failed to load bookings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [currentPage]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let results = bookings;

    if (searchTerm) {
      results = results.filter((booking) =>
        [
          booking.user?.fullName?.toLowerCase(),
          booking.user?.email?.toLowerCase(),
          booking.bookingCode?.toLowerCase(),
        ].some((field) => field?.includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((booking) => booking.bookingStatus === statusFilter);
    }

    if (paymentFilter !== 'ALL') {
      results = results.filter((booking) =>
        paymentFilter === 'PENDING' ? booking.paymentDueTimeRelevant : !booking.paymentDueTimeRelevant
      );
    }

    return results;
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  // Handlers
  const handleBookingClick = useCallback((booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.bookingStatus);
    setIsModalOpen(true);
  }, []);

  const handleStatusChange = useCallback((status) => {
    setNewStatus(status);
    if (status === 'CANCELLED') {
      setIsModalOpen(false);
      setCancelReason(CANCEL_REASONS[0].value);
      setIsCancelModalOpen(true);
    }
  }, []);

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      const response = await updateBookingStatus(selectedBooking.id, newStatus);
      const updatedBooking = response.data;
      setBookings((prev) =>
        prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      );
      setSelectedBooking(updatedBooking);
      setIsModalOpen(false);
      toast.success(`Booking ${updatedBooking.bookingCode} updated to ${newStatus}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update booking status. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedBooking, newStatus]);

  const handleCancelBooking = useCallback(async () => {
    if (!selectedBooking) return;
    setIsCanceling(true);
    try {
      const response = await cancelBooking(selectedBooking.id, { reason: cancelReason });
      const updatedBooking = response.data;
      setBookings((prev) =>
        prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      );
      setIsCancelModalOpen(false);
      toast.success(`Booking ${updatedBooking.bookingCode} canceled successfully.`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to cancel booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCanceling(false);
    }
  }, [selectedBooking, cancelReason]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <BookingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
      />
      <BookingList
        bookings={filteredBookings}
        isLoading={isLoading}
        handleBookingClick={handleBookingClick}
        setSelectedBooking={setSelectedBooking}
        setIsCancelModalOpen={setIsCancelModalOpen}
        setNewStatus={setNewStatus}
        setCancelReason={setCancelReason}
        CANCEL_REASONS={CANCEL_REASONS}
      />
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}
            </span>{' '}
            of <span className="font-medium">{totalElements}</span> bookings
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
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBooking={selectedBooking}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleStatusUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
      />
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        selectedBooking={selectedBooking}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelBooking={handleCancelBooking}
        isCanceling={isCanceling}
      />
    </div>
  );
};

export default BookingTable;