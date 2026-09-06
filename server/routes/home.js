const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true }).sort({ display_order: 1 }).limit(10);
    const top_restaurants = await Restaurant.find({ is_active: true }).sort({ rating: -1 }).limit(8);
    const high_protein_foods = await Food.find({ is_available: true, protein_g: { $gte: 20 } })
      .populate('restaurant', 'name city')
      .sort({ protein_g: -1 })
      .limit(6);
    const low_calorie_foods = await Food.find({ is_available: true, calories: { $lte: 350 } })
      .populate('restaurant', 'name city')
      .sort({ calories: 1 })
      .limit(6);

    return res.json({
      success: true,
      data: {
        categories,
        top_restaurants,
        high_protein_foods,
        low_calorie_foods,
      },
    });
  } catch (err) {
    console.error('Home API error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
