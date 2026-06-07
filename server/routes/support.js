const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Create support ticket
router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { subject, category, description, priority } = req.body;
    const user = await User.findById(req.user._id);

    const ticketId = `TICKET-${Date.now()}`;

    const ticket = new Support({
      ticketId,
      user: req.user._id,
      email: user.email,
      subject,
      category,
      description,
      priority,
      messages: [{
        sender: 'user',
        name: user.username,
        email: user.email,
        message: description
      }]
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      ticketId: ticket.ticketId,
      message: 'Ticket created successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user tickets
router.get('/tickets', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };
    if (status) query.status = status;

    const tickets = await Support.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ticket details
router.get('/tickets/:ticketId', authenticate, async (req, res) => {
  try {
    const ticket = await Support.findOne({ ticketId: req.params.ticketId });

    if (!ticket || ticket.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add message to ticket
router.post('/tickets/:ticketId/message', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user._id);

    const ticket = await Support.findOne({ ticketId: req.params.ticketId });

    if (!ticket || ticket.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: 'user',
      name: user.username,
      email: user.email,
      message
    });

    ticket.status = 'in_progress';
    await ticket.save();

    res.json({ success: true, message: 'Message added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
