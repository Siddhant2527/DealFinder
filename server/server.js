const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
let databaseConnection;

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");

  if (!databaseConnection) {
    databaseConnection = mongoose.connect(process.env.MONGO_URI)
      .catch((error) => {
        databaseConnection = null;
        throw error;
      });
  }
  await databaseConnection;
};

app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    mode: process.env.MONGO_URI ? "database" : "demo",
  });
});

app.use("/api/auth", async (_req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({ msg: "Database unavailable. Check the deployment MONGO_URI setting." });
  }
}, require("./routes/auth"));

app.use("/api/products", require("./routes/products"));
app.use("/api/ai", require("./routes/ai"));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
