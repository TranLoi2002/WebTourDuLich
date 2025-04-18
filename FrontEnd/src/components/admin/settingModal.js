import React, { useState, useEffect } from 'react';

const SettingModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    theme: 'light',
    language: 'vi',
    notifications: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedSettings = JSON.parse(localStorage.getItem('settings')) || {};
      setFormData({
        theme: storedSettings.theme || 'light',
        language: storedSettings.language || 'vi',
        notifications: storedSettings.notifications !== undefined ? storedSettings.notifications : true,
      });
    } catch (err) {
      setError('Không thể tải cài đặt');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        'settings',
        JSON.stringify({
          theme: formData.theme,
          language: formData.language,
          notifications: formData.notifications,
        })
      );
      onClose();
    } catch (err) {
      setError('Không thể lưu cài đặt');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[60vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Cài đặt</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Giao diện */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giao diện</label>
          <select
            name="theme"
            className="w-full mt-1 p-2 border rounded-md"
            value={formData.theme}
            onChange={handleChange}
          >
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </div>

        {/* Ngôn ngữ */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ngôn ngữ</label>
          <select
            name="language"
            className="w-full mt-1 p-2 border rounded-md"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Thông báo */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="notifications"
            className="mr-2"
            checked={formData.notifications}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">Bật thông báo</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SettingModal;