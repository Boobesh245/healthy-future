const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Category = require('../models/Category');

// List foods with filtering
router.get('/', async (req, res) => {
  try {
    const {
      search,
      restaurant_id,
      category_id,
      category,
      is_veg,
      min_protein,
      max_calories,
      featured,
    } = req.query;

    const query = { is_available: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (restaurant_id) {
      query.restaurant = restaurant_id;
    }

    if (category_id) {
      query.category = category_id;
    }

    if (is_veg === 'true') {
      query.is_veg = true;
    }

    if (min_protein) {
      query.protein_g = { $gte: parseFloat(min_protein) };
    }

    if (max_calories) {
      query.calories = { $lte: parseFloat(max_calories) };
    }

    if (featured === 'true') {
      query.is_featured = true;
    }

    const foods = await Food.find(query)
      .populate('restaurant', 'name city delivery_time_mins rating')
      .populate('category', 'name slug')
      .sort({ rating: -1 });

    return res.json({
      success: true,
      data: foods,
    });
  } catch (err) {
    console.error('Food fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Single food item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurant')
      .populate('category');

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    return res.json({
      success: true,
      data: food,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
