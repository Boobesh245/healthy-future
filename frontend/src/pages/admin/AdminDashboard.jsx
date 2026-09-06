import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    const res = await api.get('/admin/dashboard/');
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <span className="badge bg-danger-subtle text-danger mb-1">Super Admin Console</span>
          <h1 className="h3 fw-bold mb-0">
            <i className="bi bi-shield-check text-success me-2"></i>
            Healthy Future Administration
          </h1>
          <p className="text-muted small mb-0">Platform overview, customer accounts, kitchen approvals & live orders.</p>
        </div>
        <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={fetchAdminStats}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Stats
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Aggregating platform metrics...</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="row g-4 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary">
                <div className="text-muted small fw-bold text-uppercase">Total Customers</div>
                <div className="display-6 fw-bold text-primary my-1">{stats?.customers || 0}</div>
                <div className="small text-muted">Registered diet trackers</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
                <div className="text-muted small fw-bold text-uppercase">Kitchen Partners</div>
                <div className="display-6 fw-bold text-success my-1">{stats?.hotel_owners || 0}</div>
                <div className="small text-muted">{stats?.restaurants || 0} restaurants live</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
                <div className="text-muted small fw-bold text-uppercase">Total Dishes</div>
                <div className="display-6 fw-bold text-warning my-1">{stats?.foods || 0}</div>
                <div className="small text-muted">With verified macros</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-danger">
                <div className="text-muted small fw-bold text-uppercase">Platform Orders</div>
                <div className="display-6 fw-bold text-danger my-1">{stats?.orders || 0}</div>
                <div className="small text-muted">{stats?.pending_orders || 0} currently pending</div>
              </div>
            </div>
          </div>

          {/* Quick Admin Navigation */}
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light text-center">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <h5 className="fw-bold">Manage Users</h5>
                <p className="text-muted small mb-3">View user profiles, phone numbers, addresses and permissions.</p>
                <Link to="/admin/users" className="btn btn-outline-primary rounded-pill fw-bold w-100 mt-auto">
                  View Customers
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light text-center">
                <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-patch-check-fill fs-4"></i>
                </div>
                <h5 className="fw-bold">Kitchen Approvals</h5>
                <p className="text-muted small mb-3">Review new hotel owner applications and approve/reject outlets.</p>
                <Link to="/admin/owners" className="btn btn-outline-success rounded-pill fw-bold w-100 mt-auto">
                  Review Owners
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light text-center">
                <div className="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-shop fs-4"></i>
                </div>
                <h5 className="fw-bold">Restaurants</h5>
                <p className="text-muted small mb-3">Browse all active food outlets, pure veg tags and featured status.</p>
                <Link to="/admin/restaurants" className="btn btn-outline-warning text-dark rounded-pill fw-bold w-100 mt-auto">
                  All Restaurants
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light text-center">
                <div className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-receipt-cutoff fs-4"></i>
                </div>
                <h5 className="fw-bold">All Orders</h5>
                <p className="text-muted small mb-3">Track city-wide deliveries, fulfillment speeds and status logs.</p>
                <Link to="/admin/orders" className="btn btn-outline-danger rounded-pill fw-bold w-100 mt-auto">
                  Monitor Orders
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
