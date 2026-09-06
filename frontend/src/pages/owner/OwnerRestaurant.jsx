import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OwnerRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    city: 'Coimbatore',
    cuisine: '',
    delivery_time_mins: 30,
    minimum_order: 100,
    is_pure_veg: false,
    logo_image: '',
    banner_image: ''
  });

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    setLoading(true);
    const res = await api.get('/owner/restaurant/');
    if (res.success && res.data) {
      setRestaurant(res.data);
      setFormData({
        name: res.data.name || '',
        description: res.data.description || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        city: res.data.city || 'Coimbatore',
        cuisine: res.data.cuisine || '',
        delivery_time_mins: res.data.delivery_time_mins || 30,
        minimum_order: res.data.minimum_order || 100,
        is_pure_veg: res.data.is_pure_veg || false,
        logo_image: res.data.logo_image || '',
        banner_image: res.data.banner_image || ''
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await api.put('/owner/restaurant/', formData);
    setSaving(false);
    if (res.success) {
      showToast('Restaurant details updated successfully', 'success');
      fetchRestaurant();
    } else {
      showToast(res.message || 'Failed to update restaurant', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted mt-2">Loading restaurant profile...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4 pb-3 border-bottom">
        <h1 className="h3 fw-bold mb-1">
          <i className="bi bi-shop text-success me-2"></i>
          Kitchen Profile & Settings
        </h1>
        <p className="text-muted mb-0">Update your restaurant information, operating details and branding.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Restaurant Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Cuisine Specialties</label>
              <input
                type="text"
                name="cuisine"
                className="form-control"
                placeholder="e.g. Keto, Salads, Vegan Bowls"
                value={formData.cuisine}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Description / Kitchen Philosophy</label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                placeholder="Tell health-conscious food lovers about your sourcing, clean oils and freshness..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
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
              <label className="form-label small fw-semibold">Kitchen Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">Avg. Delivery (mins)</label>
              <input
                type="number"
                name="delivery_time_mins"
                className="form-control"
                value={formData.delivery_time_mins}
                onChange={handleChange}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">Minimum Order (₹)</label>
              <input
                type="number"
                name="minimum_order"
                className="form-control"
                value={formData.minimum_order}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Logo Image URL</label>
              <input
                type="url"
                name="logo_image"
                className="form-control"
                value={formData.logo_image}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Banner Image URL</label>
              <input
                type="url"
                name="banner_image"
                className="form-control"
                value={formData.banner_image}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch p-2 bg-light rounded-3 border">
                <input
                  type="checkbox"
                  name="is_pure_veg"
                  id="ownerVegToggle"
                  className="form-check-input ms-0 me-3"
                  checked={formData.is_pure_veg}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold text-success" htmlFor="ownerVegToggle">
                  Pure Vegetarian Outlet (Green Certified Kitchen)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-top text-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-success px-5 rounded-pill fw-bold shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Kitchen Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerRestaurant;
