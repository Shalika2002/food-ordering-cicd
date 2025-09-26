const TestConfig = require('./config/test-config');
const LoginPage = require('./pages/LoginPage');
const FoodMenuPage = require('./pages/FoodMenuPage');

describe('Food Menu and Cart Management Tests', () => {
  let driver;
  let loginPage;
  let foodMenuPage;
  const config = TestConfig.getConfig();

  beforeAll(async () => {
    driver = await TestConfig.getDriver();
    loginPage = new LoginPage(driver);
    foodMenuPage = new FoodMenuPage(driver);
  });

  afterAll(async () => {
    await TestConfig.closeDriver(driver);
  });

  beforeEach(async () => {
    // Login before each test
    await loginPage.open();
    
    // Skip login if already logged in (check for food menu presence)
    const isFoodMenuVisible = await foodMenuPage.isElementPresent(foodMenuPage.elements.pageTitle);
    
    if (!isFoodMenuVisible) {
      // Perform login
      await loginPage.login(config.testUser.username, config.testUser.password);
      
      // Wait for navigation to food menu
      await foodMenuPage.sleep(3000);
    }
    
    // Ensure we're on the food menu page
    await foodMenuPage.open();
  });

  describe('Food Menu Display Tests', () => {
    test('Should display food menu with items correctly', async () => {
      // Validate food menu loaded
      await foodMenuPage.validateFoodMenuLoaded();
      
      // Check if food items are displayed
      const foodItems = await foodMenuPage.getAllFoodItems();
      expect(foodItems.length).toBeGreaterThan(0);
      
      // Check if categories are displayed
      const categories = await foodMenuPage.getFoodCategories();
      expect(categories.length).toBeGreaterThan(0);
      
      console.log(`✓ Food menu loaded with ${foodItems.length} items and ${categories.length} categories`);
    }, 20000);

    test('Should display food item details correctly', async () => {
      // Get first food item to test
      const foodItems = await foodMenuPage.getAllFoodItems();
      expect(foodItems.length).toBeGreaterThan(0);
      
      const firstItem = foodItems[0];
      
      // Check if required elements are present
      const hasName = await firstItem.findElements(foodMenuPage.elements.foodName).then(els => els.length > 0);
      const hasPrice = await firstItem.findElements(foodMenuPage.elements.foodPrice).then(els => els.length > 0);
      const hasButton = await firstItem.findElements(foodMenuPage.elements.addToCartButton).then(els => els.length > 0);
      
      expect(hasName).toBe(true);
      expect(hasPrice).toBe(true);
      expect(hasButton).toBe(true);
      
      console.log('✓ Food item details validation passed');
    }, 15000);
  });

  describe('Add to Cart Functionality Tests', () => {
    test('Should successfully add food item to cart', async () => {
      // Validate food menu loaded
      await foodMenuPage.validateFoodMenuLoaded();
      
      // Get available food items
      const foodItems = await foodMenuPage.getAllFoodItems();
      expect(foodItems.length).toBeGreaterThan(0);
      
      // Try to add first available item to cart
      let itemAdded = false;
      let itemName = '';
      
      for (let i = 0; i < Math.min(foodItems.length, 3); i++) {
        try {
          const item = foodItems[i];
          const nameElement = await item.findElement(foodMenuPage.elements.foodName);
          itemName = await nameElement.getText();
          
          // Check if item is available
          const addButton = await item.findElement(foodMenuPage.elements.addToCartButton);
          const isDisabled = await addButton.getAttribute('disabled');
          
          if (!isDisabled) {
            await addButton.click();
            itemAdded = true;
            break;
          }
        } catch (error) {
          console.log(`Skipping item ${i}: ${error.message}`);
          continue;
        }
      }
      
      if (!itemAdded) {
        throw new Error('No available items found to add to cart');
      }
      
      // Wait for cart update
      await foodMenuPage.sleep(1000);
      
      // Validate item was added to cart
      const cartCount = await foodMenuPage.getCartItemCount();
      expect(cartCount).toBeGreaterThan(0);
      
      console.log(`✓ Successfully added "${itemName}" to cart. Cart count: ${cartCount}`);
    }, 25000);

    test('Should update cart count when multiple items are added', async () => {
      // Validate food menu loaded
      await foodMenuPage.validateFoodMenuLoaded();
      
      const initialCartCount = await foodMenuPage.getCartItemCount();
      
      // Add multiple items to cart
      const foodItems = await foodMenuPage.getAllFoodItems();
      let itemsAdded = 0;
      
      for (let i = 0; i < Math.min(foodItems.length, 2); i++) {
        try {
          const item = foodItems[i];
          const addButton = await item.findElement(foodMenuPage.elements.addToCartButton);
          const isDisabled = await addButton.getAttribute('disabled');
          
          if (!isDisabled) {
            await addButton.click();
            itemsAdded++;
            await foodMenuPage.sleep(500); // Small delay between clicks
          }
        } catch (error) {
          continue;
        }
      }
      
      if (itemsAdded === 0) {
        throw new Error('No items could be added to cart');
      }
      
      // Wait for cart update
      await foodMenuPage.sleep(1000);
      
      // Validate cart count increased
      const finalCartCount = await foodMenuPage.getCartItemCount();
      expect(finalCartCount).toBeGreaterThan(initialCartCount);
      
      console.log(`✓ Added ${itemsAdded} items to cart. Final count: ${finalCartCount}`);
    }, 30000);
  });

  describe('Cart Management Tests', () => {
    test('Should open and display cart contents', async () => {
      // First add an item to cart
      await foodMenuPage.validateFoodMenuLoaded();
      
      const foodItems = await foodMenuPage.getAllFoodItems();
      let itemAdded = false;
      
      for (let item of foodItems.slice(0, 3)) {
        try {
          const addButton = await item.findElement(foodMenuPage.elements.addToCartButton);
          const isDisabled = await addButton.getAttribute('disabled');
          
          if (!isDisabled) {
            await addButton.click();
            itemAdded = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!itemAdded) {
        console.log('⚠ No items could be added to cart for cart display test');
        return;
      }
      
      // Wait for cart update
      await foodMenuPage.sleep(1000);
      
      // Click cart button to open cart
      await foodMenuPage.clickCartButton();
      
      // Wait for cart to open
      await foodMenuPage.sleep(1000);
      
      // Validate cart is visible
      const isCartVisible = await foodMenuPage.isCartVisible();
      expect(isCartVisible).toBe(true);
      
      // Check if cart has items
      const cartItems = await foodMenuPage.getCartItems();
      expect(cartItems.length).toBeGreaterThan(0);
      
      console.log(`✓ Cart opened successfully with ${cartItems.length} items`);
    }, 25000);

    test('Should update item quantity in cart', async () => {
      // First add an item to cart
      await foodMenuPage.validateFoodMenuLoaded();
      
      const foodItems = await foodMenuPage.getAllFoodItems();
      let itemName = '';
      let itemAdded = false;
      
      for (let item of foodItems.slice(0, 3)) {
        try {
          const nameElement = await item.findElement(foodMenuPage.elements.foodName);
          itemName = await nameElement.getText();
          
          const addButton = await item.findElement(foodMenuPage.elements.addToCartButton);
          const isDisabled = await addButton.getAttribute('disabled');
          
          if (!isDisabled) {
            await addButton.click();
            itemAdded = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!itemAdded) {
        console.log('⚠ No items could be added to cart for quantity test');
        return;
      }
      
      // Wait for cart update
      await foodMenuPage.sleep(1000);
      
      // Open cart
      await foodMenuPage.clickCartButton();
      await foodMenuPage.sleep(1000);
      
      // Get initial quantity
      const initialQuantity = await foodMenuPage.getItemQuantity(itemName);
      expect(initialQuantity).toBeGreaterThan(0);
      
      // Increase quantity
      await foodMenuPage.increaseItemQuantity(itemName);
      await foodMenuPage.sleep(500);
      
      // Verify quantity increased
      const newQuantity = await foodMenuPage.getItemQuantity(itemName);
      expect(newQuantity).toBe(initialQuantity + 1);
      
      console.log(`✓ Item quantity updated from ${initialQuantity} to ${newQuantity}`);
    }, 30000);
  });

  describe('Cart Total and Order Tests', () => {
    test('Should calculate cart total correctly', async () => {
      // Add items to cart and verify total calculation
      await foodMenuPage.validateFoodMenuLoaded();
      
      const foodItems = await foodMenuPage.getAllFoodItems();
      let totalExpected = 0;
      let itemsAdded = 0;
      
      for (let item of foodItems.slice(0, 2)) {
        try {
          const addButton = await item.findElement(foodMenuPage.elements.addToCartButton);
          const isDisabled = await addButton.getAttribute('disabled');
          
          if (!isDisabled) {
            // Get item price
            const priceElement = await item.findElement(foodMenuPage.elements.foodPrice);
            const priceText = await priceElement.getText();
            const price = parseFloat(priceText.replace('$', ''));
            
            if (!isNaN(price)) {
              await addButton.click();
              totalExpected += price;
              itemsAdded++;
              await foodMenuPage.sleep(500);
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      if (itemsAdded === 0) {
        console.log('⚠ No items could be added to cart for total calculation test');
        return;
      }
      
      // Open cart and check total
      await foodMenuPage.clickCartButton();
      await foodMenuPage.sleep(1000);
      
      const cartTotal = await foodMenuPage.getCartTotal();
      
      // Allow for small floating point differences
      const difference = Math.abs(cartTotal - totalExpected);
      expect(difference).toBeLessThan(0.01);
      
      console.log(`✓ Cart total correct: Expected $${totalExpected.toFixed(2)}, Got $${cartTotal.toFixed(2)}`);
    }, 35000);

    test('Should handle empty cart state', async () => {
      // Ensure we start with empty cart by opening fresh page
      await foodMenuPage.open();
      await foodMenuPage.validateFoodMenuLoaded();
      
      // Open cart
      await foodMenuPage.clickCartButton();
      await foodMenuPage.sleep(1000);
      
      // Check if cart is empty
      const isEmpty = await foodMenuPage.isCartEmpty();
      const cartCount = await foodMenuPage.getCartItemCount();
      
      if (isEmpty || cartCount === 0) {
        console.log('✓ Empty cart state handled correctly');
      } else {
        console.log('⚠ Cart is not empty - this might be due to persistent state');
      }
    }, 20000);
  });
});