const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Order = require('../models/Order');
const { authenticate, requireRole } = require('../middleware/auth');

// All routes require admin role
router.use(authenticate, requireRole('admin'));

// Admin dashboard KPI metrics
router.get('/dashboard', async (req, res) => {
  try {
    const customers = await User.countDocuments({ role: 'customer' });
    const hotel_owners = await User.countDocuments({ role: 'hotel_owner' });
    const restaurants = await Restaurant.countDocuments();
    const foods = await Food.countDocuments();
    const orders = await Order.countDocuments();
    const pending_orders = await Order.countDocuments({ status: 'Pending' });
    const completed_orders = await Order.countDocuments({ status: 'Delivered' });
    const cancelled_orders = await Order.countDocuments({ status: 'Cancelled' });

    return res.json({
      success: true,
      data: {
        customers,
        hotel_owners,
        restaurants,
        foods,
        orders,
        pending_orders,
        completed_orders,
        cancelled_orders,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'User removed' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Owners & Approvals
router.get('/owners', async (req, res) => {
  try {
    const owners = await User.find({ role: 'hotel_owner' }).select('-password').sort({ created_at: -1 });
    const formatted = [];
    for (const owner of owners) {
      const rest = await Restaurant.findOne({ owner: owner._id });
      formatted.push({
        id: owner._id,
        user: owner,
        phone: owner.phone,
        restaurant_name: rest ? rest.name : 'Kitchen Profile Pending',
        is_approved: owner.is_approved,
        is_blocked: owner.is_blocked,
      });
    }
    return res.json({ success: true, data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/owners/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'Owner not found' });

    if (action === 'approve') {
      user.is_approved = true;
      user.is_blocked = false;
      await Restaurant.updateMany({ owner: user._id }, { is_approved: true });
    } else if (action === 'reject') {
      user.is_approved = false;
      await Restaurant.updateMany({ owner: user._id }, { is_approved: false });
    } else if (action === 'block') {
      user.is_blocked = true;
    }

    await user.save();
    return res.json({ success: true, message: `Owner ${action}d successfully` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ created_at: -1 });
    return res.json({ success: true, data: restaurants });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/restaurants/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params;
    const rest = await Restaurant.findById(id);
    if (!rest) return res.status(404).json({ success: false, message: 'Not found' });

    if (action === 'feature') {
      rest.is_featured = !rest.is_featured;
    } else if (action === 'approve') {
      rest.is_approved = true;
    }

    await rest.save();
    return res.json({ success: true, message: 'Updated', data: rest });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Platform Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('restaurant', 'name')
      .sort({ created_at: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
