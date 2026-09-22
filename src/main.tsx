import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.js';
import { setupClientApiFallback } from './utils/clientMockApi.js';

// Activate client-side resilient API fallback for static hostings (Netlify, Vercel, GitHub Pages)
setupClientApiFallback();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
