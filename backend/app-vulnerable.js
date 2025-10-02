const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// VULNERABLE: No security headers middleware - missing X-Frame-Options, CSP, X-Content-Type-Options
app.use(express.json());
app.use(cors());

// VULNERABLE: Ensure missing security headers are more detectable
app.use((req, res, next) => {
    res.setHeader('Server', 'Node.js/Express - Food Ordering API v1.0');
    res.setHeader('X-Powered-By', 'Express/Node.js');
    // VULNERABLE: Explicitly NOT setting security headers that ZAP looks for:
    // res.setHeader('X-Frame-Options', 'DENY'); // MISSING - allows clickjacking
    // res.setHeader('Content-Security-Policy', "default-src 'self'"); // MISSING - no CSP
    // res.setHeader('X-Content-Type-Options', 'nosniff'); // MISSING - allows MIME sniffing
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000'); // MISSING - no HSTS
    // res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); // MISSING
    // res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()'); // MISSING
    next();
});

// VULNERABLE: No anti-clickjacking headers + embeddable content
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Food Ordering API - Admin Panel</title>
            <!-- VULNERABLE: No CSP headers, inline styles and scripts -->
            <meta name="description" content="Food API Server - Admin: admin123, DB: mongodb://admin:password123@localhost:27017">
            <style>
                /* VULNERABLE: Inline CSS without CSP protection */
                body { font-family: Arial; margin: 20px; }
                .secret { color: red; display: none; }
            </style>
        </head>
        <body>
            <h1>Food Ordering API Server - Admin Panel</h1>
            <p>Server: Node.js ${process.version} on ${process.platform}</p>
            <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
            <p>Server Time: ${new Date().toISOString()}</p>
            <p>Process ID: ${process.pid}</p>
            <p>Memory Usage: ${JSON.stringify(process.memoryUsage())}</p>
            
            <!-- VULNERABLE: Massive information disclosure in HTML comments -->
            <!-- Production Database: mongodb://admin:password123@localhost:27017/fooddb -->
            <!-- Admin Credentials: admin / admin123 -->
            <!-- API Keys: Stripe=sk_live_abc123xyz789, AWS=AKIA123456789ABCDEF -->
            <!-- JWT Secret: super-secret-key-12345 -->
            <!-- Debug endpoints: /api/debug, /api/admin/config, /api/server-status -->
            <!-- File upload path: /uploads/ (no restrictions) -->
            <!-- Backup location: /backups/database_backup_2024.sql -->
            
            <div class="secret">
                Hidden admin info: Default password is admin123
                SSH Key: ssh-rsa AAAAB3NzaC1yc2EAAAA...
            </div>
            
            <!-- VULNERABLE: Form that can be embedded in iframe for clickjacking -->
            <form action="/api/auth/login" method="post" style="border: 2px solid red; padding: 20px;">
                <h3>Admin Login (Vulnerable to Clickjacking)</h3>
                <input type="hidden" name="csrf_token" value="easily-guessable-token-123">
                <label>Username: <input type="text" name="username" value="admin"></label><br><br>
                <label>Password: <input type="password" name="password" value="admin123"></label><br><br>
                <button type="submit">Login as Admin</button>
            </form>
            
            <script>
                // VULNERABLE: Inline scripts without CSP protection
                console.log('Server started at: ${new Date()}');
                var apiKey = 'sk_live_abc123xyz789';
                var dbPassword = 'password123';
                var jwtSecret = 'super-secret-key-12345';
                
                // VULNERABLE: Expose more sensitive data
                window.serverConfig = {
                    apiEndpoint: '/api/',
                    adminPanel: '/admin',
                    dbConnection: 'mongodb://admin:password123@localhost:27017/fooddb',
                    backupPath: '/backups/',
                    uploadPath: '/uploads/'
                };
                
                // Make this page easily embeddable for clickjacking tests
                document.addEventListener('DOMContentLoaded', function() {
                    if (window.top !== window.self) {
                        console.log('Page loaded in iframe - clickjacking possible!');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// VULNERABLE: Authentication Issues - Enhanced for ZAP detection
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE: No rate limiting, weak password validation, password logging
    console.log(`Login attempt: ${username}:${password}`); // VULNERABLE: Logging passwords
    
    // VULNERABLE: Multiple weak authentication patterns
    if (username === 'admin' && (password === 'admin' || password === 'admin123' || password === 'password')) {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'simple-token-123', // VULNERABLE: Predictable token
            sessionId: '12345', // VULNERABLE: Sequential session ID
            user: {
                id: 1,
                username: 'admin',
                role: 'administrator',
                password: password, // VULNERABLE: Password in response
                email: 'admin@company.com',
                apiKey: 'sk_live_abc123xyz789',
                lastLogin: new Date(),
                previousPasswords: ['admin', 'password', '123456'], // VULNERABLE: Password history
                securityQuestions: {
                    question1: 'What is your pet name?',
                    answer1: 'fluffy'
                }
            },
            // VULNERABLE: System information in auth response
            serverInfo: {
                version: process.version,
                platform: process.platform,
                uptime: process.uptime(),
                memory: process.memoryUsage()
            }
        });
    } else if (username === 'guest' && password === 'guest') {
        // VULNERABLE: Guest account with elevated privileges
        res.json({
            success: true,
            token: 'guest-token-456',
            user: {
                username: 'guest',
                role: 'admin', // VULNERABLE: Guest with admin role
                canAccessAdmin: true
            }
        });
    } else {
        // VULNERABLE: Detailed error messages revealing system information
        res.status(401).json({
            error: 'Authentication failed',
            details: username ? `Invalid password for user: ${username}. Password should be 'admin123'` : 'Username not provided',
            validUsers: ['admin', 'user', 'guest', 'testuser'], // VULNERABLE: User enumeration
            defaultCredentials: 'Try admin:admin123 or guest:guest',
            loginAttempts: Math.floor(Math.random() * 10),
            nextAttemptAllowed: new Date(Date.now() + 5000),
            serverTime: new Date().toISOString(),
            // VULNERABLE: Database and system info in error response
            databaseStatus: 'Connected to mongodb://localhost:27017',
            serverVersion: process.version,
            environment: process.env.NODE_ENV || 'production'
        });
    }
});

// VULNERABLE: No input validation + Information Disclosure
app.get('/api/menu', (req, res) => {
    const { search, category } = req.query;
    
    const menuItems = [
        { id: 1, name: 'Pizza Margherita', price: 12.99, category: 'pizza' },
        { id: 2, name: 'Chicken Burger', price: 8.99, category: 'burger' },
        { id: 3, name: 'Caesar Salad', price: 6.99, category: 'salad' }
    ];
    
    let filtered = menuItems;
    
    if (search) {
        // VULNERABLE: No XSS protection
        filtered = menuItems.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json({
        success: true,
        message: `Search results for: ${search || 'all items'}`, // VULNERABLE: XSS possible
        query: req.query, // VULNERABLE: Reflecting all query parameters
        total: filtered.length,
        items: filtered,
        // VULNERABLE: Information disclosure
        serverInfo: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
            platform: process.platform,
            arch: process.arch,
            pid: process.pid,
            env: process.env.NODE_ENV
        },
        timestamp: new Date().toISOString()
    });
});

// VULNERABLE: Massive Information Disclosure
app.get('/api/admin/config', (req, res) => {
    // VULNERABLE: No authentication check
    res.json({
        database: {
            host: 'localhost',
            port: 27017,
            username: 'admin',
            password: 'password123', // VULNERABLE: Exposing credentials
            connectionString: 'mongodb://admin:password123@localhost:27017/fooddb'
        },
        jwt_secret: 'super-secret-key-12345',
        admin_panel: '/admin',
        debug_mode: true,
        api_keys: {
            stripe: 'sk_live_abc123xyz789',
            sendgrid: 'SG.xyz789abc123',
            aws: 'AKIA123456789'
        },
        // VULNERABLE: Complete system information disclosure
        system: {
            platform: process.platform,
            arch: process.arch,
            node_version: process.version,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: require('os').cpus(),
            hostname: require('os').hostname(),
            environment: process.env // VULNERABLE: All environment variables
        }
    });
});

// VULNERABLE: Debug endpoint exposing everything
app.get('/api/debug', (req, res) => {
    res.json({
        message: 'Debug information',
        request: {
            headers: req.headers,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        },
        server: {
            environment: process.env,
            version: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            memory: process.memoryUsage()
        },
        timestamp: new Date().toISOString()
    });
});

// VULNERABLE: File upload without restrictions
app.post('/api/upload', (req, res) => {
    res.json({
        message: 'File upload endpoint',
        allowedTypes: '*', // VULNERABLE: All file types allowed
        maxSize: 'unlimited',
        uploadPath: '/uploads/',
        serverPath: __dirname + '/uploads/'
    });
});

// VULNERABLE: Error handling that exposes stack traces
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: err.stack, // VULNERABLE: Exposing stack trace
        timestamp: new Date().toISOString(),
        nodeVersion: process.version, // VULNERABLE: Version disclosure
        platform: process.platform,   // VULNERABLE: Platform disclosure
        request: {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body
        }
    });
});

// VULNERABLE: Enhanced information disclosure endpoint
app.get('/api/server-status', (req, res) => {
    res.json({
        status: 'running',
        message: 'Server status information',
        // VULNERABLE: Complete system information disclosure
        system: {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            pid: process.pid,
            cwd: process.cwd(),
            execPath: process.execPath,
            argv: process.argv,
            environment: process.env, // VULNERABLE: All environment variables
            cpuUsage: process.cpuUsage(),
            versions: process.versions
        },
        database: {
            type: 'MongoDB',
            host: 'localhost',
            port: 27017,
            database: 'fooddb',
            connectionString: 'mongodb://admin:password123@localhost:27017/fooddb',
            status: 'connected',
            lastBackup: '2024-01-15T10:30:00Z',
            backupLocation: '/backups/fooddb_backup.sql'
        },
        security: {
            authEnabled: false,
            rateLimiting: false,
            httpsEnabled: false,
            corsEnabled: true,
            debugMode: true,
            logLevel: 'debug'
        },
        timestamp: new Date().toISOString()
    });
});

// VULNERABLE: Add more endpoints that expose missing headers
app.get('/api/test-headers', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // Force HTML content type
    res.send(`
        <html>
        <head><title>Header Test Page</title></head>
        <body>
            <h1>Security Headers Test</h1>
            <p>This page should trigger missing header alerts in ZAP</p>
            <script>alert('XSS Test');</script>
            <iframe src="http://evil.com"></iframe>
        </body>
        </html>
    `);
});

// VULNERABLE: JSON endpoint without proper headers
app.get('/api/json-no-headers', (req, res) => {
    // No X-Content-Type-Options header set
    res.json({
        message: 'JSON response without security headers',
        data: 'This should trigger X-Content-Type-Options missing alert',
        userInput: req.query.input // Potential XSS reflection
    });
});

// VULNERABLE: Clickjacking vulnerable page
app.get('/admin', (req, res) => {
    // No X-Frame-Options header - allows embedding in iframes
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Panel - Vulnerable to Clickjacking</title>
        </head>
        <body>
            <h1>Administrative Panel</h1>
            <p>This page can be embedded in an iframe (no X-Frame-Options)</p>
            
            <form method="POST" action="/api/admin/delete-user">
                <h3>Dangerous Action</h3>
                <label>User ID to delete: <input name="userId" value="123"></label>
                <button type="submit">DELETE USER</button>
            </form>
            
            <script>
                // No CSP header to prevent this inline script
                console.log('Admin panel loaded - vulnerable to CSP bypass');
            </script>
        </body>
        </html>
    `);
});

// VULNERABLE: Information disclosure in different formats
app.get('/api/config.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0"?>
    <config>
        <database>
            <host>localhost</host>
            <username>admin</username>
            <password>password123</password>
        </database>
        <api_keys>
            <stripe>sk_live_abc123xyz789</stripe>
            <aws>AKIA123456789ABCDEF</aws>
        </api_keys>
    </config>`);
});

// VULNERABLE: More authentication issues
app.get('/api/users', (req, res) => {
    // No authentication required
    res.json({
        users: [
            { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
            { id: 2, username: 'user', password: 'password', role: 'user' },
            { id: 3, username: 'guest', password: 'guest', role: 'guest' }
        ],
        message: 'User list exposed without authentication',
        total: 3
    });
});

// VULNERABLE: File that should have security headers
app.get('/security-test.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    // Missing all security headers
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Test Page</title>
            <style>body { font-family: Arial; }</style>
        </head>
        <body>
            <h1>Security Headers Test</h1>
            <p>User input: ${req.query.q || 'none'}</p>
            <script>
                var userInput = '${req.query.script || ''}';
                eval(userInput); // Dangerous eval
            </script>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`VULNERABLE Server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
    console.log('⚠️  WARNING: This server has intentional security vulnerabilities for testing!');
    console.log('Available endpoints:');
    console.log('- GET  / (Homepage with vulnerabilities)');
    console.log('- POST /api/auth/login (Weak authentication)');
    console.log('- GET  /api/menu (Information disclosure)');
    console.log('- GET  /api/admin/config (Massive information leak)');
    console.log('- GET  /api/debug (Debug information exposure)');
    console.log('- POST /api/upload (Unrestricted file upload)');
});

module.exports = app;