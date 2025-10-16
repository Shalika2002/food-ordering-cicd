# Quick JMeter Test Server Launcher
# This script starts a simple server and tests connectivity

Write-Host "=== JMETER TEST SERVER SETUP ===" -ForegroundColor Cyan

# Kill any existing Node processes
Write-Host "1. Cleaning up existing Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Check if port 5000 is free
Write-Host "2. Checking port 5000 availability..." -ForegroundColor Yellow
$PortTest = netstat -ano | findstr :5000
if ($PortTest) {
    Write-Host "❌ Port 5000 is in use by another process" -ForegroundColor Red
    Write-Host $PortTest
    exit 1
} else {
    Write-Host "✅ Port 5000 is available" -ForegroundColor Green
}

# Start the simple test server
Write-Host "3. Starting simple test server..." -ForegroundColor Yellow
cd "h:\4th Semester\QA Project\2\backend"

# Start server in background
$ServerJob = Start-Job -ScriptBlock {
    cd "h:\4th Semester\QA Project\2\backend"
    node simple-test-server.js
}

# Wait for server to start
Start-Sleep -Seconds 3

# Test server connectivity
Write-Host "4. Testing server connectivity..." -ForegroundColor Yellow
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ Server is responding! Status: $($Response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($Response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Server connectivity test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Check if the job is still running
    if ($ServerJob.State -eq "Running") {
        Write-Host "Server job is running, but not responding to HTTP requests" -ForegroundColor Yellow
    } else {
        Write-Host "Server job failed to start" -ForegroundColor Red
        Receive-Job $ServerJob -ErrorAction SilentlyContinue
    }
    
    Stop-Job $ServerJob -ErrorAction SilentlyContinue
    Remove-Job $ServerJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "5. Server is ready for JMeter testing!" -ForegroundColor Green
Write-Host "Available endpoints:" -ForegroundColor Cyan
Write-Host "  - http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  - http://localhost:5000/api/food" -ForegroundColor White  
Write-Host "  - http://localhost:5000/api/orders (POST)" -ForegroundColor White
Write-Host "  - http://localhost:5000/api/auth/login (POST)" -ForegroundColor White

Write-Host "`nPress Enter to run JMeter test, or Ctrl+C to exit..." -ForegroundColor Yellow
$null = Read-Host

# Run JMeter test
Write-Host "6. Running JMeter connectivity test..." -ForegroundColor Yellow
cd "h:\4th Semester\QA Project\2\performance-testing"
jmeter -n -t "Simple-Connectivity-Test.jmx" -l "simple-test-results.jtl" -e -o "simple-test-report"

# Show results
Write-Host "7. JMeter test completed!" -ForegroundColor Green
Write-Host "Results saved to: simple-test-results.jtl" -ForegroundColor White
Write-Host "HTML report generated in: simple-test-report/" -ForegroundColor White

# Cleanup
Write-Host "8. Cleaning up..." -ForegroundColor Yellow
Stop-Job $ServerJob -ErrorAction SilentlyContinue
Remove-Job $ServerJob -ErrorAction SilentlyContinue

Write-Host "=== SETUP COMPLETE ===" -ForegroundColor Cyan