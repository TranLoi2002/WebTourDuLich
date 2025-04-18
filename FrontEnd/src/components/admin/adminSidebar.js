import React from 'react';
import {
  BookOpenIcon,
  MapIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

function AdminSidebar({ activeTab, setActiveTab, openSetting, isSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-8 border-r bg-gray-800 border-gray-700 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 transition-transform duration-300`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <div className="text-white font-bold text-xl mb-4">
              <span className="flex-1 ms-3 whitespace-nowrap text-left">Dashboard</span>
            </div>
          </li>

          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 rounded-lg group ${
                activeTab === 'booking'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('booking')}
            >
              <BookOpenIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap text-left">Booking</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 rounded-lg group ${
                activeTab === 'tour'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('tour')}
            >
              <MapIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap text-left">Tour</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`flex itemsCENTER w-full p-2 rounded-lg group ${
                activeTab === 'user'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('user')}
            >
              <UsersIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3 text-left">User</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 rounded-lg group ${
                activeTab === 'reports'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              <ChartBarIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3 text-left">Reports</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 rounded-lg group ${
                activeTab === 'payments'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('payments')}
            >
              <CurrencyDollarIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3 text-left">Payments</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className="flex items-center w-full p-2 rounded-lg group text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={openSetting}
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3 text-left">Setting</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;