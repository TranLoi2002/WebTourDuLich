import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import BookingTable from '../../components/admin/booking/bookingTable';
import TourTable from '../../components/admin/tour/tourTable';
import UserTable from '../../components/admin/user/userTable';
import SettingModal from '../../components/admin/settingModal';
import AdminSidebar from '../../components/admin/adminSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationTable from '../../components/admin/type_and_location/LocationTable';
import TypeTable from '../../components/admin/type_and_location/TypeTable';
import ActivityTypeTable from '../../components/admin/type_and_location/activityTypeTable';
import Reports from '../../components/admin/reports';
import PaymentPage from '../../components/admin/payments';

function DashBoard() {
  const [activeTab, setActiveTab] = useState('booking');
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTable = () => {
    switch (activeTab) {
      case 'tour':
        return <TourTable />;
      case 'location':
        return <LocationTable/>;
      case 'type':
        return <TypeTable/>;
      case 'activity':
        return <ActivityTypeTable/>;
      case 'user':  
        return <UserTable />;
      case 'reports':
        return <Reports/>;
      case 'payments':
        return <PaymentPage />;
      default:
        return <BookingTable />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <AdminNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSetting={() => setIsSettingOpen(true)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main
          className={`flex-1 p-4 mt-16 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          } overflow-auto`}
        >
          {renderTable()}
        </main>
      </div>
      {isSettingOpen && <SettingModal onClose={() => setIsSettingOpen(false)} />}
    </div>
  );
}

export default DashBoard;