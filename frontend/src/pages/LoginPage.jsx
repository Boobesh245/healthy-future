import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success && result.user) {
      if (result.user.role === 'admin' || result.user.is_staff) {
        navigate('/admin');
      } else if (result.user.role === 'hotel_owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    }
  };

  const handleAutofill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-shield-lock-fill fs-2"></i>
              </div>
              <h2 className="h4 fw-bold">Sign In to Healthy Future</h2>
              <p className="text-muted small">Access your nutritious orders, calorie logs and dashboard</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username or Email</label>
                <input
                  type="text"
                  className="form-control form-control-lg fs-6"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-semibold">Password</label>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg fs-6"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold mb-3 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Autofill helper */}
            <div className="mt-4 pt-3 border-top">
              <div className="text-muted small fw-bold text-uppercase mb-2 text-center">
                Quick Demo Logins (Click to Autofill):
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm rounded-pill"
                  onClick={() => handleAutofill('boobesh', 'User@12345')}
                >
                  <i className="bi bi-person-fill me-1"></i> Customer
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill"
                  onClick={() => handleAutofill('healthyowner', 'Owner@12345')}
                >
                  <i className="bi bi-shop me-1"></i> Hotel Owner
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm rounded-pill"
                  onClick={() => handleAutofill('admin', 'admin@123')}
                >
                  <i className="bi bi-shield-check me-1"></i> Super Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="text-success fw-bold text-decoration-none small">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
