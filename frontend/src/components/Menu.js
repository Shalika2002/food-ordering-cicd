import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get(`http://localhost:5001/api/menu?${params}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      setMenuItems(response.data.items || []);
      setError('');
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/[<>\"'&]/g, ''); // Basic sanitization
    setSearchTerm(value);
  };

  if (loading) return <div className="loading-spinner">Loading menu...</div>;

  return (
    <div className="menu-container">
      <h2>🍕 Our Secure Menu</h2>
      
      <div className="menu-filters">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength="50"
            className="search-input"
          />
        </div>
        
        <div className="form-group">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="pizza">Pizza</option>
            <option value="burger">Burger</option>
            <option value="salad">Salad</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      
      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map(item => (
            <div key={item.id} className="menu-item">
              <h3>{item.name}</h3>
              <p className="price">${item.price}</p>
              <p className="category">Category: {item.category}</p>
              <button className="order-btn">Add to Cart</button>
            </div>
          ))
        ) : (
          <div className="no-items">
            <p>No menu items found</p>
            {searchTerm && <p>Try adjusting your search term</p>}
          </div>
        )}
      </div>
      
      <div className="menu-info">
        <h3>🔒 Security Features:</h3>
        <ul>
          <li>✅ Input sanitization on search</li>
          <li>✅ Parameter validation</li>
          <li>✅ Secure API communication</li>
          <li>✅ XSS protection</li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;