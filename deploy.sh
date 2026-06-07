#!/bin/bash

# Isis AI Video Generator - Deployment Script

echo "🚀 Isis AI Video Generator - Deployment Setup"
echo "=============================================="

# Check Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing server dependencies..."
npm install

echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Build client
echo ""
echo "🔨 Building client..."
cd client
npm run build
cd ..

# Create env file if doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your API keys and configuration"
echo "2. Make sure MongoDB and Redis are running"
echo "3. Run 'npm run dev' for development"
echo "4. Run 'npm start' for production"
echo ""
echo "🌐 Access:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo "- Admin: /admin (after creating admin user)"
echo ""
