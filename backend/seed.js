const mongoose = require('mongoose');
const Food = require('./models/Food');
const User = require('./models/User');
require('dotenv').config();

const sampleFoods = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh tomato sauce, mozzarella cheese, and basil leaves",
    price: 12.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300",
    preparationTime: 20,
    available: true
  },
  {
    name: "Chicken Burger",
    description: "Grilled chicken breast with lettuce, tomato, onion, and special sauce",
    price: 8.99,
    category: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    preparationTime: 15,
    available: true
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing",
    price: 7.49,
    category: "Salad",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300",
    preparationTime: 10,
    available: true
  },
  {
    name: "Spaghetti Carbonara",
    description: "Traditional Italian pasta with eggs, cheese, pancetta, and black pepper",
    price: 11.99,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300",
    preparationTime: 25,
    available: true
  },
  {
    name: "Chocolate Cake",
    description: "Rich chocolate cake with creamy chocolate frosting",
    price: 5.99,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300",
    preparationTime: 5,
    available: true
  },
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 3.99,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300",
    preparationTime: 5,
    available: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering');
    console.log('Connected to MongoDB');

    // Clear existing food data
    await Food.deleteMany({});
    console.log('Cleared existing food data');

    // Insert sample foods
    await Food.insertMany(sampleFoods);
    console.log('Sample food data inserted successfully');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@foodorder.com',
        password: 'admin123',
        fullName: 'System Administrator',
        phone: '1234567890',
        address: 'Admin Office',
        isAdmin: true
      });
      await adminUser.save();
      console.log('Admin user created - username: admin, password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();