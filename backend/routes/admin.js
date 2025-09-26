const express = require('express');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');
const User = require('../models/User');
const Food = require('../models/Food');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin password for order confirmations (In production, this should be in environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Verify admin password for order confirmation
router.post('/verify-password', auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    // Simple password check (in production, use hashed passwords)
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    res.json({ message: 'Password verified successfully' });
  } catch (error) {
    console.error('Admin password verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm order with admin password
router.post('/confirm-order/:orderId', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const { orderId } = req.params;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be confirmed' });
    }

    order.status = 'confirmed';
    order.confirmedBy = req.user._id;
    order.confirmedAt = new Date();
    
    await order.save();
    await order.populate('items.food user');

    res.json({ message: 'Order confirmed successfully', order });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'preparing', 'ready', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'username fullName')
      .populate('items.food', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Popular food items
    const popularFoods = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.food', 
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: { 
        from: 'foods', 
        localField: '_id', 
        foreignField: '_id', 
        as: 'food' 
      }},
      { $unwind: '$food' }
    ]);

    res.json({
      statistics: {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      popularFoods
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user admin status
router.put('/users/:userId/admin', adminAuth, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User admin status updated successfully', user });
  } catch (error) {
    console.error('Update user admin status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Food management - Toggle availability
router.put('/food/:foodId/availability', adminAuth, async (req, res) => {
  try {
    const { available } = req.body;
    const { foodId } = req.params;

    const food = await Food.findByIdAndUpdate(
      foodId,
      { available },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food availability updated successfully', food });
  } catch (error) {
    console.error('Update food availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;