import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const renderApp = () => {
  const root = document.getElementById('root');
  
  if (!root) {
    console.error('Root element not found');
    return;
  }

  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    root.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 20px;
        text-align: center;
      ">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
        <pre style="
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          max-width: 800px;
          overflow-x: auto;
        ">${error instanceof Error ? error.message : 'Unknown error occurred'}</pre>
        <button 
          onclick="window.location.reload()"
          style="
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
          "
        >
          Reload Page
        </button>
      </div>
    `;
  }
};

renderApp();

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept();
}
