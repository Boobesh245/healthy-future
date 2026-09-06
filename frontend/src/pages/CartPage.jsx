import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, items, subtotal, deliveryCharge, total, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 max-w-md mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-cart-x text-success" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">Please Sign In</h3>
          <p className="text-muted">You need to sign in to access your healthy meal basket and save your macros.</p>
          <Link to="/login" className="btn btn-success btn-lg rounded-pill mt-2">Sign In to Continue</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: '550px' }}>
          <i className="bi bi-basket2 text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">Your Healthy Cart is Empty</h3>
          <p className="text-muted">Explore high-protein bowls, keto delights, clean salads, and macro-certified chef meals!</p>
          <Link to="/restaurants" className="btn btn-success btn-lg rounded-pill px-4 mt-2">
            <i className="bi bi-search me-2"></i> Explore Kitchens & Menus
          </Link>
        </div>
      </div>
    );
  }

  // Calculate cumulative meal macros
  const totalCalories = items.reduce((acc, item) => acc + (parseFloat(item.food?.calories || 0) * item.quantity), 0);
  const totalProtein = items.reduce((acc, item) => acc + (parseFloat(item.food?.protein_g || 0) * item.quantity), 0);
  const totalCarbs = items.reduce((acc, item) => acc + (parseFloat(item.food?.carbs_g || 0) * item.quantity), 0);
  const totalFat = items.reduce((acc, item) => acc + (parseFloat(item.food?.fat_g || 0) * item.quantity), 0);

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-bag-check text-success me-2"></i>
            Your Meal Cart
          </h1>
          <p className="text-muted mb-0">Check out your selected dishes and real-time total nutritional intake.</p>
        </div>
        <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={clearCart}>
          <i className="bi bi-trash3 me-1"></i> Clear Cart
        </button>
      </div>

      {/* Cart Items & Order Summary Row */}
      <div className="row g-4">
        {/* Left Column: Cart Items */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white py-3 px-4 border-bottom">
              <h5 className="mb-0 fw-bold">Dishes in Order ({items.length})</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {items.map(item => {
                  const food = item.food || {};
                  return (
                    <li key={item.id} className="list-group-item p-3 p-md-4">
                      <div className="row align-items-center g-3">
                        {/* Food Image */}
                        <div className="col-auto">
                          <img
                            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80'}
                            alt={food.name}
                            className="rounded-3 shadow-sm"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                        </div>

                        {/* Title & Macros */}
                        <div className="col">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className={`badge ${food.is_veg ? 'bg-success' : 'bg-danger'} p-1`}>
                              <i className={`bi ${food.is_veg ? 'bi-circle-fill' : 'bi-triangle-fill'}`} style={{ fontSize: '0.5rem' }}></i>
                            </span>
                            <Link to={`/foods/${food.id}`} className="fw-bold text-dark text-decoration-none">
                              {food.name}
                            </Link>
                          </div>

                          <div className="d-flex flex-wrap gap-2 small text-muted mb-2">
                            <span className="badge bg-light text-dark border">
                              {food.calories || 0} kcal
                            </span>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              P: {food.protein_g || 0}g
                            </span>
                            <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                              C: {food.carbs_g || 0}g
                            </span>
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                              F: {food.fat_g || 0}g
                            </span>
                          </div>

                          <div className="fw-bold text-success fs-6">
                            ₹{item.price || food.price}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-auto">
                          <div className="btn-group border rounded-pill bg-light" role="group">
                            <button
                              className="btn btn-sm btn-light px-2"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="px-3 py-1 fw-bold align-self-center text-dark small">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-light px-2"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>

                        {/* Total per line & Remove */}
                        <div className="col-auto text-end">
                          <div className="fw-bold text-dark mb-1">
                            ₹{(parseFloat(item.price || food.price) * item.quantity).toFixed(2)}
                          </div>
                          <button
                            className="btn btn-link text-danger p-0 text-decoration-none small"
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Cart Nutritional Footprint Card */}
          <div className="card border-0 shadow-sm rounded-4 bg-success text-white p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-activity me-2"></i>
              Total Meal Nutrition in this Cart
            </h5>
            <div className="row g-3 text-center">
              <div className="col-3">
                <div className="bg-white bg-opacity-20 rounded-3 p-2">
                  <div className="small text-white-50 text-uppercase fw-semibold">Calories</div>
                  <div className="fs-4 fw-bold">{Math.round(totalCalories)}</div>
                  <div className="small text-white-50">kcal</div>
                </div>
              </div>
              <div className="col-3">
                <div className="bg-white bg-opacity-20 rounded-3 p-2">
                  <div className="small text-white-50 text-uppercase fw-semibold">Protein</div>
                  <div className="fs-4 fw-bold">{Math.round(totalProtein)}g</div>
                  <div className="small text-white-50">muscle fuel</div>
                </div>
              </div>
              <div className="col-3">
                <div className="bg-white bg-opacity-20 rounded-3 p-2">
                  <div className="small text-white-50 text-uppercase fw-semibold">Carbs</div>
                  <div className="fs-4 fw-bold">{Math.round(totalCarbs)}g</div>
                  <div className="small text-white-50">clean energy</div>
                </div>
              </div>
              <div className="col-3">
                <div className="bg-white bg-opacity-20 rounded-3 p-2">
                  <div className="small text-white-50 text-uppercase fw-semibold">Fats</div>
                  <div className="fs-4 fw-bold">{Math.round(totalFat)}g</div>
                  <div className="small text-white-50">healthy oils</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Bill & Checkout Button */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-3">Bill Details</h5>

            <div className="d-flex justify-content-between py-2 border-bottom text-muted">
              <span>Item Subtotal</span>
              <span className="fw-semibold text-dark">₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom text-muted">
              <span>Eco Delivery Fee</span>
              <span className="fw-semibold text-dark">₹{deliveryCharge}</span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom text-muted">
              <span>Taxes & Kitchen Packaging</span>
              <span className="fw-semibold text-success">FREE</span>
            </div>

            <div className="d-flex justify-content-between py-3 fs-5 fw-bold text-dark">
              <span>To Pay</span>
              <span className="text-success">₹{total}</span>
            </div>

            <div className="alert alert-success-subtle border-0 rounded-3 p-2 small mb-3 text-success d-flex align-items-center">
              <i className="bi bi-shield-check fs-5 me-2"></i>
              <span>100% Contactless & Guaranteed Fresh Delivery</span>
            </div>

            <button
              className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm py-3"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <i className="bi bi-arrow-right ms-1"></i>
            </button>

            <Link to="/restaurants" className="btn btn-link text-center w-100 mt-2 text-decoration-none text-muted small">
              <i className="bi bi-plus-circle me-1"></i> Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
