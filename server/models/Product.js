const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  platform: {
    type: String,
    required: true
  },
  delivery: {
    type: Number,
    default: 1
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: '🛒'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
