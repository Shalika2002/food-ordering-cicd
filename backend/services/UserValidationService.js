class UserValidationService {
  // Constants for validation rules
  static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static MIN_PASSWORD_LENGTH = 6;
  static MAX_USERNAME_LENGTH = 50;
  static PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
  static REQUIRED_FIELDS = ['username', 'email', 'password', 'fullName'];
  static OPTIONAL_FIELDS = ['phone', 'address'];

  static validateUserRegistration(userData) {
    const errors = [];

    // Validate all required fields
    this._validateRequiredFields(userData, errors);
    
    // Validate specific field formats
    this._validateEmailFormat(userData.email, errors);
    this._validatePasswordStrength(userData.password, errors);
    this._validateUsername(userData.username, errors);
    this._validatePhone(userData.phone, errors);

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  static validateUserLogin(loginData) {
    const errors = [];

    if (!loginData.username || loginData.username.trim() === '') {
      errors.push('Username is required');
    }

    if (!loginData.password || loginData.password.trim() === '') {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  static sanitizeUserInput(userData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (typeof value === 'string') {
        // Remove dangerous characters and trim whitespace
        sanitized[key] = value
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .replace(/DROP\s+TABLE/gi, '')
          .replace(/;/g, '')
          .trim();
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // Private validation helper methods
  static _validateRequiredFields(userData, errors) {
    this.REQUIRED_FIELDS.forEach(field => {
      if (!userData[field] || userData[field] === null || userData[field] === undefined || userData[field].toString().trim() === '') {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        errors.push(`${fieldName} is required`);
      }
    });

    // Optional fields validation - only validate format if provided, but don't require them
    // Note: This implementation makes them required based on business rules
    // To make them truly optional, uncomment the following and comment the strict validation
    /*
    this.OPTIONAL_FIELDS.forEach(field => {
      if (userData[field] !== undefined && userData[field] !== null && userData[field] !== '') {
        // Only validate format if field is provided
        if (field === 'phone') {
          this._validatePhone(userData[field], errors);
        }
      }
    });
    */
    
    // Strict validation - treating optional fields as required for now
    this.OPTIONAL_FIELDS.forEach(field => {
      if (userData[field] === null || userData[field] === undefined || userData[field] === '') {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        errors.push(`${fieldName} is required`);
      }
    });
  }

  static _validateEmailFormat(email, errors) {
    if (email && !this.EMAIL_REGEX.test(email)) {
      errors.push('Invalid email format');
    }
  }

  static _validatePasswordStrength(password, errors) {
    if (password && password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
    }
    
    // Additional password complexity checks
    if (password) {
      const hasNumber = /\d/.test(password);
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);
      
      // Simple passwords that should be rejected
      if (password.length < 8 && !hasNumber && !hasSpecialChar) {
        errors.push('Password is too weak');
      }
      
      // Only numbers
      if (/^\d+$/.test(password)) {
        errors.push('Password cannot be only numbers');
      }
      
      // Only lowercase letters
      if (/^[a-z]+$/.test(password)) {
        errors.push('Password is too weak');
      }
    }
  }

  static _validateUsername(username, errors) {
    if (username) {
      if (username.length > this.MAX_USERNAME_LENGTH) {
        errors.push('Username is too long');
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username contains invalid characters and can only contain letters, numbers, and underscores');
      }
    }
  }

  static _validatePhone(phone, errors) {
    if (phone && !this.PHONE_REGEX.test(phone)) {
      errors.push('Invalid phone number format');
    }
  }
}

module.exports = UserValidationService;