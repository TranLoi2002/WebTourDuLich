import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import BookingTable from '../../components/admin/bookingTable';
import TourTable from '../../components/admin/tourTable';
import UserTable from '../../components/admin/userTable';
import SettingModal from '../../components/admin/settingModal';
import AdminSidebar from '../../components/admin/adminSidebar';
import PaymentsPage from '../../components/admin/payments';
import Reports from '../../components/admin/reports';


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
        return <Reports />;
      case 'payments':
        return <PaymentsPage/>;
        return <BookingTable />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
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