# Complete Installation Guide: JMeter & SonarQube

## Prerequisites

### 1. Java Installation (Required for both tools)
1. **Download Java 11 or later**:
   - Go to: https://adoptium.net/
   - Download OpenJDK 11 or 17 (LTS versions)
   - Install with default settings

2. **Verify Java Installation**:
   ```cmd
   java -version
   ```
   Should show Java version 11 or higher.

3. **Set JAVA_HOME (if not set automatically)**:
   - Open System Properties → Advanced → Environment Variables
   - Add new System Variable:
     - Variable name: `JAVA_HOME`
     - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot` (or your Java path)

## Part 1: JMeter Installation

### Step 1: Download JMeter
1. Go to: https://jmeter.apache.org/download_jmeter.cgi
2. Download **Apache JMeter 5.6.3** (Binary zip file)
3. Extract to: `C:\apache-jmeter-5.6.3`

### Step 2: Setup JMeter
1. **Add JMeter to PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Edit System PATH variable
   - Add: `C:\apache-jmeter-5.6.3\bin`

2. **Create Desktop Shortcut**:
   - Right-click Desktop → New → Shortcut
   - Target: `C:\apache-jmeter-5.6.3\bin\jmeter.bat`
   - Name: "JMeter"

3. **Test Installation**:
   ```cmd
   jmeter -v
   ```

### Step 3: Launch JMeter GUI
1. **Start JMeter**:
   - Double-click desktop shortcut, OR
   - Run: `jmeter` from command prompt, OR
   - Navigate to `C:\apache-jmeter-5.6.3\bin` and double-click `jmeter.bat`

2. **JMeter GUI should open** - this is where you'll run your performance tests

## Part 2: SonarQube Installation

### Step 1: Download SonarQube Community Edition
1. Go to: https://www.sonarqube.org/downloads/
2. Download **SonarQube Community Edition** (ZIP file)
3. Extract to: `C:\sonarqube-10.3.0.82913`

### Step 2: Setup SonarQube
1. **Navigate to SonarQube directory**:
   ```cmd
   cd C:\sonarqube-10.3.0.82913\bin\windows-x86-64
   ```

2. **Start SonarQube Server**:
   ```cmd
   StartSonar.bat
   ```

3. **Wait for startup** (2-3 minutes). You'll see:
   ```
   SonarQube is up
   ```

4. **Access SonarQube**:
   - Open browser: http://localhost:9000
   - Default login: `admin` / `admin`
   - Change password when prompted

### Step 3: Install SonarQube Scanner
1. **Download SonarQube Scanner**:
   - Go to: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
   - Download "SonarScanner CLI" for Windows
   - Extract to: `C:\sonar-scanner-4.8.0.2856`

2. **Add Scanner to PATH**:
   - Add to System PATH: `C:\sonar-scanner-4.8.0.2856\bin`

3. **Test Scanner**:
   ```cmd
   sonar-scanner -v
   ```

## Part 3: Running Tests in the Applications

### A. JMeter Performance Testing

#### Step 1: Open JMeter GUI
1. Launch JMeter from desktop shortcut
2. You'll see the JMeter interface with Test Plan tree

#### Step 2: Load Our Test Plan
1. In JMeter GUI: **File → Open**
2. Navigate to: `h:\4th Semester\QA Project\2\performance-testing\Food-API-Load-Test.jmx`
3. Click **Open**

#### Step 3: Start Backend Server
```powershell
# In PowerShell
cd "h:\4th Semester\QA Project\2\backend"
npm start
```
Keep this running in background.

#### Step 4: Configure Test Parameters
1. In JMeter, select **Test Plan** in the tree
2. In **User Defined Variables** section, verify:
   - `BASE_URL`: http://localhost:5000
   - `API_PATH`: /api

#### Step 5: Run Performance Test
1. **Enable Light Load Test**:
   - Right-click "Food API Load Test - Light Load" → Enable
   - Right-click "Food API Load Test - Heavy Load" → Disable

2. **Start Test**:
   - Click green **Start** button (▶️) in toolbar
   - Or press **Ctrl+R**

3. **Monitor Results**:
   - Click on "Summary Report" to see live results
   - Click on "Graph Results" for visual charts
   - Click on "Response Times Over Time" for performance graphs

#### Step 6: Analyze Results
- **Response Time**: Should be < 500ms
- **Throughput**: Requests per second
- **Error Rate**: Should be < 5%

### B. SonarQube Code Quality Analysis

#### Step 1: Ensure SonarQube is Running
1. Open browser: http://localhost:9000
2. Login with admin credentials
3. You should see SonarQube dashboard

#### Step 2: Generate Test Coverage
```powershell
cd "h:\4th Semester\QA Project\2\backend"
npm run test:coverage
```

#### Step 3: Run SonarQube Analysis
```powershell
cd "h:\4th Semester\QA Project\2"
sonar-scanner
```

#### Step 4: View Results in SonarQube
1. Go to: http://localhost:9000
2. Click on your project: "Food Ordering Application"
3. Explore different tabs:
   - **Overview**: Overall quality gate and metrics
   - **Issues**: Bugs, vulnerabilities, code smells
   - **Security Hotspots**: Security-sensitive code
   - **Measures**: Detailed metrics and coverage

## Troubleshooting

### JMeter Issues
- **Java Error**: Ensure Java 11+ is installed and JAVA_HOME is set
- **Port 4445 in use**: Close other JMeter instances
- **Server connection failed**: Ensure backend server is running on port 5000

### SonarQube Issues
- **Port 9000 in use**: Stop other SonarQube instances or change port
- **Elasticsearch errors**: Increase system virtual memory
- **Scanner not found**: Ensure sonar-scanner is in PATH

### Common Issues
- **Antivirus blocking**: Add exceptions for installation directories
- **Windows Defender**: Allow JMeter and SonarQube through firewall
- **Path issues**: Use full paths if environment variables don't work

## Quick Start Commands

### Start Everything:
```powershell
# Terminal 1: Start Backend
cd "h:\4th Semester\QA Project\2\backend"
npm start

# Terminal 2: Start SonarQube
cd C:\sonarqube-10.3.0.82913\bin\windows-x86-64
StartSonar.bat

# Terminal 3: Launch JMeter GUI
jmeter
```

### Run Tests:
```powershell
# Generate coverage and run SonarQube analysis
cd "h:\4th Semester\QA Project\2\backend"
npm run test:coverage
cd ..
sonar-scanner
```

## Expected Results

### JMeter Results:
- **Average Response Time**: 200-500ms
- **Throughput**: 10-20 requests/second
- **Error Rate**: ~33% (due to auth endpoints without proper setup)

### SonarQube Results:
- **Lines of Code**: ~1500-2000
- **Coverage**: 70-85%
- **Issues**: 10-25 total issues
- **Quality Gate**: Pass/Fail based on conditions

## Demo Preparation

### For JMeter Demo:
1. Have backend server running
2. Load test plan in JMeter GUI
3. Show test structure and configuration
4. Run test and show real-time results
5. Explain metrics and bottlenecks

### For SonarQube Demo:
1. Have SonarQube server running
2. Show project dashboard
3. Navigate through different issue types
4. Show before/after security fixes
5. Explain quality gate conditions

This gives you complete control over both tools and allows for impressive demonstrations!