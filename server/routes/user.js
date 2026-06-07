const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authenticate } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('subscription');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, name, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        'profile.name': name,
        'profile.bio': bio,
        'profile.avatar': avatar
      },
      { new: true }
    ).populate('subscription');

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get subscription
router.get('/subscription', authenticate, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    res.json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check credits
router.get('/credits', authenticate, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    res.json({
      success: true,
      credits: subscription?.credits || { total: 0, used: 0, remaining: 0 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
