import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllUsers, updateUser } from '../../../api/user.api';
import UserFilters from './UserFilters';
import UserList from './UserList';
import UserDetailsModal from './UserDetailsModal';

const PAGE_SIZE = 5;

function UserTable() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await getAllUsers();
        setAllUsers(usersData);
        setTotalPages(Math.ceil(usersData.length / PAGE_SIZE) || 1);
      } catch (err) {
        toast.error('Failed to load users. Please try again.');
        console.error('Error fetching users:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search term, status, and role
  const filterUsers = useCallback(() => {
    let filteredResults = allUsers;

    if (searchTerm) {
      filteredResults = filteredResults.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filteredResults = filteredResults.filter(
        (user) => user.isActive === (statusFilter === 'ACTIVE')
      );
    }

    if (roleFilter !== 'ALL') {
      filteredResults = filteredResults.filter(
        (user) => user.role?.roleName === roleFilter
      );
    }

    return filteredResults;
  }, [allUsers, searchTerm, statusFilter, roleFilter]);

  // Apply filters and client-side pagination
  useEffect(() => {
    const filteredResults = filterUsers();
    setFilteredUsers(filteredResults);

    // Apply pagination
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const usersForPage = filteredResults.slice(startIndex, endIndex);
    setDisplayedUsers(usersForPage);

    // Update total pages based on filtered data
    const newTotalPages = Math.ceil(filteredResults.length / PAGE_SIZE) || 1;
    setTotalPages(newTotalPages);

    // Reset to last valid page if currentPage is out of bounds
    if (currentPage >= newTotalPages && filteredResults.length > 0) {
      setCurrentPage(newTotalPages - 1);
    }
  }, [currentPage, filterUsers]);

  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setEditMode(false);
  }, []);

  const handleEditClick = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleStatusUpdate = useCallback(
    async (newStatus) => {
      if (!selectedUser) return;

      try {
        const updatedUser = { ...selectedUser, isActive: newStatus === 'ACTIVE' };
        await updateUser(selectedUser.id, updatedUser);
        
        // Update local state
        setAllUsers((prev) =>
          prev.map((user) => (user.id === selectedUser.id ? updatedUser : user))
        );
        
        // Close modal
        setIsModalOpen(false);
        toast.success(`User ${selectedUser.userName} ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`);
      } catch (error) {
        toast.error('Failed to update user status.');
        console.error('Error updating user status:', error);
      }
    },
    [selectedUser]
  );

  const handleSaveChanges = useCallback(
    async (formData) => {
      if (!selectedUser) return;

      try {
        const updatedUser = {
          ...selectedUser,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          role: { ...selectedUser.role, roleName: formData.role },
          gender: formData.gender,
          isActive: formData.isActive === true || formData.isActive === 'true',
          updateAt: new Date().toISOString(),
        };
        
        await updateUser(selectedUser.id, updatedUser);
        
        // Update local state
        setAllUsers((prev) =>
          prev.map((user) => (user.id === selectedUser.id ? updatedUser : user))
        );
        
        // Update selected user and close edit mode
        setSelectedUser(updatedUser);
        setEditMode(false);
        toast.success(`User ${updatedUser.userName} updated successfully.`);
      } catch (error) {
        toast.error('Failed to save changes.');
        console.error('Error saving user changes:', error);
      }
    },
    [selectedUser]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditMode(false);
  }, []);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      <UserList
        users={displayedUsers}
        isLoading={isLoading}
        handleUserClick={handleUserClick}
      />
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length > 0 ? currentPage * PAGE_SIZE + 1 : 0}</span> to{' '}
            <span className="font-medium">
              {Math.min((currentPage + 1) * PAGE_SIZE, filteredUsers.length)}
            </span>{' '}
            of <span className="font-medium">{filteredUsers.length}</span> users
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-0"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-0"
          >
            Next
          </button>
        </div>
      </div>
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedUser={selectedUser}
        editMode={editMode}
        handleEditClick={handleEditClick}
        handleStatusUpdate={handleStatusUpdate}
        handleSaveChanges={handleSaveChanges}
      />
    </div>
  );
}

export default UserTable;