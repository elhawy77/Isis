#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./server/models/User');
const Subscription = require('./server/models/Subscription');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const admin = new User({
      username: 'admin',
      email: 'ma9933151@gmail.com',
      password: 'Admin@12345', // Change immediately after login!
      profile: {
        name: 'System Administrator',
        bio: 'Isis AI Video Generator Admin'
      },
      isAdmin: true,
      isVerified: true
    });

    const savedAdmin = await admin.save();

    const subscription = new Subscription({
      user: savedAdmin._id,
      plan: 'enterprise',
      status: 'active',
      credits: { total: Infinity, remaining: Infinity },
      features: {
        textToVideo: true,
        imageToVideo: true,
        multiImageVideo: true,
        maxResolution: '8K',
        maxDuration: 120,
        batchProcessing: true,
        apiAccess: true,
        watermarkFree: true,
        customModels: true,
        prioritySupport: true,
        analytics: true
      }
    });

    await subscription.save();
    savedAdmin.subscription = subscription._id;
    await savedAdmin.save();

    console.log('\n✅ Admin user created successfully!\n');
    console.log('Login credentials:');
    console.log('Email: ma9933151@gmail.com');
    console.log('Password: Admin@12345');
    console.log('\n⚠️  IMPORTANT: Change the password immediately after logging in!');
    console.log('\nAccess admin dashboard at: /admin\n');

    process.exit(0);
  } catch (err) {
    if (err.code === 11000) {
      console.log('❌ Admin user already exists!');
    } else {
      console.error('❌ Error creating admin:', err.message);
    }
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Database connection error:', err.message);
  process.exit(1);
});
