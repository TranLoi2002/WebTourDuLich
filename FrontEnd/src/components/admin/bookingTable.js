import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/booking.api';

function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBookings();
        if(response!==null){
          setBookings(response.data);
          setFilteredBookings();
          setFilteredBookings(response.data);
        }

        // console.log(response.data)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = bookings;

    if (searchTerm) {
      results = results.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm))
    }

    if (statusFilter !== 'ALL') {
      results = results.filter(booking => booking.bookingStatus === statusFilter);
    }

    if (paymentFilter !== 'ALL') {
      if (paymentFilter === 'PENDING') {
        results = results.filter(booking => booking.paymentDueTimeRelevant);
      } else {
        results = results.filter(booking => !booking.paymentDueTimeRelevant);
      }
    }

    setFilteredBookings(results);
  }, [searchTerm, statusFilter, paymentFilter, bookings]);

  // Xử lý khi click vào booking
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.bookingStatus);
    setIsModalOpen(true);
  };

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async () => {
    try {
      await updateBookingStatus(selectedBooking.id, newStatus);

      // Cập nhật lại danh sách bookings
      const updatedBookings = bookings.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, bookingStatus: newStatus } : booking
      );
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        {/* Ô tìm kiếm */}
        <div className="flex-1">
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
              placeholder="Search by nme, email or ID"
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
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>

          </select>
        </div>

        {/* Bộ lọc thanh toán */}
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="ALL">ALL PAYMENT</option>
            <option value="PENDING">PENDING</option>
            <option value="OTHERS">OTHERS</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Due</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings !== null ? filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.tourId || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                    ${booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    ${booking.bookingStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.paymentDueTimeRelevant ? (
                    <>
                      <div className="font-medium text-amber-600">
                        {new Date(booking.paymentDueTime).toLocaleString()}
                      </div>
                      <div className="text-xs text-amber-500">Before this time</div>
                    </>
                  ) : booking.bookingStatus === 'CANCELLED' ? (
                    <span className="text-red-500">Payment Cancelled</span>
                  ) : (
                    <span className="text-green-500">Payment completed</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.participants.length} people
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.updatedAt).toLocaleString()}
                </td>
              </tr>
            )):null}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả*/}
      {filteredBookings === null && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy booking nào</h3>
          <p className="mt-1 text-sm text-gray-500">Hãy thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc</p>        </div>
      )}

      {/* Modal hiển thị chi tiết booking */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Booking Details - ID: {selectedBooking.id}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Customer Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Name:</span> {selectedBooking.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Email:</span> {selectedBooking.customerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Phone:</span> {selectedBooking.customerPhone || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Booking Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Tour Name:</span> {selectedBooking.tourId || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Booking Date:</span> {new Date(selectedBooking.bookingDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Participants:</span> {selectedBooking.participants.length} people
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Payment Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedBooking.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedBooking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      ${selectedBooking.bookingStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </p>
                  {selectedBooking.paymentDueTimeRelevant ? (
                    <>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Payment Due:</span>
                        <span className="ml-2 font-medium text-amber-600">
                          {new Date(selectedBooking.paymentDueTime).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs text-amber-500">Payment required before this time</p>
                    </>
                  )
                    : (
                      <p className="text-sm text-red-600 font-medium"> </p>
                    )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Update Status</h4>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={newStatus === selectedBooking.bookingStatus}
                    className={`mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                      ${newStatus === selectedBooking.bookingStatus ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Hiển thị thông tin participants nếu có */}
              {selectedBooking.participants.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900">Participants Details</h4>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AgeType</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedBooking.participants.map((participant, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{participant.fullName}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{participant.ageType}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{participant.gender}</td>
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