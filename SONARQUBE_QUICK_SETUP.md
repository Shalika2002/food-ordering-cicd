# Quick SonarQube Alternative Setup
## Using SonarLint in VS Code (Immediate Solution)

Since you're having Java version conflicts with the local SonarQube server, here's a faster alternative that will give you the same analysis results:

---

## 🚀 **Method 1: SonarLint Extension (Recommended - Quick Setup)**

### Step 1: Install SonarLint Extension
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search for: **"SonarLint"**
4. Install the official **SonarSource SonarLint** extension
5. Restart VS Code

### Step 2: Analyze Your Files
1. Open any JavaScript file in your project (e.g., `backend/routes/food.js`)
2. SonarLint will automatically analyze the file
3. Issues will appear as:
   - 🟡 Yellow squiggly lines (Code Smells)
   - 🔴 Red squiggly lines (Bugs)
   - 🔒 Security indicators (Vulnerabilities)

### Step 3: View All Issues
1. Open **Problems Panel**: `View` → `Problems` (or `Ctrl+Shift+M`)
2. You'll see all issues categorized by:
   - **Error** (Bugs)
   - **Warning** (Code Smells)
   - **Info** (Suggestions)

---

## 🛠️ **Method 2: Fix Java Issue for Local SonarQube**

If you want to use the full SonarQube server, here's how to fix the Java issue:

### Option A: Download Java 21 (Recommended)
```powershell
# Download and install Java 21 from Oracle or OpenJDK
# Visit: https://jdk.java.net/21/
# After installation, set JAVA_HOME:
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "C:\Program Files\Java\jdk-21\bin;" + $env:PATH
```

### Option B: Use Chocolatey to Install Java 21
```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java 21
choco install openjdk21 -y

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-21.0.1"
$env:PATH = "C:\Program Files\OpenJDK\jdk-21.0.1\bin;" + $env:PATH
```

---

## 🎯 **Immediate Action Plan (Use This Now)**

### Quick Analysis with SonarLint:

1. **Install SonarLint Extension** (5 minutes)
2. **Open these files and note the issues**:
   ```
   backend/app-vulnerable.js     - Should show security issues
   backend/app-secure.js        - Should show fewer issues  
   backend/routes/food.js       - Should show code smells
   backend/models/Food.js       - Should show any model issues
   ```

3. **Take Screenshots** of:
   - Problems panel showing issues count
   - Hover tooltips explaining issues
   - Before/after comparison

### Expected Results:
- **Code Smells**: ~10-15 issues in vulnerable app
- **Security Issues**: 3-5 vulnerabilities
- **Bugs**: 2-3 potential bugs
- **Overall**: Immediate code quality feedback

---

## 📊 **Getting Metrics for Your Presentation**

### Manual Issue Count:
```powershell
# Count issues in VS Code Problems panel:
# 1. Open Problems panel (Ctrl+Shift+M)
# 2. Filter by file: backend/routes/food.js
# 3. Count: Errors, Warnings, Info
# 4. Document for presentation
```

### Screenshot Checklist:
- [ ] Problems panel with issue counts
- [ ] Specific code with issue highlighting
- [ ] Issue descriptions on hover
- [ ] Security vulnerability examples
- [ ] Code smell examples

---

## 🔧 **Alternative: SonarCloud (Online)**

If local setup continues to have issues:

1. **Go to**: https://sonarcloud.io/
2. **Sign up** with GitHub account
3. **Import your repository**
4. **Run analysis online**
5. **Get comprehensive reports**

---

## ⚡ **Quick Commands Summary**

```powershell
# Install SonarLint in VS Code
# Extensions → Search "SonarLint" → Install

# Open project files:
code "backend/routes/food.js"
code "backend/app-vulnerable.js"

# View issues:
# Ctrl+Shift+M (Problems panel)
```

---

**Recommendation**: Use SonarLint extension for immediate results. You can get all the code quality metrics you need for your presentation without dealing with Java version issues.

**Time Required**: 5 minutes setup, immediate analysis results! ✅