import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || 'Coimbatore'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h4>Please sign in to view your profile</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            {/* Header banner */}
            <div className="bg-success text-white p-4 d-flex align-items-center gap-3">
              <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center fw-bold fs-3 shadow" style={{ width: '70px', height: '70px' }}>
                {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="h4 fw-bold mb-0">{user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}</h2>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="badge bg-white text-success text-uppercase font-monospace">
                    {user.role || 'Customer'}
                  </span>
                  <span className="text-white-50 small">@{user.username}</span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4">Personal & Delivery Details</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-8">
                    <label className="form-label small fw-semibold">Default Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top text-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-success px-4 rounded-pill fw-bold shadow-sm"
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving Changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
