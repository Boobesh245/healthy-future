require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');

// Route imports
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const foodRoutes = require('./routes/foods');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const ownerRoutes = require('./routes/owner');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Ensure MongoDB is connected before handling any API request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    res.status(503).json({
      success: false,
      message: 'MongoDB connection failed. Please check MONGODB_URI configuration.',
      error: err.message,
    });
  }
});

// Root API Index & Healthcheck
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Healthy Future MongoDB API is live on Vercel!',
    database: 'MongoDB Atlas',
    version: '2.0.0',
    endpoints: {
      home: '/api/home',
      restaurants: '/api/restaurants',
      foods: '/api/foods',
      categories: '/api/categories',
      auth: '/api/auth',
      cart: '/api/cart',
      orders: '/api/orders',
      owner: '/api/owner',
      admin: '/api/admin',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/home', homeRoutes);

// Export for Vercel Serverless
module.exports = app;

// If run directly with `node index.js`, listen on PORT
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Healthy Future MongoDB API running on http://localhost:${PORT}`);
  });
}
