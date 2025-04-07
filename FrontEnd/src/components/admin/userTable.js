import React, { useState, useEffect } from 'react';

function UserTable() {
  // Tạo dữ liệu người dùng mẫu
  const mockUsers = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      fullName: "John Doe",
      phone: "0123456789",
      role: "USER",
      status: "ACTIVE",
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2023-05-10T14:20:00Z",
      lastLogin: "2023-05-18T09:15:00Z"
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      fullName: "Jane Smith",
      phone: "0987654321",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2023-02-20T11:45:00Z",
      updatedAt: "2023-05-15T16:30:00Z",
      lastLogin: "2023-05-19T08:45:00Z"
    },
    {
      id: 3,
      username: "bob_johnson",
      email: "bob@example.com",
      fullName: "Bob Johnson",
      phone: "0369852147",
      role: "USER",
      status: "INACTIVE",
      createdAt: "2023-03-05T09:15:00Z",
      updatedAt: "2023-05-12T10:20:00Z",
      lastLogin: "2023-04-28T13:10:00Z"
    },
    {
      id: 4,
      username: "alice_williams",
      email: "alice@example.com",
      fullName: "Alice Williams",
      phone: "0547896321",
      role: "USER",
      status: "ACTIVE",
      createdAt: "2023-03-18T14:00:00Z",
      updatedAt: "2023-05-17T11:45:00Z",
      lastLogin: "2023-05-20T10:30:00Z"
    },
    {
      id: 5,
      username: "charlie_brown",
      email: "charlie@example.com",
      fullName: "Charlie Brown",
      phone: "0789456123",
      role: "USER",
      status: "ACTIVE",
      createdAt: "2023-04-10T08:20:00Z",
      updatedAt: "2023-05-14T15:10:00Z",
      lastLogin: "2023-05-19T16:45:00Z"
    }
  ];

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // State cho form thêm/chỉnh sửa user
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'USER',
    status: 'ACTIVE'
  });

  // Load dữ liệu mẫu khi component mount
  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let results = users;

    if (searchTerm) {
      results = results.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm))
    }

    if (statusFilter !== 'ALL') {
      results = results.filter(user => user.status === statusFilter);
    }

    if (roleFilter !== 'ALL') {
      results = results.filter(user => user.role === roleFilter);
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
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setIsModalOpen(false);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Bật chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditMode(true);
    setUserForm({
      username: selectedUser.username,
      email: selectedUser.email,
      fullName: selectedUser.fullName,
      phone: selectedUser.phone,
      role: selectedUser.role,
      status: selectedUser.status
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = () => {
    const updatedUser = {
      ...selectedUser,
      ...userForm,
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = users.map(user => 
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
              placeholder="Search by username, email or name"
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
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* Bộ lọc vai trò */}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị khi không có kết quả*/}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  {editMode ? 'Edit User' : 'User Details'} - {selectedUser.username}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                            name="username"
                            value={userForm.username}
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
                            name="phone"
                            value={userForm.phone}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status*</label>
                          <select
                            name="status"
                            value={userForm.status}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
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
                        <span className="font-medium">Username:</span> {selectedUser.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Role:</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {selectedUser.role}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {selectedUser.status}
                        </span>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Personal Information</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Full Name:</span> {selectedUser.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Phone:</span> {selectedUser.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Created At:</span> {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Last Updated:</span> {new Date(selectedUser.updatedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Last Login:</span> {new Date(selectedUser.lastLogin).toLocaleString()}
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
                        disabled={selectedUser.status === 'ACTIVE'}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${selectedUser.status === 'ACTIVE' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('INACTIVE')}
                        disabled={selectedUser.status === 'INACTIVE'}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          ${selectedUser.status === 'INACTIVE' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
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