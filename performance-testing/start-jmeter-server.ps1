# JMeter Server Startup Script
# This script starts the server and keeps it running for JMeter testing

Write-Host "=== JMeter Server Startup Script ===" -ForegroundColor Cyan
Write-Host "Starting Node.js server for JMeter load testing..." -ForegroundColor Green

# Navigate to backend directory
$BackendPath = "h:\4th Semester\QA Project\2\backend"
Set-Location $BackendPath

# Kill any existing node processes
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start the server in a new PowerShell window
Write-Host "Starting JMeter test server..." -ForegroundColor Green
$ServerProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-Command", "cd '$BackendPath'; node jmeter-test-server.js; pause" -PassThru -WindowStyle Normal

Write-Host "Server process started with PID: $($ServerProcess.Id)" -ForegroundColor Green

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Test connectivity
Write-Host "`nTesting server connectivity..." -ForegroundColor Yellow

$TestsPassed = 0
$TotalTests = 4

# Test 1: Basic connectivity
Write-Host "1. Testing basic connectivity..." -ForegroundColor Gray
try {
    $HealthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Health check successful: $($HealthResponse.status)" -ForegroundColor Green
    $TestsPassed++
}
catch {
    Write-Host "   ❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Food API
Write-Host "2. Testing Food API..." -ForegroundColor Gray
try {
    $FoodResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/food" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Food API successful: $($FoodResponse.count) items found" -ForegroundColor Green
    $TestsPassed++
}
catch {
    Write-Host "   ❌ Food API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Auth API
Write-Host "3. Testing Auth API..." -ForegroundColor Gray
try {
    $AuthBody = @{
        username = "testuser"
        password = "testpass123"
    } | ConvertTo-Json
    
    $AuthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $AuthBody -ContentType "application/json" -TimeoutSec 5
    Write-Host "   ✅ Auth API successful: Token received" -ForegroundColor Green
    $TestsPassed++
}
catch {
    Write-Host "   ❌ Auth API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Order API
Write-Host "4. Testing Order API..." -ForegroundColor Gray
try {
    $OrderBody = @{
        items = @(
            @{
                foodId = 1
                quantity = 2
            }
        )
        customerInfo = @{
            name = "Test Customer"
            email = "test@example.com"
        }
    } | ConvertTo-Json -Depth 3
    
    $OrderResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method POST -Body $OrderBody -ContentType "application/json" -TimeoutSec 5
    Write-Host "   ✅ Order API successful: Order ID $($OrderResponse.data.id)" -ForegroundColor Green
    $TestsPassed++
}
catch {
    Write-Host "   ❌ Order API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Results
Write-Host "`n=== TEST RESULTS ===" -ForegroundColor Cyan
Write-Host "Tests passed: $TestsPassed/$TotalTests" -ForegroundColor $(if ($TestsPassed -eq $TotalTests) { "Green" } else { "Yellow" })

if ($TestsPassed -eq $TotalTests) {
    Write-Host "🎉 All tests passed! Server is ready for JMeter testing." -ForegroundColor Green
    Write-Host "`n📊 JMeter Test Configuration:" -ForegroundColor Cyan
    Write-Host "   Server: http://localhost:5000" -ForegroundColor White
    Write-Host "   Health: http://localhost:5000/api/health" -ForegroundColor White
    Write-Host "   Food:   http://localhost:5000/api/food" -ForegroundColor White
    Write-Host "   Auth:   http://localhost:5000/api/auth/login" -ForegroundColor White
    Write-Host "   Orders: http://localhost:5000/api/orders" -ForegroundColor White
    
    Write-Host "`n🚀 Ready to run JMeter tests!" -ForegroundColor Green
    Write-Host "   Use the following JMeter test plans:" -ForegroundColor Yellow
    Write-Host "   - Simple-Connectivity-Test.jmx (basic connectivity)" -ForegroundColor White
    Write-Host "   - Critical-Order-API-Load-Test-Compatible.jmx (full load test)" -ForegroundColor White
} else {
    Write-Host "⚠️  Some tests failed. Check server logs for details." -ForegroundColor Yellow
}

Write-Host "`n=== SERVER STATUS ===" -ForegroundColor Cyan
Write-Host "Server PID: $($ServerProcess.Id)" -ForegroundColor White
Write-Host "To stop the server: Stop-Process -Id $($ServerProcess.Id) -Force" -ForegroundColor Yellow
Write-Host "Server window should be visible. Close it or press Ctrl+C to stop." -ForegroundColor Gray

# Keep this script running so user can see the output
Write-Host "`nPress Enter to continue with JMeter testing..." -ForegroundColor Green
$null = Read-Host