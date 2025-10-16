# Critical Order API Load Test Runner
# Enhanced PowerShell script for comprehensive JMeter load testing

param(
    [Parameter(Mandatory=$false)]
    [string]$TestType = "light",  # light, heavy, or both
    
    [Parameter(Mandatory=$false)]
    [string]$ServerHost = "localhost",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerPort = "5000",
    
    [Parameter(Mandatory=$false)]
    [int]$Duration = 300,  # Test duration in seconds
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateReport = $true
)

# Configuration
$TestPlanPath = ".\Critical-Order-API-Load-Test.jmx"
$ResultsDir = ".\results"
$ReportsDir = ".\reports"
$JMeterPath = "${env:JMETER_HOME}\bin\jmeter.bat"
$TimeStamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Color functions for better output
function Write-ColoredOutput($Message, $Color = "White") {
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success($Message) {
    Write-ColoredOutput "✅ $Message" "Green"
}

function Write-Error($Message) {
    Write-ColoredOutput "❌ $Message" "Red"
}

function Write-Warning($Message) {
    Write-ColoredOutput "⚠️  $Message" "Yellow"
}

function Write-Info($Message) {
    Write-ColoredOutput "ℹ️  $Message" "Cyan"
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check if JMeter is installed
    if (-not $env:JMETER_HOME) {
        Write-Error "JMETER_HOME environment variable not set"
        Write-Info "Please set JMETER_HOME to your JMeter installation directory"
        exit 1
    }
    
    if (-not (Test-Path $JMeterPath)) {
        Write-Error "JMeter not found at: $JMeterPath"
        Write-Info "Please check your JMeter installation"
        exit 1
    }
    
    # Check if test plan exists
    if (-not (Test-Path $TestPlanPath)) {
        Write-Error "Test plan not found: $TestPlanPath"
        exit 1
    }
    
    # Create directories if they don't exist
    @($ResultsDir, $ReportsDir) | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
            Write-Success "Created directory: $_"
        }
    }
    
    Write-Success "All prerequisites checked"
}

# Function to check if backend server is running
function Test-BackendServer {
    Write-Info "Checking backend server connectivity..."
    
    try {
        $response = Invoke-WebRequest -Uri "http://${ServerHost}:${ServerPort}/api/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Success "Backend server is responding"
        return $true
    }
    catch {
        try {
            # Fallback check - try to connect to any endpoint
            $response = Invoke-WebRequest -Uri "http://${ServerHost}:${ServerPort}/api/food" -Method GET -TimeoutSec 10 -ErrorAction Stop
            Write-Success "Backend server is responding (health endpoint not available)"
            return $true
        }
        catch {
            Write-Error "Backend server is not responding at http://${ServerHost}:${ServerPort}"
            Write-Warning "Please make sure the backend server is running before starting the load test"
            
            $choice = Read-Host "Continue anyway? (y/N)"
            if ($choice -ne "y" -and $choice -ne "Y") {
                exit 1
            }
            return $false
        }
    }
}

# Function to run JMeter test
function Start-LoadTest {
    param(
        [string]$TestName,
        [string]$ThreadGroup,
        [hashtable]$Properties = @{}
    )
    
    Write-Info "Starting $TestName test..."
    
    # Build JMeter command
    $ResultFile = "$ResultsDir\$TestName-$TimeStamp.jtl"
    $LogFile = "$ResultsDir\$TestName-$TimeStamp.log"
    
    $JMeterArgs = @(
        "-n"  # Non-GUI mode
        "-t", $TestPlanPath  # Test plan
        "-l", $ResultFile    # Results file
        "-j", $LogFile       # JMeter log file
        "-Jserver.host=$ServerHost"
        "-Jserver.port=$ServerPort"
    )
    
    # Add custom properties
    foreach ($key in $Properties.Keys) {
        $JMeterArgs += "-J$key=$($Properties[$key])"
    }
    
    Write-Info "Command: $JMeterPath $($JMeterArgs -join ' ')"
    Write-Info "Results will be saved to: $ResultFile"
    
    $startTime = Get-Date
    
    try {
        # Start JMeter process
        $process = Start-Process -FilePath $JMeterPath -ArgumentList $JMeterArgs -NoNewWindow -PassThru -Wait
        
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        if ($process.ExitCode -eq 0) {
            Write-Success "$TestName completed successfully in $($duration.TotalSeconds) seconds"
            
            # Check if results file was created and has content
            if (Test-Path $ResultFile) {
                $lineCount = (Get-Content $ResultFile | Measure-Object -Line).Lines
                Write-Info "Results file contains $lineCount lines"
                
                if ($lineCount -gt 1) {  # More than just header
                    return @{
                        Success = $true
                        ResultFile = $ResultFile
                        LogFile = $LogFile
                        Duration = $duration
                        SampleCount = $lineCount - 1
                    }
                } else {
                    Write-Warning "Results file is empty or contains only headers"
                }
            } else {
                Write-Warning "Results file was not created"
            }
        } else {
            Write-Error "$TestName failed with exit code: $($process.ExitCode)"
        }
    }
    catch {
        Write-Error "Failed to run $TestName`: $($_.Exception.Message)"
    }
    
    return @{ Success = $false }
}

# Function to generate HTML report
function New-PerformanceReport {
    param(
        [string]$ResultFile,
        [string]$TestName
    )
    
    if (-not (Test-Path $ResultFile)) {
        Write-Warning "Cannot generate report - results file not found: $ResultFile"
        return
    }
    
    Write-Info "Generating HTML report for $TestName..."
    
    $ReportDir = "$ReportsDir\$TestName-report-$TimeStamp"
    
    $JMeterArgs = @(
        "-g", $ResultFile     # Results file
        "-o", $ReportDir      # Output directory
    )
    
    try {
        $process = Start-Process -FilePath $JMeterPath -ArgumentList $JMeterArgs -NoNewWindow -PassThru -Wait
        
        if ($process.ExitCode -eq 0) {
            Write-Success "HTML report generated: $ReportDir\index.html"
            
            # Try to open the report
            $indexPath = "$ReportDir\index.html"
            if (Test-Path $indexPath) {
                Write-Info "Report available at: file:///$($indexPath.Replace('\', '/'))"
                
                $choice = Read-Host "Open report in browser? (y/N)"
                if ($choice -eq "y" -or $choice -eq "Y") {
                    Start-Process $indexPath
                }
            }
        } else {
            Write-Error "Failed to generate HTML report with exit code: $($process.ExitCode)"
        }
    }
    catch {
        Write-Error "Failed to generate HTML report: $($_.Exception.Message)"
    }
}

# Function to analyze results and identify bottlenecks
function Get-PerformanceAnalysis {
    param([string]$ResultFile)
    
    if (-not (Test-Path $ResultFile)) {
        Write-Warning "Cannot analyze results - file not found: $ResultFile"
        return
    }
    
    Write-Info "Analyzing performance results..."
    
    try {
        # Read and parse results
        $results = Import-Csv $ResultFile
        
        if ($results.Count -eq 0) {
            Write-Warning "No test results found in file"
            return
        }
        
        # Calculate key metrics
        $totalSamples = $results.Count
        $successfulSamples = ($results | Where-Object { $_.success -eq "true" }).Count
        $failedSamples = $totalSamples - $successfulSamples
        $successRate = [math]::Round(($successfulSamples / $totalSamples) * 100, 2)
        
        # Response time analysis
        $responseTimes = $results | ForEach-Object { [int]$_.elapsed }
        $avgResponseTime = [math]::Round(($responseTimes | Measure-Object -Average).Average, 2)
        $minResponseTime = ($responseTimes | Measure-Object -Minimum).Minimum
        $maxResponseTime = ($responseTimes | Measure-Object -Maximum).Maximum
        $p95ResponseTime = [math]::Round(($responseTimes | Sort-Object)[[math]::Floor($responseTimes.Count * 0.95)], 2)
        $p99ResponseTime = [math]::Round(($responseTimes | Sort-Object)[[math]::Floor($responseTimes.Count * 0.99)], 2)
        
        # Throughput calculation
        $timestamps = $results | ForEach-Object { [long]$_.timeStamp }
        $testDuration = ($timestamps | Measure-Object -Maximum).Maximum - ($timestamps | Measure-Object -Minimum).Minimum
        $throughput = if ($testDuration -gt 0) { [math]::Round(($totalSamples / ($testDuration / 1000)), 2) } else { 0 }
        
        # Error analysis
        $errorsByType = $results | Where-Object { $_.success -eq "false" } | Group-Object responseCode | Sort-Object Count -Descending
        
        # Critical endpoint analysis
        $orderCreationSamples = $results | Where-Object { $_.label -like "*Create Order*" }
        $orderCreationAvgTime = if ($orderCreationSamples) { 
            [math]::Round(($orderCreationSamples | ForEach-Object { [int]$_.elapsed } | Measure-Object -Average).Average, 2) 
        } else { 0 }
        
        # Display analysis
        Write-ColoredOutput "`n📊 PERFORMANCE ANALYSIS RESULTS" "Magenta"
        Write-ColoredOutput "=" * 50 "Magenta"
        
        Write-ColoredOutput "`n🎯 Test Summary:" "Yellow"
        Write-Host "   Total Samples: $totalSamples"
        Write-Host "   Successful: $successfulSamples ($successRate%)"
        Write-Host "   Failed: $failedSamples"
        Write-Host "   Test Duration: $(if($testDuration -gt 0) { [math]::Round($testDuration/1000, 2) } else { 'N/A' }) seconds"
        
        Write-ColoredOutput "`n⏱️  Response Time Metrics:" "Yellow"
        Write-Host "   Average: $avgResponseTime ms"
        Write-Host "   Minimum: $minResponseTime ms"
        Write-Host "   Maximum: $maxResponseTime ms"
        Write-Host "   95th Percentile: $p95ResponseTime ms"
        Write-Host "   99th Percentile: $p99ResponseTime ms"
        
        Write-ColoredOutput "`n🚀 Throughput:" "Yellow"
        Write-Host "   Requests/Second: $throughput"
        
        if ($orderCreationSamples) {
            Write-ColoredOutput "`n🛒 Critical Endpoint (Order Creation):" "Yellow"
            Write-Host "   Average Response Time: $orderCreationAvgTime ms"
            Write-Host "   Sample Count: $($orderCreationSamples.Count)"
        }
        
        if ($errorsByType) {
            Write-ColoredOutput "`n❌ Error Analysis:" "Red"
            foreach ($error in $errorsByType) {
                Write-Host "   HTTP $($error.Name): $($error.Count) occurrences"
            }
        }
        
        # Bottleneck identification
        Write-ColoredOutput "`n🔍 BOTTLENECK ANALYSIS:" "Magenta"
        Write-ColoredOutput "=" * 30 "Magenta"
        
        $bottlenecks = @()
        
        if ($successRate -lt 95) {
            $bottlenecks += "❌ High error rate ($successRate% success) - Check server capacity and error logs"
        }
        
        if ($avgResponseTime -gt 2000) {
            $bottlenecks += "⏱️  High average response time ($avgResponseTime ms) - Database queries or server processing may be slow"
        }
        
        if ($p95ResponseTime -gt 5000) {
            $bottlenecks += "📈 High 95th percentile response time ($p95ResponseTime ms) - Performance degrades under load"
        }
        
        if ($orderCreationAvgTime -gt 3000) {
            $bottlenecks += "🛒 Critical endpoint (Order Creation) is slow ($orderCreationAvgTime ms) - Review database operations and business logic"
        }
        
        if ($throughput -lt 10) {
            $bottlenecks += "🚀 Low throughput ($throughput req/sec) - Server may be CPU or I/O bound"
        }
        
        if ($bottlenecks.Count -eq 0) {
            Write-Success "No significant bottlenecks identified - Performance is within acceptable limits"
        } else {
            foreach ($bottleneck in $bottlenecks) {
                Write-Warning $bottleneck
            }
        }
        
        # Recommendations
        Write-ColoredOutput "`n💡 RECOMMENDATIONS:" "Cyan"
        Write-ColoredOutput "=" * 20 "Cyan"
        
        if ($avgResponseTime -gt 1000) {
            Write-Host "• Consider database query optimization"
            Write-Host "• Implement caching for frequently accessed data"
            Write-Host "• Review database indexes"
        }
        
        if ($successRate -lt 98) {
            Write-Host "• Investigate error logs for failure causes"
            Write-Host "• Implement proper error handling and retries"
            Write-Host "• Check server resource utilization"
        }
        
        if ($throughput -lt 20) {
            Write-Host "• Consider horizontal scaling (load balancers, multiple instances)"
            Write-Host "• Optimize server configuration"
            Write-Host "• Profile application for CPU bottlenecks"
        }
        
        Write-Host ""
        
        return @{
            TotalSamples = $totalSamples
            SuccessRate = $successRate
            AvgResponseTime = $avgResponseTime
            P95ResponseTime = $p95ResponseTime
            Throughput = $throughput
            OrderCreationAvgTime = $orderCreationAvgTime
            Bottlenecks = $bottlenecks
        }
    }
    catch {
        Write-Error "Failed to analyze results: $($_.Exception.Message)"
    }
}

# Main execution
function Main {
    Write-ColoredOutput "`n🚀 CRITICAL ORDER API LOAD TESTING" "Magenta"
    Write-ColoredOutput "=" * 40 "Magenta"
    Write-Host ""
    
    # Check prerequisites
    Test-Prerequisites
    
    # Check backend server
    $serverStatus = Test-BackendServer
    
    Write-Info "Test Configuration:"
    Write-Host "  • Test Type: $TestType"
    Write-Host "  • Server: http://${ServerHost}:${ServerPort}"
    Write-Host "  • Duration: $Duration seconds"
    Write-Host "  • Generate Report: $GenerateReport"
    Write-Host ""
    
    $testResults = @()
    
    # Run tests based on TestType parameter
    switch ($TestType.ToLower()) {
        "light" {
            Write-Info "Running Light Load Test (50 concurrent users)..."
            $result = Start-LoadTest -TestName "light-load" -ThreadGroup "Light Load"
            if ($result.Success) {
                $testResults += $result
            }
        }
        "heavy" {
            Write-Info "Running Heavy Load Test (100 concurrent users)..."
            # First enable the heavy load thread group by modifying the test plan temporarily
            Write-Warning "Note: Heavy load test requires manual enablement of the 'Heavy Load' thread group in JMeter GUI"
            $result = Start-LoadTest -TestName "heavy-load" -ThreadGroup "Heavy Load"
            if ($result.Success) {
                $testResults += $result
            }
        }
        "both" {
            Write-Info "Running both Light and Heavy Load Tests..."
            
            # Light load test
            $lightResult = Start-LoadTest -TestName "light-load" -ThreadGroup "Light Load"
            if ($lightResult.Success) {
                $testResults += $lightResult
            }
            
            Write-Info "Waiting 30 seconds before heavy load test..."
            Start-Sleep -Seconds 30
            
            # Heavy load test  
            $heavyResult = Start-LoadTest -TestName "heavy-load" -ThreadGroup "Heavy Load"
            if ($heavyResult.Success) {
                $testResults += $heavyResult
            }
        }
        default {
            Write-Error "Invalid test type: $TestType. Use 'light', 'heavy', or 'both'"
            exit 1
        }
    }
    
    # Process results
    if ($testResults.Count -eq 0) {
        Write-Error "No successful test results to process"
        exit 1
    }
    
    Write-Success "`n✅ Load testing completed!"
    Write-Info "Processing results..."
    
    foreach ($result in $testResults) {
        Write-Info "`nProcessing results for: $($result.ResultFile)"
        
        # Analyze results
        $analysis = Get-PerformanceAnalysis -ResultFile $result.ResultFile
        
        # Generate HTML report if requested
        if ($GenerateReport) {
            $testName = [System.IO.Path]::GetFileNameWithoutExtension($result.ResultFile).Split('-')[0]
            New-PerformanceReport -ResultFile $result.ResultFile -TestName $testName
        }
    }
    
    Write-ColoredOutput "`n🎉 LOAD TESTING COMPLETED SUCCESSFULLY!" "Green"
    Write-Info "Results and reports saved in:"
    Write-Host "  • Results: $ResultsDir"
    if ($GenerateReport) {
        Write-Host "  • Reports: $ReportsDir"
    }
    
    Write-Info "`nFor presentation purposes, key metrics have been displayed above."
    Write-Info "Use the generated HTML reports for detailed analysis and graphs."
}

# Run main function
Main