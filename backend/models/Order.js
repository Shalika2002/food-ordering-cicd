const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  specialInstructions: {
    type: String,
    maxlength: 500
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  estimatedDeliveryTime: {
    type: Date
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate estimated delivery time based on preparation time
orderSchema.pre('save', function(next) {
  if (this.status === 'confirmed' && !this.estimatedDeliveryTime) {
    // Assuming average preparation time + 30 minutes for delivery
    const avgPrepTime = this.items.reduce((total, item) => total + (item.food.preparationTime || 20), 0) / this.items.length;
    this.estimatedDeliveryTime = new Date(Date.now() + (avgPrepTime + 30) * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);