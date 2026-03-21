
import React from 'react';
import App from './App';
import { render } from '@testing-library/react';

test('renders App component without crashing', () => {
  render(<App />);
});