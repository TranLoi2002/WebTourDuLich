import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    status: '',
    paymentMethodId: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/admin/payments', { params: filters });
      setPayments(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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

    const emptyRows = Array.from({ length: Math.max(0, 8 - rows.length) }, (_, i) => (
      <tr key={`empty-${i}`} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#e5e7eb' }}>
        <td colSpan={6} style={{ padding: '12px 16px', color: '#9ca3af', textAlign: 'center' }}>--</td>
      </tr>
    ));

    return [...rows, ...emptyRows];
  };

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', marginTop: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Danh sách thanh toán</h2>

      {/* Bộ lọc */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input name="userId" placeholder="User ID" value={filters.userId} onChange={handleChange} className="border p-2 rounded" />
        <input name="status" placeholder="Status (e.g. SUCCESS)" value={filters.status} onChange={handleChange} className="border p-2 rounded" />
        <input name="paymentMethodId" placeholder="Method ID" value={filters.paymentMethodId} onChange={handleChange} className="border p-2 rounded" />
        <input name="from" type="date" value={filters.from} onChange={handleChange} className="border p-2 rounded" />
        <input name="to" type="date" value={filters.to} onChange={handleChange} className="border p-2 rounded" />
        <button onClick={() => setFilters({ userId: '', status: '', paymentMethodId: '', from: '', to: '' })} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
      </div>

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontWeight: '600' }}>
          <tr>
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
        <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#9ca3af', fontSize: '14px', marginTop: '20px' }}>
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default PaymentTable;