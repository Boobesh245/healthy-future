import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cart, items, subtotal, deliveryCharge, total, fetchCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.profile?.address || '124, Healthy Boulevard, Near Race Course');
  const [city, setCity] = useState(user?.profile?.city || 'Coimbatore');
  const [postalCode, setPostalCode] = useState(user?.profile?.postal_code || '641018');
  const [phone, setPhone] = useState(user?.profile?.phone || '9876543210');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>No items in cart for checkout</h4>
        <Link to="/restaurants" className="btn btn-success mt-3">Find Healthy Meals</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      showToast('Please provide your complete delivery address and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      delivery_address: `${address}, ${city} - ${postalCode}`,
      contact_phone: phone,
      delivery_notes: instructions,
      payment_method: paymentMethod
    };

    const res = await api.post('/orders/', orderPayload);
    setIsSubmitting(false);

    if (res.success && res.data) {
      showToast('Order placed successfully! Preparing healthy freshness.', 'success');
      await fetchCart();
      navigate('/orders');
    } else {
      showToast(res.message || 'Failed to place order. Please try again.', 'error');
    }
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4 pb-2 border-bottom">
        <h1 className="h3 fw-bold mb-1">
          <i className="bi bi-shield-check text-success me-2"></i>
          Complete Your Healthy Order
        </h1>
        <p className="text-muted mb-0">Confirm delivery address and choose your payment method.</p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Left Form: Address & Payment */}
          <div className="col-12 col-lg-7">
            {/* Delivery Address Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-geo-alt-fill text-success me-2"></i>
                Delivery Destination
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Street Address / Flat / Floor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter complete house / flat address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number for delivery rider"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Special Delivery Instructions (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="e.g. Leave package at security gate, ring bell twice..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-credit-card-fill text-success me-2"></i>
                Select Payment Mode
              </h5>

              <div className="d-flex flex-column gap-3">
                {/* Cash On Delivery */}
                <label className={`p-3 border rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${paymentMethod === 'cod' ? 'border-success bg-success-subtle' : 'bg-light'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-check-input"
                    />
                    <div>
                      <div className="fw-bold text-dark">Cash on Delivery / Pay on Arrival</div>
                      <div className="text-muted small">Pay securely via Cash, UPI QR or Card at your door</div>
                    </div>
                  </div>
                  <i className="bi bi-cash-stack text-success fs-4"></i>
                </label>

                {/* Instant UPI */}
                <label className={`p-3 border rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${paymentMethod === 'upi' ? 'border-success bg-success-subtle' : 'bg-light'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-check-input"
                    />
                    <div>
                      <div className="fw-bold text-dark">UPI (GPay / PhonePe / Paytm)</div>
                      <div className="text-muted small">Scan dynamic QR code or pay instantly</div>
                    </div>
                  </div>
                  <i className="bi bi-qr-code-scan text-primary fs-4"></i>
                </label>

                {/* Card */}
                <label className={`p-3 border rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${paymentMethod === 'card' ? 'border-success bg-success-subtle' : 'bg-light'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-check-input"
                    />
                    <div>
                      <div className="fw-bold text-dark">Credit / Debit Card</div>
                      <div className="text-muted small">Visa, MasterCard, Rupay</div>
                    </div>
                  </div>
                  <i className="bi bi-credit-card text-warning fs-4"></i>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3">Order Overview</h5>

              <div className="mb-3 max-h-60 overflow-auto" style={{ maxHeight: '200px' }}>
                {items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                    <div>
                      <span className="fw-semibold">{item.food?.name}</span>
                      <div className="text-muted">Qty: {item.quantity} × ₹{item.price}</div>
                    </div>
                    <span className="fw-bold">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">₹{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Eco Delivery Charge</span>
                <span className="fw-semibold text-dark">₹{deliveryCharge}</span>
              </div>

              <div className="d-flex justify-content-between py-3 fs-5 fw-bold text-dark">
                <span>Grand Total</span>
                <span className="text-success">₹{total}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check-fill me-2"></i>
                    Place Healthy Order • ₹{total}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
