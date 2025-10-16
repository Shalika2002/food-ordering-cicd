# Complete Test References - Food Ordering System

## 📋 Overview
This document provides comprehensive references for all testing implemented in the Food Ordering System project, including unit tests, integration tests, performance tests, security tests, and CI/CD pipeline configurations.

---

## 🏗️ Project Structure

### Backend Testing Structure
```
backend/
├── tests/
│   ├── unit/                     # Unit tests
│   │   ├── foodService.test.js
│   │   └── userValidationService.test.js
│   ├── api/                      # API/Integration tests
│   │   ├── auth.test.js
│   │   └── food.test.js
│   ├── ui/                       # UI/E2E tests
│   │   ├── config/
│   │   ├── pages/
│   │   ├── enhanced-add-to-cart.test.js
│   │   ├── enhanced-login.test.js
│   │   ├── food-menu.test.js
│   │   └── login.test.js
│   ├── integration/              # Integration tests
│   ├── basic-health.test.js      # Health check tests
│   ├── setup.js                  # Test setup configuration
│   └── README.md                 # Test documentation
├── features/                     # BDD/Cucumber tests
├── coverage/                     # Test coverage reports
└── jest.config.js               # Jest configuration
```

### Frontend Testing Structure
```
frontend/
├── src/
│   ├── tests/
│   │   └── security.test.js      # Security-specific tests
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.test.js
│   │   │   └── Signup.test.js
│   │   └── Food/
│   │       └── FoodMenu.test.js
│   ├── App.test.js               # Main app tests
│   └── index.test.js             # Entry point tests
└── package.json                  # Test scripts configuration
```

---

## 🧪 Test Types and Frameworks

### 1. Unit Tests
**Framework**: Jest  
**Location**: `backend/tests/unit/`  
**Purpose**: Test individual functions and methods in isolation  

**Test Files**:
- `foodService.test.js` - Tests for food service logic
- `userValidationService.test.js` - Tests for user validation logic

**Run Commands**:
```bash
npm run test:unit                 # Run unit tests only
npm run test                      # Run all tests
```

### 2. API/Integration Tests
**Framework**: Jest + Supertest  
**Location**: `backend/tests/api/`  
**Purpose**: Test REST API endpoints and data flow  

**Test Files**:
- `auth.test.js` - Authentication endpoint tests
- `food.test.js` - Food management endpoint tests

**Run Commands**:
```bash
npm run test:api                  # Run API tests
npm run test:integration          # Run integration tests
```

### 3. UI/E2E Tests
**Framework**: Jest + Selenium WebDriver  
**Location**: `backend/tests/ui/`  
**Purpose**: Test user interface and end-to-end workflows  

**Test Files**:
- `enhanced-login.test.js` - Enhanced login functionality
- `enhanced-add-to-cart.test.js` - Cart management functionality
- `food-menu.test.js` - Food menu interactions
- `login.test.js` - Basic login tests

**Prerequisites**:
- Chrome browser installed
- Frontend running on localhost:3000
- Backend running on localhost:5000

**Run Commands**:
```bash
npm run test:ui                   # Run UI tests
npm run test:all-with-ui          # Run all tests including UI
```

### 4. BDD/Cucumber Tests
**Framework**: Cucumber.js  
**Location**: `backend/features/`  
**Purpose**: Behavior-driven testing with Gherkin scenarios  

**Run Commands**:
```bash
npm run test:bdd                  # Run BDD tests
```

### 5. Frontend React Tests
**Framework**: React Testing Library + Jest  
**Location**: `frontend/src/`  
**Purpose**: Test React components and UI logic  

**Test Files**:
- `App.test.js` - Main application component
- `components/Auth/Login.test.js` - Login component
- `components/Auth/Signup.test.js` - Signup component
- `components/Food/FoodMenu.test.js` - Food menu component
- `tests/security.test.js` - Security-specific frontend tests

**Run Commands**:
```bash
cd frontend
npm test                          # Run frontend tests
npm run test:security             # Run security tests
npm run test:coverage             # Run with coverage
```

---

## 🚀 Performance Testing

### JMeter Load Testing
**Location**: `performance-testing/`  
**Tool**: Apache JMeter 5.6.2+  

**Test Plans**:
- `Critical-Order-API-Load-Test.jmx` - Main load test
- `Food-API-Load-Test.jmx` - Food API specific tests
- `Food-API-Simple-Test.jmx` - Basic connectivity tests
- `Working-Load-Test.jmx` - Validated working test plan

**Key Test Scenarios**:
1. **Light Load Test**: 20 concurrent users, 30s ramp-up
2. **Heavy Load Test**: 100 concurrent users, 60s ramp-up

**Target Endpoints**:
- `GET /api/food` - Primary focus (< 200ms target)
- `GET /api/food/search?q=pizza` - Search functionality
- `POST /api/auth/login` - Authentication endpoint

**Performance Targets**:
- Average Response Time: < 200ms
- 95th Percentile: < 500ms
- Error Rate: < 1%
- Throughput: > 50 RPS

**Run Commands**:
```bash
cd performance-testing
.\run-jmeter-test.ps1             # PowerShell script
jmeter -n -t Food-API-Load-Test.jmx -l results.jtl -e -o report/
```

---

## 🔒 Security Testing

### OWASP ZAP Security Testing
**Tool**: OWASP ZAP (Zed Attack Proxy)  
**Configuration**: `zap-config.yaml`  

**Test Types**:
1. **Security Headers Test** - Validates security headers
2. **Baseline Scan** - Passive security scan
3. **Full Active Scan** - Comprehensive vulnerability testing

**Security Checks**:
- X-Frame-Options header
- Content-Security-Policy
- X-Content-Type-Options
- Cross-Site Scripting (XSS)
- Clickjacking vulnerabilities
- SQL Injection attempts

**Run Commands**:
```bash
npm run test:security             # Run all security tests
npm run zap:headers               # Headers test only
npm run zap:baseline              # Baseline scan
npm run zap:full                  # Full active scan
```

**Test Scripts**:
- `zap-test-frontend.js` - Frontend security testing script

---

## 🔄 CI/CD Pipeline Testing

### GitHub Actions Workflow
**File**: `.github/workflows/ci.yml`  
**Triggers**: Push to main/master/develop, Pull requests  

**Pipeline Stages**:
1. **Backend Tests** (Matrix: Node 18.x, 20.x)
   - Unit tests
   - API tests
   - BDD tests
   - Coverage generation
2. **Frontend Tests** (Matrix: Node 18.x, 20.x)
   - React component tests
   - Build validation
3. **Security Analysis**
   - npm audit (backend & frontend)
   - Outdated package checks
4. **Integration Check**
   - Artifact collection
   - Deployment readiness

**Environment Variables**:
```yaml
NODE_VERSION: '18.x'
MONGODB_VERSION: '6.0'
JWT_SECRET: test-jwt-secret-for-ci-cd-pipeline-minimum-32-chars
MONGODB_URI: mongodb://localhost:27017/test_food_ordering
```

### Jenkins Pipeline
**File**: `Jenkinsfile`  
**Triggers**: SCM polling (every 5 minutes), GitHub push  

**Pipeline Stages**:
1. **Preparation** - Checkout and environment setup
2. **Environment Setup** - Node.js and MongoDB
3. **Dependency Installation** - Backend and frontend deps
4. **Code Quality & Security** - Linting and auditing
5. **Database Setup** - Test data seeding
6. **Backend Testing** - Unit, API, and BDD tests
7. **Coverage Analysis** - Test coverage reports
8. **Frontend Testing & Build** - React tests and build
9. **UI/E2E Testing** - End-to-end test execution
10. **Integration & Packaging** - Deployment package creation
11. **Deployment Readiness** - Final validation

**Post-build Actions**:
- Test result publishing
- Coverage report generation
- Artifact archiving
- Notification system

---

## 📊 Test Configuration Files

### Jest Configuration
**Backend**: `backend/jest.config.js`
```javascript
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

**Frontend**: React scripts default configuration with custom scripts in `package.json`

### Test Scripts Reference

#### Backend Test Scripts (`backend/package.json`)
```json
{
  "test": "jest --testPathIgnore=tests/ui/",
  "test:unit": "jest tests/unit/",
  "test:api": "jest tests/api/",
  "test:ui": "jest tests/ui/",
  "test:bdd": "cucumber-js",
  "test:all": "npm run test:unit && npm run test:api && npm run test:bdd",
  "test:all-with-ui": "npm run test:all && npm run test:ui",
  "test:coverage": "jest --coverage --testPathIgnore=tests/ui/"
}
```

#### Frontend Test Scripts (`frontend/package.json`)
```json
{
  "test": "react-scripts test",
  "test:security": "npm test -- --testPathPattern=security --watchAll=false",
  "test:headers": "npm test -- --testPathPattern=headers --watchAll=false",
  "test:coverage": "npm test -- --coverage --watchAll=false",
  "test:ci": "npm test -- --coverage --watchAll=false --ci"
}
```

---

## 🛠️ Test Environment Setup

### Prerequisites
1. **Node.js 18+** - Runtime environment
2. **MongoDB** - Database (local or connection string)
3. **Chrome Browser** - For UI testing
4. **JMeter 5.6.2+** - For performance testing
5. **OWASP ZAP** - For security testing

### Environment Variables
```bash
# Test Environment
NODE_ENV=test
TEST_MONGODB_URI=mongodb://localhost:27017/test_food_ordering
JWT_SECRET=test-jwt-secret-minimum-32-characters
PORT=5000

# UI Testing
HEADLESS=true                     # For headless browser testing
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Database Setup
```bash
cd backend
npm run seed                      # Seed test database
```

### Running All Tests
```bash
# Backend comprehensive testing
cd backend
npm install
npm run test:all-with-ui

# Frontend testing
cd frontend
npm install  
npm run test:coverage

# Performance testing
cd performance-testing
.\run-jmeter-test.ps1

# Security testing
npm run test:security
```

---

## 📈 Test Reports and Coverage

### Coverage Reports
- **Location**: `backend/coverage/`
- **HTML Report**: `backend/coverage/lcov-report/index.html`
- **Formats**: LCOV, JSON, Text summary

### Performance Reports
- **Location**: `performance-testing/results/`
- **Formats**: JTL files, HTML reports, CSV aggregates

### Security Reports
- **Location**: `./zap-reports/`
- **Files**: 
  - `baseline-report.html`
  - `full-scan-report.html`
  - `security-headers-report.json`

### CI/CD Reports
- **GitHub Actions**: Artifact uploads, workflow summaries
- **Jenkins**: 
  - Test result trends
  - Coverage reports
  - Build artifacts
  - Deployment summaries

---

## 🔧 Troubleshooting Guide

### Common Issues

#### MongoDB Connection Errors
```bash
# Check MongoDB status
systemctl status mongod           # Linux
brew services list | grep mongodb # Mac
net start MongoDB                 # Windows

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :5000      # Linux
netstat -ano | findstr :5000     # Windows
lsof -i :5000                    # Mac

# Kill processes
pkill -f "node.*server.js"
```

#### UI Test Failures
1. Ensure frontend is running on port 3000
2. Ensure backend is running on port 5000
3. Check Chrome/ChromeDriver compatibility
4. Verify test data is seeded

#### JMeter Issues
1. Verify JMeter installation and PATH
2. Check server availability
3. Ensure test data exists
4. Monitor system resources

---

## 📚 Additional Documentation

### Related Files
- `TEST_AUTOMATION_REPORT.md` - Detailed test automation analysis
- `COMPLETE_TESTING_SUMMARY.md` - Executive summary
- `CI_CD_PIPELINE_DOCUMENTATION.md` - CI/CD detailed guide
- `DEFECT_TRACKING_REPORT.md` - Bug tracking and resolution
- `SOFTWARE_QUALITY_METRICS_REPORT.md` - Quality metrics analysis

### Reference Links
- Jest Documentation: https://jestjs.io/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Selenium WebDriver: https://selenium.dev/documentation/webdriver/
- Apache JMeter: https://jmeter.apache.org/
- OWASP ZAP: https://www.zaproxy.org/
- Cucumber.js: https://cucumber.io/docs/cucumber/

---

**Last Updated**: October 2025  
**Project**: Food Ordering System CI/CD  
**Repository**: food-ordering-cicd  
**Maintainer**: QA Team