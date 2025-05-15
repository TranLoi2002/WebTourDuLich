import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMyBookings, userCancelBooking, getCancelReasons } from '../api/booking.api';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 5;

const USER_RELEVANT_REASONS = [
  'PERSONAL_REASON',
  'SCHEDULE_CONFLICT',
  'FINANCIAL_ISSUE',
  'TOUR_QUALITY_CONCERN',
  'WEATHER_CONDITION',
  'HEALTH_ISSUE',
  'FAMILY_EMERGENCY',
  'TRAVEL_RESTRICTION',
  'CHANGE_OF_PLANS',
  'OTHER',
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Payment Statuses' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Paid', label: 'Paid' },
];

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const navigate = useNavigate();

  if (!isOpen || !booking) return null;

  const handlePayNow = () => {
    navigate(`/payment/${booking.id}`, { state: { isAuthorized: true } }); 
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Booking Code:</strong> {booking.bookingCode}
          </p>
          <p>
            <strong>Tour:</strong> {booking.tour?.title || 'Unknown Tour'}
          </p>
          <p>
            <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {booking.bookingStatus}
          </p>
          <p>
            <strong>Total Price:</strong> ${booking.totalPrice?.toFixed(2) || '0.00'}
          </p>
          <p>
            <strong>Payment Status:</strong> {booking.paymentStatus || 'N/A'}
          </p>
          <p>
            <strong>Payment Due:</strong>{' '}
            {booking.paymentDueTime ? new Date(booking.paymentDueTime).toLocaleString() : 'N/A'}
          </p>
          <p>
            <strong>Notes:</strong> {booking.notes || 'None'}
          </p>
          {booking.bookingStatus === 'CANCELLED' && (
            <>
              <p>
                <strong>Reason:</strong> {booking.reason || 'N/A'}
              </p>
              <p>
                <strong>Canceled By:</strong> {booking.canceledBy === 'USER' ? 'Me' : 'System' || 'N/A'}
              </p>
            </>
          )}
          <div>
            <strong>Participants:</strong>
            {booking.participants && booking.participants.length > 0 ? (
              <div className="mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Age Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Gender
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.participants.map((participant) => (
                      <tr key={participant.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {participant.fullName || 'Unknown'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {participant.ageType || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {participant.gender || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-1">No participants</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
          {booking.bookingStatus === 'PENDING' && (
            <button
              onClick={handlePayNow}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Pay now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingId, cancelReasons, isCancelLoading }) => {
  const [reason, setReason] = useState(cancelReasons[0]?.value || '');

  if (!isOpen) return null;

  if (!cancelReasons.length) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
          <p className="mb-4 text-red-600">Failed to load cancellation reasons. Please try again later.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    onConfirm(bookingId, reason);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
        <p className="mb-4">Please select a reason for canceling this booking:</p>
        <div className="mb-4">
          <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <select
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isCancelLoading}
          >
            {cancelReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isCancelLoading}
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            disabled={isCancelLoading}
          >
            {isCancelLoading ? (
              <>
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                Canceling...
              </>
            ) : (
              'Confirm Cancel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyTour = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  let userId = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userId = user?.id || null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    toast.error('Invalid user data. Please log in again.');
  }

  useEffect(() => {
    const fetchCancelReasons = async () => {
      try {
        const response = await getCancelReasons();
        const reasons = response.data || [];
        const userReasons = reasons.filter((reason) =>
          USER_RELEVANT_REASONS.includes(reason.value)
        );
        setCancelReasons(userReasons);
      } catch (error) {
        console.error('Error fetching cancel reasons:', error);
        toast.error('Failed to load cancellation reasons.');
      }
    };
    fetchCancelReasons();
  }, []);

  useEffect(() => {
    if (!userId) {
      toast.error('Please log in to view your bookings.');
      return;
    }

    const fetchMyBookings = async () => {
      setIsLoading(true);
      try {
        const response = await getMyBookings(userId);
        const bookings = (response.data || []).map((booking) => ({
          ...booking,
          paymentStatus:
            booking.bookingStatus === 'PENDING'
              ? 'Unpaid'
              : booking.bookingStatus === 'CANCELLED'
              ? ''
              : 'Paid',
        }));
        setAllBookings(bookings);
      } catch (error) {
        console.error('Error fetching my bookings:', error);
        toast.error(error.response?.data?.message || 'Failed to load your bookings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBookings();
  }, [userId]);

  // Filter bookings based on search term, status, and payment status
  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const matchesSearch =
        booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.tour?.title || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || booking.bookingStatus === statusFilter;

      const matchesPaymentStatus =
        !paymentStatusFilter || booking.paymentStatus === paymentStatusFilter;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [allBookings, searchTerm, statusFilter, paymentStatusFilter]);

  // Client-side pagination on filtered bookings
  const totalElements = filteredBookings.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const bookings = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, currentPage]);

  // Reset page to 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter, paymentStatusFilter]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  // Handle row click to show details
  const handleRowClick = useCallback((booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  }, []);

  // Handle cancel booking initiation
  const handleInitiateCancel = useCallback((bookingId) => {
    setBookingIdToCancel(bookingId);
    setIsCancelModalOpen(true);
  }, []);

  // Handle confirm cancel
  const handleConfirmCancel = useCallback(
    async (bookingId, reason) => {
      setIsCancelLoading(true);
      try {
        await userCancelBooking(bookingId, { reason }, userId);
        setAllBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  bookingStatus: 'CANCELLED',
                  paymentDueTimeRelevant: false,
                  paymentStatus: '', // Set to empty for CANCELLED
                  reason,
                  canceledBy: 'USER',
                }
              : booking
          )
        );
        toast.success('Booking canceled successfully.');
        setIsCancelModalOpen(false);
      } catch (error) {
        console.error('Error canceling booking:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel booking.');
      } finally {
        setIsCancelLoading(false);
      }
    },
    [userId]
  );

  // Render payment status
  const renderPaymentStatus = (booking) => {
    if (booking.paymentStatus === 'Unpaid') {
      return <span className="text-red-600 font-medium">Unpaid</span>;
    } else if (booking.paymentStatus === 'Paid') {
      return <span className="text-green-600 font-medium">Paid</span>;
    }
    return null; // Empty for CANCELLED
  };

  // Handle no user case
  if (!userId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <h1 className="text-2xl font-bold mb-6">My Tours</h1>
        <div className="text-center py-4">
          <p className="text-gray-500">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-2xl font-bold mb-6">My Tours</h1>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Booking Code or Tour Title
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter booking code or tour title..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="w-full md:w-48">
          <label
            htmlFor="payment-status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Payment Status
          </label>
          <select
            id="payment-status-filter"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Booking Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Booking Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6(py-3 text-left text-xs font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                </td>
              </tr>
            ) : totalElements === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(booking)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.bookingCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.tour?.title || 'Unknown Tour'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          booking.bookingStatus === 'PENDING'
                            ? 'bg-blue-100 text-yellow-700'
                            : booking.bookingStatus === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : booking.bookingStatus === 'COMPLETED'
                            ? 'bg-green-100 text-blue-500'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{renderPaymentStatus(booking)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {(booking.bookingStatus === 'PENDING' || booking.bookingStatus === 'CONFIRMED') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleInitiateCancel(booking.id);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
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
      {totalElements > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span>{' '}
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
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        booking={selectedBooking}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        bookingId={bookingIdToCancel}
        cancelReasons={cancelReasons}
        isCancelLoading={isCancelLoading}
      />
    </div>
  );
};

export default MyTour;