const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');
const { authenticate } = require('../middleware/auth');

// Get user videos
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const videos = await Video.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments({ user: req.user._id });

    res.json({ success: true, videos, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete video
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video || video.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Refund credits if generation failed
    if (video.status === 'failed' && video.credits?.used) {
      const subscription = await Subscription.findOne({ user: req.user._id });
      subscription.credits.used -= video.credits.used;
      subscription.credits.remaining += video.credits.used;
      await subscription.save();
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
