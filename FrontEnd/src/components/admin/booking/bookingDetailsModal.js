import React from 'react';
import StatusBadge from './statusBadge';
import PaymentStatus from './paymentStatus';
import { formatPrice } from './utils';

const BookingDetailsModal = ({ isOpen, onClose, selectedBooking }) => {
  if (!isOpen || !selectedBooking) return null;
  console.log(selectedBooking)
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              Booking Details - Code: {selectedBooking.bookingCode || 'N/A'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Customer Information</h4>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Name:</span> {selectedBooking.user?.fullName || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Email:</span> {selectedBooking.user?.email || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Phone:</span> {selectedBooking.user?.phoneNumber || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Booking Information</h4>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Tour Code:</span> {selectedBooking.tour?.tourCode || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Booking Date:</span>{' '}
                {selectedBooking.bookingDate
                  ? new Date(selectedBooking.bookingDate).toLocaleString()
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Participants:</span>{' '}
                {selectedBooking.participants?.length || 0} people
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Total Price:</span>{' '}
                {formatPrice(selectedBooking.totalPrice)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Payment Information</h4>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Status:</span>
                <StatusBadge status={selectedBooking.bookingStatus} />
              </p>
              <PaymentStatus booking={selectedBooking} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Cancellation Information</h4>
              {selectedBooking.bookingStatus === 'CANCELLED' ? (
                <>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Canceled By:</span>{' '}
                    {selectedBooking.canceledBy || 'System'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Reason:</span>{' '}
                    {selectedBooking.reason || 'Not paid on time'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No cancellation details</p>
              )}
            </div>
          </div>

          {selectedBooking.participants?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900">Participant Details</h4>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Age Type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Gender
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedBooking.participants.map((participant, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {participant.fullName || 'N/A'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {participant.ageType || 'N/A'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {participant.gender || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;