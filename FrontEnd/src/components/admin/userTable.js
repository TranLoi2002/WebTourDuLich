import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/user.api';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [userForm, setUserForm] = useState({
    userName: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'USER',
    isActive: true,
    gender: 'MALE',
  });

  // Load dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();
        console.log(response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = users;

    if (searchTerm) {
      results = results.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      results = results.filter((user) => user.isActive === (statusFilter === 'ACTIVE'));
    }

    if (roleFilter !== 'ALL') {
      results = results.filter((user) => user.role.roleName === roleFilter);
    }

    setFilteredUsers(results);
  }, [searchTerm, statusFilter, roleFilter, users]);

  // Xử lý khi click vào user
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setEditMode(false);
  };

  // Xử lý cập nhật trạng thái user
  const handleStatusUpdate = (newStatus) => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, isActive: newStatus === 'ACTIVE' } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setIsModalOpen(false);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Bật chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditMode(true);
    setUserForm({
      userName: selectedUser.userName,
      email: selectedUser.email,
      fullName: selectedUser.fullName,
      phoneNumber: selectedUser.phoneNumber,
      role: selectedUser.role.roleName,
      isActive: selectedUser.isActive,
      gender: selectedUser.gender,
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = () => {
    const updatedUser = {
      ...selectedUser,
      ...userForm,
      updateAt: new Date().toISOString(),
      role: { ...selectedUser.role, roleName: userForm.role },
      isActive: userForm.isActive === 'true' || userForm.isActive === true,
    };

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? updatedUser : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="p-4">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search
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
              placeholder="Search by username, email or name"
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
            <option value="ALL">ALL STATUS</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">ALL ROLES</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role.roleName === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role.roleName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.updateAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả */}
      {filteredUsers.length === 0 && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing your search or filter criteria</p>
        </div>
      )}

      {/* Modal hiển thị chi tiết/chỉnh sửa user */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {editMode ? 'Edit User' : 'User Details'} - {selectedUser.userName}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                  }}
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
                {editMode ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Account Information</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Username*</label>
                          <input
                            type="text"
                            name="userName"
                            value={userForm.userName}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email*</label>
                          <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role*</label>
                          <select
                            name="role"
                            value={userForm.role}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Personal Information</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name*</label>
                          <input
                            type="text"
                            name="fullName"
                            value={userForm.fullName}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="text"
                            name="phoneNumber"
                            value={userForm.phoneNumber}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gender*</label>
                          <select
                            name="gender"
                            value={userForm.gender}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status*</label>
                          <select
                            name="isActive"
                            value={userForm.isActive}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Account Information</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">ID:</span> {selectedUser.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Username:</span> {selectedUser.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Role:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedUser.role.roleName === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {selectedUser.role.roleName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedUser.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {selectedUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Personal Information</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Full Name:</span> {selectedUser.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Phone:</span>{' '}
                        {selectedUser.phoneNumber || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Gender:</span> {selectedUser.gender}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Created At:</span>{' '}
                        {new Date(selectedUser.createAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Last Updated:</span>{' '}
                        {new Date(selectedUser.updateAt).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                {!editMode ? (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Edit User
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleStatusUpdate('ACTIVE')}
                        disabled={selectedUser.isActive}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                          selectedUser.isActive
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('INACTIVE')}
                        disabled={!selectedUser.isActive}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                          !selectedUser.isActive
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        Deactivate
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-end space-x-2 w-full">
                    <button
                      onClick={() => setEditMode(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;