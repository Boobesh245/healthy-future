const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Food = require('../models/Food');
const { authenticate } = require('../middleware/auth');

// Get current user cart
router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name city' },
    });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    const totals = cart.calculateTotals();

    return res.json({
      success: true,
      data: {
        id: cart._id,
        items: cart.items,
        ...totals,
      },
    });
  } catch (err) {
    console.error('Cart get error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { food_id, quantity = 1 } = req.body;
    if (!food_id) {
      return res.status(400).json({ success: false, message: 'food_id is required' });
    }

    const food = await Food.findById(food_id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === food_id.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        food: food._id,
        quantity: parseInt(quantity),
        price: food.price,
      });
    }

    cart.updated_at = new Date();
    await cart.save();

    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name city' },
    });

    const totals = cart.calculateTotals();

    return res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        id: cart._id,
        items: cart.items,
        ...totals,
      },
    });
  } catch (err) {
    console.error('Cart add error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update item quantity
router.put('/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = parseInt(quantity);
    }

    await cart.save();
    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name city' },
    });

    const totals = cart.calculateTotals();

    return res.json({
      success: true,
      data: {
        id: cart._id,
        items: cart.items,
        ...totals,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Remove single item
router.delete('/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name city' },
    });

    const totals = cart.calculateTotals();

    return res.json({
      success: true,
      message: 'Item removed',
      data: {
        id: cart._id,
        items: cart.items,
        ...totals,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Clear cart
router.delete('/clear', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        subtotal: '0.00',
        delivery_charge: '0.00',
        total: '0.00',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
