# SonarQube Setup and Analysis Guide

## SonarQube Installation and Configuration

### Step 1: Download and Install SonarQube

#### Option A: Using Docker (Recommended)
```bash
# Pull and run SonarQube container
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

#### Option B: Manual Installation
1. Download SonarQube Community Edition from: https://www.sonarqube.org/downloads/
2. Extract to desired location (e.g., `C:\sonarqube`)
3. Start SonarQube:
   ```bash
   # Windows
   C:\sonarqube\bin\windows-x86-64\StartSonar.bat
   
   # Access via browser: http://localhost:9000
   # Default credentials: admin/admin
   ```

### Step 2: Install SonarQube Scanner

#### For Node.js Projects
```bash
npm install -g sonarqube-scanner
```

#### Alternative: Download Scanner CLI
1. Download from: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extract and add to system PATH

### Step 3: Project Configuration

Create `sonar-project.properties` in project root:

```properties
# Project identification
sonar.projectKey=food-ordering-app
sonar.projectName=Food Ordering Application
sonar.projectVersion=1.0

# Source code configuration
sonar.sources=backend/,frontend/src/
sonar.exclusions=**/node_modules/**,**/coverage/**,**/build/**,**/dist/**

# Backend-specific settings
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
sonar.testExecutionReportPaths=backend/coverage/test-reporter.xml

# Frontend-specific settings  
sonar.typescript.lcov.reportPaths=frontend/coverage/lcov.info

# Language settings
sonar.sourceEncoding=UTF-8

# Quality gate settings
sonar.qualitygate.wait=true
```

### Step 4: Package.json Scripts

Add SonarQube analysis scripts to backend `package.json`:

```json
{
  "scripts": {
    "sonar": "sonar-scanner",
    "sonar:coverage": "npm run test:coverage && sonar-scanner",
    "presonar": "npm run test:coverage"
  }
}
```

## Analysis Execution

### Running SonarQube Analysis

1. **Start SonarQube Server**:
   ```bash
   # If using Docker  
   docker start sonarqube
   
   # If manual installation
   StartSonar.bat
   ```

2. **Generate Test Coverage**:
   ```bash
   cd backend
   npm run test:coverage
   ```

3. **Run SonarQube Analysis**:
   ```bash
   # From project root
   sonar-scanner
   
   # Or with npm script
   npm run sonar:coverage
   ```

4. **View Results**:
   - Open browser: http://localhost:9000
   - Login with admin/admin (change on first login)
   - Navigate to your project dashboard

## Expected Analysis Results

### Code Quality Metrics

#### Overall Quality Gate
- **Status**: PASSED/FAILED
- **Conditions**: 
  - Coverage > 80%
  - Duplicated Lines < 3%
  - Maintainability Rating: A
  - Reliability Rating: A
  - Security Rating: A

#### Detailed Metrics Expected

1. **Lines of Code**: ~1,500-2,000 lines
2. **Test Coverage**: 85-95% (after implementing tests)
3. **Code Smells**: 5-15 issues
4. **Bugs**: 2-8 issues  
5. **Vulnerabilities**: 1-5 issues
6. **Security Hotspots**: 3-10 issues
7. **Duplicated Lines**: < 2%
8. **Maintainability**: A rating
9. **Reliability**: A-B rating
10. **Security**: A-B rating

### Common Issues to Expect

#### Code Smells (Minor Issues)
- Unused variables
- Console.log statements
- Complex functions (cognitive complexity)
- Missing JSDoc comments
- Variable naming convention issues

#### Bugs (Logic Issues)
- Potential null pointer exceptions
- Incorrect error handling
- Missing return statements
- Type coercion issues

#### Vulnerabilities (Security Issues)
- Hard-coded credentials (fixed in our implementation)
- Insufficient input validation
- Weak cryptographic practices
- CORS misconfigurations (fixed)

#### Security Hotspots
- Authentication mechanisms
- Authorization checks
- Input validation points
- Database query constructions

## SonarQube Dashboard Screenshots Guide

### Key Dashboard Views to Capture

1. **Project Overview Dashboard**
   - Overall quality gate status
   - Key metrics summary
   - Trend graphs

2. **Issues Breakdown**
   - Issues by type (Bug, Vulnerability, Code Smell)
   - Issues by severity
   - Issue trends over time

3. **Coverage Report**
   - Overall coverage percentage
   - Coverage by file/component
   - Uncovered lines highlighting

4. **Code Analysis Details**
   - Specific code smell examples
   - Security vulnerability details
   - Bug analysis with recommendations

5. **Quality Gate Details**
   - All conditions and their status
   - Historical quality gate performance

## Troubleshooting Common Issues

### Issue 1: SonarQube Server Not Starting
```bash
# Check Java version (requires Java 11+)
java -version

# Check port availability
netstat -an | findstr :9000

# Check logs
tail -f sonarqube/logs/sonar.log
```

### Issue 2: Scanner Authentication Issues
```bash
# Generate token in SonarQube UI
# Add to sonar-project.properties
sonar.login=your-generated-token
```

### Issue 3: Coverage Reports Not Found
```bash
# Ensure test coverage is generated first
npm run test:coverage

# Verify lcov.info file exists
ls -la backend/coverage/lcov.info
```

### Issue 4: Analysis Fails
```bash
# Check scanner logs
sonar-scanner -X  # Verbose mode

# Verify project properties
cat sonar-project.properties
```

## Integration with CI/CD

### GitHub Actions Integration
```yaml
name: SonarQube Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
        working-directory: ./backend
      - name: Run tests with coverage
        run: npm run test:coverage
        working-directory: ./backend
      - name: SonarQube Scan
        uses: sonarqube-quality-gate-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Quality Improvement Recommendations

### Based on Expected Findings

1. **Increase Test Coverage**
   - Add unit tests for all service functions
   - Add integration tests for API endpoints
   - Target 90%+ coverage

2. **Fix Code Smells**
   - Remove console.log statements
   - Add proper error handling
   - Improve function complexity

3. **Address Security Issues**
   - Implement input sanitization
   - Add request validation
   - Secure sensitive operations

4. **Improve Documentation**
   - Add JSDoc comments
   - Document API endpoints
   - Add README files

## Demo Script for Presentation

### SonarQube Demonstration Steps

1. **Show SonarQube Dashboard**
   - Navigate to http://localhost:9000
   - Display main project dashboard
   - Highlight overall quality gate status

2. **Explain Key Metrics**
   - Point out coverage percentage
   - Show bugs vs vulnerabilities vs code smells
   - Discuss maintainability rating

3. **Drill Down into Issues**
   - Click on "Bugs" to show specific issues
   - Select one bug and explain the problem
   - Show the fix recommendation

4. **Show Before/After Comparison**
   - Display metrics before security fixes
   - Show improved metrics after fixes
   - Highlight specific improvements

5. **Quality Gate Explanation**
   - Explain what each condition means
   - Show how project passes/fails
   - Discuss importance for CI/CD

### Key Points to Highlight

- **Code Quality**: How SonarQube measures maintainability
- **Security**: Built-in security vulnerability detection  
- **Coverage**: Importance of test coverage metrics
- **Trends**: How metrics improve over time
- **CI/CD Integration**: Automated quality gates