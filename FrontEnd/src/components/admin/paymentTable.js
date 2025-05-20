import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentTable = () => {
    const TABLE_ROW_LIMIT = 6;
    const [payments, setPayments] = useState([]);
    const [filters, setFilters] = useState({
        userId: '',
        status: '',
        methodId: '',
        from: '',
        to: '',
        page: 0,
        size: TABLE_ROW_LIMIT,
    });
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [methodName, setMethodName] = useState('');
    const [refunds, setRefunds] = useState([]);



    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                userId: filters.userId || undefined,
                status: filters.status || undefined,
                methodId: filters.methodId || undefined,
                from: filters.from || undefined,
                to: filters.to || undefined,
                page: filters.page,
                size: filters.size,
            };
            const response = await axios.get('http://localhost:8080/api/payment/payments', { params });
            setPayments(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserName = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
            return response.data.userName || 'N/A';
        } catch (err) {
            console.error('Lỗi khi lấy tên người dùng:', err);
            return 'N/A';
        }
    };
    useEffect(() => {
        fetchPayments();
    }, [filters]);
    const fetchMethodName = async (methodId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/payment/payment-methods/${methodId}`);
            return response.data.name || 'N/A';
        } catch (err) {
            console.error('Lỗi khi lấy tên phương thức:', err);
            return 'N/A';
        }
    };

    const fetchRefunds = async (paymentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/payment/refunds/${paymentId}`);
            return response.data || [];
        } catch (err) {
            console.error('Lỗi khi lấy thông tin hoàn tiền:', err);
            return [];
        }
    };

    const handleRefund = async (paymentId,bookingId) => {
        if (window.confirm('Bạn có chắc chắn muốn hoàn tiền cho thanh toán này?')) {
            try {
                // Step 1: Update payment status to REFUNDED
                await axios.put(`http://localhost:8080/api/payment/payments/update-refund-status/${paymentId}`);

                // Step 2: Create a new refund record
                await axios.post(`http://localhost:8080/api/payment/refunds`, {
                    paymentId,
                    reason:'REFUND BY ADMIN',
                });
                alert('Đã tạo hoàn tiền thành công!');
                fetchPayments();

            } catch (err) {
                console.error('Lỗi khi hoàn tiền:', err);
                alert('Không thể hoàn tiền. Vui lòng thử lại sau.');
            }
        }
    };

    const handleCancel = async (paymentId,bookingId) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy thanh toán này?')) {
            try {
                await axios.put(`http://localhost:8080/api/payment/payments/update-cancel-status/${paymentId}`);
                await axios.patch(`http://localhost:8080/api/booking/${bookingId}/status`, null, {
                    params: { status: 'CANCELLED' },
                });
                alert('Hủy thanh toán thành công!');
                fetchPayments();
            } catch (err) {
                console.error('Lỗi khi hủy thanh toán:', err);
                alert('Không thể hủy thanh toán. Vui lòng thử lại sau.');
            }
        }
    };

    const handleComplete = async (paymentId,bookingId) => {
        if (window.confirm('Bạn có chắc chắn muốn hoàn tất thanh toán này?')) {
            try {
                await axios.put(`http://localhost:8080/api/payment/payments/update-completed-status/${paymentId}`);
                await axios.patch(`http://localhost:8080/api/booking/${bookingId}/status`, null, {
                    params: { status: 'CONFIRMED' },
                });
                alert('Hoàn tất thanh toán thành công!');
                fetchPayments();
            } catch (err) {
                console.error('Lỗi khi hoàn tất thanh toán:', err);
                alert('Không thể hoàn tất thanh toán. Vui lòng thử lại sau.');
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const resetFilters = () => {
        setFilters({
            userId: '',
            status: '',
            methodId: '',
            from: '',
            to: '',
            page: 0,
            size: TABLE_ROW_LIMIT,
        });
    };

    const refreshData = () => {
        fetchPayments();
    };

    const formatCurrency = (amount, currency = 'VND') => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: currency || 'VND',
        }).format(amount);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'REFUNDED':
                return 'bg-orange-100 text-orange-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'INITIATED':
                return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const openDetailsModal = async (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
        const userNameResult = await fetchUserName(payment.userId);
        const methodNameResult = payment.methodId ? await fetchMethodName(payment.methodId) : 'N/A';
        const refundData = await fetchRefunds(payment.id);
        setUserName(userNameResult);
        setMethodName(methodNameResult);
        setRefunds(refundData);
    };

    const closeDetailsModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
        setUserName('');
        setMethodName('');
        setRefunds([]);
    };

    const renderRows = () => {
        const rows = payments.slice(0, TABLE_ROW_LIMIT).map((p, index) => (
            <tr
                key={p.id}
                className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}
            >
                <td className="py-3 px-4 w-1/7">{p.id}</td>
                <td className="py-3 px-4 w-1/7">{p.userId}</td>
                <td className="py-3 px-4 w-1/7">{formatCurrency(p.amount, p.currency)}</td>
                <td className="py-3 px-4 w-1/7">
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getStatusBadgeClass(p.status)}`}>
            {p.status}
          </span>
                </td>
                <td className="py-3 px-4 w-1/7">{p.methodId || 'N/A'}</td>
                <td className="py-3 px-4 w-1/7">{formatDateTime(p.createdAt)}</td>
                <td className="py-3 px-4 w-1/7 flex flex-col gap-1.5">
                    <button
                        onClick={() => openDetailsModal(p)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-xs font-medium shadow-sm"
                    >
                        Xem chi tiết
                    </button>
                    {p.status === 'COMPLETED' && (
                        <button
                            onClick={() => handleRefund(p.id,p.bookingId)}
                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-xs font-medium shadow-sm"
                        >
                            Hoàn tiền
                        </button>
                    )}
                    {p.status === 'PENDING' && (
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => handleComplete(p.id,p.bookingId)}
                                className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-xs font-medium shadow-sm"
                            >
                                Hoàn tất
                            </button>
                            <button
                                onClick={() => handleCancel(p.id,p.bookingId)}
                                className="px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-xs font-medium shadow-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        ));

        const emptyRows = Array.from(
            { length: Math.max(0, TABLE_ROW_LIMIT - rows.length) },
            (_, i) => (
                <tr key={`empty-${i}`} className="border-t border-gray-200 bg-gray-100">
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                    <td className="py-3 px-4 text-gray-400">--</td>
                </tr>
            )
        );

        return [...rows, ...emptyRows];
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Danh sách thanh toán</h2>
                <button
                    onClick={refreshData}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[120px]">
                    <input
                        name="userId"
                        placeholder="User ID"
                        value={filters.userId}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                    />
                </div>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 min-w-[150px]"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="INITIATED">INITIATED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="REFUNDED">REFUNDED</option>
                </select>
                <div className="relative flex-1 min-w-[150px]">
                    <input
                        name="methodId"
                        placeholder="Method ID"
                        value={filters.methodId}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                    />
                </div>
                <input
                    name="from"
                    type="date"
                    value={filters.from}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 min-w-[150px]"
                />
                <input
                    name="to"
                    type="date"
                    value={filters.to}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 min-w-[150px]"
                />
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 min-w-[100px]"
                >
                    Reset
                </button>
            </div>

            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-left">
                        <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                            <th className="py-3 px-4 w-1/12">ID</th>
                            <th className="py-3 px-4 w-1/12">User_ID</th>
                            <th className="py-3 px-4 w-1/7">Số tiền</th>
                            <th className="py-3 px-4 w-1/7">Trạng thái</th>
                            <th className="py-3 px-4 w-1/5">PaymentMethod_Id</th>
                            <th className="py-3 px-4 w-1/7">Ngày tạo</th>
                            <th className="py-3 px-4 w-1/6">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>{renderRows()}</tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết thanh toán</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="font-medium">ID:</span> {selectedPayment.id}
                            </div>
                            <div>
                                <span className="font-medium">Tên người dùng:</span> {userName}
                            </div>
                            <div>
                                <span className="font-medium">Số tiền:</span> {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                            </div>
                            <div>
                                <span className="font-medium">Trạng thái:</span>
                                <span className={`ml-2 inline-block px-2 py-1 rounded text-sm font-medium ${getStatusBadgeClass(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
                            </div>
                            <div>
                                <span className="font-medium">Phương thức thanh toán:</span> {methodName}
                            </div>
                            <div>
                                <span className="font-medium">Ngày tạo:</span> {formatDateTime(selectedPayment.createdAt)}
                            </div>
                            {refunds.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700">Thông tin hoàn tiền:</h4>
                                    {refunds.map((refund) => (
                                        <div key={refund.id} className="mt-2 space-y-2 border-t pt-2">
                                            <div>
                                                <span className="font-medium">ID Hoàn tiền:</span> {refund.id}
                                            </div>
                                            <div>
                                                <span className="font-medium">Trạng thái:</span>
                                                <span className={`ml-2 inline-block px-2 py-1 rounded text-sm font-medium ${getStatusBadgeClass(refund.status)}`}>
                          {refund.status}
                        </span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Lý do:</span> {refund.reason || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Ngày tạo:</span> {formatDateTime(refund.createdAt)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeDetailsModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <span className="text-gray-700 font-medium">
            Trang {filters.page + 1} / {totalPages}
          </span>
                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page >= totalPages - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            )}

            {!loading && payments.length === 0 && !error && (
                <div className="text-center italic text-gray-500 text-sm mt-6 bg-gray-50 py-4 rounded-lg">
                    Không có dữ liệu
                </div>
            )}
        </div>
    );
};

export default PaymentTable;