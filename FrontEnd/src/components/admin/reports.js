import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import moment from 'moment';
import 'moment/locale/vi';

// Thiết lập ngôn ngữ tiếng Việt cho moment
moment.locale('vi');

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  // Khởi tạo trạng thái
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ánh xạ trạng thái thanh toán sang tiếng Việt
  const paymentStatusMap = {
    COMPLETED: 'Đã thanh toán',
    PENDING: 'Đang đợi thanh toán',
    FAILED: 'Không thanh toán thành công',
    CANCELLED: 'Huỷ thanh toán',
    APPROVED: 'Đã hoàn tiền',
    INITIATED: 'Đang chờ hoàn tiền', // Đảm bảo trạng thái này được ánh xạ
    REJECTED: 'Bị từ chối hoàn tiền', // Đảm bảo trạng thái này được ánh xạ
  };

  // Ánh xạ trạng thái hoàn tiền sang tiếng Việt
  const refundStatusMap = {
    APPROVED: 'Đã hoàn tiền',
    INITIATED: 'Đang chờ hoàn tiền',
    REJECTED: 'Bị từ chối hoàn tiền',
  };

  // Bảng màu cho các trạng thái
  const statusColors = {
    COMPLETED: '#3B82F6', // Xanh dương
    PENDING: '#FBBF24', // Vàng
    FAILED: '#EF4444', // Đỏ
    CANCELLED: '#14B8A6', // Xanh ngọc
    APPROVED: '#8B5CF6', // Tím
    INITIATED: '#10B981', // Xanh lá (màu khác biệt cho INITIATED)
    REJECTED: '#F87171', // Đỏ nhạt (màu khác biệt cho REJECTED)
  };

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      setError(null); // Xóa lỗi trước đó
      try {
        const [paymentResponse, refundResponse] = await Promise.all([
          axios.get('http://localhost:8080/payment/payments', {
            params: { page: 0, size: 1000 },
          }),
          axios.get('http://localhost:8080/payment/refunds', {
            params: { page: 0, size: 1000 },
          }),
        ]);
        setPayments(paymentResponse.data.content || []); // Lưu dữ liệu thanh toán
        setRefunds(refundResponse.data.content || []); // Lưu dữ liệu hoàn tiền
      } catch (err) {
        setError('Không thể tải dữ liệu từ API. Vui lòng kiểm tra server.'); // Xử lý lỗi
        console.error(err);
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };
    fetchData();
  }, []);

  // Định dạng số tiền sang VND
  const formatCurrency = (amount, currency = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Dữ liệu cho biểu đồ phân bố trạng thái thanh toán (Pie Chart)
  const paymentStatusData = () => {
    const statusCounts = payments.reduce((acc, p) => {
      const displayStatus = paymentStatusMap[p.status] || p.status; // Lấy tên trạng thái tiếng Việt
      acc[displayStatus] = (acc[displayStatus] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(
            (status) =>
              statusColors[
                Object.keys(paymentStatusMap).find(
                  (key) => paymentStatusMap[key] === status
                )
              ] || '#E5E7EB' // Màu xám mặc định nếu không tìm thấy
          ),
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ phân bố trạng thái hoàn tiền (Pie Chart)
  const refundStatusData = () => {
    const statusCounts = refunds.reduce((acc, r) => {
      const displayStatus = refundStatusMap[r.status] || r.status; // Lấy tên trạng thái tiếng Việt
      acc[displayStatus] = (acc[displayStatus] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(
            (status) =>
              statusColors[
                Object.keys(refundStatusMap).find(
                  (key) => refundStatusMap[key] === status
                )
              ] || '#E5E7EB'
          ),
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ tổng số tiền theo trạng thái (Bar Chart)
  const paymentAmountByStatusData = () => {
    const amountByStatus = payments.reduce((acc, p) => {
      const displayStatus = paymentStatusMap[p.status] || p.status; // Lấy tên trạng thái tiếng Việt
      acc[displayStatus] = (acc[displayStatus] || 0) + p.amount;
      return acc;
    }, {});
    // Ánh xạ tên trạng thái sang tiếng Anh cho nhãn
    const englishStatusMap = {
      'Đã thanh toán': 'Completed',
      'Đang xử lý': 'Pending',
      'Không thanh toán thành công': 'Failed',
      'Huỷ thanh toán': 'Cancelled',
      'Đã hoàn tiền': 'Approved',
      'Đang chờ hoàn tiền': 'Initiated',
      'Bị từ chối hoàn tiền': 'Rejected',
    };
    return {
      labels: Object.keys(amountByStatus).map(
        (status) => englishStatusMap[status] || status
      ), // Sử dụng nhãn tiếng Anh
      datasets: [
        {
          label: 'Tổng số tiền',
          data: Object.values(amountByStatus),
          backgroundColor: Object.keys(amountByStatus).map(
            (status) =>
              statusColors[
                Object.keys(paymentStatusMap).find(
                  (key) => paymentStatusMap[key] === status
                )
              ] || '#3B82F6'
          ),
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ hoàn tiền theo lý do (Bar Chart)
  const refundReasonData = () => {
    const reasonCounts = refunds.reduce((acc, r) => {
      const reason = r.reason || 'Không có lý do'; // Xử lý trường hợp không có lý do
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(reasonCounts),
      datasets: [
        {
          label: 'Số lượng hoàn tiền',
          data: Object.values(reasonCounts),
          backgroundColor: '#FBBF24', // Màu vàng
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ thanh toán theo thời gian (Line Chart)
  const paymentsOverTimeData = () => {
    const paymentsByDate = payments.reduce((acc, p) => {
      if (
        moment(p.createdAt).isValid() &&
        typeof p.amount === 'number' &&
        p.amount >= 0 &&
        ['COMPLETED', 'APPROVED'].includes(p.status)
      ) {
        const date = moment(p.createdAt).format('DD/MM/YYYY'); // Định dạng ngày
        acc[date] = (acc[date] || 0) + p.amount;
      }
      return acc;
    }, {});
    const sortedDates = Object.keys(paymentsByDate).sort((a, b) =>
      moment(a, 'DD/MM/YYYY').diff(moment(b, 'DD/MM/YYYY'))
    ); // Sắp xếp theo ngày
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Tổng số tiền thanh toán (Thành công & Hoàn trả)',
          data: sortedDates.map((date) => paymentsByDate[date]),
          fill: false,
          borderColor: '#3B82F6', // Màu xanh dương
          tension: 0.1,
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ hoàn tiền theo thời gian (Line Chart)
  const refundsOverTimeData = () => {
    const refundsByDate = refunds.reduce((acc, r) => {
      const date = moment(r.createdAt).format('DD/MM/YYYY'); // Định dạng ngày
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const sortedDates = Object.keys(refundsByDate).sort((a, b) =>
      moment(a, 'DD/MM/YYYY').diff(moment(b, 'DD/MM/YYYY'))
    ); // Sắp xếp theo ngày
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Số lượng hoàn tiền',
          data: sortedDates.map((date) => refundsByDate[date]),
          fill: false,
          borderColor: '#EF4444', // Màu đỏ
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Tiêu đề chính */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Thống kê Thanh toán & Hoàn tiền
        </h2>

        {/* Trạng thái đang tải */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Trạng thái lỗi */}
        {error && (
          <div className="text-center bg-red-50 text-red-600 p-6 rounded-xl mb-6">
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {/* Trạng thái không có dữ liệu */}
        {!loading && !error && payments.length === 0 && refunds.length === 0 && (
          <div className="text-center bg-gray-50 text-gray-600 p-6 rounded-xl mb-6">
            <p className="text-lg font-medium">Không có dữ liệu để hiển thị.</p>
          </div>
        )}

        {/* Hiển thị biểu đồ nếu có dữ liệu */}
        {!loading && !error && (payments.length > 0 || refunds.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biểu đồ phân bố trạng thái thanh toán */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Phân bố trạng thái thanh toán
              </h3>
              <Pie
                data={paymentStatusData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 14 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw} thanh toán`,
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Biểu đồ phân bố trạng thái hoàn tiền */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Phân bố trạng thái hoàn tiền
              </h3>
              <Pie
                data={refundStatusData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 14 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw} yêu cầu`,
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Biểu đồ tổng số tiền theo trạng thái */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Tổng số tiền theo trạng thái
              </h3>
              <Bar
                data={paymentAmountByStatusData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${formatCurrency(context.raw, 'VND')}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value, 'VND'),
                        font: { size: 12 },
                      },
                    },
                    x: {
                      ticks: { font: { size: 12 } },
                    },
                  },
                }}
              />
            </div>

            {/* Biểu đồ hoàn tiền theo lý do */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Hoàn tiền theo lý do
              </h3>
              <Bar
                data={refundReasonData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw} yêu cầu`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } },
                    x: { ticks: { font: { size: 12 } } },
                  },
                }}
              />
            </div>

            {/* Biểu đồ thanh toán theo thời gian */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Thanh toán theo thời gian
              </h3>
              <Line
                data={paymentsOverTimeData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { font: { size: 14 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${moment(context.label, 'DD/MM/YYYY').format('LL')}: ${formatCurrency(context.raw, 'VND')}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value, 'VND'),
                        font: { size: 12 },
                      },
                    },
                    x: { ticks: { font: { size: 12 } } },
                  },
                }}
              />
            </div>

            {/* Biểu đồ hoàn tiền theo thời gian */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Hoàn tiền theo thời gian
              </h3>
              <Line
                data={refundsOverTimeData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { font: { size: 14 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${moment(context.label, 'DD/MM/YYYY').format('LL')}: ${context.raw} yêu cầu`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } },
                    x: { ticks: { font: { size: 12 } } },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;