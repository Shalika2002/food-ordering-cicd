module.exports = {
  // Test environment for UI tests
  testEnvironment: 'node',
  
  // Extended timeout for UI tests
  testTimeout: 60000,
  
  // Test file patterns for UI tests only
  testMatch: [
    '**/tests/ui/**/*.test.js'
  ],
  
  // Setup files for UI tests
  setupFilesAfterEnv: ['<rootDir>/setup-ui.js'],
  
  // Module paths
  roots: ['<rootDir>/../..'],
  
  // Transform configuration
  transform: {},
  
  // Verbose output for debugging
  verbose: true,
  
  // Don't collect coverage for UI tests
  collectCoverage: false,
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'json'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Test environment options
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // Global variables
  globals: {
    'NODE_ENV': 'test'
  }
};