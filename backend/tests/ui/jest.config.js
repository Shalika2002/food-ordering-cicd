// Jest configuration for UI tests specifically
module.exports = {
  // Test environment for UI tests
  testEnvironment: 'node',
  
  // UI tests take longer due to browser automation
  testTimeout: 60000,
  
  // Only run UI test files
  testMatch: [
    '**/tests/ui/**/*.test.js'
  ],
  
  // Setup and teardown
  setupFilesAfterEnv: ['<rootDir>/setup-ui.js'],
  
  // No coverage for UI tests (they test integration, not code coverage)
  collectCoverage: false,
  
  // Sequential test execution for UI tests to avoid conflicts
  maxWorkers: 1,
  
  // Verbose output for better debugging
  verbose: true,
  
  // Don't clear mocks for UI tests
  clearMocks: false,
  
  // Global variables for UI tests
  globals: {
    'NODE_ENV': 'test',
    'UI_TEST_MODE': true
  }
};