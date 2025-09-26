# Local CI/CD Testing Scripts

# PowerShell script to test CI/CD pipeline locally
# Run this before pushing to ensure everything works

Write-Host "🚀 Starting Local CI/CD Pipeline Test..." -ForegroundColor Green
Write-Host ""

# Function to run command and check exit code
function Invoke-CommandWithCheck {
    param(
        [string]$Command,
        [string]$Description,
        [string]$WorkingDirectory = "."
    )
    
    Write-Host "🔄 $Description..." -ForegroundColor Yellow
    
    Push-Location $WorkingDirectory
    try {
        if ($Command.Contains("&&")) {
            # Handle compound commands
            $commands = $Command -split " && "
            foreach ($cmd in $commands) {
                Write-Host "  Executing: $cmd" -ForegroundColor Gray
                Invoke-Expression $cmd
                if ($LASTEXITCODE -ne 0) {
                    throw "Command failed: $cmd"
                }
            }
        } else {
            Write-Host "  Executing: $Command" -ForegroundColor Gray
            Invoke-Expression $Command
            if ($LASTEXITCODE -ne 0) {
                throw "Command failed: $Command"
            }
        }
        Write-Host "✅ $Description completed successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Description failed: $_" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
}

# Test results tracker
$testResults = @()

Write-Host "📋 Phase 1: Health Check" -ForegroundColor Cyan
$healthCheck = Invoke-CommandWithCheck -Command "node ci-health-check.js" -Description "Running health check"
$testResults += @{ Phase = "Health Check"; Status = $healthCheck }

Write-Host ""
Write-Host "📋 Phase 2: Backend Dependencies" -ForegroundColor Cyan
$backendDeps = Invoke-CommandWithCheck -Command "npm ci" -Description "Installing backend dependencies" -WorkingDirectory "backend"
$testResults += @{ Phase = "Backend Dependencies"; Status = $backendDeps }

Write-Host ""
Write-Host "📋 Phase 3: Frontend Dependencies" -ForegroundColor Cyan  
$frontendDeps = Invoke-CommandWithCheck -Command "npm ci" -Description "Installing frontend dependencies" -WorkingDirectory "frontend"
$testResults += @{ Phase = "Frontend Dependencies"; Status = $frontendDeps }

if ($backendDeps) {
    Write-Host ""
    Write-Host "📋 Phase 4: Backend Tests" -ForegroundColor Cyan
    
    # Seed database
    $seedDb = Invoke-CommandWithCheck -Command "npm run seed" -Description "Seeding test database" -WorkingDirectory "backend"
    $testResults += @{ Phase = "Database Seeding"; Status = $seedDb }
    
    # Run unit tests
    $unitTests = Invoke-CommandWithCheck -Command "npm run test:unit" -Description "Running unit tests" -WorkingDirectory "backend"
    $testResults += @{ Phase = "Unit Tests"; Status = $unitTests }
    
    # Run API tests
    $apiTests = Invoke-CommandWithCheck -Command "npm run test:api" -Description "Running API tests" -WorkingDirectory "backend"
    $testResults += @{ Phase = "API Tests"; Status = $apiTests }
    
    # Run BDD tests
    $bddTests = Invoke-CommandWithCheck -Command "npm run test:bdd" -Description "Running BDD tests" -WorkingDirectory "backend"
    $testResults += @{ Phase = "BDD Tests"; Status = $bddTests }
    
    # Generate coverage
    $coverage = Invoke-CommandWithCheck -Command "npm run test:coverage" -Description "Generating coverage report" -WorkingDirectory "backend"
    $testResults += @{ Phase = "Coverage Report"; Status = $coverage }
}

if ($frontendDeps) {
    Write-Host ""
    Write-Host "📋 Phase 5: Frontend Tests and Build" -ForegroundColor Cyan
    
    # Run frontend tests
    $frontendTests = Invoke-CommandWithCheck -Command "npm test -- --coverage --watchAll=false" -Description "Running frontend tests" -WorkingDirectory "frontend"
    $testResults += @{ Phase = "Frontend Tests"; Status = $frontendTests }
    
    # Build frontend
    $frontendBuild = Invoke-CommandWithCheck -Command "npm run build" -Description "Building frontend" -WorkingDirectory "frontend"
    $testResults += @{ Phase = "Frontend Build"; Status = $frontendBuild }
}

Write-Host ""
Write-Host "📋 Phase 6: Security Audit" -ForegroundColor Cyan
$backendAudit = Invoke-CommandWithCheck -Command "npm audit --audit-level=moderate" -Description "Backend security audit" -WorkingDirectory "backend"
$frontendAudit = Invoke-CommandWithCheck -Command "npm audit --audit-level=moderate" -Description "Frontend security audit" -WorkingDirectory "frontend"
$testResults += @{ Phase = "Security Audit"; Status = ($backendAudit -and $frontendAudit) }

# Print summary
Write-Host ""
Write-Host "📊 LOCAL CI/CD TEST SUMMARY" -ForegroundColor Magenta
Write-Host "=" * 50
$passed = 0
$failed = 0

foreach ($result in $testResults) {
    $status = if ($result.Status) { "✅ PASSED" } else { "❌ FAILED" }
    $color = if ($result.Status) { "Green" } else { "Red" }
    
    Write-Host "$status $($result.Phase)" -ForegroundColor $color
    
    if ($result.Status) { $passed++ } else { $failed++ }
}

Write-Host "=" * 50
Write-Host "📈 Total: $($testResults.Count) phases, $passed passed, $failed failed" -ForegroundColor White

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "🎉 All local tests passed! Your pipeline is ready for GitHub Actions." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Commit your changes: git add . && git commit -m 'Add CI/CD pipeline'"
    Write-Host "2. Push to GitHub: git push origin main"
    Write-Host "3. Check GitHub Actions tab for pipeline execution"
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed. Please fix the issues before pushing to GitHub." -ForegroundColor Red
    exit 1
}