const express = require('express');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, specialInstructions, deliveryAddress, phone } = req.body;

    // Validate and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food || !food.available) {
        return res.status(400).json({ 
          message: `Food item ${food ? food.name : 'unknown'} is not available` 
        });
      }

      const itemTotal = food.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        price: food.price
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      specialInstructions,
      deliveryAddress: deliveryAddress || req.user.address,
      phone: phone || req.user.phone
    });

    await order.save();
    await order.populate('items.food user');

    res.status(201).json({ 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food')
      .populate('user', 'username fullName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.food')
      .populate('user', 'username fullName')
      .populate('confirmedBy', 'username');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only see their own orders, admins can see all
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only, with password confirmation handled in admin routes)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'confirmed') {
      order.confirmedBy = req.user._id;
      order.confirmedAt = new Date();
    }

    await order.save();
    await order.populate('items.food user');

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (Users can cancel pending orders)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only cancel their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    let filter = {};
    
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.food')
      .populate('user', 'username fullName phone')
      .populate('confirmedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;