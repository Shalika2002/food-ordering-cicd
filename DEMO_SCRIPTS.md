# Test Automation & CI/CD Demonstration Scripts
## Food Ordering System - Viva Presentation

### Pre-Demonstration Setup

#### 1. Environment Preparation
```bash
# 1. Clone and setup the project
git clone <repository-url>
cd food-ordering-system

# 2. Install dependencies
cd backend
npm install
cd ../frontend
npm install

# 3. Start MongoDB (if not running)
# Windows: 
net start MongoDB
# Linux/Mac:
sudo systemctl start mongod

# 4. Setup environment variables (create .env in backend)
echo "MONGODB_URI=mongodb://localhost:27017/food-ordering" > backend/.env
echo "JWT_SECRET=your-secret-key" >> backend/.env
```

#### 2. Service Startup
```bash
# Terminal 1: Start Backend Server
cd backend
npm run seed    # Seed test data
npm start       # Start on port 5000

# Terminal 2: Start Frontend Server  
cd frontend
npm start       # Start on port 3000

# Terminal 3: Keep for running tests
cd backend
```

---

## 🧪 Test Demonstrations

### 1. Unit Tests Demonstration

```bash
echo "=== UNIT TESTS DEMONSTRATION ==="
echo "Testing UserValidationService and FoodService..."

# Run unit tests with verbose output
npm run test:unit

echo ""
echo "✅ Unit Tests Results:"
echo "- UserValidationService: Input validation, sanitization"
echo "- FoodService: CRUD operations, business logic"
echo "- Coverage: Functions, branches, statements"
```

**Expected Output**:
- All unit tests pass
- Code coverage metrics displayed
- Validation for various input scenarios

### 2. API Tests Demonstration

```bash
echo "=== API TESTS DEMONSTRATION ==="
echo "Testing REST API endpoints..."

# Run API tests
npm run test:api

echo ""
echo "✅ API Tests Results:"
echo "- Authentication endpoints: Register, Login"
echo "- Food management endpoints: CRUD operations"
echo "- Response validation: Status codes, payloads"
echo "- Error handling: Invalid inputs, unauthorized access"
```

**Expected Output**:
- Authentication flow validation
- CRUD operations testing
- Security and authorization checks
- Proper error responses

### 3. UI Tests Demonstration

```bash
echo "=== UI TESTS DEMONSTRATION ==="
echo "Ensure frontend (port 3000) and backend (port 5000) are running..."

# Check if services are running
curl -s http://localhost:5000/ && echo "✅ Backend running" || echo "❌ Backend not running"
curl -s http://localhost:3000/ && echo "✅ Frontend running" || echo "❌ Frontend not running"

echo ""
echo "Running Selenium UI tests..."

# Run UI tests (will open Chrome browser)
npm run test:ui

echo ""
echo "✅ UI Tests Results:"
echo "- Login functionality: Valid/invalid credentials"
echo "- Food menu: Display, cart management" 
echo "- User workflows: End-to-end scenarios"
```

**Expected Output**:
- Chrome browser automation visible
- Login and cart functionality tested
- Screenshots saved on failures

### 4. BDD Tests Demonstration

```bash
echo "=== BDD TESTS DEMONSTRATION ==="
echo "Running Cucumber BDD scenarios..."

# Run BDD tests
npm run test:bdd

echo ""
echo "✅ BDD Tests Results:"
echo "- Gherkin scenarios: User stories in natural language"
echo "- Step definitions: Technical implementation"
echo "- Business validation: User requirements"
```

**Expected Output**:
- Gherkin scenarios execution
- Step-by-step validation
- Business rule verification

### 5. Complete Test Suite

```bash
echo "=== COMPLETE TEST SUITE ==="
echo "Running all automated tests..."

# Run all tests except UI (for speed)
npm run test:all

echo ""
echo "For complete suite including UI tests:"
echo "npm run test:all-with-ui"

echo ""
echo "✅ Complete Suite Results:"
echo "- Unit Tests: ✓"
echo "- API Tests: ✓"  
echo "- BDD Tests: ✓"
echo "- Coverage Report: Generated"
```

### 6. Coverage Report Demonstration

```bash
echo "=== COVERAGE REPORT DEMONSTRATION ==="

# Generate coverage report
npm run test:coverage

echo ""
echo "Opening coverage report in browser..."

# Open coverage report (Windows)
start coverage/lcov-report/index.html

# Linux/Mac alternative:
# open coverage/lcov-report/index.html

echo ""
echo "✅ Coverage Report Features:"
echo "- Line coverage: Percentage of code lines tested"
echo "- Function coverage: Percentage of functions tested"  
echo "- Branch coverage: Percentage of code branches tested"
echo "- Statement coverage: Percentage of statements tested"
echo "- Interactive HTML report with highlighting"
```

---

## 🚀 CI/CD Pipeline Demonstration

### 1. GitHub Actions Overview

```bash
echo "=== CI/CD PIPELINE DEMONSTRATION ==="
echo ""
echo "📋 Pipeline Configuration:"
echo "- Location: .github/workflows/"
echo "- Main pipeline: ci-cd.yml" 
echo "- Quality checks: quality-checks.yml"
echo ""
echo "🔄 Pipeline Stages:"
echo "1. Test Stage: Unit, API, BDD tests"
echo "2. UI Test Stage: Selenium automation"
echo "3. Build Stage: Application building"
echo "4. Deploy Stage: Staging/Production"
```

### 2. Local Pipeline Simulation

```bash
echo "=== LOCAL PIPELINE SIMULATION ==="

# Simulate CI pipeline steps locally
echo "Step 1: Install dependencies..."
npm ci

echo "Step 2: Run tests..."
npm run test:unit
npm run test:api
npm run test:bdd

echo "Step 3: Generate coverage..."
npm run test:coverage

echo "Step 4: Build application..."
cd ../frontend
npm run build
cd ../backend

echo ""
echo "✅ Local Pipeline Simulation Complete"
echo "In GitHub Actions, this runs automatically on:"
echo "- Push to main/develop branches"
echo "- Pull request creation"
echo "- Multiple Node.js versions (18.x, 20.x)"
echo "- With MongoDB service container"
```

### 3. GitHub Actions Features

```bash
echo "=== GITHUB ACTIONS FEATURES ==="
echo ""
echo "🔧 Advanced Features:"
echo "- Matrix testing: Multiple Node.js versions"
echo "- Service containers: MongoDB"
echo "- Parallel execution: Multiple jobs"
echo "- Artifact management: Test reports, coverage"
echo "- Environment protection: Staging/Production"
echo "- Failure notifications: Team alerts"
echo ""
echo "📊 Quality Gates:"
echo "- All tests must pass"
echo "- Coverage thresholds met"
echo "- Security audit passed"
echo "- No high-severity vulnerabilities"
```

---

## 🎯 Presentation Talking Points

### 1. Test Automation Summary

**UI Tests (Selenium)**:
- "We implemented 2 comprehensive UI test scenarios"
- "Login functionality with positive and negative cases"
- "Food menu and cart management workflow"
- "Page Object Model for maintainability"
- "Screenshot capture for debugging"

**API Tests (Supertest)**:
- "Complete API endpoint coverage"
- "Authentication flow validation"
- "CRUD operations for food management"
- "Response code and payload validation"
- "Security and authorization testing"

**Unit Tests (Jest)**:
- "Business logic validation"
- "Input validation and sanitization"
- "Error handling scenarios"
- "Mock implementations for isolation"
- "High code coverage achieved"

### 2. CI/CD Implementation

**Pipeline Benefits**:
- "Automated quality gates"
- "Fast feedback on code changes"
- "Consistent testing environment"
- "Parallel test execution"
- "Automated deployment validation"

**Quality Assurance**:
- "Multi-layer testing strategy"
- "Continuous integration practices"
- "Security vulnerability scanning"
- "Code coverage monitoring"
- "Documentation validation"

---

## 🐛 Troubleshooting Guide

### Common Issues and Solutions

```bash
# Issue: MongoDB connection failed
# Solution:
echo "Checking MongoDB status..."
mongosh --eval "db.runCommand('ping')" || echo "Start MongoDB service"

# Issue: Port already in use
# Solution:
echo "Checking port usage..."
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Issue: ChromeDriver not found
# Solution:
npm update selenium-webdriver
# Or manually install chromedriver

# Issue: Tests timeout
# Solution:
echo "Increase timeout in jest.config.js"
echo "Check if all services are running"

# Issue: Coverage threshold not met
# Solution:
echo "Add more unit tests"
echo "Remove excluded files from coverage"
```

### Performance Tips

```bash
echo "=== PERFORMANCE OPTIMIZATION ==="
echo ""
echo "🚀 Speed Improvements:"
echo "- Run unit tests first (fastest feedback)"
echo "- Use --bail flag to stop on first failure"
echo "- Run UI tests in headless mode for CI"
echo "- Parallel test execution where possible"
echo "- Cache dependencies in CI/CD"
```

---

## 📝 Demonstration Checklist

### Before Viva:
- [ ] All services running (MongoDB, Backend, Frontend)
- [ ] Test data seeded
- [ ] Chrome browser available
- [ ] All dependencies installed
- [ ] Environment variables set

### During Demonstration:
- [ ] Explain test automation strategy
- [ ] Run unit tests and show results
- [ ] Run API tests and explain validations
- [ ] Demo UI tests with browser automation
- [ ] Show coverage reports
- [ ] Explain CI/CD pipeline
- [ ] Highlight quality gates and benefits

### Backup Plans:
- [ ] Pre-recorded test runs (if live demo fails)
- [ ] Screenshots of test results
- [ ] Coverage reports saved
- [ ] Pipeline execution screenshots
- [ ] Written explanation of each test type

---

This demonstration script provides a comprehensive walkthrough of all test automation features and CI/CD pipeline capabilities, suitable for a viva presentation with both technical depth and clear explanations.