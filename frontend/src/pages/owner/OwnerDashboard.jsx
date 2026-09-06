import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    const res = await api.get('/owner/dashboard/');
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-1">Kitchen Partner Console</span>
          <h1 className="h3 fw-bold mb-0">
            <i className="bi bi-speedometer2 text-success me-2"></i>
            {stats?.restaurant_name || 'Owner Dashboard'}
          </h1>
          <p className="text-muted small mb-0">Manage healthy menu items, live customer orders & kitchen profile.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/owner/foods" className="btn btn-success btn-sm rounded-pill px-3">
            <i className="bi bi-plus-circle me-1"></i> Manage Menu
          </Link>
          <Link to="/owner/orders" className="btn btn-outline-success btn-sm rounded-pill px-3">
            <i className="bi bi-bag-check me-1"></i> View Orders
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </div>
          <p className="text-muted mt-2">Gathering kitchen performance metrics...</p>
        </div>
      ) : (
        <>
          {/* Status Alert */}
          {stats && !stats.is_approved && (
            <div className="alert alert-warning border-0 rounded-4 shadow-sm mb-4 d-flex align-items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill fs-3 text-warning"></i>
              <div>
                <strong>Pending Admin Approval:</strong> Your restaurant profile is currently under review by the Healthy Future dietetics verification team. You can continue updating your dishes and macros in the meantime.
              </div>
            </div>
          )}

          {/* Metrics Row */}
          <div className="row g-4 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary">
                <div className="text-muted small fw-bold text-uppercase">Total Orders</div>
                <div className="display-6 fw-bold text-primary my-1">{stats?.total_orders || 0}</div>
                <div className="small text-muted">All-time customer requests</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
                <div className="text-muted small fw-bold text-uppercase">Pending Orders</div>
                <div className="display-6 fw-bold text-warning my-1">{stats?.pending_orders || 0}</div>
                <div className="small text-muted">Requires kitchen attention</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
                <div className="text-muted small fw-bold text-uppercase">Fulfilled / Delivered</div>
                <div className="display-6 fw-bold text-success my-1">{stats?.completed_orders || 0}</div>
                <div className="small text-muted">Successfully delivered</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-info">
                <div className="text-muted small fw-bold text-uppercase">Active Dishes</div>
                <div className="display-6 fw-bold text-info my-1">{stats?.total_dishes || 0}</div>
                <div className="small text-muted">With certified macros</div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Navigation Cards */}
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success text-white rounded-3 p-3 fs-4">
                    <i className="bi bi-egg-fried"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Dishes & Macros</h5>
                    <span className="text-muted small">{stats?.total_dishes || 0} menu items</span>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Add new healthy recipes, adjust calorie & protein counts, or toggle availability.
                </p>
                <Link to="/owner/foods" className="btn btn-success rounded-pill fw-bold w-100 mt-auto">
                  Open Dishes Studio <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary text-white rounded-3 p-3 fs-4">
                    <i className="bi bi-card-checklist"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Live Kitchen Orders</h5>
                    <span className="text-muted small">{stats?.pending_orders || 0} awaiting prep</span>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Accept incoming orders, update live preparation status, or dispatch to delivery riders.
                </p>
                <Link to="/owner/orders" className="btn btn-primary rounded-pill fw-bold w-100 mt-auto">
                  Manage Live Orders <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-secondary text-white rounded-3 p-3 fs-4">
                    <i className="bi bi-gear-fill"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Kitchen Profile</h5>
                    <span className="text-muted small">Hours, Banner & Address</span>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Update kitchen timings, address, delivery radius, pure veg certification, and photos.
                </p>
                <Link to="/owner/restaurant" className="btn btn-outline-dark rounded-pill fw-bold w-100 mt-auto">
                  Edit Profile <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
