const FoodService = require('../../services/FoodService');
const Food = require('../../models/Food');

// Mock the Food model
jest.mock('../../models/Food');

describe('FoodService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFood', () => {
    it('should successfully add a new food item with valid data', async () => {
      // Arrange
      const foodData = {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce and mozzarella',
        price: 12.99,
        category: 'Pizza',
        preparationTime: 15
      };

      const savedFood = {
        _id: '507f1f77bcf86cd799439011',
        ...foodData,
        available: true,
        image: 'https://via.placeholder.com/300x200',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Food.prototype.save = jest.fn().mockResolvedValue(savedFood);

      // Act
      const result = await FoodService.addFood(foodData);

      // Assert
      expect(result).toEqual(savedFood);
      expect(Food.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error when required fields are missing', async () => {
      // Arrange
      const invalidFoodData = {
        name: 'Pizza',
        // missing required fields: description, price, category, preparationTime
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Required fields are missing');
    });

    it('should throw error when price is negative', async () => {
      // Arrange
      const invalidFoodData = {
        name: 'Pizza',
        description: 'Test pizza',
        price: -5.99,
        category: 'Pizza',
        preparationTime: 15
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Price must be greater than 0');
    });

    // Enhanced test cases for comprehensive coverage
    it('should set default availability to true when not specified', async () => {
      // Arrange
      const foodData = {
        name: 'Hawaiian Pizza',
        description: 'Pizza with ham and pineapple',
        price: 14.99,
        category: 'Pizza',
        preparationTime: 20
      };

      const savedFood = {
        _id: '507f1f77bcf86cd799439012',
        ...foodData,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Food.prototype.save = jest.fn().mockResolvedValue(savedFood);

      // Act
      const result = await FoodService.addFood(foodData);

      // Assert
      expect(result.available).toBe(true);
      expect(Food.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should handle zero price correctly', async () => {
      // Arrange
      const foodData = {
        name: 'Free Sample',
        description: 'Complimentary sample item',
        price: 0,
        category: 'Samples',
        preparationTime: 1
      };

      // Act & Assert
      await expect(FoodService.addFood(foodData))
        .rejects
        .toThrow('Price must be greater than 0');
    });

    it('should validate preparation time is positive', async () => {
      // Arrange
      const invalidFoodData = {
        name: 'Instant Pizza',
        description: 'Pizza that takes no time',
        price: 10.99,
        category: 'Pizza',
        preparationTime: -5
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Preparation time must be greater than 0');
    });

    it('should validate food name length', async () => {
      // Arrange - Very long name
      const longName = 'A'.repeat(200);
      const invalidFoodData = {
        name: longName,
        description: 'Valid description',
        price: 10.99,
        category: 'Test',
        preparationTime: 15
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Food name is too long');
    });

    it('should handle empty string inputs', async () => {
      // Arrange
      const invalidFoodData = {
        name: '',
        description: '',
        price: 10.99,
        category: '',
        preparationTime: 15
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Required fields are missing');
    });

    it('should handle null and undefined values', async () => {
      // Arrange
      const invalidFoodData = {
        name: null,
        description: undefined,
        price: 10.99,
        category: null,
        preparationTime: undefined
      };

      // Act & Assert
      await expect(FoodService.addFood(invalidFoodData))
        .rejects
        .toThrow('Required fields are missing');
    });
  });

  describe('getAllFoods', () => {
    it('should return all available food items', async () => {
      // Arrange
      const mockFoods = [
        {
          _id: '1',
          name: 'Pizza',
          price: 12.99,
          available: true,
          category: 'Main Course'
        },
        {
          _id: '2',
          name: 'Burger',
          price: 8.99,
          available: true,
          category: 'Main Course'
        }
      ];

      Food.find = jest.fn().mockResolvedValue(mockFoods);

      // Act
      const result = await FoodService.getAllFoods();

      // Assert
      expect(result).toEqual(mockFoods);
      expect(Food.find).toHaveBeenCalledWith({ available: true });
    });

    it('should return empty array when no foods are available', async () => {
      // Arrange
      Food.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await FoodService.getAllFoods();

      // Assert
      expect(result).toEqual([]);
      expect(Food.find).toHaveBeenCalledWith({ available: true });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      Food.find = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(FoodService.getAllFoods())
        .rejects
        .toThrow('Database connection failed');
    });
  });

  describe('getFoodById', () => {
    it('should return food item when valid ID is provided', async () => {
      // Arrange
      const mockFood = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Pizza',
        price: 12.99,
        available: true,
        category: 'Pizza'
      };

      Food.findById = jest.fn().mockResolvedValue(mockFood);

      // Act
      const result = await FoodService.getFoodById('507f1f77bcf86cd799439011');

      // Assert
      expect(result).toEqual(mockFood);
      expect(Food.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return null when food item is not found', async () => {
      // Arrange
      Food.findById = jest.fn().mockResolvedValue(null);

      // Act
      const result = await FoodService.getFoodById('nonexistent-id');

      // Assert
      expect(result).toBeNull();
      expect(Food.findById).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should throw error for invalid ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id-format';

      // Act & Assert
      await expect(FoodService.getFoodById(invalidId))
        .rejects
        .toThrow('Invalid food ID format');
    });
  });

  describe('updateFood', () => {
    it('should successfully update food item with valid data', async () => {
      // Arrange
      const foodId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Pizza',
        price: 15.99,
        available: false
      };

      const updatedFood = {
        _id: foodId,
        ...updateData,
        description: 'Original description',
        category: 'Pizza',
        preparationTime: 15
      };

      Food.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedFood);

      // Act
      const result = await FoodService.updateFood(foodId, updateData);

      // Assert
      expect(result).toEqual(updatedFood);
      expect(Food.findByIdAndUpdate).toHaveBeenCalledWith(
        foodId,
        updateData,
        { new: true, runValidators: true }
      );
    });

    it('should return null when trying to update non-existent food', async () => {
      // Arrange
      Food.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      // Act
      const result = await FoodService.updateFood('nonexistent-id', { price: 10.99 });

      // Assert
      expect(result).toBeNull();
    });

    it('should validate update data before updating', async () => {
      // Arrange
      const foodId = '507f1f77bcf86cd799439011';
      const invalidUpdateData = {
        price: -5.99 // Invalid negative price
      };

      // Act & Assert
      await expect(FoodService.updateFood(foodId, invalidUpdateData))
        .rejects
        .toThrow('Price must be greater than 0');
    });
  });

  describe('deleteFood', () => {
    it('should successfully delete food item', async () => {
      // Arrange
      const foodId = '507f1f77bcf86cd799439011';
      const deletedFood = {
        _id: foodId,
        name: 'Deleted Pizza',
        price: 12.99
      };

      Food.findByIdAndDelete = jest.fn().mockResolvedValue(deletedFood);

      // Act
      const result = await FoodService.deleteFood(foodId);

      // Assert
      expect(result).toEqual(deletedFood);
      expect(Food.findByIdAndDelete).toHaveBeenCalledWith(foodId);
    });

    it('should return null when trying to delete non-existent food', async () => {
      // Arrange
      Food.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      // Act
      const result = await FoodService.deleteFood('nonexistent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('searchFoodsByName', () => {
    it('should return foods matching search query', async () => {
      // Arrange
      const searchQuery = 'pizza';
      const mockResults = [
        { _id: '1', name: 'Margherita Pizza', category: 'Pizza' },
        { _id: '2', name: 'Pepperoni Pizza', category: 'Pizza' }
      ];

      Food.find = jest.fn().mockResolvedValue(mockResults);

      // Act
      const result = await FoodService.searchFoodsByName(searchQuery);

      // Assert
      expect(result).toEqual(mockResults);
      expect(Food.find).toHaveBeenCalledWith({
        name: { $regex: searchQuery, $options: 'i' },
        available: true
      });
    });

    it('should return empty array for no matches', async () => {
      // Arrange
      Food.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await FoodService.searchFoodsByName('nonexistent food');

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle empty search query', async () => {
      // Arrange & Act & Assert
      await expect(FoodService.searchFoodsByName(''))
        .rejects
        .toThrow('Search query cannot be empty');
    });
  });

  describe('getFoodsByCategory', () => {
    it('should return foods from specific category', async () => {
      // Arrange
      const category = 'Pizza';
      const mockFoods = [
        { _id: '1', name: 'Margherita Pizza', category: 'Pizza' },
        { _id: '2', name: 'Pepperoni Pizza', category: 'Pizza' }
      ];

      Food.find = jest.fn().mockResolvedValue(mockFoods);

      // Act
      const result = await FoodService.getFoodsByCategory(category);

      // Assert
      expect(result).toEqual(mockFoods);
      expect(Food.find).toHaveBeenCalledWith({
        category: category,
        available: true
      });
    });

    it('should return empty array for category with no foods', async () => {
      // Arrange
      Food.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await FoodService.getFoodsByCategory('Empty Category');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('calculateFoodStatistics', () => {
    it('should calculate correct statistics from food data', async () => {
      // Arrange
      const mockFoods = [
        { price: 10.99, category: 'Pizza', available: true },
        { price: 8.99, category: 'Burger', available: true },
        { price: 15.99, category: 'Pizza', available: false },
        { price: 12.99, category: 'Pizza', available: true }
      ];

      Food.find = jest.fn().mockResolvedValue(mockFoods);

      // Act
      const result = await FoodService.calculateFoodStatistics();

      // Assert
      expect(result).toHaveProperty('totalItems');
      expect(result).toHaveProperty('availableItems');
      expect(result).toHaveProperty('averagePrice');
      expect(result).toHaveProperty('categoryCounts');
      
      expect(result.totalItems).toBe(4);
      expect(result.availableItems).toBe(3);
      expect(result.averagePrice).toBeCloseTo(12.24, 2);
      expect(result.categoryCounts).toEqual({
        'Pizza': 3,
        'Burger': 1
      });
    });

    it('should handle empty food database', async () => {
      // Arrange
      Food.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await FoodService.calculateFoodStatistics();

      // Assert
      expect(result.totalItems).toBe(0);
      expect(result.availableItems).toBe(0);
      expect(result.averagePrice).toBe(0);
      expect(result.categoryCounts).toEqual({});
    });
  });
});
