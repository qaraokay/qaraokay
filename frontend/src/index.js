import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app-booking.js';
//import App from './app-payment.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

