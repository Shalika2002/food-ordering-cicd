# JMeter Performance Testing Guide

## Test Plan Overview

### Critical API Endpoint Selected
**Target API**: `GET /api/food` - Food Items Listing Endpoint

**Rationale for Selection**:
- Most frequently accessed endpoint in food ordering system
- Essential for user experience (menu browsing)
- Database-intensive operation (retrieval with potential filtering)
- High concurrency expected during peak hours

### Test Scenarios

#### 1. Light Load Test
- **Users**: 20 concurrent users
- **Ramp-up**: 30 seconds
- **Iterations**: 10 loops per user
- **Total Requests**: 600 requests (20 users × 10 loops × 3 endpoints)

#### 2. Heavy Load Test (Disabled by default)
- **Users**: 100 concurrent users
- **Ramp-up**: 60 seconds
- **Iterations**: 20 loops per user
- **Total Requests**: 2000 requests

## Running the Tests

### Prerequisites
1. JMeter 5.6.2 or later installed
2. Backend server running on localhost:5000
3. Database seeded with test data

### Execution Steps

#### GUI Mode (For Development/Demo)
```bash
# Start JMeter GUI
jmeter -t "Food-API-Load-Test.jmx"

# Alternative with custom properties
jmeter -t "Food-API-Load-Test.jmx" -Jserver.host=localhost -Jserver.port=5000
```

#### Command Line Mode (For CI/CD)
```bash
# Run light load test
jmeter -n -t "Food-API-Load-Test.jmx" -l "results/test-results.jtl" -e -o "results/html-report"

# Run with custom server settings
jmeter -n -t "Food-API-Load-Test.jmx" -l "results/test-results.jtl" -e -o "results/html-report" -Jserver.host=localhost -Jserver.port=5000
```

#### PowerShell Script for Automated Testing
```powershell
# performance-testing/run-jmeter-test.ps1
param(
    [string]$ServerHost = "localhost",
    [string]$ServerPort = "5000",
    [string]$TestType = "light"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resultsDir = "results/$timestamp"

# Create results directory
New-Item -ItemType Directory -Force -Path $resultsDir

# Run JMeter test
if ($TestType -eq "heavy") {
    # Enable heavy load test in JMX file programmatically
    Write-Host "Running Heavy Load Test..."
    jmeter -n -t "Food-API-Load-Test.jmx" -l "$resultsDir/heavy-load-results.jtl" -e -o "$resultsDir/heavy-load-report" -Jserver.host=$ServerHost -Jserver.port=$ServerPort
} else {
    Write-Host "Running Light Load Test..."
    jmeter -n -t "Food-API-Load-Test.jmx" -l "$resultsDir/light-load-results.jtl" -e -o "$resultsDir/light-load-report" -Jserver.host=$ServerHost -Jserver.port=$ServerPort
}

Write-Host "Test completed. Results saved to: $resultsDir"
```

## Test Endpoints Covered

### 1. GET /api/food (Primary Focus)
- **Purpose**: Retrieve all food items
- **Expected Response**: JSON array of food objects
- **Performance Target**: < 200ms response time
- **Assertions**: 
  - Status code 200
  - Valid JSON response structure

### 2. GET /api/food/search?q=pizza
- **Purpose**: Search functionality testing
- **Expected Response**: Filtered food items
- **Performance Target**: < 300ms response time
- **Assertions**: Status code 200

### 3. POST /api/auth/login
- **Purpose**: Authentication endpoint testing
- **Expected Response**: JWT token and user data
- **Performance Target**: < 500ms response time
- **Assertions**: Status code 200

## Key Metrics to Monitor

### Response Time Metrics
- **Average Response Time**: Target < 200ms for food listing
- **90th Percentile**: Should not exceed 500ms
- **95th Percentile**: Should not exceed 800ms
- **99th Percentile**: Should not exceed 1000ms

### Throughput Metrics
- **Requests per Second (RPS)**: Target > 50 RPS
- **Transactions per Second (TPS)**: Target > 15 TPS

### Error Metrics
- **Error Rate**: Should be < 1%
- **Failed Requests**: Monitor for 4xx/5xx errors

### Resource Utilization
- **CPU Usage**: Monitor server CPU during test
- **Memory Usage**: Check for memory leaks
- **Database Connections**: Monitor connection pool

## Bottleneck Analysis

### Common Performance Issues to Look For

1. **Database Query Performance**
   - Slow MongoDB queries
   - Missing indexes on frequently queried fields
   - N+1 query problems

2. **Network Latency**
   - Large response payloads
   - Unnecessary data transfer

3. **Server Resource Constraints**
   - CPU bottlenecks
   - Memory limitations
   - Thread pool exhaustion

4. **Application Code Issues**
   - Inefficient algorithms
   - Blocking I/O operations
   - Memory leaks

### Performance Optimization Recommendations

1. **Database Optimization**
   ```javascript
   // Add indexes for frequently queried fields
   db.foods.createIndex({ "category": 1 })
   db.foods.createIndex({ "available": 1 })
   db.foods.createIndex({ "name": "text", "description": "text" })
   ```

2. **Response Optimization**
   ```javascript
   // Implement pagination
   const limit = parseInt(req.query.limit) || 20;
   const skip = parseInt(req.query.skip) || 0;
   const foods = await Food.find(filter).limit(limit).skip(skip);
   ```

3. **Caching Strategy**
   ```javascript
   // Implement Redis caching for frequent queries
   const cachedFoods = await redis.get('foods:all');
   if (cachedFoods) {
     return res.json(JSON.parse(cachedFoods));
   }
   ```

## Results Interpretation

### Good Performance Indicators
- Average response time < 200ms
- 95th percentile < 500ms
- Error rate < 0.5%
- Consistent performance across test duration

### Performance Issues Indicators
- Response times increasing over time
- High error rates (> 2%)
- Memory or CPU spikes
- Database connection timeouts

## Demo Script for Presentation

### JMeter GUI Demonstration
1. **Open JMeter**: Launch JMeter and load the test plan
2. **Explain Test Structure**: Show thread groups and HTTP samplers
3. **Configure Parameters**: Demonstrate server host/port configuration
4. **Run Test**: Execute light load test
5. **Show Real-time Results**: Display graphs and summary reports
6. **Analyze Results**: Explain metrics and identify bottlenecks

### Key Points to Highlight
- Test plan structure and organization
- Different load scenarios (light vs heavy)
- Real-time monitoring capabilities
- Results analysis and bottleneck identification
- Performance optimization recommendations