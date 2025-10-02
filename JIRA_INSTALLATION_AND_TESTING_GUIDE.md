# 🚀 Jira Installation and GUI Testing Guide

## 📋 Overview
This guide provides step-by-step instructions for installing Jira locally and setting up comprehensive defect tracking tests in the GUI for your Food Ordering API project.

---

## 🔧 Installation Options

### Option 1: Jira Cloud (Recommended for Beginners)
- **Pros**: No installation required, always up-to-date, 10 users free
- **Cons**: Requires internet connection, limited customization
- **Best for**: Learning, small teams, quick setup

### Option 2: Jira Server (Local Installation)
- **Pros**: Full control, offline access, complete customization
- **Cons**: Requires setup and maintenance
- **Best for**: Advanced users, enterprise environments

### Option 3: Docker Installation (Recommended for Testing)
- **Pros**: Easy setup, isolated environment, easy cleanup
- **Cons**: Requires Docker knowledge
- **Best for**: Development and testing

---

## 🌐 Method 1: Jira Cloud Setup (Fastest - 10 minutes)

### Step 1: Create Atlassian Account
1. Go to [https://www.atlassian.com/software/jira/free](https://www.atlassian.com/software/jira/free)
2. Click "Get started for free"
3. Enter your email and create password
4. Verify your email address

### Step 2: Set Up Your Site
1. Choose a site name (e.g., `yourname-qa-project`)
2. Your Jira URL will be: `https://yourname-qa-project.atlassian.net`
3. Select "Software development" as your team type
4. Choose "Scrum" or "Kanban" template

### Step 3: Create Your Project
1. Click "Create project"
2. Select "Bug tracking" template
3. Project name: "Food Ordering API Testing"
4. Project key: "FOAT" (will auto-generate issue keys like FOAT-1)
5. Click "Create"

### Step 4: Initial Configuration
```
Project Settings → Details:
- Description: "Defect tracking for Food Ordering API security testing"
- Project lead: Your account
- Default assignee: Project lead

Project Settings → Issue Types:
- Bug (default)
- Security Bug (create new)
- Task
- Story
```

---

## 🐳 Method 2: Docker Installation (Recommended for Local Testing)

### Prerequisites
- Docker Desktop installed
- At least 4GB RAM available
- 10GB free disk space

### Step 1: Install Docker
```powershell
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Install and restart your computer
# Verify installation
docker --version
```

### Step 2: Run Jira Container
```powershell
# Create directory for Jira data
mkdir "H:\4th Semester\QA Project\2\jira-data"

# Run Jira container
docker run -d --name jira-server `
  -p 8080:8080 `
  -v "H:\4th Semester\QA Project\2\jira-data:/var/atlassian/application-data/jira" `
  atlassian/jira-software:latest
```

### Step 3: Access Jira Setup
1. Wait 3-5 minutes for Jira to start
2. Open browser: `http://localhost:8080`
3. You'll see the Jira setup wizard

### Step 4: Complete Setup Wizard
1. **Database Setup**: Choose "Built-in database" for testing
2. **License**: Select "Generate evaluation license" (free 30 days)
3. **Administrator Account**:
   - Username: `admin`
   - Password: `admin123`
   - Full name: `QA Administrator`
   - Email: `qa-admin@yourcompany.com`
4. **Project Setup**: Skip for now, we'll create manually

---

## 💻 Method 3: Full Server Installation (Advanced)

### Prerequisites
- Windows 10/11
- Java 11 or 17 JDK
- 4GB+ RAM
- 10GB+ disk space

### Step 1: Install Java JDK
```powershell
# Download OpenJDK 17 from https://adoptopenjdk.net/
# Install and verify
java -version
```

### Step 2: Download Jira
1. Go to [https://www.atlassian.com/software/jira/download](https://www.atlassian.com/software/jira/download)
2. Download "Jira Software Server" Windows installer
3. Run the installer as Administrator

### Step 3: Installation Process
1. **Installation Directory**: `C:\Program Files\Atlassian\JIRA`
2. **Home Directory**: `C:\Program Files\Atlassian\Application Data\JIRA`
3. **HTTP Port**: 8080 (default)
4. **Control Panel**: Yes (installs Windows service)

### Step 4: Start Jira Service
```powershell
# Start Jira service
net start "Atlassian JIRA"

# Access setup
# Open: http://localhost:8080
```

---

## 🎯 Project Setup in Jira GUI

### Step 1: Create Project for Food Ordering API

#### Using Project Template
1. **Dashboard** → **Projects** → **Create project**
2. **Select template**: "Bug tracking"
3. **Project details**:
   ```
   Name: Food Ordering API Security Testing
   Key: FOAT
   Description: Comprehensive defect tracking for Food Ordering API including security vulnerabilities and functional bugs
   Lead: [Your name]
   ```
4. Click **Create**

#### Manual Project Creation
1. **Projects** → **Create project** → **Select a project template**
2. Choose **Software development** → **Bug tracking**
3. Configure as above

### Step 2: Configure Issue Types

#### Navigate to Issue Types
1. **Project settings** → **Issue types**
2. Click **Add issue type**

#### Create Custom Issue Types
```
Security Bug:
- Name: Security Bug
- Description: Security vulnerabilities and exploits
- Icon: 🔒 (security icon)

Configuration Issue:
- Name: Configuration Issue  
- Description: Server and deployment configuration problems
- Icon: ⚙️ (gear icon)

API Bug:
- Name: API Bug
- Description: REST API functionality issues
- Icon: 🔌 (API icon)
```

### Step 3: Create Custom Fields

#### Add Security-Specific Fields
1. **Project settings** → **Fields** → **Custom fields**
2. Click **Add custom field**

#### Security Fields to Create
```
CVE ID:
- Type: Text Field (single line)
- Name: CVE ID
- Description: Common Vulnerabilities and Exposures identifier

OWASP Category:
- Type: Select List (single choice)
- Name: OWASP Category
- Options: 
  * A01:2021 - Broken Access Control
  * A02:2021 - Cryptographic Failures
  * A03:2021 - Injection
  * A04:2021 - Insecure Design
  * A05:2021 - Security Misconfiguration

Security Impact:
- Type: Select List (single choice)
- Name: Security Impact
- Options: Critical, High, Medium, Low

Exploit Complexity:
- Type: Select List (single choice)  
- Name: Exploit Complexity
- Options: Easy, Medium, Hard

Data Exposure:
- Type: Select List (single choice)
- Name: Data Exposure
- Options: Yes - Credentials, Yes - Personal Data, Yes - System Info, No
```

### Step 4: Configure Workflows

#### Access Workflow Configuration
1. **Project settings** → **Workflows**
2. Edit the default workflow or create new

#### Security Bug Workflow
```
Statuses to Add:
- Open (default)
- In Security Analysis
- In Development  
- Code Review
- Security Testing
- Resolved
- Closed

Transitions:
Open → In Security Analysis (Assign to security team)
In Security Analysis → In Development (Root cause identified)
In Development → Code Review (Fix implemented)
Code Review → Security Testing (Code approved)
Security Testing → Resolved (Security verified)
Resolved → Closed (Deployed and confirmed)
```

---

## 🐛 Creating Test Bugs in Jira GUI

### Bug 1: Critical Configuration Exposure

#### Step 1: Create Issue
1. **Create** button (+ icon) → **Bug**
2. **Project**: Food Ordering API Security Testing

#### Step 2: Fill Basic Details
```
Summary: Complete Server Configuration Exposure via /api/admin/config

Issue Type: Security Bug

Priority: Highest

Components: Backend Security

Labels: security, configuration, data-exposure, critical

Description:
## Security Vulnerability Description

The `/api/admin/config` endpoint in app-vulnerable.js exposes complete system configuration including database credentials, JWT secrets, and API keys without any authentication checks.

## Vulnerability Details
- **Endpoint**: GET /api/admin/config
- **Authentication Required**: None (❌ Vulnerability)
- **Information Exposed**: 
  - Database credentials: mongodb://admin:password123@localhost:27017
  - JWT secret: super-secret-key-12345
  - API keys: Stripe, AWS, SendGrid
  - Complete environment variables

## Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Navigate to: http://localhost:5000/api/admin/config  
3. Observe complete configuration exposure (no authentication required)

## Expected Results
- Should require authentication
- Should return 401/403 for unauthorized access
- Should not expose sensitive configuration data

## Actual Results  
- Returns complete system configuration
- Exposes database credentials and API keys
- No authentication or authorization checks

## Security Impact
- **Severity**: Critical
- **Exploitability**: High (no authentication required)
- **Business Impact**: Complete system compromise possible
- **Data at Risk**: All system credentials and configuration

## Evidence
{code:json}
{
  "database": {
    "host": "localhost",
    "port": 27017,
    "username": "admin",
    "password": "password123",
    "connectionString": "mongodb://admin:password123@localhost:27017/fooddb"
  },
  "jwt_secret": "super-secret-key-12345",
  "api_keys": {
    "stripe": "sk_live_abc123xyz789",
    "sendgrid": "SG.xyz789abc123",
    "aws": "AKIA123456789"
  }
}
{code}
```

#### Step 3: Set Custom Fields
```
CVE ID: CVE-2024-0001
OWASP Category: A01:2021 - Broken Access Control
Security Impact: Critical
Exploit Complexity: Easy  
Data Exposure: Yes - Credentials
```

#### Step 4: Attachments
1. **Attach** → **Files**
2. Attach screenshots of:
   - Vulnerable endpoint response
   - Browser network tab showing exposed data
   - Code snippet from app-vulnerable.js

### Bug 2: Missing Security Headers

#### Create Second Issue
```
Summary: Missing Security Headers Enable Clickjacking and XSS Attacks

Issue Type: Security Bug
Priority: High
Components: Backend Security
Labels: security-headers, clickjacking, xss

Description:
## Security Vulnerability Description
The server lacks critical security headers (X-Frame-Options, Content-Security-Policy, X-Content-Type-Options) making it vulnerable to clickjacking, XSS, and MIME type attacks.

## Missing Headers
- ❌ X-Frame-Options: DENY  
- ❌ Content-Security-Policy
- ❌ X-Content-Type-Options: nosniff
- ❌ Strict-Transport-Security

## Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Open browser developer tools → Network tab
3. Navigate to: http://localhost:5000
4. Check response headers - observe missing security headers
5. Navigate to: http://localhost:5000/admin
6. Verify page can be embedded in iframe

## Proof of Concept - Clickjacking
{code:html}
<!-- Evil site can embed admin panel -->
<iframe src="http://localhost:5000/admin" width="100%" height="600px">
  Admin Panel - Can be clicked transparently
</iframe>
{code}

## Expected Results
Security headers should be present to prevent attacks

## Actual Results
No security headers configured, enabling multiple attack vectors

Custom Fields:
CVE ID: CVE-2024-0002
OWASP Category: A05:2021 - Security Misconfiguration  
Security Impact: High
Exploit Complexity: Medium
Data Exposure: No
```

### Bug 3: Password Exposure in API Response

#### Create Third Issue
```
Summary: User Password Exposed in Authentication Response

Issue Type: API Bug
Priority: High  
Components: Authentication API
Labels: authentication, data-exposure, privacy

Description:
## Bug Description
The login endpoint returns user passwords in plain text within the authentication response, violating security best practices and privacy requirements.

## Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Send POST request to `/api/auth/login`
3. Use payload: `{"username":"admin","password":"admin123"}`
4. Examine response - observe password in response

## API Test Command
{code:bash}
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
{code}

## Expected Results
Password should NOT be included in response

## Actual Results
{code:json}
{
  "user": {
    "username": "admin", 
    "password": "admin123",
    "previousPasswords": ["admin", "password", "123456"],
    "securityQuestions": {
      "question1": "What is your pet name?",
      "answer1": "fluffy"
    }
  }
}
{code}

Custom Fields:
CVE ID: CVE-2024-0003
OWASP Category: A02:2021 - Cryptographic Failures
Security Impact: High
Exploit Complexity: Easy
Data Exposure: Yes - Personal Data
```

### Bug 4: Information Disclosure in Errors

#### Create Fourth Issue
```
Summary: Stack Traces and System Information Exposed in Error Messages

Issue Type: Bug
Priority: Medium
Components: Error Handling
Labels: information-disclosure, debugging

Description:
## Bug Description
Error handling middleware exposes detailed system information including stack traces, file paths, and environment details in error responses.

## Steps to Reproduce
1. Start vulnerable server: `npm run vulnerable`
2. Trigger an error (invalid endpoint or malformed request)
3. Examine error response for information disclosure

## Example Error Response
{code:json}
{
  "error": "Internal Server Error",
  "stack": "Error: Something went wrong\n    at /home/user/app/backend/app-vulnerable.js:245:15",
  "nodeVersion": "v18.17.0", 
  "platform": "linux",
  "request": {
    "headers": { "user-agent": "..." },
    "body": { }
  }
}
{code}

Custom Fields:
CVE ID: CVE-2024-0004
OWASP Category: A05:2021 - Security Misconfiguration
Security Impact: Medium
Exploit Complexity: Easy
Data Exposure: Yes - System Info
```

---

## 📊 Jira GUI Testing Workflows

### Test 1: Bug Lifecycle Testing

#### Create Bug Workflow Test
1. **Create** → **Test** issue type
2. **Summary**: "Test Bug Lifecycle Workflow"
3. **Description**: Test all workflow transitions

#### Test Workflow Transitions
```
1. Create bug with status "Open"
2. Transition: Open → In Security Analysis
   - Add comment: "Assigning to security team for analysis"
   - Change assignee to security team member
   
3. Transition: In Security Analysis → In Development  
   - Add comment: "Root cause identified: missing authentication middleware"
   - Attach code analysis
   
4. Transition: In Development → Code Review
   - Add comment: "Fix implemented in feature branch"
   - Link to code repository/pull request
   
5. Transition: Code Review → Security Testing
   - Add comment: "Code review passed, ready for security verification"
   
6. Transition: Security Testing → Resolved
   - Add comment: "Security testing passed, vulnerability fixed"
   - Update resolution field
   
7. Transition: Resolved → Closed
   - Add comment: "Fix deployed to production, issue confirmed resolved"
```

### Test 2: Custom Fields Validation

#### Test Security Fields
1. Create test bug with all custom fields
2. Validate field options work correctly
3. Test field dependencies and validation rules

#### Test Data Entry
```
Test CVE ID Field:
- Valid: CVE-2024-0001 ✓
- Invalid: Should accept any format ✓

Test OWASP Category:
- Select each option ✓
- Verify dropdown works ✓

Test Security Impact:
- Critical, High, Medium, Low ✓
- Required field validation ✓

Test Exploit Complexity:
- Easy, Medium, Hard ✓ 
- Field interaction with Security Impact ✓
```

### Test 3: Search and Filter Testing

#### Create Search Filters
1. **Issues** → **Search for issues**
2. **Advanced search (JQL)**

#### Test JQL Queries
```bash
# All security bugs
project = FOAT AND issuetype = "Security Bug"

# Critical security issues  
project = FOAT AND priority = Highest AND labels = security

# Open security bugs
project = FOAT AND status = Open AND issuetype = "Security Bug"

# Bugs assigned to me
project = FOAT AND assignee = currentUser()

# Recent security bugs
project = FOAT AND created >= -7d AND labels = security

# Critical bugs with CVE
project = FOAT AND "CVE ID" is not EMPTY AND priority = Highest
```

#### Save Useful Filters
1. **Save as** → Name: "My Security Bugs"
2. **Share** with project team
3. Add to dashboard

### Test 4: Dashboard Configuration

#### Create Security Dashboard
1. **Dashboards** → **Create dashboard**
2. **Name**: "Security Bug Tracking Dashboard"
3. **Description**: "Real-time security vulnerability tracking"

#### Add Dashboard Gadgets
```
Gadgets to Add:

1. Filter Results Gadget:
   - Filter: "Open Security Bugs"
   - Display: Issues in table format

2. Pie Chart Gadget:  
   - Filter: "All Security Bugs"
   - Group by: Priority
   - Title: "Security Bugs by Priority"

3. Created vs Resolved Chart:
   - Filter: "Security Bugs"
   - Period: Last 30 days
   - Title: "Security Bug Trend"

4. Two Dimensional Filter Statistics:
   - X-axis: Security Impact
   - Y-axis: Exploit Complexity  
   - Filter: "Security Bugs"

5. Average Age Chart:
   - Filter: "Open Security Bugs"
   - Title: "Average Age of Open Security Issues"
```

### Test 5: Notification and Integration Testing

#### Configure Email Notifications
1. **Profile** → **Personal settings** → **Email**
2. Configure notifications for:
   - Issues assigned to me
   - Issues I'm watching  
   - Critical priority issues
   - Security-related comments

#### Test Notification Scenarios
```
Test Cases:
1. Create critical security bug → Verify immediate notification
2. Assign bug to team member → Verify assignment notification  
3. Add comment to watched issue → Verify comment notification
4. Transition workflow status → Verify status change notification
5. Update custom fields → Verify field change notification
```

---

## 🔍 Advanced GUI Testing

### Performance Testing
```
Load Testing Scenarios:
1. Create 100 test issues rapidly
2. Bulk import issues from CSV  
3. Complex JQL queries with large datasets
4. Dashboard loading with multiple gadgets
5. Attachment uploads and downloads
```

### Integration Testing  
```
API Integration:
1. Create issues via REST API
2. Verify GUI reflects API changes
3. Test webhook notifications
4. Bulk operations via CSV import

External Tool Integration:
1. Email notifications
2. Slack/Teams integration (if configured)
3. Git repository linking
4. CI/CD pipeline integration
```

### User Access Testing
```
Role-Based Testing:
1. Administrator access - Full permissions
2. Developer access - Limited admin functions  
3. QA Tester access - Bug creation and testing
4. Viewer access - Read-only permissions
5. Guest access - No access validation
```

---

## 📋 GUI Testing Checklist

### Pre-Testing Setup
- [ ] Jira installation completed successfully
- [ ] Project created and configured
- [ ] Custom fields added and tested
- [ ] Workflows configured properly
- [ ] User accounts created for testing

### Core Functionality Testing  
- [ ] Issue creation works correctly
- [ ] All issue types can be created
- [ ] Custom fields save and display properly
- [ ] Workflow transitions function correctly
- [ ] Search and filters work as expected

### Security Bug Testing
- [ ] All 4 security bugs created successfully
- [ ] Custom security fields populated
- [ ] Attachments uploaded properly
- [ ] Comments and descriptions formatted correctly
- [ ] Priority and severity assignments working

### Dashboard Testing
- [ ] Security dashboard created
- [ ] All gadgets display correctly
- [ ] Filters show accurate data
- [ ] Charts and graphs render properly
- [ ] Dashboard loads within acceptable time

### Integration Testing
- [ ] Email notifications working
- [ ] User permissions enforced correctly
- [ ] API integration functional (if used)
- [ ] Export/import features working
- [ ] Backup and restore tested

---

## 🎯 Demo Preparation for Viva

### Screenshots to Capture
1. **Project Dashboard**: Overview of all security bugs
2. **Critical Bug Detail**: BUG-001 complete view
3. **Workflow Diagram**: Security bug workflow visualization  
4. **Custom Fields**: Security-specific field configuration
5. **Search Results**: JQL query showing security bugs
6. **Security Dashboard**: Real-time metrics and charts

### Live Demo Script
```
1. Login to Jira (2 minutes)
2. Navigate to project dashboard (1 minute)  
3. Show bug list and filters (2 minutes)
4. Open critical bug BUG-001 (3 minutes)
5. Demonstrate workflow transitions (2 minutes)
6. Show custom fields and labels (2 minutes)
7. Display security dashboard (2 minutes)
8. Quick search and JQL demo (1 minute)
```

### Backup Plan
- Export all issues to Excel/PDF
- Take screenshots of all screens
- Prepare offline HTML export
- Have PowerPoint with screenshots ready

---

## 🚀 Next Steps

### For Viva Preparation
1. Complete all 4 bug entries in Jira
2. Configure security dashboard
3. Practice the demo flow multiple times
4. Prepare for common questions about Jira usage
5. Export documentation from Jira for backup

### For Continued Learning
1. Explore Jira automation rules
2. Set up integration with development tools
3. Configure advanced reporting
4. Learn JQL (Jira Query Language) in depth
5. Explore Confluence integration for documentation

---

## 📞 Support and Troubleshooting

### Common Issues and Solutions

#### Jira Won't Start
```bash
# Check if port 8080 is in use
netstat -an | findstr :8080

# Stop conflicting services
# Restart Jira service
net stop "Atlassian JIRA"
net start "Atlassian JIRA"
```

#### Performance Issues  
- Increase JVM memory in `setenv.bat`
- Clear browser cache and cookies
- Restart Jira service
- Check available disk space

#### Access Issues
- Verify firewall settings allow port 8080
- Check Windows Defender exceptions
- Verify admin credentials
- Reset admin password if needed

### Getting Help
- **Atlassian Documentation**: [https://confluence.atlassian.com/jira](https://confluence.atlassian.com/jira)
- **Community Forums**: [https://community.atlassian.com](https://community.atlassian.com)
- **Video Tutorials**: YouTube "Jira Tutorial" playlist
- **Local User Groups**: Search for Atlassian User Groups in your area

---

**Document Version**: 1.0  
**Last Updated**: September 29, 2025  
**Estimated Setup Time**: 2-3 hours for complete configuration  
**Skill Level**: Beginner to Intermediate