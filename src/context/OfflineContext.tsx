
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  setupNetworkListeners, 
  cleanupNetworkListeners, 
  checkOnlineStatus 
} from '@/utils/syncService';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isSyncing: false,
  lastSyncTime: null
});

export const useOfflineStatus = () => useContext(OfflineContext);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      // Actual syncing is handled by the syncService
      // We just update UI state here
      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncTime(new Date());
      }, 2000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial state
    setIsOnline(navigator.onLine);
    
    // Setup network listeners in syncService
    setupNetworkListeners();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clean up network listeners in syncService
      cleanupNetworkListeners();
    };
  }, []);
  
  return (
    <OfflineContext.Provider value={{ isOnline, isSyncing, lastSyncTime }}>
      {children}
    </OfflineContext.Provider>
  );
};
