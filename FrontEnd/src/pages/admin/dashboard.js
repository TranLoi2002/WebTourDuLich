import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import AdminSidebar from '../../components/admin/adminSidebar';

import BookingTable from '../../components/admin/bookingTable';
function Dashboard() {

  return (
    <div className='h-fit flex-column '>
      <div>
        <AdminNavbar />
      </div>
      <div className='fixed flex w-full h-full'>
        <div>
          <AdminSidebar />
        </div>
        <div className='container '>
          <BookingTable/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;