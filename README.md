# Food Ordering System - MERN Stack

A complete food ordering application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# The .env file is already created with default values
# MongoDB URI: mongodb://localhost:27017/food-ordering
# JWT Secret: your-super-secret-jwt-key-change-this-in-production
# Admin Password: admin123
```

4. Seed the database with sample data and admin user:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📦 What's Included

### Backend Features ✅
- Express.js server with MongoDB connection
- User authentication with JWT
- User registration and login
- Food menu management
- Order placement and tracking
- Admin dashboard with password protection
- Complete API endpoints for all features

### Frontend Features 🚧
- Basic React app structure created
- Bootstrap styling included
- Ready for component development

## 🎯 Default Admin Account

After running the seed script:
- **Username:** admin
- **Password:** admin123

## 📁 Project Structure

```
food-ordering-system/
├── backend/
│   ├── models/           # MongoDB models (User, Food, Order)
│   ├── routes/           # API routes (auth, food, orders, admin)
│   ├── middleware/       # Authentication middleware
│   ├── server.js         # Express server
│   ├── seed.js          # Database seeding script
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   └── index.js     # React entry point
│   └── package.json
└── README.md
```

## 🛠️ Next Steps

1. **Test the Backend API:**
   - Visit `http://localhost:5000` to see API status
   - Use Postman to test endpoints

2. **Develop the Frontend:**
   - Build React components for login/signup
   - Create food menu display
   - Implement shopping cart
   - Add order management

3. **Key Features to Implement:**
   - User authentication UI
   - Food browsing and ordering
   - Admin dashboard
   - Order status tracking

## 📚 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/food` - Get all food items
- `POST /api/orders` - Place new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/admin/dashboard` - Admin dashboard (requires admin auth)

## 🤝 Contributing

1. Make your changes
2. Test the functionality
3. Ensure both backend and frontend work together
4. Submit your improvements

---

**Your MERN Food Ordering System is ready to go! 🍕🚀**