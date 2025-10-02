# ZAP Security Testing Guide

## Overview
This guide explains how to run OWASP ZAP security tests against the Food Ordering frontend application.

## Prerequisites

### 1. Install OWASP ZAP
- Download from: https://www.zaproxy.org/download/
- Add ZAP to your system PATH
- Verify installation: `zap.sh -version` (Linux/Mac) or `zap.bat -version` (Windows)

### 2. Install Dependencies
```bash
npm install axios
```

## Running Tests

### Quick Security Headers Test
```bash
npm run zap:headers
```
This tests if security headers are properly configured.

### Baseline Security Scan
```bash
npm run zap:baseline
```
This runs a quick passive scan against the frontend.

### Full Security Scan
```bash
npm run zap:full
```
This runs a comprehensive active scan (takes longer).

## Test Setup

### 1. Start Your Servers
```bash
# Terminal 1 - Backend
npm run secure

# Terminal 2 - Frontend  
npm start

# Terminal 3 - ZAP Tests
npm run test:security
```

### 2. Configure ZAP Path (if needed)
```bash
# Linux/Mac
export ZAP_PATH="/path/to/zap.sh"

# Windows
set ZAP_PATH="C:\Program Files\OWASP\Zed Attack Proxy\zap.bat"
```

## Test Types

### 1. Security Headers Test
- X-Frame-Options
- X-Content-Type-Options  
- Content-Security-Policy
- Strict-Transport-Security
- X-XSS-Protection

### 2. Passive Scan
- Checks for common vulnerabilities
- No harmful requests sent
- Safe for production

### 3. Active Scan  
- Sends attack payloads
- Tests for XSS, SQL injection, etc.
- Only use in test environments

## Expected Results

### Security Headers (Should PASS)
```
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Content-Security-Policy: [configured]
✅ Strict-Transport-Security: [configured]
```

### Common Frontend Vulnerabilities to Test
- Cross-Site Scripting (XSS)
- Clickjacking
- Content Type Sniffing
- Mixed Content
- Insecure Headers

## Report Files
Reports are saved in `./zap-reports/`:
- `baseline-report.html` - Quick scan results
- `full-scan-report.html` - Comprehensive scan
- `security-headers-report.json` - Headers test results

## Troubleshooting

### ZAP Not Found
```bash
# Check if ZAP is in PATH
which zap.sh  # Linux/Mac
where zap.bat # Windows

# Or set full path
export ZAP_PATH="/opt/zaproxy/zap.sh"
```

### Server Not Ready
Make sure both frontend (port 3000) and backend (port 5001) are running before starting tests.

### Firewall Issues
ZAP may be blocked by firewall. Allow ZAP proxy (port 8080) in firewall settings.

## Continuous Integration

### GitHub Actions Example
```yaml
name: Security Tests
on: [push, pull_request]
jobs:
  zap-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Start servers
        run: |
          npm run secure &
          npm start &
          sleep 10
      - name: Run ZAP tests
        run: npm run test:security
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: zap-reports
          path: zap-reports/
```

## Best Practices

1. **Always test in development environment first**
2. **Run baseline scans regularly**
3. **Review all findings before deployment**
4. **Keep ZAP updated**
5. **Configure false positive filters**

## Security Checklist

- [ ] X-Frame-Options header set
- [ ] Content-Security-Policy configured
- [ ] X-Content-Type-Options: nosniff
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced in production
- [ ] No XSS vulnerabilities
- [ ] No clickjacking vulnerabilities
- [ ] Secure cookie settings
