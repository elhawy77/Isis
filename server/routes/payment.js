const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const { authenticate } = require('../middleware/auth');

// PayPal plans
const PLANS = {
  pro: {
    name: 'Pro Plan',
    price: 19,
    credits: 1000,
    features: {
      maxResolution: '4K',
      watermarkFree: true,
      batchProcessing: true,
      prioritySupport: true
    }
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 149,
    credits: 10000,
    features: {
      maxResolution: '8K',
      watermarkFree: true,
      batchProcessing: true,
      apiAccess: true,
      customModels: true,
      prioritySupport: true,
      analytics: true
    }
  }
};

// Generate PayPal payment link
router.post('/paypal/create-payment', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user._id);

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planData = PLANS[plan];
    const amount = planData.price;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      user: user._id,
      amount,
      planName: planData.name,
      paymentMethod: 'paypal',
      status: 'pending',
      lineItems: [{
        description: `${planData.name} - Monthly Subscription`,
        quantity: 1,
        price: amount,
        total: amount
      }],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await invoice.save();

    // PayPal link with embedded invoice
    const paypalLink = `https://www.paypal.com/ncp/payment/Z5ELPJAM6QN7L?invoice=${invoiceNumber}&amount=${amount}&currency=USD`;

    res.json({
      success: true,
      paymentLink: paypalLink,
      invoiceId: invoice._id,
      invoiceNumber,
      plan,
      amount,
      planName: planData.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook - Payment successful
router.post('/paypal/webhook', async (req, res) => {
  try {
    const { event_type, resource } = req.body;

    if (event_type === 'BILLING.SUBSCRIPTION.CREATED' || event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const invoice = await Invoice.findOne({ paypalTransactionId: resource.id });
      if (!invoice) return res.json({ success: false });

      // Update subscription
      const plan = Object.keys(PLANS).find(p => PLANS[p].name === invoice.planName) || 'pro';
      const planData = PLANS[plan];

      let subscription = await Subscription.findOne({ user: invoice.user });
      if (!subscription) {
        subscription = new Subscription({
          user: invoice.user,
          plan,
          status: 'active',
          paypalSubscriptionId: resource.id,
          credits: { total: planData.credits, remaining: planData.credits },
          features: planData.features,
          price: planData.price,
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      } else {
        subscription.plan = plan;
        subscription.status = 'active';
        subscription.credits.total = planData.credits;
        subscription.credits.remaining = planData.credits;
        subscription.features = planData.features;
        subscription.price = planData.price;
        subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await subscription.save();
      await subscription.populate('user');

      // Update invoice
      invoice.status = 'paid';
      invoice.paypalTransactionId = resource.id;
      invoice.paidDate = new Date();
      await invoice.save();

      // Update user subscription
      const user = await User.findByIdAndUpdate(
        invoice.user,
        { subscription: subscription._id },
        { new: true }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get billing history
router.get('/invoices', authenticate, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get invoice details
router.get('/invoices/:id', authenticate, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice || invoice.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
