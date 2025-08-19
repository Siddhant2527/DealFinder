# DealFinder - Price Comparison Platform

A modern web application that helps users find the best deals across multiple e-commerce platforms. Built with React, Node.js, and MongoDB.

## Features

- 🔍 **Smart Product Search** - Search across multiple platforms
- 💰 **Price Comparison** - Compare prices from different retailers
- 🤖 **AI Shopping Assistant** - Get AI-powered product reviews and buying guides
- 🛒 **Shopping Cart** - Save items for later
- 🔐 **User Authentication** - Secure login and registration
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dealfinder
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dealfinder
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Set up MongoDB**
   
   If using local MongoDB:
   ```bash
   # Start MongoDB service
   mongod
   ```
   
   Or use MongoDB Atlas and update the MONGO_URI in your .env file.

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
npm run frontend
```

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd server
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products/search?query=<search_term>` - Search products

## Project Structure

```
dealfinder/
├── client/                 # Frontend build files
├── server/                 # Backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   └── main.jsx          # App entry point
├── package.json          # Frontend dependencies
└── README.md             # This file
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your MONGO_URI in .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill processes using the port

3. **JWT Secret Missing**
   - Generate a secure random string for JWT_SECRET
   - Ensure .env file is in the server directory

4. **CORS Errors**
   - Backend is configured to allow all origins in development
   - For production, configure CORS properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes.

## Support

For issues and questions, please create an issue in the repository.
