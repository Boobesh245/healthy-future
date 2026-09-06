import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: 'Coimbatore',
    restaurant_name: '',
    cuisine: '',
    is_pure_veg: false
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      role
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (role === 'hotel_owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-person-plus-fill fs-2"></i>
              </div>
              <h2 className="h4 fw-bold">Create an Account</h2>
              <p className="text-muted small">Join Healthy Future for nutrition-first dining</p>
            </div>

            {/* Role Switcher */}
            <div className="d-flex bg-light p-1 rounded-pill mb-4">
              <button
                type="button"
                className={`btn btn-sm flex-fill rounded-pill fw-bold ${role === 'customer' ? 'btn-success text-white shadow-sm' : 'text-muted'}`}
                onClick={() => setRole('customer')}
              >
                <i className="bi bi-person me-1"></i> Customer
              </button>
              <button
                type="button"
                className={`btn btn-sm flex-fill rounded-pill fw-bold ${role === 'hotel_owner' ? 'btn-success text-white shadow-sm' : 'text-muted'}`}
                onClick={() => setRole('hotel_owner')}
              >
                <i className="bi bi-shop me-1"></i> Restaurant Partner
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Area, Street, Door No."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* Additional Fields for Restaurant Partner */}
                {role === 'hotel_owner' && (
                  <div className="col-12 p-3 bg-light rounded-3 mt-3 border border-success-subtle">
                    <h6 className="fw-bold text-success mb-3">
                      <i className="bi bi-shop me-2"></i> Restaurant Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Restaurant Name</label>
                        <input
                          type="text"
                          name="restaurant_name"
                          className="form-control"
                          placeholder="e.g. Green Leaf Organics"
                          value={formData.restaurant_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Cuisine Specialties</label>
                        <input
                          type="text"
                          name="cuisine"
                          className="form-control"
                          placeholder="e.g. Keto, Salads, Vegan, South Indian"
                          value={formData.cuisine}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            name="is_pure_veg"
                            id="pureVegPartnerCheck"
                            className="form-check-input"
                            checked={formData.is_pure_veg}
                            onChange={handleChange}
                          />
                          <label className="form-check-label small fw-semibold text-success" htmlFor="pureVegPartnerCheck">
                            This restaurant serves 100% Pure Vegetarian Food
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold mt-4 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  `Register as ${role === 'hotel_owner' ? 'Restaurant Partner' : 'Customer'}`
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-success fw-bold text-decoration-none small">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
