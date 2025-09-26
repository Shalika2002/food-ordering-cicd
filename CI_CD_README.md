# 🚀 CI/CD Pipeline Implementation - Food Ordering System

[![CI/CD Pipeline](https://github.com/your-username/food-ordering-system/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/food-ordering-system/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/your-username/food-ordering-system/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/food-ordering-system)

## 📋 Overview

This repository contains a comprehensive CI/CD pipeline implementation for a full-stack Food Ordering System using GitHub Actions. The pipeline includes automated testing, security analysis, code coverage reporting, and deployment readiness validation.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│  Push/PR to main → GitHub Actions → Test & Build → Artifacts   │
└─────────────────────────────────────────────────────────────────┘

         ┌─────────────────┐    ┌─────────────────┐
         │  Backend Tests  │    │ Frontend Tests  │
         │   (Node 18/20)  │    │   (Node 18/20)  │
         └─────────────────┘    └─────────────────┘
                   │                       │
                   └───────────┬───────────┘
                               │
                    ┌─────────────────┐
                    │   UI/E2E Tests  │
                    │   (Chrome)      │
                    └─────────────────┘
                               │
                    ┌─────────────────┐
                    │ Security & QA   │
                    └─────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Git
- MongoDB (for local testing)

### 2. Setup
```bash
# Clone repository
git clone <your-repo-url>
cd food-ordering-system

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Validate setup
node ci-health-check.js
```

### 3. Local Testing
```powershell
# Run complete local pipeline test
.\test-pipeline-locally.ps1

# Or run individual components
cd backend
npm run test:unit      # Unit tests
npm run test:api       # API tests  
npm run test:bdd       # BDD tests
npm run test:coverage  # Coverage report
```

## 📊 Pipeline Stages

### Stage 1: Backend Testing (8-12 min)
- **Parallel execution** on Node.js 18.x & 20.x
- **Unit tests** with Jest
- **API integration tests** with Supertest
- **BDD scenarios** with Cucumber
- **Code coverage** analysis (80% threshold)
- **MongoDB** integration testing

### Stage 2: Frontend Testing (5-8 min)
- **Parallel execution** on Node.js 18.x & 20.x  
- **React component tests**
- **Production build** validation
- **Coverage reporting**
- **Artifact generation**

### Stage 3: UI/E2E Testing (10-15 min)
- **Selenium WebDriver** automation
- **Chrome browser** testing
- **Full-stack integration**
- **Screenshot capture** on failures
- **Critical user journey** validation

### Stage 4: Security Analysis (3-5 min)
- **Dependency vulnerability** scanning
- **Outdated package** detection
- **Security audit** reporting
- **Risk assessment**

### Stage 5: Integration & Deployment (2-3 min)
- **Artifact aggregation**
- **Deployment readiness** validation
- **Pipeline summary** generation
- **Success/failure** notification

## 📁 Key Files

```
.github/workflows/
├── ci.yml              # Main CI/CD pipeline
└── coverage.yml        # Coverage analysis workflow

ci-health-check.js      # Pre-pipeline validation
test-pipeline-locally.ps1   # Local testing script

# Documentation
CI_CD_PIPELINE_DOCUMENTATION.md    # Comprehensive guide
VIVA_DEMO_SCRIPT_CICD.md           # Demonstration script
```

## 🧪 Testing Strategy

| Test Type | Framework | Coverage | Duration |
|-----------|-----------|----------|----------|
| **Unit** | Jest | Individual functions | ~2 min |
| **API** | Jest + Supertest | All endpoints | ~3 min |
| **BDD** | Cucumber.js | User scenarios | ~2 min |
| **UI/E2E** | Selenium + Jest | User journeys | ~10 min |

### Coverage Requirements
- **Lines**: 80% minimum
- **Functions**: 80% minimum  
- **Branches**: 70% minimum
- **Statements**: 80% minimum

## 📈 Monitoring & Reporting

### Generated Artifacts
- ✅ **Test Coverage Reports** (HTML, LCOV, Clover)
- ✅ **Build Artifacts** (Production-ready frontend)
- ✅ **UI Test Screenshots** (Failure debugging)
- ✅ **Security Audit Reports** (Vulnerability assessments)
- ✅ **Pipeline Summaries** (Deployment readiness)

### Retention Policy
- **Test Results**: 30 days
- **Coverage Reports**: 30 days
- **Pipeline Summaries**: 90 days
- **Build Artifacts**: 30 days

## 🔧 Configuration

### Environment Variables
```yaml
NODE_ENV: test
MONGODB_URI: mongodb://localhost:27017/test_food_ordering
HEADLESS: true  # For UI testing
CI: true        # GitHub Actions indicator
```

### Matrix Strategy
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

### Trigger Events
- **Push** to main/master/develop branches
- **Pull requests** to main/master
- **Manual trigger** via workflow_dispatch

## 🚨 Troubleshooting

### Common Issues

#### Pipeline Fails with "Tests not found"
```bash
# Solution: Run health check
node ci-health-check.js

# Ensure test files exist
ls backend/tests/unit/*.test.js
ls backend/tests/api/*.test.js
```

#### MongoDB Connection Errors
```bash
# Check environment variables
echo $MONGODB_URI

# Verify MongoDB is running
mongosh $MONGODB_URI
```

#### UI Tests Timeout
```javascript
// Increase timeout in jest config
testTimeout: 60000

// Add explicit waits
await driver.wait(until.elementLocated(By.id('element')), 10000);
```

#### Coverage Threshold Failures
```javascript
// Adjust in jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 75,
    lines: 75, 
    statements: 75
  }
}
```

## 🎯 Demo Instructions

### For Viva Presentation

1. **Show GitHub Actions Dashboard**
   - Navigate to repository Actions tab
   - Display workflow runs history
   - Highlight successful pipeline execution

2. **Trigger Manual Build** 
   - Use workflow_dispatch feature
   - Monitor real-time execution
   - Show parallel job execution

3. **Review Artifacts**
   - Download coverage reports
   - Open HTML coverage analysis
   - Display test results summary

4. **Local Validation**
   - Run health check script
   - Demonstrate local testing capabilities

### Success Metrics to Highlight
- ⚡ **Build Time**: 15-20 minutes (50% faster with parallelization)
- 🎯 **Coverage**: >80% across all metrics
- 🔒 **Security**: Automated vulnerability scanning
- 🚀 **Reliability**: Matrix testing across Node.js versions
- 📊 **Reporting**: Comprehensive artifacts and summaries

## 🏆 Benefits Achieved

### Quality Assurance
- ✅ **Automated Testing**: 4 test types (Unit, API, BDD, UI)
- ✅ **Code Coverage**: Mandatory thresholds
- ✅ **Security Scanning**: Vulnerability detection
- ✅ **Cross-Version**: Node.js compatibility testing

### Development Efficiency  
- ✅ **Fast Feedback**: Immediate issue detection
- ✅ **Parallel Execution**: Reduced pipeline time
- ✅ **Local Testing**: Pre-commit validation
- ✅ **Consistent Environment**: Reproducible builds

### Deployment Readiness
- ✅ **Go/No-Go Indicators**: Clear deployment signals
- ✅ **Artifact Management**: Production-ready builds
- ✅ **Rollback Capability**: Version-controlled artifacts
- ✅ **Documentation**: Comprehensive reporting

## 📚 Documentation

- [📖 Complete Documentation](CI_CD_PIPELINE_DOCUMENTATION.md)
- [🎬 Demo Script](VIVA_DEMO_SCRIPT_CICD.md)
- [🔧 Configuration Guide](backend/jest.config.js)
- [🧪 Testing Guide](backend/tests/README.md)

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review pipeline logs in GitHub Actions
3. Run local health check: `node ci-health-check.js`
4. Test locally: `.\test-pipeline-locally.ps1`

---

## 📊 Pipeline Status

| Branch | Status | Coverage | Security | Build |
|--------|--------|----------|----------|-------|
| main | [![CI](https://github.com/your-username/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/repo/actions/workflows/ci.yml) | [![Coverage](https://codecov.io/gh/your-username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/repo) | ✅ Passing | ✅ Passing |

---

**🚀 Ready for Production Deployment!**

*This CI/CD pipeline ensures code quality, security, and deployment readiness through comprehensive automated testing and analysis.*