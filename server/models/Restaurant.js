const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    default: '',
  },
  tagline: {
    type: String,
    default: 'Healthy, Clean Cuisine',
  },
  cuisine: {
    type: String,
    default: 'Organic & High Protein',
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: 'Coimbatore',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  total_reviews: {
    type: Number,
    default: 120,
  },
  delivery_time_mins: {
    type: Number,
    default: 30,
  },
  delivery_charge: {
    type: Number,
    default: 30.0,
  },
  minimum_order: {
    type: Number,
    default: 100.0,
  },
  is_pure_veg: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  logo_image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  },
  banner_image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

restaurantSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

restaurantSchema.set('toJSON', { virtuals: true });
restaurantSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
