import React, { useState } from 'react';
import PaymentTable from './paymentTable';
import RefundTable from './refundTable';
import PaymentMethodTable from './paymentMethodTable';

function PaymentsPage() {
  const [tab, setTab] = useState('payment');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab('payment')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${
            tab === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Thanh toán
        </button>
        <button
          onClick={() => setTab('refund')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${
            tab === 'refund' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Hoàn tiền
        </button>
        <button
          onClick={() => setTab('method')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${
            tab === 'method' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Phương thức thanh toán
        </button>
      </div>

      <div className="mt-4">
        {tab === 'payment' && <PaymentTable />}
        {tab === 'refund' && <RefundTable />}
        {tab === 'method' && <PaymentMethodTable />}
      </div>
    </div>
  );
}

export default PaymentsPage;