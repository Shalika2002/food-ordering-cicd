#!/usr/bin/env node

/**
 * Health Check Script for CI/CD Pipeline
 * Validates that all required scripts and configurations are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running CI/CD Health Check...\n');

const checks = [];

// Check if package.json exists and has required scripts
function checkPackageJson(dir, requiredScripts) {
    const packagePath = path.join(dir, 'package.json');
    if (!fs.existsSync(packagePath)) {
        checks.push({ status: '❌', message: `package.json not found in ${dir}` });
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};
    
    let allPresent = true;
    requiredScripts.forEach(script => {
        if (!scripts[script]) {
            checks.push({ status: '❌', message: `Script '${script}' missing in ${dir}/package.json` });
            allPresent = false;
        } else {
            checks.push({ status: '✅', message: `Script '${script}' found in ${dir}` });
        }
    });
    
    return allPresent;
}

// Check backend configuration
console.log('📋 Checking Backend Configuration...');
const backendScripts = [
    'start', 'test', 'test:unit', 'test:api', 'test:bdd', 
    'test:coverage', 'seed'
];
checkPackageJson('./backend', backendScripts);

// Check frontend configuration  
console.log('📋 Checking Frontend Configuration...');
const frontendScripts = ['start', 'build', 'test'];
checkPackageJson('./frontend', frontendScripts);

// Check if jest config exists
if (fs.existsSync('./backend/jest.config.js')) {
    checks.push({ status: '✅', message: 'Jest configuration found' });
} else {
    checks.push({ status: '❌', message: 'Jest configuration missing' });
}

// Check if cucumber config exists
if (fs.existsSync('./backend/cucumber.js')) {
    checks.push({ status: '✅', message: 'Cucumber configuration found' });
} else {
    checks.push({ status: '⚠️', message: 'Cucumber configuration not found (optional)' });
}

// Check if test directories exist
const testDirs = [
    './backend/tests/unit',
    './backend/tests/api', 
    './backend/tests/ui',
    './backend/features'
];

testDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js') || f.endsWith('.feature'));
        if (files.length > 0) {
            checks.push({ status: '✅', message: `Test files found in ${dir} (${files.length} files)` });
        } else {
            checks.push({ status: '⚠️', message: `Directory ${dir} exists but no test files found` });
        }
    } else {
        checks.push({ status: '❌', message: `Test directory ${dir} not found` });
    }
});

// Check GitHub Actions workflow
if (fs.existsSync('./.github/workflows/ci.yml')) {
    checks.push({ status: '✅', message: 'GitHub Actions workflow configured' });
} else {
    checks.push({ status: '❌', message: 'GitHub Actions workflow missing' });
}

// Print results
console.log('\n📊 Health Check Results:');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

checks.forEach(check => {
    console.log(`${check.status} ${check.message}`);
    if (check.status === '✅') passed++;
    else if (check.status === '❌') failed++;
    else warnings++;
});

console.log('='.repeat(50));
console.log(`📈 Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`);

if (failed > 0) {
    console.log('\n❌ Health check failed. Please fix the issues above before running the CI/CD pipeline.');
    process.exit(1);
} else {
    console.log('\n✅ Health check passed! Your project is ready for CI/CD pipeline.');
    process.exit(0);
}