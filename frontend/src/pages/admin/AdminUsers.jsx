import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get('/admin/users/');
    if (res.success && res.data) {
      setUsers(Array.isArray(res.data) ? res.data : []);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    const res = await api.delete(`/admin/users/${userId}/`);
    if (res.success) {
      showToast('User deleted successfully', 'info');
      fetchUsers();
    } else {
      showToast(res.message || 'Cannot delete user', 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search.trim() ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-people text-primary me-2"></i>
            User Accounts Directory
          </h1>
          <p className="text-muted mb-0">Manage registered customers, restaurant partners and administrators.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light">
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="hotel_owner">Hotel Owners</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading user directory...</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Location</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}</div>
                      <div className="small text-muted">@{user.username} • {user.email}</div>
                    </td>
                    <td>
                      <span className={`badge text-uppercase ${
                        user.role === 'admin' ? 'bg-danger' :
                        user.role === 'hotel_owner' ? 'bg-primary' : 'bg-success'
                      }`}>
                        {user.role || 'customer'}
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted">{user.profile?.phone || 'No phone'}</span>
                    </td>
                    <td>
                      <span className="small text-muted">{user.profile?.city || 'Coimbatore'}</span>
                    </td>
                    <td className="text-end pe-4">
                      {!user.is_superuser && (
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
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

export default AdminUsers;
