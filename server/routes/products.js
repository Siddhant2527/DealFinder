// routes/products.js

const express = require("express");
const router = express.Router();

// Import product controller
const productController = require("../controllers/productController");

// Search retailer listings for live electronics offers.
router.get("/scrape", productController.scrapeProducts);

// Export router
module.exports = router;
