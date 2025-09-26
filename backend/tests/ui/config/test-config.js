const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class TestConfig {
  static async getDriver() {
    const options = new chrome.Options();
    
    // Add Chrome options for better test stability
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    
    // For headless mode (uncomment if needed)
    // options.addArguments('--headless');
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // Set implicit wait timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    return driver;
  }

  static async closeDriver(driver) {
    if (driver) {
      await driver.quit();
    }
  }

  static getConfig() {
    return {
      baseUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:5000',
      timeout: {
        implicit: 10000,
        explicit: 15000,
        pageLoad: 30000
      },
      testUser: {
        username: 'testuser',
        password: 'testpass123',
        email: 'test@example.com'
      },
      adminUser: {
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com'
      }
    };
  }
}

module.exports = TestConfig;