/**
 * Main Entry Point for React Application
 * 
 * This file is the entry point for the React app. It renders the root App component
 * into the DOM. This is where React takes control of the application.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from the HTML file
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
// StrictMode is a tool for highlighting potential problems in the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
