// 


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="33616128040-1qso6v537e4nh9pdsnd6l6rurmnm9g2c.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
