// Test setup file - runs before all tests
const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Set longer timeout for database operations
  jest.setTimeout(30000);
  
  // Suppress console logs during tests (uncomment if needed)
  // console.log = jest.fn();
  // console.error = jest.fn();
  
  console.log('🧪 Test environment initialized');
});

// Global test cleanup
afterAll(async () => {
  // Close any open database connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  
  console.log('🧹 Test cleanup completed');
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Custom Jest matchers (if needed)
expect.extend({
  toBeValidObjectId(received) {
    const isValid = /^[0-9a-fA-F]{24}$/.test(received);
    if (isValid) {
      return {
        message: () => `expected ${received} not to be a valid ObjectId`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ObjectId`,
        pass: false,
      };
    }
  },
});

// Test utilities
global.testUtils = {
  // Generate random test data
  generateRandomString: (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
  },
  
  // Generate test user data
  generateTestUser: (overrides = {}) => {
    const random = global.testUtils.generateRandomString(8);
    return {
      username: `testuser_${random}`,
      email: `test_${random}@example.com`,
      password: 'testpass123',
      fullName: `Test User ${random}`,
      phone: '+1234567890',
      address: '123 Test St, Test City',
      ...overrides
    };
  },
  
  // Generate test food data
  generateTestFood: (overrides = {}) => {
    const random = global.testUtils.generateRandomString(6);
    return {
      name: `Test Food ${random}`,
      description: `Test description for ${random}`,
      price: Math.floor(Math.random() * 20) + 5, // Random price between 5-25
      category: 'Test Category',
      preparationTime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
      available: true,
      ...overrides
    };
  },
  
  // Wait helper for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Database cleanup helper
  cleanupTestData: async () => {
    if (mongoose.connection.readyState !== 0) {
      const collections = await mongoose.connection.db.collections();
      
      for (let collection of collections) {
        // Only cleanup test data (items with 'test' in name/username)
        await collection.deleteMany({
          $or: [
            { username: { $regex: /test/i } },
            { name: { $regex: /test/i } },
            { email: { $regex: /test/i } }
          ]
        });
      }
    }
  }
};

console.log('✅ Test setup file loaded successfully');