import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchFood, setSearchFood] = useState('');
  const [loading, setLoading] = useState(true);
  const { totalCount, total } = useCart();

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [id]);

  const fetchRestaurantAndMenu = async () => {
    setLoading(true);
    const [restRes, foodsRes, catRes] = await Promise.all([
      api.get(`/restaurants/${id}/`),
      api.get('/foods/', { restaurant_id: id }),
      api.get('/categories/')
    ]);

    if (restRes.success && restRes.data) {
      setRestaurant(restRes.data);
    }
    if (foodsRes.success && foodsRes.data) {
      const list = foodsRes.data.results || foodsRes.data;
      setFoods(Array.isArray(list) ? list : []);
    }
    if (catRes.success && catRes.data) {
      const list = catRes.data.results || catRes.data;
      setCategories(Array.isArray(list) ? list : []);
    }
    setLoading(false);
  };

  const filteredFoods = foods.filter(food => {
    const matchesCat = activeCategory === 'all' || 
      (food.category && (food.category.id === parseInt(activeCategory) || food.category.slug === activeCategory));
    const matchesSearch = !searchFood.trim() || 
      food.name.toLowerCase().includes(searchFood.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchFood.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading restaurant...</span>
        </div>
        <p className="text-muted mt-3">Loading menu with verified macro counts...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-5 text-center">
        <h4>Restaurant Not Found</h4>
        <p className="text-muted">The restaurant you are looking for does not exist or is currently inactive.</p>
        <Link to="/restaurants" className="btn btn-success mt-2">Browse All Restaurants</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Restaurant Header Banner */}
      <div className="bg-dark text-white py-5 position-relative" style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 20, 0.85), rgba(10, 25, 20, 0.95)), url(${restaurant.banner_image || restaurant.logo_image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&auto=format&fit=crop&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/restaurants" className="text-white-50 text-decoration-none">Restaurants</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">{restaurant.name}</li>
            </ol>
          </nav>

          <div className="row align-items-center">
            <div className="col-auto">
              <img
                src={restaurant.logo_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'}
                alt={restaurant.name}
                className="rounded-circle border border-3 border-success shadow"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
            <div className="col">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h1 className="h2 fw-bold mb-0 text-white">{restaurant.name}</h1>
                {restaurant.is_pure_veg && (
                  <span className="badge bg-success">
                    <i className="bi bi-patch-check-fill me-1"></i> Pure Veg
                  </span>
                )}
                {restaurant.is_featured && (
                  <span className="badge bg-warning text-dark">
                    <i className="bi bi-star-fill me-1"></i> Featured
                  </span>
                )}
              </div>
              <p className="text-white-50 mb-2">{restaurant.description || restaurant.tagline}</p>
              
              <div className="d-flex flex-wrap gap-3 text-white small">
                <span>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <strong>{restaurant.rating || '4.8'}</strong> ({restaurant.total_reviews || '250+'} ratings)
                </span>
                <span>
                  <i className="bi bi-clock-history text-info me-1"></i>
                  {restaurant.delivery_time_mins || 30} mins delivery
                </span>
                <span>
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {restaurant.city || 'Coimbatore'}
                </span>
                <span>
                  <i className="bi bi-wallet2 text-success me-1"></i>
                  Min. Order: ₹{restaurant.minimum_order || 100}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Section */}
      <div className="container py-4">
        {/* Menu Search & Category Filter Pills */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex gap-2 overflow-auto py-2 w-100" style={{ whiteSpace: 'nowrap' }}>
            <button
              className={`btn btn-sm rounded-pill px-3 ${activeCategory === 'all' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('all')}
            >
              All Items ({foods.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search dish in menu..."
                value={searchFood}
                onChange={(e) => setSearchFood(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Menu Foods Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <i className="bi bi-emoji-neutral text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="fw-bold mt-3">No matching dishes</h5>
            <p className="text-muted">Try choosing another category or clearing your search.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredFoods.map(food => (
              <div className="col-12 col-md-6 col-lg-4" key={food.id}>
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar if items in cart */}
      {totalCount > 0 && (
        <div className="position-fixed bottom-0 start-0 end-0 bg-success text-white py-3 shadow-lg z-3">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-white text-success fs-6 rounded-pill px-3 py-2">
                {totalCount} item{totalCount > 1 ? 's' : ''}
              </span>
              <span className="fw-bold fs-5">
                Total: ₹{total}
              </span>
            </div>
            <Link to="/cart" className="btn btn-light text-success fw-bold px-4 rounded-pill shadow-sm">
              View Cart & Checkout <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;
