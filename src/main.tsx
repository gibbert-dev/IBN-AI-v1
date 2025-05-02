import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupSyncService } from './services/syncService';

// Initialize sync service
setupSyncService();

createRoot(document.getElementById('root')!).render(
  <App />
);
