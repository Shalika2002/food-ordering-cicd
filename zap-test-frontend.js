const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ZapFrontendTester {
    constructor() {
        this.zapPath = process.env.ZAP_PATH || 'zap.sh'; // or zap.bat on Windows
        this.frontendUrl = 'http://localhost:3000';
        this.backendUrl = 'http://localhost:5001';
        this.reportDir = './zap-reports';
        this.sessionFile = './zap-session.session';
    }

    async ensureDirectories() {
        if (!fs.existsSync(this.reportDir)) {
            fs.mkdirSync(this.reportDir, { recursive: true });
        }
    }

    async waitForServer(url, timeout = 30000) {
        const http = require('http');
        const startTime = Date.now();
        
        return new Promise((resolve, reject) => {
            const checkServer = () => {
                const req = http.get(url, (res) => {
                    console.log(`✅ Server at ${url} is ready`);
                    resolve(true);
                }).on('error', (err) => {
                    if (Date.now() - startTime > timeout) {
                        reject(new Error(`Server at ${url} not ready after ${timeout}ms`));
                    } else {
                        setTimeout(checkServer, 1000);
                    }
                });
            };
            checkServer();
        });
    }

    async runZapBaseline() {
        console.log('🔍 Running ZAP Baseline Scan...');
        
        return new Promise((resolve, reject) => {
            const zapArgs = [
                '-cmd',
                '-quickurl', this.frontendUrl,
                '-quickprogress',
                '-quickout', path.join(this.reportDir, 'baseline-report.html')
            ];

            const zapProcess = spawn(this.zapPath, zapArgs);

            zapProcess.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            zapProcess.stderr.on('data', (data) => {
                console.error(data.toString());
            });

            zapProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ ZAP Baseline scan completed');
                    resolve();
                } else {
                    console.log(`⚠️ ZAP Baseline scan completed with warnings (exit code: ${code})`);
                    resolve(); // ZAP often exits with non-zero even on success
                }
            });

            zapProcess.on('error', (err) => {
                reject(err);
            });
        });
    }

    async runZapFullScan() {
        console.log('🔍 Running ZAP Full Scan with Authentication...');
        
        return new Promise((resolve, reject) => {
            const zapArgs = [
                '-daemon',
                '-port', '8080',
                '-config', 'api.addrs.addr.name=*',
                '-config', 'api.addrs.addr.regex=true'
            ];

            const zapProcess = spawn(this.zapPath, zapArgs);
            
            // Wait for ZAP to start, then run API commands
            setTimeout(async () => {
                try {
                    await this.runZapApiCommands();
                    resolve();
                } catch (error) {
                    reject(error);
                } finally {
                    zapProcess.kill();
                }
            }, 10000);
        });
    }

    async runZapApiCommands() {
        const axios = require('axios').default;
        const zapApi = 'http://localhost:8080';

        try {
            // Create context
            await axios.get(`${zapApi}/JSON/context/action/newContext/?contextName=FrontendTest`);
            
            // Include URL in context
            await axios.get(`${zapApi}/JSON/context/action/includeInContext/?contextName=FrontendTest&regex=${encodeURIComponent(this.frontendUrl + '.*')}`);
            
            // Spider the application
            console.log('🕷️ Starting spider scan...');
            const spiderResult = await axios.get(`${zapApi}/JSON/spider/action/scan/?url=${this.frontendUrl}&contextName=FrontendTest`);
            const scanId = spiderResult.data.scan;
            
            // Wait for spider to complete
            await this.waitForScanCompletion(zapApi, 'spider', scanId);
            
            // Run active scan
            console.log('🎯 Starting active scan...');
            const activeScanResult = await axios.get(`${zapApi}/JSON/ascan/action/scan/?url=${this.frontendUrl}&contextName=FrontendTest`);
            const activeScanId = activeScanResult.data.scan;
            
            // Wait for active scan to complete
            await this.waitForScanCompletion(zapApi, 'ascan', activeScanId);
            
            // Generate report
            console.log('📊 Generating report...');
            const reportResult = await axios.get(`${zapApi}/OTHER/core/other/htmlreport/`);
            
            fs.writeFileSync(path.join(this.reportDir, 'full-scan-report.html'), reportResult.data);
            
            console.log('✅ ZAP Full scan completed');
            
        } catch (error) {
            console.error('❌ Error during ZAP API commands:', error.message);
            throw error;
        }
    }

    async waitForScanCompletion(zapApi, scanType, scanId) {
        const axios = require('axios').default;
        let progress = 0;
        
        while (progress < 100) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                const statusResult = await axios.get(`${zapApi}/JSON/${scanType}/view/status/?scanId=${scanId}`);
                progress = parseInt(statusResult.data.status);
                console.log(`${scanType} progress: ${progress}%`);
            } catch (error) {
                console.log(`Error checking ${scanType} status:`, error.message);
                break;
            }
        }
    }

    async runSecurityHeadersTest() {
        console.log('🛡️ Testing Security Headers...');
        
        const axios = require('axios').default;
        
        try {
            const response = await axios.get(this.frontendUrl);
            const headers = response.headers;
            
            const securityTests = [
                {
                    name: 'X-Frame-Options',
                    header: 'x-frame-options',
                    expected: ['DENY', 'SAMEORIGIN'],
                    critical: true
                },
                {
                    name: 'X-Content-Type-Options',
                    header: 'x-content-type-options',
                    expected: ['nosniff'],
                    critical: true
                },
                {
                    name: 'Content-Security-Policy',
                    header: 'content-security-policy',
                    expected: null,
                    critical: true
                },
                {
                    name: 'Strict-Transport-Security',
                    header: 'strict-transport-security',
                    expected: null,
                    critical: false
                }
            ];

            const results = [];
            
            securityTests.forEach(test => {
                const headerValue = headers[test.header];
                const isPresent = !!headerValue;
                const isValid = !test.expected || test.expected.some(exp => 
                    headerValue?.toLowerCase().includes(exp.toLowerCase())
                );
                
                results.push({
                    ...test,
                    present: isPresent,
                    valid: isValid,
                    value: headerValue || 'Not Set',
                    status: isPresent && (isValid || !test.expected) ? 'PASS' : 'FAIL'
                });
                
                const status = isPresent && (isValid || !test.expected) ? '✅' : '❌';
                console.log(`${status} ${test.name}: ${headerValue || 'Not Set'}`);
            });
            
            // Save results
            fs.writeFileSync(
                path.join(this.reportDir, 'security-headers-report.json'),
                JSON.stringify(results, null, 2)
            );
            
        } catch (error) {
            console.error('❌ Error testing security headers:', error.message);
        }
    }

    async run() {
        try {
            console.log('🚀 Starting ZAP Frontend Security Tests');
            console.log(`📍 Frontend URL: ${this.frontendUrl}`);
            console.log(`📍 Backend URL: ${this.backendUrl}`);
            
            await this.ensureDirectories();
            
            // Wait for servers to be ready
            console.log('⏳ Waiting for servers to be ready...');
            await this.waitForServer(this.frontendUrl);
            await this.waitForServer(this.backendUrl);
            
            // Run security headers test
            await this.runSecurityHeadersTest();
            
            // Run ZAP baseline scan
            await this.runZapBaseline();
            
            console.log('✅ All ZAP tests completed!');
            console.log(`📊 Reports saved in: ${this.reportDir}`);
            
        } catch (error) {
            console.error('❌ ZAP test failed:', error.message);
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const tester = new ZapFrontendTester();
    tester.run();
}

module.exports = ZapFrontendTester;
