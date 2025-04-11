import React, { useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import BookingTable from "../../components/admin/bookingTable";
import TourTable from "../../components/admin/tourTable";
// import UserTable from '../../components/admin/userTable';

function Dashboard() {
  const [activeTab, setActiveTab] = useState("booking");

  const renderTable = () => {
    switch (activeTab) {
      // case 'booking':
      //   return <BookingTable />;
      case "tour":
        return <TourTable />;
      // case 'user':
      //   return <UserTable />;
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
        <div>
          <div
            className="top-0 left-0 z-40 w-64 h-screen pt-8 bg-gray-800 border-r border-gray-800 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidebar"
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800 dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                <li>
                  <dvi className="text-white font-bold text-xl">
                    <span className="flex-1 ms-3 whitespace-nowrap text-left">
                      Dashboard
                    </span>
                  </dvi>
                </li>
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 rounded-lg group ${
                      activeTab === "booking"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("booking")}
                  >
                    <span className="flex-1 ms-3 whitespace-nowrap text-left">
                      Booking
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 rounded-lg group ${
                      activeTab === "tour"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("tour")}
                  >
                    <span className="flex-1 ms-3 whitespace-nowrap text-left">
                      Tour
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 rounded-lg group ${
                      activeTab === "user"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "text-gray-300 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("user")}
                  >
                    <span className="ms-3 text-left">User</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container p-4 overflow-auto">{renderTable()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
