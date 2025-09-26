# Test Environment Configuration

This file documents the test environment setup and configuration for the Food Ordering System.

## Test Types

### 1. Unit Tests
- **Location**: `tests/unit/`
- **Framework**: Jest
- **Purpose**: Test individual functions and methods in isolation
- **Coverage**: UserValidationService, FoodService

### 2. API Tests
- **Location**: `tests/api/`
- **Framework**: Jest + Supertest
- **Purpose**: Test REST API endpoints for functionality and data validation
- **Coverage**: Authentication endpoints, Food management endpoints

### 3. UI Tests
- **Location**: `tests/ui/`
- **Framework**: Jest + Selenium WebDriver
- **Purpose**: Test user interface functionality and user workflows
- **Coverage**: Login functionality, Food menu and cart management

### 4. BDD Tests
- **Location**: `features/`
- **Framework**: Cucumber.js
- **Purpose**: Behavior-driven testing with Gherkin scenarios
- **Coverage**: User validation, Food management

## Test Configuration

### Jest Configuration
```json
{
  "testEnvironment": "node",
  "coverageDirectory": "coverage",
  "collectCoverageFrom": [
    "**/*.js",
    "!node_modules/**",
    "!coverage/**",
    "!server.js",
    "!tests/ui/**"
  ],
  "testTimeout": 30000
}
```

### Environment Variables for Testing
- `TEST_MONGODB_URI`: MongoDB connection string for test database
- `NODE_ENV`: Set to 'test' during testing
- `PORT`: Alternative port for test server

## Test Scripts

- `npm run test`: Run unit tests only
- `npm run test:api`: Run API tests
- `npm run test:ui`: Run UI tests (requires Chrome browser)
- `npm run test:bdd`: Run BDD tests
- `npm run test:all`: Run unit, API, and BDD tests
- `npm run test:all-with-ui`: Run all tests including UI tests
- `npm run test:coverage`: Run tests with coverage report

## Prerequisites for Running Tests

### For All Tests
- Node.js 14+ installed
- MongoDB running locally or connection to test database
- All npm dependencies installed (`npm install`)

### For UI Tests
- Google Chrome browser installed
- ChromeDriver (automatically managed by selenium-webdriver)
- Frontend application running on localhost:3000
- Backend API running on localhost:5000

### For API Tests
- Backend server accessible
- Test database available and empty before tests

## Test Data Management

### Database Setup
- Tests use a separate test database to avoid affecting production data
- Each test suite cleans up its test data after execution
- Test users and food items are created and deleted as needed

### Mock Data
- Unit tests use mocked dependencies
- API tests use real database connections with test data
- UI tests may use either real or mocked backend depending on test scope

## Continuous Integration

Tests are configured to run in CI/CD pipeline with the following stages:
1. Install dependencies
2. Start services (MongoDB, Backend API, Frontend)
3. Run unit tests
4. Run API tests
5. Run BDD tests
6. Generate and publish test reports
7. Cleanup resources

## Troubleshooting

### Common Issues
1. **MongoDB connection errors**: Ensure MongoDB is running and accessible
2. **UI test failures**: Check that both frontend and backend servers are running
3. **Port conflicts**: Ensure required ports (3000, 5000) are available
4. **ChromeDriver issues**: Update selenium-webdriver package or install ChromeDriver manually

### Debug Mode
- Add `--verbose` flag to Jest commands for detailed output
- Use `console.log` statements in tests for debugging
- Check browser console for UI test issues
- Verify API responses with tools like Postman

## Test Reports

- Coverage reports are generated in `coverage/` directory
- HTML coverage report available at `coverage/lcov-report/index.html`
- Test results are logged to console and can be exported to files
- CI/CD pipeline generates and archives test reports