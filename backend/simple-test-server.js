const express = require('express');
const cors = require('cors');

const app = express();

// CORS
app.use(cors());

// Body parser middleware  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test data
const testFoods = [
  { id: 1, name: 'Pizza', price: 12.99, category: 'Main Course' },
  { id: 2, name: 'Burger', price: 8.99, category: 'Main Course' },
  { id: 3, name: 'Salad', price: 6.99, category: 'Healthy' }
];

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple JMeter Test API is running!', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'mock'
  });
});

// Food endpoint (no auth required for testing)
app.get('/api/food', (req, res) => {
  res.json({
    success: true,
    data: testFoods,
    count: testFoods.length
  });
});

// Simple order endpoint (no auth required for testing)
app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now(),
    items: req.body.items || [{ id: 1, quantity: 1 }],
    total: req.body.total || 12.99,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// Simple auth endpoint (always succeeds for testing)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: 'test-jwt-token-' + Date.now(),
    user: {
      id: 1,
      email: req.body.email || 'test@example.com'
    }
  });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all interfaces

if (require.main === module) {
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Simple JMeter Test Server running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🍕 Food API: http://localhost:${PORT}/api/food`);
    console.log(`📦 Order API: http://localhost:${PORT}/api/orders`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error.message);
  });
}

module.exports = app;