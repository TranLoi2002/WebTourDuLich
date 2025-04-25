import React from 'react';
import { CANCEL_REASONS } from './constants';

const CancelBookingModal = ({
  isOpen,
  onClose,
  selectedBooking,
  cancelReason,
  setCancelReason,
  handleCancelBooking,
  isCanceling,
}) => {
  if (!isOpen || !selectedBooking) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              Cancel Booking - Code: {selectedBooking.bookingCode || 'N/A'}
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

          <div className="mt-4">
            <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">
              Reason for Cancellation
            </label>
            <select
              id="cancelReason"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              {CANCEL_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  handleCancelBooking();
                }
              }}
              disabled={isCanceling}
              className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isCanceling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isCanceling ? (
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
                  Canceling...
                </span>
              ) : (
                'Confirm Cancellation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;