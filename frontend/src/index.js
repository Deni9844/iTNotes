import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { positions, transitions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  timeout: 2000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <GoogleOAuthProvider clientId="216886902409-ihvpgcot1cs5o5idp93ftulth7hh2d8n.apps.googleusercontent.com">
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
          <App />
      </AlertProvider>
    </Provider>
  </GoogleOAuthProvider>
);


