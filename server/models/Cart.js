const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

cartItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
cartItemSchema.set('toJSON', { virtuals: true });
cartItemSchema.set('toObject', { virtuals: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  delivery_charge: {
    type: Number,
    default: 30.0,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.methods.calculateTotals = function () {
  let subtotal = 0;
  for (const item of this.items) {
    subtotal += (item.price || 0) * (item.quantity || 1);
  }
  const delivery_charge = subtotal > 0 ? (this.delivery_charge || 30.0) : 0;
  const total = subtotal + delivery_charge;
  return {
    subtotal: subtotal.toFixed(2),
    delivery_charge: delivery_charge.toFixed(2),
    total: total.toFixed(2),
  };
};

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
