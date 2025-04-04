import { useState, useEffect } from 'react';
import { getAllBookings } from '../api/booking.api';

function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBookings();
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = bookings;
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      results = results.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm))
    }
    
    // Lọc theo trạng thái
    if (statusFilter !== 'ALL') {
      results = results.filter(booking => booking.bookingStatus === statusFilter);
    }
    
    // Lọc theo trạng thái thanh toán
    if (paymentFilter !== 'ALL') {
      if (paymentFilter === 'PENDING') {
        results = results.filter(booking => booking.paymentDueTimeRelevant);
      } else {
        results = results.filter(booking => !booking.paymentDueTimeRelevant);
      }
    }
    
    setFilteredBookings(results);
  }, [searchTerm, statusFilter, paymentFilter, bookings]);

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
              placeholder="Tìm kiếm theo tên, email hoặc ID"
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
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PENDING">Đang chờ</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Bộ lọc thanh toán */}
        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="ALL">Tất cả thanh toán</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Due</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
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
                    <span className="text-red-500">Đã hủy</span>
                  ) : (
                    <span className="text-green-500">Đã thanh toán</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.participants.length} people
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy booking nào</h3>
          <p className="mt-1 text-sm text-gray-500">Hãy thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc</p>
        </div>
      )}
    </div>
  );
}

export default BookingTable;