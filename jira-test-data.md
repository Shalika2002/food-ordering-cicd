# Jira Test Data Setup - Security Bugs
# Copy and paste these into Jira GUI for quick setup

# =================================================================
# BUG 1: CRITICAL - Configuration Exposure
# =================================================================

PROJECT: Food Ordering API Testing
ISSUE TYPE: Security Bug
SUMMARY: Complete Server Configuration Exposure via /api/admin/config

PRIORITY: Highest
COMPONENTS: Backend Security
LABELS: security, configuration, data-exposure, critical

DESCRIPTION:
---
## 🚨 CRITICAL Security Vulnerability

The `/api/admin/config` endpoint in `app-vulnerable.js` exposes complete system configuration including database credentials, JWT secrets, and API keys without any authentication checks.

### 🎯 Vulnerability Details
- **Endpoint**: `GET /api/admin/config`
- **Authentication Required**: ❌ None (VULNERABILITY)
- **CVSS Score**: 9.8 (Critical)
- **CWE**: CWE-200 (Information Exposure)

### 🔍 Information Exposed
- Database credentials: `mongodb://admin:password123@localhost:27017`
- JWT secret: `super-secret-key-12345`
- API keys: Stripe, AWS, SendGrid
- Complete environment variables
- System configuration details

### 🧪 Steps to Reproduce
1. Start vulnerable server:
   ```bash
   cd "H:\4th Semester\QA Project\2\backend"
   npm run vulnerable
   ```

2. Access endpoint (no authentication required):
   ```bash
   curl http://localhost:5000/api/admin/config
   ```

3. Observe complete configuration exposure

### ✅ Expected Results
- Should require authentication (401/403 response)
- Should not expose sensitive configuration data
- Should implement proper access controls

### ❌ Actual Results
Returns complete system configuration including:
```json
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
```

### 💥 Security Impact
- **Severity**: Critical
- **Exploitability**: High (no authentication required)
- **Business Impact**: Complete system compromise
- **Data at Risk**: All credentials and configuration
- **Compliance Impact**: GDPR, SOX, PCI-DSS violations

### 🛠️ Recommended Fix
```javascript
// Add authentication middleware
app.get('/api/admin/config', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Return limited, safe configuration only
    res.json({
        settings: {
            maxUploadSize: '10MB',
            sessionTimeout: '1h'
        }
    });
});
```

### 📎 Evidence Files
- Vulnerable code: `backend/app-vulnerable.js` (lines 147-179)
- Secure implementation: `backend/app-secure.js`
- API response: See attached screenshot

---

CUSTOM FIELDS:
CVE ID: CVE-2024-0001
OWASP Category: A01:2021 - Broken Access Control
Security Impact: Critical
Exploit Complexity: Easy
Data Exposure: Yes - Credentials

# =================================================================
# BUG 2: MAJOR - Missing Security Headers
# =================================================================

PROJECT: Food Ordering API Testing
ISSUE TYPE: Security Bug
SUMMARY: Missing Security Headers Enable Clickjacking and XSS Attacks

PRIORITY: High
COMPONENTS: Backend Security
LABELS: security-headers, clickjacking, xss, mime-attacks

DESCRIPTION:
---
## ⚠️ MAJOR Security Vulnerability

The server lacks critical security headers making it vulnerable to clickjacking, XSS, and MIME type attacks.

### 🎯 Missing Security Headers
- ❌ `X-Frame-Options: DENY` (Allows clickjacking)
- ❌ `Content-Security-Policy` (Enables XSS attacks)
- ❌ `X-Content-Type-Options: nosniff` (MIME type attacks)
- ❌ `Strict-Transport-Security` (No HSTS protection)
- ❌ `Referrer-Policy` (Information leakage)

### 🧪 Steps to Reproduce
1. Start vulnerable server:
   ```bash
   npm run vulnerable
   ```

2. Open browser developer tools → Network tab

3. Navigate to: `http://localhost:5000`

4. Check response headers - observe missing security headers

5. Test clickjacking vulnerability:
   ```html
   <iframe src="http://localhost:5000/admin" width="100%" height="600px">
     Admin Panel - Can be embedded for clickjacking
   </iframe>
   ```

### ✅ Expected Results
All security headers should be present:
```http
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

### ❌ Actual Results
Response headers show:
```http
HTTP/1.1 200 OK
Content-Type: text/html
Server: Node.js/Express - Food Ordering API v1.0
X-Powered-By: Express/Node.js
// Missing all security headers ❌
```

### 💥 Security Impact
- **Clickjacking attacks** on admin panel
- **XSS vulnerabilities** via missing CSP
- **MIME type attacks** via missing nosniff
- **Information disclosure** via server headers

### 🛠️ Recommended Fix
```javascript
// Add security headers middleware
app.use(helmet({
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"]
        }
    },
    noSniff: true,
    hsts: { maxAge: 31536000 }
}));
```

---

CUSTOM FIELDS:
CVE ID: CVE-2024-0002
OWASP Category: A05:2021 - Security Misconfiguration
Security Impact: High
Exploit Complexity: Medium
Data Exposure: No

# =================================================================
# BUG 3: MAJOR - Password Exposure in Response
# =================================================================

PROJECT: Food Ordering API Testing
ISSUE TYPE: API Bug
SUMMARY: User Password Exposed in Authentication Response

PRIORITY: High
COMPONENTS: Authentication API
LABELS: authentication, data-exposure, privacy, gdpr

DESCRIPTION:
---
## ⚠️ MAJOR Privacy & Security Violation

The login endpoint returns user passwords in plain text within the authentication response, violating security best practices and privacy regulations.

### 🎯 Vulnerability Details
- **Endpoint**: `POST /api/auth/login`
- **Issue**: Password included in response payload
- **Privacy Impact**: GDPR violation
- **Security Risk**: Credential exposure in logs/traffic

### 🧪 Steps to Reproduce
1. Start vulnerable server:
   ```bash
   npm run vulnerable
   ```

2. Send login request:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. Examine response payload - observe password exposure

### ✅ Expected Results
Authentication response should exclude password:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
    // No password field ✅
  }
}
```

### ❌ Actual Results
Response includes sensitive data:
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "password": "admin123", // ❌ PASSWORD EXPOSED
    "previousPasswords": ["admin", "password", "123456"], // ❌ HISTORY EXPOSED
    "securityQuestions": {
      "question1": "What is your pet name?",
      "answer1": "fluffy" // ❌ SECURITY ANSWERS EXPOSED
    }
  }
}
```

### 💥 Security Impact
- **Password harvesting** from responses
- **Credential exposure** in application logs
- **Privacy violations** (GDPR, personal data)
- **Audit trail exposure** (previous passwords)

### 🛠️ Recommended Fix
```javascript
// Remove sensitive data before response
app.post('/api/auth/login', async (req, res) => {
    // ... authentication logic ...
    
    const safeUser = {
        id: user.id,
        username: user.username,
        role: user.role
        // Exclude password and sensitive fields
    };
    
    res.json({
        success: true,
        token,
        user: safeUser
    });
});
```

---

CUSTOM FIELDS:
CVE ID: CVE-2024-0003
OWASP Category: A02:2021 - Cryptographic Failures
Security Impact: High
Exploit Complexity: Easy
Data Exposure: Yes - Personal Data

# =================================================================
# BUG 4: MINOR - Information Disclosure in Errors
# =================================================================

PROJECT: Food Ordering API Testing
ISSUE TYPE: Bug
SUMMARY: Stack Traces and System Information Exposed in Error Messages

PRIORITY: Medium
COMPONENTS: Error Handling
LABELS: information-disclosure, debugging, stack-traces

DESCRIPTION:
---
## 📋 Information Disclosure Issue

Error handling middleware exposes detailed system information including stack traces, file paths, and environment details in error responses.

### 🎯 Information Exposed
- Complete stack traces with file paths
- Node.js version information
- Platform and architecture details
- Request headers and body data
- Environment variable details

### 🧪 Steps to Reproduce
1. Start vulnerable server:
   ```bash
   npm run vulnerable
   ```

2. Trigger an error (invalid endpoint):
   ```bash
   curl http://localhost:5000/api/invalid-endpoint
   ```

3. Examine error response for information disclosure

### ✅ Expected Results
Generic error message without system details:
```json
{
  "error": "Internal server error",
  "message": "Something went wrong. Please try again later."
}
```

### ❌ Actual Results
Detailed error information:
```json
{
  "error": "Internal Server Error",
  "message": "Cannot GET /api/invalid-endpoint",
  "stack": "Error: Something went wrong\n    at /home/user/app/backend/app-vulnerable.js:245:15",
  "nodeVersion": "v18.17.0",
  "platform": "linux",
  "request": {
    "headers": { /* full headers */ },
    "body": { /* request body */ }
  }
}
```

### 💥 Security Impact
- **System fingerprinting** from version info
- **Path disclosure** from stack traces
- **Technology stack** information exposure
- **Request data** leakage in error logs

### 🛠️ Recommended Fix
```javascript
// Secure error handling
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message); // Log internally only
    
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
        // No stack traces or system info
    });
});
```

---

CUSTOM FIELDS:
CVE ID: CVE-2024-0004
OWASP Category: A05:2021 - Security Misconfiguration
Security Impact: Medium
Exploit Complexity: Easy
Data Exposure: Yes - System Info

# =================================================================
# JIRA DASHBOARD CONFIGURATION
# =================================================================

DASHBOARD NAME: Security Bug Tracking Dashboard
DESCRIPTION: Real-time security vulnerability tracking for Food Ordering API

GADGETS TO ADD:

1. Filter Results Gadget:
   - Name: "Open Security Bugs"
   - JQL: project = FOAT AND issuetype = "Security Bug" AND resolution = Unresolved
   - Columns: Key, Summary, Priority, Status, Assignee

2. Pie Chart Gadget:
   - Name: "Security Bugs by Priority"
   - JQL: project = FOAT AND issuetype = "Security Bug"
   - Group by: Priority

3. Created vs Resolved Chart:
   - Name: "Security Bug Trend"
   - JQL: project = FOAT AND issuetype = "Security Bug"
   - Period: Last 30 days

4. Two Dimensional Filter Statistics:
   - Name: "Security Impact vs Complexity"
   - X-axis: Security Impact
   - Y-axis: Exploit Complexity
   - JQL: project = FOAT AND issuetype = "Security Bug"

# =================================================================
# USEFUL JQL QUERIES FOR TESTING
# =================================================================

# All security bugs
project = FOAT AND issuetype = "Security Bug"

# Critical security issues
project = FOAT AND priority = Highest AND labels = security

# Open security bugs assigned to me
project = FOAT AND status = Open AND assignee = currentUser() AND issuetype = "Security Bug"

# Security bugs created this week
project = FOAT AND created >= -7d AND labels = security

# High impact security issues
project = FOAT AND "Security Impact" = Critical

# Easy to exploit vulnerabilities
project = FOAT AND "Exploit Complexity" = Easy

# Bugs with CVE assigned
project = FOAT AND "CVE ID" is not EMPTY

# Data exposure issues
project = FOAT AND "Data Exposure" != No