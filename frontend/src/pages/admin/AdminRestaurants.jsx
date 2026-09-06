import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    const res = await api.get('/admin/restaurants/');
    if (res.success && res.data) {
      const list = res.data.results || res.data;
      setRestaurants(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const handleAction = async (restId, action) => {
    const res = await api.patch(`/admin/restaurants/${restId}/${action}/`);
    if (res.success) {
      showToast(`Restaurant updated: ${action}`, 'success');
      fetchRestaurants();
    } else {
      showToast(res.message || 'Action failed', 'error');
    }
  };

  const filtered = restaurants.filter(r =>
    !search.trim() ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.city && r.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-shop text-warning me-2"></i>
            All Platform Kitchens ({restaurants.length})
          </h1>
          <p className="text-muted mb-0">Overview of all restaurants, pure veg classifications and featured listings.</p>
        </div>
        <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={fetchRestaurants}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light">
        <input
          type="text"
          className="form-control"
          placeholder="Filter restaurants by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading restaurants...</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Restaurant</th>
                  <th scope="col">City</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Diet Type</th>
                  <th scope="col">Featured</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={r.logo_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&auto=format&fit=crop&q=80'}
                          alt={r.name}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{r.name}</div>
                          <div className="small text-muted">{r.cuisine || 'Healthy Foods'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.city || 'Coimbatore'}</td>
                    <td>
                      <span className="badge bg-warning-subtle text-dark">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {r.rating || '4.8'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${r.is_pure_veg ? 'bg-success' : 'bg-secondary'}`}>
                        {r.is_pure_veg ? 'Pure Veg' : 'Multi-Diet'}
                      </span>
                    </td>
                    <td>
                      {r.is_featured ? (
                        <span className="badge bg-warning text-dark">Featured</span>
                      ) : (
                        <span className="text-muted small">Standard</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className={`btn btn-sm rounded-pill px-3 ${r.is_featured ? 'btn-outline-secondary' : 'btn-outline-warning'}`}
                        onClick={() => handleAction(r.id, 'feature')}
                      >
                        {r.is_featured ? 'Unfeature' : 'Feature'}
                      </button>
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

export default AdminRestaurants;
