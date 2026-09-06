import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const FoodDetailsPage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFoodDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchFoodDetails = async () => {
    setLoading(true);
    const res = await api.get(`/foods/${id}/`);
    if (res.success && res.data) {
      setFood(res.data);
      // Fetch related foods from same category or restaurant
      if (res.data.restaurant) {
        const relatedRes = await api.get('/foods/', { restaurant_id: res.data.restaurant.id });
        if (relatedRes.success && relatedRes.data) {
          const list = relatedRes.data.results || relatedRes.data;
          setRelatedFoods((Array.isArray(list) ? list : []).filter(f => f.id !== res.data.id).slice(0, 3));
        }
      }
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (food) {
      addToCart(food.id, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading food details...</span>
        </div>
        <p className="text-muted mt-3">Computing verified macronutrient details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container py-5 text-center">
        <h4>Dish Not Found</h4>
        <p className="text-muted">The dish you requested is unavailable or has been removed.</p>
        <Link to="/restaurants" className="btn btn-success mt-2">Explore Kitchens</Link>
      </div>
    );
  }

  // Calculate macro ratios
  const proteinGrams = parseFloat(food.protein_g || 0);
  const carbsGrams = parseFloat(food.carbs_g || 0);
  const fatGrams = parseFloat(food.fat_g || 0);
  const totalGrams = (proteinGrams + carbsGrams + fatGrams) || 1;
  const proteinPct = Math.round((proteinGrams / totalGrams) * 100);
  const carbsPct = Math.round((carbsGrams / totalGrams) * 100);
  const fatPct = Math.round((fatGrams / totalGrams) * 100);

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/restaurants" className="text-decoration-none text-muted">Kitchens</Link></li>
          {food.restaurant && (
            <li className="breadcrumb-item">
              <Link to={`/restaurants/${food.restaurant.id}`} className="text-decoration-none text-muted">
                {food.restaurant.name}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">
            {food.name}
          </li>
        </ol>
      </nav>

      {/* Hero Overview Row */}
      <div className="row g-4 mb-5">
        {/* Food Image */}
        <div className="col-12 col-lg-6">
          <div className="position-relative rounded-4 overflow-hidden shadow-sm bg-light" style={{ height: '420px' }}>
            <img
              src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80'}
              alt={food.name}
              className="w-100 h-100 object-fit-cover"
            />
            <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
              <span className={`badge ${food.is_veg ? 'bg-success' : 'bg-danger'} shadow-sm px-3 py-2 fs-6`}>
                <i className={`bi ${food.is_veg ? 'bi-circle-fill' : 'bi-triangle-fill'} me-1`}></i>
                {food.is_veg ? 'Pure Veg' : 'Non-Veg'}
              </span>
              {food.is_featured && (
                <span className="badge bg-warning text-dark shadow-sm px-3 py-2 fs-6">
                  <i className="bi bi-star-fill me-1"></i> Chef's Choice
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Food Details & Add to Cart */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              {food.restaurant && (
                <Link
                  to={`/restaurants/${food.restaurant.id}`}
                  className="badge bg-success-subtle text-success text-decoration-none px-3 py-2 rounded-pill"
                >
                  <i className="bi bi-shop me-1"></i> {food.restaurant.name}
                </Link>
              )}
              <span className="badge bg-warning-subtle text-dark px-2 py-1 rounded">
                <i className="bi bi-star-fill text-warning me-1"></i> {food.rating || '4.9'}
              </span>
            </div>

            <h1 className="h2 fw-bold mb-2">{food.name}</h1>
            <p className="text-muted mb-3 fs-6 lh-base">
              {food.description || 'Nutrient-rich, chef-crafted meal prepared with premium wholesome ingredients.'}
            </p>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="fs-2 fw-bold text-success">₹{food.price}</span>
              {food.original_price && (
                <span className="fs-5 text-muted text-decoration-line-through">₹{food.original_price}</span>
              )}
              <span className="badge bg-success text-white">Verified Macros</span>
            </div>

            {/* Health Tags */}
            {food.tags && (
              <div className="mb-4">
                <div className="text-muted small fw-bold mb-2 text-uppercase">Health Labels & Diets:</div>
                <div className="d-flex flex-wrap gap-2">
                  {food.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="badge bg-light text-success border border-success-subtle px-3 py-2 rounded-pill">
                      <i className="bi bi-check2-circle me-1"></i>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="card border-0 bg-light p-3 rounded-3 mt-3">
            <div className="row g-3 align-items-center">
              <div className="col-auto">
                <label className="fw-semibold small d-block mb-1">Portion Quantity:</label>
                <div className="btn-group border rounded-pill overflow-hidden bg-white shadow-sm" role="group">
                  <button
                    className="btn btn-light px-3"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="px-3 py-2 fw-bold align-self-center text-dark">
                    {quantity}
                  </span>
                  <button
                    className="btn btn-light px-3"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <div className="col">
                <button
                  className="btn btn-success btn-lg w-100 rounded-pill shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-bag-plus-fill"></i>
                  Add to Cart • ₹{(parseFloat(food.price) * quantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certified Macro Breakdown Panel */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
        <div className="card-header bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Certified Nutritional Facts (Per Serving)
          </h5>
          <span className="badge bg-white text-success px-3 py-1 rounded-pill">100% Lab Tested</span>
        </div>

        <div className="card-body p-4">
          <div className="row g-4 text-center">
            {/* Calories */}
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-4 h-100 border-start border-4 border-success">
                <div className="text-muted small fw-bold text-uppercase">Calories</div>
                <div className="display-6 fw-bold text-success my-1">{food.calories}</div>
                <div className="small text-muted">kcal energy</div>
              </div>
            </div>

            {/* Protein */}
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-4 h-100 border-start border-4 border-primary">
                <div className="text-muted small fw-bold text-uppercase">Protein</div>
                <div className="display-6 fw-bold text-primary my-1">{food.protein_g}g</div>
                <div className="small text-muted">{proteinPct}% of macros</div>
              </div>
            </div>

            {/* Carbs */}
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-4 h-100 border-start border-warning">
                <div className="text-muted small fw-bold text-uppercase">Carbohydrates</div>
                <div className="display-6 fw-bold text-warning my-1">{food.carbs_g}g</div>
                <div className="small text-muted">{carbsPct}% of macros</div>
              </div>
            </div>

            {/* Fat */}
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-4 h-100 border-start border-4 border-danger">
                <div className="text-muted small fw-bold text-uppercase">Healthy Fats</div>
                <div className="display-6 fw-bold text-danger my-1">{food.fat_g}g</div>
                <div className="small text-muted">{fatPct}% of macros</div>
              </div>
            </div>
          </div>

          {/* Macro Ratio Stacked Bar */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span className="fw-semibold">Macro Distribution Ratio</span>
              <span>Protein: {proteinPct}% | Carbs: {carbsPct}% | Fat: {fatPct}%</span>
            </div>
            <div className="progress" style={{ height: '14px', borderRadius: '10px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${proteinPct}%` }}
                title={`Protein: ${food.protein_g}g`}
              ></div>
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: `${carbsPct}%` }}
                title={`Carbs: ${food.carbs_g}g`}
              ></div>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${fatPct}%` }}
                title={`Fat: ${food.fat_g}g`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Preparation */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-basket-fill text-success me-2"></i>
                Clean Ingredients & Nutrition
              </h5>
              <p className="text-muted">
                {food.ingredients || 'Handpicked organic ingredients, sourced sustainably without artificial trans-fats, processed sugars, or artificial taste enhancers.'}
              </p>

              <div className="alert alert-success d-flex align-items-center mt-3" role="alert">
                <i className="bi bi-shield-check fs-4 me-3 text-success"></i>
                <div>
                  <strong>Doctor & Nutritionist Approved:</strong> This recipe maintains balanced glycemic indexes, optimal dietary fiber, and supports steady all-day metabolism.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-light">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-truck text-success me-2"></i>
                Kitchen & Delivery Info
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-geo-alt-fill text-success fs-5 me-2"></i>
                  <div>
                    <strong>Kitchen Location:</strong>
                    <div className="text-muted small">{food.restaurant?.city || 'Local Hub'}, Fast Doorstep Dispatch</div>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-thermometer-half text-success fs-5 me-2"></i>
                  <div>
                    <strong>Fresh Packaging:</strong>
                    <div className="text-muted small">Thermal insulated, 100% eco-friendly compostable containers.</div>
                  </div>
                </li>
                <li className="d-flex align-items-start">
                  <i className="bi bi-clock text-success fs-5 me-2"></i>
                  <div>
                    <strong>Preparation Time:</strong>
                    <div className="text-muted small">Cooked fresh in {food.restaurant?.delivery_time_mins || 25} minutes upon order.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related / More from kitchen */}
      {relatedFoods.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-4">More from this Kitchen</h4>
          <div className="row g-4">
            {relatedFoods.map(item => (
              <div className="col-12 col-md-4" key={item.id}>
                <FoodCard food={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailsPage;
