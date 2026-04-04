import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #220000; color: #ffaaaa; font-family: monospace; min-height: 100vh;">
        <h2>Runtime Error</h2>
        <pre style="white-space: pre-wrap;">${event.error?.stack || event.message}</pre>
      </div>
    `;
  }
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found!");
}
