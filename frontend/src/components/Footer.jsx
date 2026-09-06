import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <span className="text-white fw-bold fs-4">Healthy Future</span>
            </div>
            <p className="small text-muted">
              The dedicated platform for healthy, nutritious, and diet-friendly food delivery across Hosur & Bangalore.
            </p>
            <div className="d-flex gap-3 text-white fs-5 mt-3">
              <a href="#!"><i className="bi bi-instagram"></i></a>
              <a href="#!"><i className="bi bi-facebook"></i></a>
              <a href="#!"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h4 className="footer-heading">Diets</h4>
            <ul className="footer-links p-0">
              <li><Link to="/restaurants?health_tag=high-protein">High Protein</Link></li>
              <li><Link to="/restaurants?health_tag=keto">Keto Friendly</Link></li>
              <li><Link to="/restaurants?food_type=Vegan">Vegan Meals</Link></li>
              <li><Link to="/restaurants?max_calories=350">Low Calorie</Link></li>
              <li><Link to="/restaurants?category=salads">Organic Salads</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h4 className="footer-heading">Partner With Us</h4>
            <ul className="footer-links p-0">
              <li><Link to="/owner">Restaurant Partner Portal</Link></li>
              <li><Link to="/login?role=hotel_owner">Owner Login</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h4 className="footer-heading">Contact</h4>
            <p className="small text-muted mb-1">
              <i className="bi bi-geo-alt me-2 text-success"></i>Hosur & Bangalore, India
            </p>
            <p className="small text-muted mb-1">
              <i className="bi bi-telephone me-2 text-success"></i>+91 98765 43210
            </p>
            <p className="small text-muted">
              <i className="bi bi-envelope me-2 text-success"></i>support@healthyfuture.com
            </p>
          </div>
        </div>
        <div className="border-top border-secondary pt-4 mt-4 text-center text-muted small">
          &copy; {new Date().getFullYear()} Healthy Future Web Application. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
