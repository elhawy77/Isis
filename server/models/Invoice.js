const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  amount: Number,
  currency: { type: String, default: 'USD' },
  planName: String,
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  paypalTransactionId: String,
  dueDate: Date,
  paidDate: Date,
  lineItems: [{
    description: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ invoiceNumber: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
