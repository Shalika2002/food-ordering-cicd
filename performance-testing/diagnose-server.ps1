# Server Diagnostic Script
# This script helps identify server binding and connectivity issues

Write-Host "=== SERVER DIAGNOSTIC SCRIPT ===" -ForegroundColor Cyan
Write-Host "Checking for Node.js server binding issues..." -ForegroundColor Yellow

# Function to check if port is in use
function Test-Port {
    param($Port)
    try {
        $Connection = New-Object System.Net.Sockets.TcpClient
        $Connection.Connect("127.0.0.1", $Port)
        $Connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if port 5000 is in use
Write-Host "`n1. Checking if port 5000 is accessible..." -ForegroundColor Green
if (Test-Port -Port 5000) {
    Write-Host "✅ Port 5000 is accessible!" -ForegroundColor Green
} else {
    Write-Host "❌ Port 5000 is NOT accessible" -ForegroundColor Red
}

# Check what's listening on port 5000
Write-Host "`n2. Checking what processes are using port 5000..." -ForegroundColor Green
try {
    $PortInfo = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($PortInfo) {
        Write-Host "Port 5000 is being used by:" -ForegroundColor Yellow
        $PortInfo | ForEach-Object {
            $ProcessId = $_.OwningProcess
            $Process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
            Write-Host "  Process: $($Process.ProcessName) (PID: $ProcessId)" -ForegroundColor White
            Write-Host "  State: $($_.State)" -ForegroundColor White
            Write-Host "  Local Address: $($_.LocalAddress):$($_.LocalPort)" -ForegroundColor White
        }
    } else {
        Write-Host "❌ No process found listening on port 5000" -ForegroundColor Red
    }
}
catch {
    Write-Host "⚠️  Could not check port usage: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test HTTP connectivity methods
Write-Host "`n3. Testing different HTTP connection methods..." -ForegroundColor Green

# Method 1: Test-NetConnection
Write-Host "Testing with Test-NetConnection..." -ForegroundColor Yellow
try {
    $NetTest = Test-NetConnection -ComputerName "localhost" -Port 5000
    if ($NetTest.TcpTestSucceeded) {
        Write-Host "✅ TCP connection to localhost:5000 successful" -ForegroundColor Green
    } else {
        Write-Host "❌ TCP connection to localhost:5000 failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Test-NetConnection failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 2: Simple HTTP GET
Write-Host "`nTesting HTTP GET request..." -ForegroundColor Yellow
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ HTTP GET successful - Status: $($Response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ HTTP GET failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with different addresses
    Write-Host "Trying alternative addresses..." -ForegroundColor Yellow
    
    $Addresses = @("http://127.0.0.1:5000", "http://0.0.0.0:5000")
    foreach ($Address in $Addresses) {
        try {
            Write-Host "  Testing: $Address" -ForegroundColor Gray
            $Response = Invoke-WebRequest -Uri $Address -TimeoutSec 3 -ErrorAction Stop
            Write-Host "  ✅ Success with $Address - Status: $($Response.StatusCode)" -ForegroundColor Green
            break
        }
        catch {
            Write-Host "  ❌ Failed with $Address" -ForegroundColor Red
        }
    }
}

# Check Node.js processes
Write-Host "`n4. Checking for Node.js processes..." -ForegroundColor Green
$NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($NodeProcesses) {
    Write-Host "Found Node.js processes:" -ForegroundColor Yellow
    $NodeProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id) - Start Time: $($_.StartTime)" -ForegroundColor White
    }
} else {
    Write-Host "❌ No Node.js processes found" -ForegroundColor Red
}

# Server binding recommendations
Write-Host "`n=== RECOMMENDATIONS ===" -ForegroundColor Cyan
Write-Host "If the server is not accessible:" -ForegroundColor Yellow
Write-Host "1. Check if server.js binds to '0.0.0.0' instead of 'localhost'" -ForegroundColor White
Write-Host "2. Make sure MongoDB is running and accessible" -ForegroundColor White
Write-Host "3. Check Windows Firewall settings" -ForegroundColor White
Write-Host "4. Verify the server is actually listening on port 5000" -ForegroundColor White
Write-Host "5. Try running server with explicit host binding: app.listen(5000, '0.0.0.0')" -ForegroundColor White

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "Run this script while your server is running to diagnose issues" -ForegroundColor Yellow
Write-Host "If port 5000 shows as accessible, JMeter should work" -ForegroundColor Yellow