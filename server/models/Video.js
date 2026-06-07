const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  
  generationType: {
    type: String,
    enum: ['text-to-video', 'image-to-video', 'multi-image', 'video-enhancement'],
    required: true
  },
  
  input: {
    prompt: String,
    imageUrl: String,
    imageUrls: [String],
    videoUrl: String,
    style: {
      type: String,
      enum: ['cinematic', 'realistic', 'animated', 'artistic', 'professional'],
      default: 'cinematic'
    },
    mood: String,
    camera: String
  },
  
  model: {
    provider: {
      type: String,
      enum: ['runway', 'luma', 'stable-video', 'replicate'],
      required: true
    },
    modelName: String,
    version: String
  },
  
  settings: {
    duration: { type: Number, default: 4 },
    fps: { type: Number, default: 24 },
    resolution: {
      type: String,
      enum: ['720p', '1080p', '2K', '4K'],
      default: '1080p'
    },
    quality: {
      type: String,
      enum: ['standard', 'high', 'ultra'],
      default: 'high'
    },
    seed: Number
  },
  
  output: {
    videoUrl: String,
    thumbnailUrl: String,
    format: String,
    fileSize: Number,
    duration: Number,
    resolution: String
  },
  
  status: {
    type: String,
    enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
    default: 'draft'
  },
  jobId: String,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  error: String,
  
  credits: {
    estimated: Number,
    used: Number
  },
  tags: [String],
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
}, { timestamps: true });

videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ status: 1 });
videoSchema.index({ isPublic: 1, likes: -1 });

module.exports = mongoose.model('Video', videoSchema);
