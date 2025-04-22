import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/booking.api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  // Fetch bookings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await getAllBookings(currentPage, pageSize);
        const content = response.data.content || [];
        setBookings(content);
        setFilteredBookings(content);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Không thể tải danh sách booking.');
      }
    };
    fetchData();
  }, [currentPage, pageSize]);

  // Setup WebSocket connection
  useEffect(() => {
    const socket = new SockJS('http://localhost:8082/ws');
    const client = new Client({
      
      // brokerURL: 'ws://localhost:8080/api/ws',
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      // Subscribe to new bookings
      client.subscribe('/topic/bookings', (message) => {
        const newBooking = JSON.parse(message.body);
        setBookings((prev) => {
          if (!prev.some((b) => b.id === newBooking.id)) {
            toast.success(`Booking mới: ${newBooking.bookingCode}`);
            return [newBooking, ...prev].slice(0, pageSize);
          }
          return prev;
        });
        setTotalElements((prev) => prev + 1);
      });
      // Subscribe to status updates
      client.subscribe('/topic/booking-updates', (message) => {
        const updatedBooking = JSON.parse(message.body);
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          )
        );
        setFilteredBookings((prev) =>
          prev.map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          )
        );
        toast.info(`Booking ${updatedBooking.bookingCode} cập nhật thành ${updatedBooking.bookingStatus}`);
      });
    };

    client.onStompError = (error) => {
      console.error('WebSocket error:', error);
      setError('Không thể kết nối với WebSocket.');
      toast.error('Không thể kết nối với WebSocket.');
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
        console.log('Disconnected from WebSocket');
      }
    };
  }, [pageSize]);

  // Apply filters
  useEffect(() => {
    let results = bookings;

    if (searchTerm) {
      results = results.filter((booking) =>
        [
          booking.user?.fullName?.toLowerCase(),
          booking.user?.email?.toLowerCase(),
          booking.bookingCode?.toString(),
        ].some((field) => field?.includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((booking) => booking.bookingStatus === statusFilter);
    }

    if (paymentFilter !== 'ALL') {
      results = results.filter((booking) =>
        paymentFilter === 'PENDING'
          ? booking.paymentDueTimeRelevant
          : !booking.paymentDueTimeRelevant
      );
    }

    setFilteredBookings(results);
  }, [searchTerm, statusFilter, paymentFilter, bookings]);

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.bookingStatus);
    setIsModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      // console.log(selectedBooking.id);

      const response = await updateBookingStatus(selectedBooking.id, newStatus);
      const updatedBooking = response.data;
      console.log(updatedBooking);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? updatedBooking : booking
        )
      );
      setFilteredBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? updatedBooking : booking
        )
      );
      setSelectedBooking(updatedBooking);
      setIsModalOpen(false);
      toast.success(`Booking ${updatedBooking.bookingCode} cập nhật thành ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Không thể cập nhật trạng thái booking. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Format price
  const formatPrice = (price) => (price ? `$${price.toFixed(2)}` : 'N/A');

  // Get valid status options
  const getValidStatusOptions = (currentStatus) => {
    const allStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      return [currentStatus];
    }
    if (currentStatus === 'PENDING') {
      return allStatuses.filter((status) => status !== 'COMPLETED');
    }
    return allStatuses;
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Tìm kiếm
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
              placeholder="Search by name, email or booking code"
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
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="ALL">Tất cả thanh toán</option>
            <option value="PENDING">Pending</option>
            <option value="OTHERS">Khác</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Booking Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tour Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Booking Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Payment Due Time 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                No Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.bookingCode || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.tour?.tourCode || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.user?.fullName || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.user?.email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.bookingStatus === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : booking.bookingStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : booking.bookingStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {booking.bookingStatus || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.bookingDate
                    ? new Date(booking.bookingDate).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.paymentDueTimeRelevant ? (
                    <>
                      <div className="font-medium text-amber-600">
                        {booking.paymentDueTime
                          ? new Date(booking.paymentDueTime).toLocaleString()
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-amber-500">Trước thời điểm này</div>
                    </>
                  ) : booking.bookingStatus === 'CANCELLED' ? (
                    <span className="text-red-500">Thanh toán đã hủy</span>
                  ) : (
                    <span className="text-green-500">Thanh toán hoàn tất</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.participants?.length || 0} người
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(booking.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.updatedAt
                    ? new Date(booking.updatedAt).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{currentPage * pageSize + 1}</span> đến{' '}
            <span className="font-medium">
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </span>{' '}
            trong số <span className="font-medium">{totalElements}</span> booking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Tiếp
          </button>
        </div>
      </div>

      {/* No Results Message */}
      {filteredBookings.length === 0 && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy booking nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Hãy thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết Booking - Mã: {selectedBooking.bookingCode || 'N/A'}
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
                  <h4 className="font-medium text-gray-900">Thông tin khách hàng</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Tên:</span>{' '}
                    {selectedBooking.user?.fullName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Email:</span>{' '}
                    {selectedBooking.user?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Số điện thoại:</span>{' '}
                    {selectedBooking.user?.phoneNumber || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Thông tin booking</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Mã tour:</span>{' '}
                    {selectedBooking.tour?.tourCode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Ngày đặt:</span>{' '}
                    {selectedBooking.bookingDate
                      ? new Date(selectedBooking.bookingDate).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Số người:</span>{' '}
                    {selectedBooking.participants?.length || 0} người
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Tổng giá:</span>{' '}
                    {formatPrice(selectedBooking.totalPrice)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Thông tin thanh toán</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Trạng thái:</span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedBooking.bookingStatus === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : selectedBooking.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : selectedBooking.bookingStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedBooking.bookingStatus || 'N/A'}
                    </span>
                  </p>
                  {selectedBooking.paymentDueTimeRelevant ? (
                    <>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Hạn thanh toán:</span>
                        <span className="ml-2 font-medium text-amber-600">
                          {selectedBooking.paymentDueTime
                            ? new Date(selectedBooking.paymentDueTime).toLocaleString()
                            : 'N/A'}
                        </span>
                      </p>
                      <p className="text-xs text-amber-500">
                        Yêu cầu thanh toán trước thời điểm này
                      </p>
                    </>
                  ) : selectedBooking.bookingStatus === 'CANCELLED' ? (
                    <p className="text-sm text-red-600 font-medium">
                      Thanh toán đã hủy
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 font-medium">
                      Thanh toán hoàn tất
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Cập nhật trạng thái</h4>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      {getValidStatusOptions(selectedBooking.bookingStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
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
                        Đang cập nhật...
                      </span>
                    ) : (
                      'Cập nhật trạng thái'
                    )}
                  </button>
                </div>
              </div>

              {selectedBooking.participants?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900">Chi tiết người tham gia</h4>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Full Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Age Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
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
    </div>
  );
}

export default BookingTable;