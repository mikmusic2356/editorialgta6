import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

// Prevent browser extension / unhandled network promise rejections from crashing the app
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Could not establish connection') || 
        event.reason?.name === 'QuotaExceededError') {
      event.preventDefault();
      console.warn('[Global] Suppressed benign extension/storage error:', event.reason);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackTitle="Ha ocurrido un error al cargar la aplicación">
    <App />
  </ErrorBoundary>
);

