# JMeter Server Startup Script
Write-Host "=== JMeter Server Startup Script ===" -ForegroundColor Cyan

# Navigate to backend directory
$BackendPath = "h:\4th Semester\QA Project\2\backend"
Set-Location $BackendPath

# Kill any existing node processes
Write-Host "Stopping existing Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start the server in a new window
Write-Host "Starting JMeter test server..." -ForegroundColor Green
$ServerProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-Command", "cd '$BackendPath'; node jmeter-test-server.js; Read-Host 'Press Enter to close'" -PassThru

Write-Host "Server started with PID: $($ServerProcess.Id)" -ForegroundColor Green
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test connectivity
Write-Host "Testing server connectivity..." -ForegroundColor Yellow

try {
    $HealthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 10
    Write-Host "Health check: SUCCESS - $($HealthResponse.status)" -ForegroundColor Green
}
catch {
    Write-Host "Health check: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $FoodResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/food" -Method GET -TimeoutSec 10
    Write-Host "Food API: SUCCESS - $($FoodResponse.count) items" -ForegroundColor Green
}
catch {
    Write-Host "Food API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Server is running on http://localhost:5000" -ForegroundColor Cyan
Write-Host "To stop: Stop-Process -Id $($ServerProcess.Id) -Force" -ForegroundColor Yellow