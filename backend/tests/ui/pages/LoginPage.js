const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Page elements
    this.elements = {
      usernameInput: By.id('username'),
      passwordInput: By.id('password'),
      loginButton: By.css('button[type="submit"]'),
      errorAlert: By.css('.alert-danger'),
      successMessage: By.css('.alert-success'),
      signupLink: By.css('button.btn-link'),
      loginCard: By.css('.card'),
      cardHeader: By.css('.card-header h3'),
      loadingButton: By.css('button[disabled]')
    };
  }

  async open() {
    await this.navigateTo('http://localhost:3000');
    
    // Wait for login page to load
    await this.waitForElementVisible(this.elements.loginCard);
  }

  async enterCredentials(username, password) {
    await this.sendKeys(this.elements.usernameInput, username);
    await this.sendKeys(this.elements.passwordInput, password);
  }

  async clickLogin() {
    await this.clickElement(this.elements.loginButton);
  }

  async login(username, password) {
    await this.enterCredentials(username, password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    try {
      return await this.getText(this.elements.errorAlert);
    } catch (error) {
      return null;
    }
  }

  async isErrorDisplayed() {
    return await this.isElementVisible(this.elements.errorAlert);
  }

  async isLoginButtonDisabled() {
    return await this.isElementPresent(this.elements.loadingButton);
  }

  async clickSignupLink() {
    await this.clickElement(this.elements.signupLink);
  }

  async getPageTitle() {
    return await this.getText(this.elements.cardHeader);
  }

  async getUsernameValue() {
    return await this.getAttribute(this.elements.usernameInput, 'value');
  }

  async getPasswordValue() {
    return await this.getAttribute(this.elements.passwordInput, 'value');
  }

  async clearCredentials() {
    const usernameElement = await this.findElement(this.elements.usernameInput);
    const passwordElement = await this.findElement(this.elements.passwordInput);
    
    await usernameElement.clear();
    await passwordElement.clear();
  }

  // Validation methods
  async validateLoginPageLoaded() {
    const title = await this.getPageTitle();
    if (title !== 'Login') {
      throw new Error(`Expected page title 'Login', but got '${title}'`);
    }
    
    const isUsernameVisible = await this.isElementVisible(this.elements.usernameInput);
    const isPasswordVisible = await this.isElementVisible(this.elements.passwordInput);
    const isLoginButtonVisible = await this.isElementVisible(this.elements.loginButton);
    
    if (!isUsernameVisible || !isPasswordVisible || !isLoginButtonVisible) {
      throw new Error('Login form elements are not visible');
    }
    
    return true;
  }

  async validateSuccessfulLogin() {
    // Wait for redirect or success indication
    await this.sleep(2000);
    
    // Check if we're redirected away from login page or if there's a success message
    const currentUrl = await this.getCurrentUrl();
    const isStillOnLogin = await this.isElementPresent(this.elements.loginCard);
    
    if (isStillOnLogin && !currentUrl.includes('dashboard') && !currentUrl.includes('menu')) {
      const errorMessage = await this.getErrorMessage();
      if (errorMessage) {
        throw new Error(`Login failed with error: ${errorMessage}`);
      }
      throw new Error('Login appears to have failed - still on login page');
    }
    
    return true;
  }

  async validateLoginError(expectedError) {
    const isErrorDisplayed = await this.isErrorDisplayed();
    if (!isErrorDisplayed) {
      throw new Error('Expected error message to be displayed, but none found');
    }
    
    const actualError = await this.getErrorMessage();
    if (!actualError.includes(expectedError)) {
      throw new Error(`Expected error to contain '${expectedError}', but got '${actualError}'`);
    }
    
    return true;
  }
}

module.exports = LoginPage;