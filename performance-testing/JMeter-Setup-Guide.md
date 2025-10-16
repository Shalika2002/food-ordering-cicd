# JMeter Load Testing - Quick Setup Guide

## 🚀 Quick Start Instructions

### 1. Prerequisites Check
```powershell
# Check if JMeter is installed
echo $env:JMETER_HOME

# If not set, download JMeter and set environment variable
# Download from: https://jmeter.apache.org/download_jmeter.cgi
```

### 2. Backend Server Setup
```powershell
# Start the backend server
cd "H:\4th Semester\QA Project\2\backend"
npm install
npm start

# Verify server is running
curl http://localhost:5000/api/food
```

### 3. Run Load Tests

#### Option A: Using PowerShell Script (Recommended)
```powershell
cd "H:\4th Semester\QA Project\2\performance-testing"

# Run light load test
.\run-critical-load-test.ps1 -TestType light

# Run heavy load test  
.\run-critical-load-test.ps1 -TestType heavy

# Run both tests
.\run-critical-load-test.ps1 -TestType both
```

#### Option B: Using JMeter GUI
```powershell
# Open JMeter GUI
jmeter

# Then: File → Open → Critical-Order-API-Load-Test.jmx
# Click green play button to start test
```

### 4. View Results
- **PowerShell**: Results displayed in terminal with analysis
- **GUI**: Check Summary Report, Response Times Over Time listeners
- **HTML Reports**: Generated in `performance-testing/reports/` directory

---

## 📋 Files Created

### Test Plans
- `Critical-Order-API-Load-Test.jmx` - Main JMeter test plan
- `Food-API-Load-Test.jmx` - Original existing test plan

### Scripts
- `run-critical-load-test.ps1` - Automated test execution script
- `run-jmeter-test.ps1` - Original test script

### Documentation
- `Performance-Testing-Presentation.md` - Complete presentation materials
- `JMeter-Demo-Script.md` - Step-by-step demonstration guide
- `JMeter-Setup-Guide.md` - This setup file

---

## 🎯 Key Features of Your Load Test

### Critical Endpoint Focus
- **Target**: `/api/orders` (Order Creation API)
- **Rationale**: Most business-critical, database-intensive endpoint

### Test Scenarios
- **Light Load**: 50 users, 5-minute duration
- **Heavy Load**: 100 users, 10-minute duration
- **Realistic Flow**: Authentication → Browse → Order → Check Status

### Comprehensive Monitoring
- Response times (avg, min, max, percentiles)
- Throughput (requests/second)
- Error rates and patterns
- Real-time graphs and visualizations

### Automated Analysis
- Bottleneck identification
- Performance recommendations
- Professional HTML reports
- Detailed metrics breakdown

---

## 🎤 For Your Presentation

### Demo Flow (20 minutes total)
1. **Setup** (3 min) - Open JMeter, load test plan
2. **Walkthrough** (4 min) - Explain test structure
3. **Monitoring** (2 min) - Show listeners and metrics
4. **Live Test** (6 min) - Run actual load test
5. **Analysis** (3 min) - Review results and bottlenecks
6. **Reports** (2 min) - Show generated HTML reports

### Key Talking Points
- Why Order API is critical for testing
- How concurrent users simulate real load
- Response time SLAs and performance targets
- Bottleneck identification and recommendations
- Business impact of performance issues

---

## 🔧 Troubleshooting

### Common Issues
1. **"JMETER_HOME not set"** → Set environment variable to JMeter install directory
2. **"Backend server not responding"** → Start backend with `npm start`
3. **"No test results"** → Check that results directory exists
4. **"Tests fail immediately"** → Verify authentication credentials in test plan

### Quick Fixes
```powershell
# Create results directory
mkdir performance-testing\results -Force

# Test backend connectivity
Invoke-WebRequest -Uri "http://localhost:5000/api/food" -Method GET

# Check JMeter installation
jmeter --version
```

---

## 📊 Expected Results Format

### Sample Output
```
📊 PERFORMANCE ANALYSIS RESULTS
==================================================

🎯 Test Summary:
   Total Samples: 750
   Successful: 735 (98.0%)
   Failed: 15 (2.0%)
   Test Duration: 300 seconds

⏱️ Response Time Metrics:
   Average: 245 ms
   95th Percentile: 450 ms
   99th Percentile: 890 ms

🚀 Throughput:
   Requests/Second: 2.5

🛒 Critical Endpoint (Order Creation):
   Average Response Time: 320 ms
   Success Rate: 96.8%

🔍 BOTTLENECK ANALYSIS:
✅ No significant bottlenecks identified - Performance within acceptable limits
```

---

## 🎉 Success Checklist

Before your presentation, ensure:
- [ ] Backend server starts successfully
- [ ] JMeter GUI opens the test plan
- [ ] PowerShell script runs without errors
- [ ] Test generates results and analysis
- [ ] HTML reports are created
- [ ] Demo timing is practiced

---

**You're all set for an impressive JMeter load testing demonstration! 🚀**

*Good luck with your presentation!*