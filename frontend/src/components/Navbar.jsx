import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isLoggedIn, role, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <div className="brand-icon">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <span>Healthy Future</span>
        </Link>

        {/* Location pill */}
        <div className="nav-location-pill d-none d-md-flex ms-3">
          <i className="bi bi-geo-alt-fill text-danger"></i>
          <span>Hosur & Bangalore</span>
        </div>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1 my-2 my-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/restaurants">
                Restaurants
              </NavLink>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/restaurants?health_tag=high-protein">
                High Protein
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/restaurants?health_tag=keto">
                Keto
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/restaurants?food_type=Vegan">
                Vegan
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 ms-lg-4 mt-3 mt-lg-0">
            <Link to="/cart" className="cart-badge-btn text-decoration-none">
              <i className="bi bi-basket2-fill"></i>
              <span>Cart</span>
              <span className="cart-count">{totalCount}</span>
            </Link>

            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-5 text-success"></i>
                  <span className="fw-bold">{user?.first_name || user?.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  {role === 'admin' && (
                    <li>
                      <Link className="dropdown-item fw-bold text-success" to="/admin">
                        <i className="bi bi-shield-check me-2"></i>Admin Portal
                      </Link>
                    </li>
                  )}
                  {role === 'hotel_owner' && (
                    <li>
                      <Link className="dropdown-item fw-bold text-success" to="/owner">
                        <i className="bi bi-shop me-2"></i>Owner Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="bi bi-bag-check me-2"></i>My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-gear me-2"></i>My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger border-0 bg-transparent"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-custom py-1 px-3 rounded-pill text-nowrap">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-custom py-1 px-3 rounded-pill text-nowrap">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
