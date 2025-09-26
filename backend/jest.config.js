module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Coverage configuration
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!server.js',
    '!tests/ui/**', // UI tests have their own configuration
    '!cucumber.js',
    '!features/**'
  ],
  
  // Test timeout (30 seconds for API tests, longer for UI tests)
  testTimeout: 30000,
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '!**/tests/ui/**' // UI tests use different timeout settings
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Module paths
  roots: ['<rootDir>'],
  
  // Transform configuration
  transform: {},
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage',
      filename: 'jest-report.html',
      expand: true
    }]
  ],
  
  // Verbose output
  verbose: true,
  
  // Collect coverage from specific files
  collectCoverage: true,
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'clover'
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // Global variables
  globals: {
    'NODE_ENV': 'test'
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'json'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true
};