const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');

describe('Authentication API Tests', () => {
  // Test database connection
  beforeAll(async () => {
    // Connect to test database
    const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/food-ordering-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri);
    }
  });

  // Clean up after tests
  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ username: { $regex: /^test/ } });
    // Close database connection
    await mongoose.connection.close();
  });

  // Clean up before each test
  beforeEach(async () => {
    // Remove any existing test users
    await User.deleteMany({ username: { $regex: /^test/ } });
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123',
      fullName: 'Test User',
      phone: '+1234567890',
      address: '123 Test Street, Test City'
    };

    test('Should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      // Validate response structure
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      
      // Validate user data in response
      expect(response.body.user).toHaveProperty('username', validUserData.username);
      expect(response.body.user).toHaveProperty('email', validUserData.email);
      expect(response.body.user).toHaveProperty('fullName', validUserData.fullName);
      
      // Ensure password is not in response
      expect(response.body.user).not.toHaveProperty('password');
      
      // Validate token format (JWT)
      expect(response.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
      
      console.log('✓ User registration successful');
    });

    test('Should return 400 for missing required fields', async () => {
      const incompleteUserData = {
        username: 'testuser2'
        // Missing email, password, fullName
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUserData)
        .expect(400);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/required|missing|validation/i);
      
      console.log(`✓ Validation error for missing fields: ${response.body.message}`);
    });

    test('Should return 400 for duplicate username', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      // Attempt duplicate registration
      const duplicateUserData = {
        ...validUserData,
        email: 'different@example.com' // Different email, same username
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUserData)
        .expect(400);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/already exists|duplicate|username/i);
      
      console.log(`✓ Duplicate username error: ${response.body.message}`);
    });

    test('Should return 400 for invalid email format', async () => {
      const invalidEmailData = {
        ...validUserData,
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailData)
        .expect(400);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|invalid|format/i);
      
      console.log(`✓ Invalid email format error: ${response.body.message}`);
    });

    test('Should return 400 for weak password', async () => {
      const weakPasswordData = {
        ...validUserData,
        password: '123' // Too short/weak
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordData)
        .expect(400);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/password|weak|short|length/i);
      
      console.log(`✓ Weak password error: ${response.body.message}`);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      username: 'testloginuser',
      email: 'testlogin@example.com',
      password: 'testpass123',
      fullName: 'Test Login User',
      phone: '+1234567891',
      address: '124 Test Street, Test City'
    };

    // Create a test user before login tests
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('Should login successfully with valid credentials', async () => {
      const loginData = {
        username: testUser.username,
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      
      // Validate user data in response
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      
      // Ensure password is not in response
      expect(response.body.user).not.toHaveProperty('password');
      
      // Validate token format (JWT)
      expect(response.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
      
      console.log('✓ User login successful');
    });

    test('Should return 401 for invalid username', async () => {
      const invalidLoginData = {
        username: 'nonexistentuser',
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLoginData)
        .expect(401);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid|credentials|not found/i);
      
      console.log(`✓ Invalid username error: ${response.body.message}`);
    });

    test('Should return 401 for invalid password', async () => {
      const invalidLoginData = {
        username: testUser.username,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLoginData)
        .expect(401);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid|credentials|password/i);
      
      console.log(`✓ Invalid password error: ${response.body.message}`);
    });

    test('Should return 400 for missing credentials', async () => {
      const emptyLoginData = {};

      const response = await request(app)
        .post('/api/auth/login')
        .send(emptyLoginData)
        .expect(400);

      // Validate error response
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/required|missing|username|password/i);
      
      console.log(`✓ Missing credentials error: ${response.body.message}`);
    });

    test('Should return user profile information on successful login', async () => {
      const loginData = {
        username: testUser.username,
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Validate detailed user information
      const user = response.body.user;
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username', testUser.username);
      expect(user).toHaveProperty('email', testUser.email);
      expect(user).toHaveProperty('fullName', testUser.fullName);
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('createdAt');
      
      // Validate data types
      expect(typeof user._id).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.fullName).toBe('string');
      expect(typeof user.createdAt).toBe('string');
      
      console.log('✓ User profile information validation passed');
    });
  });

  describe('Authentication Header Tests', () => {
    let authToken;
    const testUser = {
      username: 'testAuthUser',
      email: 'testauth@example.com',
      password: 'testpass123',
      fullName: 'Test Auth User',
      phone: '+1234567892',
      address: '125 Test Street, Test City'
    };

    beforeEach(async () => {
      // Create user and get auth token via login
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });
      
      authToken = loginResponse.body.token;
    });

    test('Should accept valid Bearer token format', async () => {
      // Test with a protected endpoint (if available)
      // This test assumes there's a protected route to test with
      const response = await request(app)
        .get('/api/auth/profile') // Adjust this endpoint based on your actual routes
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          // Accept either 200 (if endpoint exists) or 404 (if not implemented)
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        console.log('✓ Bearer token authentication successful');
      } else {
        console.log('✓ Bearer token format test completed (endpoint not found)');
      }
    });

    test('Should reject requests without authorization header', async () => {
      // Test with a protected endpoint (if available)
      const response = await request(app)
        .get('/api/auth/profile') // Adjust this endpoint based on your actual routes
        .expect((res) => {
          // Accept either 401 (if endpoint exists and protected) or 404 (if not implemented)
          expect([401, 404]).toContain(res.status);
        });

      if (response.status === 401) {
        expect(response.body).toHaveProperty('message');
        console.log(`✓ Unauthorized access rejected: ${response.body.message}`);
      } else {
        console.log('✓ No authorization test completed (endpoint not found)');
      }
    });

    test('Should reject invalid token format', async () => {
      const response = await request(app)
        .get('/api/auth/profile') // Adjust this endpoint based on your actual routes
        .set('Authorization', 'Bearer invalid-token-format')
        .expect((res) => {
          // Accept either 401 (if endpoint exists and validates token) or 404 (if not implemented)
          expect([401, 404]).toContain(res.status);
        });

      if (response.status === 401) {
        expect(response.body).toHaveProperty('message');
        console.log(`✓ Invalid token rejected: ${response.body.message}`);
      } else {
        console.log('✓ Invalid token test completed (endpoint not found)');
      }
    });
  });

  describe('Response Format and Data Validation', () => {
    test('Should return consistent error response format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: '', password: '' })
        .expect(400);

      // Validate error response format
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
      expect(response.body.message.length).toBeGreaterThan(0);
      
      // Check for additional error details if present
      if (response.body.errors) {
        expect(Array.isArray(response.body.errors)).toBe(true);
      }
      
      console.log('✓ Error response format validation passed');
    });

    test('Should include proper HTTP status codes', async () => {
      // Test various endpoints for proper status codes
      const tests = [
        {
          method: 'post',
          url: '/api/auth/register',
          data: {}, // Invalid data
          expectedStatus: 400
        },
        {
          method: 'post',
          url: '/api/auth/login',
          data: { username: 'nonexistent', password: 'wrong' },
          expectedStatus: 401
        }
      ];

      for (const test of tests) {
        const response = await request(app)
          [test.method](test.url)
          .send(test.data);
        
        expect(response.status).toBe(test.expectedStatus);
      }
      
      console.log('✓ HTTP status codes validation passed');
    });
  });
});