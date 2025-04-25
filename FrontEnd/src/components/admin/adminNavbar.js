import React, { useState, useEffect } from 'react';
import { verifyUser, logout } from '../../api/auth.api';
import SettingModal from './settingModal';

const AdminNavbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
        } else {
          const response = await verifyUser();
          setUser(response);
          localStorage.setItem('user', JSON.stringify(response));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSettingModal = () => {
    setIsSettingOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      window.location.href = '/auth/sign_in';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-gray-800 border-b border-gray-700">
      <div className="px-4 py-3 lg:px-6 lg:pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-300 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
            <span className="text-xl font-semibold text-white sm:text-2xl whitespace-nowrap">
              Booking.com
            </span>
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600"
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user photo"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user?.userName || 'Guest'}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                    {user?.email || 'example@gmail.com'}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      onClick={openSettingModal}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Setting
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {isSettingOpen && <SettingModal onClose={() => setIsSettingOpen(false)} />}
    </nav>
  );
};


export default AdminNavbar;