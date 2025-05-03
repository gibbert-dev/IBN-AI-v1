
/**
 * Synchronization service for offline/online syncing
 */
import { setupNetworkListeners, cleanupNetworkListeners, checkOnlineStatus } from './services/networkService';
import { syncWithServer } from './services/syncQueueService';
import { 
  saveTranslation, 
  getTranslations, 
  findLocalDuplicate 
} from './services/translationService';

// Setup network listeners with sync callback
const setupNetworkWithSync = () => {
  return setupNetworkListeners(syncWithServer);
};

// Export all needed functions
export {
  setupNetworkWithSync as setupNetworkListeners,
  cleanupNetworkListeners,
  checkOnlineStatus,
  saveTranslation,
  getTranslations,
  findLocalDuplicate,
  syncWithServer
};
