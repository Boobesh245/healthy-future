import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get('/orders/');
    if (res.success && res.data) {
      const list = res.data.results || res.data;
      setOrders(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    const res = await api.post(`/orders/${orderId}/cancel/`);
    if (res.success) {
      showToast('Order cancelled successfully', 'info');
      fetchOrders();
    } else {
      showToast(res.message || 'Could not cancel order', 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-clock-history text-success" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">Track Your Meal Orders</h3>
          <p className="text-muted">Sign in to view your ongoing meal deliveries and past order history.</p>
          <Link to="/login" className="btn btn-success btn-lg rounded-pill mt-2">Sign In</Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-success text-white';
      case 'out_for_delivery':
      case 'out for delivery':
        return 'bg-info text-dark';
      case 'preparing':
        return 'bg-primary text-white';
      case 'confirmed':
        return 'bg-warning text-dark';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-receipt text-success me-2"></i>
            Your Meal Order History
          </h1>
          <p className="text-muted mb-0">Track live orders and view previous healthy deliveries.</p>
        </div>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="text-muted mt-2">Fetching your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-journal-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold mt-3">No Orders Yet</h4>
          <p className="text-muted mb-4">You haven't ordered any delicious healthy meals yet!</p>
          <Link to="/restaurants" className="btn btn-success btn-lg rounded-pill px-4">
            Start Your Healthy Diet Now
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map(order => (
            <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {/* Order Header */}
              <div className="card-header bg-light py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold fs-6">Order #{order.order_number || order.id}</span>
                  <span className={`badge rounded-pill px-3 py-2 text-capitalize ${getStatusBadgeClass(order.status)}`}>
                    <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                    {order.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-muted small">
                  <i className="bi bi-calendar3 me-1"></i>
                  {new Date(order.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Order Body */}
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Items List */}
                  <div className="col-12 col-md-7 border-end-md">
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">Items Ordered</h6>
                    <div className="d-flex flex-column gap-2">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success-subtle text-success">{item.quantity}x</span>
                            <span className="fw-semibold text-dark">{item.food_name || item.food?.name || 'Healthy Dish'}</span>
                          </div>
                          <span className="text-muted">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-top d-flex justify-content-between">
                      <span className="fw-bold">Total Bill Paid:</span>
                      <span className="fw-bold text-success fs-5">₹{order.total_amount}</span>
                    </div>
                  </div>

                  {/* Delivery Info & Actions */}
                  <div className="col-12 col-md-5 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold text-muted text-uppercase small mb-2">Delivery Address</h6>
                      <p className="text-muted small mb-3">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {order.delivery_address}
                      </p>

                      <div className="small text-muted mb-2">
                        <strong>Payment:</strong>{' '}
                        <span className="badge bg-light text-dark border text-uppercase">
                          {order.payment_method || 'COD'}
                        </span>
                      </div>

                      {order.delivery_notes && (
                        <div className="small text-muted fst-italic">
                          " {order.delivery_notes} "
                        </div>
                      )}
                    </div>

                    {/* Cancel action if order is still fresh */}
                    {['pending', 'confirmed'].includes(order.status?.toLowerCase()) && (
                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <i className="bi bi-x-circle me-1"></i> Cancel Order
                        </button>
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

export default OrdersPage;
