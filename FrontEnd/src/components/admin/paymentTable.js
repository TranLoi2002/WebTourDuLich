import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentTable() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('/admin/payments')
      .then((res) => setPayments(res.data.content))
      .catch((err) => console.error(err));
  }, []);

  const renderRows = () => {
    const rows = payments.map((p) => (
      <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <td style={{ padding: '12px 16px' }}>{p.id}</td>
        <td style={{ padding: '12px 16px' }}>{p.userId}</td>
        <td style={{ padding: '12px 16px' }}>{p.amount} VND</td>
        <td style={{ padding: '12px 16px' }}>{p.status}</td>
        <td style={{ padding: '12px 16px' }}>{p.paymentMethod?.name}</td>
        <td style={{ padding: '12px 16px' }}>{new Date(p.createdAt).toLocaleString()}</td>
      </tr>
    ));

    const emptyRows = Array.from({ length: Math.max(0, 9 - rows.length) }, (_, i) => (
      <tr key={`empty-${i}`} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#e5e7eb' }}>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
      </tr>
    ));

    return [...rows, ...emptyRows];
  };

  const tableStyles = {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    textAlign: 'left',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const headerStyles = {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontWeight: '600',
  };

  const noDataStyles = {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#9ca3af',
    fontSize: '14px',
    marginTop: '20px',
  };

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', marginTop: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Danh sách thanh toán</h2>
      <table style={tableStyles}>
        <thead>
          <tr style={headerStyles}>
            <th style={{ padding: '12px 16px' }}>ID</th>
            <th style={{ padding: '12px 16px' }}>User</th>
            <th style={{ padding: '12px 16px' }}>Amount</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px' }}>Method</th>
            <th style={{ padding: '12px 16px' }}>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      {payments.length === 0 && (
        <div style={noDataStyles}>
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default PaymentTable;
