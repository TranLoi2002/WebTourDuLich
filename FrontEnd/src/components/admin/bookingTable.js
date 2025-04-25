import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBookings, updateBookingStatus, cancelBooking } from '../../api/booking.api';

// Constants
const BOOKING_STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const PAYMENT_FILTERS = ['ALL', 'PENDING', 'OTHERS'];
const CANCEL_REASONS = [
  { value: 'TOUR_QUALITY_CONCERN', label: 'Lo ngại về chất lượng tour' },
  { value: 'WEATHER_CONDITION', label: 'Điều kiện thời tiết bất lợi' },
  { value: 'OPERATIONAL_ISSUE', label: 'Vấn đề vận hành tour' },
  { value: 'LEGAL_RESTRICTION', label: 'Hạn chế pháp lý hoặc quy định' },
  { value: 'OTHER', label: 'Lý do khác' },
];
const WEBSOCKET_URL = 'http://localhost:8082/ws';
const PAGE_SIZE = 10;

// Custom Hook for WebSocket
const useWebSocket = (onNewBooking, onBookingUpdate) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/bookings', (message) => {
        const newBooking = JSON.parse(message.body);
        onNewBooking(newBooking);
        toast.success(`New booking: ${newBooking.bookingCode}`);
      });
      stompClient.subscribe('/topic/booking-updates', (message) => {
        const updatedBooking = JSON.parse(message.body);
        onBookingUpdate(updatedBooking);
        toast.info(`Booking ${updatedBooking.bookingCode} updated to ${updatedBooking.bookingStatus}`);
      });
    };

    stompClient.onStompError = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Failed to connect to WebSocket.');
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
      console.log('Disconnected from WebSocket');
    };
  }, [onNewBooking, onBookingUpdate]);

  return client;
};

// Components
const StatusBadge = ({ status }) => {
  const styles = {
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>
      {status || 'N/A'}
    </span>
  );
};

const PaymentStatus = ({ booking }) => {
  if (booking.paymentDueTimeRelevant) {
    return (
      <>
        <div className="font-medium text-amber-600">
          {booking.paymentDueTime ? new Date(booking.paymentDueTime).toLocaleString() : 'N/A'}
        </div>
        <div className="text-xs text-amber-500">Before this time</div>
      </>
    );
  }
  return booking.bookingStatus === 'CANCELLED' ? (
    <span className="text-red-500">Payment canceled</span>
  ) : (
    <span className="text-green-500">Payment completed</span>
  );
};

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
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
    setFilteredBookings((prev) =>
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
        setFilteredBookings(content || []);
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
  const filteredBookingsMemo = useMemo(() => {
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
      setFilteredBookings((prev) =>
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
      setFilteredBookings((prev) =>
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
  console.log(selectedBooking);
  const formatPrice = (price) => (price ? `$${price.toFixed(2)}` : 'N/A');

  const getValidStatusOptions = (currentStatus) => {
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      return [currentStatus];
    }
    if (currentStatus === 'PENDING') {
      return BOOKING_STATUSES.filter((status) => status !== 'COMPLETED' && status !== 'ALL');
    }
    return BOOKING_STATUSES.filter((status) => status !== 'ALL');
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
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
              placeholder="Search by name, email, or booking code"
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
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            {PAYMENT_FILTERS.map((filter) => (
              <option key={filter} value={filter}>
                {filter === 'ALL' ? 'All Payments' : filter === 'PENDING' ? 'Pending' : 'Others'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Booking Code',
                'Customer',
                'Tour Code',
                'Status',
                'Booking Date',
                'Payment Due',
                'Total Price',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  <svg
                    className="animate-spin mx-auto h-8 w-8 text-indigo-600"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </td>
              </tr>
            ) : filteredBookingsMemo.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No bookings found. Try adjusting your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredBookingsMemo.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => handleBookingClick(booking)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.bookingCode || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.user?.fullName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.tour?.tourCode || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.bookingStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <PaymentStatus booking={booking} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.bookingStatus !== 'CANCELLED' &&
                      booking.bookingStatus !== 'COMPLETED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setNewStatus('CANCELLED');
                            setCancelReason(CANCEL_REASONS[0].value);
                            setIsCancelModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
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

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Booking Details - Code: {selectedBooking.bookingCode || 'N/A'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                  <h4 className="font-medium text-gray-900">Customer Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Name:</span> {selectedBooking.user?.fullName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Email:</span> {selectedBooking.user?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Phone:</span>{' '}
                    {selectedBooking.user?.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Booking Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Tour Code:</span>{' '}
                    {selectedBooking.tour?.tourCode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Booking Date:</span>{' '}
                    {selectedBooking.bookingDate
                      ? new Date(selectedBooking.bookingDate).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Participants:</span>{' '}
                    {selectedBooking.participants?.length || 0} people
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Total Price:</span>{' '}
                    {formatPrice(selectedBooking.totalPrice)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Payment Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Status:</span>
                    <StatusBadge status={selectedBooking.bookingStatus} />
                  </p>
                  <PaymentStatus booking={selectedBooking} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cancellation Information</h4>
                  {selectedBooking.bookingStatus === 'CANCELLED' ? (
                    <>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Canceled By:</span>{' '}
                        {selectedBooking.canceledBy || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Reason:</span>{' '}
                        {selectedBooking.refundReason || 'Not paid on time'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Refund Amount:</span>{' '}
                        {selectedBooking.refundAmount || 'Not paid on time'}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No cancellation details</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Update Status</h4>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={newStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      {getValidStatusOptions(selectedBooking.bookingStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {newStatus !== 'CANCELLED' && (
                    <button
                      onClick={handleStatusUpdate}
                      disabled={newStatus === selectedBooking.bookingStatus || isUpdating}
                      className={`mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        newStatus === selectedBooking.bookingStatus || isUpdating
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Status'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {selectedBooking.participants?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900">Participant Details</h4>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Full Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedBooking.participants.map((participant, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {participant.fullName || 'N/A'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {participant.ageType || 'N/A'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {participant.gender || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Booking - Code: {selectedBooking.bookingCode || 'N/A'}
                </h3>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
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

              <div className="mt-4">
                <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">
                  Reason for Cancellation
                </label>
                <select
                  id="cancelReason"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  {CANCEL_REASONS.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      handleCancelBooking();
                    }
                  }}
                  disabled={isCanceling}
                  className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isCanceling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isCanceling ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Canceling...
                    </span>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;