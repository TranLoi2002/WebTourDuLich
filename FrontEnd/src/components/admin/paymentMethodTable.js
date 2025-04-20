import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentMethodTable() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    axios.get('/admin/payment-methods')
      .then((res) => setMethods(res.data))
      .catch((err) => console.error(err));
  }, []);

  const renderRows = () => {
    const rows = methods.map((m) => (
      <tr key={m.id} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <td style={{ padding: '12px 16px' }}>{m.id}</td>
        <td style={{ padding: '12px 16px' }}>{m.name}</td>
        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
          {m.active ? '✔️' : '❌'}
        </td>
      </tr>
    ));

    const emptyRows = Array.from({ length: Math.max(0, 9 - rows.length) }, (_, i) => (
      <tr key={`empty-${i}`} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#e5e7eb' }}>
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
    backgroundColor: '#f3f4f6',  // Light gray header background
    color: '#4b5563',  // Dark text color for better readability
    fontWeight: '600',
  };

  const noDataStyles = {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#9ca3af',  // Light gray text for empty state
    fontSize: '14px',
    marginTop: '20px',
  };

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', marginTop: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Phương thức thanh toán</h2>
      <table style={tableStyles}>
        <thead>
          <tr style={headerStyles}>
            <th style={{ padding: '12px 16px' }}>ID</th>
            <th style={{ padding: '12px 16px' }}>Tên</th>
            <th style={{ padding: '12px 16px' }}>Kích hoạt</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      {methods.length === 0 && (
        <div style={noDataStyles}>
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default PaymentMethodTable;
