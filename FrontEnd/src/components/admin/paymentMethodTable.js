import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentMethodTable() {
  const [methods, setMethods] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    active: '' // true | false | ''
  });

  useEffect(() => {
    fetchMethods();
  }, [filters]);

  const fetchMethods = async () => {
    try {
      const res = await axios.get('/admin/payment-methods', { params: filters });
      setMethods(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ name: '', active: '' });
  };

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

    const emptyRows = Array.from({ length: Math.max(0, 8 - rows.length) }, (_, i) => (
      <tr key={`empty-${i}`} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#e5e7eb' }}>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>--</td>
      </tr>
    ));

    return [...rows, ...emptyRows];
  };

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', marginTop: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Phương thức thanh toán</h2>

      {/* Bộ lọc */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          name="name"
          placeholder="Tên phương thức"
          value={filters.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="active"
          value={filters.active}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Tất cả</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontWeight: '600' }}>
          <tr>
            <th style={{ padding: '12px 16px' }}>ID</th>
            <th style={{ padding: '12px 16px' }}>Tên</th>
            <th style={{ padding: '12px 16px' }}>Kích hoạt</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>

      {methods.length === 0 && (
        <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#9ca3af', fontSize: '14px', marginTop: '20px' }}>
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default PaymentMethodTable;