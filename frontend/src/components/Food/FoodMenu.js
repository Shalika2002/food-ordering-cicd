import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodMenu = ({ user }) => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/food');
      setFoods(response.data);
    } catch (error) {
      setError('Failed to fetch food items');
    }
  };

  const addToCart = (food) => {
    const existingItem = cart.find(item => item._id === food._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === food._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item._id !== foodId));
    } else {
      setCart(cart.map(item => 
        item._id === foodId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.map(item => ({
          foodId: item._id,
          quantity: item.quantity
        }))
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Order placed successfully!');
      setCart([]);
      setShowCart(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const groupFoodsByCategory = () => {
    const grouped = foods.reduce((acc, food) => {
      if (!acc[food.category]) {
        acc[food.category] = [];
      }
      acc[food.category].push(food);
      return acc;
    }, {});
    return grouped;
  };

  const groupedFoods = groupFoodsByCategory();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Food Menu */}
        <div className={`col-md-${showCart ? '8' : '12'}`}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Food Menu</h2>
            <button 
              className="btn btn-primary position-relative"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {Object.keys(groupedFoods).map(category => (
            <div key={category} className="mb-4">
              <h4 className="text-primary mb-3">{category}</h4>
              <div className="row">
                {groupedFoods[category].map(food => (
                  <div key={food._id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card h-100">
                      {food.image && (
                        <img src={food.image} className="card-img-top" alt={food.name} style={{height: '200px', objectFit: 'cover'}} />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{food.name}</h5>
                        <p className="card-text">{food.description}</p>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 text-success">${food.price}</span>
                            <span className={`badge ${food.available ? 'bg-success' : 'bg-danger'}`}>
                              {food.available ? 'Available' : 'Sold Out'}
                            </span>
                          </div>
                          <button 
                            className="btn btn-primary w-100 mt-2"
                            onClick={() => addToCart(food)}
                            disabled={!food.available}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart */}
        {showCart && (
          <div className="col-md-4">
            <div className="card sticky-top">
              <div className="card-header">
                <h5>Shopping Cart</h5>
              </div>
              <div className="card-body">
                {cart.length === 0 ? (
                  <p className="text-muted">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item._id} className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">${item.price} each</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total: ${getTotalPrice()}</strong>
                    </div>
                    <button 
                      className="btn btn-success w-100 mt-3"
                      onClick={placeOrder}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodMenu;