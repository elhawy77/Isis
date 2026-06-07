#!/bin/bash

# Quick start script

echo "🚀 Starting Isis AI Video Generator..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run 'npm run setup' first."
    exit 1
fi

# Check if MongoDB is running
echo "Checking MongoDB connection..."
node -e "require('dotenv').config(); require('mongoose').connect(process.env.MONGODB_URI).then(() => { console.log('✅ MongoDB connected'); process.exit(0); }).catch(() => { console.log('❌ MongoDB not accessible'); process.exit(1); })"

if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to MongoDB. Make sure it's running."
    exit 1
fi

# Check if Redis is running
echo "Checking Redis connection..."
node -e "require('dotenv').config(); const redis = require('redis'); redis.createClient({ url: process.env.REDIS_URL }).connect().then(() => console.log('✅ Redis connected')).catch(() => console.log('❌ Redis not accessible'))"

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Start server
echo "🚀 Starting server..."
pm2 start server/index.js --name "isis-api"

echo "✅ Isis running!"
echo "Backend: http://localhost:5000"
echo "View logs: pm2 logs isis-api"
