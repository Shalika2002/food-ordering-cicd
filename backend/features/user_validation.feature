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

  Scenario: Reject registration with weak password
    Given I have user registration data with password "123"
    When I validate the user registration
    Then the validation should fail
    And I should get error "Password must be at least 6 characters long"

  Scenario: Reject registration with missing required fields
    Given I have user registration data missing username and email
    When I validate the user registration
    Then the validation should fail
    And I should get multiple validation errors