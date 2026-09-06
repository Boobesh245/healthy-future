import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { RestaurantCard } from '../components/RestaurantCard';

export const HomePage = () => {
  const [data, setData] = useState({
    categories: [],
    top_restaurants: [],
    popular_foods: [],
    high_protein_foods: [],
    low_calorie_foods: [],
    recommended_foods: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeFeed = async () => {
      setLoading(true);
      const res = await api.get('/home/');
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchHomeFeed();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white text-success fw-bold px-3 py-2 rounded-pill mb-3">
                <i className="bi bi-shield-check me-1"></i> 100% Nutrition & Macro-Verified Food
              </span>
              <h1 className="hero-title">
                Fuel Your Body With <span>Healthy & Nutritious</span> Food.
              </h1>
              <p className="hero-subtitle">
                Order from 60+ healthy restaurants with detailed calorie, protein, and fat counts. Delivered fresh and warm to your doorstep.
              </p>

              {/* Search Form */}
              <form className="hero-search-wrapper" onSubmit={handleSearch}>
                <i className="bi bi-search text-muted fs-5 ms-3"></i>
                <input
                  type="text"
                  placeholder="Search healthy bowls, salads, protein meals, smoothies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hero-search-btn">
                  <span>Search</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>

              {/* Quick Diet Pills */}
              <div className="hero-pills">
                <span className="text-white-50 small align-self-center me-1">Popular diets:</span>
                <Link to="/restaurants?health_tag=high-protein" className="hero-pill">
                  High Protein
                </Link>
                <Link to="/restaurants?max_calories=350" className="hero-pill">
                  Under 350 kcal
                </Link>
                <Link to="/restaurants?health_tag=keto" className="hero-pill">
                  Keto Friendly
                </Link>
                <Link to="/restaurants?food_type=Vegan" className="hero-pill">
                  100% Vegan
                </Link>
                <Link to="/restaurants?category=salads" className="hero-pill">
                  Salad Bowls
                </Link>
              </div>
            </div>

            <div className="col-lg-4 d-none d-lg-block text-end">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                alt="Healthy Food Bowl"
                className="img-fluid rounded-4 shadow-lg border border-3 border-white"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="h3 mb-1">Explore Healthy Categories</h2>
              <p className="text-muted mb-0">Select your dietary preference or lifestyle</p>
            </div>
            <Link to="/restaurants" className="btn btn-outline-custom btn-sm rounded-pill">
              View All
            </Link>
          </div>

          <div className="row g-3">
            {loading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              (data.categories || []).map((c) => (
                <div key={c.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <div
                    className="category-card"
                    onClick={() => navigate(`/restaurants?category=${encodeURIComponent(c.name)}`)}
                  >
                    <div className="category-icon-wrapper">
                      <img
                        src={c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80'}
                        alt={c.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="category-title">{c.name}</div>
                    <div className="category-count">{c.total_foods || 12}+ dishes</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* High Protein Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-success-subtle text-success fw-bold mb-1">Muscle Fuel</span>
              <h2 className="h3 mb-1">High-Protein Power Bowls (25g+ Protein)</h2>
              <p className="text-muted mb-0">Clean lean proteins engineered for fitness and recovery</p>
            </div>
            <Link to="/restaurants?health_tag=high-protein" className="btn btn-outline-custom btn-sm rounded-pill">
              See More
            </Link>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              (data.high_protein_foods || []).slice(0, 4).map((f) => (
                <FoodCard key={f.id} food={f} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Top Restaurants Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-warning-subtle text-warning-emphasis fw-bold mb-1">Top Rated</span>
              <h2 className="h3 mb-1">Top Healthy Restaurants</h2>
              <p className="text-muted mb-0">Highest rated clean kitchens in Hosur & Bangalore</p>
            </div>
            <Link to="/restaurants" className="btn btn-outline-custom btn-sm rounded-pill">
              Explore 60+ Restaurants
            </Link>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              (data.top_restaurants || []).slice(0, 4).map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Low Calorie Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-info-subtle text-info-emphasis fw-bold mb-1">Guilt-Free</span>
              <h2 className="h3 mb-1">Low-Calorie Delights (Under 350 kcal)</h2>
              <p className="text-muted mb-0">Nutrient dense, light on calories without compromising taste</p>
            </div>
            <Link to="/restaurants?max_calories=350" className="btn btn-outline-custom btn-sm rounded-pill">
              View All
            </Link>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              (data.low_calorie_foods || []).slice(0, 4).map((f) => (
                <FoodCard key={f.id} food={f} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-success-subtle text-success fw-bold mb-1">Chef's Special</span>
              <h2 className="h3 mb-1">Recommended Healthy Meals</h2>
              <p className="text-muted mb-0">Most loved nutrition-rich dishes curated for you</p>
            </div>
            <Link to="/restaurants" className="btn btn-outline-custom btn-sm rounded-pill">
              Explore All
            </Link>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              (data.recommended_foods || []).slice(0, 4).map((f) => (
                <FoodCard key={f.id} food={f} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-5" style={{ backgroundColor: '#ecfdf5' }}>
        <div className="container text-center">
          <h2 className="h3 fw-bold mb-4">Why Choose Healthy Future?</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="brand-icon mx-auto mb-3" style={{ width: '55px', height: '55px', fontSize: '1.5rem' }}>
                  <i className="bi bi-calculator"></i>
                </div>
                <h3 className="h5 fw-bold">Verified Macro Counts</h3>
                <p className="text-muted mb-0">Every single dish details precise calories, protein, carbs, and healthy fats.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="brand-icon mx-auto mb-3" style={{ width: '55px', height: '55px', fontSize: '1.5rem' }}>
                  <i className="bi bi-flower1"></i>
                </div>
                <h3 className="h5 fw-bold">100% Clean Ingredients</h3>
                <p className="text-muted mb-0">No refined sugars, zero artificial colors, and only farm-fresh organic produce.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="brand-icon mx-auto mb-3" style={{ width: '55px', height: '55px', fontSize: '1.5rem' }}>
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <h3 className="h5 fw-bold">Swift Fresh Delivery</h3>
                <p className="text-muted mb-0">Packed in eco-friendly insulated packaging and delivered in under 30 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
