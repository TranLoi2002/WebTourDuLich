import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentMethodTable() {
  const [methods, setMethods] = useState([]);
  const [filters, setFilters] = useState({ name: '', active: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, method: null });
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', active: false });

  useEffect(() => {
    fetchMethods();
  }, [filters]);

  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/admin/payment-methods', { params: filters });
      setMethods(res.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ name: '', active: '' });
  };

  const toggleActiveStatus = async (id, currentActive, name) => {
    const action = currentActive ? 'tắt' : 'kích hoạt';
    const confirmMessage = `Bạn có muốn ${action} phương thức thanh toán này không?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`http://localhost:8080/admin/payment-methods/${id}`, {
        name,
        active: !currentActive,
      });
      setMethods((prevMethods) =>
        prevMethods.map((method) =>
          method.id === id ? { ...method, active: !currentActive } : method
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Đã xảy ra lỗi khi cập nhật trạng thái.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (method) => {
    setEditModal({ open: true, method });
    setFormData({ name: method.name, active: method.active });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, method: null });
    setFormData({ name: '', active: false });
  };

  const openAddModal = () => {
    setAddModal(true);
    setFormData({ name: '', active: false });
  };

  const closeAddModal = () => {
    setAddModal(false);
    setFormData({ name: '', active: false });
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
      alert('Tên phương thức không được để trống.');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`http://localhost:8080/admin/payment-methods/${editModal.method.id}`, {
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
      closeEditModal();
    } catch (err) {
      console.error('Error updating method:', err);
      alert('Đã xảy ra lỗi khi cập nhật phương thức thanh toán.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAdd = async () => {
    if (!formData.name.trim()) {
      alert('Tên phương thức không được để trống.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:8080/admin/payment-methods', {
        name: formData.name,
        active: formData.active,
      });
      console.log('POST response:', res.data); // Debug the response
      if (res.data && res.data.id) {
        setMethods((prevMethods) => [...prevMethods, res.data]);
      } else {
        console.warn('Invalid response data, refetching methods');
        await fetchMethods(); // Fallback to fetch all methods
      }
      closeAddModal();
    } catch (err) {
      console.error('Error adding method:', err);
      alert('Đã xảy ra lỗi khi thêm phương thức thanh toán.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRows = () => {
    const rows = methods.map((m, index) => (
      <tr
        key={m.id}
        className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}
      >
        <td className="py-3 px-4">{m.id}</td>
        <td className="py-3 px-4">{m.name}</td>
        <td
          className="py-3 px-4 text-center cursor-pointer"
          onClick={() => toggleActiveStatus(m.id, m.active, m.name)}
        >
          {m.active ? '✔️' : '❌'}
        </td>
        <td className="py-3 px-4 text-center">
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

    const emptyRows = Array.from({ length: Math.max(0, 8 - rows.length) }, (_, i) => (
      <tr key={`empty-${i}`} className="border-t border-gray-200 bg-gray-100">
        <td className="py-3 px-4 text-gray-400">--</td>
        <td className="py-3 px-4 text-gray-400">--</td>
        <td className="py-3 px-4 text-gray-400">--</td>
        <td className="py-3 px-4 text-gray-400">--</td>
      </tr>
    ));

    return [...rows, ...emptyRows];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Phương thức thanh toán</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Thêm phương thức
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <input
            name="name"
            placeholder="Tên phương thức"
            value={filters.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <select
          name="active"
          value={filters.active}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-w-[150px]"
        >
          <option value="">Tất cả</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
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

      {/* Empty State */}
      {!isLoading && methods.length === 0 && (
        <div className="text-center italic text-gray-500 text-sm mt-6">
          Không có dữ liệu
        </div>
      )}

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm phương thức thanh toán</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên phương thức</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={submitAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên phương thức</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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