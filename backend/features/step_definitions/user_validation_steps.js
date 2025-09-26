const { Given, When, Then } = require('@cucumber/cucumber');
const UserValidationService = require('../../services/UserValidationService');

let userData = {};
let validationResult = {};

// Step definitions for User Registration Validation

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

Given('I have user registration data with invalid email {string}', function (email) {
  userData = {
    username: 'john_doe',
    email: email,
    password: 'password123',
    fullName: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St, City, State'
  };
});

Given('I have user registration data with password {string}', function (password) {
  userData = {
    username: 'john_doe',
    email: 'john@example.com',
    password: password,
    fullName: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St, City, State'
  };
});

Given('I have user registration data missing username and email', function () {
  userData = {
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

Then('there should be no validation errors', function () {
  if (validationResult.errors.length > 0) {
    throw new Error(`Expected no errors but got: ${validationResult.errors.join(', ')}`);
  }
});

Then('the validation should fail', function () {
  if (validationResult.isValid) {
    throw new Error('Expected validation to fail but it passed');
  }
});

Then('I should get error {string}', function (expectedError) {
  if (!validationResult.errors.includes(expectedError)) {
    throw new Error(`Expected error "${expectedError}" but got: ${validationResult.errors.join(', ')}`);
  }
});

Then('I should get multiple validation errors', function () {
  if (validationResult.errors.length <= 1) {
    throw new Error(`Expected multiple errors but got: ${validationResult.errors.length}`);
  }
});