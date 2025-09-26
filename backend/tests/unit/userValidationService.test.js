const UserValidationService = require('../../services/UserValidationService');

describe('UserValidationService', () => {
  describe('validateUserRegistration', () => {
    it('should return valid for correct user data', () => {
      // Arrange
      const validUserData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St, City, State'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(validUserData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for missing username', () => {
      // Arrange
      const invalidUserData = {
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username is required');
    });

    it('should return invalid for invalid email format', () => {
      // Arrange
      const invalidUserData = {
        username: 'john_doe',
        email: 'invalid-email',
        password: 'password123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should return invalid for weak password', () => {
      // Arrange
      const invalidUserData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: '123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      // Arrange
      const invalidUserData = {
        email: 'invalid-email',
        password: '123'
        // missing username, fullName, phone, address
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    // Enhanced test cases for comprehensive coverage
    it('should return invalid for username with special characters', () => {
      // Arrange
      const invalidUserData = {
        username: 'john@#$%',
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert - Assuming usernames should be alphanumeric with underscores
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('username') || error.includes('characters'))).toBe(true);
    });

    it('should return invalid for extremely long username', () => {
      // Arrange
      const longUsername = 'a'.repeat(100); // Very long username
      const invalidUserData = {
        username: longUsername,
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('username') || error.includes('long'))).toBe(true);
    });

    it('should return invalid for empty string fields', () => {
      // Arrange
      const invalidUserData = {
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: ''
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3); // Multiple validation errors
    });

    it('should return invalid for null and undefined values', () => {
      // Arrange
      const invalidUserData = {
        username: null,
        email: undefined,
        password: null,
        fullName: undefined,
        phone: null,
        address: undefined
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3);
    });

    it('should validate phone number format', () => {
      // Arrange
      const invalidUserData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: 'invalid-phone',
        address: '123 Main St'
      };

      // Act
      const result = UserValidationService.validateUserRegistration(invalidUserData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('phone'))).toBe(true);
    });

    it('should handle missing optional fields gracefully', () => {
      // Arrange
      const userDataWithoutOptionalFields = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe'
        // phone and address might be optional
      };

      // Act
      const result = UserValidationService.validateUserRegistration(userDataWithoutOptionalFields);

      // Assert - This test checks if optional fields are handled properly
      // The result depends on your business logic for optional fields
      if (result.isValid) {
        expect(result.errors).toEqual([]);
        console.log('✓ Optional fields (phone, address) are not required');
      } else {
        expect(result.errors.every(error => 
          error.toLowerCase().includes('phone') || error.toLowerCase().includes('address')
        )).toBe(true);
        console.log('✓ Phone and address are required fields');
      }
    });

    it('should validate password complexity requirements', () => {
      // Test different password scenarios
      const passwordTests = [
        { password: 'abc', expectedValid: false, reason: 'too short' },
        { password: 'password', expectedValid: false, reason: 'no numbers or special chars' },
        { password: 'Password123', expectedValid: true, reason: 'meets complexity' },
        { password: '123456789', expectedValid: false, reason: 'only numbers' },
        { password: 'Pass123!', expectedValid: true, reason: 'complex password' }
      ];

      passwordTests.forEach(({ password, expectedValid, reason }) => {
        const userData = {
          username: 'john_doe',
          email: 'john@example.com',
          password: password,
          fullName: 'John Doe',
          phone: '+1234567890',
          address: '123 Main St'
        };

        const result = UserValidationService.validateUserRegistration(userData);
        
        if (expectedValid) {
          expect(result.isValid).toBe(true);
          console.log(`✓ Password "${password}" accepted (${reason})`);
        } else {
          expect(result.isValid).toBe(false);
          expect(result.errors.some(error => error.toLowerCase().includes('password'))).toBe(true);
          console.log(`✓ Password "${password}" rejected (${reason})`);
        }
      });
    });

    it('should validate email format variations', () => {
      const emailTests = [
        { email: 'test@example.com', expectedValid: true },
        { email: 'user.name@domain.co.uk', expectedValid: true },
        { email: 'user+tag@example.org', expectedValid: true },
        { email: 'invalid.email', expectedValid: false },
        { email: '@domain.com', expectedValid: false },
        { email: 'user@', expectedValid: false },
        { email: 'user name@domain.com', expectedValid: false }
      ];

      emailTests.forEach(({ email, expectedValid }) => {
        const userData = {
          username: 'john_doe',
          email: email,
          password: 'password123',
          fullName: 'John Doe',
          phone: '+1234567890',
          address: '123 Main St'
        };

        const result = UserValidationService.validateUserRegistration(userData);
        
        if (expectedValid) {
          expect(result.isValid).toBe(true);
          console.log(`✓ Email "${email}" accepted`);
        } else {
          expect(result.isValid).toBe(false);
          expect(result.errors.some(error => error.toLowerCase().includes('email'))).toBe(true);
          console.log(`✓ Email "${email}" rejected`);
        }
      });
    });
  });

  describe('validateUserLogin', () => {
    it('should return valid for correct login credentials', () => {
      // Arrange
      const validLoginData = {
        username: 'john_doe',
        password: 'password123'
      };

      // Act
      const result = UserValidationService.validateUserLogin(validLoginData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for missing username', () => {
      // Arrange
      const invalidLoginData = {
        password: 'password123'
      };

      // Act
      const result = UserValidationService.validateUserLogin(invalidLoginData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username is required');
    });

    it('should return invalid for missing password', () => {
      // Arrange
      const invalidLoginData = {
        username: 'john_doe'
      };

      // Act
      const result = UserValidationService.validateUserLogin(invalidLoginData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should return invalid for empty credentials', () => {
      // Arrange
      const invalidLoginData = {
        username: '',
        password: ''
      };

      // Act
      const result = UserValidationService.validateUserLogin(invalidLoginData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('sanitizeUserInput', () => {
    it('should remove potentially dangerous characters from input', () => {
      // Arrange
      const dangerousInput = {
        username: 'john<script>alert("xss")</script>',
        fullName: 'John "Drop Table" Doe',
        address: "123 Main St'; DROP TABLE users; --"
      };

      // Act
      const result = UserValidationService.sanitizeUserInput(dangerousInput);

      // Assert
      expect(result.username).not.toContain('<script>');
      expect(result.username).not.toContain('</script>');
      expect(result.address).not.toContain('DROP TABLE');
      expect(result.address).not.toContain(';');
      console.log('✓ Input sanitization working properly');
    });

    it('should trim whitespace from all fields', () => {
      // Arrange
      const inputWithWhitespace = {
        username: '  john_doe  ',
        email: '  john@example.com  ',
        fullName: '  John Doe  '
      };

      // Act
      const result = UserValidationService.sanitizeUserInput(inputWithWhitespace);

      // Assert
      expect(result.username).toBe('john_doe');
      expect(result.email).toBe('john@example.com');
      expect(result.fullName).toBe('John Doe');
      console.log('✓ Whitespace trimming working properly');
    });
  });
});