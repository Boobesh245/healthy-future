import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get('/owner/orders/');
    if (res.success && res.data) {
      const list = res.data.results || res.data;
      setOrders(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await api.patch(`/owner/orders/${orderId}/status/`, { status: newStatus });
    if (res.success) {
      showToast(`Order status updated to "${newStatus}"`, 'success');
      fetchOrders();
    } else {
      showToast(res.message || 'Status update failed', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-card-checklist text-primary me-2"></i>
            Kitchen Order Manager
          </h1>
          <p className="text-muted mb-0">Live customer requests, prep queue and rider dispatch statuses.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Queue
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="d-flex gap-2 overflow-auto pb-3 mb-3">
        {['all', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
          <button
            key={st}
            className={`btn btn-sm rounded-pill px-3 text-capitalize ${filterStatus === st ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="text-muted mt-2">Connecting to kitchen order queue...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3.5rem' }}></i>
          <h4 className="fw-bold mt-3">No Orders in this Queue</h4>
          <p className="text-muted">No orders match the selected filter category.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredOrders.map(order => (
            <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-light py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold fs-6">Order #{order.order_number || order.id}</span>
                  <span className="badge bg-white text-dark border">
                    Customer: {order.user?.username || order.user_name || 'Guest'}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-telephone me-1"></i>
                    {order.contact_phone || 'N/A'}
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted fw-semibold">Status:</span>
                  <select
                    className="form-select form-select-sm fw-bold rounded-pill"
                    style={{ minWidth: '160px' }}
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-12 col-md-7">
                    <div className="small fw-bold text-muted text-uppercase mb-2">Dishes to Prepare</div>
                    <div className="d-flex flex-column gap-2">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary-subtle text-primary">{item.quantity}x</span>
                            <span className="fw-semibold">{item.food_name || item.food?.name}</span>
                          </div>
                          <span className="text-muted">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-top d-flex justify-content-between small">
                      <span className="fw-bold">Total Bill:</span>
                      <span className="fw-bold text-success fs-6">₹{order.total_amount}</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-5">
                    <div className="small fw-bold text-muted text-uppercase mb-2">Dispatch Destination</div>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {order.delivery_address}
                    </p>
                    {order.delivery_notes && (
                      <div className="small p-2 bg-light rounded text-muted">
                        <strong>Kitchen Note:</strong> {order.delivery_notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;
