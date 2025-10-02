# 🚀 Quick Jira Setup Guide - Your Current Instance

## 📋 You're Currently Here
- ✅ Jira Cloud instance: `shalika-shathurusinghesh.atlassian.net`
- ✅ Project created: "My Scrum Project"
- ✅ Ready to configure for defect tracking

---

## 🎯 IMMEDIATE NEXT STEPS

### Step 1: Access Your Project (2 minutes)
1. Click on **"My Scrum Project"** in your dashboard
2. You'll see the project board view

### Step 2: Configure Project Settings (5 minutes)

#### A. Rename Project (Optional)
1. **Project settings** (gear icon) → **Details**
2. Change name to: "Food Ordering API Testing"
3. Change key to: "FOAT" (this will create issues like FOAT-1, FOAT-2)

#### B. Add Issue Types
1. **Project settings** → **Issue types**
2. **Add issue type** → Search for "Security Bug"
3. If not found, create custom:
   - Name: "Security Bug"
   - Description: "Security vulnerabilities and exploits"

### Step 3: Create Your First Critical Bug (10 minutes)

#### Click "Create" Button (+ icon)
Fill in these exact details:

```
PROJECT: My Scrum Project
ISSUE TYPE: Bug
SUMMARY: Complete Server Configuration Exposure via /api/admin/config

PRIORITY: Highest
LABELS: security, configuration, critical, data-exposure

DESCRIPTION:
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
1. Start vulnerable server:
   ```
   cd "H:\4th Semester\QA Project\2\backend"
   npm run vulnerable
   ```

2. Access endpoint:
   ```
   curl http://localhost:5000/api/admin/config
   ```

3. Observe complete configuration exposure

### ✅ Expected Results
- Should require authentication (401/403 response)
- Should not expose sensitive configuration

### ❌ Actual Results
Returns complete system configuration including sensitive credentials

### 💥 Security Impact
- **Severity**: Critical
- **Business Impact**: Complete system compromise
- **Compliance Impact**: GDPR, SOX, PCI-DSS violations

### 🛠️ Fix Location
File: `backend/app-secure.js` shows proper implementation with authentication
```

ASSIGNEE: Assign to yourself
REPORTER: You
```

### Step 4: Create Remaining 3 Bugs (15 minutes)

Create these additional bugs using the **Create** button:

#### Bug 2: Missing Security Headers
```
SUMMARY: Missing Security Headers Enable Clickjacking Attacks
PRIORITY: High
LABELS: security-headers, clickjacking, xss
DESCRIPTION: [Use description from jira-test-data.md]
```

#### Bug 3: Password Exposure
```
SUMMARY: User Password Exposed in Authentication Response  
PRIORITY: High
LABELS: authentication, data-exposure, privacy
DESCRIPTION: [Use description from jira-test-data.md]
```

#### Bug 4: Information Disclosure
```
SUMMARY: Stack Traces Exposed in Error Messages
PRIORITY: Medium  
LABELS: information-disclosure, debugging
DESCRIPTION: [Use description from jira-test-data.md]
```

---

## 🎯 Step 5: Create Security Dashboard (10 minutes)

### A. Create New Dashboard
1. **Dashboards** → **Create dashboard**
2. Name: "Security Bug Tracking Dashboard"
3. Description: "Real-time security vulnerability tracking"

### B. Add Gadgets
1. **Add gadget** → **Filter Results**
   - Name: "Open Security Bugs"
   - JQL: `labels = security AND resolution = Unresolved`

2. **Add gadget** → **Pie Chart**
   - Name: "Bugs by Priority"  
   - JQL: `labels = security`
   - Group by: Priority

3. **Add gadget** → **Activity Stream**
   - Shows recent bug activities

---

## 🎯 Step 6: Test Workflow Transitions (5 minutes)

### A. Practice Bug Lifecycle
1. Open your first critical bug
2. **Transition** → "In Progress"
3. Add comment: "Analyzing configuration exposure vulnerability"
4. **Transition** → "Done" (when you want to mark as resolved)

### B. Add Detailed Comments
Click **Comment** and add:
```
Root cause analysis completed:
- Missing authentication middleware on /api/admin/config
- Endpoint designed for debugging left in production
- No environment-based access controls

Recommended fix implemented in app-secure.js with proper authentication.
```

---

## 🎯 Step 7: Prepare for Viva Demo (10 minutes)

### A. Take Screenshots
Capture these screens:
1. Project dashboard with all 4 bugs
2. Critical bug detail view  
3. Security dashboard with charts
4. Bug workflow transitions

### B. Practice Demo Flow
1. **Show project overview** (30 seconds)
2. **Open critical bug** and explain details (2 minutes)
3. **Demonstrate workflow** transitions (1 minute)
4. **Show security dashboard** metrics (1 minute)
5. **Filter and search** functionality (30 seconds)

---

## 🔍 Useful JQL Queries to Test

Copy these into **Issues** → **Search**:

```sql
-- All security-related bugs
labels = security

-- Critical priority bugs  
priority = Highest AND labels = security

-- Open security bugs
labels = security AND resolution = Unresolved

-- Bugs created today
created >= startOfDay()

-- High priority unresolved bugs
priority in (Highest, High) AND resolution = Unresolved
```

---

## 🎬 Quick Demo Script for Viva

**"Let me show you our Jira-based defect tracking system:**

1. **Project Overview**: "Here's our Food Ordering API testing project with 4 security vulnerabilities identified"

2. **Critical Bug**: "This critical bug exposes complete server configuration - database credentials, API keys, JWT secrets"

3. **Bug Details**: "Each bug includes detailed reproduction steps, security impact analysis, and remediation guidance"

4. **Workflow**: "We track bugs through our workflow: Open → In Progress → Done"

5. **Dashboard**: "Our security dashboard shows real-time metrics and priority distribution"

**Total demo time: 5 minutes"**

---

## 📞 If You Need Help

### Common Issues:
- **Can't create custom fields**: You might need admin permissions
- **Issue types missing**: Use the default "Bug" type with security labels
- **JQL not working**: Start with simple queries like `labels = security`

### Backup Plan for Viva:
- Use screenshots if live demo fails
- Export issues to Excel as backup
- Have the detailed bug descriptions ready to show

---

## ✅ Checklist Before Viva

- [ ] 4 security bugs created with detailed descriptions
- [ ] At least one bug with comments and transitions
- [ ] Security dashboard created with gadgets
- [ ] Screenshots taken of all key screens
- [ ] Demo script practiced and timed
- [ ] JQL queries tested and working
- [ ] Backup documentation ready

**You're ready to demonstrate professional defect tracking in Jira!**