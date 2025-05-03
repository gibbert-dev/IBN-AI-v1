import { 
  addToSyncQueue, 
  getSyncQueue, 
  removeFromSyncQueue,
  updateLocalTranslation,
  deleteLocalTranslation,
  addLocalTranslation,
  getLocalTranslations
} from "../indexedDbService";
import { 
  Translation,
  saveTranslation as saveToSupabase, 
  deleteTranslation as deleteFromSupabase, 
  getTranslations as getSupabaseTranslations,
  remoteToLocal
} from "../databaseUtils";
import { LocalTranslation } from "../indexedDbService";
import { checkOnlineStatus } from "./networkService";

let isSyncing = false;

// Sync with server when coming back online
export const syncWithServer = async (): Promise<void> => {
  if (isSyncing || !checkOnlineStatus()) return;
  
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
export const syncLocalWithRemote = async (remoteTranslations: Translation[]): Promise<void> => {
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
  } catch (error) {
    console.error('Error syncing local with remote:', error);
    throw error;
  }
};
