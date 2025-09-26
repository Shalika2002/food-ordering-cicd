// UI test setup file
console.log('🖥️  Setting up UI test environment...');

// Global setup for UI tests
beforeAll(async () => {
  // Set longer timeout for UI operations
  jest.setTimeout(60000);
  
  console.log('🌐 UI test environment ready');
  console.log('📋 Prerequisites:');
  console.log('   - Frontend running on http://localhost:3000');
  console.log('   - Backend API running on http://localhost:5000');
  console.log('   - Chrome browser available');
});

// Cleanup after UI tests
afterAll(async () => {
  console.log('🧹 UI test cleanup completed');
});

// Handle UI test errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('UI Test - Unhandled Rejection at:', promise, 'reason:', reason);
});

// UI test utilities
global.uiTestUtils = {
  // Common timeouts
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000
  },
  
  // Test URLs
  urls: {
    frontend: 'http://localhost:3000',
    backend: 'http://localhost:5000'
  },
  
  // Test data for UI tests
  testUsers: {
    valid: {
      username: 'uitestuser',
      password: 'uitest123',
      email: 'uitest@example.com',
      fullName: 'UI Test User'
    },
    invalid: {
      username: 'invaliduser',
      password: 'wrongpass'
    }
  },
  
  // Screenshot helper
  takeScreenshot: async (driver, filename = 'screenshot') => {
    try {
      const screenshot = await driver.takeScreenshot();
      const fs = require('fs');
      const path = require('path');
      
      const screenshotDir = path.join(__dirname, 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(screenshotDir, `${filename}-${timestamp}.png`);
      
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      
      return screenshotPath;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }
};

console.log('✅ UI test setup completed');