import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RefundTable() {
  const [refunds, setRefunds] = useState([]);
  const [filters, setFilters] = useState({
    paymentId: '',
    status: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    fetchRefunds();
  }, [filters]);

  const fetchRefunds = async () => {
    try {
      const res = await axios.get('http://localhost:8080/payment/refunds', { params: filters });
      setRefunds(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAction = (id, action) => {
    const url = `/admin/refunds/${id}/${action}`;
    axios.post(url, action === 'reject' ? { reason: 'Không hợp lệ' } : {})
      .then(() => setRefunds((prev) => prev.filter(r => r.id !== id)));
  };

  const renderRows = () => {
    const rows = refunds.map((r) => (
      <tr key={r.id} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <td style={{ padding: '12px 16px' }}>{r.id}</td>
        <td style={{ padding: '12px 16px' }}>{r.payment?.id}</td>
        <td style={{ padding: '12px 16px' }}>{r.status}</td>
        <td style={{ padding: '12px 16px' }}>{r.reason}</td>
        <td style={{ padding: '12px 16px' }}>{new Date(r.createdAt).toLocaleString()}</td>
        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
          <button onClick={() => handleAction(r.id, 'approve')} style={{ color: '#16a34a', marginRight: 8, textDecoration: 'underline', cursor: 'pointer' }}>
            Duyệt
          </button>
          <button onClick={() => handleAction(r.id, 'reject')} style={{ color: '#dc2626', textDecoration: 'underline', cursor: 'pointer' }}>
            Từ chối
          </button>
        </td>
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
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Yêu cầu hoàn tiền</h2>

      {/* Bộ lọc tìm kiếm */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          name="paymentId"
          placeholder="Payment ID"
          value={filters.paymentId}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="status"
          placeholder="Trạng thái (e.g. PENDING)"
          value={filters.status}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          onClick={() => setFilters({ paymentId: '', status: '', from: '', to: '' })}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontWeight: '600' }}>
          <tr>
            <th style={{ padding: '12px 16px' }}>ID</th>
            <th style={{ padding: '12px 16px' }}>Payment ID</th>
            <th style={{ padding: '12px 16px' }}>Trạng thái</th>
            <th style={{ padding: '12px 16px' }}>Lý do</th>
            <th style={{ padding: '12px 16px' }}>Ngày</th>
            <th style={{ padding: '12px 16px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>

      {refunds.length === 0 && (
        <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#9ca3af', fontSize: '14px', marginTop: '20px' }}>
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default RefundTable;
