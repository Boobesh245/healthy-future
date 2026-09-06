import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const title = food.name || food.food_name || 'Healthy Dish';
  const price = food.price || '0';
  const originalPrice = food.original_price;
  const calories = food.calories || 0;
  const protein = food.protein_g ?? food.protein ?? 0;
  const carbs = food.carbs_g ?? food.carbohydrates ?? 0;
  const fat = food.fat_g ?? food.fat ?? 0;
  const rating = parseFloat(food.rating || 4.8).toFixed(1);
  const isVeg = food.is_veg ?? (food.food_type?.toLowerCase() === 'veg');
  const restaurantName = food.restaurant?.name || food.restaurant_name || '';
  const restaurantId = food.restaurant?.id || food.restaurant;
  const image = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';

  const tags = (food.tags || food.health_tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 food-card">
      <div
        className="position-relative"
        style={{ height: '190px', cursor: 'pointer' }}
        onClick={() => navigate(`/foods/${food.id}`)}
      >
        <img
          src={image}
          alt={title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge ${isVeg ? 'bg-success' : 'bg-danger'} shadow-sm`}>
            <i className={`bi ${isVeg ? 'bi-circle-fill' : 'bi-triangle-fill'} me-1`} style={{ fontSize: '0.6rem' }}></i>
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-dark bg-opacity-75 text-white shadow-sm">
            <i className="bi bi-star-fill text-warning me-1"></i> {rating}
          </span>
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <h5
            className="fw-bold mb-1 text-truncate cursor-pointer"
            title={title}
            onClick={() => navigate(`/foods/${food.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </h5>

          {restaurantName && (
            <div className="small text-muted mb-2 text-truncate">
              <Link to={`/restaurants/${restaurantId}`} className="text-decoration-none text-muted">
                <i className="bi bi-shop me-1 text-success"></i> {restaurantName}
              </Link>
            </div>
          )}

          {/* Certified Macro Pills Row */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            <span className="badge bg-light text-dark border small" title="Calories">
              <i className="bi bi-fire text-danger me-1"></i> {calories} kcal
            </span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle small" title="Protein">
              P: {protein}g
            </span>
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle small" title="Carbs">
              C: {carbs}g
            </span>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle small" title="Fat">
              F: {fat}g
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="badge bg-success-subtle text-success small rounded-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
          <div>
            <span className="fs-5 fw-bold text-success">₹{price}</span>
            {originalPrice && (
              <span className="text-muted text-decoration-line-through small ms-1">₹{originalPrice}</span>
            )}
          </div>
          <button
            className="btn btn-success btn-sm rounded-pill px-3 fw-semibold shadow-sm d-flex align-items-center gap-1"
            onClick={() => addToCart(food.id, 1)}
          >
            <i className="bi bi-plus-lg"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
