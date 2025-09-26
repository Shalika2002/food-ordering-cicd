import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    preparationTime: '',
    available: true
  });

  useEffect(() => {
    fetchOrders();
    fetchFoods();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      setError('Failed to fetch orders');
      setOrders([]); // Ensure orders is always an array
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/food');
      setFoods(response.data || []);
    } catch (error) {
      setError('Failed to fetch foods');
      setFoods([]); // Ensure foods is always an array
    }
  };

  const confirmOrder = async () => {
    if (!adminPassword) {
      alert('Please enter admin password');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${selectedOrderId}/status`, {
        status: 'confirmed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Order confirmed successfully!');
      setShowPasswordModal(false);
      setAdminPassword('');
      setSelectedOrderId(null);
      fetchOrders(); // Refresh orders
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to confirm order');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh orders
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleConfirmOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPasswordModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'preparing': return 'bg-primary';
      case 'ready': return 'bg-success';
      case 'delivered': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-light';
    }
  };

  const toggleFoodAvailability = async (foodId, currentAvailability) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/food/${foodId}`, 
        { available: !currentAvailability },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFoods(); // Refresh foods
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update food availability');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/food', {
        name: newFood.name,
        description: newFood.description,
        price: parseFloat(newFood.price),
        category: newFood.category,
        image: newFood.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300',
        preparationTime: parseInt(newFood.preparationTime),
        available: newFood.available
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form and close modal
      setNewFood({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        preparationTime: '',
        available: true
      });
      setShowAddFoodForm(false);
      fetchFoods(); // Refresh foods list
      alert('Food item added successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  const handleNewFoodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFood(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'foods' ? 'active' : ''}`}
            onClick={() => setActiveTab('foods')}
          >
            Food Management ({foods.length})
          </button>
        </li>
      </ul>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2>Order Management</h2>
          {!orders || orders.length === 0 ? (
            <div className="alert alert-info">No orders found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders || []).map(order => (
                    <tr key={order._id}>
                      <td><small>{order._id}</small></td>
                      <td>{order.user?.username || 'Unknown'}</td>
                      <td>
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="small">
                            {item.food?.name || 'Unknown'} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>${order.totalAmount}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group-vertical btn-group-sm">
                          {order.status === 'pending' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleConfirmOrder(order._id)}
                            >
                              Confirm Order
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => updateOrderStatus(order._id, 'preparing')}
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => updateOrderStatus(order._id, 'ready')}
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Food Management Tab */}
      {activeTab === 'foods' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Food Management</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddFoodForm(!showAddFoodForm)}
            >
              {showAddFoodForm ? 'Cancel' : 'Add New Food'}
            </button>
          </div>

          {/* Add New Food Form */}
          {showAddFoodForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Add New Food Item</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddFood}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Food Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newFood.name}
                        onChange={handleNewFoodChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-control"
                        name="category"
                        value={newFood.category}
                        onChange={handleNewFoodChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Snack">Snack</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={newFood.price}
                        onChange={handleNewFoodChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preparation Time (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="preparationTime"
                        value={newFood.preparationTime}
                        onChange={handleNewFoodChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={newFood.description}
                      onChange={handleNewFoodChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="image"
                      value={newFood.image}
                      onChange={handleNewFoodChange}
                      placeholder="https://example.com/food-image.jpg"
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="available"
                      checked={newFood.available}
                      onChange={handleNewFoodChange}
                      id="availableCheck"
                    />
                    <label className="form-check-label" htmlFor="availableCheck">
                      Available for ordering
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      Add Food Item
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowAddFoodForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row">
            {(foods || []).map(food => (
              <div key={food._id} className="col-md-6 col-lg-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{food.name}</h5>
                    <p className="card-text">{food.description}</p>
                    <p className="card-text">
                      <strong>Price: ${food.price}</strong><br />
                      <strong>Category: {food.category}</strong>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge ${food.available ? 'bg-success' : 'bg-danger'}`}>
                        {food.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button 
                        className={`btn btn-sm ${food.available ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => toggleFoodAvailability(food._id, food.available)}
                      >
                        {food.available ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Order</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Enter admin password to confirm this order:</p>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={confirmOrder}
                  disabled={loading}
                >
                  {loading ? 'Confirming...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;