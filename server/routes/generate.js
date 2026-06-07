const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.post('/text-to-video', authenticate, async (req, res) => {
  try {
    const { prompt, provider, style, duration, fps, resolution, quality, mood } = req.body;

    const user = await User.findById(req.user._id);
    if (user.subscription.creditsUsed >= user.subscription.credits) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    const video = new Video({
      user: req.user._id,
      title: prompt.substring(0, 50),
      description: prompt,
      generationType: 'text-to-video',
      input: { prompt, style, mood },
      model: { provider },
      settings: { duration, fps, resolution, quality },
      status: 'queued'
    });

    await video.save();

    const job = await req.app.locals.videoQueue.add(
      {
        videoId: video._id,
        prompt,
        provider,
        settings: { duration, fps, resolution, quality }
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true
      }
    );

    video.jobId = job.id;
    video.status = 'processing';
    await video.save();

    res.status(202).json({
      success: true,
      videoId: video._id,
      jobId: job.id,
      message: 'Video generation started'
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/status/:videoId', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video || video.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      videoId: video._id,
      status: video.status,
      progress: video.progress,
      videoUrl: video.output?.videoUrl,
      error: video.error
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
