const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  
  profile: {
    avatar: String,
    bio: String,
    name: String
  },
  
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, default: 'active' },
    credits: { type: Number, default: 10 },
    creditsUsed: { type: Number, default: 0 },
    renewalDate: Date,
    stripeId: String
  },
  
  stats: {
    videosGenerated: { type: Number, default: 0 },
    totalProcessingTime: { type: Number, default: 0 },
    apiCallsRemaining: Number
  },
  
  preferences: {
    defaultModel: { type: String, default: 'runway' },
    defaultQuality: { type: String, default: 'high' },
    defaultStyle: { type: String, default: 'cinematic' },
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' }
  },
  
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
