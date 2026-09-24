import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';

// Large-text preference applies before first paint (no flash, no layout jump).
try {
  if (localStorage.getItem('fasal-textscale') === 'large') {
    document.documentElement.classList.add('text-large');
  }
} catch { /* private mode — default scale */ }

// Cache the app shell for installable mobile use. API requests stay online.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
