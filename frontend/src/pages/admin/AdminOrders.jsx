import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get('/admin/orders/');
    if (res.success && res.data) {
      const list = res.data.results || res.data;
      setOrders(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const filtered = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-receipt-cutoff text-danger me-2"></i>
            Platform Orders Feed
          </h1>
          <p className="text-muted mb-0">City-wide healthy food deliveries and kitchen fulfillment operations.</p>
        </div>
        <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
        </button>
      </div>

      <div className="d-flex gap-2 overflow-auto pb-3 mb-3">
        {['all', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
          <button
            key={st}
            className={`btn btn-sm rounded-pill px-3 text-capitalize ${filterStatus === st ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2">Loading platform orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3.5rem' }}></i>
          <h4 className="fw-bold mt-3">No Orders Found</h4>
          <p className="text-muted">No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Order #</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Restaurant</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Placed At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td className="ps-4 fw-bold">#{o.order_number || o.id}</td>
                    <td>{o.user?.username || o.user_name || 'Customer'}</td>
                    <td>{o.restaurant?.name || 'Partner Kitchen'}</td>
                    <td className="fw-bold text-success">₹{o.total_amount}</td>
                    <td>
                      <span className={`badge ${
                        o.status?.toLowerCase() === 'delivered' ? 'bg-success' :
                        o.status?.toLowerCase() === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-end pe-4 text-muted small">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
