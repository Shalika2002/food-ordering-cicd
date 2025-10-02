# SonarQube Setup and Usage Instructions
## Complete Step-by-Step Guide for Food Ordering Application

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Java 17 or higher installed
- ✅ Node.js 16+ installed
- ✅ Administrator privileges on your system
- ✅ At least 4GB RAM available
- ✅ Internet connection for downloading SonarQube

---

## 🚀 Method 1: Local SonarQube Server Setup

### Step 1: Download SonarQube Community Edition

1. **Download SonarQube**:
   ```powershell
   # Create SonarQube directory
   New-Item -ItemType Directory -Path "C:\SonarQube" -Force
   cd "C:\SonarQube"
   
   # Download SonarQube Community Edition
   Invoke-WebRequest -Uri "https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-10.3.0.82913.zip" -OutFile "sonarqube.zip"
   
   # Extract the archive
   Expand-Archive -Path "sonarqube.zip" -DestinationPath "C:\SonarQube"
   ```

2. **Alternative: Manual Download**
   - Go to https://www.sonarsource.com/products/sonarqube/downloads/
   - Download "Community Edition"
   - Extract to `C:\SonarQube\`

### Step 2: Configure SonarQube

1. **Navigate to SonarQube directory**:
   ```powershell
   cd "C:\SonarQube\sonarqube-10.3.0.82913\bin\windows-x86-64"
   ```

2. **Start SonarQube Server**:
   ```powershell
   .\StartSonar.bat
   ```

3. **Wait for startup** (2-3 minutes):
   - Look for message: "SonarQube is operational"
   - Server will be available at: http://localhost:9000

### Step 3: Initial Setup

1. **Access SonarQube Web Interface**:
   - Open browser: http://localhost:9000
   - Default credentials:
     - Username: `admin`
     - Password: `admin`

2. **Change Default Password**:
   - You'll be prompted to change password on first login
   - Use a secure password and note it down

3. **Create New Project**:
   - Click "Create Project" → "Manually"
   - Project Key: `food-ordering-app`
   - Display Name: `Food Ordering Application`
   - Click "Set Up"

### Step 4: Generate Authentication Token

1. **Generate Project Token**:
   - Choose "Generate a token"
   - Token Name: `food-ordering-analysis`
   - Type: "Project Analysis Token"
   - Expiry: "30 days" (or as needed)
   - Click "Generate"
   - **COPY AND SAVE THE TOKEN** - you won't see it again!

---

## 🔧 Method 2: SonarQube Scanner Setup

### Step 1: Download SonarQube Scanner

1. **Download Scanner**:
   ```powershell
   # Create scanner directory
   New-Item -ItemType Directory -Path "C:\sonar-scanner" -Force
   cd "C:\sonar-scanner"
   
   # Download SonarQube Scanner
   Invoke-WebRequest -Uri "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-windows-x64.zip" -OutFile "sonar-scanner.zip"
   
   # Extract
   Expand-Archive -Path "sonar-scanner.zip" -DestinationPath "C:\sonar-scanner"
   ```

2. **Add to PATH Environment Variable**:
   ```powershell
   # Add to system PATH
   $env:PATH += ";C:\sonar-scanner\sonar-scanner-5.0.1.3006-windows-x64\bin"
   
   # Verify installation
   sonar-scanner.bat -v
   ```

### Step 2: Configure Your Project

1. **Navigate to your project**:
   ```powershell
   cd "h:\4th Semester\QA Project\2"
   ```

2. **Update sonar-project.properties** (already exists in your project):
   ```properties
   # Project identification
   sonar.projectKey=food-ordering-app
   sonar.projectName=Food Ordering Application  
   sonar.projectVersion=1.0
   
   # Source code configuration
   sonar.sources=backend/,frontend/src/
   sonar.exclusions=**/node_modules/**,**/coverage/**,**/build/**,**/dist/**
   
   # Coverage reports
   sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
   
   # SonarQube server
   sonar.host.url=http://localhost:9000
   sonar.token=YOUR_TOKEN_HERE
   ```

3. **Add your token to the file**:
   ```powershell
   # Replace YOUR_TOKEN_HERE with the actual token from Step 4 above
   (Get-Content sonar-project.properties) -replace 'YOUR_TOKEN_HERE', 'your-actual-token' | Set-Content sonar-project.properties
   ```

---

## 📊 Running SonarQube Analysis

### Step 1: Prepare Your Code

1. **Run Tests to Generate Coverage**:
   ```powershell
   cd "h:\4th Semester\QA Project\2\backend"
   npm test -- --coverage
   ```

2. **Verify Coverage Report**:
   ```powershell
   # Check if coverage file exists
   Test-Path ".\coverage\lcov.info"
   ```

### Step 2: Run SonarQube Analysis

1. **Execute Scanner**:
   ```powershell
   cd "h:\4th Semester\QA Project\2"
   sonar-scanner.bat
   ```

2. **Monitor Progress**:
   - Scanner will show progress in terminal
   - Look for "EXECUTION SUCCESS" message
   - Note the analysis URL provided

### Step 3: View Results

1. **Access Analysis Results**:
   - Go to http://localhost:9000
   - Click on your project: "Food Ordering Application"
   - Review the dashboard showing:
     - Code Smells
     - Bugs
     - Vulnerabilities
     - Security Hotspots
     - Coverage
     - Duplications

---

## 🛠️ Method 3: Using SonarQube for IDE (VS Code)

### Step 1: Install SonarQube Extension

1. **Install Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search: "SonarQube for IDE"
   - Install the official SonarSource extension

### Step 2: Configure Extension

1. **Open Settings**:
   - File → Preferences → Settings
   - Search: "sonarlint"

2. **Configure Connection** (if using SonarQube server):
   - SonarLint: Connections
   - Add connection to SonarQube
   - Server URL: http://localhost:9000
   - Authentication: Use your token

### Step 3: Analyze Files

1. **Automatic Analysis**:
   - Open any JavaScript file
   - Issues will appear as squiggly lines
   - Hover for details

2. **Manual Analysis**:
   ```
   Ctrl+Shift+P → "SonarLint: Analyze all files in folder"
   ```

---

## 🎯 Step-by-Step Analysis Workflow

### Complete Analysis Process:

1. **Start SonarQube Server**:
   ```powershell
   cd "C:\SonarQube\sonarqube-10.3.0.82913\bin\windows-x86-64"
   .\StartSonar.bat
   ```

2. **Wait for Server** (check http://localhost:9000)

3. **Navigate to Project**:
   ```powershell
   cd "h:\4th Semester\QA Project\2"
   ```

4. **Generate Test Coverage**:
   ```powershell
   cd backend
   npm test -- --coverage
   cd ..
   ```

5. **Run Analysis**:
   ```powershell
   sonar-scanner.bat
   ```

6. **Review Results**:
   - Open http://localhost:9000
   - Click on "Food Ordering Application"
   - Navigate through different sections:
     - **Issues** tab: View code smells, bugs, vulnerabilities
     - **Security Hotspots**: Review security issues
     - **Measures**: See metrics and coverage
     - **Code**: Browse code with annotations

---

## 📈 Understanding SonarQube Results

### Key Metrics Explained:

1. **Reliability** (Bugs):
   - Code that will definitely break
   - Example: Null pointer references, resource leaks

2. **Security** (Vulnerabilities):
   - Code open to attack
   - Example: SQL injection, XSS vulnerabilities

3. **Maintainability** (Code Smells):
   - Code that's confusing or hard to maintain
   - Example: Duplicate code, complex methods

4. **Coverage**:
   - Percentage of code covered by tests
   - Target: >80% for good quality

5. **Duplications**:
   - Percentage of duplicate code
   - Target: <3% is excellent

### Quality Gate:

- **Pass**: Project meets quality standards
- **Fail**: Issues need to be addressed before deployment

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Server Won't Start
```powershell
# Check Java version
java -version

# Ensure Java 17+ is installed
# Check if port 9000 is available
netstat -an | findstr :9000
```

### Issue 2: Scanner Not Found
```powershell
# Verify PATH
echo $env:PATH | Select-String "sonar-scanner"

# Reinstall scanner if needed
```

### Issue 3: Analysis Fails
```powershell
# Check project permissions
# Ensure sonar-project.properties is correctly configured
# Verify token is valid
```

### Issue 4: No Coverage Data
```powershell
# Ensure tests generate lcov.info
cd backend
npm test -- --coverage
ls coverage/
```

---

## 📋 Quick Reference Commands

### Essential Commands:
```powershell
# Start SonarQube
cd "C:\SonarQube\sonarqube-10.3.0.82913\bin\windows-x86-64"
.\StartSonar.bat

# Generate coverage
cd "h:\4th Semester\QA Project\2\backend"
npm test -- --coverage

# Run analysis
cd "h:\4th Semester\QA Project\2"
sonar-scanner.bat

# Stop SonarQube (Ctrl+C in the StartSonar window)
```

### URLs:
- **SonarQube Dashboard**: http://localhost:9000
- **Project URL**: http://localhost:9000/dashboard?id=food-ordering-app

---

## ✅ Verification Checklist

Before presentation, ensure:
- [ ] SonarQube server starts successfully
- [ ] Project appears in dashboard
- [ ] Analysis completes without errors
- [ ] Results show metrics for:
  - [ ] Code smells
  - [ ] Bugs  
  - [ ] Vulnerabilities
  - [ ] Test coverage
  - [ ] Code duplications
- [ ] Quality gate status is visible
- [ ] Screenshots taken for presentation

---

**Setup Time**: ~30 minutes  
**Analysis Time**: ~5 minutes per run  
**Status**: Ready for demonstration! ✅