#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 DealFinder Setup Script');
console.log('==========================\n');

// Check if .env exists in server directory
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ env.example not found. Creating basic .env file...');
    const envContent = `PORT=5000
MONGO_URI=mongodb://localhost:27017/dealfinder
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Basic .env file created!');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update the .env file with your MongoDB connection string');
console.log('3. Generate a secure JWT_SECRET');
console.log('4. Run: npm run dev');
console.log('\n🎉 Happy coding!');
