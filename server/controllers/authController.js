// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ msg: 'Database not available. Please try again later.' });
    }

    // Check if user already exists
    const exists = await User.findOne({ username: username.trim() });
    if (exists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password and create user in database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username: username.trim(), 
      password: hashedPassword 
    });

    console.log('User registered in database:', user.username);
    const token = signToken(user);
    return res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for user:', username);
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ msg: 'Database not available. Please try again later.' });
    }

    // Find user in database
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      console.log('Login failed: User not found -', username.trim());
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(' Login failed: Incorrect password for user -', user.username);
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    console.log(' User logged in from database:', user.username);
    const token = signToken(user);
    return res.json({ token, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
