
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './lib/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { AuthProvider } from '@/lib/authContext.jsx';
import { CartProvider } from '@/lib/cartContext.jsx';
import { FavoritesProvider } from '@/lib/favoritesContext.jsx';
import { SettingsProvider } from '@/lib/settingsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);
