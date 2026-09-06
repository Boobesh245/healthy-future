import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const rating = parseFloat(restaurant.rating || 4.8).toFixed(1);
  const deliveryTime = restaurant.delivery_time_mins || restaurant.delivery_time || 30;
  const image = restaurant.banner_image || restaurant.logo_image || restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 restaurant-card"
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
    >
      <div className="position-relative" style={{ height: '180px' }}>
        <img
          src={image}
          alt={restaurant.name}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          {restaurant.is_pure_veg && (
            <span className="badge bg-success shadow-sm">
              <i className="bi bi-patch-check-fill me-1"></i> Pure Veg
            </span>
          )}
          {restaurant.is_featured && (
            <span className="badge bg-warning text-dark shadow-sm">
              <i className="bi bi-star-fill me-1"></i> Featured
            </span>
          )}
        </div>
        <div className="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white px-2 py-1 rounded">
          <i className="bi bi-clock-history me-1 text-info"></i> {deliveryTime} mins
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h5 className="fw-bold mb-0 text-truncate" title={restaurant.name}>
              {restaurant.name}
            </h5>
            <span className="badge bg-success-subtle text-success ms-2">
              <i className="bi bi-star-fill text-warning me-1"></i>
              {rating}
            </span>
          </div>
          <p className="text-muted small text-truncate mb-2">
            {restaurant.cuisine || restaurant.tagline || 'Healthy, Clean Cuisine'}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top small text-muted">
          <span>
            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
            {restaurant.city || 'Coimbatore'}
          </span>
          <span className="fw-semibold text-dark">
            Min. ₹{restaurant.minimum_order || 100}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
