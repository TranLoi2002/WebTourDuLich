import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentMethodTable() {
  const TABLE_ROW_LIMIT = 6; // Cố định số hàng tối đa mỗi trang
  const [methods, setMethods] = useState([]);
  const [allMethods, setAllMethods] = useState([]); // Lưu toàn bộ dữ liệu từ API
  const [filters, setFilters] = useState({
    name: '',
    active: '',
    page: 0,
    size: TABLE_ROW_LIMIT,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, method: null });
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', active: false });

  useEffect(() => {
    fetchMethods();
  }, [filters.name, filters.active]); // Chỉ gọi API khi bộ lọc thay đổi

  const fetchMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        name: filters.name || undefined,
        active: filters.active || undefined,
      };
      console.log('Fetching methods with params:', params);
      const res = await axios.get('http://localhost:8080/payment/payment-methods', { params });
      console.log('API response:', res.data);
      
      // Lưu toàn bộ dữ liệu
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setAllMethods(data);
      
      // Tính tổng số trang
      const calculatedTotalPages = Math.ceil(data.length / filters.size) || 1;
      setTotalPages(calculatedTotalPages);
      
      // Lấy dữ liệu cho trang hiện tại
      const start = filters.page * filters.size;
      const paginatedData = data.slice(start, start + filters.size);
      setMethods(paginatedData);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching methods:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    // Cập nhật dữ liệu trang mà không gọi lại API
    const start = newPage * filters.size;
    setMethods(allMethods.slice(start, start + filters.size));
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      active: '',
      page: 0,
      size: TABLE_ROW_LIMIT,
    });
  };

  const refreshData = () => {
    fetchMethods();
  };

  const toggleActiveStatus = async (id, currentActive, name) => {
    const action = currentActive ? 'tắt' : 'kích hoạt';
    const confirmMessage = `Bạn có muốn ${action} phương thức thanh toán này không?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Sending PUT request:', { id, name, active: !currentActive });
      await axios.put(`http://localhost:8080/payment/payment-methods/${id}`, {
        name,
        active: !currentActive,
      });
      setMethods((prevMethods) =>
        prevMethods.map((method) =>
          method.id === id ? { ...method, active: !currentActive } : method
        )
      );
      setAllMethods((prevAll) =>
        prevAll.map((method) =>
          method.id === id ? { ...method, active: !currentActive } : method
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Không thể ${action} phương thức thanh toán.`;
      setError(errorMessage);
      console.error('Error updating status:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (method) => {
    setEditModal({ open: true, method });
    setFormData({ name: method.name, active: method.active });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, method: null });
    setFormData({ name: '', active: false });
    setError(null);
  };

  const openAddModal = () => {
    setAddModal(true);
    setFormData({ name: '', active: false });
  };

  const closeAddModal = () => {
    setAddModal(false);
    setFormData({ name: '', active: false });
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitEdit = async () => {
    if (!formData.name.trim()) {
      setError('Tên phương thức không được để trống.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Sending PUT request:', { id: editModal.method.id, ...formData });
      await axios.put(`http://localhost:8080/payment/payment-methods/${editModal.method.id}`, {
        name: formData.name,
        active: formData.active,
      });
      setMethods((prevMethods) =>
        prevMethods.map((method) =>
          method.id === editModal.method.id
            ? { ...method, name: formData.name, active: formData.active }
            : method
        )
      );
      setAllMethods((prevAll) =>
        prevAll.map((method) =>
          method.id === editModal.method.id
            ? { ...method, name: formData.name, active: formData.active }
            : method
        )
      );
      closeEditModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật phương thức thanh toán.';
      setError(errorMessage);
      console.error('Error updating method:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const submitAdd = async () => {
    if (!formData.name.trim()) {
      setError('Tên phương thức không được để trống.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Sending POST request:', formData);
      const res = await axios.post('http://localhost:8080/payment/payment-methods', {
        name: formData.name,
        active: formData.active,
      });
      if (res.data && res.data.id) {
        setAllMethods((prevAll) => [...prevAll, res.data]);
        const start = filters.page * filters.size;
        setMethods(allMethods.slice(start, start + filters.size).concat(res.data).slice(0, filters.size));
        setTotalPages(Math.ceil((allMethods.length + 1) / filters.size) || 1);
      } else {
        console.warn('Invalid response data, refetching methods');
        await fetchMethods();
      }
      closeAddModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể thêm phương thức thanh toán.';
      setError(errorMessage);
      console.error('Error adding method:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const renderRows = () => {
    const rows = methods.map((m, index) => (
      <tr
        key={m.id}
        className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}
      >
        <td className="py-3 px-4 w-1/5">{m.id}</td>
        <td className="py-3 px-4 w-2/5">{m.name}</td>
        <td className="py-3 px-4 w-1/5 text-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={m.active}
              onChange={() => toggleActiveStatus(m.id, m.active, m.name)}
              className="sr-only"
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                m.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  m.active ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
        </td>
        <td className="py-3 px-4 w-1/5 text-center">
          <button
            onClick={() => openEditModal(m)}
            className="text-blue-500 hover:text-blue-700"
            title="Sửa"
          >
            ✏️
          </button>
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
        </tr>
      )
    );

    return [...rows, ...emptyRows];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Phương thức thanh toán</h2>
        <div className="flex gap-4">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150"
          >
            Thêm phương thức
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[120px]">
          <input
            name="name"
            placeholder="Tên phương thức"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
          />
        </div>
        <select
          name="active"
          value={filters.active}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 min-w-[150px]"
        >
          <option value="">Tất cả</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 min-w-[100px]"
        >
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-1/5">ID</th>
                <th className="py-3 px-4 w-2/5">Tên</th>
                <th className="py-3 px-4 w-1/5 text-center">Kích hoạt</th>
                <th className="py-3 px-4 w-1/5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

      {/* Empty State */}
      {!loading && methods.length === 0 && !error && (
        <div className="text-center italic text-gray-500 text-sm mt-6 bg-gray-50 py-4 rounded-lg">
          Không có dữ liệu
        </div>
      )}

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm phương thức thanh toán</h3>
            {error && (
              <div className="text-red-600 bg-red-50 p-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên phương thức</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                placeholder="Nhập tên phương thức"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150"
              >
                Hủy
              </button>
              <button
                onClick={submitAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Sửa phương thức thanh toán</h3>
            {error && (
              <div className="text-red-600 bg-red-50 p-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên phương thức</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                placeholder="Nhập tên phương thức"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150"
              >
                Hủy
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentMethodTable;