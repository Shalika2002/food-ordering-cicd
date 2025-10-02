# Jira Automation Script - Create Security Bugs via API
# Run this in PowerShell to automatically create all bugs

# Configuration
$jiraUrl = "https://shalika-shathurusinghesh.atlassian.net"
$projectKey = "SCRUM"  # Your project key
$email = "your-email@example.com"  # Your Atlassian email
$apiToken = "YOUR_API_TOKEN_HERE"  # Generate from Atlassian Account Settings

# You need to generate an API token:
# 1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
# 2. Create API token
# 3. Replace YOUR_API_TOKEN_HERE with your actual token

Write-Host "=== Jira Bug Creation Automation Script ===" -ForegroundColor Green

# Check if configuration is set
if ($apiToken -eq "YOUR_API_TOKEN_HERE") {
    Write-Host "⚠️  Please configure your API token first!" -ForegroundColor Yellow
    Write-Host "1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens" -ForegroundColor White
    Write-Host "2. Create API token" -ForegroundColor White  
    Write-Host "3. Replace YOUR_API_TOKEN_HERE in this script" -ForegroundColor White
    Write-Host "4. Update your email address" -ForegroundColor White
    exit
}

# Base64 encode credentials
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${email}:${apiToken}"))

# Headers
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Bug 1: Critical Configuration Exposure
$bug1 = @{
    fields = @{
        project = @{ key = $projectKey }
        summary = "Complete Server Configuration Exposure via /api/admin/config"
        description = @"
## 🚨 CRITICAL Security Vulnerability

The `/api/admin/config` endpoint in `app-vulnerable.js` exposes complete system configuration including database credentials, JWT secrets, and API keys without any authentication checks.

### 🎯 Vulnerability Details
- **Endpoint**: `GET /api/admin/config`
- **Authentication Required**: ❌ None (VULNERABILITY)
- **CVSS Score**: 9.8 (Critical)

### 🔍 Information Exposed
- Database credentials: `mongodb://admin:password123@localhost:27017`
- JWT secret: `super-secret-key-12345`
- API keys: Stripe, AWS, SendGrid

### 🧪 Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Access endpoint: `curl http://localhost:5000/api/admin/config`
3. Observe complete configuration exposure

### ✅ Expected Results
Should require authentication and not expose sensitive data

### ❌ Actual Results
Returns complete system configuration including sensitive credentials

### 💥 Security Impact
- Complete system compromise possible
- Compliance violations (GDPR, SOX, PCI-DSS)

### 🛠️ Fix Location
File: `backend/app-secure.js` shows proper implementation
"@
        issuetype = @{ name = "Bug" }
        priority = @{ name = "Highest" }
        labels = @("security", "configuration", "critical")
    }
} | ConvertTo-Json -Depth 10

# Bug 2: Missing Security Headers  
$bug2 = @{
    fields = @{
        project = @{ key = $projectKey }
        summary = "Missing Security Headers Enable Clickjacking Attacks"
        description = @"
## ⚠️ MAJOR Security Vulnerability

The server lacks critical security headers making it vulnerable to clickjacking, XSS, and MIME type attacks.

### 🎯 Missing Security Headers
- ❌ X-Frame-Options: DENY (Allows clickjacking)
- ❌ Content-Security-Policy (Enables XSS attacks)
- ❌ X-Content-Type-Options: nosniff (MIME type attacks)

### 🧪 Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Open browser developer tools → Network tab
3. Navigate to: `http://localhost:5000`
4. Check response headers - observe missing security headers

### 💥 Security Impact
- Clickjacking attacks on admin panel
- XSS vulnerabilities via missing CSP
- MIME type attacks

### 🛠️ Recommended Fix
Add security headers middleware with helmet.js
"@
        issuetype = @{ name = "Bug" }
        priority = @{ name = "High" }
        labels = @("security-headers", "clickjacking", "xss")
    }
} | ConvertTo-Json -Depth 10

# Bug 3: Password Exposure
$bug3 = @{
    fields = @{
        project = @{ key = $projectKey }
        summary = "User Password Exposed in Authentication Response"
        description = @"
## ⚠️ MAJOR Privacy & Security Violation

The login endpoint returns user passwords in plain text within the authentication response.

### 🧪 Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Send login request with credentials
3. Examine response - observe password exposure

### 💥 Security Impact
- Password harvesting from responses
- Privacy violations (GDPR compliance issues)

### 🛠️ Recommended Fix
Remove sensitive data from user object before sending response
"@
        issuetype = @{ name = "Bug" }
        priority = @{ name = "High" }
        labels = @("authentication", "data-exposure", "privacy")
    }
} | ConvertTo-Json -Depth 10

# Bug 4: Information Disclosure
$bug4 = @{
    fields = @{
        project = @{ key = $projectKey }
        summary = "Stack Traces and System Information Exposed in Error Messages"
        description = @"
## 📋 Information Disclosure Issue

Error handling middleware exposes detailed system information including stack traces, file paths, and environment details.

### 💥 Security Impact
- System fingerprinting from version info
- Path disclosure from stack traces
- Technology stack information exposure

### 🛠️ Recommended Fix
Implement secure error handling without information disclosure
"@
        issuetype = @{ name = "Bug" }
        priority = @{ name = "Medium" }
        labels = @("information-disclosure", "debugging")
    }
} | ConvertTo-Json -Depth 10

# Function to create bug
function Create-JiraBug {
    param($bugData, $bugName)
    
    try {
        Write-Host "Creating $bugName..." -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri "$jiraUrl/rest/api/3/issue" -Method POST -Headers $headers -Body $bugData
        
        Write-Host "✅ Created $bugName - Issue Key: $($response.key)" -ForegroundColor Green
        return $response.key
    }
    catch {
        Write-Host "❌ Failed to create $bugName" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Create all bugs
Write-Host "`nCreating security bugs..." -ForegroundColor Yellow

$bug1Key = Create-JiraBug $bug1 "Critical Configuration Exposure"
$bug2Key = Create-JiraBug $bug2 "Missing Security Headers"  
$bug3Key = Create-JiraBug $bug3 "Password Exposure"
$bug4Key = Create-JiraBug $bug4 "Information Disclosure"

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "Created bugs in project: $projectKey" -ForegroundColor White
if ($bug1Key) { Write-Host "- $bug1Key: Critical Configuration Exposure" -ForegroundColor White }
if ($bug2Key) { Write-Host "- $bug2Key: Missing Security Headers" -ForegroundColor White }
if ($bug3Key) { Write-Host "- $bug3Key: Password Exposure" -ForegroundColor White }
if ($bug4Key) { Write-Host "- $bug4Key: Information Disclosure" -ForegroundColor White }

Write-Host "`nView your bugs at: $jiraUrl/browse/$projectKey" -ForegroundColor Cyan
Write-Host "Automation complete! 🎉" -ForegroundColor Green