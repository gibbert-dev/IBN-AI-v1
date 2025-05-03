
import { toast } from "sonner";

// Network status tracking
let isOnline = navigator.onLine;

// Online status listeners
export const setupNetworkListeners = (onOnlineCallback: () => Promise<void>) => {
  window.addEventListener('online', () => handleOnline(onOnlineCallback));
  window.addEventListener('offline', handleOffline);
  
  // Initial status
  if (isOnline) {
    console.log('Application is online');
  } else {
    console.log('Application is offline');
    toast("You're offline", {
      description: "Working in offline mode. Your translations will be synced when you reconnect."
    });
  }
};

export const cleanupNetworkListeners = () => {
  // We need to provide empty functions as we can't access the original bound functions
  window.removeEventListener('online', () => {});
  window.removeEventListener('offline', () => {});
};

// Handle going online
const handleOnline = async (onOnlineCallback: () => Promise<void>) => {
  isOnline = true;
  console.log('Connection restored. Starting sync...');
  
  toast("You're back online", {
    description: "Syncing your translations..."
  });
  
  try {
    await onOnlineCallback();
    
    toast("Sync complete", {
      description: "Your translations have been synced with the server."
    });
  } catch (error) {
    console.error('Sync error:', error);
    
    toast.error("Sync failed", {
      description: "There was an error syncing your translations. Will retry later."
    });
  }
};

// Handle going offline
const handleOffline = () => {
  isOnline = false;
  console.log('Connection lost. Working offline.');
  
  toast("You're offline", {
    description: "Working in offline mode. Your translations will be synced when you reconnect."
  });
};

// Check if the application is online
export const checkOnlineStatus = (): boolean => {
  return isOnline;
};
