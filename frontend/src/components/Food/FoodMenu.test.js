import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodMenu from './FoodMenu';

// Mock fetch
global.fetch = jest.fn();

describe('FoodMenu Component', () => {
  const mockUser = {
    username: 'testuser',
    isAdmin: false
  };

  const mockFoodItems = [
    {
      _id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce and mozzarella',
      price: 12.99,
      category: 'Pizza',
      image: 'pizza.jpg',
      available: true
    },
    {
      _id: '2',
      name: 'Chicken Burger',
      description: 'Juicy chicken burger with fresh vegetables',
      price: 8.99,
      category: 'Burgers',
      image: 'burger.jpg',
      available: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('renders food menu heading', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    expect(screen.getByText(/Food Menu/i)).toBeInTheDocument();
  });

  test('renders welcome message with username', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
  });

  test('loads food items on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('Chicken Burger')).toBeInTheDocument();
    });
  });

  test('displays food item details correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Classic pizza with tomato sauce and mozzarella')).toBeInTheDocument();
      expect(screen.getByText('$12.99')).toBeInTheDocument();
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });
  });

  test('shows add to cart buttons for available items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Add to Cart/i);
      expect(addToCartButtons).toHaveLength(2);
    });
  });

  test('filters food items by category', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      const pizzaFilter = screen.getByText('Pizza');
      fireEvent.click(pizzaFilter);
      
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.queryByText('Chicken Burger')).not.toBeInTheDocument();
    });
  });

  test('shows all items when "All" filter is selected', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      const allFilter = screen.getByText('All');
      fireEvent.click(allFilter);
      
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('Chicken Burger')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<FoodMenu user={mockUser} />);
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('handles error state when fetching fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error loading food items/i)).toBeInTheDocument();
    });
  });

  test('adds item to cart when button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Add to Cart/i);
      fireEvent.click(addToCartButtons[0]);
      
      // Should show some feedback or update cart
      expect(screen.getByText(/Added to cart/i)).toBeInTheDocument();
    });
  });

  test('displays shopping cart summary', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodItems
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Total/i)).toBeInTheDocument();
    });
  });

  test('shows empty state when no food items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<FoodMenu user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/No food items available/i)).toBeInTheDocument();
    });
  });
});