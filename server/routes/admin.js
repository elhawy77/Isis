const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const Video = require('../models/Video');
const Support = require('../models/Support');
const { authenticate } = require('../middleware/auth');

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVideos,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeSubscriptions,
        avgCreditsPerUser: Math.round(totalUsers > 0 ? 150 : 0)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (paginated)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .populate('subscription')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { total, pages: Math.ceil(total / limit), current: page }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user details
router.get('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('subscription')
      .populate('stats');

    const videos = await Video.find({ user: req.params.id }).countDocuments();
    const invoices = await Invoice.find({ user: req.params.id });
    const tickets = await Support.find({ user: req.params.id });

    res.json({
      success: true,
      user,
      userStats: {
        videosGenerated: videos,
        totalInvoices: invoices.length,
        totalSpent: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        supportTickets: tickets.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (add/remove admin, edit plan)
router.put('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { isAdmin: adminStatus, subscriptionPlan, credits } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: adminStatus },
      { new: true }
    );

    if (subscriptionPlan || credits) {
      let subscription = await Subscription.findOne({ user: req.params.id });
      if (subscription) {
        subscription.plan = subscriptionPlan || subscription.plan;
        if (credits) {
          subscription.credits.total = credits;
          subscription.credits.remaining = credits - subscription.credits.used;
        }
        await subscription.save();
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Subscription.deleteOne({ user: req.params.id });
    await Video.deleteMany({ user: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all videos (with filters)
router.get('/videos', authenticate, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, user: userId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (userId) query.user = userId;

    const videos = await Video.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments(query);

    res.json({
      success: true,
      videos,
      pagination: { total, pages: Math.ceil(total / limit), current: page }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all invoices
router.get('/invoices', authenticate, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};

    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      invoices,
      pagination: { total, pages: Math.ceil(total / limit), current: page }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get support tickets
router.get('/support', authenticate, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};

    if (status) query.status = status;

    const tickets = await Support.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Support.countDocuments(query);

    res.json({
      success: true,
      tickets,
      pagination: { total, pages: Math.ceil(total / limit), current: page }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to support ticket
router.post('/support/:ticketId/reply', authenticate, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    const admin = await User.findById(req.user._id);

    const ticket = await Support.findOne({ ticketId: req.params.ticketId });
    ticket.messages.push({
      sender: 'support',
      name: admin.username,
      email: admin.email,
      message
    });

    ticket.status = 'in_progress';
    await ticket.save();

    res.json({ success: true, message: 'Reply sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Close ticket
router.put('/support/:ticketId/close', authenticate, isAdmin, async (req, res) => {
  try {
    const ticket = await Support.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      { status: 'resolved', resolvedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
