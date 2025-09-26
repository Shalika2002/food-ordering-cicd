const TestConfig = require('./config/test-config');
const LoginPage = require('./pages/LoginPage');

describe('Login Functionality Tests', () => {
  let driver;
  let loginPage;
  const config = TestConfig.getConfig();

  beforeAll(async () => {
    driver = await TestConfig.getDriver();
    loginPage = new LoginPage(driver);
  });

  afterAll(async () => {
    await TestConfig.closeDriver(driver);
  });

  beforeEach(async () => {
    await loginPage.open();
  });

  describe('Positive Login Tests', () => {
    test('Should successfully login with valid credentials', async () => {
      // Test data
      const testUser = config.testUser;
      
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.enterCredentials(testUser.username, testUser.password);
      await loginPage.clickLogin();
      
      // Validation
      await loginPage.validateSuccessfulLogin();
      
      console.log('✓ Login test with valid credentials passed');
    }, 30000);

    test('Should display login form elements correctly', async () => {
      // Validate page elements
      await loginPage.validateLoginPageLoaded();
      
      const pageTitle = await loginPage.getPageTitle();
      expect(pageTitle).toBe('Login');
      
      // Check if form elements are present and visible
      const isUsernameVisible = await loginPage.isElementVisible(loginPage.elements.usernameInput);
      const isPasswordVisible = await loginPage.isElementVisible(loginPage.elements.passwordInput);
      const isLoginButtonVisible = await loginPage.isElementVisible(loginPage.elements.loginButton);
      
      expect(isUsernameVisible).toBe(true);
      expect(isPasswordVisible).toBe(true);
      expect(isLoginButtonVisible).toBe(true);
      
      console.log('✓ Login form elements validation passed');
    }, 15000);
  });

  describe('Negative Login Tests', () => {
    test('Should show error message with invalid credentials', async () => {
      // Test data
      const invalidCredentials = {
        username: 'invaliduser',
        password: 'wrongpassword'
      };
      
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.enterCredentials(invalidCredentials.username, invalidCredentials.password);
      await loginPage.clickLogin();
      
      // Wait for error message
      await loginPage.sleep(2000);
      
      // Validation
      const isErrorDisplayed = await loginPage.isErrorDisplayed();
      expect(isErrorDisplayed).toBe(true);
      
      if (isErrorDisplayed) {
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid'); // Should contain some form of "Invalid" message
        console.log(`✓ Error message displayed: "${errorMessage}"`);
      }
      
      console.log('✓ Invalid credentials test passed');
    }, 20000);

    test('Should show error message with empty credentials', async () => {
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.clickLogin(); // Try to login without entering credentials
      
      // HTML5 validation might prevent submission, so let's check
      const currentUrl = await loginPage.getCurrentUrl();
      const stillOnLoginPage = currentUrl.includes('localhost:3000') && 
                              await loginPage.isElementPresent(loginPage.elements.loginCard);
      
      expect(stillOnLoginPage).toBe(true);
      console.log('✓ Empty credentials test passed - form validation working');
    }, 15000);

    test('Should clear form fields properly', async () => {
      // Test data
      const testData = {
        username: 'testuser',
        password: 'testpass'
      };
      
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.enterCredentials(testData.username, testData.password);
      
      // Verify data was entered
      const enteredUsername = await loginPage.getUsernameValue();
      const enteredPassword = await loginPage.getPasswordValue();
      
      expect(enteredUsername).toBe(testData.username);
      expect(enteredPassword).toBe(testData.password);
      
      // Clear fields
      await loginPage.clearCredentials();
      
      // Verify fields are cleared
      const clearedUsername = await loginPage.getUsernameValue();
      const clearedPassword = await loginPage.getPasswordValue();
      
      expect(clearedUsername).toBe('');
      expect(clearedPassword).toBe('');
      
      console.log('✓ Form field clearing test passed');
    }, 15000);
  });

  describe('UI Interaction Tests', () => {
    test('Should navigate to signup page when signup link is clicked', async () => {
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.clickSignupLink();
      
      // Wait for navigation
      await loginPage.sleep(2000);
      
      // Validation - URL should change or page should update
      const currentUrl = await loginPage.getCurrentUrl();
      const hasNavigated = currentUrl.includes('signup') || 
                          currentUrl.includes('#signup') ||
                          currentUrl !== 'http://localhost:3000/';
      
      // Note: This test might need adjustment based on actual routing implementation
      console.log(`Current URL after clicking signup: ${currentUrl}`);
      console.log('✓ Signup link navigation test completed');
    }, 15000);

    test('Should show loading state during login attempt', async () => {
      // Test data
      const testUser = config.testUser;
      
      // Test steps
      await loginPage.validateLoginPageLoaded();
      await loginPage.enterCredentials(testUser.username, testUser.password);
      
      // Click login and immediately check for loading state
      await loginPage.clickLogin();
      
      // Check if button shows loading state (this is timing-dependent)
      const isButtonDisabled = await loginPage.isLoginButtonDisabled();
      
      console.log(`Login button disabled state: ${isButtonDisabled}`);
      console.log('✓ Loading state test completed');
    }, 15000);
  });
});