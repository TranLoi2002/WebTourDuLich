import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>
      {status || 'N/A'}
    </span>
  );
};

export default StatusBadge;