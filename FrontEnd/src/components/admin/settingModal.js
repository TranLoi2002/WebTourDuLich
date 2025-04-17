import React, { useState } from 'react';

const SettingModal = ({ onClose }) => {
  const [username, setUsername] = useState('Admin');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('vi');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    // Xử lý lưu dữ liệu, có thể gửi API ở đây
    console.log({
      username,
      email,
      password,
      theme,
      language,
      notifications,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Cài đặt</h2>

        {/* Thông tin người dùng */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên người dùng</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Đổi mật khẩu */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Giao diện */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giao diện</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </div>

        {/* Ngôn ngữ */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ngôn ngữ</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Thông báo */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
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
          &times;
        </button>
      </div>
    </div>
  );
};

export default SettingModal;
