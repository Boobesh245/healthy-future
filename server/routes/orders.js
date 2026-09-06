const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');

// Get customer orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name city delivery_time_mins')
      .populate('items.food', 'name image calories protein_g carbs_g fat_g')
      .sort({ created_at: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error('Order fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Place order
router.post('/', authenticate, async (req, res) => {
  try {
    const { delivery_address, contact_phone, delivery_notes, payment_method } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const totals = cart.calculateTotals();

    // Group items by restaurant if present
    const firstFood = cart.items[0].food;
    const restaurantId = firstFood ? firstFood.restaurant : null;

    const orderItems = cart.items.map((item) => ({
      food: item.food ? item.food._id : null,
      food_name: item.food ? item.food.name : 'Healthy Meal',
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      total_amount: parseFloat(totals.total),
      delivery_address: delivery_address || req.user.address || 'Address on file',
      contact_phone: contact_phone || req.user.phone || '9876543210',
      delivery_notes: delivery_notes || '',
      payment_method: payment_method || 'cod',
      status: 'Pending',
    });

    await order.save();

    // Clear cart after placing order
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (err) {
    console.error('Order placement error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is ${order.status}`,
      });
    }

    order.status = 'Cancelled';
    await order.save();

    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
