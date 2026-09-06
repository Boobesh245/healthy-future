const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    const user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: 'This account has been blocked by admin',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        access: token,
        refresh: token,
        user: user.toSafeJSON(),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role = 'customer',
      phone,
      address,
      city,
      restaurant_name,
      cuisine,
      is_pure_veg,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists',
      });
    }

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      first_name: first_name || '',
      last_name: last_name || '',
      role: role === 'hotel_owner' ? 'hotel_owner' : 'customer',
      phone: phone || '',
      address: address || '',
      city: city || 'Coimbatore',
      is_approved: role !== 'hotel_owner', // hotel owners require approval
    });

    await user.save();

    // If hotel owner, automatically create their Restaurant profile
    if (role === 'hotel_owner') {
      const newRestaurant = new Restaurant({
        name: restaurant_name || `${first_name || username}'s Kitchen`,
        owner: user._id,
        cuisine: cuisine || 'Healthy & Organic',
        city: city || 'Coimbatore',
        address: address || '',
        phone: phone || '',
        is_pure_veg: Boolean(is_pure_veg),
        is_approved: false, // awaiting admin
      });
      await newRestaurant.save();
    }

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        access: token,
        refresh: token,
        user: user.toSafeJSON(),
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// Profile get & update
router.get('/profile', authenticate, async (req, res) => {
  return res.json({
    success: true,
    data: req.user.toSafeJSON(),
  });
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, city } = req.body;
    const user = req.user;

    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toSafeJSON(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
