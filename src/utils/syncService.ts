/**
 * Synchronization service for offline/online syncing
 */
import { toast } from "sonner"; // Changed from "@/components/ui/sonner" to direct "sonner" import
import { 
  addLocalTranslation, 
  addToSyncQueue, 
  deleteLocalTranslation, 
  getLocalTranslations,
  getSyncQueue, 
  removeFromSyncQueue,
  updateLocalTranslation
} from "./indexedDbService";
import { 
  Translation,
  saveTranslation as saveToSupabase, 
  deleteTranslation as deleteFromSupabase, 
  getTranslations as getSupabaseTranslations
} from "./databaseUtils";
import { LocalTranslation } from "./indexedDbService";

let isOnline = navigator.onLine;
let isSyncing = false;

// Online status listeners
export const setupNetworkListeners = () => {
  window.addEventListener('online', handleOnline);
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
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
};

// Handle going online
const handleOnline = async () => {
  isOnline = true;
  console.log('Connection restored. Starting sync...');
  
  toast("You're back online", {
    description: "Syncing your translations..."
  });
  
  try {
    await syncWithServer();
    
    toast("Sync complete", {
      description: "Your translations have been synced with the server."
    });
  } catch (error) {
    console.error('Sync error:', error);
    
    toast("Sync failed", {
      description: "There was an error syncing your translations. Will retry later.",
      variant: "destructive"
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

// Save a translation (to Supabase if online, or locally if offline)
export const saveTranslation = async (english: string, ibono: string): Promise<{
  data: Translation | LocalTranslation | null; 
  isDuplicate: boolean; 
  existingTranslation: Translation | LocalTranslation | null;
}> => {
  const trimmedEnglish = english.trim();
  const trimmedIbono = ibono.trim();

  try {
    if (isOnline) {
      // Try saving to Supabase
      console.log('Saving to Supabase');
      const result = await saveToSupabase(trimmedEnglish, trimmedIbono);
      
      if (!result.isDuplicate && result.data) {
        // Also save to local database for offline access
        await addLocalTranslation({
          id: result.data.id,
          english: trimmedEnglish,
          ibono: trimmedIbono,
          created_at: result.data.created_at,
          is_synced: true,
          sync_status: 'synced'
        });
      }
      
      return result;
    } else {
      // Offline mode - save locally
      console.log('Saving locally (offline mode)');
      
      // Check for duplicates in local database
      const existingLocal = await findLocalDuplicate(trimmedEnglish, trimmedIbono);
      
      if (existingLocal) {
        console.log('Found local duplicate:', existingLocal);
        return { 
          data: null, 
          isDuplicate: true, 
          existingTranslation: existingLocal
        };
      }
      
      // Save to local database
      const newLocal: LocalTranslation = {
        english: trimmedEnglish,
        ibono: trimmedIbono,
        created_at: new Date().toISOString(),
        is_synced: false,
        sync_status: 'pending'
      };
      
      const savedLocal = await addLocalTranslation(newLocal);
      
      // Add to sync queue for later syncing
      await addToSyncQueue({
        operation: 'create',
        data: savedLocal
      });
      
      return { 
        data: savedLocal, 
        isDuplicate: false, 
        existingTranslation: null 
      };
    }
  } catch (error) {
    console.error('Error saving translation:', error);
    throw error;
  }
};

// Find duplicate translations locally
export const findLocalDuplicate = async (english: string, ibono: string): Promise<LocalTranslation | null> => {
  try {
    const localTranslations = await getLocalTranslations();
    
    // Check for exact match (both English and Ibọnọ)
    const exactMatch = localTranslations.find(t => 
      t.english.trim().toLowerCase() === english.trim().toLowerCase() && 
      t.ibono.trim().toLowerCase() === ibono.trim().toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // If no exact match, check for matching English text only
    const englishMatch = localTranslations.find(t => 
      t.english.trim().toLowerCase() === english.trim().toLowerCase()
    );
    
    return englishMatch || null;
  } catch (error) {
    console.error('Error checking for local duplicates:', error);
    return null;
  }
};

// Get all translations (from Supabase if online, or locally if offline)
export const getTranslations = async (): Promise<(Translation | LocalTranslation)[]> => {
  try {
    if (isOnline) {
      // Try getting from Supabase
      console.log('Fetching translations from Supabase');
      const remoteTranslations = await getSupabaseTranslations();
      
      // Update local database with remote translations
      await syncLocalWithRemote(remoteTranslations);
      
      return remoteTranslations;
    } else {
      // Offline mode - get from local database
      console.log('Fetching translations locally (offline mode)');
      const localTranslations = await getLocalTranslations();
      return localTranslations;
    }
  } catch (error) {
    console.error('Error getting translations:', error);
    
    // If there's an error with Supabase, fall back to local data
    console.log('Falling back to local translations');
    const localTranslations = await getLocalTranslations();
    return localTranslations;
  }
};

// Sync with server when coming back online
export const syncWithServer = async (): Promise<void> => {
  if (isSyncing || !isOnline) return;
  
  try {
    isSyncing = true;
    
    // Get pending operations from sync queue
    const queue = await getSyncQueue();
    if (queue.length === 0) {
      console.log('No pending sync operations');
      return;
    }
    
    console.log(`Starting sync of ${queue.length} items`);
    
    // Sort by timestamp, oldest first
    const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
    
    // Process each item in the queue
    for (const item of sortedQueue) {
      try {
        switch (item.operation) {
          case 'create':
            console.log(`Syncing create operation for: ${item.data.english}`);
            
            const result = await saveToSupabase(item.data.english, item.data.ibono);
            
            if (!result.isDuplicate && result.data) {
              // Update local record with server ID
              if (item.data.local_id) {
                await updateLocalTranslation({
                  ...item.data,
                  id: result.data.id,
                  is_synced: true,
                  sync_status: 'synced',
                  created_at: result.data.created_at
                });
              }
            }
            
            // Remove from sync queue regardless of result
            await removeFromSyncQueue(item.id);
            break;
            
          case 'delete':
            if (item.data.id) {
              console.log(`Syncing delete operation for ID: ${item.data.id}`);
              await deleteFromSupabase(item.data.id);
            }
            
            // If there's a local ID, delete the local record too
            if (item.data.local_id) {
              await deleteLocalTranslation(item.data.local_id);
            }
            
            // Remove from sync queue
            await removeFromSyncQueue(item.id);
            break;
            
          // Add update case if needed in the future
            
          default:
            console.warn(`Unknown operation type: ${item.operation}`);
            await removeFromSyncQueue(item.id);
        }
      } catch (error) {
        console.error(`Error processing sync item ${item.id}:`, error);
        // We'll leave failed items in the queue for retry later
      }
    }
    
    console.log('Sync completed');
    
    // After processing the queue, refresh local data with latest from server
    const remoteTranslations = await getSupabaseTranslations();
    await syncLocalWithRemote(remoteTranslations);
    
  } catch (error) {
    console.error('Sync error:', error);
  } finally {
    isSyncing = false;
  }
};

// Sync local database with remote data
const syncLocalWithRemote = async (remoteTranslations: Translation[]): Promise<void> => {
  try {
    const localTranslations = await getLocalTranslations();
    
    // Map for quick lookups
    const remoteMap = new Map(remoteTranslations.map(t => [t.id, t]));
    const localMap = new Map(localTranslations.filter(t => t.id).map(t => [t.id!, t]));
    
    // Find items that are in remote but not in local or have differences
    for (const remote of remoteTranslations) {
      const local = localMap.get(remote.id);
      
      if (!local) {
        // New item, add to local
        await addLocalTranslation({
          id: remote.id,
          english: remote.english,
          ibono: remote.ibono,
          created_at: remote.created_at,
          is_synced: true,
          sync_status: 'synced'
        });
      } else {
        // Existing item, check if needs update
        // We could add logic here to check timestamps if we track modification times
      }
    }
    
    // Note: We don't delete local items not found in remote here
    // because they might be pending sync operations
    
  } catch (error) {
    console.error('Error syncing local with remote:', error);
    throw error;
  }
};
