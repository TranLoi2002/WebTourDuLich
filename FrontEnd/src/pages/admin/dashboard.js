import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import BookingTable from '../../components/admin/bookingTable';
import TourTable from '../../components/admin/tourTable';
import UserTable from '../../components/admin/userTable';
import SettingModal from '../../components/admin/settingModal';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('booking');
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const renderTable = () => {
    switch (activeTab) {
      case 'tour':
        return <TourTable />;
      case 'user':
        return <UserTable />;
      default:
        return <BookingTable />;
    }
  };



  return (
    <div className="h-fit flex-column">
      <div className="z-10">
        <AdminNavbar />
      </div>

      <div className="fixed flex w-full h-full">
        {/* Sidebar */}
        <div>
          <div
            className="top-0 left-0 z-40 w-64 h-screen pt-8 border-r sm:translate-x-0 bg-gray-800 border-gray-700"
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
                    <span className="flex-1 ms-3 whitespace-nowrap text-left">Tour</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 rounded-lg group ${
                      activeTab === 'user'
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('user')}
                  >
                    <span className="ms-3 text-left">User</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 rounded-lg group text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => setIsSettingOpen(true)}
                  >
                    <span className="ms-3 text-left">Setting</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container p-4 overflow-auto">
          {renderTable()}
        </div>
      </div>

      {/* Setting Modal */}
      {isSettingOpen && <SettingModal onClose={() => setIsSettingOpen(false)} />}

    </div>
  );
}

export default Dashboard;
