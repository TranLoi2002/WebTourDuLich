import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import BookingTable from '../../components/admin/bookingTable';
import TourTable from '../../components/admin/tourTable';
import UserTable from '../../components/admin/userTable';
import SettingModal from '../../components/admin/settingModal';
import AdminSidebar from '../../components/admin/adminSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('booking');
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTable = () => {
    switch (activeTab) {
      case 'tour':
        return <TourTable />;
      case 'user':
        return <UserTable />;
      case 'reports':
        return <div className="p-4">Reports Content (Placeholder)</div>;
      case 'payments':
        return <div className="p-4">Payments Content (Placeholder)</div>;
      default:
        return <BookingTable />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Navbar */}
      <AdminNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSetting={() => setIsSettingOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:ml-64 mt-16 overflow-auto">
          {renderTable()}
        </main>
      </div>

      {/* Setting Modal */}
      {isSettingOpen && <SettingModal onClose={() => setIsSettingOpen(false)} />}
    </div>
  );
}

export default Dashboard;