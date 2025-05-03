
/**
 * IndexedDB service for local storage of translations
 */

// Database configuration
const DB_NAME = 'ibnai_offline_db';
const DB_VERSION = 1;
const TRANSLATIONS_STORE = 'translations';
const SYNC_QUEUE_STORE = 'syncQueue';

export interface LocalTranslation {
  id?: number; // Optional for new items
  local_id?: number; // Local database ID
  english: string;
  ibono: string;
  created_at?: string;
  updated_at?: string;
  is_synced?: boolean;
  sync_status?: 'pending' | 'synced' | 'error';
  sync_error?: string;
}

export interface SyncQueueItem {
  id: number;
  operation: 'create' | 'update' | 'delete';
  data: LocalTranslation;
  timestamp: number;
  attempts: number;
}

// Initialize the database
export const initializeDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening IndexedDB');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create translations store
      if (!db.objectStoreNames.contains(TRANSLATIONS_STORE)) {
        const store = db.createObjectStore(TRANSLATIONS_STORE, { keyPath: 'local_id', autoIncrement: true });
        store.createIndex('id', 'id', { unique: false }); // Supabase ID
        store.createIndex('english', 'english', { unique: false });
        store.createIndex('is_synced', 'is_synced', { unique: false });
      }
      
      // Create sync queue store
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('operation', 'operation', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Get a database connection
export const getDbConnection = async (): Promise<IDBDatabase> => {
  try {
    return await initializeDb();
  } catch (error) {
    console.error('Failed to get DB connection:', error);
    throw error;
  }
};

// Add a translation to local database
export const addLocalTranslation = async (translation: LocalTranslation): Promise<LocalTranslation> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRANSLATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(TRANSLATIONS_STORE);
    
    // Add timestamps and sync status
    const translationWithMeta = {
      ...translation,
      created_at: translation.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_synced: false,
      sync_status: 'pending' as const
    };
    
    const request = store.add(translationWithMeta);
    
    request.onsuccess = () => {
      const local_id = request.result as number;
      resolve({ ...translationWithMeta, local_id });
    };
    
    request.onerror = () => {
      reject('Error adding translation to local database');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get all translations from local database
export const getLocalTranslations = async (): Promise<LocalTranslation[]> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRANSLATIONS_STORE], 'readonly');
    const store = transaction.objectStore(TRANSLATIONS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject('Error getting translations from local database');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Find a translation in local database
export const findLocalTranslation = async (english: string, ibono: string): Promise<LocalTranslation | null> => {
  const translations = await getLocalTranslations();
  
  // Look for exact match (both English and Ibọnọ)
  const exactMatch = translations.find(
    t => t.english.trim().toLowerCase() === english.trim().toLowerCase() && 
         t.ibono.trim().toLowerCase() === ibono.trim().toLowerCase()
  );
  
  if (exactMatch) return exactMatch;
  
  // Look for matching English only
  const englishMatch = translations.find(
    t => t.english.trim().toLowerCase() === english.trim().toLowerCase()
  );
  
  return englishMatch || null;
};

// Add an item to the sync queue
export const addToSyncQueue = async (item: Omit<SyncQueueItem, 'id' | 'attempts' | 'timestamp'>): Promise<number> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    
    const queueItem = {
      ...item,
      timestamp: Date.now(),
      attempts: 0
    };
    
    const request = store.add(queueItem);
    
    request.onsuccess = () => {
      resolve(request.result as number);
    };
    
    request.onerror = () => {
      reject('Error adding item to sync queue');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get all items from the sync queue
export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject('Error getting sync queue');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Remove an item from the sync queue
export const removeFromSyncQueue = async (id: number): Promise<void> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject('Error removing item from sync queue');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Update a local translation
export const updateLocalTranslation = async (translation: LocalTranslation): Promise<void> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRANSLATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(TRANSLATIONS_STORE);
    
    // Make sure we have a local_id
    if (!translation.local_id) {
      reject('Cannot update translation without local_id');
      return;
    }
    
    // Update timestamp
    const updatedTranslation = {
      ...translation,
      updated_at: new Date().toISOString()
    };
    
    const request = store.put(updatedTranslation);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject('Error updating translation in local database');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete a local translation
export const deleteLocalTranslation = async (localId: number): Promise<void> => {
  const db = await getDbConnection();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRANSLATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(TRANSLATIONS_STORE);
    const request = store.delete(localId);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject('Error deleting translation from local database');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};
