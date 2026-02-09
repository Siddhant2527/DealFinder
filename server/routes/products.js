// routes/products.js

const express = require("express");
const router = express.Router();

// Import product controller
const productController = require("../controllers/productController");

// Route -> GET /api/products/search?query=iphone
router.get("/search", productController.searchProducts);

// Route -> GET /api/products/scrape?query=iphone  (real-time Flipkart & Amazon)
router.get("/scrape", productController.scrapeProducts);

// Export router
module.exports = router;
