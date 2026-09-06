import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    const res = await api.get('/admin/owners/');
    if (res.success && res.data) {
      setOwners(Array.isArray(res.data) ? res.data : []);
    }
    setLoading(false);
  };

  const handleAction = async (ownerId, action) => {
    const res = await api.patch(`/admin/owners/${ownerId}/${action}/`);
    if (res.success) {
      showToast(`Kitchen owner successfully ${action}d`, 'success');
      fetchOwners();
    } else {
      showToast(res.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-patch-check text-success me-2"></i>
            Kitchen Partner Approvals
          </h1>
          <p className="text-muted mb-0">Review chef applications, verify hygiene standards and grant platform sales access.</p>
        </div>
        <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={fetchOwners}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh List
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading kitchen partner applications...</p>
        </div>
      ) : owners.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-shop text-muted" style={{ fontSize: '3.5rem' }}></i>
          <h4 className="fw-bold mt-3">No Hotel Owners Registered</h4>
          <p className="text-muted">No restaurant partners have registered yet.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Kitchen / Owner</th>
                  <th scope="col">Phone & Email</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Approval Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners.map(owner => (
                  <tr key={owner.id}>
                    <td className="ps-4">
                      <div className="fw-bold fs-6">{owner.restaurant_name || 'Healthy Kitchen'}</div>
                      <div className="small text-muted">
                        Partner: {owner.user?.first_name ? `${owner.user.first_name} ${owner.user.last_name || ''}` : owner.user?.username} (@{owner.user?.username})
                      </div>
                    </td>
                    <td>
                      <div>{owner.phone || 'N/A'}</div>
                      <div className="small text-muted">{owner.user?.email}</div>
                    </td>
                    <td>
                      {owner.is_blocked ? (
                        <span className="badge bg-danger">Blocked</span>
                      ) : owner.is_approved ? (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i> Approved
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending Review</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group" role="group">
                        {!owner.is_approved && (
                          <button
                            className="btn btn-sm btn-success rounded-pill me-2 px-3 fw-bold"
                            onClick={() => handleAction(owner.id, 'approve')}
                          >
                            <i className="bi bi-check-lg me-1"></i> Approve
                          </button>
                        )}
                        {owner.is_approved && !owner.is_blocked && (
                          <button
                            className="btn btn-sm btn-outline-warning text-dark rounded-pill me-2 px-3"
                            onClick={() => handleAction(owner.id, 'reject')}
                          >
                            Revoke
                          </button>
                        )}
                        {!owner.is_blocked ? (
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleAction(owner.id, 'block')}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                            onClick={() => handleAction(owner.id, 'approve')}
                          >
                            Unblock
                          </button>
                        )}
                      </div>
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

export default AdminOwners;
