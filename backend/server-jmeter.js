const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

// Security Middleware
app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodorders', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit the process, just log the error
    console.log('Server will continue without database connection');
  }
};

connectDB();

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Food Ordering API is running!', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Test route for JMeter
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces

// Only start the server if this file is run directly, not when required for testing
if (require.main === module) {
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`🔍 MongoDB status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Please check if another server is running.`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      mongoose.connection.close();
    });
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      mongoose.connection.close();
    });
  });
}

module.exports = app;