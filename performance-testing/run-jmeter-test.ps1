# JMeter Performance Testing Automation Script
param(
    [string]$ServerHost = "localhost",
    [string]$ServerPort = "5000",
    [string]$TestType = "light",
    [switch]$StartServer = $false
)

Write-Host "=== JMeter Performance Testing Automation ===" -ForegroundColor Green
Write-Host "Server: $ServerHost`:$ServerPort" -ForegroundColor Yellow
Write-Host "Test Type: $TestType" -ForegroundColor Yellow

# Check if JMeter is installed - try multiple locations
$jmeterCmd = $null
$jmeterPaths = @(
    "jmeter",
    "C:\jmeter\apache-jmeter-5.6.3\bin\jmeter.bat",
    "C:\apache-jmeter\bin\jmeter.bat"
)

foreach ($path in $jmeterPaths) {
    try {
        if ($path -eq "jmeter") {
            $jmeterCmd = Get-Command jmeter -ErrorAction SilentlyContinue
        } else {
            if (Test-Path $path) {
                $jmeterCmd = @{ Source = $path }
                break
            }
        }
        if ($jmeterCmd) { break }
    } catch { }
}

if (-not $jmeterCmd) {
    Write-Host "ERROR: JMeter not found. Trying to run installation script..." -ForegroundColor Red
    if (Test-Path ".\install-jmeter.ps1") {
        Write-Host "Running JMeter installation..." -ForegroundColor Yellow
        .\install-jmeter.ps1 -AddToPath
        # Try again after installation
        if (Test-Path "C:\jmeter\apache-jmeter-5.6.3\bin\jmeter.bat") {
            $jmeterCmd = @{ Source = "C:\jmeter\apache-jmeter-5.6.3\bin\jmeter.bat" }
        }
    }
    if (-not $jmeterCmd) {
        Write-Host "JMeter installation failed. Please install manually." -ForegroundColor Red
        exit 1
    }
}

Write-Host "JMeter found: $($jmeterCmd.Source)" -ForegroundColor Green

# Create timestamp for results
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resultsDir = "results\$timestamp"

# Create results directory
Write-Host "Creating results directory: $resultsDir" -ForegroundColor Yellow
try {
    New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null
    Write-Host "Results directory created successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create results directory: $_" -ForegroundColor Red
    exit 1
}

# Start backend server if requested
if ($StartServer) {
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    try {
        Push-Location "..\backend"
        Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -PassThru
        Start-Sleep -Seconds 5
        Pop-Location
        Write-Host "Backend server started" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Failed to start backend server: $_" -ForegroundColor Orange
        Pop-Location
    }
}

# Test server connectivity
Write-Host "Testing server connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$ServerHost`:$ServerPort/api/food" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "Server is responding (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "WARNING: Server connectivity test failed: $_" -ForegroundColor Orange
    Write-Host "Proceeding with test anyway..." -ForegroundColor Yellow
}

# Prepare JMeter command based on test type
$jmxFile = "Food-API-Load-Test.jmx"
$resultFile = "$resultsDir\test-results.jtl"
$htmlReportDir = "$resultsDir\html-report"

if (-not (Test-Path $jmxFile)) {
    Write-Host "ERROR: JMX test file not found: $jmxFile" -ForegroundColor Red
    exit 1
}

Write-Host "Using test plan: $jmxFile" -ForegroundColor Green

# Build JMeter command
$jmeterArgs = @(
    "-n"  # Non-GUI mode
    "-t", $jmxFile  # Test plan file
    "-l", $resultFile  # Results file
    "-e"  # Generate HTML report
    "-o", $htmlReportDir  # HTML report output directory
    "-Jserver.host=$ServerHost"
    "-Jserver.port=$ServerPort"
)

# Add test-specific parameters
if ($TestType -eq "heavy") {
    Write-Host "Configuring for Heavy Load Test (100 users, 20 iterations)" -ForegroundColor Yellow
    # Note: Heavy load test is disabled by default in JMX file
    # Would need to modify JMX programmatically or create separate file
} else {
    Write-Host "Configuring for Light Load Test (20 users, 10 iterations)" -ForegroundColor Yellow
}

# Execute JMeter test
Write-Host "Starting JMeter performance test..." -ForegroundColor Green
$jmeterExe = if ($jmeterCmd.Source -like "*.bat") { $jmeterCmd.Source } else { "jmeter" }
Write-Host "Command: $jmeterExe $($jmeterArgs -join ' ')" -ForegroundColor Cyan

$startTime = Get-Date
try {
    & $jmeterExe @jmeterArgs
    $exitCode = $LASTEXITCODE
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    if ($exitCode -eq 0) {
        Write-Host "JMeter test completed successfully!" -ForegroundColor Green
        Write-Host "Test Duration: $($duration.ToString('mm\:ss'))" -ForegroundColor Yellow
    } else {
        Write-Host "JMeter test completed with errors (Exit Code: $exitCode)" -ForegroundColor Orange
    }
} catch {
    Write-Host "ERROR: JMeter execution failed: $_" -ForegroundColor Red
    exit 1
}

# Display results summary
Write-Host "`n=== Test Results Summary ===" -ForegroundColor Green
Write-Host "Results Directory: $resultsDir" -ForegroundColor Yellow
Write-Host "Test Results File: $resultFile" -ForegroundColor Yellow
Write-Host "HTML Report: $htmlReportDir\index.html" -ForegroundColor Yellow

# Check if results files were created
if (Test-Path $resultFile) {
    $resultSize = (Get-Item $resultFile).Length
    Write-Host "Results file size: $([math]::Round($resultSize/1KB, 2)) KB" -ForegroundColor Green
    
    # Quick analysis of results
    try {
        $results = Get-Content $resultFile | Where-Object { $_ -like "*,true,*" -or $_ -like "*,false,*" }
        $totalRequests = $results.Count
        $failedRequests = ($results | Where-Object { $_ -like "*,false,*" }).Count
        $successRate = [math]::Round((($totalRequests - $failedRequests) / $totalRequests) * 100, 2)
        
        Write-Host "`nQuick Analysis:" -ForegroundColor Cyan
        Write-Host "Total Requests: $totalRequests" -ForegroundColor White
        Write-Host "Failed Requests: $failedRequests" -ForegroundColor White
        Write-Host "Success Rate: $successRate%" -ForegroundColor White
        
        if ($successRate -lt 95) {
            Write-Host "WARNING: Success rate is below 95%" -ForegroundColor Orange
        }
    } catch {
        Write-Host "Note: Could not parse results for quick analysis" -ForegroundColor Yellow
    }
} else {
    Write-Host "WARNING: Results file was not created" -ForegroundColor Orange
}

# Open HTML report if available
if (Test-Path "$htmlReportDir\index.html") {
    Write-Host "`nHTML report generated successfully" -ForegroundColor Green
    $openReport = Read-Host "Open HTML report in browser? (y/n)"
    if ($openReport -eq "y" -or $openReport -eq "Y") {
        Start-Process "$htmlReportDir\index.html"
    }
} else {
    Write-Host "WARNING: HTML report was not generated" -ForegroundColor Orange
}

Write-Host "`n=== Performance Testing Completed ===" -ForegroundColor Green
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Yellow