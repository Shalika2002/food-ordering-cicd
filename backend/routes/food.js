const express = require('express');
const Food = require('../models/Food');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all food items
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search food items by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchRegex = new RegExp(q, 'i'); // Case-insensitive search
    const foods = await Food.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ]
    });
    
    res.json(foods);
  } catch (error) {
    console.error('Search food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Get food error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({ message: 'Invalid food ID format' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new food item (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, preparationTime } = req.body;

    const food = new Food({
      name,
      description,
      price,
      category,
      image,
      preparationTime
    });

    await food.save();
    res.status(201).json({ message: 'Food item created successfully', food });
  } catch (error) {
    console.error('Create food error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: validationErrors.join(', ') });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food item (Users can update, Admin confirms availability)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, preparationTime, available } = req.body;
    
    const updateData = {
      name,
      description,
      price,
      category,
      image,
      preparationTime
    };

    // Only admin can change availability
    if (req.user.isAdmin && available !== undefined) {
      updateData.available = available;
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item updated successfully', food });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food item (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Food.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;