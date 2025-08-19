const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Create a test user
    const testUser = {
      username: 'testuser',
      password: 'testpass123'
    };
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: testUser.username });
    if (existingUser) {
      console.log('ℹ️  Test user already exists');
      return;
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = await User.create({
      username: testUser.username,
      password: hashedPassword
    });
    
    console.log('✅ Test user created successfully!');
    console.log('Username:', testUser.username);
    console.log('Password:', testUser.password);
    console.log('User ID:', user._id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
