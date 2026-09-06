const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Order = require('../models/Order');
const { authenticate, requireRole } = require('../middleware/auth');

// Owner dashboard statistics
router.get('/dashboard', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'No restaurant associated with this owner' });
    }

    const total_dishes = await Food.countDocuments({ restaurant: restaurant._id });
    const orders = await Order.find({ restaurant: restaurant._id });
    const total_orders = orders.length;
    const pending_orders = orders.filter(o => o.status === 'Pending').length;
    const completed_orders = orders.filter(o => o.status === 'Delivered').length;

    return res.json({
      success: true,
      data: {
        restaurant_name: restaurant.name,
        is_approved: restaurant.is_approved,
        total_dishes,
        total_orders,
        pending_orders,
        completed_orders,
        restaurant,
      },
    });
  } catch (err) {
    console.error('Owner dashboard error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Owner restaurant profile get/update
router.get('/restaurant', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    return res.json({ success: true, data: restaurant });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/restaurant', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.json({ success: true, message: 'Restaurant updated', data: restaurant });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Owner foods list & create
router.get('/foods', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.json({ success: true, data: [] });
    }
    const foods = await Food.find({ restaurant: restaurant._id }).populate('category');
    return res.json({ success: true, data: foods });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/foods', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(400).json({ success: false, message: 'Create restaurant profile first' });
    }

    const food = new Food({
      ...req.body,
      restaurant: restaurant._id,
    });
    await food.save();

    return res.status(201).json({ success: true, message: 'Dish created', data: food });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Owner food detail update / delete
router.put('/foods/:id', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.json({ success: true, message: 'Dish updated', data: food });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/foods/:id', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Dish deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Owner live orders
router.get('/orders', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.json({ success: true, data: [] });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('user', 'username first_name last_name email phone')
      .populate('items.food')
      .sort({ created_at: -1 });

    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/orders/:id/status', authenticate, requireRole('hotel_owner', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    return res.json({ success: true, message: 'Status updated', data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
