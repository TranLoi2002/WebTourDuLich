import React from 'react';
import StatusBadge from './statusBadge';
import PaymentStatus from './paymentStatus';
import { formatPrice, getValidStatusOptions } from './utils';

const BookingDetailsModal = ({
  isOpen,
  onClose,
  selectedBooking,
  newStatus,
  setNewStatus,
  handleStatusUpdate,
  isUpdating,
  handleStatusChange,
}) => {
  if (!isOpen || !selectedBooking) return null;

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
                    {selectedBooking.canceledBy || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Reason:</span>{' '}
                    {selectedBooking.refundReason || 'Not paid on time'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Refund Amount:</span>{' '}
                    {selectedBooking.refundAmount || 'Not paid on time'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No cancellation details</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Update Status</h4>
              <div className="mt-2">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {getValidStatusOptions(selectedBooking.bookingStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              {newStatus !== 'CANCELLED' && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === selectedBooking.bookingStatus || isUpdating}
                  className={`mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    newStatus === selectedBooking.bookingStatus || isUpdating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isUpdating ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Status'
                  )}
                </button>
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age Type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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