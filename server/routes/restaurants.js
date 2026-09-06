const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// List restaurants with filtering
router.get('/', async (req, res) => {
  try {
    const { search, city, pure_veg, ordering } = req.query;
    const query = { is_active: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (pure_veg === 'true') {
      query.is_pure_veg = true;
    }

    let sort = { rating: -1 };
    if (ordering === 'delivery_time_mins') {
      sort = { delivery_time_mins: 1 };
    }

    const restaurants = await Restaurant.find(query).sort(sort).populate('owner', 'username email');

    return res.json({
      success: true,
      data: restaurants,
    });
  } catch (err) {
    console.error('Restaurant fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    return res.json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
