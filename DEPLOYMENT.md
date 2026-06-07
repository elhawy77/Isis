# Isis AI Video Generator - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or self-hosted)
- Redis (for job queue)
- Docker (optional)

### Environment Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/elhawy77/Isis.git
   cd Isis
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

4. **Set Your Production Variables**
   ```env
   # Production
   NODE_ENV=production
   PORT=5000

   # Database
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string

   # APIs
   RUNWAY_API_KEY=your_runway_key
   LUMA_API_KEY=your_luma_key
   STABLE_VIDEO_API_KEY=your_stable_video_key
   REPLICATE_API_TOKEN=your_replicate_token

   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET=your_paypal_secret

   # Email
   EMAIL_USER=ma9933151@gmail.com
   EMAIL_PASSWORD=your_app_password

   # JWT
   JWT_SECRET=your_secret_key_here

   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_S3_BUCKET=isis-videos
   AWS_REGION=us-east-1

   # URLs
   CLIENT_URL=https://yourdomain.com
   API_URL=https://api.yourdomain.com
   ```

### Database Setup

1. **MongoDB Atlas (Recommended)**
   - Go to mongodb.com/cloud/atlas
   - Create cluster
   - Get connection string
   - Add to `.env` as `MONGODB_URI`

2. **Redis Setup**
   - Use Redis Cloud or self-hosted
   - Get connection URL
   - Add to `.env` as `REDIS_URL`

### Running Locally

```bash
# Start all services
npm run dev

# Server: http://localhost:5000
# Client: http://localhost:3000
```

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t isis-ai-video-generator .
   ```

2. **Run Container**
   ```bash
   docker run -p 5000:5000 \
     -e MONGODB_URI=your_mongodb_uri \
     -e REDIS_URL=your_redis_url \
     isis-ai-video-generator
   ```

3. **Docker Compose (Production)**
   Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=${MONGODB_URI}
         - REDIS_URL=${REDIS_URL}
       restart: always

     redis:
       image: redis:7
       ports:
         - "6379:6379"
       restart: always

     mongodb:
       image: mongo:5
       ports:
         - "27017:27017"
       restart: always
   ```

   Run:
   ```bash
   docker-compose up -d
   ```

### Production Hosting Options

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create isis-ai-video-generator

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set REDIS_URL="your_redis_url"

# Deploy
git push heroku main
```

#### Option 2: AWS (EC2 + RDS + ElastiCache)

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.medium or larger
   - Open ports 80, 443, 5000

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Clone repository
   git clone https://github.com/elhawy77/Isis.git
   cd Isis

   # Install dependencies
   npm install
   cd client && npm run build && cd ..

   # Start with PM2
   pm2 start server/index.js --name "isis-api"
   pm2 startup
   pm2 save
   ```

4. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   server {
       listen 80 default_server;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo systemctl restart nginx
   ```

5. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Option 3: DigitalOcean App Platform

1. Go to app.digitalocean.com
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Database Backups

```bash
# MongoDB Backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/isis"

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/isis" dump/
```

### Monitoring & Logs

```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs isis-api

# Watch logs in real-time
pm2 logs isis-api --lines 100 --follow
```

### Performance Optimization

1. **Enable GZIP Compression** (Nginx)
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json;
   ```

2. **CDN Setup** (CloudFlare)
   - Add DNS records
   - Enable caching
   - Setup SSL

3. **Database Indexing**
   ```javascript
   // Already configured in models
   ```

4. **Redis Caching**
   - Cache API responses
   - Session storage
   - Job queue

### Admin Account Setup

```bash
# Create first admin user
node scripts/create-admin.js
```

Script content:
```javascript
const User = require('./server/models/User');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

async function createAdmin() {
  const admin = new User({
    username: 'admin',
    email: 'ma9933151@gmail.com',
    password: 'Admin@123', // Change this!
    isAdmin: true
  });
  await admin.save();
  console.log('✅ Admin created successfully');
  process.exit();
}

createAdmin().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
```

### Health Checks

- **API Health**: `GET /api/health`
- **Database**: Connected
- **Redis**: Connected
- **Response Time**: < 100ms

### Scaling

1. **Horizontal Scaling**
   - Load balancer (AWS ALB, Nginx)
   - Multiple API instances
   - Shared Redis + MongoDB

2. **Vertical Scaling**
   - Larger EC2 instance
   - More RAM for Redis
   - Database optimization

### Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Database authentication
- ✅ Rate limiting enabled
- ✅ CORS properly configured
- ✅ Input validation
- ✅ API keys rotated regularly

### Support

For deployment issues:
- Email: ma9933151@gmail.com
- Phone: +20 201143628812
- Address: Cairo, Egypt
