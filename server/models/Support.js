const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: String,
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['billing', 'technical', 'feature_request', 'bug_report', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'support']
    },
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: Date
}, { timestamps: true });

supportSchema.index({ user: 1, status: 1 });
supportSchema.index({ ticketId: 1 });
supportSchema.index({ status: 1, priority: -1 });

module.exports = mongoose.model('Support', supportSchema);
