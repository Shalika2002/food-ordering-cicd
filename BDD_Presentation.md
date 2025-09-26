# BDD (Behavior-Driven Development) Presentation

## 🎯 BDD Approach Overview

**Behavior-Driven Development (BDD)** extends TDD by focusing on the behavior of the application from the user's perspective. It uses natural language constructs (Gherkin syntax) to describe software behavior.

### Key Benefits:
- **Collaboration**: Bridges communication gap between technical and non-technical stakeholders
- **Living Documentation**: Feature files serve as executable documentation
- **User-Focused**: Scenarios are written from user perspective
- **Acceptance Criteria**: Clear definition of "done"

## 📝 Example User Stories in Gherkin

### Feature 1: Food Management
```gherkin
Feature: Food Management
  As a restaurant manager
  I want to manage food items in the system
  So that customers can see available food options

  Scenario: Add a new food item successfully
    Given I have valid food details
    When I add a new food item
    Then the food item should be saved successfully
    And the food item should have default availability as true

  Scenario: Reject food item with invalid price
    Given I have food details with negative price
    When I try to add a new food item
    Then I should get an error "Price must be greater than 0"
    And the food item should not be saved
```

### Feature 2: User Registration Validation
```gherkin
Feature: User Registration Validation
  As a system administrator
  I want to validate user registration data
  So that only valid users can register in the system

  Scenario: Successful user registration validation
    Given I have complete user registration data
    When I validate the user registration
    Then the validation should pass
    And there should be no validation errors

  Scenario: Reject registration with invalid email
    Given I have user registration data with invalid email "invalid-email"
    When I validate the user registration
    Then the validation should fail
    And I should get error "Invalid email format"
```

## 💻 Step Definitions Implementation (Cucumber.js)

### Food Management Step Definitions
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');

let foodData = {};
let result = {};
let errorMessage = '';

// Given Steps - Setup test data
Given('I have valid food details', function () {
  foodData = {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella',
    price: 12.99,
    category: 'Pizza',
    preparationTime: 15
  };
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

// When Steps - Execute actions
When('I add a new food item', async function () {
  try {
    result = await FoodService.addFood(foodData);
    errorMessage = '';
  } catch (error) {
    errorMessage = error.message;
  }
});

// Then Steps - Verify outcomes
Then('the food item should be saved successfully', function () {
  if (errorMessage) {
    throw new Error(`Expected success but got error: ${errorMessage}`);
  }
  if (!result || !result._id) {
    throw new Error('Expected food item to be saved with an ID');
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
```

### User Validation Step Definitions
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const UserValidationService = require('../../services/UserValidationService');

let userData = {};
let validationResult = {};

Given('I have complete user registration data', function () {
  userData = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St, City, State'
  };
});

When('I validate the user registration', function () {
  validationResult = UserValidationService.validateUserRegistration(userData);
});

Then('the validation should pass', function () {
  if (!validationResult.isValid) {
    throw new Error(`Expected validation to pass but got errors: ${validationResult.errors.join(', ')}`);
  }
});
```

## 🚀 BDD Test Execution Results

```bash
> npm run test:bdd

8 scenarios (8 passed)
31 steps (31 passed)
0m00.056s (executing steps: 0m00.006s)
```

## 🛠️ Technical Setup

### Dependencies
```json
{
  "devDependencies": {
    "@cucumber/cucumber": "^9.5.1",
    "jest": "^30.1.3",
    "supertest": "^7.1.4"
  }
}
```

### NPM Scripts
```json
{
  "scripts": {
    "test:bdd": "cucumber-js",
    "test:all": "npm run test && npm run test:bdd"
  }
}
```

### Cucumber Configuration
```javascript
// cucumber.js
module.exports = {
  default: {
    require: ['features/step_definitions/**/*.js'],
    format: ['progress-bar'],
    paths: ['features/**/*.feature']
  }
};
```

## 🔄 BDD vs TDD Comparison

| Aspect | TDD | BDD |
|--------|-----|-----|
| **Focus** | Code behavior | User behavior |
| **Language** | Technical | Business-readable |
| **Audience** | Developers | All stakeholders |
| **Tests** | Unit tests | Acceptance tests |
| **Documentation** | Code comments | Living documentation |

## 📋 Key BDD Principles Demonstrated

1. **Three Amigos**: Collaboration between Business, Development, and QA
2. **Living Documentation**: Feature files that are always up-to-date
3. **Outside-In Development**: Start with user behavior, work inward
4. **Ubiquitous Language**: Common vocabulary between all stakeholders
5. **Automated Acceptance Tests**: Scenarios become automated tests

## 🎯 Benefits Achieved

- ✅ **Clear Requirements**: User stories define expected behavior
- ✅ **Automated Testing**: All scenarios are executable
- ✅ **Regression Protection**: Continuous validation of user stories
- ✅ **Documentation**: Self-updating specification documents
- ✅ **Collaboration**: Bridge between business and technical teams

## 📊 Project Structure
```
backend/
├── features/                    # BDD Feature files
│   ├── food_management.feature
│   ├── user_validation.feature
│   └── step_definitions/        # Step implementation
│       ├── food_management_steps.js
│       └── user_validation_steps.js
├── tests/unit/                  # TDD Unit tests
├── services/                    # Business logic
└── cucumber.js                  # BDD Configuration
```

---

*This presentation demonstrates a complete BDD implementation using Cucumber.js with Node.js, showing how user stories in Gherkin syntax translate to executable step definitions that validate application behavior.*