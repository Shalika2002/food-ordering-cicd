const { Given, When, Then } = require('@cucumber/cucumber');

// Mock the FoodService for BDD testing
const FoodService = {
  async addFood(foodData) {
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'preparationTime'];
    for (const field of requiredFields) {
      if (!foodData[field]) {
        throw new Error('Required fields are missing');
      }
    }

    // Validate price
    if (foodData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Return mock response
    return {
      _id: '507f1f77bcf86cd799439011',
      ...foodData,
      available: true,
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

let foodData = {};
let result = {};
let errorMessage = '';

// Step definitions for Food Management

Given('I have valid food details', function () {
  foodData = {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella',
    price: 12.99,
    category: 'Pizza',
    preparationTime: 15
  };
});

Given('I have incomplete food details missing {string}', function (missingField) {
  foodData = {
    name: 'Pizza',
    description: 'Test pizza',
    price: 12.99,
    category: 'Pizza',
    preparationTime: 15
  };
  
  // Remove the specified field
  delete foodData[missingField];
});

Given('I have food details with negative price', function () {
  foodData = {
    name: 'Pizza',
    description: 'Test pizza',
    price: -5.99,
    category: 'Pizza',
    preparationTime: 15
  };
});

Given('I have food details with preparation time of {int} minutes', function (prepTime) {
  foodData = {
    name: 'Gourmet Burger',
    description: 'Premium burger with special sauce',
    price: 15.99,
    category: 'Burger',
    preparationTime: prepTime
  };
});

When('I add a new food item', async function () {
  try {
    result = await FoodService.addFood(foodData);
    errorMessage = '';
  } catch (error) {
    errorMessage = error.message;
  }
});

When('I try to add a new food item', async function () {
  try {
    result = await FoodService.addFood(foodData);
    errorMessage = '';
  } catch (error) {
    errorMessage = error.message;
    result = null; // Clear result when there's an error
  }
});

Then('the food item should be saved successfully', function () {
  if (errorMessage) {
    throw new Error(`Expected success but got error: ${errorMessage}`);
  }
  if (!result || !result._id) {
    throw new Error('Expected food item to be saved with an ID');
  }
});

Then('the food item should have default availability as true', function () {
  if (!result.available) {
    throw new Error('Expected food item to have default availability as true');
  }
});

Then('I should get an error {string}', function (expectedError) {
  if (!errorMessage) {
    throw new Error('Expected an error but operation succeeded');
  }
  if (errorMessage !== expectedError) {
    throw new Error(`Expected error "${expectedError}" but got "${errorMessage}"`);
  }
});

Then('the food item should not be saved', function () {
  if (result && result._id) {
    throw new Error('Expected food item not to be saved but it was saved');
  }
  if (!errorMessage) {
    throw new Error('Expected an error to occur preventing save');
  }
});

Then('the food item should be saved with preparation time {int} minutes', function (expectedPrepTime) {
  if (!result || result.preparationTime !== expectedPrepTime) {
    throw new Error(`Expected preparation time ${expectedPrepTime} but got ${result?.preparationTime}`);
  }
});