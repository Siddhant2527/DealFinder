const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());                // Allow frontend
app.use(express.json());         // Parse JSON bodies

// --- ENV Variables ---
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// --- DB Connect ---
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  console.log("💡 Using demo mode without database...");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.log("💡 Continuing in demo mode without database...");
    });
}

// --- Health check route ---
app.get("/", (_req, res) => {
  res.send("🚀 DealFinder Backend is running & connected to MongoDB!");
});

app.get("/health", (_req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    mode: MONGO_URI ? "database" : "demo"
  });
});

// --- Routes ---
// ENABLED: Auth routes for user data storage in database
app.use("/api/auth", require("./routes/auth"));

// Add this line for product routes
app.use('/api/products', require('./routes/products'));

// Add AI routes for Gemini API
app.use('/api/ai', require('./routes/ai'));

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
