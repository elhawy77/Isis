const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'active'
  },
  credits: {
    total: { type: Number, default: 150 },
    used: { type: Number, default: 0 },
    remaining: { type: Number, default: 150 },
    lastRefilled: Date
  },
  monthlyGeneration: {
    limit: { type: Number, default: Infinity },
    used: { type: Number, default: 0 },
    resetDate: Date
  },
  paymentMethod: String,
  paypalEmail: String,
  paypalTransactionId: String,
  paypalSubscriptionId: String,
  startDate: { type: Date, default: Date.now },
  renewalDate: Date,
  cancelledDate: Date,
  price: { type: Number, default: 0 },
  features: {
    textToVideo: { type: Boolean, default: true },
    imageToVideo: { type: Boolean, default: true },
    multiImageVideo: { type: Boolean, default: true },
    maxResolution: { type: String, default: '1080p' },
    maxDuration: { type: Number, default: 10 },
    batchProcessing: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
    watermarkFree: { type: Boolean, default: false },
    customModels: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ renewalDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
