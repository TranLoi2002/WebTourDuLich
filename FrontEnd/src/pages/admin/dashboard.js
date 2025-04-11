import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import BookingTable from '../../components/admin/bookingTable';
import TourTable from '../../components/admin/tourTable';
import UserTable from '../../components/admin/userTable';
import SettingModal from '../../components/admin/settingModal';
import AdminSidebar from '../../components/admin/adminSidebar';

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
        {/* Navbar */}
        <AdminNavbar />
      </div>

      <div className="fixed flex w-full h-full">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSetting={() => setIsSettingOpen(true)}
        />

        {/* Nội dung */}
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
