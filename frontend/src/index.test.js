import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock ReactDOM.render
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}));

// Mock App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div data-testid="app">Mocked App Component</div>;
  };
});

describe('Index.js', () => {
  test('renders without crashing', () => {
    // Import index.js which will execute the rendering logic
    require('./index.js');
    
    // If we get here without errors, the test passes
    expect(true).toBe(true);
  });

  test('creates root and renders App component', () => {
    const { createRoot } = require('react-dom/client');
    
    // Re-import to trigger the execution
    delete require.cache[require.resolve('./index.js')];
    require('./index.js');
    
    // Verify createRoot was called
    expect(createRoot).toHaveBeenCalled();
  });
});