import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OwnerFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const initialForm = {
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    calories: '350',
    protein_g: '25.0',
    carbs_g: '30.0',
    fat_g: '8.0',
    fiber_g: '5.0',
    image: '',
    is_veg: true,
    is_available: true,
    tags: 'High Protein, Clean Eats'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchFoodsAndCategories();
  }, []);

  const fetchFoodsAndCategories = async () => {
    setLoading(true);
    const [foodsRes, catsRes] = await Promise.all([
      api.get('/owner/foods/'),
      api.get('/categories/')
    ]);

    if (foodsRes.success && foodsRes.data) {
      const list = foodsRes.data.results || foodsRes.data;
      setFoods(Array.isArray(list) ? list : []);
    }
    if (catsRes.success && catsRes.data) {
      const list = catsRes.data.results || catsRes.data;
      setCategories(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      original_price: food.original_price || '',
      category: food.category?.id || food.category || '',
      calories: food.calories || '350',
      protein_g: food.protein_g || '20.0',
      carbs_g: food.carbs_g || '30.0',
      fat_g: food.fat_g || '10.0',
      fiber_g: food.fiber_g || '5.0',
      image: food.image || '',
      is_veg: food.is_veg ?? true,
      is_available: food.is_available ?? true,
      tags: food.tags || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dish?')) return;
    const res = await api.delete(`/owner/foods/${id}/`);
    if (res.success) {
      showToast('Dish removed successfully', 'info');
      fetchFoodsAndCategories();
    } else {
      showToast(res.message || 'Failed to remove dish', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Name and price are required', 'error');
      return;
    }

    if (editingId) {
      const res = await api.put(`/owner/foods/${editingId}/`, formData);
      if (res.success) {
        showToast('Dish updated successfully with fresh macros!', 'success');
        setModalOpen(false);
        fetchFoodsAndCategories();
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } else {
      const res = await api.post('/owner/foods/', formData);
      if (res.success) {
        showToast('New healthy dish published!', 'success');
        setModalOpen(false);
        fetchFoodsAndCategories();
      } else {
        showToast(res.message || 'Failed to add dish', 'error');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Title Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-egg-fried text-success me-2"></i>
            Menu & Macro Management
          </h1>
          <p className="text-muted mb-0">Add healthy dishes, calculate macros, and control dish availability.</p>
        </div>
        <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg me-1"></i> Add New Dish
        </button>
      </div>

      {/* Dishes Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading foods...</span>
          </div>
          <p className="text-muted mt-2">Loading menu catalogue...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-basket text-muted" style={{ fontSize: '3.5rem' }}></i>
          <h4 className="fw-bold mt-3">No Dishes Added Yet</h4>
          <p className="text-muted mb-3">Add your first high-protein or calorie-conscious dish to start selling.</p>
          <button className="btn btn-success rounded-pill" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-1"></i> Create Dish
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Dish</th>
                  <th scope="col">Diet</th>
                  <th scope="col">Price</th>
                  <th scope="col">Calories</th>
                  <th scope="col">P / C / F</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
                          alt={food.name}
                          className="rounded-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{food.name}</div>
                          <div className="small text-muted">{food.category?.name || 'Healthy Dish'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${food.is_veg ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {food.is_veg ? 'Pure Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      ₹{food.price}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {food.calories} kcal
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        <strong className="text-primary">{food.protein_g}g</strong> / <strong className="text-warning">{food.carbs_g}g</strong> / <strong className="text-danger">{food.fat_g}g</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${food.is_available ? 'bg-success' : 'bg-secondary'}`}>
                        {food.is_available ? 'Active' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-primary me-2 rounded-circle"
                        onClick={() => handleOpenEdit(food)}
                        title="Edit Dish"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        onClick={() => handleDelete(food.id)}
                        title="Delete Dish"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header bg-success text-white py-3 px-4">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-egg-fried me-2"></i>
                  {editingId ? 'Edit Dish & Macros' : 'Add New Healthy Dish'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-semibold">Dish Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Grilled Chicken Quinoa Bowl"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description & Clean Ingredients</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Detail the healthy ingredients, cooking method (steamed, grilled, cold-pressed)..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold">Selling Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold">Original / MRP (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    {/* Certified Macro Input Box */}
                    <div className="col-12">
                      <div className="card bg-light border p-3 rounded-3">
                        <div className="fw-bold small text-success mb-2 text-uppercase">
                          <i className="bi bi-heart-pulse-fill me-1"></i> Certified Nutritional Profile
                        </div>
                        <div className="row g-2">
                          <div className="col-6 col-md-3">
                            <label className="form-label small">Calories (kcal)</label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={formData.calories}
                              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <label className="form-label small text-primary fw-semibold">Protein (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control form-control-sm"
                              value={formData.protein_g}
                              onChange={(e) => setFormData({ ...formData, protein_g: e.target.value })}
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <label className="form-label small text-warning fw-semibold">Carbs (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control form-control-sm"
                              value={formData.carbs_g}
                              onChange={(e) => setFormData({ ...formData, carbs_g: e.target.value })}
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <label className="form-label small text-danger fw-semibold">Fat (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control form-control-sm"
                              value={formData.fat_g}
                              onChange={(e) => setFormData({ ...formData, fat_g: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Dietary Tags (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Keto, High Protein, Low Carb, Gluten Free"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>

                    <div className="col-6">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isVegSwitch"
                          checked={formData.is_veg}
                          onChange={(e) => setFormData({ ...formData, is_veg: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="isVegSwitch">
                          Pure Vegetarian
                        </label>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isAvailableSwitch"
                          checked={formData.is_available}
                          onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="isAvailableSwitch">
                          Available for Order
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light py-3 px-4">
                  <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold">
                    {editingId ? 'Save Changes' : 'Publish Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFoods;
