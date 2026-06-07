const express = require('express');
const router = express.Router();

const models = [
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3',
    provider: 'runway',
    type: 'text-to-video',
    features: ['text-to-video', 'image-to-video', 'real-time-editing'],
    maxDuration: 10,
    maxResolution: '4K',
    quality: 9,
    speed: 8,
    creditsPerMinute: 5,
    description: 'Most versatile AI video generation with advanced motion control'
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine',
    provider: 'luma',
    type: 'text-to-video',
    features: ['text-to-video', 'image-to-video', 'smooth-motion'],
    maxDuration: 5,
    maxResolution: '1080p',
    quality: 8,
    speed: 7,
    creditsPerMinute: 4,
    description: 'Smooth camera movements and realistic scene rendering'
  },
  {
    id: 'stable-video',
    name: 'Stable Video Diffusion',
    provider: 'stable-video',
    type: 'image-to-video',
    features: ['image-to-video', 'open-source', 'customizable'],
    maxDuration: 4,
    maxResolution: '1024x576',
    quality: 7,
    speed: 8,
    creditsPerMinute: 2,
    description: 'Open-source image-to-video with high customization'
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, models, total: models.length });
});

router.get('/:id', (req, res) => {
  const model = models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: 'Model not found' });
  res.json({ success: true, data: model });
});

module.exports = router;
