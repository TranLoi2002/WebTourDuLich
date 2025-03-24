import React from 'react'
import AdminNavbar from '../../components/adminNavbar';
import AdminSidebar from '../../components/adminSidebar';
function Dashboard() {
  return (
    <div className='h-fit d-block'>
      <AdminNavbar/>
      <div className='fixed flex'>
        <AdminSidebar/>
        <div>
        <p className='pt-20 items-center justify-center'>Content</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
