import React from 'react';

const PaymentStatus = ({ booking }) => {
  if (booking.paymentDueTimeRelevant) {
    return (
      <>
        <div className="font-medium text-amber-600">
          {booking.paymentDueTime ? new Date(booking.paymentDueTime).toLocaleString() : 'N/A'}
        </div>
        <div className="text-xs text-amber-500">Before this time</div>
      </>
    );
  }
  return booking.bookingStatus === 'CANCELLED' ? (
    <span className="text-red-500">Payment canceled</span>
  ) : (
    <span className="text-green-500">Payment completed</span>
  );
};

export default PaymentStatus;