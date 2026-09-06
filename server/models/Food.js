const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  description: {
    type: String,
    default: '',
  },
  ingredients: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  original_price: {
    type: Number,
  },
  // Macro profile
  calories: {
    type: Number,
    required: true,
    default: 350,
  },
  protein_g: {
    type: Number,
    required: true,
    default: 20.0,
  },
  carbs_g: {
    type: Number,
    required: true,
    default: 30.0,
  },
  fat_g: {
    type: Number,
    required: true,
    default: 10.0,
  },
  fiber_g: {
    type: Number,
    default: 5.0,
  },
  is_veg: {
    type: Boolean,
    default: true,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  total_orders: {
    type: Number,
    default: 50,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  tags: {
    type: String,
    default: 'High Protein, Clean Eats',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

foodSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

foodSchema.set('toJSON', { virtuals: true });
foodSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);
