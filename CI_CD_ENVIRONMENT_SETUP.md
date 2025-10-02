# CI/CD Environment Variables Configuration

This file documents the environment variables needed for the CI/CD pipeline to work correctly.

## GitHub Actions Secrets Configuration

To set up the CI/CD pipeline, add these secrets to your GitHub repository:

### 1. Navigate to Repository Settings
- Go to your GitHub repository
- Click on **Settings** tab
- Select **Secrets and variables** → **Actions**

### 2. Add Repository Secrets

Add the following secrets by clicking **New repository secret**:

#### Database Configuration
```
MONGODB_URI=mongodb://localhost:27017/food-ordering
MONGODB_TEST_URI=mongodb://localhost:27017/test_food_ordering
```

#### JWT Configuration
```
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long-for-production-use
JWT_EXPIRES_IN=7d
```

#### Security Configuration
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Application Configuration
```
NODE_ENV=test
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### 3. Environment Variables for CI/CD

The following environment variables are set automatically in the GitHub Actions workflow:

```yaml
env:
  NODE_ENV: test
  MONGODB_URI: mongodb://localhost:27017/test_food_ordering
  JWT_SECRET: test-jwt-secret-for-ci-cd-pipeline
  CI: true
```

## Local Development Setup

For local development, create a `.env` file in the backend directory:

```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit the .env file with your actual values
# Use the values from .env.example as a template
```

## Testing Environment Variables

The CI/CD pipeline uses these test-specific configurations:

- `NODE_ENV=test`: Enables test mode
- `MONGODB_URI=mongodb://localhost:27017/test_food_ordering`: Test database
- `JWT_SECRET=test-jwt-secret`: Test JWT secret
- `CI=true`: Enables CI mode for React tests

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Fails**
   - Ensure MongoDB service is running in GitHub Actions
   - Check the connection string format
   - Verify network accessibility

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set and long enough (32+ characters)
   - Check token expiration settings

3. **Test Failures**
   - Check if all required dependencies are installed
   - Verify test files exist and are properly configured
   - Ensure environment variables are set correctly

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify package.json scripts are correct
   - Ensure all dependencies are properly locked in package-lock.json

### Debug Commands

Use these commands to debug locally:

```bash
# Check environment variables
printenv | grep -E "(NODE_ENV|MONGODB_URI|JWT_SECRET)"

# Test database connection
node -e "console.log('DB URI:', process.env.MONGODB_URI || 'NOT SET')"

# Run tests with debug output
npm test -- --verbose

# Check package installations
npm ls --depth=0
```

### CI/CD Pipeline Status

Monitor your pipeline at:
`https://github.com/Shalika2002/food-ordering-cicd/actions`

## Security Notes

- Never commit real secrets to version control
- Use GitHub Secrets for sensitive data
- Test with dummy data in CI/CD
- Rotate secrets regularly in production

## Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are properly configured
3. Test locally with the same environment variables
4. Review the troubleshooting guide above