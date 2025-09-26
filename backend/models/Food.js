const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Pizza', 'Burger', 'Pasta', 'Salad']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 5 // minutes
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);