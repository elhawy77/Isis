require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Queue = require('bull');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isis-video-gen', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Create Job Queue for Video Processing
const videoQueue = new Queue('video-generation', {
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' }
});

// Job processing
videoQueue.process(10, async (job) => {
  console.log(`Processing job ${job.id}:`, job.data);
  
  // Update socket clients
  io.emit('job-progress', {
    jobId: job.id,
    progress: 0,
    status: 'processing',
    message: 'Starting video generation...'
  });

  try {
    const { generateVideo } = require('./services/videoGenerator');
    const result = await generateVideo(job.data, (progress) => {
      job.progress(progress);
      io.emit('job-progress', {
        jobId: job.id,
        progress,
        status: 'processing'
      });
    });
    return result;
  } catch (err) {
    console.error('Job error:', err);
    io.emit('job-error', { jobId: job.id, error: err.message });
    throw err;
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/models', require('./routes/models'));
app.use('/api/user', require('./routes/user'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), queue: videoQueue.name });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Export queue for route handlers
app.locals.videoQueue = videoQueue;
app.locals.io = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AI Video Generator running on port ${PORT}`);
});

module.exports = { app, io, videoQueue };
