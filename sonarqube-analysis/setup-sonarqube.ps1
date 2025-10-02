# SonarQube Installation and Analysis Script for Windows
param(
    [switch]$Install = $false,
    [switch]$StartServer = $false,
    [switch]$RunAnalysis = $false,
    [switch]$All = $false,
    [string]$SonarQubeDir = "C:\sonarqube"
)

if ($All) {
    $Install = $true
    $StartServer = $true  
    $RunAnalysis = $true
}

Write-Host "=== SonarQube Setup and Analysis ===" -ForegroundColor Green

# Function to check if Java is installed
function Test-JavaInstallation {
    try {
        $javaVersion = java -version 2>&1 | Select-String "version"
        if ($javaVersion) {
            Write-Host "Java found: $javaVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "Java not found. Please install Java 11 or later." -ForegroundColor Red
        Write-Host "Download from: https://adoptium.net/" -ForegroundColor Yellow
        return $false
    }
    return $false
}

# Function to install SonarQube
function Install-SonarQube {
    Write-Host "Installing SonarQube..." -ForegroundColor Yellow
    
    if (-not (Test-JavaInstallation)) {
        return $false
    }
    
    # Create installation directory
    try {
        New-Item -ItemType Directory -Force -Path $SonarQubeDir | Out-Null
        Write-Host "Created directory: $SonarQubeDir" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to create SonarQube directory: $_" -ForegroundColor Red
        return $false
    }
    
    # Download SonarQube
    $sonarVersion = "10.3.0.82913"
    $downloadUrl = "https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-$sonarVersion.zip"
    $zipFile = "$env:TEMP\sonarqube-$sonarVersion.zip"
    
    Write-Host "Downloading SonarQube $sonarVersion..." -ForegroundColor Yellow
    try {
        if (-not (Test-Path $zipFile)) {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
            Write-Host "Download completed" -ForegroundColor Green
        } else {
            Write-Host "Using cached download" -ForegroundColor Green
        }
    } catch {
        Write-Host "ERROR: Failed to download SonarQube: $_" -ForegroundColor Red
        return $false
    }
    
    # Extract SonarQube
    Write-Host "Extracting SonarQube..." -ForegroundColor Yellow
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $SonarQubeDir)
        Write-Host "Extraction completed" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to extract SonarQube: $_" -ForegroundColor Red
        return $false
    }
    
    # Create wrapper script
    $wrapperScript = @"
@echo off
cd /d "$SonarQubeDir\sonarqube-$sonarVersion\bin\windows-x86-64"
StartSonar.bat
"@
    
    $wrapperPath = "$SonarQubeDir\start-sonarqube.bat"
    $wrapperScript | Out-File -FilePath $wrapperPath -Encoding ASCII
    
    Write-Host "SonarQube installed successfully!" -ForegroundColor Green
    Write-Host "Installation path: $SonarQubeDir" -ForegroundColor Yellow
    Write-Host "Wrapper script: $wrapperPath" -ForegroundColor Yellow
    
    return $true
}

# Function to start SonarQube server
function Start-SonarQubeServer {
    Write-Host "Starting SonarQube server..." -ForegroundColor Yellow
    
    $sonarDir = Get-ChildItem -Path $SonarQubeDir -Directory | Where-Object { $_.Name -like "sonarqube-*" } | Select-Object -First 1
    if (-not $sonarDir) {
        Write-Host "ERROR: SonarQube installation not found in $SonarQubeDir" -ForegroundColor Red
        return $false
    }
    
    $startScript = "$($sonarDir.FullName)\bin\windows-x86-64\StartSonar.bat"
    if (-not (Test-Path $startScript)) {
        Write-Host "ERROR: StartSonar.bat not found at $startScript" -ForegroundColor Red
        return $false
    }
    
    # Check if SonarQube is already running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:9000" -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "SonarQube is already running!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "SonarQube not running, starting..." -ForegroundColor Yellow
    }
    
    # Start SonarQube in background
    try {
        Start-Process -FilePath $startScript -WindowStyle Minimized
        Write-Host "SonarQube startup initiated..." -ForegroundColor Yellow
        Write-Host "Please wait 2-3 minutes for SonarQube to start completely" -ForegroundColor Yellow
        
        # Wait and test connectivity
        Write-Host "Waiting for SonarQube to start..." -ForegroundColor Yellow
        $maxAttempts = 30
        $attempt = 0
        
        do {
            Start-Sleep -Seconds 10
            $attempt++
            Write-Host "Attempt $attempt/$maxAttempts - Testing connectivity..." -ForegroundColor Cyan
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:9000" -Method GET -TimeoutSec 10 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    Write-Host "SonarQube is now running!" -ForegroundColor Green
                    Write-Host "Access SonarQube at: http://localhost:9000" -ForegroundColor Yellow
                    Write-Host "Default login: admin/admin" -ForegroundColor Yellow
                    return $true
                }
            } catch {
                # Continue waiting
            }
        } while ($attempt -lt $maxAttempts)
        
        Write-Host "WARNING: SonarQube may still be starting. Check http://localhost:9000 manually." -ForegroundColor Orange
        return $true
        
    } catch {
        Write-Host "ERROR: Failed to start SonarQube: $_" -ForegroundColor Red
        return $false
    }
}

# Function to install SonarQube Scanner
function Install-SonarScanner {
    Write-Host "Installing SonarQube Scanner..." -ForegroundColor Yellow
    
    try {
        # Check if npm is available
        npm --version | Out-Null
        
        # Install sonarqube-scanner globally
        npm install -g sonarqube-scanner
        Write-Host "SonarQube Scanner installed via npm" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "npm not available, skipping scanner installation" -ForegroundColor Orange
        Write-Host "Please install Node.js or download SonarScanner manually" -ForegroundColor Yellow
        return $false
    }
}

# Function to run SonarQube analysis
function Start-SonarAnalysis {
    Write-Host "Running SonarQube Analysis..." -ForegroundColor Yellow
    
    # Check if SonarQube server is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:9000" -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Host "SonarQube server is running" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: SonarQube server is not accessible at http://localhost:9000" -ForegroundColor Red
        Write-Host "Please start SonarQube server first with -StartServer flag" -ForegroundColor Yellow
        return $false
    }
    
    # Generate test coverage first
    Write-Host "Generating test coverage..." -ForegroundColor Yellow
    
    if (Test-Path "backend\package.json") {
        try {
            Push-Location "backend"
            npm run test:coverage
            Pop-Location
            Write-Host "Test coverage generated" -ForegroundColor Green
        } catch {
            Pop-Location
            Write-Host "WARNING: Failed to generate test coverage" -ForegroundColor Orange
        }
    }
    
    # Check for sonar-project.properties
    if (-not (Test-Path "sonar-project.properties")) {
        Write-Host "ERROR: sonar-project.properties not found in current directory" -ForegroundColor Red
        return $false
    }
    
    # Run SonarQube analysis
    Write-Host "Starting SonarQube analysis..." -ForegroundColor Yellow
    try {
        # Try with sonar-scanner command
        $scannerCmd = Get-Command sonar-scanner -ErrorAction SilentlyContinue
        if ($scannerCmd) {
            sonar-scanner
        } else {
            # Try with npx
            npx sonarqube-scanner
        }
        
        Write-Host "SonarQube analysis completed!" -ForegroundColor Green
        Write-Host "View results at: http://localhost:9000" -ForegroundColor Yellow
        return $true
        
    } catch {
        Write-Host "ERROR: SonarQube analysis failed: $_" -ForegroundColor Red
        Write-Host "Make sure SonarQube Scanner is installed" -ForegroundColor Yellow
        return $false
    }
}

# Main execution
Write-Host "SonarQube Directory: $SonarQubeDir" -ForegroundColor Cyan

if ($Install) {
    if (Install-SonarQube) {
        Install-SonarScanner
    } else {
        Write-Host "Installation failed" -ForegroundColor Red
        exit 1
    }
}

if ($StartServer) {
    if (-not (Start-SonarQubeServer)) {
        Write-Host "Failed to start SonarQube server" -ForegroundColor Red
        exit 1
    }
}

if ($RunAnalysis) {
    if (-not (Start-SonarAnalysis)) {
        Write-Host "Analysis failed" -ForegroundColor Red
        exit 1
    }
}

if (-not $Install -and -not $StartServer -and -not $RunAnalysis) {
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\setup-sonarqube.ps1 -Install          # Install SonarQube" -ForegroundColor White
    Write-Host "  .\setup-sonarqube.ps1 -StartServer      # Start SonarQube server" -ForegroundColor White
    Write-Host "  .\setup-sonarqube.ps1 -RunAnalysis      # Run code analysis" -ForegroundColor White
    Write-Host "  .\setup-sonarqube.ps1 -All              # Do everything" -ForegroundColor White
}

Write-Host "`n=== SonarQube Setup Completed ===" -ForegroundColor Green