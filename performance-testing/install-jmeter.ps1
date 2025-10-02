# JMeter Installation and Setup Script for Windows
param(
    [string]$InstallPath = "C:\jmeter",
    [switch]$AddToPath,
    [switch]$SkipJavaCheck
)

Write-Host "=== JMeter Installation Script ===" -ForegroundColor Green

# Check Java installation first
if (-not $SkipJavaCheck) {
    Write-Host "Checking Java installation..." -ForegroundColor Yellow
    try {
        $javaVersion = java -version 2>&1 | Select-String "version"
        Write-Host "Java found: $javaVersion" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Java not found. Please install Java 8 or later first." -ForegroundColor Red
        Write-Host "Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
        Write-Host "Or install OpenJDK from: https://openjdk.org/" -ForegroundColor Yellow
        exit 1
    }
}

# Create installation directory
Write-Host "Creating installation directory: $InstallPath" -ForegroundColor Yellow
try {
    New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
    Write-Host "Installation directory created" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create installation directory: $_" -ForegroundColor Red
    exit 1
}

# Download JMeter
$jmeterVersion = "5.6.3"
$downloadUrl = "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-$jmeterVersion.zip"
$zipFile = "$env:TEMP\apache-jmeter-$jmeterVersion.zip"
$extractPath = $InstallPath

Write-Host "Downloading JMeter $jmeterVersion..." -ForegroundColor Yellow
Write-Host "URL: $downloadUrl" -ForegroundColor Cyan

try {
    # Check if already downloaded
    if (Test-Path $zipFile) {
        Write-Host "JMeter zip file already exists, using cached version" -ForegroundColor Green
    } else {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
        Write-Host "JMeter downloaded successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: Failed to download JMeter: $_" -ForegroundColor Red
    Write-Host "Please download manually from: https://jmeter.apache.org/download_jmeter.cgi" -ForegroundColor Yellow
    exit 1
}

# Extract JMeter
Write-Host "Extracting JMeter to $extractPath..." -ForegroundColor Yellow
try {
    # Remove existing installation if present
    $jmeterDir = "$extractPath\apache-jmeter-$jmeterVersion"
    if (Test-Path $jmeterDir) {
        Write-Host "Removing existing JMeter installation..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $jmeterDir
    }
    
    # Extract using .NET
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $extractPath)
    Write-Host "JMeter extracted successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to extract JMeter: $_" -ForegroundColor Red
    exit 1
}

# Set up JMeter paths
$jmeterHome = "$extractPath\apache-jmeter-$jmeterVersion"
$jmeterBin = "$jmeterHome\bin"

# Verify installation
if (Test-Path "$jmeterBin\jmeter.bat") {
    Write-Host "JMeter installation verified" -ForegroundColor Green
    Write-Host "JMeter Home: $jmeterHome" -ForegroundColor Yellow
    Write-Host "JMeter Bin: $jmeterBin" -ForegroundColor Yellow
} else {
    Write-Host "ERROR: JMeter installation verification failed" -ForegroundColor Red
    exit 1
}

# Add to PATH by default (unless user specifies not to)
if (-not $AddToPath.IsPresent -or $AddToPath) {
    Write-Host "Adding JMeter to system PATH..." -ForegroundColor Yellow
    try {
        # Get current PATH
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        
        # Check if JMeter is already in PATH
        if ($currentPath -notlike "*$jmeterBin*") {
            $newPath = "$currentPath;$jmeterBin"
            [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
            Write-Host "JMeter added to user PATH" -ForegroundColor Green
            Write-Host "Please restart PowerShell to use 'jmeter' command" -ForegroundColor Yellow
        } else {
            Write-Host "JMeter already in PATH" -ForegroundColor Green
        }
    } catch {
        Write-Host "WARNING: Failed to add JMeter to PATH: $_" -ForegroundColor Orange
        Write-Host "You can manually add: $jmeterBin" -ForegroundColor Yellow
    }
}

# Create desktop shortcut
Write-Host "Creating desktop shortcut..." -ForegroundColor Yellow
try {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut("$env:USERPROFILE\Desktop\JMeter.lnk")
    $shortcut.TargetPath = "$jmeterBin\jmeter.bat"
    $shortcut.WorkingDirectory = $jmeterBin
    $shortcut.Description = "Apache JMeter Load Testing Tool"
    $shortcut.Save()
    Write-Host "Desktop shortcut created" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Failed to create desktop shortcut: $_" -ForegroundColor Orange
}

# Update current session PATH
$env:PATH += ";$jmeterBin"

# Test JMeter installation
Write-Host "Testing JMeter installation..." -ForegroundColor Yellow
try {
    $jmeterTest = & "$jmeterBin\jmeter.bat" -v 2>&1 | Select-String "Apache JMeter"
    if ($jmeterTest) {
        Write-Host "JMeter installation test successful!" -ForegroundColor Green
        Write-Host "$jmeterTest" -ForegroundColor Cyan
    }
} catch {
    Write-Host "WARNING: JMeter test failed, but installation appears complete" -ForegroundColor Orange
}

# Clean up
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
try {
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    Write-Host "Cleanup completed" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Failed to clean up temporary files" -ForegroundColor Orange
}

Write-Host "`n=== Installation Summary ===" -ForegroundColor Green
Write-Host "JMeter Version: $jmeterVersion" -ForegroundColor White
Write-Host "Installation Path: $jmeterHome" -ForegroundColor White
Write-Host "Executable: $jmeterBin\jmeter.bat" -ForegroundColor White
Write-Host "Desktop Shortcut: Created" -ForegroundColor White

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Restart PowerShell to use 'jmeter' command" -ForegroundColor White
Write-Host "2. Or use full path: $jmeterBin\jmeter.bat" -ForegroundColor White
Write-Host "3. Run GUI: jmeter (or double-click desktop shortcut)" -ForegroundColor White
Write-Host "4. Run tests: .\run-performance-tests.ps1" -ForegroundColor White

Write-Host "`n=== JMeter Installation Completed Successfully! ===" -ForegroundColor Green