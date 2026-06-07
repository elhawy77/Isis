const express = require('express');
const router = express.Router();
const aiBot = require('../services/aiBot');
const { authenticate } = require('../middleware/auth');

// Chat with AI bot
router.post('/message', authenticate, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const response = aiBot.generateResponse(message);

    res.json({
      success: true,
      userMessage: message,
      botResponse: response.message,
      timestamp: response.timestamp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
