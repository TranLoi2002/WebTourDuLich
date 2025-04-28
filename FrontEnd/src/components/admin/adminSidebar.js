import React from 'react';
import {
  BookOpenIcon,
  MapIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

function AdminSidebar({ activeTab, setActiveTab, openSetting, isSidebarOpen, setIsSidebarOpen }) {
  const handleOverlayClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-8 bg-gray-800 border-r border-gray-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <div className="text-white font-bold text-xl mb-4">
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Dashboard</span>
              </div>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'booking'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('booking');
                  if (window.innerWidth < 640) setIsSidebarOpen(false); // Close on mobile
                }}
              >
                <BookOpenIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Booking</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'tour'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('tour');
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <MapIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Tour</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'user'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('user');
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <UsersIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">User</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('reports');
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <ChartBarIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Reports</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'payments'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('payments');
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <CurrencyDollarIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Payments</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => {
                  openSetting();
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="flex-1 ml-3 whitespace-nowrap text-left">Setting</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for closing sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AdminSidebar;