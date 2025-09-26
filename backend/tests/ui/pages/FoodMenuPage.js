const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class FoodMenuPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Page elements
    this.elements = {
      // Header elements
      pageTitle: By.css('h2'),
      cartButton: By.css('button:contains("Cart"), button[class*="cart"]'),
      cartBadge: By.css('.badge'),
      
      // Food items
      foodCards: By.css('.card'),
      foodName: By.css('.card-title'),
      foodDescription: By.css('.card-text'),
      foodPrice: By.css('.text-success'),
      foodImage: By.css('.card-img-top'),
      addToCartButton: By.css('button:contains("Add to Cart")'),
      availableBadge: By.css('.badge.bg-success'),
      soldOutBadge: By.css('.badge.bg-danger'),
      
      // Categories
      categoryHeaders: By.css('h4.text-primary'),
      
      // Cart sidebar
      cartSidebar: By.css('.col-md-4'),
      cartHeader: By.css('.card-header h5'),
      cartItems: By.css('.cart-item, .mb-3'),
      cartItemName: By.css('h6'),
      cartItemPrice: By.css('.text-muted'),
      increaseButton: By.css('button:contains("+")'),
      decreaseButton: By.css('button:contains("-")'),
      quantityDisplay: By.css('.mx-2'),
      totalPrice: By.css('strong:contains("Total")'),
      placeOrderButton: By.css('button:contains("Place Order")'),
      emptyCartMessage: By.css('.text-muted'),
      
      // Alerts and messages
      errorAlert: By.css('.alert-danger'),
      successAlert: By.css('.alert-success'),
      loadingButton: By.css('button[disabled]')
    };
  }

  async open() {
    await this.navigateTo('http://localhost:3000');
    
    // Wait for food menu to load
    await this.waitForElementVisible(this.elements.pageTitle);
  }

  async getPageTitle() {
    return await this.getText(this.elements.pageTitle);
  }

  async getAllFoodItems() {
    return await this.findElements(this.elements.foodCards);
  }

  async getFoodItemByName(foodName) {
    const foodCards = await this.getAllFoodItems();
    
    for (let card of foodCards) {
      try {
        const nameElement = await card.findElement(this.elements.foodName);
        const name = await nameElement.getText();
        
        if (name.toLowerCase().includes(foodName.toLowerCase())) {
          return card;
        }
      } catch (error) {
        // Continue to next card if this one doesn't have the expected structure
        continue;
      }
    }
    
    throw new Error(`Food item '${foodName}' not found`);
  }

  async addFoodToCart(foodName) {
    const foodCard = await this.getFoodItemByName(foodName);
    const addButton = await foodCard.findElement(this.elements.addToCartButton);
    
    // Check if item is available
    const isDisabled = await addButton.getAttribute('disabled');
    if (isDisabled) {
      throw new Error(`Food item '${foodName}' is sold out and cannot be added to cart`);
    }
    
    await addButton.click();
  }

  async clickCartButton() {
    await this.clickElement(this.elements.cartButton);
  }

  async isCartVisible() {
    return await this.isElementVisible(this.elements.cartSidebar);
  }

  async getCartItemCount() {
    try {
      const badge = await this.findElement(this.elements.cartBadge);
      const count = await badge.getText();
      return parseInt(count);
    } catch (error) {
      return 0;
    }
  }

  async getCartItems() {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    return await this.findElements(this.elements.cartItems);
  }

  async getCartTotal() {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    try {
      const totalElement = await this.findElement(this.elements.totalPrice);
      const totalText = await totalElement.getText();
      
      // Extract price from text like "Total: $25.50"
      const match = totalText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  async increaseItemQuantity(itemName) {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    const cartItems = await this.getCartItems();
    
    for (let item of cartItems) {
      try {
        const nameElement = await item.findElement(this.elements.cartItemName);
        const name = await nameElement.getText();
        
        if (name.toLowerCase().includes(itemName.toLowerCase())) {
          const increaseBtn = await item.findElement(this.elements.increaseButton);
          await increaseBtn.click();
          return;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`Cart item '${itemName}' not found`);
  }

  async decreaseItemQuantity(itemName) {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    const cartItems = await this.getCartItems();
    
    for (let item of cartItems) {
      try {
        const nameElement = await item.findElement(this.elements.cartItemName);
        const name = await nameElement.getText();
        
        if (name.toLowerCase().includes(itemName.toLowerCase())) {
          const decreaseBtn = await item.findElement(this.elements.decreaseButton);
          await decreaseBtn.click();
          return;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`Cart item '${itemName}' not found`);
  }

  async getItemQuantity(itemName) {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    const cartItems = await this.getCartItems();
    
    for (let item of cartItems) {
      try {
        const nameElement = await item.findElement(this.elements.cartItemName);
        const name = await nameElement.getText();
        
        if (name.toLowerCase().includes(itemName.toLowerCase())) {
          const quantityElement = await item.findElement(this.elements.quantityDisplay);
          const quantity = await quantityElement.getText();
          return parseInt(quantity);
        }
      } catch (error) {
        continue;
      }
    }
    
    return 0;
  }

  async placeOrder() {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    await this.clickElement(this.elements.placeOrderButton);
  }

  async isCartEmpty() {
    if (!await this.isCartVisible()) {
      await this.clickCartButton();
    }
    
    return await this.isElementVisible(this.elements.emptyCartMessage);
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

  async getFoodCategories() {
    const categoryElements = await this.findElements(this.elements.categoryHeaders);
    const categories = [];
    
    for (let element of categoryElements) {
      const category = await element.getText();
      categories.push(category);
    }
    
    return categories;
  }

  async getFoodItemPrice(foodName) {
    const foodCard = await this.getFoodItemByName(foodName);
    const priceElement = await foodCard.findElement(this.elements.foodPrice);
    const priceText = await priceElement.getText();
    
    // Extract price from text like "$12.99"
    const match = priceText.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async isFoodItemAvailable(foodName) {
    const foodCard = await this.getFoodItemByName(foodName);
    
    try {
      await foodCard.findElement(this.elements.availableBadge);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Validation methods
  async validateFoodMenuLoaded() {
    const title = await this.getPageTitle();
    if (!title.includes('Food Menu')) {
      throw new Error(`Expected page title to contain 'Food Menu', but got '${title}'`);
    }
    
    const foodItems = await this.getAllFoodItems();
    if (foodItems.length === 0) {
      throw new Error('No food items found on the menu');
    }
    
    return true;
  }

  async validateItemAddedToCart(itemName, expectedQuantity = 1) {
    const cartCount = await this.getCartItemCount();
    if (cartCount === 0) {
      throw new Error('Cart appears to be empty after adding item');
    }
    
    const itemQuantity = await this.getItemQuantity(itemName);
    if (itemQuantity !== expectedQuantity) {
      throw new Error(`Expected quantity ${expectedQuantity} for '${itemName}', but got ${itemQuantity}`);
    }
    
    return true;
  }

  async validateOrderPlaced() {
    await this.sleep(2000); // Wait for order processing
    
    // Check if cart is empty or if there's a success message
    const isEmpty = await this.isCartEmpty();
    if (!isEmpty) {
      // Look for success message or alert
      const currentUrl = await this.getCurrentUrl();
      if (!currentUrl.includes('success') && !currentUrl.includes('order')) {
        throw new Error('Order does not appear to have been placed successfully');
      }
    }
    
    return true;
  }
}

module.exports = FoodMenuPage;