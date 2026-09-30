import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import './saarthi/udyamsetu-theme.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      const appRegistrations = registrations.filter((registration) => {
        const scope = new URL(registration.scope);
        return scope.origin === window.location.origin && scope.pathname === '/';
      });
      await Promise.all(appRegistrations.map((registration) => registration.unregister()));
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames
        .filter((name) => name.startsWith('udyamsetu-'))
        .map((name) => caches.delete(name)));
    }).catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
