const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sample data for testing
const foods = [
    { id: 1, name: 'Pizza Margherita', price: 12.99, category: 'Main Course', image: 'pizza.jpg' },
    { id: 2, name: 'Cheeseburger', price: 8.99, category: 'Main Course', image: 'burger.jpg' },
    { id: 3, name: 'Caesar Salad', price: 6.99, category: 'Salad', image: 'salad.jpg' },
    { id: 4, name: 'Pasta Carbonara', price: 11.50, category: 'Main Course', image: 'pasta.jpg' },
    { id: 5, name: 'Fish & Chips', price: 9.99, category: 'Main Course', image: 'fish.jpg' }
];

let orders = [];
let orderIdCounter = 1;

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Food Ordering API - JMeter Test Server', 
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/food - Get all food items',
            'POST /api/orders - Create an order',
            'POST /api/auth/login - Login (returns test token)',
            'GET /api/health - Health check'
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'JMeter Test Server',
        port: PORT
    });
});

// Food endpoints
app.get('/api/food', (req, res) => {
    res.json({
        success: true,
        data: foods,
        count: foods.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/food/:id', (req, res) => {
    const food = foods.find(f => f.id === parseInt(req.params.id));
    if (!food) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, data: food });
});

// Auth endpoint (simple test implementation)
app.post('/api/auth/login', (req, res) => {
    const { username, password, email } = req.body;
    
    // Simple test authentication - accepts any credentials
    if (username || email) {
        const token = 'test-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: 1,
                username: username || 'testuser',
                email: email || 'test@example.com'
            },
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Username or email required',
            timestamp: new Date().toISOString()
        });
    }
});

// Orders endpoint
app.post('/api/orders', (req, res) => {
    const { items, customerInfo, notes } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Items array is required and cannot be empty'
        });
    }
    
    // Calculate total
    let total = 0;
    const orderItems = items.map(item => {
        const food = foods.find(f => f.id === item.foodId);
        if (food) {
            const itemTotal = food.price * (item.quantity || 1);
            total += itemTotal;
            return {
                foodId: item.foodId,
                name: food.name,
                price: food.price,
                quantity: item.quantity || 1,
                itemTotal: itemTotal
            };
        }
        return null;
    }).filter(item => item !== null);
    
    if (orderItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No valid food items found in order'
        });
    }
    
    const order = {
        id: orderIdCounter++,
        items: orderItems,
        total: Math.round(total * 100) / 100, // Round to 2 decimal places
        customerInfo: customerInfo || { name: 'Test Customer' },
        notes: notes || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
    };
    
    orders.push(order);
    
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/orders', (req, res) => {
    res.json({
        success: true,
        data: orders,
        count: orders.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
});

// Error handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

app.use((error, req, res, next) => {
    console.error('Server Error:', error.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server - IMPORTANT: Bind to all interfaces (0.0.0.0)
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 JMeter Test Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Access locally: http://localhost:${PORT}`);
    console.log(`🍕 Food API: http://localhost:${PORT}/api/food`);
    console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
    console.log(`💊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\n✅ Server ready for JMeter load testing!`);
});

server.on('error', (error) => {
    console.error('❌ Server Error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Please stop other servers or use a different port.`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
    });
});

module.exports = app;