import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/adminNavbar';
import AdminSidebar from '../../components/adminSidebar';
import Modal from '../../components/modal';

import BookingTable from '../../components/bookingTable';
function Dashboard() {

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <div className='h-fit flex-column '>
      <div>
        <AdminNavbar />
      </div>
      <div className='fixed flex w-full h-full'>
        <div>
          <AdminSidebar />
        </div>
        <div className='container'>
          <BookingTable/>
        </div>
       
        {/* <div className='p-12 w-full h-full items-center'>
          <button 
            onClick={openModal}
            className='bg-blue-950 text-red-50 p-3 hover:bg-red-500 rounded'
          >
            Open modal
          </button>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;