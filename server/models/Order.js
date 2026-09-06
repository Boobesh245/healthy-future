const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
  },
  food_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  items: [orderItemSchema],
  total_amount: {
    type: Number,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  delivery_notes: {
    type: String,
    default: '',
  },
  payment_method: {
    type: String,
    enum: ['cod', 'card', 'upi'],
    default: 'cod',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('save', function (next) {
  if (!this.order_number) {
    this.order_number = 'HF' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
