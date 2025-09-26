Feature: Food Management
  As a restaurant manager
  I want to manage food items in the system
  So that customers can see available food options

  Scenario: Add a new food item successfully
    Given I have valid food details
    When I add a new food item
    Then the food item should be saved successfully
    And the food item should have default availability as true

  Scenario: Reject food item with missing required fields
    Given I have incomplete food details missing "name"
    When I try to add a new food item
    Then I should get an error "Required fields are missing"
    And the food item should not be saved

  Scenario: Reject food item with invalid price
    Given I have food details with negative price
    When I try to add a new food item
    Then I should get an error "Price must be greater than 0"
    And the food item should not be saved

  Scenario: Add food item with custom preparation time
    Given I have food details with preparation time of 30 minutes
    When I add a new food item
    Then the food item should be saved with preparation time 30 minutes