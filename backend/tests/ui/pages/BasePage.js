const { By, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 15000;
  }

  async navigateTo(url) {
    await this.driver.get(url);
  }

  async waitForElement(locator, timeout = this.timeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = this.timeout) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async findElement(locator) {
    return await this.driver.findElement(locator);
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async clickElement(locator) {
    const element = await this.waitForElementVisible(locator);
    await element.click();
  }

  async sendKeys(locator, text) {
    const element = await this.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.waitForElementVisible(locator);
    return await element.getText();
  }

  async getAttribute(locator, attribute) {
    const element = await this.waitForElementVisible(locator);
    return await element.getAttribute(attribute);
  }

  async isElementPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (error) {
      return false;
    }
  }

  async isElementVisible(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async waitForUrl(expectedUrl, timeout = this.timeout) {
    await this.driver.wait(async () => {
      const currentUrl = await this.driver.getCurrentUrl();
      return currentUrl.includes(expectedUrl);
    }, timeout);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async takeScreenshot() {
    return await this.driver.takeScreenshot();
  }

  async scrollToElement(locator) {
    const element = await this.waitForElement(locator);
    await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
  }

  async sleep(ms) {
    await this.driver.sleep(ms);
  }
}

module.exports = BasePage;