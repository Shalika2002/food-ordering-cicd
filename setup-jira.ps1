# Jira Quick Setup Script
# Run this in PowerShell as Administrator

Write-Host "=== Jira Installation Helper Script ===" -ForegroundColor Green

# Function to check if running as admin
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host "Please run this script as Administrator!" -ForegroundColor Red
    exit 1
}

Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
    
    # Create Jira data directory
    $jiraDataPath = "H:\4th Semester\QA Project\2\jira-data"
    if (-not (Test-Path $jiraDataPath)) {
        New-Item -ItemType Directory -Path $jiraDataPath -Force
        Write-Host "✓ Created Jira data directory: $jiraDataPath" -ForegroundColor Green
    }
    
    Write-Host "Starting Jira Docker container..." -ForegroundColor Yellow
    
    # Pull latest Jira image
    docker pull atlassian/jira-software:latest
    
    # Stop existing container if running
    docker stop jira-server 2>$null
    docker rm jira-server 2>$null
    
    # Run Jira container
    docker run -d --name jira-server `
        -p 8080:8080 `
        -v "${jiraDataPath}:/var/atlassian/application-data/jira" `
        atlassian/jira-software:latest
    
    Write-Host "✓ Jira container started successfully!" -ForegroundColor Green
    Write-Host "🌐 Access Jira at: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "⏱️  Please wait 3-5 minutes for Jira to fully start" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Docker not found. Installing Docker Desktop..." -ForegroundColor Red
    Write-Host "Please download Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "After installation, restart your computer and run this script again." -ForegroundColor Yellow
}

# Check if Java is installed (for server installation option)
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Java not found - required for server installation" -ForegroundColor Yellow
    Write-Host "Download from: https://adoptopenjdk.net/" -ForegroundColor Yellow
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Wait for Jira to start (3-5 minutes)" -ForegroundColor White
Write-Host "2. Open browser: http://localhost:8080" -ForegroundColor White  
Write-Host "3. Follow the setup wizard" -ForegroundColor White
Write-Host "4. Create your first project: 'Food Ordering API Testing'" -ForegroundColor White
Write-Host "5. Follow the detailed guide in JIRA_INSTALLATION_AND_TESTING_GUIDE.md" -ForegroundColor White

Write-Host "`n=== Troubleshooting ===" -ForegroundColor Cyan
Write-Host "• If port 8080 is busy: docker run -p 8081:8080 ..." -ForegroundColor White
Write-Host "• Check container status: docker ps" -ForegroundColor White
Write-Host "• View logs: docker logs jira-server" -ForegroundColor White
Write-Host "• Stop Jira: docker stop jira-server" -ForegroundColor White

Write-Host "`nSetup script completed!" -ForegroundColor Green